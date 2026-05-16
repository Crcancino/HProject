@echo off
setlocal
REM Cambia estos valores si tu cuenta/region son distintos
set DOMAIN_NAME=crcancinosandbox.click
set HOSTED_ZONE_NAME=crcancinosandbox.click

npm install
npm run build
npm --workspace infra run deploy -- -c domainName=%DOMAIN_NAME% -c hostedZoneName=%HOSTED_ZONE_NAME%
endlocal
