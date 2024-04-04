#!/bin/bash

export NODE_ENV=production

export HOSTNAME
export CONTAINER_PORT
export REVERSE_PROXY
export REVERSE_PROXY_TLS_PORT


if [ -f "meshcentral-data/config.json" ]
    then
        node node_modules/meshcentral 
    else
        cp config.json.template meshcentral-data/config.json
        sed -i "s_\"port\": 4430_\"port\": $CONTAINER_PORT_" meshcentral-data/config.json
        sed -i "s/\"cert\": \"myserver.mydomain.com\"/\"cert\": \"$HOSTNAME\"/" meshcentral-data/config.json
        if [ "$REVERSE_PROXY" != "false" ]
            then 
                sed -i "s/\"certUrl\": \"my\.reverse\.proxy\"/\"certUrl\": \"https:\/\/$REVERSE_PROXY:$REVERSE_PROXY_TLS_PORT\"/" meshcentral-data/config.json
                node node_modules/meshcentral
                exit
        fi
        node node_modules/meshcentral --cert "$HOSTNAME"     
fi
