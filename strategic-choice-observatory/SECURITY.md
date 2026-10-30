# Security and data handling

This is a client-side research prototype. Users supply their own API key; browser code necessarily has access to that key while the tab is open. Use trusted copies on trusted devices. Never embed a key in repository files, page wording, screenshots, issues, or example data.

The app sends scoring text directly to OpenAI. It requests `store: false`, which is not a blanket guarantee about provider retention. Scores and API keys are held in tab memory; page wording alone may be retained in local storage. Exported CSVs contain submitted text and should be handled accordingly.

The included data are fictional. The package excludes interview datasets, local results, databases, and credentials. A `.gitignore` helps prevent accidental commits but does not remove secrets that have already been committed.

Do not post API keys or confidential responses when reporting a bug. Use GitHub private vulnerability reporting if the maintainer enables it; otherwise contact the maintainer through an established private channel. This package does not invent a security contact address.
