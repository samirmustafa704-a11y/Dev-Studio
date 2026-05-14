@echo off
REM Dev Studio - Setup Script (Windows)
REM Configures Git and prepares for contribution

echo.
echo 🚀 Dev Studio - Setup
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo ❌ Git is not installed!
  echo Please install Git from: https://git-scm.com/download/win
  pause
  exit /b 1
)

echo ✓ Git is installed
echo.

REM Get user input
set /p EMAIL="Enter your email: "
set /p NAME="Enter your name: "

if "%EMAIL%"=="" (
  echo ❌ Email is required!
  pause
  exit /b 1
)

if "%NAME%"=="" (
  echo ❌ Name is required!
  pause
  exit /b 1
)

REM Configure Git
echo.
echo Configuring Git...
git config --global user.email "%EMAIL%"
git config --global user.name "%NAME%"

REM Verify configuration
echo.
echo ✓ Git configured successfully!
echo.
echo Configuration:
echo   Email: %EMAIL%
echo   Name: %NAME%
echo.

REM Show next steps
echo Next steps:
echo 1. Set up authentication:
echo    - Personal Access Token: https://github.com/settings/tokens
echo    - SSH Key: https://github.com/settings/ssh/new
echo.
echo 2. Push your changes:
echo    - Run: push.bat
echo    - Or: git push -u origin main
echo.
echo 3. Create a Pull Request:
echo    - Go to: https://github.com/firstall31-dot/Dev-Studio
echo    - Click "Compare & pull request"
echo.

pause
