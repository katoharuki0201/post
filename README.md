# アプリ起動手順

## Laravel

### 1. Composer パッケージのインストール

```bash
composer install
```

### 2. 環境変数ファイルの作成

`.env.example` をコピーして `.env` を作成します。

```bash
cp .env.example .env
```

### 3. アプリケーションキーの生成

```bash
php artisan key:generate
```

### 4. データベースの作成

`.env` に設定したデータベースを作成します。

### 5. マイグレーションの実行

```bash
php artisan migrate
```

### 6. API サーバーの起動

```bash
php artisan serve
```

デフォルトでは以下で起動します。

```
http://localhost:8000
```