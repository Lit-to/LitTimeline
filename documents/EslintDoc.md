
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




