# Masaruma-solo-MVP


# 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [環境構築](#環境構築)
4. [テーブル一覧](#テーブル一覧)
5. [今後の展望](#今後の展望)



# プロジェクト名

solo-MVP-ソロ神経衰弱

# プロジェクトについて

ひとり遊び用神経衰弱ゲームです。表面の絵柄はいらすとや、ポケモンです。
マス目は 3✖️4、4✖️5、6✖️8 10*10 から選ぶことができます！

いらすとやは 50 枚の絵柄からランダム、ポケモンは 1025 匹からランダムで表示されます。

ルールはクリアまでにかかった手数のスコアが少ない人が勝ちです。


# 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

## 使用技術一覧

<!-- シールド一覧 -->
<!-- 該当するプロジェクトの中から任意のものを選ぶ-->

[//]: # (<p style="display: inline">)

[//]: # (  <!-- フロントエンドのフレームワーク一覧 -->)

[//]: # (<img src="https://img.shields.io/badge/-Html5-E34F26.svg?logo=html5&style=plastic">)

[//]: # (<img src="https://img.shields.io/badge/-Css3-1572B6.svg?logo=css3&style=plastic">)

[//]: # (<img src="https://img.shields.io/badge/-Javascript-F7DF1E.svg?logo=javascript&style=plastic">)

[//]: # (<img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&style=plastic">)

[//]: # (  <!-- バックエンドのフレームワーク一覧 -->)

[//]: # (  <!-- バックエンドの言語一覧 -->)

[//]: # (  <img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=plastic">)

[//]: # (  <img src="https://img.shields.io/badge/-Postgresql-336791.svg?logo=postgresql&style=plastic">)

| 言語・フレームワーク | バージョン  |
|------------|--------|
| PostgreSQL | 15.x   |
| Node.js    | 22.x   |
| React      | 19.x   |
| JVM        | 1.9.25 |
| Java       | 21     |
| SpringBoot | 3.4.4  |

フロントエンドは React を利用、バックエンドサーバーは springboot:kotlin:gradle
データベースは PostgreSQL です

その他のパッケージのバージョンは package.json を参照してください


# 環境構築

## 方法1 
#### コンテナの起動
DBを作成するためにコンテナを起動します

```
make docker-compose-up:
```

#### バックエンドの起動
backend ディレクトリ直下の.envSampleをコピーし.envを作成 。backendディレクトリ で
```
./gradlew bootrun
```

#### フロントエンドアプリの動作確認
カレントディレクトリが frontend なのを確認後下記のコマンドを実行し react サーバーを立ち上げてください
```
npm i
npm run dev
```

http://localhost:5173/ にアクセスし、神経衰弱ゲームが表示されていれば成功です。

## 方法2 Dockerイメージによる起動
上記の手順ができない場合
ルートディレクトリで下記コマンドを実行
```
make docker-compose-up:
make docker-build
make docker-local-run
```

# テーブル一覧

`pk` = Primary Key
`ref: >` = Many to one
`ref: <` = One to many
`ref: -` = One to one


```
Table users {
  id id [pk]
  name varchar(32) [not null]
}
```

```
Table score {
  id id [pk]
  created_at date
  updated_at date
  game_score INT
  user_id id [ref: - users.id, not null]
  game_mode_id [ref: > game_modes.id, not null]
  game_level_id [ref: > game_level.id, not null]
}
```


```
Table game_modes {
  id id [pk]
  game_name varchar(32)
}
```
```
Table game_level {
  id id [pk]
  level INT
}
```



# 今後の展望

1. ゲームモードの追加
    1. DIG メンバーの顔写真と名前モード
    2. 他画像 API との連携モード
    3. WEBSOCKET の実施による 2 人対戦、複数人対戦
    4. ログイン機能の実装
2. リファクタリング
    1. ~~ゲーム切り替えボタンでのゲームのリセット~~
    2. コードを分散し手入れしやすくする
    3. React の単一責任に準拠させる
    4. ~~TypeScript での実装~~
   5. CASSでの実装もしくはshadn cn
   6. 
3. 実装

    1. Swift で書き直し ios で使えるようにする
   2.  ~~Herokuへのデプロイと独自ドメインの取得~~
   3. AWSへのデプロイ
   4. Unityを埋め込んだページ

