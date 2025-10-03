> [!NOTE]
> ever since docker compose v2 some of the commands in this guide are outdated
> For example we no longer do `docker-compose up -d` we do `docker compose up -d`
> There's no longer a need for version section required in any `docker-compose.yml`
> the docker network `caddy_net` is defined differently now and the end of all `docker-compose.yml` files
> ```
>     networks:
>      - caddy_net
> 
> networks:
> caddy_net:
> external: true
> ```

# Introduction
Caddy v2 is the easiest reverse proxy ever! You'll be able to host multiple dockerized applications with one VM and one domain name! I learned from [DoTheEvo](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2), but their guide assumes you already installed docker and docker-compose. From my [A-Z guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup)... you be handheld from the beginning. In addition to the app specific guides on DoTheEvo's page I also added some of my own!

Anyways please start with the [A-Z Guide](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup) guide below which will take you from base Ubuntu 20.04 to having docker, docker-compose, caddy v2 installed.

## A to Z Guide (Start Here)
https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup

After you finish the A-Z guide. You can then follow application specific guides from me below. Or from [DoTheEvo](https://github.com/DoTheEvo/selfhosted-apps-docker) for other apps.

## Application Specific Deployment Guides

#### DoTheEvo's App Specific Guides
* [caddy_v2](https://github.com/DoTheEvo/selfhosted-apps-docker) - reverse proxy
* [vaultwarden](https://github.com/DoTheEvo/selfhosted-apps-docker) - password manager
* [bookstack](https://github.com/DoTheEvo/selfhosted-apps-docker) - notes and documentation
* [kopia](https://github.com/DoTheEvo/selfhosted-apps-docker) - backup utility replacing borg
* [borg_backup](https://github.com/DoTheEvo/selfhosted-apps-docker) - backup utility
* [ddclient](https://github.com/DoTheEvo/selfhosted-apps-docker) - automatic DNS update
* [dnsmasq](https://github.com/DoTheEvo/selfhosted-apps-docker) - DNS and DHCP server
* [gotify / ntfy / signal](https://github.com/DoTheEvo/selfhosted-apps-docker) - instant notifications apps
* [frigate](https://github.com/DoTheEvo/selfhosted-apps-docker) - managing security cameras
* [jellyfin](https://github.com/DoTheEvo/selfhosted-apps-docker) - video and music streaming
* [minecraft](https://github.com/DoTheEvo/selfhosted-apps-docker) - game server
* [meshcrentral](https://github.com/DoTheEvo/selfhosted-apps-docker) - web based remote desktop, like teamviewer or anydesk
* [rustdesk](https://github.com/DoTheEvo/selfhosted-apps-docker) - remote desktop, like teamviewer or anydesk
* [nextcloud](https://github.com/DoTheEvo/selfhosted-apps-docker) - file share & sync
* [opnsense](https://github.com/DoTheEvo/selfhosted-apps-docker) - a firewall, enterprise level 
* [qbittorrent](https://github.com/DoTheEvo/selfhosted-apps-docker) - torrent client
* [portainer](https://github.com/DoTheEvo/selfhosted-apps-docker) - docker management
* [prometheus_grafana_loki](https://github.com/DoTheEvo/selfhosted-apps-docker) - monitoring
* [unifi](https://github.com/DoTheEvo/selfhosted-apps-docker) - management utility for ubiquiti devices
* [snipeit](https://github.com/DoTheEvo/selfhosted-apps-docker) - IT inventory management
* [trueNAS scale](https://github.com/DoTheEvo/selfhosted-apps-docker) - network file sharing
* [uptime kuma](https://github.com/DoTheEvo/selfhosted-apps-docker) - uptime alerting tool 
* [squid](https://github.com/DoTheEvo/selfhosted-apps-docker) - anonymize forward proxy
* [wireguard](https://github.com/DoTheEvo/selfhosted-apps-docker) - the one and only VPN to ever consider
* [wg-easy](https://github.com/DoTheEvo/selfhosted-apps-docker) - wireguard in docker with web gui
* [zammad](https://github.com/DoTheEvo/selfhosted-apps-docker) - ticketing system
* [arch_linux_host_install](https://github.com/DoTheEvo/selfhosted-apps-docker)


#### StarWhiz's App Specific Guides & References
Disclaimer: My guides aren't as high quality as DoTheEvo's guides. Also most of them are based on docker v1. If you're on docker v2 just replace `docker-compose` command with `docker compose`!
If DoTheEvo has a guide for the same application follow theirs over mine! I did not include my own guides in this list so just browse the folders in this repostory to view the everything.

* [Easy!Appointments](https://github.com/StarWhiz/docker_deployment_notes/tree/master/easyappointments) - Self Hosted Appointment Scheduler 
* [Heimdall](https://github.com/StarWhiz/docker_deployment_notes/tree/master/heimdall) - Another Homepage Dashboard
* [FreePBX+Asterisk](https://github.com/StarWhiz/docker_deployment_notes/tree/master/freepbx-asterisk) - VOIP & telephony server
* [Jitsi Meet](https://github.com/StarWhiz/docker_deployment_notes/tree/master/jitsi-meet) - Videoconferencing
* [Kanboard](https://github.com/StarWhiz/docker_deployment_notes/tree/master/kanboard) - An Open Source Kanban Board
* [Kutt.it](https://github.com/StarWhiz/docker_deployment_notes/tree/master/kutt) - Modern looking URL Shortener / Custom Shortlinks
* [Mumble](https://github.com/StarWhiz/docker_deployment_notes/tree/master/mumble) - Voice Chat Before Discord Days
* [NocoDB](https://github.com/StarWhiz/docker_deployment_notes/tree/master/nocodb) - Airtable alternative
* [Organizr](https://github.com/StarWhiz/docker_deployment_notes/tree/master/organizr) - Another homage dashboard like heimdall
* [Outline Wiki](https://github.com/StarWhiz/docker_deployment_notes/tree/master/outline-wiki) - Gorgeous wiki that looks like confluence but feels fast and smooth! Supports video drag and drop unlike most Wikis!
* [OvenMediaEngine + Radium Next](https://github.com/StarWhiz/docker_deployment_notes/tree/master/OvenMediaEngine-RadiumNext) - Sub-second latency streaming from OBS to a web browser. It's better than real-time discord streams! Great for movie nights!
* [PureFTPd](https://github.com/StarWhiz/docker_deployment_notes/tree/master/pureftpd) - FTP server
* [Rocket.chat](https://github.com/StarWhiz/docker_deployment_notes/tree/master/rocketchat) - Discord / Slack Clone
* [Seafile](https://github.com/StarWhiz/docker_deployment_notes/tree/master/seafile) - Cloud Drive
* [Splinterlands-bot-v2](https://github.com/StarWhiz/docker_deployment_notes/tree/master/splinterlands-bot-v2) - Bot for Splinterlands
* [Wordpress](https://github.com/StarWhiz/docker_deployment_notes/tree/master/wordpress) - CMS / Website Hosting
* [VCFconvert](https://github.com/StarWhiz/docker_deployment_notes/tree/master/vcfconvert) - Converts .vCard files to .csv or LDIF
* [Zoneminder](https://github.com/StarWhiz/docker_deployment_notes/tree/master/zoneminder) - CCTV NVR

#### Other App Specific References
* [140+ Docker Scripts by technorabilia](https://github.com/technorabilia/docker-bits)
* [More docker-compose files by bearlikelion](https://github.com/bearlikelion/docker-compose)
* [awesome-compose](https://github.com/docker/awesome-compose)
# Quick-References and Notes

## Most Commonly Used Commands
```
docker network create caddy_net # Only need to do this once on new VMs (From Step 9 of A-Z Guide)
```
Only need once.
```
docker exec -w /etc/caddy caddy caddy reload
```
Use this command everytime you make changes to Caddyfile.
```
docker exec -ti CONTAINERNAME /bin/bash
docker exec -ti CONTAINERNAME /bin/sh
```
Commands to enter a container's shell. Use bash first, if that doens't work try sh.

## Commonly used Docker Specific Commands
```
docker container ls       # list all running containers
docker container ls -a    # list all containers even stopped ones
docker container rm       # remove container
docker container kill     # kill a running container
docker system prune       # Remove all unused docker: containers, images, networks and volumes to free up space
docker container prune    # Similar to system prune but only targets containers.
docker logs CONTAINERNAME # Shows logs for the container
docker logs --follow CONTAINERNAME # Shows log for the container in the foreground

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

## Random Rsync Notes For Container Migration
Remember to docker-compose down everything inside local machine so nothing shows up on docker container ls. 
```
# Generate keys. Choose defaults. Public key saves to ~/.ssh/id_rsa.pub
# Why do we do this? Because we set PermitRootLogin prohibit-password earlier.
# So we can only login root on the remote server via rsa key.

# As root user on local server generate Keys...
ssh-keygen -t rsa
cat ~/.ssh/id_rsa.pub

# Install Rsync. Local and remote server. 2 installs total.
sudo apt update
sudo apt install rsync

# Login to remote server
sudo su                 # to be the root user
mkdir ~/.ssh            # if it didn't exist already
cd .ssh
nano authorized_keys    # Append/Paste lines from id_rsa.pub generated from local server.
                        # Then save an exit.
						
# Back to your local server... The command
rsync -aP -e "ssh -i /home/<username>/.ssh/id_rsa" <source> <destination>

# Copy whole folder from source to destination example
rsync -aP -e "ssh -i /home/sammy/.ssh/id_rsa" ~/docker/someapp root@<IPADDRESS>:/home/sammy/ 

# Copy contents of folder from source to destination example # There is a / in front of ./docker in this case.
rsync -aP -e "ssh -i /home/sammy/.ssh/id_rsa" ~/docker/someapp/ root@<IPADDRESS>:/home/sammy/

# Rsync Flags
-a # The -a option is a combination flag. It stands for “archive” and syncs recursively and preserves symbolic links, special and device files, modification times, group, owner, and permissions
-e # specify ssh command...
-v # verbose
-P # progress + partial combined
-h # output numbers in human readable format
```
