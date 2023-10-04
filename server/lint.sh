
# Ruffがインストールされているか
if ! type ruff >/dev/null 2>&1; then
  echo "Ruffをインストールしてください"
  exit 1
fi

# Blackがインストールされているか
if ! type black >/dev/null 2>&1; then
  echo "Blackをインストールしてください"
  exit 1
fi

ruff check --fix ./*.py
black ./*.py