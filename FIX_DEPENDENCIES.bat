@echo off
echo ========================================
echo   FinAssist Dependency Fix Script
echo ========================================
echo.
echo This will fix the FastAPI/Pydantic compatibility issue
echo.

cd finassist-backend

echo Step 1: Uninstalling conflicting packages...
pip uninstall -y fastapi pydantic uvicorn starlette

echo.
echo Step 2: Clearing pip cache...
pip cache purge

echo.
echo Step 3: Installing compatible versions...
pip install fastapi==0.109.2
pip install pydantic==2.6.1
pip install uvicorn[standard]==0.27.1
pip install python-multipart==0.0.17
pip install python-dotenv==1.0.0
pip install google-generativeai==0.8.6

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo Now you can run: START_BACKEND.bat
echo.
pause
