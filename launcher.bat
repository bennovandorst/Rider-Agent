@echo off
cd "C:\Rider-Agent"
call git pull
call npm install
call npm start
