# Dependencies
library(here)
library(tidyverse)
source("cleaner_function.R", local = T)


# Defining file paths
df <- cleaner(data_dir = "../data/", 
              timestamp_df = "../components/video_breaks/timestamps.csv")

# Visualizing
df %>%
filter(!is.na(response)) %>%
ggplot(data = ., mapping = aes(x = breaks, y = response, color = character)) +
  geom_smooth(method = 'loess', alpha = 0) +
  theme_classic() +
  labs(title = "Average Character Ratings Over Time", x = "Time (s)", y = "Rating (Guilty versus Innocent)")

sample <- sample(x = unique(df$break_id), size = 6) 
df %>%
  filter(break_id %in% sample) %>%
  filter(!is.na(response)) %>%
  ggplot(data = ., mapping = aes(x = breaks, y = response, color = character)) +
  geom_smooth(method = 'loess', alpha = 0) +
  theme_classic() +
  labs(title = "Participant's Character Ratings Over Time", x = "Time (s)", y = "Rating (Guilty versus Innocent)") +
  facet_wrap(~ break_id, ncol = 3)
