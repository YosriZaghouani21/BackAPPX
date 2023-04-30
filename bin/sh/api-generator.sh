#!/bin/bash
/d/SIM_ESPRIT/PIM/website-back/
mkdir controllers
mkdir uploads
cp /mnt/d/SIM_ESPRIT/PIM/website-back/index.js server.js
cp /mnt/d/SIM_ESPRIT/PIM/website-back/package.json package.json
rsync -avz --exclude='node_modules' --exclude='.idea' /mnt/d/SIM_ESPRIT/PIM/website-back/routes routes
rsync -avz --exclude='node_modules' --exclude='.idea' /mnt/d/SIM_ESPRIT/PIM/website-back/models models
rsync -avz --exclude='node_modules' --exclude='.idea' /mnt/d/SIM_ESPRIT/PIM/website-back/middlewares middlewares
echo "node_modules" >> .gitignore
echo ".idea" >> .gitignore
echo "PORT=your_port" >> .env
echo "MONGO_URI=your_mongo_uri" >> .env