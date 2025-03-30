# ./bin/bash

# /is_not_exist: ユーザーの存在を確認するAPI
# /register: 新規ユーザー登録を行うAPI
# /is_correct: パスワード認証を行うAPI
# /change_password: ユーザーのパスワード変更を実行するAPI
# /change_name: ユーザーの名前変更を行うAPI
# /change_id: ユーザーIDの変更を実施するAPI
# /remove: ユーザーを削除するAPI

# 事前準備
cd "$(dirname "$0")"

# テスト結果を格納するファイルを作成
touch ./result.txt
# テスト結果を初期化
echo -n "" > ./result.txt
# is_not_exist
## 1.まだidが存在していないパターン
result=$(curl -X POST http://localhost:3000/is_not_exist -H "Content-Type: application/json" -d '{"id": "lit_to"}')
echo -e $result >> ./result.txt

# register
## 2.異形式パターン1
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","name":"lit"}')
echo -e $result >> ./result.txt

## 3.異形式パターン2
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit..to","password":"lit"}')
echo -e $result >> ./result.txt

## 4.異形式パターン3
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"name": "lit","password":"pass"}')
echo -e $result >> ./result.txt

## 5.id非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit@@to","name":"lit","password":"foo"}')
echo -e $result >> ./result.txt

## 6.パスワード非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit_to","name":"lit","password":"f@@"}')
echo -e $result >> ./result.txt

## 7.どっちも非バリデーションパターン
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit@@to","name":"lit","password":"f@@"}')
echo -e $result >> ./result.txt

## 8.成功パターン (作成されるはず)
result=$(curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"id": "lit_to","name":"りっとー","password":"foo"}')
echo -e $result >> ./result.txt

# is_not_exist
## 9.既にidが存在しているパターン(テストとしては独立変数が2つあるので微妙な形になっているが割愛)
result=$(curl -X POST http://localhost:3000/is_not_exist -H "Content-Type: application/json" -d '{"id": "lit_to"}')
echo -e $result >> ./result.txt

# /is_correct
## 10.認証失敗パターン(バリデーション)
result=$(curl -X POST http://localhost:3000/is_correct -H "Content-Type: application/json" -d '{"id": "lit_to","password":"b~~"}')
echo -e $result >> ./result.txt

## 11.認証失敗パターン(認証)
result=$(curl -X POST http://localhost:3000/is_correct -H "Content-Type: application/json" -d '{"id": "lit_to","password":"bar"}')
echo -e $result >> ./result.txt

## 12.認証成功パターン
result=$(curl -X POST http://localhost:3000/is_correct -H "Content-Type: application/json" -d '{"id": "lit_to","password":"foo"}')
echo -e $result >> ./result.txt

# change_password
## 13.現在のパスワードが誤っている(バリデーション)
result=$(curl -X POST http://localhost:3000/change_password -H "Content-Type: application/json" -d '{"id": "lit_to","password": "foo","new_password": "newf@@"}')
echo -e $result >> ./result.txt

## 14.正常なパスワード変更
result=$(curl -X POST http://localhost:3000/change_password -H "Content-Type: application/json" -d '{"id": "lit_to","password": "foo","new_password": "newfoo"}')
echo -e $result >> ./result.txt

## 15.ユーザー名変更(認証失敗)
result=$(curl -X POST http://localhost:3000/change_name -H "Content-Type: application/json" -d '{"id": "lit_to","password":"wrong","new_name": "newlit"}')
echo -e $result >> ./result.txt

## 16.ユーザー名変更(成功)
result=$(curl -X POST http://localhost:3000/change_name -H "Content-Type: application/json" -d '{"id": "lit_to","password": "newfoo","new_name": "newlit"}')
echo -e $result >> ./result.txt

# change_id
## 17.ユーザーID変更(バリデーション失敗)
result=$(curl -X POST http://localhost:3000/change_id -H "Content-Type: application/json" -d '{"id": "lit_to","password":"newfoo","new_id": "new@@@"}')
echo -e $result >> ./result.txt

## 18.ユーザーID変更(認証失敗)
result=$(curl -X POST http://localhost:3000/change_id -H "Content-Type: application/json" -d '{"id": "lit_to","password":"newfoooo","new_id": "lit_to_new"}')
echo -e $result >> ./result.txt

#  19.ユーザーID変更(成功)
result=$(curl -X POST http://localhost:3000/change_id -H "Content-Type: application/json" -d '{"id": "lit_to","password":"newfoo","new_id": "lit_to_new"}')
echo -e $result >> ./result.txt

# remove
## 20.ユーザー削除
result=$(curl -X POST http://localhost:3000/remove -H "Content-Type: application/json" -d '{"id": "lit_to_new","password":"newfoo"}')
echo -e $result >> ./result.txt

echo "テスト結果:"
diff -u result.txt result_.txt | grep -E '^(\+|-)' | grep -vE '^(---|\+\+\+)' | nl
if [ -z "$(diff -u result.txt result_.txt | grep -E '^(\+|-)' | grep -vE '^(---|\+\+\+)')" ]; then
    echo "OK!"
fi
# 実行パスに戻る
cd -
