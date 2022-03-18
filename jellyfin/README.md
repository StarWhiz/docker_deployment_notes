Jellyfin - The Free Software Media System
https://jellyfin.org/

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── jellyfin/
            ├── .env
            ├── docker-compose.yml
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
jelly.example.com {
	reverse_proxy jellyfin:8096
}
```

### docker-compose.yml
For the docker-compose you need to modify the the `/path/to/your/media` to point to where your media is actually located. You may also need to modify PUID/GUID if you have more than one linux account. Usually 1000 and 1000 will work if you followed my A-Z guide.

Optionally you may want to open ports 7359/udp and 1900/udp on your ufw firewall so jellyfin can be discovered if it is installed on a server on your LAN. `sudo ufw allow 7359/udp comment "jellyfin discovery"` is an example command to do this.

*docker-compose.yml*
```
---
version: "2.1"
services:
  jellyfin:
    image: ghcr.io/linuxserver/jellyfin
    container_name: jellyfin
    restart: unless-stopped
    environment:
      - PUID=1000 #Do command `id yourusername` for info
      - PGID=1000
      - TZ=America/Los_Angeles
      #- UMASK_SET=<022> #optional
    volumes:
      - ./config:/config
      - /path/to/your/media:/data/media
      # - /path/to/your/media2:/data/media2   #Optional, you can add as many paths as you want...
      # - /path/to/your/anime:/data/anime     #Optional
      # - /path/to/movies:/data/movies        #Optional

    ports:
      #- 8096:8096 #We're using caddy don't need this
      #- 8920:8920 #optional HTTPS UI Cert Required. Caddy already does auto HTTPS no need.
      - 7359:7359/udp #Allows clients to discover Jellyfin on LAN
      - 1900:1900/udp #Service discovery used by DNLA and clients

networks:
  default:
    external:
      name: caddy_net
```

### Tips
If you need remote access. Make sure you login to the admin panel. Click on Networking under Advanced. Then scroll down and check a setting that says "Allow remote connections to this Jellyfin Server.
