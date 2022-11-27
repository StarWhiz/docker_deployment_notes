#!/bin/bash

# This is for Ubuntu 22.04
set -euo pipefail

########################
### SCRIPT VARIABLES ###
########################
### Be non-root user w/ sudo privileges.

# Name of the user to create and grant sudo privileges
USERNAME=yourusername

# Install docker
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
sudo usermod -aG docker ${USERNAME}

### Installs docker-compose
sudo mkdir -p /usr/local/lib/docker/cli-plugins

sudo curl -L https://github.com/docker/compose/releases/download/v2.13.0/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose

sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

### Installs compose-switch
sudo curl -fL https://github.com/docker/compose-switch/releases/download/v1.0.4/docker-compose-linux-amd64 -o /usr/local/bin/compose-switch

sudo chmod +x /usr/local/bin/compose-switch

### update-alternatives --install /usr/local/bin/docker-compose docker-compose <PATH_TO_DOCKER_COMPOSE_V1> 1
sudo update-alternatives --install /usr/local/bin/docker-compose docker-compose /usr/local/bin/compose-switch 99
sudo update-alternatives --display docker-compose

