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

ruff check --fix ./app/**/*.py
black ./app/**/*.py
