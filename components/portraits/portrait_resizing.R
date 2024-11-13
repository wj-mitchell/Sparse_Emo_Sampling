library(magick)

# Get a list of all PNG files in the directory
png_files <- list.files('components/portraits/', pattern = "\\.PNG$", full.names = TRUE)

# Loop through each file and resize
for (file in png_files) {
  
  # Read the image
  img <- image_read(file)
  
  # Resize the image to 800x800 pixels
  img_resized <- image_resize(img, "800x800")
  
  # Save the resized image back to the directory (overwrite original file)
  image_write(img_resized, path = file)
}