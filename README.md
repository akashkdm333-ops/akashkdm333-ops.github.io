\# GST Calculator — deploy to GitHub Pages



This repository serves a static GST calculator published to GitHub Pages at:



https://akashkdm333-ops.github.io



How to publish (command-line)

1\. Create the repository on GitHub named exactly: `akashkdm333-ops.github.io`

&nbsp;  - You can create it via the GitHub web UI or GitHub CLI.



2\. From your local project folder (ensure all files listed in this repo are present), run:



```bash

git init

git add .

git commit -m "Initial site: GST calculator"

git branch -M main

git remote add origin https://github.com/akashkdm333-ops/akashkdm333-ops.github.io.git

git push -u origin main

```



3\. Wait a few minutes. Because the repo is named `akashkdm333-ops.github.io`, GitHub Pages will automatically publish the contents of the `main` branch at:

&nbsp;  https://akashkdm333-ops.github.io



Notes \& next steps

\- Analytics: add your GA4 measurement ID in `index.html` (head) by uncommenting the gtag block and replacing `G-XXXXXXXX`.

\- Ads: after applying/receiving approval from AdSense, add the script and ad units (replace ca-pub-XXXXXXXX).

\- Privacy/Contact: update `privacy.html` and `contact.html` with accurate email/contact info.

\- Custom domain: If you later buy a domain, you can configure it in the repo's Pages settings or in your domain registrar (CNAME/A records). For a user site (username.github.io), the GitHub-managed URL is already active.

\- To update site: edit files, commit, and push; the site updates automatically.



If you want, I can:

\- Create a small blog post (SEO-friendly) to bootstrap traffic

\- Add an AdSense placement example (HTML + CSS) for approved accounts

\- Provide a Netlify/Vercel serverless function for Stripe Checkout if you want paid features later

