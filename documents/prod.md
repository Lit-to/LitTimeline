
本番にインストールするもの   

-   dockerを入れるよ
-   ※基本的には documents/deploy.md に置いてある通りに進めれば良い

-   メモ:ubuntuへのdockerのインストール

```sh
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```

```sh
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```
```sh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
```sh
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

-   nanoエディタとgitのインストール

```sh
sudo apt install nano
```
```sh
sudo apt install git
git install https://github.com/Lit-to/LitTimeline.git
```
