[Ultimate Splinterlands Bot V2](https://github.com/PCJones/Ultimate-Splinterlands-Bot-V2) 
Thank you PCJones for creating this bot!

This is my implementation of the dockerized version of the bot it is fatter than ontje-dev's version (341MB vs 129MB).
* Note1: I can't seem get update checks to work on my version! due to a "config/version.usb" timestamp error. But it seems to work on ontje-dev's version

* Note2: If you rather use ontje-dev's version you can use their [Dockerfile](https://github.com/ontje-dev/Ultimate-Splinterlands-Bot-Docker/blob/main/Dockerfile) with the [docker-compose-onteje-dev-version.yml](https://github.com/StarWhiz/docker_deployment_notes/blob/master/splinterlands-bot-v2/docker-compose-onteje-dev-version.yml) included in this repository. Make sure you modify the `BOT_VERSION` in their Dockerfile to the version you want as described in my Dockerfile [section](https://github.com/StarWhiz/docker_deployment_notes/tree/master/splinterlands-bot-v2#dockerfile).

To start deploying. Create all the folders and files below with the modifications specified.

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── splinterlands-botv2/
            └── config/
	        ├── accounts.txt
		├── config.txt
		├── version.usb
            ├── Dockerfile
            ├── docker-compose.yml
```
### accounts.txt
Modify to use your own usernames and posting keys
```
username:postingkey
username:postingkey
```

### config.txt
No modification needed to run but you can modify if you want to!
```
##################General Settings##################
PRIORITIZE_QUEST=true
SLEEP_BETWEEN_BATTLES=5
START_BATTLE_ABOVE_ECR=0
STOP_BATTLE_BELOW_ECR=75
MINIMUM_BATTLE_POWER=0
CLAIM_SEASON_REWARD=false
CLAIM_QUEST_REWARD=false

##E.g. if you are almost bronze 1 and have enough power, it won't claim quest reward until you are bronze 1
DONT_CLAIM_QUEST_NEAR_HIGHER_LEAGUE=true

##If enabled it will click on the advance to next league button
ADVANCE_LEAGUE=true

##seperate by comma like this: earth,life - it will request new quest on earth and life quest
##Remove the # at the beginning of the next line to activate
#REQUEST_NEW_QUEST=earth
##################General Settings##################

##################Lightning Mode Settings##################
#####If you want to use the fast, low resource blockchain mode of the bot enable this#####
#####It has 90% less requests to splinterlands API then playing via browser, so you  #####
#####will not get soft banned from splinterlands anymore.                            #####
USE_LIGHTNING_MODE=true

##Threads = number of parallel accoounts.
##Threads are MUCH faster than in the browser mode
THREADS=1

##Disable this if you want a cleaner log or you have problems with too many
##requests to the splinterlands API. Disabling will also make battles 10-25 seconds faster.
SHOW_BATTLE_RESULTS=true
##################Lightning Mode Settings##################

#######################API Settings########################

USE_API=true
API_URL=http://splinterlandsapi.pcjones.de:8080/

##PRIVATE API Settings - ignore if you don't have it
USE_PRIVATE_API=false
PRIVATE_API_URL=
PRIVATE_API_SHOP=
POWER_TRANSFER_BOT=false
#######################API Settings########################

#####################Advanced Settings#####################
AUTO_UPDATE=true
SHOW_API_RESPONSE=true
DEBUG=false
WRITE_LOG_TO_FILE=false

##Enable this if you get weird characters in your console that makes it hard to read
DISABLE_CONSOLE_COLORS=false

##Linux / VPS Variables - ignore if bot works
#CHROME_BINARY_PATH=path/to/chrome/binary
CHROME_NO_SANDBOX=true

##Advanced bot logic

#If you enable both DONT_CLAIM_QUEST_NEAR_HIGHER_LEAGUE and this the bot will not only wait
#until you have enough rating for the higher league, but also until you have enough
#power. Don't enable this unless you actively manage your power.
WAIT_FOR_MISSING_CP_AT_QUEST_CLAIM=false
#####################Advanced Settings#####################








###################Browser Mode Settings###################
#####If you want to use the old browser based version of the bot enable this#####
USE_BROWSER_MODE=false

## HEADLESS true = invisible browser
HEADLESS=true

##MAX_BROWSER_INSTANCES = MultiThreading!
##2 = 2 Browsers will open, so 2 accounts can fight at the same time
MAX_BROWSER_INSTANCES=2
###################Browser Mode Settings###################
```

### version.usb (optional)
This file is not required to run the container. I got this file from the [linux-x64.zip](https://github.com/PCJones/Ultimate-Splinterlands-Bot-V2/releases). It's used for an update check but I'm not sure why it fails in my container but not ontje-dev's.
```
2022-01-28 22:54:52
linux-x64 

```

### Dockerfile
You need to modify ARG BOT_VERSION="2.9-fix2" to be on the latest version, if "2.9-fix2" isn't the latest version.

Check for latest version here: [Ultimate Splinterlands Bot V2](https://github.com/PCJones/Ultimate-Splinterlands-Bot-V2/releases)

Note: You may use [ontje-dev's Dockerfile](https://github.com/ontje-dev/Ultimate-Splinterlands-Bot-Docker/blob/main/Dockerfile) instead which has a smaller footprint.

```
FROM ubuntu:latest

ARG BOT_VERSION="2.9-fix2"

RUN apt-get update && apt-get install -y wget

# Add dotnet runtime to repository
RUN wget https://packages.microsoft.com/config/ubuntu/21.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN rm packages-microsoft-prod.deb

RUN apt-get update && apt-get install -y \
    apt-transport-https \
    dotnet-runtime-6.0 \
    unzip

RUN wget https://github.com/PCJones/Ultimate-Splinterlands-Bot-V2/releases/download/v${BOT_VERSION}/linux-x64.zip

RUN unzip linux-x64.zip || true

RUN rm -f linux-x64.zip

WORKDIR ./linux-x64

RUN mv Ultimate\ Splinterlands\ Bot\ V2 ultimatesplinterlandsbotv2

RUN chmod +x ultimatesplinterlandsbotv2
```

### docker-compose.yml
Note: If you are using ontje-dev's Dockerfile, subtitute this docker-compose with [docker-compose-onteje-dev-version.yml](https://github.com/StarWhiz/docker_deployment_notes/blob/master/splinterlands-bot-v2/docker-compose-onteje-dev-version.yml)
```
version: '3'

services:
    splinterlandsbotv2:
        restart: unless-stopped
        container_name: splinterlands
        build: .
        volumes:
            - ./config:/linux-x64/config
        command: "./ultimatesplinterlandsbotv2"
#       fordebugging... command: "tail -f /dev/null"
```

### Running the Container
Type in `docker-compose up -d` to run the container!

To check how the bot is doing live run `docker logs --follow splinterlands` otherwise to check the logs run `docker logs splinterlands`

### Updating The Bot
To update the bot...
* Run `docker-compose down` inside the splinterlands folder to bring down the container
* Edit the Dockerfile argument `ARG BOT_VERSION="2.9-fix2"` to the version you want.
* After that, run `docker-compose build` to rebuild the image under the new version.
* Run `docker-compose up -d` to launch the bot.
* And as always you can watch what the bot is doing live with `docker logs --follow splinterlands`
