@echo off
title Gamer Shop - Backend Server
echo ==============================================
echo   Starting Gamer Shop Backend Server (Port 3000)
echo   Connecting to MongoDB: mongodb://127.0.0.1:27017/gamer_shop
echo ==============================================
cd /d "%~dp0\Server"
node index.js
pause
