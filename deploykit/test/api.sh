# ./bin/bash

# テスト結果を格納するファイルを作成
touch ./result.txt
# テスト結果を初期化
echo -n "" > ./result.txt
# is_exist
## 非存在パターン
result=$(curl -X POST http://localhost:3000/is_exist -H "Content-Type: application/json" -d '{"id": "lit-to"}')
echo -e $result >> ./result.txt

# register
## 異形式パターン1
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","name":"lit"}')
echo -e $result >> ./result.txt

## 異形式パターン2
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","password":"lit"}')
echo -e $result >> ./result.txt

## 異形式パターン2
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"name": "lit","password":"lit_"}')
echo -e $result >> ./result.txt

## id失敗パターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

## パスワード失敗パターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit_to","name":"lit","password":"f@@"}')
echo -e $result >> ./result.txt

## 成功パターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit-to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

# is_exist
## 存在パターン
result=$(curl -X POST http://localhost:3000/is_exist -H "Content-Type: application/json" -d '{"id": "lit-to"}')
echo -e $result >> ./result.txt





