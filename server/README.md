# 開発環境の初期化

**Python10以上**

## serverに移動します

```bash
cd server
```

## 仮想環境を整います

```bash
python -m venv venv
```

## 環境を有効にします

**Mac / Linux**
```bash
source ./venv/source/activate
```

**Windows**
```bash
source ./venv/source/activate.ps1
```

## パッケージをインスツールします

```bash
pip install -r requirements.txt
```

## 実行

```bash
uvicorn main:app --reload
```