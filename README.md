# Introduction
Caddy v2 is the easiest reverse proxy ever! You'll be able to host multiple dockerized applications with one VM and one domain name! I learned from DoTheEvo https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2 but it wasn't as noob friendly for people new to linux or for people who have no idea what to do with their VMs.

Please start with the guide below that will take you from A to Z.

https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup

In addition to the application specific guides on DoTheEvo's page I added some of my own!

## Application Specific Deployments

#### Seafile
https://github.com/StarWhiz/docker_deployment_notes/tree/master/seafile

#### Wordpress
https://github.com/StarWhiz/docker_deployment_notes/tree/master/wordpress

#### Rocket.chat
https://github.com/StarWhiz/docker_deployment_notes/tree/master/rocketchat 

#### Zoneminder
https://github.com/StarWhiz/docker_deployment_notes/tree/master/zoneminder

#### ShinobiCCTV
https://github.com/StarWhiz/docker_deployment_notes/tree/master/shinobi

# Quick-References and Notes

## Most Commonly Used Commands
```
docker exec -w /etc/caddy caddy caddy reload
```
Use this command everytime you make changes to Caddyfile.

```
docker exec -t -i CONTAINERNAME /bin/bash
docker exec -t -i CONTAINERNAME /bin/sh
```
Commands to enter a container's shell. Use bash first, if that doens't work try sh.

## Most Common Docker Commands
```
docker container ls     # list all running containers
docker container ls -a  # list all containers even stopped ones
docker container rm     # remove container
docker container kill   # kill a running container


### While inside app specific folder
docker-compose restart  # restart docker stack for application
docker-compose down     # turn off application
docker-compose up       # turn on application with logs. CTRL+C to exit
docker-compose up -d    # turn on application without logs and runs in background
```

## Common lines added to docker-compose.yml files
```
services:
  exampleapp:
    ### Commonly Added To Applications
    container_name: app-name  # A container name for Caddyfile to reference to 
                              # with reverse-proxy app-name:80 for example
    restart: unless-stopped   # When your VM restarts the docker-container will start automatically
    ports:
      - "8080:80"             # Usually reverse-proxy will do. Sometimes there are cases where you need ports open.
                              # Here we open port 8080 on the host machine. It maps to port 80 inside the docker container.
    volumes:
      - ./folder:/some/pathinsidecontainer/folder    # Changes made in ./folder will appear inside the path mentioned

### The Caddy Network
networks:
  default:
    external:
      name: caddy_net
```


# Caddy v2 References
To prevent automatic HTTPS on Caddy 2, append http:// to your CaddyFile Entries. Example Below.
```
http://subdomain.yourdomain.com {
    reverse_proxy wordpress:80
}
```

You can reverse proxy to IP Address + Port instead of by container name.
```
subdomain.yourdomain.com {
    reverse_proxy 192.168.16.5:8080
}
```



