### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── seafile/
            ├── .env
            ├── docker-compose.yml
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
subdomain.example.com {
    reverse_proxy seafile:80
}
```

### .env
set your environment variables
```
# General
MY_DOMAIN=example.com
DOCKER_MY_NETWORK=caddy_net

# Seafile Specific
MYSQL_ROOT_PASSWORD=examplepassword
SEAFILE_ADMIN_EMAIL=youremail # Specifies Seafile admin user. This is also your username
SEAFILE_ADMIN_PASSWORD=examplepass # Specifies Seafile admin password.
SEAFILE_HOSTNAME=subdomain.example.com
```

### docker-compose.yml
```
version: '2.0'
services:
  seafile-db:
    image: mariadb:10.1
    container_name: seafile-db
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}  # Requested, set the root's password of MySQL service.
      - MYSQL_LOG_CONSOLE=true
    volumes:
      - ~/docker/seafile/seafile-mysql/db:/var/lib/mysql  # Requested, specifies the path to MySQL data persistent store.

  memcached:
    image: memcached:1.5.6
    container_name: seafile-memcached
    restart: unless-stopped
    entrypoint: memcached -m 256

  seafile:
    image: seafileltd/seafile-mc:latest
    container_name: seafile
    restart: unless-stopped
    volumes:
      - ~/docker/seafile/seafile-data:/shared   # Requested, specifies the path to Seafile data persistent store.
    environment:
      - DB_HOST=seafile-db
      - DB_ROOT_PASSWD=${MYSQL_ROOT_PASSWORD}  # Requested, the value shuold be root's password of MySQL service.
      - TIME_ZONE=Etc/UTC  # Optional, default is UTC. Should be uncomment and set to your local time zone.
      - SEAFILE_ADMIN_EMAIL=${SEAFILE_ADMIN_EMAIL} # Specifies Seafile admin user, default is 'me@example.com'.
      - SEAFILE_ADMIN_PASSWORD=${SEAFILE_ADMIN_PASSWORD} # Specifies Seafile admin password, default is 'asecret'.
      - SEAFILE_SERVER_LETSENCRYPT=false  # Whether to use https or not.
      - SEAFILE_SERVER_HOSTNAME=${SEAFILE_HOSTNAME} # Specifies your host name if https is enabled.
    depends_on:
      - seafile-db
      - memcached

networks:
  default:
    external:
      name: caddy_net
```

Notes for WebDAV

You may need to add the following lines to your docker file if you plan on enabling WebDAV
```
    ports:
      - "4173:4173"
```
After that you do this open this port on your firewall and redirect it to the Docker Host's IP with seafile running on it.

### docker-compose up -d
After you have the .env and docker-compose files set up in this directory. Do a ```docker-compose up -d``` to start the containers. After they start modify seahub_settings.py, ccnet.conf, and maybe gunicorn.conf.py (if you have connnection refused issues) as shown below.

### seahub_settings.py
`sudo nano ~/docker/seafile/seafile-data/seafile/conf/seahub_settings.py`

Change FILE_SERVER_ROOT to be https instead of http.
Example Below:
```
FILE_SERVER_ROOT = "https://subdomain.example.com/seafhttp"
```

### ccnet.conf
`sudo nano ~/docker/seafile/seafile-data/seafile/conf/ccnet.conf`

Change SERVICE_URL from http to https and remove the :8000 at the end.
Example Below:
```
SERVICE_URL https://subdomain.example.com
```

### gunicorn.conf.py
`sudo nano ~/docker/seafile/seafile-data/seafile/conf/gunicorn.conf.py`

According to @DemoniWaari [#3](https://github.com/StarWhiz/docker_deployment_notes/issues/3) you may need to change the default `bind = "127.0.0.1:8000"` to `bind = "0.0.0.0:8000"` if you get a connection refused error.

### Optional: seafile.conf - changing upload file size limit
You can change your upload size limits by editing `max_upload_size=1000` seafile.conf... The number is in GBs

`sudo nano ~/docker/seafile/seafile-data/seafile/conf/seafile.conf`

# Optional: Setting Up WebDav

### Caddyfile
```
webdav.example.com {
	reverse_proxy seafile:80
}
```
Here I assigned a new subdomain webdav and point it to port 8080 which is the defualt on seafdav.conf

### seafdav.conf
```
nano ~/docker/seafile/seafile-data/seafile/conf/seafdav.conf
```
Set ```enabled=true```
Set ```share_name = /```

Remember to do a docker-compose restart and a caddy exec restart after modifying seafile conf files!
