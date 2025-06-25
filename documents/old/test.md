# DB構築のテスト項目


## 1.ログインチェック

各種ログイン後、以下の画面になるかを確認すること。
なお、sudoのパスワードは無視する。
```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 9
Server version: 8.0.41-0ubuntu0.22.04.1 (Ubuntu)

Copyright (c) 2000, 2025, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```


### 1.root
※ubuntu画面
1.  ``sudo mysql -p``
2.  パスワードを入力する。

### 2.api
※ubuntu画面
1.  ``sudo mysql -u api@localhost -p``
2.  パスワードを入力する。

### 3.dev
1.  ``sudo mysql -u dev@localhost -p``
2.  パスワードを入力する。



