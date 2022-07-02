---
layout: post
category: [homelab, vue, Spring Boot, Blog, comments]
custom_js: comments
---

This is a continuation of earlier post, see:
* [comments-app, part 1]({% post_url 2022-06-12-part-1,-comments-app:-overview %}).
* [comments-app, part 2]({% post_url 2022-06-23-part-2,-comments-app:-proof-of-work %}).

## Reply

Being able to comment on posts is nice, but getting / giving a reply if there was a question is simply  a must.
So the first feature i wanted to add is a reply function. At first I thought to allow anyone to reply to anyone, but
in this particular app, where no login is needed to write comments, just some security measures, it will get messy quickly...
That's why I decided to only allow the blogger / admin to reply. This should cover about 90% of the use cases...

The reply is directly bound to a comment's id. And should also be editable.

## Admin

As a result of above mentioned "admin only reply feature", an administrator interface is crucial. But how and with what technology?
I quickly knew, that I would be the fastest with the lightweight js-framework vue, with which I was already familiar to a certain
degree.

### Preview

Nice GIF

### Vue

I took the newest version of Vue3. The css part I made as easy as possible and wrote / edited it myself. Vue also comes with nice
development features like a webserver with live reloading capabilities and a lot more.

Requirements:

* See what blog posts have comments, and how many.
* Detail view comments
* Possibility to reply
* Delete comments
* A overview of the latest comments

### Backend

In the backend I added a new controller, which only allows authenticated access in contrast of the comments API.




---
{: data-content="footnotes"}

[^1]: [https://en.wikipedia.org/wiki/Cryptographic_nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce){:target="_blank"}
