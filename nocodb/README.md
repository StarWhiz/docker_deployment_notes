Airtable Alternative
https://www.nocodb.com/

This is not a full tutorial but more of a reference.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── nocodb/
            ├── docker-compose.yml
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
nocodb.YOURDOMAIN.com {
        reverse_proxy nocodb:8080
}
```

### docker-compose.yml
Change YOURPASSWORD in 3 lines.

```
services:
  nocodb_data:
    image: mysql:5.7
    container_name: nocodb_data
    volumes:
      - nocodb_data:/var/lib/mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: YOURPASSWORD
      MYSQL_DATABASE: nocodb_data
      MYSQL_USER: noco
      MYSQL_PASSWORD: YOURPASSWORD
    healthcheck:
      test: [ "CMD", "mysqladmin" ,"ping", "-h", "localhost" ]
      timeout: 20s
      retries: 10

  nocodb:
    depends_on:
      - nocodb_data
    image: nocodb/nocodb:latest
    container_name: nocodb
#    ports:
#      - "8080:8080"
#      - "8081:8081"
#      - "8082:8082"
#      - "8083:8083"
    restart: unless-stopped
    environment:
      NC_DB: "mysql2://nocodb_data:3306?u=noco&p=YOURPASSWORD&d=nocodb_data"

volumes:
  nocodb_data: {}

networks:
  default:
    external:
      name: caddy_net
```