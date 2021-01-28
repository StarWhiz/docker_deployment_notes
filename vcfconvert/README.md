This one is for mainly my own reference that is why it isn't listed on the main README.md in this repository.

For this project, I used the [symfony](https://github.com/kasteckis/symfony-docker-compose) docker container to host a php application, [vCard to LDIF/CSV Converter](https://github.com/thomascube/vcfconvert) by u/thomascube.

Symfony can help you host any php application. For this example, I selfhost vcfconvert.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── vcfconvert/
		    ├── .docker <-- This is a directory
			    ├── Dockerfile
				├── virtualhost.conf
            ├── docker-compose.yml
			├── <PHP APPLICATION FILES>
			
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
vcfconvert.yourdomain.com {
    reverse_proxy vcfconvert:80
}
```

### .docker/Dockerfile
The only thing you need to change in this file is the second line `RUN echo "ServerName vcfconvert.yourdomain.com" >> /etc/apache2/apache2.conf` use your own domain here.

```
# Use image which contains apache with php
FROM php:7.4.13-apache
RUN echo "ServerName vcfconvert.yourdomain.com" >> /etc/apache2/apache2.conf
RUN apt-get update && apt-get upgrade -y
# Install packages needed to install php extensions
RUN apt-get install git zlib1g-dev libxml2-dev libzip-dev zip unzip -y
# Install PHP extensions
RUN docker-php-ext-install zip intl mysqli pdo pdo_mysql opcache
# Install NPM
RUN apt-get install npm -y
# Upgrade npm to latest version
RUN npm install -g npm
# Install node manager - n
RUN npm install -g n
# Install latest stable node version
RUN n stable
# Install sass compiler
RUN npm install -g sass
# Install XDEBUG
RUN pecl install xdebug-2.9.8 && docker-php-ext-enable xdebug
RUN echo 'xdebug.remote_port=9000' >> /usr/local/etc/php/php.ini
RUN echo 'xdebug.remote_enable=1' >> /usr/local/etc/php/php.ini
RUN echo 'xdebug.remote_connect_back=1' >> /usr/local/etc/php/php.ini
# Install composer command
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer
# Install symfony command
RUN curl -sS https://get.symfony.com/cli/installer | bash && mv /root/.symfony/bin/symfony /usr/local/bin/symfony
# Set umask to 0000 (newly created files will have 777 permissions)
RUN echo "umask 0000" >> /root/.bashrc
```

### .docker/virtualhost.conf
Again change the second line to your own domain. `ServerName vcfconvert.yourdomain.com`
```
 <VirtualHost *:80>
    ServerName vcfconvert.yourdomain.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/
    DirectoryIndex /index.php

    <Directory /var/www/html/public>
        AllowOverride None
        Order Allow,Deny
        Allow from All

        FallbackResource /index.php
    </Directory>

    <Directory /var/www/html/public/bundles>
        FallbackResource disabled
    </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

```

### docker-compose.yml
Here you want to focus on the `web:` section. 

Here I added the caddy network which is similar to all my previous self-hosted docker apps. This is so I can have caddy reverse proxy into the php app's container.

For the volumes. I wrote in the path of the directory that contains the `index.php` file and point it to `/var/www/html/` in the container. 

```
version: "3"
services:
  mysql:
    image: mysql:5.7
    container_name: project_mysql
    restart: unless-stopped
    networks:
      default:
        ipv4_address: 192.168.2.3
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: "true"
      MYSQL_ROOT_PASSWORD:
      MYSQL_DATABASE: project
      MYSQL_USER: root
      MYSQL_PASSWORD:
    ports:
      - "9906:3306"
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: project_phpmyadmin
    links:
      - mysql
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      PMA_ARBITRARY: 1
    networks:
      default:
        ipv4_address: 192.168.2.4
    ports:
      - 81:80

  web:
    build: ./.docker
    container_name: vcfconvert
    networks:
      default:
        ipv4_address: 192.168.2.2
      caddy:
    volumes:
      - ./:/var/www/html/
      - ./.docker/virtualhost.conf:/etc/apache2/sites-available/000-default.conf
    ports:
      - "9080:80"
    depends_on:
      - "mysql"

  mailhog:
    image: mailhog/mailhog
    container_name: project_mailhog
    ports:
      - 1025:1025 # smtp server
      - 8025:8025 # web ui
    networks:
      default:
        ipv4_address: 192.168.2.5

networks:
  default:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 192.168.2.0/24 # If you change this, make sure to change other IP addresses
  caddy:
    external:
      name: caddy_net
```





vCard to LDIF/CSV Converter
===========================
by Thomas Bruederli

To run this converter just copy all files to a webserver directory where PHP
is installed and enabled. Open your browser and type in the URL of your
webserver with the according folder. By default, file uploads up to 2MB are 
allowed.

Command line version
--------------------
This package also includes a shell script to invoke the converter from the
command line. PHP is also required to be installed on your machine.
Just copy the files anywhere on your disk, open a terminal and type the
following commands:

	$ cd /path/to/vcfconvert
	$ ./vcfconvert.sh -f ldif -o destination_file.ldif source_file.vcf
or

	$ ./vcfconvert.sh -hv -f csv -d ";" -o destination_file.csv source_file.vcf

To get information about optinal parameters, type

	$ ./vcfconvert.sh help

LICENSE
-------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License,
or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see [www.gnu.org/licenses/][gpl2].

For any bug reports or feature requests please open issue tickets at
[github.com/thomascube/vcfconvert][github].


#### Note from Kevin on libdlusb compatibility
Due to the fact libdlusb is incapable of transmitting all the information
generally used with the contact application (currently it is capable of 
only transmitting name, type, and phone number) I have intentionally organized
the format to be convenient for saving into the note application instead. This 
allows the user to have multiple phone numbers per entry along with an e-mail
address.

[gpl2]:        http://www.gnu.org/licenses/gpl2.txt
[github]:      http://github.com/thomascube/vcfconvert

