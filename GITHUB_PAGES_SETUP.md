# Romance Trio — GitHub Pages setup

The website is hosted at: https://ziraddingulumjanly.github.io/Romance-Trio/

## One-time setting (required)

1. Open https://github.com/ziraddingulumjanly/Romance-Trio/settings/pages
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Copy these patch files into the repository root, preserving their folders, then commit and push.
4. Go to the repository **Actions** tab and open **Build and deploy Romance Trio**.
5. Confirm that **build** and **deploy** both succeed. Give Pages a couple minutes to propagate.
6. Open the address above.

```powershell
git add .
git commit -m "Deploy Romance Trio to GitHub Pages"
git push origin main
```

Local development still works with `npm install` then `npm run dev` at http://localhost:3000.

The GitHub Pages build uses `GITHUB_PAGES=true` and `NEXT_PUBLIC_BASE_PATH=/Romance-Trio`. These are intentionally absent during local development.

**Note:** The previous workflow only built the project, and did not deploy. Its first run failed; the full error detail may be visible under Actions when logged in. This patch resolves the missing deployment and image/path configuration, but a separate compile or dependency failure could still need attention if the new workflow errors. Check the failed step's log.

This patch **does not touch** your imported vocabulary, grammar content, listening exercises, logo image assets, or site copy.
