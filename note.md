# 開発メモ
使ったツールの参照元とか、思ったこととかをメモって行く場所
PR担当( @Mugen2411 ) 宛てたものもここに書く可能性あり。参考程度に見てくれればOK

-   環境構築するのに参照した場所
-   https://zenn.dev/web_tips/articles/abad1a544f3643

-   構築時にエラー。多分react@19.0.0が最新すぎてtesting-libraryが対応してなさそう？
-   どうやら構築時のコマンドが死んでいた模様。

デプロイ方法の手順記事メモ。エラーが起きたときの参考になるかも。
-   https://qiita.com/tsuyuni/items/d2edef23c169bd79de93
-   https://zenn.dev/haru330/scraps/b8a0a24512c510

2025-02-11 17:37:26
-   Expressのインストール:https://qiita.com/ksh-fthr/items/c22dedbc0952bfdcc808
-   クローン時に``npm audit fix --force``が求められるのはなんでだろう
    -   https://qiita.com/sakamotodd/items/fa3f4a6a02659dca7540
    -   https://zenn.dev/tm35/articles/c170eac0b22f5f
    -   脆弱性がある、と直訳すると書いてあるので素直に対応すればよさそう。
    -   クローンする時期によって異なるので、随時更新するが必要とあればその場でそれぞれの環境で上のコマンドを実行する。
    -   破壊的な変更とを覚悟して``--force``を付けて実行することも出来る。
    -   もし、それでも何らか実行に失敗する場合は手数ですがnpmの入れなおしかなぁ..

-   package.jsonについてわかったこと
-   https://qiita.com/hashrock/items/15f4a4961183cfbb2658
-   このプロジェクトには現時点で二か所
    -   [litter/package.json](litter/package.json)
    -   [litter-app/package.json](litter-app/package.json)
-   ``npm run``コマンドの実行時に、サーバー起動を楽にするためのもの。
-   今回はディレクトリごとにフロント・バックを区別するため、起動コマンドは``npm start``に統一。

2025-02-16 11:07:28
-   Docker Containerにいれれば諸々の環境構築をぼたんひとつですむんじゃないかと気づいた
-   インストール方法メモ
-   https://docs.docker.com/desktop/setup/install/linux/ubuntu/
-   https://kinsta.com/jp/blog/install-docker-ubuntu/
-   クローン手順の部分はあとでメインブランチに戻す。


2025-02-28 15:08:26
-   むげんくんがPR見ていない間何も進まないのも癪なので、フロント部分はDBと関係ないという前提で進めることに

-   npm i react-router-dom したのに、VSコードからインポートの元部品が見つからんとか言われたので対応
-   https://zenn.dev/minamo/articles/6c935d0dccd5e6
-   やったこととしては、全く同じ

```
VSCode の拡張機能タブから、検索窓に @builtin typescript と入力。
「TypeScript と JavaScript の言語機能」を無効にする。
VSCode を再起動
```   

-   ただ、これをやったらSyntax-Highlightが全滅したので復活させたら何故かエラーが消えた。


2025-03-08 02:22:31
-   cssとtsxの依存関係が分からなくなってきたので、フォルダにわけた。
-   とりま./homepage/以下のものは仮ホームぺージとしておいておくことにする。あとでけす。
-   ./signup/以下にあるものはモーダルとして持っておいて、今は遷移させているが、後でぺージの上に乗せるとかが出来ても良いね◎
-   ./style/以下にあるものは全体共通カラーパレットとして、ここ以外で色を指定しないようにする(テーマカラーみたいなのをあとで変えやすくするため)
    -   ここに関してはあとで外に出しても良いと思ってる。
