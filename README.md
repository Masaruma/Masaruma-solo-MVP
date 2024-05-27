# Masaruma-solo-MVP

<div id="top"></div>

</p>

# 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [環境構築](#環境構築)
4. [テーブル一覧](#テーブル一覧)
5. [ディレクトリ構成](#ディレクトリ構成)
6. [今後の展望](#今後の展望)

<!-- プロジェクト名を記載 -->

# プロジェクト名

solo-MVP-ソロ神経衰弱

<!-- プロジェクトについて -->

# プロジェクトについて

ひとり遊び用神経衰弱ゲームです。表面の絵柄はいらすとや、ポケモンです。
マス目は 3✖️4、4✖️5、6✖️8 から選ぶことができます！

いらすとやは 20 枚の絵柄からランダム、ポケモンは 1024 匹からランダムで表示されます。

ルールはクリアまでにかかった手数のスコアが少ない人が勝ちです。

<p align="right">(<a href="#top">トップへ</a>)</p>

# 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

## 使用技術一覧

<!-- シールド一覧 -->
<!-- 該当するプロジェクトの中から任意のものを選ぶ-->
<p style="display: inline">
  <!-- フロントエンドのフレームワーク一覧 -->
<img src="https://img.shields.io/badge/-Html5-E34F26.svg?logo=html5&style=plastic">
<img src="https://img.shields.io/badge/-Css3-1572B6.svg?logo=css3&style=plastic">
<img src="https://img.shields.io/badge/-Javascript-F7DF1E.svg?logo=javascript&style=plastic">
<img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&style=plastic">
  <!-- バックエンドのフレームワーク一覧 -->
  <!-- バックエンドの言語一覧 -->
  <img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=plastic">
  <img src="https://img.shields.io/badge/-Postgresql-336791.svg?logo=postgresql&style=plastic">

| 言語・フレームワーク | バージョン |
| -------------------- | ---------- |
| PostgreSQL           | 14.12      |
| Node.js              | 20.12.1    |
| React                | 18.3.1     |

フロントエンドは React を利用、バックエンドサーバーは node.js の express、knex を利用しています。
データベースは PostgreSQL です

その他のパッケージのバージョンは package.json を参照してください

<p align="right">(<a href="#top">トップへ</a>)</p>

# 環境構築

<!-- コンテナの作成方法、パッケージのインストール方法など、開発環境構築に必要な情報を記載 -->

ダウンロードしたファイル群の frontend ディレクトリと backend ディレクトリで下記コマンドを実行して必要モジュールをインストールしてください！

```
npm i
```

## .env ファイルの作成

backend ディレクトリ直下に.env ファイルを作成してください！
├── backend
│ ├── .env

.env には下記をコピーし貼り付けてください。
POSTGRES_USER と POSTGRES_PASSWORD は自身のものに置き換えをお願いします。

```
POSTGRES_USER=user
POSTGRES_PASSWORD=
POSTGRES_DB=card_game
POSTGRES_PORT=5432
POSTGRES_HOST=127.0.0.1
```

## データベースの作成

次に backend ディレクトリでデータベースの作成を行います。カレントディレクトリが backend であることを確認してからコマンドを実行してください！

```
echo "CREATE DATABASE card_game;" | psql
```

psql で card_game スキーマが作成されていれば成功です！

## マイグレーションファイルの実行

カレントディレクトリが backend であることを確認してマイグレーションファイルを実行します。その後シードファイルの実行も行なってください。

```
npm run migrate-latest
```

```
npm run seed-data
```

psql の card_game スキーマにて\dt コマンドでテーブルが挿入されていれば成功です！

## 動作確認

### フロントエンドアプリの動作確認

カレントディレクトリが frontend なのを確認後下記のコマンドを実行し react サーバーを立ち上げてください

```
npm run dev
```

http://localhost:5173/ にアクセスし、神経衰弱ゲームが表示されていれば成功です。
この時点ではサーバーと繋がっていないためランキングは表示されません。ブラウザは http://localhost:5173/ にアクセスしたままにしておいてください。

### バックエンドアプリの動作確認

次にカレントディレクトリが backend なのを確認後下記のコマンドを実行し express サーバーを立ち上げてください

```
npm run dev
```

その状態で http://localhost:5173/ のリロードをかけるとランキングが表示されます。

# テーブル一覧

`pk` = Primary Key
`ref: >` = Many to one
`ref: <` = One to many
`ref: -` = One to one

## users Table

```
Table users {
  id id [pk]
  user varchar(32) [not null]
}
```

## irasutoya score Table

```
Table irasutoya_score {
  id id [pk]
  user_id id [ref: - users.id, not null]
  date date
  score decimal(32,2)
}
```

## irasutoya score Table

```
Table pokemon_score {
  id id [pk]
  user_id id [ref: - users.id, not null]
  date date
  score decimal(32,2)
}
```

# ディレクトリ構成

<!-- Treeコマンドを使ってディレクトリ構成を記載 -->

❯ tree -I "node_modules|dist"
.
├── README.md
├── backend
│ ├── docs
│ ├── package-lock.json
│ ├── package.json
│ ├── src
│ │ ├── db
│ │ │ ├── data
│ │ │ │ ├── migrations
│ │ │ │ │ ├── 20240525183529_create_user_table.js
│ │ │ │ │ └── 20240526093744_create_irasutoyaScore_table.js
│ │ │ │ └── seeds
│ │ │ │ ├── 001-sample_users.js
│ │ │ │ └── 002-sample_irasutoya.js
│ │ │ ├── index.js
│ │ │ └── knexfile.js
│ │ ├── model
│ │ │ └── modelAndController.js
│ │ └── server
│ │ ├── index.js
│ │ └── server.js
│ └── test
│ └── server.spec.cjs
└── frontend
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── public
│ ├── images
│ │ ├── animal_chara_radio_buta.png
│ │ ├── animal_yukata_dog.png
│ │ ├── card_back.png
│ │ ├── cooking_tousyoumen.png
│ │ ├── fashion_jinbei.png
│ │ ├── fashion_jinbei_woman.png
│ │ ├── illustkun-01477-back-of-cards.png
│ │ ├── job_chocolatier_man.png
│ │ ├── komebukuro_apron_woman.png
│ │ ├── ofuro_sauna_neppashi_woman.png
│ │ ├── opera_singer_man.png
│ │ └── tsundere_girl.png
│ └── vite.svg
├── src
│ ├── App.css
│ ├── App.jsx
│ ├── assets
│ │ └── react.svg
│ ├── components
│ │ ├── Card.jsx
│ │ ├── GameMain.jsx
│ │ ├── Input.jsx
│ │ └── Ranking.jsx
│ ├── index.css
│ └── main.jsx
└── vite.config.js

<p align="right">(<a href="#top">トップへ</a>)</p>

# 今後の展望

1. ゲームモードの追加
    1. DIG メンバーの顔写真と名前モード
    2. 他画像 API との連携モード
    3. 100✖️100 モード
    4. WEBSOCKET の実施による 2 人対戦、複数人対戦
2. リファクタリング
    1. ゲーム切り替えボタンでのゲームのリセット
    2. コードを分散し手入れしやすくする
    3. React の単一責任に準拠させる
    4. TypeScript での実装
3. 実装

    1. Swift で書き直し ios で使えるようにする

<p align="right">(<a href="#top">トップへ</a>)</p>
