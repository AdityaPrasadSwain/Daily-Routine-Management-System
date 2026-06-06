@echo off
echo Starting app... > startup.log
java -jar target/drms-backend-0.0.1-SNAPSHOT.jar --server.port=8083 >> startup.log 2>&1
