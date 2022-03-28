---
layout: post
category: [homelab,Docker]
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
```
    events {
        worker_connections  1024;
    }
    
    http {
        upstream docker-registry {
        server registry:5000;
    }
    
    ## Set a variable to help us decide if we need to add the
    ## 'Docker-Distribution-Api-Version' header.
    ## The registry always sets this header.
    ## In the case of nginx performing auth, the header is unset
    ## since nginx is auth-ing before proxying.
    map $upstream_http_docker_distribution_api_version $docker_distribution_api_version {
    '' 'registry/2.0';
    }
    
    server {
        listen 443 ssl;
        server_name myregistrydomain.com;
        
            # SSL
            ssl_certificate /etc/nginx/conf.d/domain.crt;
            ssl_certificate_key /etc/nginx/conf.d/domain.key;
        
            # Recommendations from https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html
            ssl_protocols TLSv1.1 TLSv1.2;
            ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
            ssl_prefer_server_ciphers on;
            ssl_session_cache shared:SSL:10m;
        
            # disable any limits to avoid HTTP 413 for large image uploads
            client_max_body_size 0;
        
            # required to avoid HTTP 411: see Issue #1486 (https://github.com/moby/moby/issues/1486)
            chunked_transfer_encoding on;
        
            location /v2/ {
              # Do not allow connections from docker 1.5 and earlier
              # docker pre-1.6.0 did not properly set the user agent on ping, catch "Go *" user agents
              if ($http_user_agent ~ "^(docker\/1\.(3|4|5(?!\.[0-9]-dev))|Go ).*$" ) {
                return 404;
              }
        
              # To add basic authentication to v2 use auth_basic setting.
              auth_basic "Registry realm";
              auth_basic_user_file /etc/nginx/conf.d/nginx.htpasswd;
        
              ## If $docker_distribution_api_version is empty, the header is not added.
              ## See the map directive above where this variable is defined.
              add_header 'Docker-Distribution-Api-Version' $docker_distribution_api_version always;
        
              proxy_pass                          http://docker-registry;
              proxy_set_header  Host              $http_host;   # required for docker client's sake
              proxy_set_header  X-Real-IP         $remote_addr; # pass on real client's IP
              proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
              proxy_set_header  X-Forwarded-Proto $scheme;
              proxy_read_timeout                  900;
            }
        }
    }

## SSL Certificates

I got them from "let's encrypt"[^2] and I recommend doing the same. They also provide
a certbot, so you will never have to renew them yourself...
```

---
{: data-content="footnotes"}

[^1]: [https://docs.docker.com/registry/recipes/nginx/](https://docs.docker.com/registry/recipes/nginx/){:target="_blank"}
[^2]: [https://letsencrypt.org/](https://letsencrypt.org/){:target="_blank"}
