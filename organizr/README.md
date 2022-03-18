Organizr Application Dashboard

Official Site: https://organizr.app/

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── organizr/
            ├── docker-compose.yml
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
organizr.example.com {
	reverse_proxy organizr:80
}
```

### docker-compose.yml
```
version: "2.1"
services:
  organizr:
    image: organizr/organizr
    container_name: organizr
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