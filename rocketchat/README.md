# Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── rocketchat/
            ├── .env
            ├── docker-compose.yml
```

# Caddyfile
```
subdomain.example.com {
	reverse_proxy rocketchat:3000
}
```

# Things to Modify

## .env
set your environment variables
https://github.com/StarWhiz/docker_deployment_notes/blob/master/rocketchat/.env


## docker-compose.yml
https://github.com/StarWhiz/docker_deployment_notes/blob/master/rocketchat/docker-compose.yml

## docker-compose up -d
After you have the .env and docker-compose files set up in this directory. Do a ```docker-compose up -d``` to start the containers.