[Snipe-IT](https://snipeitapp.com/) is an open-source asset management software.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── snipeit/
            ├── .env
            ├── docker-compose.yml
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
snipeit.example.com {
	reverse_proxy wordpress:80
}
```

### .env
Set your environment variables. SMTP details are optional if you want snipeIT to be able to send emails.

```
# .env
APP_URL="https://snipe.example.com"

# SnipeIT MySQL DB
DB_USER=snipeit
DB_PASS=YourPasswordHere
DB_NAME=snipeit
DB_ROOT_PASS=YourRootPasswordHere

# SMTP
APP_TIMEZONE=America/Los_Angeles
MAIL_PORT_587_TCP_ADDR=
MAIL_PORT_587_TCP_PORT=
MAIL_ENV_FROM_ADDR=
MAIL_ENV_FROM_NAME=
MAIL_ENV_ENCRYPTION=tls
MAIL_ENV_USERNAME=
MAIL_ENV_PASSWORD=
```

### docker-compose.yml
```
version: "3"
services:
  snipe_mysql:
    image: mysql:5
    container_name: snipe_mysql
    restart: unless-stopped
    volumes:
      - ./mysql:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASS}
      - MYSQL_USER=${DB_NAME}
      - MYSQL_PASSWORD=${DB_PASS}
      - MYSQL_DATABASE=${DB_NAME}

  snipeit:
    image: linuxserver/snipe-it:latest
    container_name: snipeit
    restart: unless-stopped
    depends_on:
      - snipe_mysql
    volumes:
      - ./config:/config
    environment:
      - APP_URL=${APP_URL}
      - MYSQL_PORT_3306_TCP_ADDR=snipe_mysql
      - MYSQL_PORT_3306_TCP_PORT=3306
      - MYSQL_DATABASE=${DB_NAME}
      - MYSQL_USER=${DB_NAME}
      - MYSQL_PASSWORD=${DB_PASS}
      - MAIL_PORT_587_TCP_ADDR=${MAIL_PORT_587_TCP_ADDR}
      - MAIL_PORT_587_TCP_PORT=${MAIL_PORT_587_TCP_PORT}
      - MAIL_ENV_FROM_ADDR=${MAIL_ENV_FROM_ADDR}
      - MAIL_ENV_FROM_NAME=${MAIL_ENV_FROM_NAME}
      - MAIL_ENV_ENCRYPTION=${MAIL_ENV_ENCRYPTION}
      - MAIL_ENV_USERNAME=${MAIL_ENV_USERNAME}
      - MAIL_ENV_PASSWORD=${MAIL_ENV_PASSWORD}
      - PGID=1000
      - PUID=1000
#    ports:
#      - "8080:80"

networks:
  default:
    external:
      name: caddy_net
```