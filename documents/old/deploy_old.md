# サーバー構成図

フロントエンド：React/Node.js
バックエンド：Express/Node.js
データベース：MySQL

フロントーバック間のやりとりはユーザが利用する部分とAPIとのやりとり
バックーDB間のやりとりは呼び出されたAPIの処理とDB更新・取得のやりとり

図に起こすと以下
```
+-----------------------+
|         ユーザ        |
+-----------------------+
         ⇕
  (ユーザが閲覧する部分のやりとり)
+-----------------------+
|   フロントエンド      |
|   React/Node.js       |
+-----------------------+
         ⇕
      (API処理)
+-----------------------+
|   バックエンド        |
|   Express/Node.js     |
+-----------------------+
         ⇕
 (バックーDB間のやりとり)
+-----------------------+
|      データベース     |
|         MySQL         |
+-----------------------+

```

# 環境構築
※WSL-Ubuntu環境を想定  
前提としてこのレポジトリはクローンされているものとする。  
→``git clone https://github.com/Lit-to/LitTimeline.git``  

## フロントサーバー環境構築
※LitTimelineディレクトリ上(りっとーのPC環境では``/home/lit-to/LitTimeline``)  
1.  npmのインストール ``sudo apt install npm``
2.  プロジェクトディレクトリに移動 ``cd litter``
3.  必要ツールのインストール ``npm install 18``
4.  デプロイ ``npm start``
5.  これで以下のように表示されればOK!
```

> litter@0.0.0 dev
> vite


  VITE v6.1.0  ready in 95 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
6.  最後にブラウザでLocal:に書かれているlocalhostにアクセスすればOK！(デフォルトの場合はたぶん[こちら]( http://localhost:5173 ))
-   この時点でデプロイに失敗した場合は[開発メモ](/note.md)を参照。

## バックエンドサーバー環境構築
※LitTimelineディレクトリ上(りっとーのPC環境では``/home/lit-to/LitTimeline``)
1.  ``npm install express -g``
2.  ``npm install express-generator -g``

> ``express litter-app``(本来はここでプロジェクト作成。ただしクローンした場合はこの手順をしなくてOKなはず)

3.  ``cd litter-app``
4.  ``npm install``
    -  このとき、何度か``npm audit fix --force``を求められることがある。
    -  **found 0 vulnerability**と出てくるまで実行する(3回程度実行する可能性アリ)。
5.  ``npm start``
6.  [localhost:3000](http://localhost:3000)にアクセス。
    -   Express Welcome to Expressのように表示されればOK

基本的にはここまででデプロイ完了。  
ただ、今後りっとーが開発するにあたりどの部分を編集するべきかを知るために``litter-app/routes/server.js``を作った。  
テスト時は``node <対象ファイル.js>``等と実行する。  
※LitTimelineディレクトリ上(りっとーのPC環境では``/home/lit-to/LitTimeline``)
-   ``node litter-app/routes/server.js``
    -   →``Server running at http://localhost:3000``とターミナルに表示されればOK。
-   [localhost:3000](http://localhost:3000)にアクセス。
    -   **Hello World!** と表示されればOK。

## DBサーバー環境構築
### インストール

1.  パッケージ情報を更新 ``sudo apt update``
2.  mysqlのインストール ``sudo apt install mysql-server-8.0 -f``
3.  入ったかどうかを確認 ``mysql --version``
    -   ``mysql  Ver 8.0.41-0ubuntu0.22.04.1 for Linux on x86_64 ((Ubuntu))``などと出ればOK。
4.  ログイン ``sudo mysql -u root``
    -   以下のようになればOK

```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 22
Server version: 8.0.41-0ubuntu0.22.04.1 (Ubuntu)

Copyright (c) 2000, 2025, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

-   ここまででmysqlの整備は完了


## データベースを作成

-   上のインストール直後の ``mysql>``と表示されているところからスタート  
-   以降、SQLの慣例に則って大文字で書いているが、SQLの文法として大文字が制約されているわけではないので、直打ちの際は気にしなくてOK。
-   ただし、各種命名は小文字に統一する。
-   ここでのデータベースとはシンプルにテーブルの集合だと思ってくれて良い(多分)。詳細はnote.mdに記載。

1.  ``CREATE DATABASE litter;`` 
2.  ``SHOW DATABASES;`` 

以下のようになればOK。
```
mysql> CREATE DATABASE litter;
Query OK, 1 row affected (0.02 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| litter             |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```

### ユーザ作成

パスワードを伴うためテスト用のローカル環境と実際のデプロイ環境で取り扱いを変える。

### ローカルの場合
1.  ローカル環境では、パスワードの強度を犠牲にして扱いやすくするためにパスワードを弱くする。
    1.  パスワードポリシーをLOWにする。：``SET GLOBAL validate_password.policy = 'LOW';``
    2.  localhostからのログインのみパスワードをなしにする。：``UPDATE mysql.user SET authentication_string = '' WHERE user = 'root' AND host = 'localhost';``
    3.  更新：``FLUSH PRIVILEGES;``
2.  apiのユーザ作成&パスワードを設定：``CREATE USER 'api'@'localhost' IDENTIFIED BY 'password';`` 
3.  devのユーザ作成&パスワードを設定：``CREATE USER 'dev'@'localhost' IDENTIFIED BY 'password';`` 
4.  mysqlの退出：``quit``
5.  mysqlの再起動：``sudo systemctl restart mysql``

### 本番の場合
本番環境では、ただしくパスワードを設定する。
ただし、パスワードはポリシー"LOW"となっている場合のコマンドを記載。パスワード部分に関しては適宜変更すること。
1.  rootのパスワードを設定：``ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';`` 
2.  apiのユーザ作成&パスワードを設定：``CREATE USER api@localhost IDENTIFIED BY 'password';`` 
3.  devのユーザ作成&パスワードを設定：``CREATE USER dev@localhost IDENTIFIED BY 'password';`` 

### 権限設定
(rootユーザーでmysqlにログインした状態)

1.  apiの権限付与:``GRANT SELECT,INSERT,UPDATE ON litter.* TO 'api'@'localhost';``
2.  devの権限付与:``GRANT SELECT,INSERT,UPDATE,DELETE,ALTER,CREATE ON litter.* TO 'dev'@'localhost';``

デフォルトではすべてのデータベースに対して接続のみを許可している。  
この設定をすることで、apiユーザがデータの更新と取得、devユーザが+削除とテーブル作成が出来るようにした。

### サンプルテーブル作成

1.  ``litter-db/create_database.sh``を実行。
2.  OKと出れば良い◎


