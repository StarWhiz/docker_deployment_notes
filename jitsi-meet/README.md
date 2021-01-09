### Intro
This guide references: https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker as the original source for installation.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── jitsi/
            ├── docker-compose.yml
			├── .env
			├── gen-passwords.sh
```

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.
```
meet.example.com {
	reverse_proxy jitsi-web:80
}
```

### docker-compose.yml
```
version: '3'

services:
    # Frontend
    web:
        image: jitsi/web:latest
        container_name: jitsi-web
        restart: ${RESTART_POLICY}
#        ports:
#            - '${HTTP_PORT}:80'
#            - '${HTTPS_PORT}:443'
        volumes:
            - ${CONFIG}/web:/config:Z
            - ${CONFIG}/transcripts:/usr/share/jitsi-meet/transcripts:Z
        environment:
            - ENABLE_LETSENCRYPT
            - ENABLE_HTTP_REDIRECT
            - ENABLE_HSTS
            - ENABLE_XMPP_WEBSOCKET
            - DISABLE_HTTPS
            - LETSENCRYPT_DOMAIN
            - LETSENCRYPT_EMAIL
            - LETSENCRYPT_USE_STAGING
            - PUBLIC_URL
            - TZ
            - AMPLITUDE_ID
            - ANALYTICS_SCRIPT_URLS
            - ANALYTICS_WHITELISTED_EVENTS
            - BRIDGE_CHANNEL
            - BRANDING_DATA_URL
            - CALLSTATS_CUSTOM_SCRIPT_URL
            - CALLSTATS_ID
            - CALLSTATS_SECRET
            - CHROME_EXTENSION_BANNER_JSON
            - CONFCODE_URL
            - CONFIG_EXTERNAL_CONNECT
            - DEPLOYMENTINFO_ENVIRONMENT
            - DEPLOYMENTINFO_ENVIRONMENT_TYPE
            - DEPLOYMENTINFO_USERREGION
            - DIALIN_NUMBERS_URL
            - DIALOUT_AUTH_URL
            - DIALOUT_CODES_URL
            - DROPBOX_APPKEY
            - DROPBOX_REDIRECT_URI
            - ENABLE_AUDIO_PROCESSING
            - ENABLE_AUTH
            - ENABLE_CALENDAR
            - ENABLE_FILE_RECORDING_SERVICE
            - ENABLE_FILE_RECORDING_SERVICE_SHARING
            - ENABLE_GUESTS
            - ENABLE_IPV6
            - ENABLE_LIPSYNC
            - ENABLE_NO_AUDIO_DETECTION
            - ENABLE_P2P
            - ENABLE_PREJOIN_PAGE
            - ENABLE_WELCOME_PAGE
            - ENABLE_CLOSE_PAGE
            - ENABLE_RECORDING
            - ENABLE_REMB
            - ENABLE_REQUIRE_DISPLAY_NAME
            - ENABLE_SIMULCAST
            - ENABLE_STATS_ID
            - ENABLE_STEREO
            - ENABLE_SUBDOMAINS
            - ENABLE_TALK_WHILE_MUTED
            - ENABLE_TCC
            - ENABLE_TRANSCRIPTIONS
            - ETHERPAD_PUBLIC_URL
            - ETHERPAD_URL_BASE
            - GOOGLE_ANALYTICS_ID
            - GOOGLE_API_APP_CLIENT_ID
            - INVITE_SERVICE_URL
            - JICOFO_AUTH_USER
            - MATOMO_ENDPOINT
            - MATOMO_SITE_ID
            - MICROSOFT_API_APP_CLIENT_ID
            - NGINX_RESOLVER
            - NGINX_WORKER_PROCESSES
            - NGINX_WORKER_CONNECTIONS
            - PEOPLE_SEARCH_URL
            - RESOLUTION
            - RESOLUTION_MIN
            - RESOLUTION_WIDTH
            - RESOLUTION_WIDTH_MIN
            - START_AUDIO_ONLY
            - START_AUDIO_MUTED
            - DISABLE_AUDIO_LEVELS
            - ENABLE_NOISY_MIC_DETECTION
            - START_BITRATE
            - START_VIDEO_MUTED
            - TESTING_CAP_SCREENSHARE_BITRATE
            - TESTING_OCTO_PROBABILITY
            - XMPP_AUTH_DOMAIN
            - XMPP_BOSH_URL_BASE
            - XMPP_DOMAIN
            - XMPP_GUEST_DOMAIN
            - XMPP_MUC_DOMAIN
            - XMPP_RECORDER_DOMAIN
            - TOKEN_AUTH_URL
        networks:
            meet.jitsi:
                aliases:
                    - ${XMPP_DOMAIN}
            default:

    # XMPP server
    prosody:
        image: jitsi/prosody:latest
        container_name: jitsi-prosody
        restart: ${RESTART_POLICY}
        expose:
            - '5222'
            - '5347'
            - '5280'
        volumes:
            - ${CONFIG}/prosody/config:/config:Z
            - ${CONFIG}/prosody/prosody-plugins-custom:/prosody-plugins-custom:Z
        environment:
            - AUTH_TYPE
            - ENABLE_AUTH
            - ENABLE_GUESTS
            - ENABLE_LOBBY
            - ENABLE_XMPP_WEBSOCKET
            - GLOBAL_MODULES
            - GLOBAL_CONFIG
            - LDAP_URL
            - LDAP_BASE
            - LDAP_BINDDN
            - LDAP_BINDPW
            - LDAP_FILTER
            - LDAP_AUTH_METHOD
            - LDAP_VERSION
            - LDAP_USE_TLS
            - LDAP_TLS_CIPHERS
            - LDAP_TLS_CHECK_PEER
            - LDAP_TLS_CACERT_FILE
            - LDAP_TLS_CACERT_DIR
            - LDAP_START_TLS
            - XMPP_DOMAIN
            - XMPP_AUTH_DOMAIN
            - XMPP_GUEST_DOMAIN
            - XMPP_MUC_DOMAIN
            - XMPP_INTERNAL_MUC_DOMAIN
            - XMPP_MODULES
            - XMPP_MUC_MODULES
            - XMPP_INTERNAL_MUC_MODULES
            - XMPP_RECORDER_DOMAIN
            - XMPP_CROSS_DOMAIN
            - JICOFO_COMPONENT_SECRET
            - JICOFO_AUTH_USER
            - JICOFO_AUTH_PASSWORD
            - JVB_AUTH_USER
            - JVB_AUTH_PASSWORD
            - JIGASI_XMPP_USER
            - JIGASI_XMPP_PASSWORD
            - JIBRI_XMPP_USER
            - JIBRI_XMPP_PASSWORD
            - JIBRI_RECORDER_USER
            - JIBRI_RECORDER_PASSWORD
            - JWT_APP_ID
            - JWT_APP_SECRET
            - JWT_ACCEPTED_ISSUERS
            - JWT_ACCEPTED_AUDIENCES
            - JWT_ASAP_KEYSERVER
            - JWT_ALLOW_EMPTY
            - JWT_AUTH_TYPE
            - JWT_TOKEN_AUTH_MODULE
            - LOG_LEVEL
            - PUBLIC_URL
            - TZ
        networks:
            meet.jitsi:
                aliases:
                    - ${XMPP_SERVER}
            default:

    # Focus component
    jicofo:
        image: jitsi/jicofo:latest
        container_name: jitsi-jicofo
        restart: ${RESTART_POLICY}
        volumes:
            - ${CONFIG}/jicofo:/config:Z
        environment:
            - AUTH_TYPE
            - ENABLE_AUTH
            - XMPP_DOMAIN
            - XMPP_AUTH_DOMAIN
            - XMPP_INTERNAL_MUC_DOMAIN
            - XMPP_MUC_DOMAIN
            - XMPP_SERVER
            - JICOFO_COMPONENT_SECRET
            - JICOFO_AUTH_USER
            - JICOFO_AUTH_PASSWORD
            - JICOFO_RESERVATION_REST_BASE_URL
            - JVB_BREWERY_MUC
            - JIGASI_BREWERY_MUC
            - JIGASI_SIP_URI
            - JIBRI_BREWERY_MUC
            - JIBRI_PENDING_TIMEOUT
            - TZ
        depends_on:
            - prosody
        networks:
            meet.jitsi:
            default:

    # Video bridge
    jvb:
        image: jitsi/jvb:latest
        restart: ${RESTART_POLICY}
        ports:
            - '${JVB_PORT}:${JVB_PORT}/udp'
            - '${JVB_TCP_PORT}:${JVB_TCP_PORT}'
        volumes:
            - ${CONFIG}/jvb:/config:Z
        environment:
            - DOCKER_HOST_ADDRESS
            - XMPP_AUTH_DOMAIN
            - XMPP_INTERNAL_MUC_DOMAIN
            - XMPP_SERVER
            - JVB_AUTH_USER
            - JVB_AUTH_PASSWORD
            - JVB_BREWERY_MUC
            - JVB_PORT
            - JVB_TCP_HARVESTER_DISABLED
            - JVB_TCP_PORT
            - JVB_TCP_MAPPED_PORT
            - JVB_STUN_SERVERS
            - JVB_ENABLE_APIS
            - JVB_WS_DOMAIN
            - JVB_WS_SERVER_ID
            - PUBLIC_URL
            - TZ
        depends_on:
            - prosody
        networks:
            meet.jitsi:
                aliases:
                    - jvb.meet.jitsi
            default:

# Custom network so all services can communicate using a FQDN
networks:
    meet.jitsi:
    default:
        external:
            name: caddy_net
```

### .env
Here you want to edit the PUBLIC_URL to match your subdomain.example.com

Then after saving this. Run the script called ./gen-passwords.sh to generate the 6 passwords.
```
# shellcheck disable=SC2034

# Security
#
# Set these to strong passwords to avoid intruders from impersonating a service account
# The service(s) won't start unless these are specified
# Running ./gen-passwords.sh will update .env with strong passwords
# You may skip the Jigasi and Jibri passwords if you are not using those
# DO NOT reuse passwords
#

# XMPP component password for Jicofo
JICOFO_COMPONENT_SECRET=

# XMPP password for Jicofo client connections
JICOFO_AUTH_PASSWORD=

# XMPP password for JVB client connections
JVB_AUTH_PASSWORD=

# XMPP password for Jigasi MUC client connections
JIGASI_XMPP_PASSWORD=

# XMPP recorder password for Jibri client connections
JIBRI_RECORDER_PASSWORD=

# XMPP password for Jibri client connections
JIBRI_XMPP_PASSWORD=


#
# Basic configuration options
#

# Directory where all configuration will be stored
CONFIG=./jitsi-meet-cfg

# Exposed HTTP port
HTTP_PORT=8000

# Exposed HTTPS port
HTTPS_PORT=8443

# System time zone
TZ=America/Los_Angeles

# Public URL for the web service (required)
PUBLIC_URL=https://subdomain.example.com

# IP address of the Docker host
# See the "Running behind NAT or on a LAN environment" section in the Handbook:
# https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker#running-behind-nat-or-on-a-lan-environment
#DOCKER_HOST_ADDRESS=192.168.1.1

# Control whether the lobby feature should be enabled or not
#ENABLE_LOBBY=1

# Show a prejoin page before entering a conference
#ENABLE_PREJOIN_PAGE=0

# Enable the welcome page
#ENABLE_WELCOME_PAGE=1

# Enable the close page
#ENABLE_CLOSE_PAGE=0

# Disable measuring of audio levels
#DISABLE_AUDIO_LEVELS=0

# Enable noisy mic detection
#ENABLE_NOISY_MIC_DETECTION=1

#
# Let's Encrypt configuration
#

# Enable Let's Encrypt certificate generation
#ENABLE_LETSENCRYPT=1

# Domain for which to generate the certificate
#LETSENCRYPT_DOMAIN=meet.example.com

# E-Mail for receiving important account notifications (mandatory)
#LETSENCRYPT_EMAIL=alice@atlanta.net

# Use the staging server (for avoiding rate limits while testing)
#LETSENCRYPT_USE_STAGING=1


#
# Etherpad integration (for document sharing)
#

# Set etherpad-lite URL in docker local network (uncomment to enable)
#ETHERPAD_URL_BASE=http://etherpad.meet.jitsi:9001

# Set etherpad-lite public URL (uncomment to enable)
#ETHERPAD_PUBLIC_URL=https://etherpad.my.domain

# Name your etherpad instance!
ETHERPAD_TITLE="Video Chat"

# The default text of a pad
ETHERPAD_DEFAULT_PAD_TEXT="Welcome to Web Chat!\n\n"

# Name of the skin for etherpad
ETHERPAD_SKIN_NAME="colibris"

# Skin variants for etherpad
ETHERPAD_SKIN_VARIANTS="super-light-toolbar super-light-editor light-background full-width-editor"


#
# Basic Jigasi configuration options (needed for SIP gateway support)
#

# SIP URI for incoming / outgoing calls
#JIGASI_SIP_URI=test@sip2sip.info

# Password for the specified SIP account as a clear text
#JIGASI_SIP_PASSWORD=passw0rd

# SIP server (use the SIP account domain if in doubt)
#JIGASI_SIP_SERVER=sip2sip.info

# SIP server port
#JIGASI_SIP_PORT=5060

# SIP server transport
#JIGASI_SIP_TRANSPORT=UDP

#
# Authentication configuration (see handbook for details)
#

# Enable authentication
#ENABLE_AUTH=1

# Enable guest access
#ENABLE_GUESTS=1

# Select authentication type: internal, jwt or ldap
#AUTH_TYPE=internal

# JWT authentication
#

# Application identifier
#JWT_APP_ID=my_jitsi_app_id

# Application secret known only to your token
#JWT_APP_SECRET=my_jitsi_app_secret

# (Optional) Set asap_accepted_issuers as a comma separated list
#JWT_ACCEPTED_ISSUERS=my_web_client,my_app_client

# (Optional) Set asap_accepted_audiences as a comma separated list
#JWT_ACCEPTED_AUDIENCES=my_server1,my_server2


# LDAP authentication (for more information see the Cyrus SASL saslauthd.conf man page)
#

# LDAP url for connection
#LDAP_URL=ldaps://ldap.domain.com/

# LDAP base DN. Can be empty
#LDAP_BASE=DC=example,DC=domain,DC=com

# LDAP user DN. Do not specify this parameter for the anonymous bind
#LDAP_BINDDN=CN=binduser,OU=users,DC=example,DC=domain,DC=com

# LDAP user password. Do not specify this parameter for the anonymous bind
#LDAP_BINDPW=LdapUserPassw0rd

# LDAP filter. Tokens example:
# %1-9 - if the input key is user@mail.domain.com, then %1 is com, %2 is domain and %3 is mail
# %s - %s is replaced by the complete service string
# %r - %r is replaced by the complete realm string
#LDAP_FILTER=(sAMAccountName=%u)

# LDAP authentication method
#LDAP_AUTH_METHOD=bind

# LDAP version
#LDAP_VERSION=3

# LDAP TLS using
#LDAP_USE_TLS=1

# List of SSL/TLS ciphers to allow
#LDAP_TLS_CIPHERS=SECURE256:SECURE128:!AES-128-CBC:!ARCFOUR-128:!CAMELLIA-128-CBC:!3DES-CBC:!CAMELLIA-128-CBC

# Require and verify server certificate
#LDAP_TLS_CHECK_PEER=1

# Path to CA cert file. Used when server certificate verify is enabled
#LDAP_TLS_CACERT_FILE=/etc/ssl/certs/ca-certificates.crt

# Path to CA certs directory. Used when server certificate verify is enabled
#LDAP_TLS_CACERT_DIR=/etc/ssl/certs

# Wether to use starttls, implies LDAPv3 and requires ldap:// instead of ldaps://
# LDAP_START_TLS=1


#
# Advanced configuration options (you generally don't need to change these)
#

# Internal XMPP domain
XMPP_DOMAIN=meet.jitsi

# Internal XMPP server
XMPP_SERVER=xmpp.meet.jitsi

# Internal XMPP server URL
XMPP_BOSH_URL_BASE=http://xmpp.meet.jitsi:5280

# Internal XMPP domain for authenticated services
XMPP_AUTH_DOMAIN=auth.meet.jitsi

# XMPP domain for the MUC
XMPP_MUC_DOMAIN=muc.meet.jitsi

# XMPP domain for the internal MUC used for jibri, jigasi and jvb pools
XMPP_INTERNAL_MUC_DOMAIN=internal-muc.meet.jitsi

# XMPP domain for unauthenticated users
XMPP_GUEST_DOMAIN=guest.meet.jitsi

# Comma separated list of domains for cross domain policy or "true" to allow all
# The PUBLIC_URL is always allowed
#XMPP_CROSS_DOMAIN=true

# Custom Prosody modules for XMPP_DOMAIN (comma separated)
XMPP_MODULES=

# Custom Prosody modules for MUC component (comma separated)
XMPP_MUC_MODULES=

# Custom Prosody modules for internal MUC component (comma separated)
XMPP_INTERNAL_MUC_MODULES=

# MUC for the JVB pool
JVB_BREWERY_MUC=jvbbrewery

# XMPP user for JVB client connections
JVB_AUTH_USER=jvb

# STUN servers used to discover the server's public IP
JVB_STUN_SERVERS=meet-jit-si-turnrelay.jitsi.net:443

# Media port for the Jitsi Videobridge
JVB_PORT=10000

# TCP Fallback for Jitsi Videobridge for when UDP isn't available
JVB_TCP_HARVESTER_DISABLED=true
JVB_TCP_PORT=4443
JVB_TCP_MAPPED_PORT=4443

# A comma separated list of APIs to enable when the JVB is started [default: none]
# See https://github.com/jitsi/jitsi-videobridge/blob/master/doc/rest.md for more information
#JVB_ENABLE_APIS=rest,colibri

# XMPP user for Jicofo client connections.
# NOTE: this option doesn't currently work due to a bug
JICOFO_AUTH_USER=focus

# Base URL of Jicofo's reservation REST API
#JICOFO_RESERVATION_REST_BASE_URL=http://reservation.example.com

# Enable Jicofo's health check REST API (http://<jicofo_base_url>:8888/about/health)
#JICOFO_ENABLE_HEALTH_CHECKS=true

# XMPP user for Jigasi MUC client connections
JIGASI_XMPP_USER=jigasi

# MUC name for the Jigasi pool
JIGASI_BREWERY_MUC=jigasibrewery

# Minimum port for media used by Jigasi
JIGASI_PORT_MIN=20000

# Maximum port for media used by Jigasi
JIGASI_PORT_MAX=20050

# Enable SDES srtp
#JIGASI_ENABLE_SDES_SRTP=1

# Keepalive method
#JIGASI_SIP_KEEP_ALIVE_METHOD=OPTIONS

# Health-check extension
#JIGASI_HEALTH_CHECK_SIP_URI=keepalive

# Health-check interval
#JIGASI_HEALTH_CHECK_INTERVAL=300000
#
# Enable Jigasi transcription
#ENABLE_TRANSCRIPTIONS=1

# Jigasi will record audio when transcriber is on [default: false]
#JIGASI_TRANSCRIBER_RECORD_AUDIO=true

# Jigasi will send transcribed text to the chat when transcriber is on [default: false]
#JIGASI_TRANSCRIBER_SEND_TXT=true

# Jigasi will post an url to the chat with transcription file [default: false]
#JIGASI_TRANSCRIBER_ADVERTISE_URL=true

# Credentials for connect to Cloud Google API from Jigasi
# Please read https://cloud.google.com/text-to-speech/docs/quickstart-protocol
# section "Before you begin" paragraph 1 to 5
# Copy the values from the json to the related env vars
#GC_PROJECT_ID=
#GC_PRIVATE_KEY_ID=
#GC_PRIVATE_KEY=
#GC_CLIENT_EMAIL=
#GC_CLIENT_ID=
#GC_CLIENT_CERT_URL=

# Enable recording
#ENABLE_RECORDING=1

# XMPP domain for the jibri recorder
XMPP_RECORDER_DOMAIN=recorder.meet.jitsi

# XMPP recorder user for Jibri client connections
JIBRI_RECORDER_USER=recorder

# Directory for recordings inside Jibri container
JIBRI_RECORDING_DIR=/config/recordings

# The finalizing script. Will run after recording is complete
#JIBRI_FINALIZE_RECORDING_SCRIPT_PATH=/config/finalize.sh

# XMPP user for Jibri client connections
JIBRI_XMPP_USER=jibri

# MUC name for the Jibri pool
JIBRI_BREWERY_MUC=jibribrewery

# MUC connection timeout
JIBRI_PENDING_TIMEOUT=90

# When jibri gets a request to start a service for a room, the room
# jid will look like: roomName@optional.prefixes.subdomain.xmpp_domain
# We'll build the url for the call by transforming that into:
# https://xmpp_domain/subdomain/roomName
# So if there are any prefixes in the jid (like jitsi meet, which
# has its participants join a muc at conference.xmpp_domain) then
# list that prefix here so it can be stripped out to generate
# the call url correctly
JIBRI_STRIP_DOMAIN_JID=muc

# Directory for logs inside Jibri container
JIBRI_LOGS_DIR=/config/logs

# Disable HTTPS: handle TLS connections outside of this setup
#DISABLE_HTTPS=1

# Redirect HTTP traffic to HTTPS
# Necessary for Let's Encrypt, relies on standard HTTPS port (443)
#ENABLE_HTTP_REDIRECT=1

# Send a `strict-transport-security` header to force browsers to use
# a secure and trusted connection. Recommended for production use.
# Defaults to 1 (send the header).
# ENABLE_HSTS=1

# Enable IPv6
# Provides means to disable IPv6 in environments that don't support it (get with the times, people!)
#ENABLE_IPV6=1

# Container restart policy
# Defaults to unless-stopped
RESTART_POLICY=unless-stopped

# Authenticate using external service or just focus external auth window if there is one already.
# TOKEN_AUTH_URL=https://auth.meet.example.com/{room}
```

### gen-passwords.sh
Make your .env file first before running this script. 
To run this script make sure you do a `chmod +x gen-passwords.sh'
then do a `./gen-passwords.sh`.
```
#!/bin/bash

function generatePassword() {
    openssl rand -hex 16
}

JICOFO_COMPONENT_SECRET=$(generatePassword)
JICOFO_AUTH_PASSWORD=$(generatePassword)
JVB_AUTH_PASSWORD=$(generatePassword)
JIGASI_XMPP_PASSWORD=$(generatePassword)
JIBRI_RECORDER_PASSWORD=$(generatePassword)
JIBRI_XMPP_PASSWORD=$(generatePassword)

sed -i.bak \
    -e "s#JICOFO_COMPONENT_SECRET=.*#JICOFO_COMPONENT_SECRET=${JICOFO_COMPONENT_SECRET}#g" \
    -e "s#JICOFO_AUTH_PASSWORD=.*#JICOFO_AUTH_PASSWORD=${JICOFO_AUTH_PASSWORD}#g" \
    -e "s#JVB_AUTH_PASSWORD=.*#JVB_AUTH_PASSWORD=${JVB_AUTH_PASSWORD}#g" \
    -e "s#JIGASI_XMPP_PASSWORD=.*#JIGASI_XMPP_PASSWORD=${JIGASI_XMPP_PASSWORD}#g" \
    -e "s#JIBRI_RECORDER_PASSWORD=.*#JIBRI_RECORDER_PASSWORD=${JIBRI_RECORDER_PASSWORD}#g" \
    -e "s#JIBRI_XMPP_PASSWORD=.*#JIBRI_XMPP_PASSWORD=${JIBRI_XMPP_PASSWORD}#g" \
    "$(dirname "$0")/.env"
```

Finally after modifying your Caddyfile and making the 3 files and running gen-passwords.sh. You're ready to do a `docker-compose up -d` inside the jitsi directory to turn it on.
