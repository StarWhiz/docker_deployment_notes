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
u.YOURDOMAIN.com {
	reverse_proxy shlink-web:80
}
urls.YOURDOMAIN.com {
	reverse_proxy shlink:8080
}
```



### docker-compose.yml
Change urls.YOURDOMAIN.com under DEFAULT_DOMAIN
Change SOMESTRONGPASSWORD twice.
Change GEOLITE_LICENSE_KEY= (how to get your key here: https://shlink.io/documentation/geolite-license-key/)

On your first docker-compose up -d run the command `docker exec -it shlink shlink api-key:generate` to get your API key. You'll need this key for the servers.json file.

then do `docker-compose down` we will bring it back up after creating servers.json below this section.

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

  shlink-web:
    image: shlinkio/shlink-web-client
    container_name: shlink-web
    restart: unless-stopped
    volumes:
      - ./servers.json:/usr/share/nginx/html/servers.json

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

### servers.json
Get API key from the steps described above.

```
[
  {
    "name": "My URL Shortener",
    "url": "https://urls.YOURDOMAIN.com",
    "apiKey": "gibberish-3u10-0129-471j-9140aj2010e9r"
  }
]
```
After you have servers.json and docker-compose.yml set up. Run `docker-compose up -d` one last time.

Visit https://u.YOURDOMAIN.com not https://urls.YOURDOMAIN.com to access the web app.