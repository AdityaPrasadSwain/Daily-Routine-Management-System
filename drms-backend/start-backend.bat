@echo off
echo ========================================
echo DRMS Backend Startup Script
echo ========================================
echo.

echo Step 1: Checking for process on port 8084...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8084') do (
    echo Found process using port 8084: PID %%a
    echo Killing process...
    taskkill /F /PID %%a
    echo Process killed successfully
    goto :clean
)
echo Port 8084 is free
echo.

:clean
echo Step 2: Cleaning Maven build...
call mvn clean
if %ERRORLEVEL% NEQ 0 (
    echo Maven clean failed!
    pause
    exit /b 1
)
echo Maven clean completed successfully
echo.

echo Step 3: Starting Spring Boot application...
echo Application will start on port 8084
echo Press Ctrl+C to stop the application
echo.
set MAVEN_OPTS=-Xms1g -Xmx2g
call mvn spring-boot:run
