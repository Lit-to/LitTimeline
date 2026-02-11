# サーバー実行
OLDPWD="$PWD"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || exit 1

# フロント
cd ..
cd litter-app
npm start

# バック
cd ..
cd litter
npm start

cd "$OLDPWD"
