A simple Kanban Board
https://kanboard.org/

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── kanboard/
            ├── docker-compose.yml
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
kanboard.YOURDOMAIN.com {
        reverse_proxy kanboard:80
}
```

### docker-compose.yml
```
version: '2'

services:
  kanboard:
    image: kanboard/kanboard:latest
    container_name: kanboard
    restart: unless-stopped
#    ports:
#      - "80:80"
#      - "443:443"
    volumes:
      - ./kanboard_data:/var/www/app/data
      - ./kanboard_plugins:/var/www/app/plugins
      - ./kanboard_ssl:/etc/nginx/ssl
      - ./config.php:/var/www/app/config.php

networks:
  default:
    external:
      name: caddy_net

```