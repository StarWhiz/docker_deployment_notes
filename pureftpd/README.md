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
Make sure port 521 is open on your firewall. Do not use Caddy for this. Just `docker-compose up -d` when you are done.

Connect to the ftp server with your IP:521 and the USERNAME + PASS set in .env.

### .env
```
FTP_USER_NAME=
FTP_USER_PASS=
FTP_USER_HOME=/home/
```

### docker-compose.yml
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
      - "./:/home/admin/test"
      - "./:/etc/pure-ftpd/passwd"
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