# Symma landing

The public landing page for [Symma](https://github.com/pgup-ai/symma): one Slack bot that routes
each person to their own local or cloud ACP agent.

## Local preview

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173).

The site is dependency-free HTML, CSS, and JavaScript. Vercel deploys `main` to
[symma.dev](https://symma.dev), while other branches receive preview deployments.
