FROM nginx:stable-alpine
RUN apk update && apk add --no-cache bash
RUN apk add --no-cache nano
RUN apk add --no-cache nano

COPY conf.d /etc/nginx/conf.d
# ポート 80 を公開
EXPOSE 80

