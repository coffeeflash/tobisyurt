---
layout: post
category: [HashCash, security]
custom_js: comments
---

This is a part of a series, see also:
* [Part 1, Comments App: Overview]({% post_url 2022-06-12-part-1,-comments-app:-overview %})
* [Part 3, Comments App: Admin and Reply]({% post_url 2022-07-04-part-3,-comments-app:-admin-and-reply %})
* [Test the Comments App]({{ site.baseurl }}/test_comments_app)

## Proof of work

The proof of work concept is actually old. It was used to prevent DOS / DDOS Attacks on different Protocols and Services.
With the Bitcoin it becomes popular again. I don't want to get into, if Bitcoin is good or bad, but it certainly is interesting from
a technical point of view. The Bitcoin involves many more interesting things than the proof of work, like authenticated datastructures (Merkle Tree), Trusted Timestamping, etc.

But for the moment let us look into the proof of work. Bitcoin uses the proof of work to elect a leader. The leader announces the new
block to the network. The proof of work guarantees that there is a random leader for every block and more importantely it makes sure
that not a single entity can take over the network. It does that by adjusting the difficulty of proof of work.

How does the proof of work of Bitcoin and our comments-app work? Every miner tries to find a **special** hash of the new block. Bitcoin
uses the cryptographic hash SHA-256.
The one who finds it gets a little reward. The **special** hash looks like:

>00 00 90 34 8D 13 6E CC 33 AC A4 D1 22 6B 83 9A 2D 2C 46 20 10 65 C4 4E 15 D5 92 2D 87 B8 A3 21

As one sees the leading zeros are **special**... With Bitcoin the block content gets hashed, with the actual nonce[^1], which is used.
The fastest way to find a nonce, so that the hash looks like the example is to simply increment a counter by 1, then hash it with the
desired cryptographic hash function. Next check if you have the right amount of leading zeros, otherwise repeat till you find it.

## Comments-app

In the comments-app the clients get random strings with a certain difficulty level from the backend. Then the client needs to find a nonce to get the hash with the minimum leading zeros. The provided random strings are only valid a certain time.

In the use case of the comments app, we can not profit from parallelization as in traditional crypto-mining, considering web-browsers.
That is why the hash quizes are rather simple, but still would be a hassle for attackers. Additionally i added some ip-blocking mechanism.

---
{: data-content="footnotes"}

[^1]: [https://en.wikipedia.org/wiki/Cryptographic_nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce){:target="_blank"}
