### Minimum File structure
```
/home/
└── ~/
    └── docker/
        └── freepbx/
            ├── .env
            ├── docker-compose.yml
```

#### .env
```
DB_HOST=freepbx-db
DB_PORT=3306
DB_NAME=asterisk
DB_USER=asterisk
DB_PASS=
DB_ROOT_PASS=
```

#### docker-compose.yml
```
version: '2'

services:
  freepbx-app:
    container_name: freepbx
    image: tiredofit/freepbx
    ports:
     #### If you aren't using a reverse proxy
     #- 80:80
     #### If you want SSL Support and not using a reverse proxy
     #- 443:443
      - 5060:5060/udp
      - 5160:5160/udp
      - 18000-18100:18000-18100/udp
     #### Flash Operator Panel
      - 4445:4445
    volumes:
      - ./certs:/certs
      - ./data:/data
      - ./logs:/var/log
      - ./data/www:/var/www/html
     ### Only Enable this option below if you set DB_EMBEDDED=TRUE
     #- ./db:/var/lib/mysql
     ### You can drop custom files overtop of the image if you have made modifications to modules/css/whatever - Use with care
     #- ./assets/custom:/assets/custom

    environment: 
      - VIRTUAL_HOST=pbx.starfroz.tk
      - VIRTUAL_NETWORK=caddy_net
      - VIRTUAL_PORT=80
###      - LETSENCRYPT_HOST=hostname.example.com
###      - LETSENCRYPT_EMAIL=email@example.com

      - ZABBIX_HOSTNAME=freepbx

      - RTP_START=18000
      - RTP_FINISH=18100
    
     ## Use for External MySQL Server
      - DB_EMBEDDED=FALSE

     ### These are only necessary if DB_EMBEDDED=FALSE
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
     
    restart: always
    networks:
      - caddy_net

    ### These final lines are for Fail2ban. If you don't want, comment and also add ENABLE_FAIL2BAN=FALSE to your environment
    cap_add:
      - NET_ADMIN
    privileged: true

  freepbx-db:
    container_name: freepbx-db
    image: tiredofit/mariadb
    restart: always
    volumes:
      - ./db:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASS}
      - MYSQL_DATABASE=${DB_NAME}
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASS}
    networks:
      - caddy_net

  freepbx-db-backup:
    container_name: freepbx-db-backup
    image: tiredofit/db-backup
    links:
     - freepbx-db
    volumes:
      - ./dbbackup:/backup
    environment:
      - ZABBIX_HOSTNAME=freepbx-db-backup
      - DB_HOST=${DB_HOST}
      - DB_TYPE=mariadb
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - DB_DUMP_FREQ=1440
      - DB_DUMP_BEGIN=0000
      - DB_CLEANUP_TIME=8640
      - COMPRESSION=BZ
      - MD5=TRUE
    networks:
      - caddy_net
    restart: always

networks:
  default:
    external:
      name: caddy_net
```