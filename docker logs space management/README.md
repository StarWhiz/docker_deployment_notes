This is a mirror of https://menetray.com/en/blog/how-reduce-size-log-files-docker-containers using [clipboard2markdown](https://euangoddard.github.io/clipboard2markdown/)


HOW TO REDUCE THE SIZE OF LOG FILES IN DOCKER CONTAINERS
========================================================

If you have reached this page it is because you have noticed that your logs are very large and take up more space than you want.

**Detect exactly the size**
---------------------------

The following command shows the size of each of the logs in your docker containers.

```
docker ps -aq | xargs -I '{}' docker inspect --format='{{.LogPath}}' '{}' | xargs ls -lh
```

This would return something similar to:

```
-rw-r----- 1 root root  34K 2017-06-08  /var/lib/docker/containers/3uy7mfiybwnaakfgstokw6h5kmsrzbhmeay9lssnm39v8y5ngf6yz7amd3i8kjhj/3uy7mfiybwnaakfgstokw6h5kmsrzbhmeay9lssnm39v8y5ngf6yz7amd3i8kjhj-json.log
-rw-r----- 1 root root 276K 2018-04-16  /var/lib/docker/containers/q51e1h6e3y4uproc0u4qq8bvighswuzhqi1jzw49ucqarsbcftfdcpa26ls02bxo/q51e1h6e3y4uproc0u4qq8bvighswuzhqi1jzw49ucqarsbcftfdcpa26ls02bxo-json.log
-rw-r----- 1 root root 4,2M 2019-03-21  /var/lib/docker/containers/l3m2ioyd1fapcy1a8wro1b4cx877b3f0ikujem8x8xlxon0t4sjs1xkdqh2eona8/l3m2ioyd1fapcy1a8wro1b4cx877b3f0ikujem8x8xlxon0t4sjs1xkdqh2eona8-json.log
-rw-r----- 1 root root 7,2M 2019-03-21  /var/lib/docker/containers/lbq2x85gdwdj2gkmv9qfnk0axdewr790huhdq0ojksiuxxhfsp8y8q4bpj4ri5t4/lbq2x85gdwdj2gkmv9qfnk0axdewr790huhdq0ojksiuxxhfsp8y8q4bpj4ri5t4-json.log
-rw-r----- 1 root root 1,3M 01-10 12:19 /var/lib/docker/containers/mkvqklyhft8nr6gwfzkccayl9nlpnfspxmc0gqd9d1c4mgilj5muzoxluwkf9eav/mkvqklyhft8nr6gwfzkccayl9nlpnfspxmc0gqd9d1c4mgilj5muzoxluwkf9eav-json.log
-rw-r----- 1 root root 131G 01-11 18:19 /var/lib/docker/containers/nol87bct8i1pd0ya6pg1m3iva0cpgdde6khm0vym0g0jlob1jd3gcgbwm1scfpyg/nol87bct8i1pd0ya6pg1m3iva0cpgdde6khm0vym0g0jlob1jd3gcgbwm1scfpyg-json.log
```

In this example, we see that there is a 131G file. Which is crazy!

Now let's delete those logs that we know are wrong.

It may be advisable to make a backup by compressing the data first (it depends on how important the logs are to you):

```
sudo cat /var/lib/docker/containers/nol87bct8i1pd0ya6pg1m3iva0cpgdde6khm0vym0g0jlob1jd3gcgbwm1scfpyg/nol87bct8i1pd0ya6pg1m3iva0cpgdde6khm0vym0g0jlob1jd3gcgbwm1scfpyg-json.log | bzip2 --best --compress --stdout &gt; /mnt/nfs-shared/temp/c12a851-12.01.2019.log.bz2
```

**Removing the logs**
---------------------

First, let's install util-linux. You might already have it installed, but just in case:

```
sudo apt-get install util-linux
```

To remove the logs we are going to use fallocate. Specifically, we are going to remove the first 130G of the 131G file. So we are going to leave the file with the last logs.

```
sudo fallocate --collapse-range --offset 0 --length 130GiB --verbose /var/lib/docker/containers/nol87bct8i1pd0ya6pg1m3iva0cpgdde6khm0vym0g0jlob1jd3gcgbwm1scfpyg/nol87bct8i1pd0ya6pg1m3iva0cpgdde6khm0vym0g0jlob1jd3gcgbwm1scfpyg-json.log
```

I think there is no need to explain much. You have to modify the value 130GiB by the size you want to delete, and you have to modify the file path with one of your files.

You can check the new file size if you run the command again to see the weight. In this example, it returns that now the weight is 0.7G.

**Permanent solution**

You have to configure docker so that the logs do not consume excessive disk space. And that they are automatically rotated.

This can be achieved by specifying logging in each of the containers in your docker-compose.yml file

```
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

Or my preferred, specify this setting as default for all dockers:

```
echo '{"log-driver": "json-file", "log-opts": {"max-size": "10m", "max-file": "3"}}' | jq . > /etc/docker/daemon.json\
  && systemctl restart docker
```


# Personal Notes
ncdu is a great tool to scan and view each directory file size. Much easier that the native df tool in ubuntu.
```
sudo apt update
sudo apt install ncdu
sudo ncdu / --exclude=/media
```
Seafile Garbage Collector
```
docker exec seafile /scripts/gc.sh
```