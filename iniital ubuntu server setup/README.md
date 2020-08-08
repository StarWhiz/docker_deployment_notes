# Introduction
Let's say you don't know how to start with Do The Evo's CaddyV2 Guide here: https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2

Start with this guide. Then follow his caddy_v2 guide. Then you can try hosting wordpress, seafile, or his other guides such as nextcloud and etc.

#### Updating initial server
sudo apt update
sudo apt upgrade

#### Initial server setup
https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04

```
adduser sammy
usermod -aG sudo sammy
```

Logout.
Login as sammy.

Setting up uncomplicated firewall.
```
sudo apt install ufw
sudo ufw allow OpenSSH
sudo ufw allow 443
sudo ufw allow 80
sudo ufw enable
```

#### Optional... Hardening Server
Add public ssh key
```
mkdir .ssh
cd .ssh 
nano authorized_keys
```

Disable Root Login
```
sudo sed --in-place 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/g' /etc/ssh/sshd_config
sudo sed --in-place 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
```

Passwordless Sudo
```
echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
```

#### Installing Docker
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
sudo usermod -aG docker ${USER}
```
logout sammy. relogin.

```
id -nG
```
should return: sammy sudo docker

#### Installing Docker-Compose
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04


```
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```
