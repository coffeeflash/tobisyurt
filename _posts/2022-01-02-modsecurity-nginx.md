---
layout: post
category: [homelab,security]
---

At work i had the the task to prepare a low cost production environment for a project in kenya. It also required a WAF (Web Application Firewall), just as a precaution and to be able to react as fast as possible to the newest vulnarabilities in our technology stack. We decided to go for mod_security 2 on a classic Apache reverse proxy.

This got me motivated to secure my public websites served from my homelab. In general, i think WAF's are a bit overrated and espacially overpriced, but in certain scenarios it makes a lot of sense to install an open source solution. In my opinion it makes sense, if:

1. For whatever reason the web app has a slow release cycle and is hard to update fast (e.g. regulation jungle)
2. You serve apps, where you have limited abilities to change something (closed source, developed externally)
3. Older Webapps, which do not get updated, but you still want to use them...

In my homelab i have some apps under category 2. and 3., what lead me to tackle this.

# NGINX Reverse Proxy

I already configured a NGINX Web Server as my Reverse Proxy. 

# Grafana Dashboard

- ![theme logo](/assets/images/modsec_grafana.png){:.ioda}
- ![theme logo](/assets/images/modsec_grafana1.png){:.ioda}
- ![theme logo](/assets/images/modsec_grafana2.png){:.ioda}
- ![theme logo](/assets/images/modsec_grafana3.png){:.ioda}
## Sample heading 2
### Sample heading 3
#### Sample heading 4
##### Sample heading 5
###### Sample heading 6

Mauris viverra dictum ultricies. Vestibulum quis ipsum euismod, facilisis metus sed, varius ipsum. Donec scelerisque lacus libero, eu dignissim sem venenatis at. Etiam id nisl ut lorem gravida euismod.

## Lists

Unordered:

- Fusce non velit cursus ligula mattis convallis vel at metus[^2].
- Sed pharetra tellus massa, non elementum eros vulputate non.
- Suspendisse potenti.

Ordered:

1. Quisque arcu felis, laoreet vel accumsan sit amet, fermentum at nunc.
2. Sed massa quam, auctor in eros quis, porttitor tincidunt orci.
3. Nulla convallis id sapien ornare viverra.
4. Nam a est eget ligula pellentesque posuere.

## Blockquote

The following is a blockquote:

> Suspendisse tempus dolor nec risus sodales posuere. Proin dui dui, mollis a consectetur molestie, lobortis vitae tellus.

## Thematic breaks (<hr>)

Mauris viverra dictum ultricies[^3]. Vestibulum quis ipsum euismod, facilisis metus sed, varius ipsum. Donec scelerisque lacus libero, eu dignissim sem venenatis at. Etiam id nisl ut lorem gravida euismod. **You can put some text inside the horizontal rule like so.**

---
{: data-content="hr with text"}

Mauris viverra dictum ultricies. Vestibulum quis ipsum euismod, facilisis metus sed, varius ipsum. Donec scelerisque lacus libero, eu dignissim sem venenatis at. Etiam id nisl ut lorem gravida euismod. **Or you can just have an clean horizontal rule.**

---

Mauris viverra dictum ultricies. Vestibulum quis ipsum euismod, facilisis metus sed, varius ipsum. Donec scelerisque lacus libero, eu dignissim sem venenatis at. Etiam id nisl ut lorem gravida euismod. Or you can just have an clean horizontal rule.

## Code

Now some code:

```
const ultimateTruth = 'this theme is the best!';
console.log(ultimateTruth);
```

And here is some `inline code`!

## Tables

Now a table:

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## Images

![theme logo](https://raw.githubusercontent.com/riggraz/no-style-please/master/logo.png){:.ioda}

Logo of *no style, please!* theme[^4]

---
{: data-content="footnotes"}

[^1]: this is a footnote. It should highlight if you click on the corresponding superscript number.
[^2]: hey there, i'm using no style please!
[^3]: this is another footnote.
[^4]: this is a very very long footnote to test if a very very long footnote brings some problems or not. I strongly hope that there are no problems but you know sometimes problems arise from nowhere.
