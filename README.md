# gc-cloud-web
容器云前端
先安装nodejs和npm

git clone https://github.com/qiangyin/gc-cloud-web.git

npm run build

配置nginx
```
server {
    listen 8081 default_server;
    server_name 10.112.68.189;
    root /home/gc-cloud-web/build/;
    index index.html index.htm;
   location / {
    try_files $uri /index.html;
  }  
}
```
