FROM mysql:8.2.0

# 環境変数を設定
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=litter

# コンテナ起動時に実行されるスクリプトをコピー
COPY create_table.sh /docker-entrypoint-initdb.d/

# 初期設定ファイルをコピー
COPY sql/ /docker-entrypoint-initdb.d/

# スクリプトに実行権限を付与
RUN chmod +x /docker-entrypoint-initdb.d/create_table.sh
