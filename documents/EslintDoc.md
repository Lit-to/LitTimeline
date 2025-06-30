
# Eslintのドキュメントを読み自分のドキュメントとする
全体:https://eslint.org/docs/latest/rules/


## array-callback-return
```js
myArray.reduce(function(memo, item, index) {
  memo[item] = index;
}, {})
```
-   内部で繰り返しを前提とする関数は戻り値を次のループで利用するため戻り値を指定しなければならない。
    -   ``map``,``filter``,``reduce``など
    -   foreachも指定できるが、任意


## constructor-super
-   継承先のクラスは``super()``を呼ばなければならない。
-   親元のクラスは``super()``を呼んではならない。

## for-direction
-   forループの繰り返し変数が条件に引っかからない無限ループ状態であってはならない。
    -   ほんとうに無限ループをしたい場合はwhileをつかうこと。

## getter-return
-   getterは、returnが設定されていなければならない。

## no-async-promise-executor
-   Promise型は、処理が終わらないときに｢あとで返すから待ってろ｣という指示を持つ
    -   ``resolve()``/``reject()``で返さなければならない

## no-await-in-loop
-   ループ中にawaitを含めてはならない

## no-class-assign
-   クラス名の再代入の禁止

## no-compare-neg-zero
-   ``x===-0``を使ってはいけない。
    -   ほんとうに-0かどうかを確認したいのであれば、``Object.is(x,-0)``を使うこと。

## no-cond-assign
-   条件分岐中の代入を禁止

## no-const-assign
-   const宣言した変数への代入を禁止

## no-constant-binary-expression
-   構文時点で自明に``True``,``False``が確定する2項演算を禁止

```ts
const x = a + b ?? c;
// たぶん `a + (b ?? c)`こう書きたい

// 実際には`(a + b) ?? c`と解釈される. `a + b`は自明にnullにならないので``??c``は無意味になる
```
```ts
// 空かどうかを評価できる言語由来の人が書くかもしれない
const isEmpty = x === [];

// 必ずfalseになる
```

## no-constant-condition
-   構文時点で自明に``True``,``False``が確定する条件分岐を禁止

## no-constructor-return
-   コンストラクタ内での``return``を禁止

## no-control-regex
-   正規表現のうち、制御文字を許可しない

## no-debugger
-   debugger命令の禁止

## no-dupe-args
-   関数の定義時の同じ引数名を禁止

## no-dupe-class-members
-   クラスメンバ名の被りを禁止

## no-dupe-else-if
-   if-elseの構文中において、同じ条件を2つ並べるのを禁止

-   ↓NG例
    ```ts
    if (a) {
        foo();
    } else if (b) {
        bar();
    } else if (b) {
        baz();
    }
    ```

## no-dupe-keys
-   Object型(キーと値でデータ管理する型)で、同じキーを同時に定義するのを禁止

-   ↓NG例
    ```ts
    const foo = {
        bar: "baz",
        bar: "qux"
    };
    ```

## no-duplicate-case
-   Swicthの構文中において、同じ条件を2つ並べるのを禁止

## no-duplicate-imports
-   import元が同じimport文を2か所に書くのを禁止

-   ↓NG例
    ```ts
    /*eslint no-duplicate-imports: "error"*/

    import { merge } from 'module';
    import something from 'another-module';
    import { find } from 'module';
    ```

-   OK例
    ```ts
    /*eslint no-duplicate-imports: "error"*/

    import { merge, find } from 'module';
    import something from 'another-module';
    ```

-   OK例(``as something``で名前を付けるのでまとめられない)
    ```ts
    /*eslint no-duplicate-imports: "error"*/

    // not mergeable
    import { merge } from 'module';
    import * as something from 'module';
    ```


## no-empty-character-class

-   空の文字クラスをリテラルの正規表現として使用禁止
    -   ざっくり``[]``を含む正規表現の禁止

-   例外
    ```ts
    const regex = new RegExp("[]"); // ⚠️ 検出されない
    ```

-   RegExpクラスの初期化をnewから行わないほうが安全そう。

## no-empty-pattern
-   無意味な代入の禁止
    -   分割代入する際に、空欄に代入する行為を禁止する。

-   NG例
    ```ts
    // doesn't create any variables
    const {a: {}} = foo;
    ```

## no-ex-assign
-   catch文の中でのエラー変数への再代入を禁止する。

-   NG例
    ```ts
    /*eslint no-ex-assign: "error"*/

    try {
        // code
    } catch (e) {
        e = 10;
    }
    ```

## no-fallthrough
-   Switch文のフォールスルー(breakせずに落とすこと)を禁止する。
    -   ただし意図してフォールスルーさせたい場合はコメントにその旨を書かなければならない

## no-func-assign
-   関数で定義済みの名前への再代入を禁止

## no-import-assign
-   インポートで定義済みの名前への再代入を禁止

## no-inner-declarations
-   ``if``,``while``,``for``ブロック内での関数宣言を禁止

## no-invalid-regexp
-   ``RegExp()``の不正な正規表現を禁止

## no-irregular-whitespace

-   以下の空白文字の仕様を禁止
    ```ts
    \u000B - Line Tabulation (\v) - <VT>
    \u000C - Form Feed (\f) - <FF>
    \u00A0 - No-Break Space - <NBSP>
    \u0085 - Next Line - <NEL>
    \u1680 - Ogham Space Mark - <OGSP>
    \u180E - Mongolian Vowel Separator - <MVS>
    \ufeff - Zero Width No-Break Space - <BOM>
    \u2000 - En Quad - <NQSP>
    \u2001 - Em Quad - <MQSP>
    \u2002 - En Space - <ENSP>
    \u2003 - Em Space - <EMSP>
    \u2004 - Three-Per-Em - <THPMSP> - <3/MSP>
    \u2005 - Four-Per-Em - <FPMSP> - <4/MSP>
    \u2006 - Six-Per-Em - <SPMSP> - <6/MSP>
    \u2007 - Figure Space - <FSP>
    \u2008 - Punctuation Space - <PUNCSP>
    \u2009 - Thin Space - <THSP>
    \u200A - Hair Space - <HSP>
    \u200B - Zero Width Space - <ZWSP>
    \u2028 - Line Separator - <LS> - <LSEP>
    \u2029 - Paragraph Separator - <PS> - <PSEP>
    \u202F - Narrow No-Break Space - <NNBSP>
    \u205f - Medium Mathematical Space - <MMSP>
    \u3000 - Ideographic Space - <IDSP>
    ```

## no-loss-of-precision
-   リテラルな数値がビルド後に精度を落とすようなケースを禁止
    -   ざっくりクソでかい小数を直接記述してはいけない

-   NG例
```ts
/*eslint no-loss-of-precision: "error"*/

const a = 9007199254740993
const b = 5123000000000000000000000000001
const c = 1230000000000000000000000.0
const d = .1230000000000000000000000
const e = 0X20000000000001
const f = 0X2_000000000_0001;
```

## no-misleading-character-class
-   正規表現中に絵文字などの複数のコードポイントで作られた文字の使用を禁止

## no-new-native-nonconstructor

-   クラスではない以下の二つについて、``new``呼び出しを禁止
    -   ``Symbol``
    -   ``BigInt``
-   メモ:https://zenn.dev/tokky0425/articles/d963e4cfbb121c
    -   明示的には上の二つが禁止されていたけど、他にも禁止されてても良さそうに見える

## no-obj-calls
-   以下のstaticクラスのようなオブジェクトの``new``呼び出しを禁止
    -   ``Math``
    -   ``JSON``
    -   ``Reflect``
    -   ``Atomics``
    -   ``Intl``


## no-promise-executor-return

-   Promiseのexecutorにreturnを書くことを禁止する
    -   非同期処理中はresolveの引数として返したいものを渡さないといけない


