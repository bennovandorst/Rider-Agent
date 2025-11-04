@echo off
cd /d "C:\Rider-Agent"
call git pull
call npm install
start node src/index.js
if not "%~1"=="" start "" %*
exit
