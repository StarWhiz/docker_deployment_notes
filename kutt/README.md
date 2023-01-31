Bit.ly alternative that looks more modern and nicer than YOURLS
https://kutt.it

This is not a full tutorial but more of a reference.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── kutt/
		    ├── .env
            ├── docker-compose.yml
```
### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
urls.YOURDOMAIN.com {
		reverse_proxy kutt:80
}
```

### docker-compose.yml
Change YOURDATABASEPASSWORD in 2 lines and change YOURADMINUSERPASSWORD in one line from the yml below.




```
version: "3"

services:
  kutt:
    image: kutt/kutt
    container_name: kutt
    restart: unless-stopped
    depends_on:
      - kutt-db
      - kutt-redis
    command: ["./wait-for-it.sh", "kutt-db:5432", "--", "npm", "start"]
#    ports:
#      - "3000:3000"
    env_file:
      - .env
    environment:
      DB_HOST: kutt-db
      DB_NAME: kutt
      DB_USER: user
      DB_PASSWORD: pass
      REDIS_HOST: kutt-redis

  kutt-redis:
    image: redis:6.0-alpine
    container_name: kutt-redis
    restart: unless-stopped
    volumes:
      - ./redis_data:/data

  kutt-db:
    image: postgres:12-alpine
    container_name: kutt-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: kutt
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

networks:
  default:
    external:
      name: caddy_net
```

### .env file
Quick Notes
You need to set ADMIN_EMAILS= to your email address that you plan to use as your admin account.
You also need to set up the MAIL_ section otherwise registration with the admin account will fail.
After creating the admin account and succesfully registering.
For private use only set DISALLOW_REGISTRATION=false and keep DISALLOW_ANONYMOUS_LINKS=true
To allow the public use your service set DISALLOW_ANONYMOUS_LINKS=false

```
# App port to run on
PORT=3000

# The name of the site where Kutt is hosted
SITE_NAME=Kutt

# The domain that this website is on
DEFAULT_DOMAIN=urls.YOURDOMAIN.com

# Generated link length
LINK_LENGTH=6

# Postgres database credential details. Don't fill out if using docker-compose.
DB_HOST=kutt-db
DB_PORT=5432
DB_NAME=postgres
DB_USER=
DB_PASSWORD=
DB_SSL=false

# Redis host and port. Don't fill out if using docker-compose.
REDIS_HOST=kutt-redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=

# Disable registration
DISALLOW_REGISTRATION=false

# Disable anonymous link creation
DISALLOW_ANONYMOUS_LINKS=true

# The daily limit for each user
USER_LIMIT_PER_DAY=1000

# Create a cooldown for non-logged in users in minutes
# Set 0 to disable
NON_USER_COOLDOWN=0

# Max number of visits for each link to have detailed stats
DEFAULT_MAX_STATS_PER_LINK=100000

# Use HTTPS for links with custom domain
CUSTOM_DOMAIN_USE_HTTPS=true

# A passphrase to encrypt JWT. Use a long and secure key.
JWT_SECRET=securekey

# Admin emails so they can access admin actions on settings page
# Comma seperated
ADMIN_EMAILS=

# Invisible reCaptcha secret key
# Create one in https://www.google.com/recaptcha/intro/
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Google Cloud API to prevent from users from submitting malware URLs.
# Get it from https://developers.google.com/safe-browsing/v4/get-started
GOOGLE_SAFE_BROWSING_KEY=

# Your email host details to use to send verification emails.
# More info on http://nodemailer.com/
# Mail from example "Kutt <support@kutt.it>". Leave empty to use MAIL_USER
MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=false
MAIL_USER=
MAIL_FROM=
MAIL_PASSWORD=

# The email address that will receive submitted reports.
REPORT_EMAIL=

# Support email to show on the app
CONTACT_EMAIL=

```