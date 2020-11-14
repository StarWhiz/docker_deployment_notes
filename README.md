# Order of Deployment
* Start Here: https://github.com/StarWhiz/docker_deployment_notes/tree/master/iniital%20ubuntu%20server%20setup
* Follow DoTheEvo's Caddy v2 Guide: https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2
* Finally Follow application specific guides on DoTheEvo's Github: https://github.com/DoTheEvo/selfhosted-apps-docker/
* Or follow my two application specific guides (Seafile and Wordpress for now)

# Most commonly used commands
```
docker exec -w /etc/caddy caddy caddy reload
```
Use this command everytime you make changes to Caddyfile.

```
docker exec -t -i CONTAINERNAME /bin/bash
```
Command to enter a container's shell

# Commonly added to docker-compose.yml files
```
networks:
  default:
    external:
      name: caddy_net
```

# To prevent automatic HTTPS on Caddy 2
Append http:// to your CaddyFile Entries. Example Below.

```
http://subdomain.yourdomain.com {
    reverse_proxy 192.168.16.5
}
```

# Application Specific Deployments

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