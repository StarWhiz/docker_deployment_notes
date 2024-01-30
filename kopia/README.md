### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── kopia/
            ├── .env
            ├── docker-compose.yml
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
kopia.YOURDOMAIN.com {
  reverse_proxy kopia:51515 {
    transport http {
      tls
      tls_insecure_skip_verify
    }
  }
}
```

### docker-compose.yml
```
services:
  kopia:
    image: kopia/kopia:latest
    container_name: kopia
    hostname: kopia
    restart: unless-stopped
    env_file: .env
    privileged: true
    cap_add:
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    devices:
      - /dev/fuse:/dev/fuse:rwm
    ports:
      - "51515:51515"
    command:
      - server
      - start
      - --tls-generate-cert
      - --disable-csrf-token-checks
      - --address=0.0.0.0:51515
      - --server-username=$USERNAME
      - --server-password=$KOPIA_PASSWORD
    volumes:
        # Mount local folders needed by kopia
        - ./kopia_config:/app/config
        - ./kopia_cache:/app/cache
        - ./kopia_logs:/app/logs
        # Mount local folders to snapshot (wordpress is used as example here)
        - ~/docker/wordpress:/wordpress:ro
        # Optional: Mount rclone configuration files from kopia for rclone repositories
        - ./kopia_rclone:/app/rclone
        # Mount path for browsing mounted snaphots
        - ./kopia_tmp:/tmp:shared
#       # Mount repository location
#       - /mnt/mirror/kopia_repository:/repository
    environment:
      KOPIA_PASSWWORD: ${KOPIA_PASSWORD}
      KOPIA_PERSIST_CREDENTIALS_ON_CONNECT: "true"
      TZ: America/Los_Angeles

networks:
  default:
    name: $DOCKER_MY_NETWORK
    external: true

```

### .env file
Change SOMESTRONGPASSWORD to a password you would like to use to login into the Web GUI. This should also be used as your repository password. If you don't use this password as your repostiory password you will run into [issue #2370](https://github.com/kopia/kopia/issues/2370). When asked to "Enter a strong password to create Kopia repository in the provided storage." during repository creation make sure you enter in this password.
```
DOCKER_MY_NETWORK=caddy_net
TZ=America/Los_Angeles
# KOPIA
USERNAME=admin
KOPIA_PASSWORD=SOMESTRONGPASSWORD
```

### Optional rclone config inside the container
This is needed to make your rclone remote
```
docker exec -ti kopia /bin/bash
cd /app/rclone/
ls
rclone config
```
From there follow the rclone config prompts to continue and finish setting up your rclone connection. Rclone for Kopia has only been officially tested to work with Dropbox, OneDrive, and Google Drive.

Check if the connection to the remote is working with the command belo winside the command
```
rclone ls YOURREMOTENAME:
```

### Optional: Edit Global Policy to match StarWhiz's Config
Login to the GUI
Edit compression to zstd-fastest
Edit scheduling to 12 hours