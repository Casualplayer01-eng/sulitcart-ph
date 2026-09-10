@echo off
title SulitCart PH - Demo Server (KEEP THIS WINDOW OPEN)
cd /d "%~dp0"
echo Starting SulitCart PH... browser opens in a few seconds.
echo KEEP THIS WINDOW OPEN while presenting. Closing it stops the site.
start "" cmd /c "ping -n 4 127.0.0.1 >nul && start http://localhost:5173"
call npm run dev
pause
