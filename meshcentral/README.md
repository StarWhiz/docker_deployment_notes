### Introduction
This will deploy meshcentral with caddy.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── meshcentral/
            ├── .env      
            ├── docker-compose.yml
```

You will need the files in this GitHubs folder (Dockerfile, startup.sh, and config.json.template) to build the meshcentral image and deploy it.

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
meshcentral.YOURDOMAIN.com {
        reverse_proxy meshcentral:443 {
                header_up Host {http.reverse_proxy.upstream.hostport}
                header_up X-Real-IP {http.request.remote}
                header_up X-Forwarded-For {http.request.remote}
        }
}
```
### .env file
The environment variables here will generate a config in `./data/config.json` the first time you do a docker-compose up -d.

If there are any changes that need to be made aftewards, then ./data/config.json should be edited instead. [References](https://github.com/Ylianst/MeshCentral/tree/master/docker).

```
NODE_ENV=production

USE_MONGODB=false
# set already exist mongo connection string url here
MONGO_URL=
# or set following init params for new mongodb, use it with docker-compose file with mongodb version
MONGO_INITDB_ROOT_USERNAME=mongodbadmin
MONGO_INITDB_ROOT_PASSWORD=mongodbpasswd

# initial meshcentral-variables
# the following options are only used if no config.json exists in the data-folder

# your hostname
HOSTNAME=my.domain.com
# set to your reverse proxy IP if you want to put meshcentral behind a reverse proxy. Example: replace false with YOURDOMAIN.com
REVERSE_PROXY=meshcentral.yourdomain.com
REVERSE_PROXY_TLS_PORT=
# set to true if you wish to enable iframe support
IFRAME=false
# set to false if you want disable self-service creation of new accounts besides the first (admin)
ALLOW_NEW_ACCOUNTS=true
# set to true to enable WebRTC - per documentation it is not officially released with meshcentral and currently experimental. Use with caution
WEBRTC=false
# set to true to allow plugins
ALLOWPLUGINS=false
# set to true to allow session recording
LOCALSESSIONRECORDING=false
# set to enable or disable minification of json, reduces traffic
MINIFY=true
# set this value to add extra arguments to meshcentral on startup (e.g --debug ldap)
ARGS=
```
### docker-compose.yml
```
version: '3'
services:
    meshcentral:
        restart: unless-stopped
        container_name: meshcentral
        image: ghcr.io/ylianst/meshcentral:1.1.22
#        ports:
#            - 4430:443
        env_file:
          - .env
        volumes:
        # config.json and other important files live here. A must for data persistence
          - ./meshcentral/data:/opt/meshcentral/meshcentral-data
        # where file uploads for users live
          - ./meshcentral/user_files:/opt/meshcentral/meshcentral-files
        # location for the meshcentral-backups - this should be mounted to an external storage
          - ./meshcentral/backup:/opt/meshcentral/meshcentral-backups
        # location for site customization files
          - ./meshcentral/web:/opt/meshcentral/meshcentral-web

networks:
    default:
        external:
            name: caddy_net
```

## Important Step!!!
After everything is set up do `docker-compose up -d` in this folder to start meshcentral and to have it generate `./data/config.json`

Then do `docker-compose down` to bring it back down.

We need to edit `./data/config.json`. 

Change `"TLSOffload": false,"` to `"TLSOffload": true,"`... If you don't do this changes caddy reverse proxy will not be able to route to the container properly!

```

  "$schema": "https://raw.githubusercontent.com/Ylianst/MeshCentral/master/meshcentral-config-schema.json",
  "settings": {
    "plugins":{"enabled": true},
    "_mongoDb": null,
    "cert": "meshcentral.yourdomain.com",
    "_WANonly": true,
    "_LANonly": true,
    "sessionKey": "KEYGENERATEDBYDOCKERCOMPOSEUPD",
    "port": 443,
    "_aliasPort": 443,
    "redirPort": 80,
    "_redirAliasPort": 80,
    "AgentPong": 300,
    "TLSOffload": true,
    "SelfUpdate": false,
    "AllowFraming": false,
    "WebRTC": false
  },

```

Save.

And then do `docker-compose up -d` to spin up the instance. It should now be reachable at meshcentral.yourdomain.com! Go ahead and create your account!

