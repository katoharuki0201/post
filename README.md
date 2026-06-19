# アプリ起動手順

## バックエンド(Laravel)

バックエンドは `api` ディレクトリにあります。

```bash
cd api
```

### 1. パッケージのインストール

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

## フロントエンド(React + Vite)

フロントエンドは `web` ディレクトリにあります。

```bash
cd web
```

### 1. パッケージのインストール

**npm を使う場合:**

```bash
npm install
```

**bun を使う場合:**

```bash
bun install
```

### 2. 開発サーバーの起動

**npm を使う場合:**

```bash
npm run dev
```

**bun を使う場合:**

```bash
bun run dev
```

デフォルトでは以下で起動します。

```
http://localhost:5173
```