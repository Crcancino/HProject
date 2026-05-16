@echo off
setlocal
npm install
npm run build
npm --workspace infra run deploy
endlocal
