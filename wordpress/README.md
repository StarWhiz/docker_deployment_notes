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

### Caddyfile
```
example.com {
	reverse_proxy wordpress:80
}

www.example.com {
	reverse_proxy wordpress:80
}
```

### .env
https://github.com/StarWhiz/docker_deployment_notes/blob/master/wordpress/.env
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
https://github.com/StarWhiz/docker_deployment_notes/blob/master/wordpress/docker-compose.yml
```
version: '3.1'

services:

  wordpress:
    image: wordpress
    restart: always
    environment:
      WORDPRESS_DB_HOST: wordpress-db
      WORDPRESS_DB_USER: $DB_USER
      WORDPRESS_DB_PASSWORD: $DB_PASS
      WORDPRESS_DB_NAME: $DB_NAME
    volumes:
      - ~/docker/wordpress/wordpress:/var/www/html
      - ~/docker/wordpress/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini

  wordpress-db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_DATABASE: $DB_NAME
      MYSQL_USER: $DB_USER
      MYSQL_PASSWORD: $DB_PASS
      MYSQL_ROOT_PASSWORD: $DB_ROOT_PASS
    volumes:
      - ~/docker/wordpress/wordpress-db:/var/lib/mysql

networks:
  default:
    external:
      name: $DOCKER_MY_NETWORK
```

### uploads.ini
https://github.com/StarWhiz/docker_deployment_notes/blob/master/wordpress/uploads.ini
This is used to configure your upload size limits.
```
file_uploads = On
upload_max_filesize = 2056M
post_max_size = 2056M
```