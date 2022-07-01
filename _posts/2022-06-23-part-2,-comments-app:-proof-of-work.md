---
layout: post
category: [HashCash, security]
custom_js: comments
---

This is a continuation of an earlier post, see [comments-app]({% post_url 2022-06-12-part-1,-comments-app:-overview %}).

## Proof of work

The proof of work concept is actually old. It was used to prevent DOS / DDOS Attacks on different Protocols and Services.
With the bitcoin it becomes popular again. I don't want to get into, if bitcoin is good or bad, but it certainly is interesting from
a technical point of view. The bitcoin involves many more interesting things than the proof of work, like authenticated datastructures (Merkle Tree), Trusted Timestamping, etc.

But for the moment let us look into the proof of work. Bitcoin uses the proof of work to elect a leader. The leader announces the new
block to the network. The proof of work guarantees that there is a random leader for every block and more importantely it makes sure
that not a single entity can take over the network. It does that by adjusting the difficulty of proof of work.

How does the proof of work of bitcoin and our comments-app work? Every miner tries to find a **special** hash of the new block. Bitcoin
uses the cryptographic hash SHA-256.
The one who finds it gets a little reward. The **special** hash looks like:

>00 00 90 34 8D 13 6E CC 33 AC A4 D1 22 6B 83 9A 2D 2C 46 20 10 65 C4 4E 15 D5 92 2D 87 B8 A3 21

As one sees the leading zeroes are **special**... With bitcoin the block content gets hashed, with the actual nonce[^1], which is used.
The fastest way to finde a nonce, so that the hash looks like the example is to simply increment a counter by 1 till you find it.


## Comments-app

In the comments-app the clients get random strings with a certain difficulty level from the backend. Then the client needs to find a nonce to get the hash with the minimum leading zeroes. The provided random strings are only valid a certain time.

---
{: data-content="footnotes"}

[^1]: [https://en.wikipedia.org/wiki/Cryptographic_nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce){:target="_blank"}
