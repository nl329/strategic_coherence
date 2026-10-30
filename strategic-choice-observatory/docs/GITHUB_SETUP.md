# GitHub setup

## Upload this package

1. Create a repository named `strategic-choice-observatory` in your GitHub account. Choose visibility deliberately; public repositories reveal their contents and account identity.
2. Extract the supplied repository ZIP. Upload the **contents** of its `strategic-choice-observatory` folder to the repository root. Do not upload the ZIP itself as the source, or nest everything under a second folder.
3. Ensure `index.html`, `README.md`, `docs`, `examples`, and `tests` appear at the root. Also include `.gitignore`, `.nojekyll`, and `.github` (Finder can show hidden files with Command–Shift–Period). The `.github` workflow is optional for running the app.
4. Commit the files. Do not add API keys, real interview datasets, result exports, or local databases.
5. Select a software license and fill in creator/citation information before distributing under a chosen license. No LICENSE or CITATION.cff with invented details is included.

The package is prepared locally; no GitHub repository or live site has been created automatically.

## Optional GitHub Pages site

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch containing the uploaded files (usually `main`) and **/(root)**, then Save.
4. Wait for the deployment to finish. Use the site address displayed by GitHub; no URL is live merely because the files were uploaded.

Pages availability depends on the account plan and repository visibility. Publishing a Pages site can expose the application publicly even when its source repository is private. Use an appropriate sharing mechanism if anonymous review is required.

Each visitor supplies their own API key. GitHub hosts the static file, not a scoring backend. The included `check.yml` runs tests only; it does not configure Pages or deploy.

Official references:
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Research release / archive

After verifying live scoring with an authorized account, create a named release of the exact repository state used in the study. Include the HTML, documentation, and sample inputs. Deposit that release in the archive of your choice and add the resulting DOI to the README/citation metadata. Do not describe the unpinned model alias as guaranteeing identical historical results.

The app's **Download edited HTML** action changes only the downloaded file. To publish those wording edits, replace the repository's `index.html` with that file (renaming it to `index.html`) and commit it.
