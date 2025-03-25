# ./bin/bash

# /is_exist: ユーザーの存在を確認するAPI
# /register: 新規ユーザー登録を行うAPI
# /is_correct: パスワード認証を行うAPI
# /change_password: ユーザーのパスワード変更を実行するAPI
# /change_name: ユーザーの名前変更を行うAPI
# /change_id: ユーザーIDの変更を実施するAPI
# /remove: ユーザーを削除するAPI

# テスト結果を格納するファイルを作成
touch ./result.txt
# テスト結果を初期化
echo -n "" > ./result.txt
# is_exist
## まだidが存在していないパターン
result=$(curl -X POST http://localhost:3000/is_exist -H "Content-Type: application/json" -d '{"id": "lit-to"}')
echo -e $result >> ./result.txt

# register
## 異形式パターン1
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","name":"lit"}')
echo -e $result >> ./result.txt

## 異形式パターン2
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","password":"lit"}')
echo -e $result >> ./result.txt

## 異形式パターン3
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"name": "lit","password":"lit_"}')
echo -e $result >> ./result.txt

## id非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

## パスワード非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit_to","name":"lit","password":"f@@"}')
echo -e $result >> ./result.txt

## 成功パターン (作成されるはず)
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit-to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

# is_exist
## 既にidが存在しているパターン(テストとしては独立変数が2つあるので微妙な形になっているが割愛)
result=$(curl -X POST http://localhost:3000/is_exist -H "Content-Type: application/json" -d '{"id": "lit-to"}')
echo -e $result >> ./result.txt

# /is_correct
## 認証失敗パターン(バリデーション)
result=$(curl -X POST http://localhost:3000/is_correct -H "Content-Type: application/json" -d '{"id": "lit-to","name":"lit","password":"b~~"}')
echo -e $result >> ./result.txt

## 認証失敗パターン(認証)
result=$(curl -X POST http://localhost:3000/is_correct -H "Content-Type: application/json" -d '{"id": "lit-to","name":"lit","password":"bar"}')
echo -e $result >> ./result.txt

## 認証成功パターン
result=$(curl -X POST http://localhost:3000/is_correct -H "Content-Type: application/json" -d '{"id": "lit-to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

# change_password
## 現在のパスワードが誤っている場合
result=$(curl -X POST http://localhost:3000/change_password -H "Content-Type: application/json" -d '{"id": "lit-to","old_password": "wrong","new_password": "newf@@"}')
echo -e $result >> ./result.txt

## 正常なパスワード変更
result=$(curl -X POST http://localhost:3000/change_password -H "Content-Type: application/json" -d '{"id": "lit-to","old_password": "foo","new_password": "newfoo"}')
echo -e $result >> ./result.txt

# change_name
## ユーザー名変更
result=$(curl -X POST http://localhost:3000/change_name -H "Content-Type: application/json" -d '{"id": "lit-to","new_name": "new@@@"}')
echo -e $result >> ./result.txt

## ユーザー名変更
result=$(curl -X POST http://localhost:3000/change_name -H "Content-Type: application/json" -d '{"id": "lit-to","new_name": "newlit"}')
echo -e $result >> ./result.txt

# change_id
## ユーザーID変更
result=$(curl -X POST http://localhost:3000/change_id -H "Content-Type: application/json" -d '{"old_id": "lit-to","new_id": "lit-to-new"}')
echo -e $result >> ./result.txt

# remove
## ユーザー削除
result=$(curl -X POST http://localhost:3000/remove -H "Content-Type: application/json" -d '{"id": "lit-to-new"}')
echo -e $result >> ./result.txt



