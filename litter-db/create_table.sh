
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
pushd "$SCRIPT_DIR" > /dev/null
echo "SCRIPT_DIR: $SCRIPT_DIR"


# rootユーザでデータベースを作る
sudo mysql -u root -ppassword < root_compose.sql >> result.txt

# devユーザの権限テスト
sudo mysql -u dev -ppassword < dev_test.sql >> result.txt

# apiユーザの権限テスト
sudo mysql -u api -ppassword < api_test.sql >> result.txt

# テストお片付け
sudo mysql -u root -ppassword < root_del.sql >> result.txt

# テスト結果
diff answer.txt result.txt >> diff.txt
if [ $? -eq 0 ]; then
    echo "Test OK"
else
    echo "Test NG"
fi
rm -r -f result.txt
rm -r -f diff.txt

popd > /dev/null
