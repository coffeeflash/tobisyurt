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

Here I summarize the most important implemented projects, when i started writing about my homelab.

### Milestones
#### 2017: NAS
I was collecting movies and tv-shows on several external hard-drives. Inevitable frustration followed and the need of a NAS[^1] was acute. I wanted to keep it simple, low-cost and to still be able to use the external hard-drives.

I decided to use an old desktop pc and convert it into a NAS. After a lot of research i decided to go with TrueNAS Core (then FreeNAS), which was not supposed to be the easiest path, but I really loved their new web-interface (corral) ... which is probably not the right reason to choose. But luckily I quickly became a big fan of the system!

In this very first setup i just used it as file-server for sharing movies and tv-shows with my HTPC[^2] (Kodi, then XBMC). Of course i used it also for normal backups with smb/nfs shares.
#### 2018: Nextcloud and Print-Service

##### Nextcloud
After getting used to TrueNAS i looked a bit under the hood and started exploring FreeBSD in a jail. At that point there were no working plugin for nextcloud so i set it up myself, that's when i was first confronted with FreeBSD. It certainly helps if you know Linux already, but it is a bit different. Unfortunately at that point i realized that my hardware does not support visualization to make Linux VM's, so i had no choice but to explore the FreeBSD Jails.

These so called jails are an interesting concept and make a lot of sense in the set up of a NAS. I do not dare to explain it here, i leave that to FreeBSD itself; see [here](https://docs.freebsd.org/en/books/handbook/jails/){:target="_blank"}.

##### Print-Service
I brought a HP Laserjet 1005 Printer in the household and was used quite often. It's a very fast, simple and reliable black/white Laser-Printer, but... you had to connect over USB to print, you need to install the right driver on all laptops and there was no way to print from a smartphone.

Luckily there was a cheap RaspberryPi waiting for a meaningful purpose in my favorite drawer. I got the inspiration somewhere in the internet, but at the time writing this, i really couldn't remember where...
So i looked into CUPS (<u>C</u>ommon <u>U</u>NIX <u>P</u>rinting <u>S</u>ystem). Nowadays, CUPS is the default printing system under Mac OS X and most Linux distributions as well as recent versions of Solaris, and it's available as a package on all major BSD distributions. With a handful commands you can set it up. You can connect as many printer as you wish and make them available over a RaspberryPi, as long as you find suitable drivers. For HP, hplib got you covered. Voilà a network printer was born.

This by far the easiest, fastest, cheapest and most useful project i implemented in my homelab. It works for everything so far; mobile phones (Android and iOS), Linux systems and Windows.

#### 2020: Reverse proxy, lots of jails
To do ...
#### 2021: OPNSense Router
To do ...

---
{: data-content="footnotes"}

[^1]: <u>N</u>etwork <u>A</u>ttached <u>S</u>torage
[^2]: <u>H</u>ome <u>T</u>heater PC
