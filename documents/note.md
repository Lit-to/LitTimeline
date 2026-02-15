# 開発メモ

使ったツールの参照元とか、思ったこととかをメモって行く場所
PR 担当( @Mugen2411 ) 宛てたものもここに書く可能性あり。参考程度に見てくれれば OK

- 環境構築するのに参照した場所
- https://zenn.dev/web_tips/articles/abad1a544f3643

- 構築時にエラー。多分react@19.0.0が最新すぎて testing-library が対応してなさそう？
- どうやら構築時のコマンドが死んでいた模様。

デプロイ方法の手順記事メモ。エラーが起きたときの参考になるかも。

- https://qiita.com/tsuyuni/items/d2edef23c169bd79de93
- https://zenn.dev/haru330/scraps/b8a0a24512c510

2025-02-11 17:37:26

- Express のインストール:https://qiita.com/ksh-fthr/items/c22dedbc0952bfdcc808
- クローン時に`npm audit fix --force`が求められるのはなんでだろう

  - https://qiita.com/sakamotodd/items/fa3f4a6a02659dca7540
  - https://zenn.dev/tm35/articles/c170eac0b22f5f
  - 脆弱性がある、と直訳すると書いてあるので素直に対応すればよさそう。
  - クローンする時期によって異なるので、随時更新するが必要とあればその場でそれぞれの環境で上のコマンドを実行する。
  - 破壊的な変更とを覚悟して`--force`を付けて実行することも出来る。
  - もし、それでも何らか実行に失敗する場合は手数ですが npm の入れなおしかなぁ..

- package.json についてわかったこと
- https://qiita.com/hashrock/items/15f4a4961183cfbb2658
- このプロジェクトには現時点で二か所
  - [litter/package.json](litter/package.json)
  - [litter-app/package.json](litter-app/package.json)
- `npm run`コマンドの実行時に、サーバー起動を楽にするためのもの。
- 今回はディレクトリごとにフロント・バックを区別するため、起動コマンドは`npm start`に統一。

2025-02-12 22:48:58

- MySQL サーバーを立てるための参考メモ
  - https://qiita.com/studio_meowtoon/items/613291e1d3c88d3ef12e

2025-02-13 23:13:34

- DB のパスワード設定
  - https://qiita.com/keisukeYamagishi/items/d897e5c52fe9fd8d9273

2025-02-15 11:33:03

- データベースという言葉が混在してるせいで困った。

  - データベースと外野から書いた場合は、広く MYSQL のようなものを指す。｢DB アプリケーション｣と呼んだほうが正しそうに見える..。
  - DB アプリ内には、DATABASE 機能があり、その中にテーブルを作成する。(どっちかっていうといくつかのテーブルを集めたものが DATABASE 機能、と考えるべきか。用語が衝突してるぜ)
  - ただし以降、DB と呼称した場合は DATABASE 機能のことを指すものとする(DB アプリは自明に MYSQL なのでそう呼ぶことがあんまない)。

- 命名規則

  - よくわからないのでこの記事準拠で。
  - 基本的にはスネークケース、英小文字、テーブル名複数形カラム名単数形といったところ。
  - DB 名は小文字スネークケース(多分`litter`しか作らないと思う)。
  - https://qiita.com/genzouw/items/35022fa96c120e67c637

- ユーザーパスワードについて
- パスワード設定(ポリシー)の確認：`SHOW VARIABLES LIKE 'validate_password%';`
- https://qiita.com/chii-08/items/4a8613b1241309e76b2c

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

- この設定だと 8 文字以上の大文字、小文字、特殊文字を一文字以上含めた 8 文字以上の文字列としないといけない。
- `validate_password.policy`を`LOW`としている場合は 8 文字以上であれば OK となる。

今回の DB 構成では、以下のユーザを想定：正直このあたりは全く分からん。これで良いのか..？

- `root@localhost`: 最強。デフォルトで作成されるユーザー。
  - なんでも出来るが、`localhost`からのログインのみ受付。
- `api@localhost`:API から呼び出された際に利用可能なユーザー。
  - API は必ず Express.js を経由してやってくるため多分`localhost`で問題ないはず。もし、バックエンド部分と別のサーバーに配置されるなどする場合は変更が必要。
  - SELECT,INSERT,UPDATE を`litter`データベースに実行可能。
- `dev@localhost`:開発者用ユーザー,SELECT,INSERT,UPDATE,DELETE,ALTER TABLE,CREATE TABLE を`litter`データベースに実行可能。

  - 開発者がリモートで作業をするため、広く受付をする。

- テスト仕様書のこと - 本来のテスト仕様書は実際に実施したあとに記録を残すための Excel シートとかを作るけど、仕様書に関する要件とかルールとかを決めていないので PR 時に一旦テストしたことがわかれば OK。 - 本番環境の時はそれはそれでその時に決めることにするけど、まぁゆうてテストしなかったことで困る人間は自分自身なのでゆるめでも特に問題なし。
  2025-02-16 11:07:28
- Docker Container にいれれば諸々の環境構築をぼたんひとつですむんじゃないかと気づいた
- インストール方法メモ
- https://docs.docker.com/desktop/setup/install/linux/ubuntu/
- https://kinsta.com/jp/blog/install-docker-ubuntu/
- クローン手順の部分はあとでメインブランチに戻す。

2025-02-28 15:08:26

- むげんくんが PR 見ていない間何も進まないのも癪なので、フロント部分は DB と関係ないという前提で進めることに

- npm i react-router-dom したのに、VS コードからインポートの元部品が見つからんとか言われたので対応
- https://zenn.dev/minamo/articles/6c935d0dccd5e6
- やったこととしては、全く同じ

```
VSCode の拡張機能タブから、検索窓に @builtin typescript と入力。
「TypeScript と JavaScript の言語機能」を無効にする。
VSCode を再起動
```

- ただ、これをやったら Syntax-Highlight が全滅したので復活させたら何故かエラーが消えた。

2025-03-08 02:22:31

- css と tsx の依存関係が分からなくなってきたので、フォルダにわけた。
- とりま./homepage/以下のものは仮ホームぺージとしておいておくことにする。あとでけす。
- ./signup/以下にあるものはモーダルとして持っておいて、今は遷移させているが、後でぺージの上に乗せるとかが出来ても良いね ◎
- ./style/以下にあるものは全体共通カラーパレットとして、ここ以外で色を指定しないようにする(テーマカラーみたいなのをあとで変えやすくするため)
  - ここに関してはあとで外に出しても良いと思ってる。

2025-03-11 13:47:05

- 大前提として、今回はフロントなので`.LitTimeline/litter/`以下についてのみ編集した。
  - 以降、litter フォルダを root として進める。
- PR を見てもらうにあたって、何も説明もなく投げるのも気が引けるので、簡単にログイン画面とアカウント作成画面の説明書き兼未来の自分のためのメモ
  - `./main.tsx`:振り分けぺージ。このページに項目を追加することでアドレスの指定が出来る
  - `./main.css`:デフォルトの css。ここに書いた内容は全てのぺージで適用される
    - `./style/color.css`:色 css。ここをいじって色を変更出来るので、テーマ的なのを設定出来るはず
  - `./homepage/app.tsx`:今のデフォルトホームぺージ。仮置きでサイトマップにしている。あとで`localhost/`は twitter の home に飛ばすようにする予定
  - `signup/**`:アカウント作成/ログインぺージ。id とパスワードが入力できる。今回の PR の主目的はここ。

2025-03-23 06:30:15

- 構成を理解してきた
- `npm start`で最初に app.js を起動する。

  - `litter-app/routes/`配下にあるものを呼び出して、ルーティングを登録する。
    - `/`であればこれを表示する..等
    - このとき、特定のホストからのみ受け付けるということが一応できる。コメントにして今は解除しているが、api の動作チェックが終わったら付けておいてセキュリティとしておこう。

- SQL の結果を直接ブラウザに表示するの良くないから環境切り替えできるようにしなきゃ..
- import の形式が実質二通りあるように見えた
  - https://qiita.com/minato-naka/items/39ecc285d1e37226a283
  - きもくね？と思いつつ、あとでゆっくり調べよう

2025-03-24 14:03:27

- おおむね api 完成。
  - /litter-app ディレクトリに移動して`npm start`したら待機

2025-03-27 13:41:22

- ID の大文字小文字を DB に記録していない
  - →Twiter は表示では区別しているものの、大小文字の違いはダブって登録することができない
- どう取り扱うか要件等

2025-03-31 13:30:31

- api ファイル分割した！わかりにくくなった節もあるのでちょっと図解

  ```
  litter-app/routes/ 内

    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  common.js   │  │  config.js   │  │    db.js     │
    └───────┬──────┘  └───────┬──────┘  └───────┬──────┘
            ▼                 ▼                 ▼
            └─────────────────┴─────────────────┘
              │                       │
              ▼                       ▼
        ┌─────────────┐       ┌──────────────────┐
        │   api.js    │ ◀───  │    ./api/*.js    │
        └──────┬──────┘       │                  │
               ▼              └──────────────────┘
        ┌──────────────┐
        │    ユーザー   │
        └──────────────┘

  ```

  - `common.js`は各 api が共通で使う機能をとりまとめたところ
  - `config.js`はサーバー管理者用設定ファイル
  - `db.js`は db 設定ファイル
  - `api.js`は各 api の振り分けを行う部分 api.js にはじめにやってきて、各 api ごとに適切な関数を`./api/*.js`から呼び出す。
  - 今後 api が増えたら`./api/*.js`を増やして対応する。

2025-04-01 11:01:35

- 今更ながら、本来はセキュリティを考えると git にパスワードをあげちゃダメだった
- /deploykit/docker-compose など、db のパスワードが直接書いてある状態になってるのは若干脆弱なのでよろしくなかったね..。
- とはいえ、現状パスワードは全部`password`っていうサンプルにしてあるので、本番環境では適宜変更するためのサンプルという運用にします。
- 逆に、バックエンドに置く SALT は練習も兼ねて.env というファイルに書いておくことにします。詳しい内容は discord に置きます。

2025-04-05 08:36:25

- ハッシュ化について
  - ハッシュ化便利パッケージがあったのでお借り(`bcrypt`)
  - `bcrypt.hash(パスワード,回数)`:ハッシュ値の計算
    - 計算回数を大き目に指定すると強固になるそうだが、処理が重いので検討中
    - ソルトの追加も自動で実施してくれるよう(return の文字列に含まれる)
  - `bcrypt.compare(パスワード、dbに保存済みのもの)`:検証
    - ハッシュ化して、正しいパスワードか検証する
  - ペッパーについて
    - 今は.env に書いているものを使った。

2025-04-09 13:34:02

- 指摘のリザルトコードの返し方について
  - 指摘された通り同じコードが何度も繰り返されてて冗長だなぁと思ったので一元化(`gen_result`)
  - ただ、今後も同じ形式で返すとは限らない(というよりむしろそれはない)ので、以下の形式に統一
  - `status`→ ステータスコードを返す
  - `result.is_success`→`True`で成功、`False`で失敗
  - `result.reason`→`result.is_success`が`False`だったときに入れる理由欄 成功時は原則空文字列を返す
  - `data.xxxx`→ 戻り値があれば原則ここを使う

2025-04-27 02:59:12

- フロント側との通信ができない。
  - WSL と windows の間の通信がどうなってるのかが分からん
    - どちらも同じ VM 上で動いてるんだから localhost で通信するって感じかな..
  - cors の通信制限に引っかかって遮断されてるっぽい
    - 解決。wsl の ip を指定してバックエンドに通信すれば良い。
    - https://qiita.com/ragner_k/items/783a797c47a348490a66
- 本来 app.js がサーバーになるべきだったのに api.js で他の api を呼び出す部分がサーバーになってたっぽいことが発覚。
  - これのせいで、いくら編集しても編集内容が正しくサーバーに適用されてなかった。
  - api.js はルータとして他の api を呼び出す役目なので`express().router()`を使わなきゃいけなかった。
  - app.js はサーバとして`app.listen()`で待機しなきゃいけなかった。

2025-05-01 18:57:42

- フロントとの通信が成立したのでうれしくなった
  - `express.json()`がルーティングである`app.use('/', apiRouter);`より後にあったせいで`express.json()`が設定されていなかった
    - →body でデータが取得できなかった
  - と一言で書くのは簡単だが、その過程で確かめたことを列挙する。
    - サーバー側で受け取り直後のデータとれてるか確認`console.log(req.body)`→`{}` 本来は id や name 等のデータが入るべきなのに入らなかった
    - フロント側で送信直前のデータがとれてるか確認`console.log(id, password, name);`→`{色々}` 本来入るべきデータがいた
    - つまり、送信中に死んでいたので恐らく`axios`当たりが怪しそうだった。
    - 色々調べたところデータの送信方法 or 受信方法に FormData と JSON で二択あるということが分かり、今は FormData で送ってしまっているか、JSON で受け取れていなかった。
      - 本来は JSON で送り JSON で受信したかった
      - https://qiita.com/derasado/items/74380eef720cfa1a58ec
    - 送信側が原因だろう、と思ってフロント側をよく見ていたが、バックエンドの`app.js`を非人類に質問したら結構すぐに解決したのでやっぱり思い込みはよくない..；；

2025-05-05 02:44:12

- 非表示に使っていた`display:none`プロパティはフォームには不適切ってことがわかった
  - その場に見えていないだけで裏側ではきっちりフォームが存在している
  - →`required:True`とかだと非表示フォームが未記入扱いになったりととても不便
  - TypeScript はこのあたりを条件分岐でタグを設置しないということが出来るのでそのように対応(https://github.com/Lit-to/LitTimeline/blob/17_loginFromFront/litter/src/signup/modal.tsx#L71 )
  - このあたりの文法は適切に扱えたらかなり便利だと思うので調べておきたいというメモ

2025-05-14 05:27:32

- カラーテーマの変更を入れた
  - なぜかタブのカラーテーマ変更のレンダリングが遅い。色々試したけど意味がなく微妙..。
    - 多分 ReactBootstrap に入ってる Transition プロパティが原因っぽいけど何をしたら無効にできるのかわからず一旦放置..。

2025-05-20 05:52:37

- ログイン機能の作成にあたりセッションの発行で想像以上に時間を使ったのでメモ
  - 流れ
    - React→`/login`→Express
    - React← セッション情報 ←Express
    - React(成功した場合ここでページ遷移)
    - React→`/get_session_data`→Express
  - 出来ていたこと
    - `/login`:id が既に重複してないか、などバックエンドで完結する処理
  - 出来ていなかったこと
    - `/login`:セッションデータの保存
    - 実際には、ブラウザから送られたデータを見ると以下のようにあり、別セッション id として保存されていた
      ```json
      sessions: [Object: null prototype] {
      LpwGSiSk2GZOgHNN5kFAfA0EDmhBhJw5: '{"cookie":{"originalMaxAge":86400000,"expires":"2025-05-20T19:17:00.612Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"id":"test","name":"sss"}}',
      'C_qB_ceDJSD67yY-Gd_67MY7D-XmR8Pw': '{"cookie":{"originalMaxAge":86400000,"expires":"2025-05-20T19:17:02.822Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}',
      xPRKbfTvAwiwXz7v40x0MhdJlLm2nygt: '{"cookie":{"originalMaxAge":86400000,"expires":"2025-05-20T19:22:55.253Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}',
      Yu7Ccx6RLBPUsTXjdC6nVKn5nytslc96: '{"cookie":{"originalMaxAge":86400000,"expires":"2025-05-20T19:22:52.979Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"id":"test","name":"sss"}}'
      },
      ```
    - → セッション id は発行されているのに、**同じセッション id でアクセスできなかった**
  - 必要だったこと
  - セッションの保存設定として以下が必要
  ```tsx
  app.use(
    session({
      secret: "your_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000, // 1日
        httpOnly: true,
        sameSite: "lax", // 'strict' や 'none' によって挙動が変わる
        secure: false, // httpsなら true にする
      },
    })
  );
  ```
  - クエリを送る際に`{ withCredentials: true }`のような記述が必要だったらしい(3 日の苦労)
  - `axios.post("http://" + API_IP + ":" + API_PORT + "/login", { "id": id, "password": password }, { withCredentials: true }).then((response) => `
  - また、受け取る側にも`credentials: 'include'`という記述が必要
  - セッションの保存には`req.session.save()`っていう関数を使う
  ```tsx
  function logout() {
      fetch('http://localhost:3000/logout', {
          method: "POST", credentials: 'include', headers: {
              'Pragma': 'no-cache',
              'If-Modified-Since': '0'
          }..}..)..}
  ```
  - あー時間かかった...。

2025-06-16 11:58:20

- コーディングルール考え中
  - おそらく Angular.js 向けではありそうだけど、TypeScript のコーディングスタイルを Google が出しているので、こちらを参考にしようかと
  - https://zenn.dev/kakkoyakakko/articles/1031af1d38d038
  - https://google.github.io/styleguide/tsguide.html
  - https://github.com/mitsuruog/javascript-style-guide
  -

2025-06-21 14:36:10

- eslint でコーディング規約に自動で合わられることがわかった
- ということで、導入。コーディングルールには ↓ のやつから抜粋して記載することにする。
- https://eslint.org/docs/latest/rules/

2025-06-25 22:01:16

- Eslint のルールのうち、制定されていないものを明示的にコーディングルールを書きたい、ということから逆に Eslint のルールを全部理解しないといけないなぁと気づいた。
- 数が少ないので、これを機に全部読んでいこうと思う。
- プロジェクトの本懐ではないが、そもそもこのプロジェクトはりっとーが最強でりっとーが方針を決めていいので EslintDoc としてファイルを作ろう。
- →https://github.com/Lit-to/LitTimeline/blob/main/documents/EslintDoc.md
- ルートが荒れるのを防ぐために、ここでファイルを document 配下に移動した。

2025-06-27 05:50:38

- Eslint くん、整形はそこまでやってくれないらしいのでフォーマッタとして Prettier も考えてみる
- https://prettier.io

2025-07-11 07:02:04

- Eslint の導入を完了
  - やり方メモしておかねば
- https://zenn.dev/praha/articles/7ed629d0d9da53
  - 調べてる間に prettier いらなくね？という記事を見た。
  - とりも過剰すぎる、と感じたら無くしてもいいかもね～。

2025-08-30 16:08:39

- 無限スクロールの実装

  ```ts
  let footerRef = useRef<HTMLDivElement | null>(null);
  const options = {
    root: null,
  };
  const observerObject = new IntersectionObserver(observeFook, options);
  ```

  ```html
  <div ref="{footerRef}">a</div>
  ```

  - footerRef は一番下が画面に映ったかどうかを判定するための番兵
    - 常に observeFook が発火し続ける

  ```ts
  function observeFook(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    //複数個が想定されているため0番目を指定している
    if (entries[0].isIntersecting) {
      addCards(POST_COUNT);
    }
    observer.unobserve(entries[0].target);
    observer.observe(entries[0].target);
  }
  ```

  - entries にすべての`footerRef`が入っていて、`isIntersecting`は画面に映っているかどうかを表している。

2025-09-10 21:17:37

- `express-session`が非常に不便
  - 色々自動化してくれるのは助かるが、セッションの中身の型を自分自身で拡張しようとすると挙動が不安定になる
  - メモリ上にデータをもつ形になっていて、開発するうえでは困らないが本番で動かすとなるとよろしくはない
- HTTP セッションをつくろう！
  - 型定義を自由に出来るセッションを自作しよう
  - 保存先は DB のエンドポイントにする
    - 利用予定のセッションデータ型`Map`と有効期限日数、エンドポイントを渡して実際に 1 カラムを insert する
      - このとき insert にうまくいったかいかなかったかをデータとして持っておく
      - → うまくいかなかった場合は`express-session`同様にプログラムメモリ上で管理するセッションとするか、エラーにする
    - ここに関しては二重管理になりかねないので微妙、やらないかも..
  - 同期用関数
    - セッションの情報を正として情報同期する
  - セッション id 発行
    - このときに有効期限を持たせても良いかな、とも悩み

2025-09-11 20:57:19

- 上の方針で頑張ろうかと思ったけど、インスタンスを作る意味がないのと、DB カラムとプログラム上でカラムの定義がコンフリクトしてほしくないので、DB に基本依存することにした
- 関数利用者はユーザー id を渡して新規セッション発行する
  - 全カラムをキーとした空の(もしくは初期値が入った)hashMap 的なものを返す
- 関数利用者は hashMap に好き勝手データを入れた後、`session.save(map)`関数をたたいてもらう
  - レコードとして DB に保存
- 関数利用者はセッション id を渡してセッションをもらう

  - このとき有効期限切れだったら失敗の旨を返す

- 結構一般化しようと思って、SQL のエントリポイント関数利用者に発行してもらおうかとがんばったけど死ぬほど面倒くさかったのでスキップ
  - これをやろうと思ったら SQL をたたく TCPorUDP 通信の実装がいるのでまた今度にお預け

2025-09-13 20:41:17

- いまだにテスターがないのはどうかということで試験的に`jest`を追加
  - express.ts のテスター
  - https://qiita.com/na--san/items/ed713f5e20e0f6d12a87

2025-10-24 21:39:40

- タイムラインが 1~20 1~40 21~40 みたいになるようになってる

  - ずっと問題だったんだけど、どうすればいいか分からず困り果ててる
  - ビルド済みからみると解決するらしい....仕組みは本当に不明..。
  - キモすぎるが一旦許容
  - https://zenn.dev/ryohei0509/articles/e49530fae8935e
  - strict モードというのが原因だそう。

- 昔判明してたのに再度原因を探す羽目になってしまった..。

2025-11-10 22:58:59

- なぜか mysql くん limit 句にプレースホルダを入れると落ちる..。

```log
  console.error
    SQL execution failed: Error: Incorrect arguments to mysqld_stmt_execute
        at PromisePool.execute (/LitTimeline/litter-app/node_modules/mysql2/lib/promise/pool.js:54:22)
        at Object.<anonymous> (/LitTimeline/litter-app/database/dbConnection.ts:41:29)
        at Generator.next (<anonymous>)
        at /LitTimeline/litter-app/database/dbConnection.ts:41:71
        at new Promise (<anonymous>)
        at Object.<anonymous>.__awaiter (/LitTimeline/litter-app/database/dbConnection.ts:37:12)
        at Object.query (/LitTimeline/litter-app/database/dbConnection.ts:95:12)
        at Object.<anonymous> (/LitTimeline/litter-app/database/methods/getTimeline.ts:11:31)
        at Generator.next (<anonymous>)
        at /LitTimeline/litter-app/database/methods/getTimeline.ts:41:71
        at new Promise (<anonymous>)
        at Object.<anonymous>.__awaiter (/LitTimeline/litter-app/database/methods/getTimeline.ts:37:12)
        at Object.getTimeline (/LitTimeline/litter-app/database/methods/getTimeline.ts:51:12)
        at User.<anonymous> (/LitTimeline/litter-app/types/User.ts:395:60)
        at Generator.next (<anonymous>)
        at /LitTimeline/litter-app/types/User.ts:41:71
        at new Promise (<anonymous>)
        at Object.<anonymous>.__awaiter (/LitTimeline/litter-app/types/User.ts:37:12)
        at User.getTimeline (/LitTimeline/litter-app/types/User.ts:419:16)
        at /LitTimeline/litter-app/routes/api/getTimeline.ts:25:38
        at Generator.next (<anonymous>)
        at fulfilled (/LitTimeline/litter-app/routes/api/getTimeline.ts:38:58)
        at processTicksAndRejections (node:internal/process/task_queues:105:5) {
      code: 'ER_WRONG_ARGUMENTS',
      errno: 1210,
      sql: 'SELECT * FROM litter.posts limit ?',
      sqlState: 'HY000',
      sqlMessage: 'Incorrect arguments to mysqld_stmt_execute'
```

```ts
export const GET_TIMELINE =
  "SELECT * FROM litter.posts WHERE id < ? and is_deleted = false order by created_at desc limit ?;";
```

```ts
const rows = await db.query(queries.GET_TIMELINE, [
  Number(lastPostId),
  Number(count),
]);
```

- limit 句を消すと正常に動いたっぽいので、おそらくここで間違いなかろう
- 調べてみてもそれっぽい情報がすぐには見つからなかったけど、時間を浪費してもなんなのでいったん無視
- db.execute の中身を execute から query に変えると動くっぽい？

2026-02-12 01:11:39
- node.jsにめちゃめちゃデカい脆弱性が発見されていたのを放置していたので対応。
- .envファイルを失って時間浪費したのでdiscordにメモ
- SALT_ROUNDは16とかにするとテストで時間死するので注意

2026-02-13 23:55:26
- https://ja.vite.dev/guide/static-deploy.html#github-pages
- こいつを参考にgithubActionsにデプロイすることにした
