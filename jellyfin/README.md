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
```
jelly.example.com {
    reverse_proxy jellyfin:8096
}
```

### docker-compose.yml
For the docker-compose you need to modify the the `/path/to/your/media`. You may also need to modify PUID/GUID if you have more than one linux account. Usually 1000 and 1000 will work if you followed my A-Z guide.

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