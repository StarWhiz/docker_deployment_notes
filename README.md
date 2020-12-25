# Introduction
Caddy v2 is the easiest reverse proxy ever! You'll be able to host multiple dockerized applications with one VM and one domain name! I learned from [DoTheEvo](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2), but their guide assumes you already installed docker and docker-compose. From my [A-Z guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup)... you be handheld from the beginning. In addition to the app specific guides on DoTheEvo's page I also added some of my own!

Anyways please start with the [A-Z Guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup) guide below which will take you from base Ubuntu 20.04 to having docker, docker-compose, caddy v2 installed.

## A to Z Guide (Start Here)
https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup

After you finish the A-Z guide. You can then follow application specific guides from me below. Or from [DoTheEvo](https://github.com/DoTheEvo/selfhosted-apps-docker) for other apps.

## Application Specific Deployment Guides

##### [FreePBX+Asterisk](https://github.com/StarWhiz/docker_deployment_notes/tree/master/freepbx-asterisk)
##### [PureFTPd](https://github.com/StarWhiz/docker_deployment_notes/tree/master/pureftpd)
##### [qBit+windscribe](https://github.com/StarWhiz/docker_deployment_notes/tree/master/qbit-windscribe)
##### [Rocket.chat](https://github.com/StarWhiz/docker_deployment_notes/tree/master/rocketchat)
##### [ShinobiCCTV (Not Recommended)](https://github.com/StarWhiz/docker_deployment_notes/tree/master/shinobi)
##### [Seafile](https://github.com/StarWhiz/docker_deployment_notes/tree/master/seafile)
##### [Ubiquiti UniFi Controller](https://github.com/StarWhiz/docker_deployment_notes/tree/master/unifi-controller)
##### [Wordpress](https://github.com/StarWhiz/docker_deployment_notes/tree/master/wordpress)
##### [Zoneminder](https://github.com/StarWhiz/docker_deployment_notes/tree/master/zoneminder)

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

## Commonly used Docker Specific Commands
```
docker container ls     # list all running containers
docker container ls -a  # list all containers even stopped ones
docker container rm     # remove container
docker container kill   # kill a running container
docker system prune     # Remove all unused docker: containers, images, networks and volumes to free up space
docker container prune  # Similar to system prune but only targets containers.

### While inside app specific folder
docker-compose restart  # restart docker stack for application
docker-compose down     # turn off application
docker-compose up       # turn on application with logs. CTRL+C to exit
docker-compose up -d    # turn on application without logs and runs in background
docker-compose pull     # update application
```

## Commonly added lines added to app specific docker-compose.yml files
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
	  
### Example .env variables in docker-compose.yml
${VARIABLE_A}

### Example variable in .env
VARIABLE_A=My_SQL_PASSWORD
```


## Caddy v2 References
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
