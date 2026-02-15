OLDPWD="$PWD"

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || exit 1
cd ..
# テスト実行
cd litter-app
npm test

cd "$OLDPWD"
