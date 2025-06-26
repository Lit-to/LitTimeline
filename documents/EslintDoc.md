
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
-   
