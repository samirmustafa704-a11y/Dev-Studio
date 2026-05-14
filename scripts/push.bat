@echo off
REM Dev Studio - Push Changes Script (Windows)
REM This script helps you push changes to GitHub

echo.
echo 🚀 Dev Studio - Push Changes
echo.

REM Check if git is configured
for /f "tokens=*" %%i in ('git config --global user.email') do set EMAIL=%%i
for /f "tokens=*" %%i in ('git config --global user.name') do set NAME=%%i

if "%EMAIL%"=="" (
  echo ❌ Git not configured!
  echo.
  echo Please configure Git first:
  echo   git config --global user.email "your-email@example.com"
  echo   git config --global user.name "Your Name"
  pause
  exit /b 1
)

echo ✓ Git configured as: %NAME% ^<%EMAIL%^>
echo.

REM Check for pending commits
for /f %%i in ('git log --oneline origin/main..main ^| find /c /v ""') do set COMMITS=%%i

if "%COMMITS%"=="0" (
  echo ✓ No pending commits to push
  exit /b 0
)

echo 📊 Pending commits: %COMMITS%
echo.
echo Recent commits:
git log --oneline -5
echo.

REM Ask for confirmation
set /p CONFIRM="Push these commits to GitHub? (y/n) "
if /i not "%CONFIRM%"=="y" (
  echo Cancelled.
  exit /b 1
)

REM Push changes
echo.
echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
  echo.
  echo ✅ Successfully pushed to GitHub!
  echo.
  echo Next steps:
  echo 1. Go to: https://github.com/firstall31-dot/Dev-Studio
  echo 2. Create a Pull Request
  echo 3. Add description of changes
  echo 4. Submit for review
) else (
  echo.
  echo ❌ Push failed!
  echo.
  echo Troubleshooting:
  echo 1. Check your internet connection
  echo 2. Verify GitHub credentials
  echo 3. See CONTRIBUTE_SETUP.md for authentication help
)

pause
