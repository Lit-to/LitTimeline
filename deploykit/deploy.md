
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

-   Dockerコンテナ起動。
-   gitからDockerfileとdocker-compose.ymlとをダウンロードする。
-   
