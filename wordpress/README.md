# Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── wordpress/
            ├── .env
            ├── docker-compose.yml
            ├── uploads.ini
```

### Add to Caddyfile (from ~/docker/caddy)
You may have done this already if you followed the [A-Z Guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup#create-caddyfile) If not, do so and remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
example.com {
	reverse_proxy wordpress:80
}

www.example.com {
	reverse_proxy wordpress:80
}
```


### uploads.ini
Make sure you create this file otherwise you can't adjust size limits.
```
file_uploads = On
upload_max_filesize = 2056M
post_max_size = 2056M
```

### .env
```
# General
MY_DOMAIN=example.com
DOCKER_MY_NETWORK=caddy_net

# Wordpress
DB_USER=wordpress
DB_PASS=wordpresspass
DB_NAME=wordpress
DB_ROOT_PASS=rootpass
```

### docker-compose.yml
```
version: '3.1'

services:

  wordpress:
    image: wordpress
    restart: unless-stopped
    container_name: wordpress
    environment:
      WORDPRESS_DB_HOST: wordpress-db
      WORDPRESS_DB_USER: $DB_USER
      WORDPRESS_DB_PASSWORD: $DB_PASS
      WORDPRESS_DB_NAME: $DB_NAME
    volumes:
      - ./wordpress:/var/www/html
      - ./uploads.ini:/usr/local/etc/php/conf.d/uploads.ini

  wordpress-db:
    image: mysql:5.7
    restart: unless-stopped
    container_name: wordpress-db
    environment:
      MYSQL_DATABASE: $DB_NAME
      MYSQL_USER: $DB_USER
      MYSQL_PASSWORD: $DB_PASS
      MYSQL_ROOT_PASSWORD: $DB_ROOT_PASS
    volumes:
      - ./wordpress-db:/var/lib/mysql

networks:
  default:
    external:
      name: $DOCKER_MY_NETWORK
```

### Optional: What if you want to do multiple wordpress pages?
Simple... Just repeat with the following changes. Below is an example for a new app folder called wordpress2"
```
/home/
└── ~/
    └── docker/
        └── wordpress2/
            ├── .env
            ├── docker-compose.yml
            ├── uploads.ini
```
First you duplicate .env and uploads.ini inside the new directory wordpress2, but then you modify the docker-compose.yml.
Modify 3 areas in docker-compose.yml from "wordpress" to "wordpress2"
```
  wordpress:
    ...
    container_name: wordpress2
    environment:
      WORDPRESS_DB_HOST: wordpress2-db
    ...
  wordpress-db:
    ...
    container_name: wordpress2-db
    ...
```
Add a subdomain to Caddyfile and point it to wordpress2
```
secondsite.example.com {
    reverse_proxy wordpress2:80
}
```
`docker exec -w /etc/caddy caddy caddy reload`

Then `docker-compose up -d` inside the wordpress2 folder.

As you can see we basically wrote in wordpress2 for everything. If you want more instances you can do wordpress3... wordpress4... and so on.

