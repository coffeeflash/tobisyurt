---
layout: post
category: [homelab, Spring Boot, HashCash, Blog]
---

# Problem



## Requirements

Before I started or a little after the start I noted down some requirements:

1. The user should not have to register somewhere. Not on the blog-website itself, neither on external services like google, facebook, github, etc.
2. The service should has an easy api, which can be integrated with some simple ajax requests. The app should be easily deployable.
3. To show the existent comments, related to a page, is a public api call, without any authentication.
4. Posting comments should be protected as good as possible. Following attacks are considered:
   1. DOS
   2. DDOS
   3. Injections of any sorts (db, remote code executions, etc.)

## Solutions

First ideas to cover these requirements:

1. Easy, just do not implement username/password-like authetication... For security implications, see 4.
2. I am used to building spring boot, which is supporting this requirement. For an easy deploy, I will provide up to date docker images on a registry.
3. Public api endpoint `/api/comments`.
4. That's the point, where it gets interesting:
   1. DOS: Ip blocking after a certain burst of requests (Might be unfair for users, which access the website over the same ip-address). Let me konow if you have a better idea.
   2. DDOS (and DOS): to post a comment, one has to solve a hash puzzle, which needs a couple of seconds to solve (depends on the client device, which could also be a little unfair...).
   3. Covered by Spring Boot and proper implementation...

## Implementation-Notes

### `GET /api/comments`
### `GET /api/quiz`

The comments-service provides a random quiz string with a certain security level (# of leading bytes to be 0), which the client has to hash in a certain way.
~~As an alternative to give the client an id of the quiz, map the quiz to the referrer.~~ --> not a good way, if users come from the same ip-address...

The quiz gets stored in memory for a certain amount of time (e.g. 30 seconds), depending on the complexity of the hash puzzle. The storage key is the quiz string.

### `GET /api/comment`

The client provides following in his request-body:
* quiz-id (aka storage key for the service to find it in the memory) and a solution (calculated nonce)
* identifier to match the comment to the blog-post. (referer [in header] + title of the blog post)
* a username, the comment itself.

## Further Improvements

* reply function, should appear underneath a comment.
* fine tune quiz complexity (bit-wise instead byte-wise)
* ip blocking
---
{: data-content="footnotes"}

[^1]: [https://docs.docker.com/registry/recipes/nginx/](https://docs.docker.com/registry/recipes/nginx/){:target="_blank"}
[^2]: [https://letsencrypt.org/](https://letsencrypt.org/){:target="_blank"}