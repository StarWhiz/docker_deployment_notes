### Introduction
This will deploy meshcentral with caddy.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── meshcentral/
            ├── docker-compose.yml
```

You will need the files in this GitHubs folder (Dockerfile, startup.sh, and config.json.template) to build the meshcentral image and deploy it.

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
meshcentral.YOURDOMAIN.com {
        reverse_proxy meshcentral:4430 {
                header_up Host {http.reverse_proxy.upstream.hostport}
                header_up X-Real-IP {http.request.remote}
                header_up X-Forwarded-For {http.request.remote}
        }
}
```

### docker-compose.yml
Replace YOURDOMAIN.com with your actual domain.

```
version: '3'
services:
    meshcentral:
        restart: unless-stopped
        container_name: meshcentral
        image: ghcr.io/ylianst/meshcentral:1.1.22
#        ports:
#            - 4430:4430  #I Used 4430 because caddy v2 doesn't play well with a container using port 443. Can change 4430 to something else in the environment var CONTAINER_PORT below 
        environment:
            - HOSTNAME=meshcentral.YOURDOMAIN.com
            - CONTAINER_PORT=4430
            - REVERSE_PROXY=YOURDOMAIN.com
            - REVERSE_PROXY=true
            - REVERSE_PROXY_TLS_PORT=443
            - IFRAME=false
            - ALLOW_NEW_ACCOUNTS=true
            - WEBRTC=true
        volumes:
            - ./data:/opt/meshcentral/meshcentral-data    #config.json and other important files live here. A must for data persistence
            - ./user_files:/opt/meshcentral/meshcentral-files    #where file uploads for users live
            - ./web:/opt/meshcentral/meshcentral-web # location for site customization files

networks:
    default:
        external:
            name: caddy_net

```

After everything is set up do `docker-compose up -d` in this folder to start meshcentral!

