FROM mysql:8.2.0

# 環境変数を設定
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=litter

ENV MYSQL_USER=api
ENV MYSQL_PASSWORD=password

ENV MYSQL_USER=dev
ENV MYSQL_PASSWORD=password

# コンテナ起動時に実行されるスクリプトをコピー
# COPY create_table.sh /docker-entrypoint-initdb.d/
# SQLファイルをコピー
# RUN mkdir /docker-entrypoint-initdb.d/sql
COPY sql/* /docker-entrypoint-initdb.d/

# スクリプトに実行権限を付与
# RUN chmod +wx /docker-entrypoint-initdb.d/create_table.sh
