
# Eslintのドキュメントを読み自分のドキュメントとする

## array-callback-return
-   https://eslint.org/docs/latest/rules/array-callback-return
```js
myArray.reduce(function(memo, item, index) {
  memo[item] = index;
}, {})
```
-   内部で繰り返しを前提とする関数は戻り値を次のループで利用するため戻り値を指定しなければならない。
    -   ``map``,``filter``,``reduce``など
    -   foreachも指定できるが、任意


## constructor-super
-   https://eslint.org/docs/latest/rules/constructor-super
-   継承先のクラスは``super()``を呼ばなければならない。
-   親元のクラスは``super()``を呼んではならない。

## for-direction
-   https://eslint.org/docs/latest/rules/for-direction
-   forループの繰り返し変数が条件に引っかからない無限ループ状態であってはならない。
    -   無限ループをしたい場合はwhileをつかうこと。

## getter-return
-   https://eslint.org/docs/latest/rules/getter-return
-   getterは、returnが設定されていなければならない。

## no-async-promise-executor
-   https://eslint.org/docs/latest/rules/no-async-promise-executor
-   Promise型は、処理が終わらないときに｢あとで返すから待ってろ｣という指示を持つ
    -   ``resolve()``/``reject()``で返さなければならない

## no-await-in-loop
-   https://eslint.org/docs/latest/rules/no-await-in-loop
-   ループ中にawaitを含めてはならない








