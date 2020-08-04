# Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── wordpress/
            ├── .env
            ├── docker-compose.yml
            ├── uploads.ini
```

### Caddyfile
```
example.com {
	reverse_proxy wordpress:80
}

www.example.com {
	reverse_proxy wordpress:80
}
```

### uploads.ini
This is used to configure your upload size limits.