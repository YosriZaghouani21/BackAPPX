REM Files
copy C:\Users\karam\Documents\GitHub\BackAPPX\api-generator\common\api_types\crud_api\index.js index.js
copy C:\Users\karam\Documents\GitHub\BackAPPX\api-generator\common\api_types\crud_api\package.json package.json
copy C:\Users\karam\Documents\GitHub\BackAPPX\api-generator\common\api_types\crud_api\README.md README.md
REM Folders
xcopy /E /I /Y D:\SIM_ESPRIT\PIM\website-back\api-generator\common\middleware middleware
xcopy /E /I /Y D:\SIM_ESPRIT\PIM\website-back\api-generator\common\utils utils
mkdir models
mkdir routes
REM Files in models
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\models\user.js models\user.js
REM Files in routes
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\routes\login.js routes\login.js
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\routes\register.js routes\register.js