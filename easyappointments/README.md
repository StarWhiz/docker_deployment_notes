[Easy!Appointments - Self Hosted Appointment Scheduler by alextselegidis](https://github.com/alextselegidis/easyappointments)

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── easyappointments/
            └── docker/
```

The file structure here is slightly different from usual since we will be cloning a git repository to install this. Below are the steps needed to fully deploy easyappointments with our Caddy reverse proxy!

### 1. Clone repository, navigate to repostitory directory, and optionally check out the develop branch
```
cd ~/docker/
git clone https://github.com/alextselegidis/easyappointments.git
cd easyappointments
git checkout -b develop
```

### 2. Copy composer.json and composer.lock to ./docker/server
```
cp composer.lock docker/server
cp composer.json docker/server
```

### 3. Copy config-sample.php to config.php in the root repository and modify BASE_URL in config.php
Also change the database in config.php from `localhost` to `easyappointments-database:3306`
```
cp config-sample.php config.php
nano config.php
```

**config.php**
```
    // ------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------

    const BASE_URL      = 'https://appointments.example.com';
    const LANGUAGE      = 'english';
    const DEBUG_MODE    = FALSE;

    // ------------------------------------------------------------------------
    // DATABASE SETTINGS
    // ------------------------------------------------------------------------

    const DB_HOST       = 'easyappointments-database:3306';
    const DB_NAME       = 'easyappointments';
    const DB_USERNAME   = 'root';
    const DB_PASSWORD   = 'root';
```

### 4. Modify permissions of the storage folder in the repository
```
chown -R www-data:www-data storage/
chmod -R 777 storage/
```

### 5. Modify the Dockerfile in ./docker/server from the root repository
```
nano docker/server/Dockerfile
```
**Dockerfile**
```
FROM php:7.4-apache

ENV COMPOSER_ALLOW_SUPERUSER=1

COPY --from=composer /usr/bin/composer /usr/bin/composer
WORKDIR "/var/www/html"

COPY  composer.json /var/www/html/
COPY  composer.lock /var/www/html/

RUN  apt-get update && apt-get install -y zip unzip git libpng-dev

RUN docker-php-ext-install gd

RUN composer install --no-scripts --no-interaction --optimize-autoloader

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd gettext mysqli pdo_mysql

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

RUN a2enmod rewrite
```

6. Modify docker-compose inside ./docker/ folder of the root repository
**docker-compose.yml**
```

version: "3.1"
services:
    mysql:
        image: mysql:5.7
        container_name: easyappointments-database
        volumes:
            - ./mysql:/var/lib/mysql
        environment:
            - MYSQL_ROOT_PASSWORD=root
            - MYSQL_DATABASE=easyappointments
#        ports:
#            - "8001:3306"
    server:
        build: ./server
        image: easyappointments-server:v1
        container_name: easyappointments-server
#        ports:
#            - "8000:80"
        volumes:
            - ../:/var/www/html
            - /var/www/html/vendor
            - ./server/php.ini:/usr/local/etc/php/conf.d/99-overrides.ini

networks:
    default:
        external:
            name: caddy_net
```


### 7. Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
appointments.example.com {
	reverse_proxy easyappointments-server:80
}
```

### 8. Deploy Application
```
cd ~/docker/easyappointments/docker/
docker-compose up -d
```

If there are issues you can try to debug by changing debug mode to TRUE in step 3.
