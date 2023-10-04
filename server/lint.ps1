# Check if Ruff is installed
if (-Not (Test-Path (Get-Command ruff -ErrorAction SilentlyContinue))) {
  Write-Host "Ruffをインストールしてください"
  exit 1
}

# Check if Black is installed
if (-Not (Test-Path (Get-Command black -ErrorAction SilentlyContinue))) {
  Write-Host "Blackをインストールしてください"
  exit 1
}

ruff check --fix ./*.py
black ./*.py

This PowerShell script does the same checks as the original shell script but uses PowerShell syntax and cmdlets to achieve the same functionality. Please make sure that you have PowerShell installed on your system to run this script.
