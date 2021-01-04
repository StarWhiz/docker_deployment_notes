# Initial Installation
These notes are for people who are new to Linux, Docker, and Caddy starting from a base Ubuntu 20.04 installation on a remote VM or remote Server. This will assume you have root access and can access the shell or terminal via SSH.

You should have some basic linux knowledge such as being able to create folders, create files, edit files, and run scripts. Example basic commands you should understand are `cd, ls, pwd, mkdir, nano somefilename.txt, ./runscript`

Some very useful bash tips for newbies are:
* Use up or down arrows to cycle thru your last used commands.
* Type `history` and Enter to list all your last used commands.
* Type `!1` to enter the first command on the `history` list. `!777` would enter in the 777th command on the `history list`
* Use the tab button to complete commands. For example, lets say you have a file called ThisNameIsTooLong in your current folder and you want to edit it... You can type `nano This` and press **TAB** to auto-complete the filename.

If you are an **experienced user** and want to blaze thru steps 1 and 8. You can use my scripts just make sure you modify your username, hostname, [public-key](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup/putty%20keys%20tutorial), and timezone. Scripts here: [part-1-ubuntu-initial-setup.sh](https://github.com/StarWhiz/docker_deployment_notes/blob/master/initial%20ubuntu%20setup/part-1-ubuntu-initial-setup.sh) and [part-2-docker-scripts](https://github.com/StarWhiz/docker_deployment_notes/blob/master/initial%20ubuntu%20setup/part-2-docker-scripts.sh)

**The references I used to write the rest of these notes are bulleted below:**
* Initial Server Setup: https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04
* How to install Docker: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
* How to install docker-compose: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04
* How to install Caddy: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

**Now on to the Main Installation Guide**

### 1. Update Ubuntu
```
sudo apt update
sudo apt upgrade
```

### 2. Create Username.
In this example the username is **sammy**. You can choose your own username, all my examples will be using **sammy**.
```
adduser sammy
usermod -aG sudo sammy
```
Logout or close the ssh connection. Then ssh back in as your new username instead of root.

### 3. Set Up Uncomplicated Firewall (Optional)
```
sudo apt install ufw
sudo ufw allow OpenSSH
sudo ufw allow 443/tcp comment "caddy"
sudo ufw allow 80/tcp comment "caddy"
sudo ufw enable
```
This is a basic firewall on ubuntu. If you install this remember to unblock the specific ports you need open for some of your applications. In the example above we allow our own SSH connection, and open TCP ports 80 & 443 in order for Caddy v2 to work.

### 4. Adding your SSH Key (Optional)
Optional because you can choose to keep logging in with passwords if you wish. However logging in via SSH keys is more secure.

```
cd ~
mkdir .ssh
cd .ssh 
nano authorized_keys
```
If you'd like to learn how to create an SSH key do so [here](https://github.com/StarWhiz/docker_deployment_notes/tree/master/initial%20ubuntu%20setup/putty%20keys%20tutorial)

### 5. Disable Root Login
```
sudo sed --in-place 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/g' /etc/ssh/sshd_config
sudo sed --in-place 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
```
Using two sed commands above is the short way to disable root login. To disable it manually you can just do `sudo nano /etc/ssh/sshd_config` find a line called PermitRootLogin modify it. Then find a line called PasswordAuthentication and modify it as well.

If you need to be a root user, first login as **sammy**, your username. Then use the command below to be a root user.
```
sudo su
```
To stop being a root user and go back to **sammy** just do
```
exit
```

### 6. Setup Passwordless Sudo
Replace **sammy** with your actual username.
```
echo "sammy ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
```
You do this so you don't have to type your password everytime you add sudo in front of a command.

### 7. Install Docker
Replace ${USER} in the last line with your username, like `sudo usermod -aG docker sammy`.
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
Logout of **sammy** and SSH back in.

```
id -nG
```
This should return: **sammy** sudo docker

### 8. Install Docker-Compose
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```

### 9. Create a docker network called caddy_net
```
docker network create caddy_net
```

# Installing and Using Caddy
Caddy is the easiest reverse proxy ever! 

It allows you to host multiple applications based on the same or different hostname: such as nextcloud.yourwebsite.com, seafile.yourwebsite.com, rocketchat.yourwebsite.com, and yourwebsite.com.

### Requirements
* **Port 80 and 443 forwarded** on the router/firewall to the docker host machine. If you're using a remote server, we already did this with ufw. But if you're running a local server, you will need to open ports 80/tcp and 443/tcp on your router as well and point them to your local server.

* **A domain name** like `example.com` you can buy one for cheap on namecheap.
  * After buying your domain you need to set custom DNS records. 
  * Create new type A records that point to the Public IP of your server.
 
### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── caddy/
            ├── config/
            ├── data/
            ├── .env
            ├── Caddyfile
            └── docker-compose.yml
```
To achieve this a part of this folder structure do the following below.
```
cd ~
mkdir docker
cd docker
mkdir caddy
cd caddy
```
So now you're inside the caddy folder. 

At minimum you will need a **.env**, **Caddyfile** and **docker-compose.yml**. the config/ and data/ folders are automatically generated by docker-compose later.

#### Creating .env 
Do this with `nano .env` and add the following lines in the .env file. Do not use subdomain. Just use yourrootdomain.com, in this example I'm using example.com
The purpose of the .env file is to substitute variables in your docker-compose.yml in the same directory.
**.env**
```
MY_DOMAIN=example.com
DOCKER_MY_NETWORK=caddy_net
```
**Ctrl+O** to save file.

#### Creating docker-compose.yml
A small explanation about this can be found [here](https://github.com/StarWhiz/docker_deployment_notes#commonly-added-lines-added-to-app-specific-docker-composeyml-files) 
**docker-compose.yml**
```
version: "3.7"
services:

  caddy:
    image: caddy
    container_name: caddy
    hostname: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - MY_DOMAIN
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./data:/data
      - ./config:/config

networks:
  default:
    external:
      name: $DOCKER_MY_NETWORK
```

#### Create Caddyfile
This Caddyfile below is an example for a server with wordpress deployed in a docker container on the same caddy_net network.

**Caddyfile**
```
{$MY_DOMAIN} {
    reverse_proxy wordpress:80
}

www.{$MY_DOMAIN} {
    reverse_proxy wordpress:80
}

chat.{$MY_DOMAIN} {
    reverse_proxy rocketchat:3000
}
```

#### What does this all mean?
You will be editing the **Caddyfile** a lot! Everytime you make changes to the Caddyfile you should restart Caddy with
```
docker exec -w /etc/caddy caddy caddy reload
```
You will be using that command above very often.

In the example Caddyfile, the first two blocks are to handle yourwebsite.com and www.yourwebsite.com and point them to your wordpress container_name.

The third block handles chat.yourwebsite.com and points them to your rocketchat container_name. 

I hope this makes sense. If it doesn't please refer to: https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2

For now your Caddyfile can be the same as the example above if you plan on deploying wordpress and rocket.chat.

**Starting Caddy**
Make sure you're in /home/sammy/docker/caddy
Then do
```
docker-compose up -d
```
to start caddy. To bring it down you can do `docker-compose down`.

### Time to deploy Applications
Congrats you are now ready to deploy applications. The other applications will be deployed the same way you just deployed Caddy! I recommend you deploy [wordpress](https://github.com/StarWhiz/docker_deployment_notes/tree/master/wordpress) first if you are new to this.

The general flow for adding new application like wordpress for example is:

1. Find an application specific [guide](https://github.com/StarWhiz/docker_deployment_notes#application-specific-deployment-guides)
2. Make a new app specific folder in `/home/sammy/docker/` with `mkdir newapp`
3. Navigate inside the new app specific folder with `cd newapp`
4. Create the mimimum files as mentioned in the app specific guides, but don't worry about creating folders inside the newapp folder as they are auto generated in docker-compose.yml
5. Use nano to add the app specific blocks to your Caddyfile in ` /home/sammy/docker/caddy/Caddyfile` and save.
6. Reload caddy `docker exec -w /etc/caddy caddy caddy reload`
7. Change back to your app specific folder ` /home/sammy/docker/newapp`
8. `docker-compose up -d` to start the new application
9. Test your app by visiting yourappsubdomain.yourwebsite.com

That's it! As you do this more often, the more you'll appreciate how fast it is to deploy applications with docker and docker-compose with caddy v2!

Refer to the readme at: https://github.com/StarWhiz/docker_deployment_notes for command references
