@echo off
cd /d C:\Users\USER\spendwise\server
start "Backend" cmd /k ""C:\Program Files\nodejs\node.exe" node_modules\ts-node\dist\bin.js src/index.ts"
cd /d C:\Users\USER\spendwise\client
start "Frontend" cmd /k ""C:\Program Files\nodejs\node.exe" node_modules\vite\bin\vite.js"