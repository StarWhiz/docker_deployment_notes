I personally use ProGet as a chocolatey repository cache to automated program installs on windows PCs.

Reference url: https://docs.inedo.com/docs/docker-compose-installation-guide
To begin get a free license from [inedo](https://my.inedo.com/log-in)

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── proget/
            ├── docker-compose.yml
```

### CaddyFile
Use these parameters below for Caddy Reverse Proxy
The .9980 block is optional for local access only
```
proget.YOURDOMAIN.com {
        reverse_proxy proget:80
}

:9980 {
        reverse_proxy proget:80
}
```

### Deployment
* Create and save the docker-compose.yml into a folder dedicated to proget. (Make sure to change YOURPASSWORD)
* In the same directory start the database image using `docker-compose up -d proget-db`
* Create your database using a docker exec command (example below; edit YOURPASSWORD).
```
docker exec -it proget-db /opt/mssql-tools/bin/sqlcmd \
-S localhost -U SA -P 'YOURPASSWORD' \
-Q 'CREATE DATABASE ProGet COLLATE SQL_Latin1_General_CP1_CI_AS'
```

* Start the remaining images using `docker-compose up -d`
* Deployment success!

### docker-compose.yml
You should edit YOURPASSWORD in line 12 and line 26

```
version: '3.8'
services:
  proget-db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    container_name: proget-db
    restart: unless-stopped
#    ports:
#      - "1433:1433"
    environment:
      ACCEPT_EULA: Y
      MSSQL_SA_PASSWORD: YOURPASSWORD
      MSSQL_PID: Express
    user: "0:0"
# Optional if using persisted storage locations (https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-docker-container-configure?view=sql-server-ver15&pivots=cs1-bash#persist)
    volumes:
      - ./proget-db/data:/var/opt/mssql/data
      - ./proget-db/log:/var/opt/mssql/log
      - ./proget-db/secrets:/var/opt/mssql/secrets

  proget:
    image: proget.inedo.com/productimages/inedo/proget:latest
    container_name: proget
    restart: unless-stopped
    environment:
      SQL_CONNECTION_STRING: Data Source=proget-db; Initial Catalog=ProGet; User ID=sa; Password=YOURPASSWORD
#    ports:
#      - "9980:80"
# Update this path to persist your ProGet packages storage
    volumes:
      - ./proget-packages:/var/proget/packages
    depends_on:
      - proget-db

networks:
  default:
    external:
      name: caddy_net

```

### Proget Steps After Deployment
* Set the base URL in Admin / Advanced Settings. For example `https://proget.yourdomain.com`, if not set the links generated will end with :port and `choco install` will fail to work on client machines.
* Adminstration > Security.. Here you can remove anonymous users from admin and from view & download packages
* Change your admin password

### Installing Chocolatey on Client w/ this ProGet Repository
To do this please refer to this documentation: https://chocolatey.org/install#generic
