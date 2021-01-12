### Minimum File structure
```
/home/
└── ~/
    └── docker/
        └── pureftpd/
            ├── .env
            ├── docker-compose.yml
```

### Notes
Make sure port 521 is open and 30000-30009 on your firewall or ufw. Do not use Caddy for this. Just `docker-compose up -d` in side the folder when you are done. You can do this with

```
sudo ufw allow 521/tcp comment "PureFTPd"
sudo ufw allow 30000:30009/tcp comment "PureFTPd"
```

Connect to the ftp server with your IP:521 and the USERNAME + PASS set in .env.

### .env
```
FTP_USER_NAME=
FTP_USER_PASS=
FTP_USER_HOME=/home/
```

### docker-compose.yml
In this docker compose example we are mounting your current user's home folder to the folder called mountedfolder inside the docker container. You can see this under the line containing `- "~/:/home/mountedfolder"`

```
version: '3'

services:
  ftpd_server:
    image: stilliard/pure-ftpd
    container_name: ftp
    ports:
      - "521:21"
      - "30000-30009:30000-30009"
    volumes:
      - "~/:/home/mountedfolder"
      - "./passwd:/etc/pure-ftpd/passwd"
# uncomment for ssl/tls
#      - "./:/etc/ssl/private/"
    environment:
      PUBLICHOST: "localhost"
      FTP_USER_NAME: ${FTP_USER_NAME}
      FTP_USER_PASS: ${FTP_USER_PASS}
      FTP_USER_HOME: ${FTP_USER_HOME}
# also for ssl/tls:
#      ADDED_FLAGS: "--tls=2"
    restart: unless-stopped

```