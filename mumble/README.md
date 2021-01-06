```
/home/
└── ~/
    └── docker/
        └── mumble/
            ├── .env
            ├── docker-compose.yml
	        └── mumble-data
				└── config.ini
```

You will need 3 files minimum to start the mumble server.

### mumble/config.ini
```
welcometext="Welcome Text Here"
port=64738
serverpassword=sampleRegularPassword
```

### .env
```
MUMBLE_PASS=sampleRootPassword
```

### docker-compose.yml
```
version: '3.3'
services:
  mumble:
    image: phlak/mumble
    restart: unless-stopped
	container_name: mumble-server
    environment:
      - SUPERUSER_PASSWORD=${MUMBLE_PASS}
      - TZ=America/Los_Angeles
    ports:
     - 64738:64738
     - 64738:64738/udp
    volumes:
      - ./mumble-data:/etc/mumble
	  
networks:
  default:
    external:
      name: caddy_net
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
mumble.example.com {
	reverse_proxy mumble-server:64738
}
```
