
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
pushd "$SCRIPT_DIR" > /dev/null
echo "SCRIPT_DIR: $SCRIPT_DIR"

mysql -u root -p < test_table.sql


popd > /dev/null
