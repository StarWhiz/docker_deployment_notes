# Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── zoneminder/
            ├── .env
            ├── docker-compose.yml
```

# Caddyfile
```
zoneminder.yourdomain.com {
    reverse_proxy zoneminder:80
}
```

# docker-compose.yml
Notes on some compose settings.
Why is priviledged set to true? So the docker container can access system resources like a CUDA GPU for object detection.
Timezone should be adjusted to your time zone.

WIP: In the original compose, network_mode: "bridge" , was added I left it here but you can remove it. There should be a way for the docker to detect the cameras via IP addresses on your own network. I'm not certain about this line.

```
version: '3.1'
services:
    zoneminder:
        container_name: zoneminder
        image: dlandon/zoneminder.master:latest
        restart: unless-stopped
		network_mode: "bridge"
        privileged: true
        environment:
            - TZ=America/Los_Angeles
            - SHMEM=50%
            - PUID=99
            - PGID=100
            - INSTALL_HOOK=0
            - INSTALL_FACE=1
            - INSTALL_TINY_YOLO3=0
            - INSTALL_YOLO3=0
            - INSTALL_TINY_YOLO4=0
            - INSTALL_YOLO4=0
            - MULTI_PORT_START=0
            - MULTI_PORT_END=0
        volumes:
            - ./config:/config:rw
            - ./data:/var/cache/zoneminder:rw
            
networks:
  default:
    external:
      name: caddy_net
```

# other notes
Certificates are located in /config/keys/
