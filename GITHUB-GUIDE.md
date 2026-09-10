#  Putting SulitCart PH on GitHub — beginner-friendly guide

You do **not** need to be a git expert. Follow one of the two paths below
(Path A uses only clicks, Path B uses 2 commands).

---

## Part 0 — Get the code onto your computer (one time)

1. Download **`sulitcart-ph.zip`** from the Arena workspace (the file viewer offers a
   download button for it).
2. Unzip it:
   - **Windows:** right-click the zip → *Extract All…*
   - **Mac:** double-click the zip
3. You now have a folder called **`sulitcart-ph`**. That folder already contains a
   prepared Git repository (that's the hidden `.git` folder inside — don't delete it).

> ⚠️ Never upload the `node_modules` folder anywhere. It doesn't exist in the zip on
> purpose — every computer rebuilds it with `npm install`.

---

## Part 1 — Make a GitHub account (skip if you have one)

1. Go to **https://github.com/signup**
2. Sign up with your email (free plan is enough). Pick any username, e.g. `juancruz-dev`.

---

## Path A — GitHub Desktop (recommended: zero commands) ✅

1. Install **GitHub Desktop**: https://desktop.github.com (Windows or Mac).
   Open it and sign in with your GitHub account (*File → Options/Preferences → Accounts*).
2. **File → Add Local Repository…**
   (on Mac: *File → Add Local Repository…*)
3. Click **Choose…** and select the unzipped **`sulitcart-ph`** folder → **Add**.
   - If it asks “Create a repository?” instead, you picked the wrong folder — pick the
     one that contains `package.json` and the hidden `.git`.
4. You'll see a banner: **“Publish this repository to GitHub?”** → click **Publish Repository**.
5. In the popup:
   - Name: `sulitcart-ph`
   - Description: `E-commerce checkout flowchart demo (classroom project)`
   - Keep **Public** if you might want the optional free website later (Part 3);
     Private also works fine for sharing with classmates you invite.
   - Click **Publish Repository**.
6. Done 🎉 Your code is now at `https://github.com/YOUR-USERNAME/sulitcart-ph`

---

## Path B — Terminal (2 commands)

1. On github.com click the **+** (top right) → **New repository**.
   - Name: `sulitcart-ph`
   - Public or Private
   - **Do NOT tick** “Add a README”, “.gitignore” or “license” (the zip already has them)
   - Click **Create repository**. Leave the page open.
2. Open a terminal inside the unzipped folder:
   - **Windows:** open the folder in Explorer, type `cmd` in the address bar, Enter
   - **Mac:** right-click the folder → *Services → New Terminal at Folder*
3. Paste these two commands (replace `YOUR-USERNAME`):

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/sulitcart-ph.git
   git push -u origin main
   ```

4. A sign-in window/tab opens — log in with your GitHub account and authorize.
   When it finishes, refresh the GitHub page: your code is there 🎉

> If git ever asks for a *password*: GitHub no longer accepts account passwords for git.
> Use Path A (GitHub Desktop handles login for you), or create a *Personal Access Token*
> (github.com → Settings → Developer settings → Tokens) and use it as the password.

---

## Part 2 — Run it on another computer (e.g. the reporting laptop)

1. Install **Node.js LTS** once: https://nodejs.org
2. Install GitHub Desktop → **File → Clone repository…** → pick
   `YOUR-USERNAME/sulitcart-ph` → choose a folder → **Clone**.
   (Or terminal: `git clone https://github.com/YOUR-USERNAME/sulitcart-ph.git`)
3. Open a terminal in the cloned folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open **http://localhost:5173** — same exact website, fully local, works offline.

---

## Part 3 — Optional: free live link via GitHub Pages

Only if the repo is **Public** and you want a shareable URL
(`https://YOUR-USERNAME.github.io/sulitcart-ph/`):

1. In your local folder, move the file
   `optional-github-pages/deploy-pages.yml` → into a new path `.github/workflows/deploy-pages.yml`
2. Commit + push the change:
   - GitHub Desktop: type any summary (e.g. “add pages workflow”) → **Commit to main** → **Push origin**
   - Terminal: `git add . && git commit -m "add pages workflow" && git push`
3. On github.com: repo → **Settings → Pages → Build and deployment → Source:**
   choose **GitHub Actions**.
4. Wait ~1 minute (Actions tab shows the run). Your site URL appears under Settings → Pages.

For the classroom video you can still just use `npm run dev` — Pages is only a bonus link.

---

## 🆘 Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm` is not recognized | Install Node.js LTS from nodejs.org, then **reopen** the terminal |
| GitHub asks for a password when pushing | Use Path A, or a Personal Access Token (see note above) |
| “Add Local Repository” doesn't detect the folder | Make sure you unzipped first, and pick the folder containing `package.json` |
| Port 5173 already in use | Vite will pick 5174 automatically — read the terminal URL |
| Forgot to push from the classroom laptop | Open GitHub Desktop → **Push origin** button at the top |
