---
layout: post
category: [homelab, Spring Boot, HashCash, Blog, docker, security, comments]
custom_js: comments
---

[![Comments App Example Integration](/assets/images/logo.svg){: width="200" }](/assets/images/logo.svg)

I started this blog with this nice Jekyll-Theme and wanted to host it myself rather than hosting it on github pages.
But what I missed so far was a comments section. I initially searched for already implemented solutions and found following:

* Paid comments services like Disqus[^1]
* Some projects with comments over github-issues
* Some open-source apps. But unfortunately, they weren't maintained anymore and I was not comfortable with the technology they used.

The first two variants I didn't like, because it costs money and / or I don't own the data.So I thought just do it yourself... and if
so do it exactly as you like and do not try to rebuild something. And last but not least make it fun to build and use

I will make a little serie out o fit, if interested checkout following as well:

* [Part 1, Comments App: Overview]({% post_url 2022-06-12-part-1,-comments-app:-overview %})
* [Part 2, Comments App: Proof of Work]({% post_url 2022-06-23-part-2,-comments-app:-proof-of-work %})
* [Part 3, Comments App: Admin and Reply]({% post_url 2022-07-04-part-3,-comments-app:-admin-and-reply %})
* [Test the Comments App]({{ site.baseurl }}/test_comments_app)

I try to summarize the general thoughts. Let me know in the comments down below, if more details are desired.

## Preview

This app will provide an API and an exemplary integration to provide a comments section to a simple static website. I developed it
for two jekyll blogs, but it is easily integrated in any blog.

The cool thing about this app is, that users do not need to register to any services. They can just post comments and they
decide their selves how anonymous they want be by choosing their username. For
security reasons I implemented some protection in form of hash quizes (similar to the proof of work concept with bitcoin)
and simple ip blocking on certain condtions. More on that later ...

You can get the latest image from docker-hub: [https://hub.docker.com/r/toubivankenoubi/comments](https://hub.docker.com/r/toubivankenoubi/comments)

Everything is open-source and I invite everybody to contribute: [https://github.com/coffeeflash/Comments](hhttps://github.com/coffeeflash/Comments)

Here a little preview, but of course I invite you to comment this very blog post down below and test it yourself. Or if
you just want to write some nonsense to simply test it; [Test the Comments App]({{ site.baseurl }}/test_comments_app).

[![Comments App Example Integration](/assets/images/comments-preview.GIF)](/assets/images/comments-preview.GIF)

## Requirements

Before I started or a little after I wrote down some requirements:

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
   1. DOS: Ip blocking after a certain burst of requests (Might be unfair for users, which access the website over the same ip-address). Let me konow if you have a better idIP_BLOCK_TIME: 900
  QUIZ_COUNT: 5
  QUIZ_VALIDITY_SECONDS: 120
  QUIZ_COMPLEXITY: 2
  ADMIN_NAME: the_bloggers_name
  SPRING_DATA_MONGODB_HOST: mongo
  SPRING_DATA_MONGODB_DATABASE: comments
  SPRING_DATA_MONGODB_AUTHENTICATION_DATABASE: admin
  SPRING_DATA_MONGODB_USERNAME: root
  SPRING_DATA_MONGODB_PASSWORD: pleaseChangeMeea.
   2. DDOS (and DOS): to post a comment, one has to solve a hash puzzle, which needs a couple of seconds to solve (depends on the client device, which could also be a little unfair...).
   3. Covered by Spring Boot and (hopefully) proper implementation...

## Some Details

### `GET /api/comments`

With this call a client (e.g. a blog post) gets comments. It needs two things to identify the comments.

1. ~~The `referer` needs to be declared in the request header (not default in Postamn, if one is testing the api...)~~
--> removed, client provides the source only.
2. The `source` as a request parameter. For example the title of a blog post.

### `GET /api/quiz`

The comments-service provides a certain number of random quiz strings with a certain security level (# of leading bytes to be 0), which the client has to hash in exactly that way.
~~As an alternative to give the client an id of the quiz, map the quiz to the referrer.~~ --> not a good way, if users come from the same ip-address...

> a random quiz string looks like: OfMNU4sZ80CNMbctZU2t0sMLIccAkrUh

The quiz gets stored in memory for a certain amount of time (e.g. 30 seconds), depending on the complexity of the hash puzzle. The storage key is the quiz string.

### `POST /api/comment`

The client provides following in his request-body:
* quiz-id (aka storage key for the service to find it in the memory) and a solution (calculated nonce's)
* identifier to match the comment to the blog-post (url of the post).
* a username and finally the comment itself.

### Configuration

Following environment variables can be set to fit your needs the best as possible:

```yaml
environment:
  IP_BLOCK_TIME: 900
  QUIZ_COUNT: 5
  QUIZ_VALIDITY_SECONDS: 120
  QUIZ_COMPLEXITY: 2
  ADMIN_NAME: the_bloggers_name
  SPRING_DATA_MONGODB_HOST: mongo
  SPRING_DATA_MONGODB_DATABASE: comments
  SPRING_DATA_MONGODB_AUTHENTICATION_DATABASE: admin
  SPRING_DATA_MONGODB_USERNAME: root
  SPRING_DATA_MONGODB_PASSWORD: pleaseChangeMe
  SPRING_SECURITY_USER_NAME: user
  SPRING_SECURITY_USER_PASSWORD: PleaseChangeMe
```

The `QUIZ_COMPLEXITY` is the number of zero bytes needed to solve the quiz. I strongly recommend to leave it 2. 3 takes
much longer in this single threaded client scenario. If you want to make it a bit harder, just increase the `QUIZ_COUNT`.
If you increase `QUIZ_COMPLEXITY` or/and `QUIZ_COUNT`, you should also test if the time suffices on your target client
devices...

`PRING_SECURITY_USER_NAME` and `SPRING_SECURITY_USER_PASSWORD` are for the http basic authentication,
whereas `ADMIN_NAME` is just the blogger's name, which can be shown with the reply text.

See also [Part 3, Comments App: Admin and Reply]({% post_url 2022-07-04-part-3,-comments-app:-admin-and-reply %}) for
the values not discussed here, which are needed for the administration interface.

## Further Improvements

* ~~reply function, should appear underneath a comment. Only reply on comment as an admin / blogger, not further nesting...~~
 --> implemented
* ~~administrator interface (needed for reply function)~~ --> implemented
* ~~fine tune quiz complexity (bit-wise instead byte-wise)~~ --> solved with multiple quizes.
* allow other databases (mariadb, postgres eventually...)
* provide easier integration possibilities in blogs.


---
{: data-content="footnotes"}

[^1]: [https://disqus.com/](https://disqus.com/){:target="_blank"}
