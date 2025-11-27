#!/bin/bash

# プロジェクトA
(cd ./litter && npm start) &

# プロジェクトB
(cd ./litter-app && npm start) &

wait

# netsh interface portproxy add v4tov4 listenaddress=192.168.128.177 listenport=3000 connectaddress=127.0.0.1 connectport=3000
# netsh interface portproxy add v4tov4 listenaddress=192.168.128.177 listenport=5173 connectaddress=127.0.0.1 connectport=5173

