FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        nginx \
        bash \
        nano \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./tlitter.conf /etc/nginx/conf.d/tlitter.conf

# ポート 80 を公開
EXPOSE 80
