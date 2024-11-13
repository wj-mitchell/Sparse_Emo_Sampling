# A function to clean the data from Study 2 of Social Regulation / Dynamic Decisions

cleaner <- function(data_dir, timestamp_df){
  
  data_dir = "../data/"
  timestamp_df = "../components/video_breaks/timestamps.csv"
  
  # Load required libraries
  library(tidyverse)
  
  if (!dir.exists(data_dir)) {
    
    errorCondition("The data directory that you had provided could not be found. Please review and try again.")

  } 
  else {
    
    # List all files in this path
    files <- list.files(data_dir,pattern = "\\.csv$", full.names = TRUE)
    
    # Check if there are any .csv files
    if (length(files) < 1) {
      
      errorCondition("No .csv files could be detected in this directory. Please review and try again.")
      
    } 
    
    else {
        
      # Iterate through all possible files
      for (FILE in 1:length(files)){
        
        # Read in the data
        data <- files[FILE] %>% read.csv(na.strings = c("", " "))
        
        # Create a temporary dataframe to store individual differences measures
        df_temp <- data[(which(data$task == "Instr_IndDiffs") + 1):nrow(data), 
                        which(names(data) =="response")] %>%
          data.frame(response = .) %>%
          rbind(., NA) %>%
          mutate(vars = c("Age", "Gender", "Sex", "Race", "Marital_Status",
                          "EduYears", "Education", "Income", "Familiar", "AttnCheck", 
                          "Audio", "Difficulties", "Questions"),
                 response = c(response[1], response[2], response[2], response[3], response[4], 
                              response[5], response[6], response[6], response[7], response[8], 
                              response[9], response[10], response[10])) %>%
          mutate(response = case_when(
            vars == "Age" ~ str_extract(response, pattern = '(?<="Q0":")[^"]+'),
            vars == "Gender" ~ str_extract(response, pattern = '(?<="Gender_Identity":")[^"]+'),
            vars == "Sex" ~ str_extract(response, pattern = '(?<="Sex":")[^"]+'),
            vars == "Race" ~ str_extract(response, pattern = '(?<="Race":\\[")[^"]+'),
            vars == "Marital_Status" ~ str_extract(response, pattern = '(?<="Marital Status":")[^"]+'),
            vars == "EduYears" ~ str_extract(response, pattern = '(?<="Q0":")[^"]+'),
            vars == "Education" ~ str_extract(response, pattern = '(?<="Education":")[^"]+'),
            vars == "Income" ~ str_extract(response, pattern = '(?<="Income":")[^"]+'),
            vars == "Familiar" ~ response,
            vars == "AttnCheck" ~ str_extract(response, pattern = '(?<="Attention_Check":)\\d+'),
            vars == "Audio" ~ response,  # Directly use the value
            vars == "Difficulties" ~ str_extract(response, pattern = '(?<="Q0":")[^"]+'),
            vars == "Questions" ~ str_extract(response, pattern = '(?<="Q1":")[^"]+'),
            TRUE ~ response # If no match, keep the original
          ))
        
        
        # Clean and transform the data
        df <- data %>%
          
          # Mutate time elapsed to capture how long trials lasted in seconds
          mutate(trial_elapsed = (c(time_elapsed[1], diff(time_elapsed)))/1000) %>%
          
          # Filter rows based on patterns in the 'task' column
          filter(str_detect(task, "video") | 
                   str_detect(task, "assessment")) %>%
          
          # Creating new columns for segment, question order, break times, and demographic questions 
          mutate(segment = task,
                 order = task,
                 break_time = trial_elapsed) %>%
          
          # Filter rows based on patterns in the 'task' column
          filter(str_detect(task, "video") | 
                   str_detect(task, "assessment")) %>%
          
          # Replace "assessment *" strings with NA
          mutate(segment = str_replace(segment, "assessment.*", NA_character_)) %>%
          
          # Fill NA values downwards from the previous non-NA value
          fill(segment, .direction = "down") %>% 
          
          # Correcting segments so that they are numeric
          mutate(segment = str_replace(segment, "video", "") %>% as.numeric()) %>%
          
          # Select relevant columns
          select(subject_id, break_id, trial_elapsed, time, segment, order, rt,
                 response, slider_start, character, label_condition) %>% 
          
          # Adding NA for videos
          mutate(order = gsub("video [0-9]$", NA, order)) %>%
          
          # Removing assessment string
          mutate(order = gsub("assessment ", "", order)) %>%
          
          # Converting assessment to numeric
          suppressWarnings(mutate(order = as.numeric(order)))
        
        # Replacing all nulls with N/As
        df <- data.frame(lapply(df, function(x) {replace(x, x == "null", NA)}))
        
        # Adding a new column to differentiate ratings and videos
        df$type <- "Rating"
        df$type[is.na(df$order)] <- "Video"
        
        # Combining the dataframes 
        for(i in 1:nrow(df_temp)) {
          col_name <- df_temp$vars[i]
          col_value <- df_temp$response[i]
          df[[col_name]] <- col_value
        }
        
        # Cleaning the space
        rm(i, col_name, col_value, df_temp)
        
        # If this is the first iteration ...
        if (FILE == 1) {
          
          # Create a master dataframe to store all data in based upon the first dataframe
          df_master <- df
          
        } else {
          
          # Otherwise append to the end
          df_master <- rbind(df_master, df)
          
        }
      }
      
      # If the timestamp file doesn't exist
      if (!file.exists(timestamp_df)){
        
        "No .csv file was found at the path listed for timestamp_df. Please review and try again!"
        
      } else {
        
        # Reading in the timestamp dataframe
        df_timestamp <- read.csv(timestamp_df, row.names = 1)
        names(df_timestamp) <- str_replace_all(names(df_timestamp), 
                                               pattern = "DH.",
                                               replacement = "DH-")
        
        # Creating an empty column
        df_master$breaks <- NA
        
        # Iterating through all possible break IDs
        for (ID in unique(df_master$break_id)){
          
          # Saving the breaks for that subject as a separate variable
          breaks <- df_timestamp[,which(names(df_timestamp) == ID)]
          
          # Iterating through each of these breaks
          for (BREAK in 1:length(breaks)){
            
            # Saving the break for that segment and subject to the dataframe
            df_master$breaks[df_master$break_id == ID & as.numeric(df_master$segment) == (BREAK - 1)] <- breaks[BREAK]
            
          }
        }
        
        # Restructuring variables
        df_master <- df_master %>% mutate(segment = as.numeric(segment), order  = as.numeric(order), response  = as.numeric(response), 
                                          slider_start  = as.numeric(slider_start), breaks  = as.numeric(breaks)) %>% suppressWarnings()
        
        # Flipping condition B responses
        df_master$response[df_master$label_condition == "B" & !is.na(df_master$response)] <- df_master$response[df_master$label_condition == "B" & !is.na(df_master$response)] * -1
        df_master$slider_start[df_master$label_condition == "B" & !is.na(df_master$slider_start)] <- df_master$slider_start[df_master$label_condition == "B" & !is.na(df_master$slider_start)] * -1

        # Once finished iterating, return the master_dataframe
        return(df_master)
      }
    }
  }
}
