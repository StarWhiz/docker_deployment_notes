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