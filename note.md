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


2025-02-12 22:48:58
-   MySQLサーバーを立てるための参考メモ
    -   https://qiita.com/studio_meowtoon/items/613291e1d3c88d3ef12e


2025-02-13 23:13:34
-   DBのパスワード設定
    -   https://qiita.com/keisukeYamagishi/items/d897e5c52fe9fd8d9273


2025-02-15 11:33:03
-   データベースという言葉が混在してるせいで困った。
    -   データベースと外野から書いた場合は、広くMYSQLのようなものを指す。｢DBアプリケーション｣と呼んだほうが正しそうに見える..。
    -   DBアプリ内には、DATABASE機能があり、その中にテーブルを作成する。(どっちかっていうといくつかのテーブルを集めたものがDATABASE機能、と考えるべきか。用語が衝突してるぜ)
    -   ただし以降、DBと呼称した場合はDATABASE機能のことを指すものとする(DBアプリは自明にMYSQLなのでそう呼ぶことがあんまない)。

-   命名規則
    -   よくわからないのでこの記事準拠で。
    -   基本的にはスネークケース、英小文字、テーブル名複数形カラム名単数形といったところ。
    -   DB名は小文字スネークケース(多分``litter``しか作らないと思う)。
    -   https://qiita.com/genzouw/items/35022fa96c120e67c637

-   ユーザーパスワードについて
-   パスワード設定(ポリシー)の確認：``SHOW VARIABLES LIKE 'validate_password%';``
-   https://qiita.com/chii-08/items/4a8613b1241309e76b2c

以下を確認
```
+-------------------------------------------------+--------+
| Variable_name                                   | Value  |
+-------------------------------------------------+--------+
| validate_password.changed_characters_percentage | 0      |
| validate_password.check_user_name               | ON     |
| validate_password.dictionary_file               |        |
| validate_password.length                        | 8      |
| validate_password.mixed_case_count              | 1      |
| validate_password.number_count                  | 1      |
| validate_password.policy                        | MEDIUM |
| validate_password.special_char_count            | 1      |
+-------------------------------------------------+--------+
```
-   この設定だと8文字以上の大文字、小文字、特殊文字を一文字以上含めた8文字以上の文字列としないといけない。
-   ``validate_password.policy``を``LOW``としている場合は8文字以上であればOKとなる。

今回のDB構成では、以下のユーザを想定：正直このあたりは全く分からん。これで良いのか..？
-   ``root@localhost``: 最強。デフォルトで作成されるユーザー。
    -   なんでも出来るが、``localhost``からのログインのみ受付。
-   ``api@localhost``:APIから呼び出された際に利用可能なユーザー。
    -   APIは必ずExpress.jsを経由してやってくるため多分``localhost``で問題ないはず。もし、バックエンド部分と別のサーバーに配置されるなどする場合は変更が必要。
    -   SELECT,INSERT,UPDATEを``litter``データベースに実行可能。
-   ``dev@localhost``:開発者用ユーザー,SELECT,INSERT,UPDATE,DELETE,ALTER TABLE,CREATE TABLEを``litter``データベースに実行可能。
    -   開発者がリモートで作業をするため、広く受付をする。

-   テスト仕様書のこと
    -   本来のテスト仕様書は実際に実施したあとに記録を残すためのExcelシートとかを作るけど、仕様書に関する要件とかルールとかを決めていないのでPR時に一旦テストしたことがわかればOK。
    -   本番環境の時はそれはそれでその時に決めることにするけど、まぁゆうてテストしなかったことで困る人間は自分自身なのでゆるめでも特に問題なし。
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

2025-03-11 13:47:05
-   大前提として、今回はフロントなので``.LitTimeline/litter/``以下についてのみ編集した。
    -   以降、litterフォルダをrootとして進める。
-   PRを見てもらうにあたって、何も説明もなく投げるのも気が引けるので、簡単にログイン画面とアカウント作成画面の説明書き兼未来の自分のためのメモ
    -   ``./main.tsx``:振り分けぺージ。このページに項目を追加することでアドレスの指定が出来る
    -   ``./main.css``:デフォルトのcss。ここに書いた内容は全てのぺージで適用される
        -   ``./style/color.css``:色css。ここをいじって色を変更出来るので、テーマ的なのを設定出来るはず
    -   ``./homepage/app.tsx``:今のデフォルトホームぺージ。仮置きでサイトマップにしている。あとで``localhost/``はtwitterのhomeに飛ばすようにする予定
    -   ``signup/**``:アカウント作成/ログインぺージ。idとパスワードが入力できる。今回のPRの主目的はここ。

2025-03-23 06:30:15

-   構成を理解してきた
-   ``npm start``で最初にapp.jsを起動する。
    -   ``litter-app/routes/``配下にあるものを呼び出して、ルーティングを登録する。
        -   ``/``であればこれを表示する..等
        -   このとき、特定のホストからのみ受け付けるということが一応できる。コメントにして今は解除しているが、apiの動作チェックが終わったら付けておいてセキュリティとしておこう。

-   SQLの結果を直接ブラウザに表示するの良くないから環境切り替えできるようにしなきゃ..
-   importの形式が実質二通りあるように見えた
    -   https://qiita.com/minato-naka/items/39ecc285d1e37226a283
    -   きもくね？と思いつつ、あとでゆっくり調べよう


2025-03-24 14:03:27

-   おおむねapi完成。
    -   /litter-appディレクトリに移動して``npm start``したら待機
