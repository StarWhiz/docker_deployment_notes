Another shortlink alternative https://shlink.io/

This is not a full tutorial but more of a reference.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── shlink/
            ├── docker-compose.yml
            ├── servers.json
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
urls.YOURDOMAIN.com {
	reverse_proxy shlink:8080
}
```

### docker-compose.yml
Change urls.YOURDOMAIN.com under DEFAULT_DOMAIN

Change SOMESTRONGPASSWORD twice.

Change GEOLITE_LICENSE_KEY=yoUR1ge2OliTE3key1 (how to get your key here: https://shlink.io/documentation/geolite-license-key/)

```
version: '3.3'
services:
  shlink:
    image: shlinkio/shlink:stable
    container_name: shlink
    restart: unless-stopped
#    ports:
#      - '8080:8080'
    environment:
      - DEFAULT_DOMAIN=urls.YOURDOMAIN.com
      - IS_HTTPS_ENABLED=true
# How to Get Geo License Key https://shlink.io/documentation/geolite-license-key/
      - GEOLITE_LICENSE_KEY=yoUR1ge2OliTE3key1
      - DB_DRIVER=postgres
      - DB_USER=postgres
      - DB_PASSWORD=SOMESTRONGPASSWORD
      - DB_HOST=shlink-db
    depends_on:
      - shlink-db

  shlink-db:
    image: postgres:12.2-alpine
    container_name: shlink-db
    restart: unless-stopped
    image: postgres:12.2-alpine
    volumes:
    - ./data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: SOMESTRONGPASSWORD
      POSTGRES_DB: shlink
      PGDATA: /var/lib/postgresql/data/pgdata

networks:
  default:
    external:
      name: caddy_net
```
Save the docker-compose.yml

Run `docker-compose up -d` for the first time to bring up the instance. Then run the command `docker exec -it shlink shlink api-key:generate` to get your API key. You'll need this key to "login" into the webapp.

Visit https://app.shlink.io/ add your server details. The Name is arbitrary. The URL is urls.YOURDOMAIN.com and the API key is the key you generated from `docker exec -it shlink shlink api-key:generate`
