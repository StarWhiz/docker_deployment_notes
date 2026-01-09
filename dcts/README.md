This is a great alternative that's more similar to discord, and is self-hostable. Matrix is difficult and stoat / revolt is not exactly what I wanted.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── dcts/
            ├── docker-compose.yml
            ├── livekit.yaml
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
replace `dcts.yourdomain.com` with the actual subdomain you had put in as type A records in your DNS.

```
dcts.yourdomain.com {
	reverse_proxy dcts-app:2052
}
dctsvc.yourdomain.com {
	reverse_proxy dcts-livekit:7880
}
```

### docker-compose.yml
Change `YOURDBPASSWORD` in `DB_PASS`, `MARIADB_PASSWORD`, and `MARIA_RANDOM_ROOT_PASSWORD`
Change `dctsvc.yourdomain.com` with the actual subdomain you had put in as type A records in your DNS.

If you're not hosting on a VPS and are hosting at home make sure you port forward all the necessary external ports like 7881,7882, 3479, 5349.

```
services:
  dcts-app:
    image: ghcr.io/hackthedev/dcts-shipping:latest
    container_name: dcts-app
    depends_on:
      - dcts-db
      - dcts-livekit
    environment:
      - DB_HOST=dcts-db
      - DB_USER=dcts
      - DB_PASS=YOURDBPASSWORD
      - DB_NAME=dcts
      - LIVEKIT_URL=dctsvc.yourdomain.com # e.g., livekit.example.com
      - LIVEKIT_KEY=EXAMPLEKEYkqo6gZw4=
      - LIVEKIT_SECRET=EXAMPLESECRETpJQYlYQ5fkR/uY=
      - DEBUG=false # optional
    restart: unless-stopped
#    ports:
#      - 2052:2052
    volumes:
      - ./dcts/sv:/app/sv
      - ./dcts/configs:/app/configs
      - ./dcts/uploads:/app/public/uploads
      - ./dcts/emojis:/app/public/emojis
      - ./dcts/plugins:/app/plugins
    networks:
      - caddy_net

  dcts-db:
    image: mariadb:latest
    container_name: dcts-db
    environment:
      - MARIADB_RANDOM_ROOT_PASSWORD=YOURDBPASSWORD
      - MARIADB_DATABASE=dcts
      - MARIADB_USER=dcts
      - MARIADB_PASSWORD=YOURDBPASSWORD
    volumes:
      - ./dcts-db-data:/var/lib/mysql
    networks:
      - caddy_net

  dcts-redis:
    image: redis:alpine
    container_name: dcts-redis
    volumes:
      - ./dcts-redis-data:/data
    networks:
      - caddy_net

  dcts-livekit:
    image: livekit/livekit-server:latest
    container_name: dcts-livekit
    command: --config /etc/livekit.yaml
    volumes:
      - ./livekit.yaml:/etc/livekit.yaml # LiveKit Config (https://github.com/hackthedev/dcts-shipping/blob/main/livekit.yaml)
    ports:
#      - 7880:7880 # LiveKit API/WebSocket, must be reverse proxied
      - 7881:7881 # ICE/TCP signaling, expose directly
      - 7882:7882/udp # ICE/UDP mux, expose directly
      # Optional TURN ports
      - 3479:3478/udp
      - 5349:5349/tcp
    networks:
      - caddy_net

networks:
  caddy_net:
    external: true
```

### livekit.yaml
You'll need to create this file before you do a `docker compose up -d` otherwise compose will automatically create a blank directory called `livekit.yaml` which is an annoyance.

Make sure you change your keys to match what you had put in your `docker-compose.yml` above.

So please change `EXAMPLEKEYkqo6gZw4=` : and `EXAMPLESECRETpJQYlYQ5fkR/uY=` from the example below.
```
port: 7880
rtc:
    tcp_port: 7881
    udp_port: 7882
    use_external_ip: true
    enable_loopback_candidate: false
redis:
    address: dcts-redis:6379
    username: ""
    password: ""
    db: 0
    use_tls: false
turn:
    enabled: false
    domain: your_turn_domain_if_enabled # e.g., turn.example.com
    tls_port: 5349
    udp_port: 3478
    external_tls: true
keys:
    EXAMPLEKEYkqo6gZw4=: EXAMPLESECRETpJQYlYQ5fkR/uY=
```

### Finalization
After you have set up your Caddyfile, docker-compose.yml, and livekit.yaml you are ready to launch!

Simply do `docker-compose up -d` and you're instance should deploy to the url you chose.