@echo off
REM Initialize Git in your project directory (if you haven't already)
git init
REM Add your files to the staging area
git branch -M main
REM Gitingore
copy C:\Users\karam\Documents\GitHub\BackAPPX\api-generator\common\.gitignore .gitignore
REM Add your changes to the staging area
git add .