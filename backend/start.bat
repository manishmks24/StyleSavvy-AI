@echo off
REM StyleSavvy AI - Backend Startup Script
REM This script starts the Python Flask backend server

echo ========================================
echo   StyleSavvy AI - Backend Server
echo ========================================
echo.

REM Check if we're in the backend directory
if not exist "app.py" (
    echo Error: app.py not found!
    echo Please run this script from the backend directory.
    echo.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://python.org
    echo.
    pause
    exit /b 1
)

echo Python version:
python --version
echo.

REM Check if virtual environment exists
if exist "venv\" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    echo.
) else (
    echo No virtual environment found.
    echo Recommendation: Create one with 'python -m venv venv'
    echo.
)

REM Check if requirements are installed
echo Checking dependencies...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo.
    echo Warning: Flask not found!
    echo Installing dependencies from requirements.txt...
    echo.
    pip install -r requirements.txt
    if errorlevel 1 (
        echo.
        echo Error: Failed to install dependencies!
        echo Please run: pip install -r requirements.txt
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.
echo Server will be available at: http://localhost:5000
echo.
echo API Endpoints:
echo   - GET  /health
echo   - POST /api/color-recommendations
echo   - POST /api/predict-outfit-colors
echo   - GET  /api/dataset-info
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Start the Flask server
python app.py

REM If server exits
echo.
echo Server stopped.
pause
