
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
pushd "$SCRIPT_DIR" > /dev/null
echo "SCRIPT_DIR: $SCRIPT_DIR"

# rootユーザでデータベースを作る
sudo mysql -u root < root_compose.sql >> result.txt

# devユーザの権限テスト
sudo mysql -u dev < dev_test.sql >> result.txt

# apiユーザの権限テスト
sudo mysql -u api < api_test.sql >> result.txt

# テストお片付け
sudo mysql -u root < root_del.sql >> result.txt

popd > /dev/null
