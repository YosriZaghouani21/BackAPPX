#!/bin/bash

mkdir controllers
mkdir uploads
cp /mnt/c/Users/karam/Documents/GitHub/BackAPPX/index.js server.js
cp /mnt/c/Users/karam/Documents/GitHub/BackAPPX/package.json package.json
rsync -avz --exclude='node_modules' --exclude='.idea' /mnt/c/Users/karam/Documents/GitHub/BackAPPX/routes routes
rsync -avz --exclude='node_modules' --exclude='.idea' /mnt/c/Users/karam/Documents/GitHub/BackAPPX/models models
rsync -avz --exclude='node_modules' --exclude='.idea' /mnt/c/Users/karam/Documents/GitHub/BackAPPX/middlewares middlewares
echo "node_modules" >> .gitignore
echo ".idea" >> .gitignore
echo "PORT=your_port" >> .env
echo "MONGO_URI=your_mongo_uri" >> .env