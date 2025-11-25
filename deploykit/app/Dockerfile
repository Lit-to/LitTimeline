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

# クローン
RUN ["/bin/bash","-c","mkdir -p /root/.ssh/ && chmod 700 /root/.ssh/"]
COPY key /root/.ssh/id_ed25519
RUN chmod 600 /root/.ssh/id_ed25519
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN git clone git@github.com:Lit-to/LitTimeline.git

# expressのインストール
RUN npm install express -g
RUN npm install express-generator -g
RUN npm install -g vite


RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install 23"]
RUN ["/bin/bash","-c","cd /LitTimeline/litter-app && npm install 23"]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install react-dom@^19.0.0" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install react-modal@^3.16.3" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install react-router-dom@^7.2.0"  ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install bootstrap" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter && npm install cors" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter-app && npm install mysql2" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter-app && npm install uuid" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter-app && npm install module" ]
# RUN ["/bin/bash","-c","cd /LitTimeline/litter-app && npm install dotenv" ]

# mysqlクライアントのインストール
RUN ["apt-get","-y","install","mysql-client"]

WORKDIR /LitTimeline
ENV TZ=Asia/Tokyo
