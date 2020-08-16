# Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── seafile/
            ├── .env
            ├── docker-compose.yml
```

# Caddyfile
```
subdomain.example.com {
	reverse_proxy seafile:80
}
```

# Things to Modify

## .env
set your environment variables
https://github.com/StarWhiz/docker_deployment_notes/blob/master/seafile/.env

## docker-compose.yml
https://github.com/StarWhiz/docker_deployment_notes/blob/master/seafile/docker-compose.yml

## docker-compose up -d
After you have the .env and docker-compose files set up in this directory. Do a ```docker-compose up -d``` to start the containers. After they start modify seahub_settings.py and ccnet.conf as shown below.

## seahub_settings.py
nano /home/~/docker/seafile/seafile-data/seafile/conf/seahub_settings.py

Change FILE_SERVER_ROOT to be https instead of http.
Example Below:
```
FILE_SERVER_ROOT = "https://subdomain.example.com/seafhttp"
```

## ccnet.conf
nano /home/~/docker/seafile/seafile-data/seafile/conf/ccnet.conf

Change SERVICE_URL from http to https and remove the :8000 at the end.
Example Below:
```
SERVICE_URL https://subdomain.example.com
```

# Optional: Setting Up WebDav

## Caddyfile
```
webdav.example.com {
	reverse_proxy seafile:80
}
```
Here I assigned a new subdomain webdav and point it to port 8080 which is the defualt on seafdav.conf

## seafdav.conf
```
nano /home/~/docker/seafile/seafile-data/seafile/conf/seafdav.conf
```
Set ```enabled=true```
Set ```share_name = /```

Remember to do a docker-compose restart and a caddy exec restart after modifying seafile conf files!
