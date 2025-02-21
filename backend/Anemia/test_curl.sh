#!/bin/bash

# URL of the Flask API
URL="http://127.0.0.1:5000/predict"

# Path to the image file to be tested
IMAGE_PATH="path/to/your/image.jpg"

# Perform the curl request
curl -X POST "$URL" -F "file=@$IMAGE_PATH"
