
# デプロイ手順
WSL2(ubuntu)での作業を想定しているものの、作業内容的にはwin11でも出来そう。
VScodeはインストールされている前提。

# 事前準備

-   dockerをインストールする。
    -   https://docs.docker.com/desktop/setup/install/windows-install/
    -   windows用のものでOK。
    -   アカウント作成する。
    -   インストールは言われるがままに進めればOK。
    -   終わったらPC再起が入る。
    -   ``docker --version``を実行して以下になればOK(なぜかWSLでも勝手に入ってる)。
-   VScodeにdocker拡張機能をインストール(コマンドベースでの操作もこいつで楽になることが多い)。
    -   拡張機能タブからdockerを検索するか、マーケットから[インストール](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker )。
-   VScodeにRemoteDevelopment拡張機能をインストール
    -   同上。マーケットは[こちら](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack )。
-   作業用ディレクトリの作成
    -   dockerコンテナを作るために荒れてもいい踏み台フォルダを作って開いてください。

```
Docker version 27.5.1, build ...
```

## Dockerコンテナ起動
以降は上のディレクトリで作業。

-   クローンするためのフォルダを作る。
-   以下をコピペして実行。

``git clone -b "main" --filter=blob:none https://github.com/Lit-to/LitTimeline.git && cd LitTimeline && git sparse-checkout init --cone && git sparse-checkout set deploykit && cd .. && cp -r LitTimeline/deploykit deploykit && rm -d -r -f LitTimeline``  

-   内訳としては、レポジトリのクローン→必要なフォルダだけ抽出→親ディレクトリに移動→いらないものの削除
-   本格的なソースコードのクローンはあとでコンテナに対して行うのでコンテナ起動に必要なものだけダウンロード。
-   出来た ``deploykit`` フォルダに ``accesstoken``という名前で以下の内容を書いて保存。
    -   1行目:githubID
    -   2行目:gitのアクセストークン
    -   gitアクセストークンの取得方法は趣旨から逸れるため割愛するが、[分かる人むけヒント](https://github.com/settings/tokens )
-   ``docker compose up --build`` かもしくは ``deploykit/docker-compose.yml``ファイルのservice上にある``Run Service``を押下。
-   以下のようにビルド成功と表示されればOK。
```
littimeline       Built 
Container litter  Created
```

## コンテナ内に移動

-   VScodeでDockerタブに移動。
-   ``deploykit-littimeline``を右クリック→``Visual Studio Codeをアタッチする``
-   VScodeが立ち上がり、/LitTimelineフォルダが開ければOK。

## 2回目以降のコンテナ起動

-   ``docker ps``で動いてるコンテナidを確認。
-   ``docker up <コンテナid>``で起動。
-   以降はコンテナに移動の項と同様にVScodeを起動。

