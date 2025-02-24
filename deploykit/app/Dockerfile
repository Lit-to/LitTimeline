FROM ubuntu:latest
# パッケージのインストール

RUN apt update && apt install -y
RUN apt install -y bash
RUN apt install -y npm
RUN apt install -y gedit
RUN apt install -y git
RUN apt install -y curl
RUN apt install -y vim
RUN apt install -y tar
RUN apt install -y gzip
RUN apt install -y bzip2
RUN apt install -y gnupg2
RUN apt install -y lsb-release
RUN apt install -y ca-certificates

# nodeのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_23.x | bash - && apt install -y nodejs
COPY clone.sh clone.sh
COPY accesstoken accesstoken

# クローン
RUN chmod 755 clone.sh
RUN ["/bin/bash","-c","./clone.sh accesstoken"]
# 必要ないものは削除
RUN rm -rf accesstoken
RUN rm -rf clone.sh

# expressのインストール
RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install 23"]
RUN npm install express -g
RUN npm install express-generator -g
RUN npm install -g vite
RUN ["/bin/bash","-c","cd /LitTimeline/litter-app && npm install 23"]

WORKDIR /LitTimeline

