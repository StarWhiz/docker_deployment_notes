### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── rocketchat/
            ├── .env
            ├── docker-compose.yml
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
subdomain.example.com {
	reverse_proxy rocketchat:3000
}
```

### .env
Set your environment variables. SMTP service is needed if you want rocketchat to be able to send emails.
```
# General
MY_DOMAIN=example.com
DOCKER_MY_NETWORK=caddy_net

# Rocket Chat Specific
ROOT_URL=https://subdomain.example.com
SMTP_MAIL_URL=smtp.mailgun.org
ROCKETCHAT_BOT_PASSWORD=samplebotpassword
```

### docker-compose.yml
```
version: '2'

services:
  rocketchat:
    image: rocketchat/rocket.chat:latest
    container_name: rocketchat
#   ports:
#       - 3000:3000
    command: >
      bash -c
        "for i in `seq 1 30`; do
          node main.js &&
          s=$$? && break || s=$$?;
          echo \"Tried $$i times. Waiting 5 secs...\";
          sleep 5;
        done; (exit $$s)"
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
    environment:
      - PORT=3000
      - ROOT_URL=${ROOT_URL}
      - MONGO_URL=mongodb://rocketchat-db:27017/rocketchat
      - MONGO_OPLOG_URL=mongodb://rocketchat-db:27017/local
      - MAIL_URL=${SMTP_MAIL_URL}
#       - HTTP_PROXY=http://proxy.domain.com
#       - HTTPS_PROXY=http://proxy.domain.com
    depends_on:
      - rocketchat-db
    labels:
      - "traefik.backend=rocketchat"
      - "traefik.frontend.rule=Host: your.domain.tld"

  rocketchat-db:
    image: mongo:latest
    container_name: rocketchat-db
    restart: unless-stopped
    volumes:
     - ./data/db:/data/db
     #- ./data/dump:/dump
    command: mongod --smallfiles --oplogSize 128 --replSet rs0 --storageEngine=mmapv1
    labels:
      - "traefik.enable=false"

  # this container's job is just run the command to initialize the replica set.
  # it will run the command and remove himself (it will not stay running)
  rocketchat-db-init-replica:
    image: mongo:latest
    command: >
      bash -c
        "for i in `seq 1 30`; do
          mongo rocketchat-db/rocketchat --eval \"
            rs.initiate({
              _id: 'rs0',
              members: [ { _id: 0, host: 'localhost:27017' } ]})\" &&
          s=$$? && break || s=$$?;
          echo \"Tried $$i times. Waiting 5 secs...\";
          sleep 5;
        done; (exit $$s)"
    depends_on:
      - rocketchat-db

  # hubot, the popular chatbot (add the bot user first and change the password before starting this image)
  rocketchat-hubot:
    image: rocketchat/hubot-rocketchat:latest
    container_name: rocketchat-hubot    
    restart: unless-stopped
    environment:
      - ROCKETCHAT_URL=rocketchat:3000
      - ROCKETCHAT_ROOM=GENERAL
      - ROCKETCHAT_USER=bot
      - ROCKETCHAT_PASSWORD=${ROCKETCHAT_BOT_PASSWORD}
      - BOT_NAME=bot
  # you can add more scripts as you'd like here, they need to be installable by npm
      - EXTERNAL_SCRIPTS=hubot-help,hubot-seen,hubot-links,hubot-diagnostics
    depends_on:
      - rocketchat
    labels:
      - "traefik.enable=false"
    volumes:
      - ./scripts:/home/hubot/scripts
  # this is used to expose the hubot port for notifications on the host on port 3001, e.g. for hubot-jenkins-notifier

networks:
  default:
    external:
      name: ${DOCKER_MY_NETWORK}
```

### docker-compose up -d
After you have the .env and docker-compose files set up in this directory. Do a ```docker-compose up -d``` to start the containers. It should take about 30-60 seconds to launch.

### Finalization - Hubot
After you can access your rocketchat server, you can stop the hubot errors for happening by creating a new bot user in Administration > Users > + New. Then create a bot with username bot, and email bot@yourdomain.com and password to match the password you used in the .env file. Lastly, for role choose bot and hit save. Now if you do a `docker logs rocketchat-hubot` you won't see any more errors and the container will stop restarting over and over again.

While you're at it you can set up your SMTP server if you choose to under Administration > Email > SMTP
