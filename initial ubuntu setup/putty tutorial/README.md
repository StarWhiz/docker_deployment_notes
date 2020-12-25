This guide was written for Windows Users using PuTTY

In order to setup SSH access to a linux machine by keys you need to paste in the public key on the linux machine in a file located in /home/yourusername/.ssh/authorized_keys 

To get that public key you need to generate a private key first.

It’s important that you don’t share your private key. Your public key can be shared without any issues. You only need one private key to SSH to multiple machines.


## 1.0 Best Practices
Only use one private key per physical machine. Public key however can be on many Linux machines. If you have a Desktop and a Laptop for example. They both should have their own private keys. However their public keys should be on each of the Linux machines you want to access.


## 1.1 Generating Public Private Key Pair

Download putty somewhere on the Internet and install it. Personally I use ninite.com, check PuTTY, download, then run the installer.

After putty is installed search for PutTTYgen in Windows and run it.



