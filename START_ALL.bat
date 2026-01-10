@echo off
echo ====================================
echo FIFA Match Tracker - Baslatma
echo ====================================
echo.
echo Bu script 2 terminal acacak:
echo 1. Backend (http://localhost:3000)
echo 2. Frontend (http://localhost:5173)
echo.
echo Terminal'leri manuel kapatmak icin Ctrl+C kullanin
echo.
pause

echo Backend baslatiliyor...
start "Backend Server" cmd /k "cd /d C:\Users\umut\Desktop\TODOGAME && npm run dev"

timeout /t 3 /nobreak >nul

echo Frontend baslatiliyor...
start "Frontend Server" cmd /k "cd /d C:\Users\umut\Desktop\TODOGAME\frontend && npm run dev"

echo.
echo ====================================
echo Her iki server baslatildi!
echo ====================================
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Terminal'leri kapatmak icin Ctrl+C
pause

