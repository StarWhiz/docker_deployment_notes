### Minimum File structure
```
/home/
└── ~/
    └── docker/
        └── cloudcmd/
            ├── docker-compose.yml
```

### docker-compose.yml
```
version: '2'
services:
  cloudcmd-web:
    container_name: cloudcmd
#    ports:
#      - 8000:8000
    volumes:
      - ./root:/root          #I don't understand this one.
      - ./mountpoint:/mnt/fs  
    image: coderaiser/cloudcmd

networks:
  default:
    external:
      name: caddy_net
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
cloud.yourdomain.com {
    reverse_proxy cloudcmd:8000
}
```

