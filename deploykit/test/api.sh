# ./bin/bash

# /isNotExist: ユーザーの存在を確認するAPI
# /register: 新規ユーザー登録を行うAPI
# /isCorrect: パスワード認証を行うAPI
# /changePassword: ユーザーのパスワード変更を実行するAPI
# /changeName: ユーザーの名前変更を行うAPI
# /changeId: ユーザーIDの変更を実施するAPI
# /remove: ユーザーを削除するAPI
# /getUserIdFromSession: セッションからユーザーIDを取得するAPI

# 事前準備
cd "$(dirname "$0")"

# テスト結果を格納するファイルを作成
touch ./result.txt
# テスト結果を初期化
echo -n "" > ./result.txt
# register
## 1.異形式パターン1
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","name":"lit"}')
echo -e $result >> ./result.txt

## 2.異形式パターン2
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","password":"lit"}')
echo -e $result >> ./result.txt

## 3.異形式パターン3
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"name": "lit","password":"pass"}')
echo -e $result >> ./result.txt

## 4.id非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit@@to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

## 5.パスワード非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit_to","name":"lit","password":"f@@"}')
echo -e $result >> ./result.txt

## 6.どっちも非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit@@to","name":"lit","password":"f@@"}')
echo -e $result >> ./result.txt

## 7.成功パターン (作成されるはず)
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit_to","name":"りっとー","password":"foo"}')
echo -e $result >> ./result.txt

# /login
## 8.認証失敗パターン(バリデーション)
result=$(curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"id": "lit_to","password":"b~~"}')
echo -e $result >> ./result.txt

## 9.認証失敗パターン(認証)
result=$(curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"id": "lit_to","password":"bar"}')
echo -e $result >> ./result.txt

## 10.認証成功パターン
result=$(curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"id": "lit_to","password":"foo"}')
echo -e $result >> ./result.txt

# changePassword
## 11.現在のパスワードが誤っている(バリデーション)
result=$(curl -X POST http://localhost:3000/changePassword -H "Content-Type: application/json" -d '{"id": "lit_to","password": "foo","newPassword": "newf@@"}')
echo -e $result >> ./result.txt

## 12.正常なパスワード変更
result=$(curl -X POST http://localhost:3000/changePassword -H "Content-Type: application/json" -d '{"id": "lit_to","password": "foo","newPassword": "newfoo"}')
echo -e $result >> ./result.txt

# changeName
## 13.ユーザー名変更(認証失敗)
result=$(curl -X POST http://localhost:3000/changeName -H "Content-Type: application/json" -d '{"id": "lit_to","password":"wrong","newName": "newlit"}')
echo -e $result >> ./result.txt

## 14.ユーザー名変更(成功)
result=$(curl -X POST http://localhost:3000/changeName -H "Content-Type: application/json" -d '{"id": "lit_to","password": "newfoo","newName": "newlit"}')
echo -e $result >> ./result.txt

# changeId
## 15.ユーザーID変更(バリデーション失敗)
result=$(curl -X POST http://localhost:3000/changeId -H "Content-Type: application/json" -d '{"id": "lit_to","password":"newfoo","newId": "new@@@"}')
echo -e $result >> ./result.txt

## 16.ユーザーID変更(認証失敗)
result=$(curl -X POST http://localhost:3000/changeId -H "Content-Type: application/json" -d '{"id": "lit_to","password":"newfoooo","newId": "lit_to_new"}')
echo -e $result >> ./result.txt

#  17.ユーザーID変更(成功)
result=$(curl -X POST http://localhost:3000/changeId -H "Content-Type: application/json" -d '{"id": "lit_to","password":"newfoo","newId": "lit_to_new"}')
echo -e $result >> ./result.txt


# getUserIdFromSession
## 18.セッションからユーザーIDを取得
result=$(curl -X GET http://localhost:3000/getUserIdFromSession)
echo -e $result >> ./result.txt

# getName
## 19.ユーザIDからユーザ名を取得
result=$(curl -X POST http://localhost:3000/getName -H "Content-Type: application/json" -d '{"id": "lit_to_new"}')
echo -e $result >> ./result.txt

# remove
## 20.ユーザー削除
result=$(curl -X POST http://localhost:3000/remove -H "Content-Type: application/json" -d '{"id": "lit_to_new","password":"newfoo"}')
echo -e $result >> ./result.txt

echo "テスト結果:"
diff -u result_.txt result.txt | grep -E '^(\+|-)' | grep -vE '^(---|\+\+\+)' | nl
if [ -z "$(diff -u result.txt result_.txt | grep -E '^(\+|-)' | grep -vE '^(---|\+\+\+)')" ]; then
    echo "OK!"
fi
# 実行パスに戻る
cd -
