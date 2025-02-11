# フロントサーバー環境構築
※WSL-Ubuntu環境を想定

1.  このレポジトリをクローン ``git clone https://github.com/Lit-to/LitTimeline.git``
2.  npmのインストール ``sudo apt install npm``
3.  プロジェクトディレクトリに移動 ``cd litter``
4.  必要ツールのインストール ``npm install 18``
5.  デプロイ ``npm run dev``
6.  これで以下のように表示されればOK!
```

> litter@0.0.0 dev
> vite


  VITE v6.1.0  ready in 95 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
7.  最後にブラウザでLocal:に書かれているlocalhostにアクセスすればOK！(デフォルトの場合はたぶん[こちら]( http://localhost:5173 ))

-   この時点でデプロイに失敗した場合は[開発メモ](/note.md)を参照。



