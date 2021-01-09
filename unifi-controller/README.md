### Tips
Don't even use caddy for this deployment I don't know how to make it work. 

Just use the forwarded ports. Make sure UFW allows all the required ports such as 3478, 10001, 8080, etc...

After `docker-compose up -d`. Navigate to HOSTIPADDRESS:8080 to access the controller.

### Minimum File structure
```
/home/
└── ~/
    └── docker/
        └── unifi/
            ├── docker-compose.yml
```

### docker-compose.yml
```
---
version: "2.1"
services:
  unifi-controller:
    image: ghcr.io/linuxserver/unifi-controller
    container_name: unifi-controller
    environment:
      - PUID=1000
      - PGID=1000
      - MEM_LIMIT=1024M #optional
    volumes:
      - ./config:/config
    ports:
      - 3478:3478/udp
      - 10001:10001/udp
      - 8080:8080 # Web Port HTTP
	  - 6789:6789 #optional
      - 8443:8443 # Web Port HTTPS
#      - 1900:1900/udp #optional
#      - 8843:8843 #optional
#      - 8880:8880 #optional
#      - 5514:5514 #optional
    restart: unless-stopped
	
networks:
  default:
    external:
      name: caddy_net
```