@echo off
REM Start script for backend (Windows)

echo Starting Deadstock & Asset Management System Backend...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Initialize database
echo Initializing database...
python seed_data.py

REM Start server
echo.
set PORT_DEFAULT=8000
if not "%PORT%"=="" (
    set SERVER_PORT=%PORT%
) else (
    set SERVER_PORT=%PORT_DEFAULT%
)
echo Starting FastAPI server on http://localhost:%SERVER_PORT%
echo API docs available at http://localhost:%SERVER_PORT%/docs
echo.
uvicorn app.main:app --reload --port %SERVER_PORT%

