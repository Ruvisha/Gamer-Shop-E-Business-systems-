@echo off
title Gamer Shop - Full Stack Launcher
echo ==============================================
echo   Starting Gamer Shop Full Stack Application
echo ==============================================

echo [1/2] Starting Backend Server on port 3000...
start "Gamer Shop - Backend Server" cmd /k "cd /d %~dp0\Server && node index.js"

echo [2/2] Starting Frontend Client on port 5173...
start "Gamer Shop - Frontend Client" cmd /k "cd /d %~dp0\Client && npm run dev"

echo.
echo Both servers are launching!
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo ==============================================
