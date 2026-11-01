# Strategic Choice Observatory

**Portable HTML edition — documentation date: 30 October 2026**

Strategic Choice Observatory is a browser-based research tool for assessing the alignment and reasoning quality of strategic choices. It evaluates a written response using three separate LLM ratings: alignment with a stated objective, logical reasoning, and convincing reasoning. An optional composite combines these ratings.

This README describes the accompanying `prototype.html` file. The file can be renamed `strategic-choice-observatory.html` without changing its behavior. No installation, Python, Jupyter, or hosted application server is required.

## 1. Requirements

- A modern browser capable of running JavaScript and making HTTPS requests.
- An internet connection for scoring.
- Your own OpenAI API key with access to `gpt-5.6` and sufficient API quota.

API calls are billed to the account associated with the entered key. The archive does not include a key. Browser or network security settings may block API calls from a locally opened HTML file; compatibility with every browser has not been established.

## 2. Quick start

1. Download and extract the archive, if supplied as a ZIP.
2. Open the HTML file in your browser, rather than an email attachment preview.
3. In **Connection settings**, enter your API key and select **Set API key**. Setting a key does not validate it; validation occurs on the first scoring request.
4. Select one or more scoring categories.
5. Enter an optional company/reference label, select a choice topic, and paste the response. Enter the strategic objective when requesting alignment or a composite.
6. Choose **Quick score · 1 run** or **Research score · mean of 5 runs**.
7. Select **Score selected categories**.
8. Use **Download CSV** to save results before refreshing or closing the tab.

**Load example** fills the input fields with illustrative text. It does not supply a predetermined score; scoring that example makes real API calls.

## 3. Measures and aggregation

| Measure | Input sent for scoring | Scale anchors |
| --- | --- | --- |
| Alignment | Objective and response | 1: not at all aligned; 3: somewhat aligned; 5: very aligned |
| Logical reasoning | Response only | 1: illogical; 3: somewhat logical; 5: logical |
| Convincing reasoning | Response only | 1: reduces belief in company success; 3: does not change belief; 5: increases belief |

The company/reference label and topic are metadata; they do not enter the scoring prompts. Topics are markets, differentiation, organization (`org`), and culture.

For five-run mode, each component score is the arithmetic mean of five separately requested integer ratings. Individual ratings are retained. Displayed ranges describe variation across runs; they are not confidence intervals.

Let A, L, and C denote the alignment, logical, and convincing component means:

```text
Reasoning average = (L + C) / 2
Composite = (A + (L + C) / 2) / 2
          = 0.50 × A + 0.25 × L + 0.25 × C
```

Selecting **Composite score** automatically includes all three component assessments. The composite is calculated locally, with no additional API call. It requires all three completed components from the same assessment. The reasoning average is included in the composite export; it is not a separate model rating.

## 4. CSV batch input

Select categories and scoring mode, choose a CSV file, then click **Preview CSV**. Review validation errors and the estimated API-call count before selecting **Score batch**. Previewing does not call OpenAI.

Recommended headers:

```csv
company,topic,objective,response
Example company,markets,Serve small independent retailers,We focus sales on independent shops
```

- `company`: optional reference; `companyid` is also accepted.
- `topic`: required. Use `markets`, `differentiation`, `org`, or `culture`. `organization` is normalized to `org`; `moat` to `differentiation`.
- `objective`: required for alignment or composite scoring; optional for reasoning-only scoring.
- `response`: required; `q` is also accepted.

Use UTF-8 text and comma delimiters. Quote values containing commas or line breaks; escape a quotation mark inside a quoted field by doubling it. The interface accepts up to 100 data rows and files up to 2,000,000 bytes. Required objective/response fields are limited to 20,000 characters; company/reference labels to 200 characters. A template can be downloaded from the interface.

The number of API calls is:

```text
Rows × selected component measures × runs per measure
```

For example, 10 rows with all three components and five runs require 150 API calls. Adding a composite does not increase this count.

Batches run sequentially. Keep the tab open. **Stop after current assessment** completes the current component assessment, including its requested runs, before stopping. A failure stops the batch; completed components remain available for download. A failed component's partial runs are not saved as an assessment, although completed requests may still be billed. There is no automatic resume or deduplication; retry only unfinished rows/categories to avoid duplicate scoring.

## 5. Model and API configuration

The archived HTML explicitly requests:

| Setting | Value |
| --- | --- |
| API endpoint | `https://api.openai.com/v1/responses` |
| Model | `gpt-5.6` |
| Reasoning effort | `high` |
| Maximum output tokens | `25000` |
| Store parameter | `false` |
| Temperature | Not specified |
| Browser timeout | 300 seconds per request |
| Accepted final output | Exactly one integer from 1 through 5 |

The output-token allowance accommodates reasoning as well as the final score; the requested visible answer is still one integer. Only responses with status `completed` and a valid integer are accepted. Incomplete responses, refusals, malformed answers, and API failures do not become scores.

All three component measures use the same model and effort setting. The composite is arithmetic, not another model evaluation.

## 6. Exact scoring prompts

The following text reflects the HTML implementation, rather than any later revision of the research notebooks. Bracketed placeholders below are replaced with the supplied input text. The alignment prompt intentionally preserves the notebook's lack of a space between `OBJECTIVE?` and `(1`.

### Alignment

Instructions:

```text
Return exactly one integer from 1 through 5. Make your best estimate even if information is incomplete. Do not return any explanation or additional text.
```

Input:

```text
On a scale of 1-5 (using the entire scale), to what extent is the RESPONSE aligned with the OBJECTIVE?(1 = not at all aligned, 3 = somewhat aligned, 5 = very aligned).

OBJECTIVE: [objective text]

RESPONSE: [response text]
```

Exported prompt version: `alignment-objective-2026-10-28`.

### Logical reasoning

Instructions:

```text
You are a helpful assistant that only returns a number between 1 and 5.
```

Input:

```text
On a scale of 1-5, how logical is the response? (1= response is illogical, 3= response is somewhat logical, 5= response is logical).

[response text]
```

Exported prompt version: `logical-notebook-v1`.

### Convincing reasoning

Instructions:

```text
You are a helpful assistant that only returns a number between 1 and 5.
```

Input:

```text
On a scale of 1-5, how does this response change your beliefs in the success of this company (1= reduces your beliefs, 3=doesn’t change your beliefs, 5 = increases your beliefs).

[response text]
```

Exported prompt version: `convincing-notebook-v1`.

The logical and convincing prompts retain the earlier portable app wording. They are not the expanded system messages used in some later interview notebooks. The composite formula is labeled `composite-v1`.

## 7. Results and downloads

Each completed component or composite creates a separate result row. CSV exports contain:

- Reference label, topic, objective, and response.
- Category, mean score, individual scores, run count, and UTC timestamp.
- Requested model, reasoning effort, and prompt-version identifier.
- Per-run response IDs, returned model names, and usage metadata when supplied by the API.
- For composite rows: component means, reasoning average, component record IDs, and formula.

Composite rows identify their model as `derived`. Their component records contain the model-call details. The temperature column is blank because no temperature is specified. Record IDs are local to the open tab and are not globally unique.

Text that could be interpreted as a spreadsheet formula is prefixed with an apostrophe in CSV exports. The input text held in the tab is unchanged.

## 8. Data handling

- Scoring sends the relevant input text directly from the browser to OpenAI; no application intermediary server is used.
- The API key is held in the open tab's memory. It is not deliberately saved in browser storage, the HTML, or result downloads.
- Assessment inputs and results remain in the tab's memory until exported. **Refreshing or closing the tab loses them.**
- The API request sets `store: false`; this setting should not be interpreted as a blanket claim about provider-side retention policies.
- Uploading and previewing a CSV is local. Only scoring submits text to the API.
- Page wording preferences may be saved in browser local storage. They do not include the API key or assessment history.

Only submit material you are authorized to send to the API provider. This portable edition has no application-level spending cap; use the displayed call count and your API account controls to manage usage.

## 9. Editing and sharing

Use **Edit page text** to change headings, labels, instructions, and placeholders. **Save changes** applies the wording and attempts to preserve it in this browser. Local-file storage behavior varies across browsers.

Use **Download edited HTML** after saving to create a shareable copy containing the edited wording. This download excludes the current API key and assessment results. Page-text editing does not change scoring prompts or the composite formula.

The built-in **Restore defaults** option loads the template wording, which can differ from your saved edits. Cancel if you do not want those defaults, or edit and save the wording you prefer.

To share, distribute the HTML and this README together, optionally in a ZIP. Recipients enter their own API key. Archive the exact HTML version used for a study; later model or prompt changes should be documented as a new release.

## 10. Interpretation, reproducibility, and verification

Scores are model-based judgments, not validated predictions of company performance. A logical or convincing response need not explain how a choice advances the stated objective. Low alignment may reflect an absent explicit connection rather than strategic incompatibility. The convincing measure concerns changes in belief about company success, not solely the formal quality of an argument.

Repeated ratings may differ. The model identifier is not a pinned snapshot, and service availability or behavior may change. Preserving the HTML, exact inputs, prompts, settings, and exported outputs supports documentation, but does not guarantee identical future scores or reproduce historical interview ratings.

At the time this README was prepared, automated checks with simulated API responses had verified request settings, response parsing, score aggregation, composite calculation, CSV processing, and incomplete-response rejection. Live scoring with a real API key and exhaustive browser compatibility had not been verified in this session.

## 11. Troubleshooting

- **Key rejected:** check that the entered value is an API key and that the account permits API use.
- **Model unavailable:** verify account access to the requested model. The app does not silently substitute another model.
- **Quota or rate limit:** check the account's available quota and usage controls; retry later if appropriate.
- **Network error:** check connectivity and whether the browser or network blocks requests from local HTML files.
- **Timeout or incomplete response:** no score is recorded for that component. A request may still have consumed billable tokens.
- **CSV rejected:** check headers, topic values, quoting, row count, file size, and required objectives.
- **Missing results after refresh:** results were held only in memory. Download before refreshing or closing.

## 12. Archive metadata

This README deliberately does not assign an author, institutional affiliation, DOI, or software license. Supply accurate creator and citation metadata when depositing the archive, and select a license appropriate to your rights and intended reuse. The documentation date above is not a declaration that the software has been publicly released.
