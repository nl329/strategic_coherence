# Strategic Choice Observatory

**How coherent are your strategic choices?**

A portable browser application for assessing the alignment and reasoning quality of strategic choices. Evaluate a single response or upload a CSV, using your own OpenAI API key.

## Get started

1. Download this repository as a ZIP and extract it.
2. Open `prototype.html` in a modern browser.
3. Enter your API key in **Connection settings**.
4. Select scoring categories, add a response and (for alignment) a strategic objective, and click the scoring button.
5. **Download your results before refreshing or closing the tab.**

No installation, backend server, or software dependencies are needed to run the app. Internet access, API billing/quota, and access to the requested model are required. Browser or network settings can block API requests from local HTML files.

## What it measures

| Measure | Inputs | Interpretation |
| --- | --- | --- |
| Alignment | Objective and response | How closely the response aligns with the objective |
| Logical reasoning | Response | How logical the response is |
| Convincing reasoning | Response | Whether the response increases belief in company success |
| Composite | Three component scores | 50% alignment + 25% logical + 25% convincing |

Component ratings range from 1 to 5. Choose one run or the mean of five runs per component. Selecting the composite includes all three components and adds no extra model call.

The app requests **`gpt-5.6` with high reasoning effort** through the OpenAI Responses API. It does not silently fall back to another model. The full prompts, settings, export fields, and interpretation limits are documented in the [user guide](docs/USER_GUIDE.md).

## Features

- Individual scoring and CSV batches of up to 100 rows / 2 MB.
- Input preview and validation before batch scoring.
- Individual ratings, mean scores, and a weighted composite.
- CSV downloads with inputs, model metadata, prompt versions, and component scores.
- Editable page wording and a downloadable customized HTML copy.
- One self-contained HTML file, suitable for local use or static hosting.

## Example CSV

Use [examples/sample-input.csv](examples/sample-input.csv), which contains fictional examples and no interview data. Required columns are `topic` and `response`; `objective` is also required for alignment/composite scoring. `company` is optional. The aliases `companyid` and `q` are supported.

```csv
company,topic,objective,response
Fictional retailer,markets,Serve small independent retailers,We focus sales on independent shops
```

Topics: `markets`, `differentiation`, `org`, `culture`. Use quotes around fields containing commas or line breaks.

## API keys, data, and cost

Each user supplies their own API key. The key stays in the tab's memory and is not included in downloads or deliberately saved to browser storage. Input text is sent directly to OpenAI when scoring. API requests are billed to the user's account.

Assessment history also stays in tab memory until exported. Page wording preferences may be stored locally by the browser. Only submit information you are authorized to send to the API provider. See [SECURITY.md](SECURITY.md).

Ten CSV rows × three components × five runs means **150 API calls**. The composite adds no calls. The app has no dollar spending limit.

## Publish a browser-accessible version

The repository is prepared for GitHub Pages: `prototype.html` is the entry point and `.nojekyll` disables Jekyll processing. Publishing is optional; the local file works independently.

See [GitHub setup and publication instructions](docs/GITHUB_SETUP.md). No API key should be added to the repository, GitHub Pages settings, or an Actions workflow: users enter their own key in the app.

## Reproducibility and verification

Archive the exact HTML release alongside inputs and exported results. The model is not a pinned snapshot; ratings may vary between runs and over time. These are model judgments, not validated predictions of company performance.

Automated tests use simulated API responses and do not consume API credits. They cover model settings, prompt wording, CSV handling, the composite, and error handling. Live API scoring and comprehensive browser compatibility have not been verified for this repository package.

For development only, install Node.js 22 or newer and run:

```sh
node --test tests/portable.test.cjs
```

## Repository contents

- `prototype.html` — application; no build step.
- `docs/USER_GUIDE.md` — instructions, exact prompts, model settings, and limitations.
- `docs/GITHUB_SETUP.md` — upload, Pages, and release instructions.
- `examples/sample-input.csv` — fictional example inputs.
- `tests/portable.test.cjs` — tests using a simulated API.
- `.github/workflows/check.yml` — automated checks; does not deploy or call OpenAI.
- `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md` — maintenance notes.

## License and citation

A license has **not yet been selected**. This package does not grant an open-source license. The owner should choose and add a LICENSE file before inviting reuse under specific terms.

Creator names, affiliations, repository URL, and DOI have deliberately not been invented. Once those are finalized, add citation metadata and include the release identifier in research citations. See the setup guide for archive preparation.
