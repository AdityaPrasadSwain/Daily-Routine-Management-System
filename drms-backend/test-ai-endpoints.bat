@echo off
echo ========================================
echo DRMS AI Endpoint Test Script (Port 8084)
echo ========================================
echo.

set BASE_URL=http://localhost:8084/api
set TOKEN=YOUR_JWT_TOKEN_HERE

echo 1. Testing AI Goal Suggestion...
curl -X POST %BASE_URL%/ai/goals/suggest ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"title\": \"Learn Java\", \"description\": \"I want to learn Java programming\"}"
echo.
echo.

echo 2. Testing AI Task Breakdown...
curl -X POST %BASE_URL%/ai/tasks/breakdown ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"goalTitle\": \"Build a Website\", \"deadline\": \"2023-12-31\"}"
echo.
echo.

echo 3. Testing AI Daily Review...
curl -X GET %BASE_URL%/ai/review/daily ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo 4. Testing AI Alarm Message...
curl -X POST %BASE_URL%/ai/alarms/message ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"taskTitle\": \"Morning Workout\", \"time\": \"07:00\", \"alarmType\": \"Wake Up\"}"
echo.
echo.

echo ========================================
echo Tests Completed
echo ========================================
pause
