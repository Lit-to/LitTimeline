※WSL-Ubuntu環境を想定  
前提としてこのレポジトリはクローンされているものとする。  
→``git clone https://github.com/Lit-to/LitTimeline.git``  

# フロントサーバー環境構築
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

# バックエンドサーバー環境構築
※LitTimelineディレクトリ上(りっとーのPC環境では``/home/lit-to/LitTimeline``)
1.  ``npm install express -g``
2.  ``npm install express-generator -g``

> ``express litter-app``(本来はここでプロジェクト作成。ただしクローンした場合はこの手順をしなくてOKなはず)

4.  ``cd litter-app``
5.  ``npm install``
    -  このとき、何度か``npm audit fix --force``を求められることがある。
    -  **found 0 vulnerability**と出てくるまで実行する(3回程度実行する可能性アリ)。
6.  ``npm start``
7.  [localhost:3000](http://localhost:3000)にアクセス。
    -   Express Welcome to Expressのように表示されればOK

基本的にはここまででデプロイ完了。  
ただ、今後りっとーが開発するにあたりどの部分を編集するべきかを知るために``litter-app/routes/server.js``を作った。  
テスト時は``node <対象ファイル.js>``等と実行する。  
※LitTimelineディレクトリ上(りっとーのPC環境では``/home/lit-to/LitTimeline``)
-   ``node litter-app/routes/server.js``
    -   →``Server running at http://localhost:3000``とターミナルに表示されればOK。
-   [localhost:3000](http://localhost:3000)にアクセス。
    -   **Hello World!** と表示されればOK。
