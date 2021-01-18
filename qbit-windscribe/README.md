### Tips
You need a reverse proxy to access WebUI when windscribe is running. The reason for this is because lanbypass in windscribe only applies to the LAN inside the docker container's network. Only other docker containers on the same network can access the webUI.

Good used in conjunction with CloudCmd or PureFTPd

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
qbit.yourdomain.com {
    reverse_proxy qbit-windscribe:8080
}
```

### .env
```
TZ='America/Los_Angeles'
WIND_USER=
WIND_PASS=
WIND_PORT=
```

### docker-compose.yml
```
version: "2.1"
services:
  docker-windscribe-qbittorrent:
    image: engrdudes/windscribe-qbittorrent
    container_name: qbit-windscribe
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TZ}
      - WINDSCRIBE_USERNAME=${WIND_USER}
      - WINDSCRIBE_PASSWORD=${WIND_PASS}
      - WINDSCRIBE_PROTOCOL=stealth
      - WINDSCRIBE_PORT=80
      - WINDSCRIBE_PORT_FORWARD=${WIND_PORT}
      - WINDSCRIBE_LOCATION=US
      - WINDSCRIBE_LANBYPASS=on
      - WINDSCRIBE_FIREWALL=on
    volumes:
      - ./config:/config
      - ./data:/data
#    ports:
#      - 8080:8080
    dns:
      - 8.8.8.8
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
	
networks:
  default:
    external:
      name: caddy_net
```
