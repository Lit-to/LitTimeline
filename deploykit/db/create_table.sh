
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
pushd "$SCRIPT_DIR" > /dev/null
echo "SCRIPT_DIR: $SCRIPT_DIR"

# 初期化
sudo mysql -h litter-db -u root -ppassword < ./sql/0_init_db.sql


# rootユーザでデータベースを作る
sudo mysql -h litter-db -u root -ppassword < ./sql/1_root_compose.sql >> result.txt

# devユーザの権限テスト
sudo mysql -h litter-db -u dev -ppassword < ./sql/2_dev_test.sql >> result.txt

# apiユーザの権限テスト
sudo mysql -h litter-db -u api -ppassword < ./sql/3_api_test.sql >> result.txt

# テストお片付け
sudo mysql -h litter-db -u root -ppassword < ./sql/4_root_del.sql >> result.txt

# テスト結果
diff answer.txt result.txt >> diff.txt
if [ $? -eq 0 ]; then
    echo "Test OK"
else
    echo "Test NG"
fi
rm -r -f result.txt
rm -r -f diff.txt

# 本番テーブル作成
sudo mysql -h litter-db -u root -ppassword < ./sql/5_create_table.sql

popd > /dev/null
