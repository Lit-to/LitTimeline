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

package.jsonについてわかったこと
-   https://qiita.com/hashrock/items/15f4a4961183cfbb2658
-   このプロジェクトには現時点で二か所
    -   [litter/package.json](litter/package.json)
    -   [litter-app/package.json](litter-app/package.json)
-   ``npm run``コマンドの実行時に、サーバー起動を楽にするためのもの。
-   今回はディレクトリごとにフロント・バックを区別するため、起動コマンドは``npm run start``に統一。

