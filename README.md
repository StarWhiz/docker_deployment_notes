# Order of Deployment
* Start Here: https://github.com/StarWhiz/docker_deployment_notes/tree/master/iniital%20ubuntu%20server%20setup
* Follow DoTheEvo's Caddy v2 Guide: https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2
* Finally
* Follow application specific guides on DoTheEvo's Github: https://github.com/DoTheEvo/selfhosted-apps-docker/
* Or follow my two application specific guides (Seafile and Wordpress for now)

### Docker and docker-compose required.
To do install them follow Step 1 to Step 2 for both links below.

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

### Most commonly used commands
```
docker exec -w /etc/caddy caddy caddy reload
```
Use this command everytime you make changes to Caddyfile.

```
docker exec -t -i CONTAINERNAME /bin/bash
```
Command to enter a container's shell

#### Seafile
https://github.com/StarWhiz/docker_deployment_notes/tree/master/seafile

#### Wordpress
https://github.com/StarWhiz/docker_deployment_notes/tree/master/wordpress
