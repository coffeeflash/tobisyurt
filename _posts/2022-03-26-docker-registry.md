---
layout: post
category: [homelab,Docker]
custom_js: comments
---

I had Dockerfiles lying around at work- and home-servers and also on some laptops.
So after while searching on different places I felt the urge to organize it. I was
not comfy to put everything on [Docker Hub](https://hub.docker.com/), because
I also wanted the possibility to put some quick and dirty images with hard coded
credentials and things I just don't want tu publish. To pay for a subscription to
be allowed to also host private images ond Docker Hub was also not my thing.

So I decided to put my Dockerfiles and what's needed to build them on my private git.
Then make proper jenkins pipelines to build the images and finally push them to my
registry (git and jenkins are not a part of this post).

I decided to use a simple setup instead of big stacks of containers like for example
harbor (see [https://goharbor.io/](https://goharbor.io/)). So I went with the registry from
docker itself. Unfortunately this is just an api without a nice web interface like docker hub.
That is why I added a simple stateless browser, which is only using the api and the login
mechanism of the registry itself.

# The Registry

The documentation is more than nice, see for yourself;
[https://docs.docker.com/registry/](https://docs.docker.com/registry/)

I started my registry with following docker-compose file:

    version: '3.7'
    volumes:
      registry_data:

    services:
      registry:
      image: registry:2
      privileged: true
      user: root
      restart: always
      ports:
        - 5000:5000
      container_name: registry
      volumes:
        - registry_data:/data
      environment:
        REGISTRY_HTTP_ADDR: 0.0.0.0:5000
        REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data

I enabled the option to use the api also for deleting tags with the variable; `REGISTRY_STORAGE_DELETE_ENABLED: 'true'`.

## Registry Browser

I found the [docker-registry-browser](https://github.com/klausmeyer/docker-registry-browser)
on GitHub, which satisfies my needs. I enabled the delete option here too.

The registry itself runs under the location `/v2`, therefore I decided to put the browser under the
root location `/`.

Following my docker-compose file for the registry browser:

```
---
version: '3'
# volumes:
#   registry-browser_data:  

services:

  browser:
    image: klausmeyer/docker-registry-browser:latest
    container_name: registry-browser
    environment:
      - 'DOCKER_REGISTRY_URL=https://registry.example.com'
      - 'NO_SSL_VERIFICATION=true'
      - 'ENABLE_DELETE_IMAGES=true'

    ports:
      - '8060:8080'
```

## Registry access for watchtower

I use watchtower to label some container and get updated as soon as there is a new
image push. But for that to work with private registries you have to get the
credentials inside your container. Following my way doing it:

* make a login in the registry on whatever environment you like with:
  `docker login yourPrivateRegistry`
* Then copy the generated `.docker/config.json` into a docker volume of your choice.
If you have logged in more than one private registry, clean the config.json accordingly.
* Then link the volume to watchtower.

My docker-compose file for this (Caution, I also introduced the environment variable
`DOCKER_CONFIG=/config`):

```yaml
version: '3'

volumes:
  tobisyurt_cred:

services:
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - tobisyurt_cred:/config/
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_LABEL_ENABLE=true
      - WATCHTOWER_INCLUDE_RESTARTING=true
      - TZ=Europe/Zurich
      - WATCHTOWER_POLL_INTERVAL=360
      - DOCKER_CONFIG=/config
      - WATCHTOWER_NOTIFICATIONS=email
      - WATCHTOWER_NOTIFICATION_EMAIL_FROM=...
      - WATCHTOWER_NOTIFICATION_EMAIL_TO=...
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER=...
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT=...
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=...
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=...
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

```

# Nginx Reverse Proxy Authentication

## Basic auth

Generate the users password with a good hash.

    openssl passwd -apr1

Sayve the output of your password in a file and put a username in front ("username:").
The file's content could look like this:

    toob:$apr1$72VMMcsD$rmlext71EvJO4siRmKX9x1

In the nginx configuration add:

    auth_basic "Registry realm";
    auth_basic_user_file /path/to/file/above/passwordfile;

The rest of the configuration cou can take over from the registry recipes[^1].

## SSL Certificates

I got them from "let's encrypt"[^2] and I recommend doing the same. They also provide
a certbot, so you will never have to renew them yourself...


---
{: data-content="footnotes"}

[^1]: [https://docs.docker.com/registry/recipes/nginx/](https://docs.docker.com/registry/recipes/nginx/){:target="_blank"}
[^2]: [https://letsencrypt.org/](https://letsencrypt.org/){:target="_blank"}
