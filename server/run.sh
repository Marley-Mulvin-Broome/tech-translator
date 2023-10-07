#!/bin/bash

if [ -z "$(which python)" ]; then
    echo "Pythonがインストールされていません。"
    exit 1
fi

if [ -z "$(which pip)" ]; then
    echo "pipがインストールされていません。"
    exit 1
fi

pip install -r requirements.txt

uvicorn app.main:app --reload