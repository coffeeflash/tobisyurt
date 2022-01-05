---
layout: page
title: About
---

I am `tobi`. I spent hours in fiddling around in my homelab, but couldn't share it with a lot of people. So i decided to make my notes publicly available. Eventually someone else gets motivated or has thoughts for my projects or even new ideas.

<!--
## Table of contents
- [Resume](#resume)
- [Homelab](#homelab)


## [Resume](#resume)

To do ...

## [Homelab](#homelab)
-->
## Homelab

### Milestones
#### 2017: NAS
I was collecting movies and tv-shows on several external hard-drives. Inevitable frustration followed and the need of a NAS[^1] was acute. I wanted to keep it simple, low-cost and to still be able to use the external hard-drives.

I decided to use an old desktop pc and convert it into a NAS. After a lot of research i decided to go with TrueNAS Core (then FreeNAS), which was not supposed to be the easiest path, but I really loved their new web-interface (corral) ... which is probably not the right reason to choose. But luckily I quickly became a big fan of the system!

In this very first setup i just used it as file-server for sharing movies and tv-shows with my HTPC[^2] (Kodi, then XBMC). Of course i used it also for normal backups with smb/nfs shares.
#### 2018: Nextcloud and Print-Service
After getting used to TrueNAS i looked a bit under the hood and started exploring FreeBSD in a jail. At that point there were no working plugin for nextcloud so i set it up myself, that's when i was first confronted with FreeBSD. It certainly helps if you know Linux already, but it is a bit different. Unfortunately at that point i realized that my hardware does not support visualization to make Linux VM's, so i had no choice but to explore the FreeBSD Jails.

These so called jails are an interesting concept and makes a lot of sense in the set up of a NAS. I do not dare to explain it here, i leave that to FreeBSD itself; see [here](https://docs.freebsd.org/en/books/handbook/jails/){:target="_blank"}.
#### 2020: Reverse proxy, lots of jails
To do ...
#### 2021: OPNSense Router
To do ...

---
{: data-content="footnotes"}

[^1]: <u>N</u>etwork <u>A</u>ttached <u>S</u>torage
[^2]: <u>H</u>ome <u>T</u>heater PC
