### Original Guides. Set up Caddy First.
https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2

Credits to DoTheEvo. For without his tutorials I would have not gotten here. To get started follow his caddy_v2 tutorial.

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