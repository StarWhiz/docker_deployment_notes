Bit.ly alternative
https://yourls.org/

This is not a full tutorial but more of a reference.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── yourls/
            ├── docker-compose.yml
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
urls.YOURDOMAIN.com {
		reverse_proxy yourls:80
}
```

### docker-compose.yml
Change YOURDATABASEPASSWORD in 2 lines and change YOURADMINUSERPASSWORD in one line from the yml below.

```
version: '3.1'

services:
  yourls:
    image: yourls
    container_name: yourls
    restart: unless-stopped
#    ports:
#      - 8080:80
    environment:
      YOURLS_DB_HOST: yourls-db
      YOURLS_DB_PASS: YOURDATABASEPASSWORD
      YOURLS_PRIVATE: "true"
      YOURLS_SITE: https://urls.YOURDOMAIN.com
      YOURLS_USER: yourls
      YOURLS_PASS: YOURADMINUSERPASSWORD

  mysql:
    image: mysql
    container_name: yourls-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: YOURDATABASEPASSWORD
      MYSQL_DATABASE: yourls

networks:
  default:
    external:
      name: caddy_net

```