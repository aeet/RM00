@echo off
where ent >nul 2>nul
if %errorlevel% equ 0 (
    echo ent installed
     ent generate ./domain/schema
) else (
    echo ent not install
    go install entgo.io/ent/cmd/ent
    ent generate ./domain/schema
)
