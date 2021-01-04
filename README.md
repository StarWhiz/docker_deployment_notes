# Introduction
Caddy v2 is the easiest reverse proxy ever! You'll be able to host multiple dockerized applications with one VM and one domain name! I learned from [DoTheEvo](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2), but their guide assumes you already installed docker and docker-compose. From my [A-Z guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup)... you be handheld from the beginning. In addition to the app specific guides on DoTheEvo's page I also added some of my own!

Anyways please start with the [A-Z Guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup) guide below which will take you from base Ubuntu 20.04 to having docker, docker-compose, caddy v2 installed.

## A to Z Guide (Start Here)
https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup

After you finish the A-Z guide. You can then follow application specific guides from me below. Or from [DoTheEvo](https://github.com/DoTheEvo/selfhosted-apps-docker) for other apps.

## Application Specific Deployment Guides

#### DoTheEvo's App Specific Guides
* [caddy_v2](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2) - reverse proxy
* [bitwarden_rs](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/bitwarden_rs) - password manager
* [bookstack](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/bookstack) - notes and documentation
* [borg_backup](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/borg_backup) - backup utility
* [ddclient](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/ddclient) - automatic DNS update
* [dnsmasq](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/dnsmasq) - DNS and DHCP server
* [homer](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/homer) - homepage
* [nextcloud](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/nextcloud) - file share & sync
* [portainer](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/portainer) - docker management
* [prometheus_grafana](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/prometheus_grafana) - monitoring
* [unifi](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/unifi) - management utility for ubiquiti devices
* [watchtower](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/watchtower) - automatic docker images update
* [wireguard](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/wireguard) - the one and only VPN to ever consider


#### StarWhiz's App Specific Guides
* [Heimdall](https://github.com/StarWhiz/docker_deployment_notes/tree/master/heimdall) - Another Homepage Dashboard
* [FreePBX+Asterisk](https://github.com/StarWhiz/docker_deployment_notes/tree/master/freepbx-asterisk) - VOIP & telephony server
* [PureFTPd](https://github.com/StarWhiz/docker_deployment_notes/tree/master/pureftpd) - FTP server
* [qBit+windscribe](https://github.com/StarWhiz/docker_deployment_notes/tree/master/qbit-windscribe) - Torrent Client w/ Windscribe VPN
* [Rocket.chat](https://github.com/StarWhiz/docker_deployment_notes/tree/master/rocketchat) - Discord / Slack Clone
* [ShinobiCCTV (Not Recommended)](https://github.com/StarWhiz/docker_deployment_notes/tree/master/shinobi) - CCTV NVR
* [Seafile](https://github.com/StarWhiz/docker_deployment_notes/tree/master/seafile) - Cloud Drive
* [Ubiquiti UniFi Controller](https://github.com/StarWhiz/docker_deployment_notes/tree/master/unifi-controller) - Management Utility for Ubiquiti Devices
* [Wordpress](https://github.com/StarWhiz/docker_deployment_notes/tree/master/wordpress) - CMS / Website Hosting
* [Zoneminder](https://github.com/StarWhiz/docker_deployment_notes/tree/master/zoneminder) - CCTV NVR

# Quick-References and Notes

## Most Commonly Used Commands
```
docker exec -w /etc/caddy caddy caddy reload
docker network create caddy_net # Only need to do this once on new VMs (From Step 9 of A-Z Guide)
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

## Common UFW commands
```
sudo ufw status numbered     #numbered list of all ufw rules
sudo delete 3                #delete rule #3 from ufw rules
sudo ufw enable
sudo ufw disable
sudo ufw allow 21/tcp        # Open TCP port 21
sudo ufw allow 21/udp        # Open UDP port 21
sudo ufw allow 21            # Open UDP & TCP for port 21.
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

## Other Linux Commands
Check size of current directory
```
sudo du -sh ./
```
Check total disk usage
```
sudo df -h ./
```
