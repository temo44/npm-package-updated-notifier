if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off
cd "C:\projects\tmp\notifier"

start /min cmd /C "node index.js"
goto :EOF
:minimized