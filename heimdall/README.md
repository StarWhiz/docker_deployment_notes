Heimdall Application Dashboard

Official Site: https://heimdall.site/

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── heimdall/
            ├── docker-compose.yml
```
### docker-compose.yml
```
version: "2.1"
services:
  heimdall:
    image: linuxserver/heimdall
    container_name: heimdall
    hostname: heimdall
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
    volumes:
      - ./config:/config
    restart: unless-stopped

networks:
  default:
    external:
      name: caddy_net
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
heimdall.example.com {
    reverse_proxy heimdall:80
}
```
