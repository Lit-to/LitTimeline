
# デプロイ手順
WSL2(ubuntu)での作業を想定



-   dockerをインストールする。
    -   https://docs.docker.com/desktop/setup/install/windows-install/
    -   windows用のものでOK
    -   アカウント作成する
    -   インストールは言われるがままに進めればOK
    -   終わったらPC再起が入る。
    -   ``docker --version``を実行して以下になればOK(なぜかWSLでも勝手に入ってる)

```
Docker version 27.5.1, build ...
```

## Dockerコンテナ起動
-   ``git clone -b "8_Docker構築" --filter=blob:none https://github.com/Lit-to/LitTimeline.git && cd LitTimeline && git sparse-checkout init --cone && git sparse-checkout set deploykit && cd .. && cp -r LitTimeline/deploykit deploykit && rm -d -r -f LitTimeline`` を実行。
    -   内訳としては、レポジトリのクローン→必要なフォルダだけ抽出→親ディレクトリに移動→いらないものの削除
    -   本格的なソースコードのクローンはあとでコンテナに行うのでコンテナ起動に必要なものだけダウンロード。
-   
