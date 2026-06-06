@echo off
echo Checking for process on port 8083...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8083') do (
    echo Found process using port 8083: PID %%a
    taskkill /F /PID %%a
    echo Process killed successfully
    goto :done
)

echo No process found on port 8083
echo Port is free!

:done
echo.
pause
