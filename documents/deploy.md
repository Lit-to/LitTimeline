
# デプロイ手順書
-   WSL2(ubuntu)での作業を想定しているものの、作業内容的にはwin11でも出来そう。
-   VScodeはインストールされている前提。

## 1.事前準備

1. dockerをインストールする。
   - ここから[DL&インストール](https://docs.docker.com/desktop/setup/install/windows-install/ )
   - windows用のものでOK。
   -  インストールは言われるがままに進めればOK。
   - 終わったらPC再起が入る。
2. ``docker --version``を実行して以下になればOK(なぜかWSLでも勝手に入ってる)。


   ```

   Docker version 27.5.1, build ...

   ```

3. 作業用ディレクトリの作成
    - dockerコンテナを作るために荒れてもいい踏み台フォルダを作って開いてください。

4. VScodeにdocker拡張機能をインストール(コマンドベースでの操作もこいつで楽になることが多い)。
    - 拡張機能タブからdockerを検索するか、マーケットから[インストール](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker )。

5. VScodeにRemoteDevelopment拡張機能をインストール
    - 同上。マーケットは[こちら](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack )。


## 2.Dockerコンテナ起動

※以降は事前準備の項で作成したディレクトリでの作業を前提とする。

1. このレポジトリをクローン
    -   PRの場合はお手数ですが対象ブランチをチェックアウトしてください。

2. SSHキーを作成する。
    -   公開鍵をgitの設定に追加する。
    -   秘密鍵は``deploykit/app/key``として保存する。

3. ``sudo docker compose up --build`` かもしくは ``deploykit/docker-compose.yml``ファイルのservice上にある``Run All Services``を押下。
    
   - ここが主目的のビルドなので、割と時間掛かる。御手洗いに行く、水を飲む、その他粗用をこなす。
   - 以下のようにビルド成功と表示されればOK。

```

littimeline       Built
Network deploykit_defalut Created 
Container litter  Started

```

### 3.コンテナ内に移動

1. VScodeでDockerタブに移動。
2. ``deploykit-littimeline``を右クリック→``Visual Studio Codeをアタッチする``
    - VScodeが立ち上がり、/LitTimelineフォルダが開ければOK。
    - 開けなかった場合は ``cd /LitTimeline``で移動。
    - package.json package-lock.jsonに差分が発生していることがあるが、無視して差分削除してOK。

### 4.2回目以降のコンテナ起動

0.   大前提に、DockerDesktopを起動すれば自動でコンテナが起動する。→4.へ
1.   ``docker ps``で動いてるコンテナidを確認。
2.   ``docker up <コンテナid>``で起動。
3.   以降はコンテナに移動の項と同様にVScodeを起動。

## デプロイ

1.  フロントの起動  
    ※コンテナを起動し、コンテナのLitTimelineディレクトリにいる状態で以下を実施。
    -   フロントディレクトリへの移動:``cd litter``
    -   ビルドと起動:``npm start``
    -   ブラウザで ``localhost:5173``が開ければOK。

2.  バックエンドの起動  
    ※コンテナを起動し、コンテナのLitTimelineディレクトリにいる状態で以下を実施。
    -   バックディレクトリへ移動:``cd litter-app``
    -   ビルドと起動:``npm start``
    -   ブラウザで``localhost:3000``が開ければOK。

3.  DBの起動(確認)
    ※DBはコンテナと同時に起動させるためテストのみ。
    -   ``mysql -h litter-db -ppassword``で``>mysql``となるか確認。
    -   ``show databases;``を実行して以下のようになればOK。

```

mysql> SHOW DATABASES;
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

