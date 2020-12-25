#!/bin/bash
set -euo pipefail

########################
### SCRIPT VARIABLES ###
########################

# Name of the user to create and grant sudo privileges
USERNAME=yourusername
RACKNERDHOSTNAME=hostnameyouwant

# Whether to copy over the root user's `authorized_keys` file to the new sudo
# user.
COPY_AUTHORIZED_KEYS_FROM_ROOT=false

# Additional public keys to add to the new sudo user
# OTHER_PUBLIC_KEYS_TO_ADD=(
#     "ssh-rsa AAAAB..."
#     "ssh-rsa AAAAB..."
# )

#This is my public key insert your own public key here
OTHER_PUBLIC_KEYS_TO_ADD=(
		"ssh-rsa AAAAB3NzaC1S1eqP9n9bAmxw1X3CGP1DM7cJPssLZVB1oA/m6AswYbLl2Un0hzKrQUXK4HPpMn2mzUn3JuyBfHSGDkmpWAa5XQRdARdN0DeUm7Qyu463jRD/QI7Zkft4CxG5H4YTud3Gn2QzpZy3eoDf1tNhxA03xNCkDJ2FS2p11Ov/dxnmCbOBfpxDm1neYZWhcDVimweCFSmZrx62I+Z2jXFIjEQ9caHFCSXyRtVHbpFK0M0LATuTt61mvlBT7WLA0iHwcpj17V0I0As8AtOaoyPuFtGPPVnMPm77nCnrn0VEfDZsb9aGt8BmcUHKSWF+dQAH5tAR42GfSmvTAYABEh7RmBPaRiNvSClZ7QGHkHAi== 96:2c:83:0f:2c:48:fc:cc:fa:89:28:98:4d:f1:91:e6 rsa-key-20200223"
)

####################
### SCRIPT LOGIC ###
####################

# Add sudo user and grant privileges
useradd --create-home --shell "/bin/bash" --groups sudo "${USERNAME}"

# Check whether the root account has a real password set
encrypted_root_pw="$(grep root /etc/shadow | cut --delimiter=: --fields=2)"

if [ "${encrypted_root_pw}" != "*" ]; then
    # Transfer auto-generated root password to user if present
    # and lock the root account to password-based access
    echo "${USERNAME}:${encrypted_root_pw}" | chpasswd --encrypted
    passwd --lock root
else
    # Delete invalid password for user if using keys so that a new password
    # can be set without providing a previous value
    passwd --delete "${USERNAME}"
fi

# Expire the sudo user's password immediately to force a change
# chage --lastday 0 "${USERNAME}"

# Create SSH directory for sudo user
home_directory="$(eval echo ~${USERNAME})"
mkdir --parents "${home_directory}/.ssh"

# Copy `authorized_keys` file from root if requested
if [ "${COPY_AUTHORIZED_KEYS_FROM_ROOT}" = true ]; then
    cp /root/.ssh/authorized_keys "${home_directory}/.ssh"
fi

# Add additional provided public keysex
for pub_key in "${OTHER_PUBLIC_KEYS_TO_ADD[@]}"; do
    echo "${pub_key}" >> "${home_directory}/.ssh/authorized_keys"
done

# Adjust SSH configuration ownership and permissions
chmod 0700 "${home_directory}/.ssh"
chmod 0600 "${home_directory}/.ssh/authorized_keys"
chown --recursive "${USERNAME}":"${USERNAME}" "${home_directory}/.ssh"

# Disable root SSH login with password. 2nd line disables PasswordAuthentication for sudo user
sed --in-place 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/g' /etc/ssh/sshd_config
sed --in-place 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
if sshd -t -q; then
    systemctl restart sshd
fi

# Add exception for SSH and then enable UFW firewall
#ufw allow OpenSSH
#ufw --force enable

# Make sudo user  passwordless sudo
echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# RackNerd Fix hostname issue
hostnamectl set-hostname $RACKNERDHOSTNAME

# Change Time Zone to PST
timedatectl set-timezone America/Los_Angeles

# RackNerd Fix hostname issue continued
# Open the /etc/hosts file and change the old hostname to the new one.
# This one is more complicated to automate so do this manually.
