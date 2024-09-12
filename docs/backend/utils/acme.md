1. 安装`acme.sh`
```shell
./acme.sh --install -m your_emial@example.com
```
2. 生成证书
```shell
acme.sh --issue -d lesscoding.net --nginx --log
```
3. 安装证书
```shell
