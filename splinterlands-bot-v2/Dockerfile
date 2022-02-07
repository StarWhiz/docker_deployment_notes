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