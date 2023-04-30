REM Files
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\api_types\payment_api\index.js index.js
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\api_types\payment_api\package.json package.json
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\api_types\payment_api\README.md README.md
copy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\api_types\payment_api\.env .env
REM Folders
xcopy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\middleware middleware /E /I /Y
xcopy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\models models /E /I /Y
xcopy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\routes routes /E /I /Y
xcopy D:\SIM_ESPRIT\PIM\website-back\api-generator\common\utils utils /E /I /Y