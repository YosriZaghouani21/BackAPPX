mkdir controllers
mkdir uploads
copy C:\Users\karam\Documents\GitHub\BackAPPX\index.js server.js
copy C:\Users\karam\Documents\GitHub\BackAPPX\api-generator\common\package.json package.json
copy C:\Users\karam\Documents\GitHub\BackAPPX\api-generator\common\README.md README.md
xcopy C:\Users\karam\Documents\GitHub\BackAPPX\routes routes /E /I /Y
xcopy C:\Users\karam\Documents\GitHub\BackAPPX\models models /E /I /Y
xcopy C:\Users\karam\Documents\GitHub\BackAPPX\middlewares middlewares /E /I /Y
call >> .gitignore echo node_modules
call >> .env echo PORT=your_port
call >> .env echo MONGO_URI=your_mongo_uri