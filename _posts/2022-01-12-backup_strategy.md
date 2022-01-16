---
layout: post
category: [homelab,FreeBSD]
---

Recently I migrated my TrueNAS from bare-metal into a Proxmox VM with almost all SATA-COntroller passed through, but more about that in another post. Here I'd like to talk about TrueNAS. I am using TrueNAS since approximately 3 years and had a lot of fun with it and learned a lot. In the process of migrating, i was motivated to question some old setups, what I want to discuss here.

# The Strategy

I have some critical data, whereas data loss would be fatal and downtime most annoying. The rest of the data is just a lot of movies, tv-shows. If this data is not available for some days, it is not a big problem, but data loss would be no fun. The critical part is about 1 TB and the not so critical part about 22 TB. So i figured following setup to make it as cheap an reliable as possible.

> For Readers not familiar with TrueNAS, there is only ZFS as Filesystem. It includes a lot of nice features like Software RAID, lean snapshotting and replication.

## Critical Data
The critical data is in RAID 1 mode "Mirror"[^1]. Maybe I will upgrade that to RAID 5 in the near future. This would provide more performance and capacity. These RAID Levels serve me the right amount of "High Availability". If one drive fails I have time to replace it and everything keeps running. On top of that i make nightly replication on another disk in the same machine and on a external disk. I have two external disks which I rotate weekly. One is always attached and gets the newest replications and one is kept in my car as an off-site backup. My car is not in the same building, it is always parked a couple of 100 m away. So in case of a disaster in the building, it should be fine.

The drives in the server are not encrypted. The probability to get robbed at home is low, but with the car we go to all sorts of locations, therefore the external drives need to be encrypted. I used the default of TrueNAS, which is AES-256-GCM.

## Common Data
My second data category has no high availability requirements, but backups are necessary. I thought of two possible scenarios:

1. RAID 1 "Mirror" with nightly snapshots as backups. Here the down sides are in mirror mode there are always two drive running and the performance is reduced.
2. RAID 0, but replicate the data nightly on another disk. Here we do not have a performance loss and only one drive has to be active a lot. The other one is most of the time in standby and can also be something as cheap as possible...

Variant 2 is the perfect fit for my lab.

---
{: data-content="footnotes"}

[^1]: RAID-Level Summary: [https://en.wikipedia.org/wiki/Standard_RAID_levels](https://en.wikipedia.org/wiki/Standard_RAID_levels){:target="_blank"}
