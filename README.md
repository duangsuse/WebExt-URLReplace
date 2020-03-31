# URLReplace

Replace tab `document.location` in page-script, need `storage` permission to manage settings `options.html`

## Building

```bash
npm run build 

#will run clean, sh build.sh, zip package combination
```

## Limitation

1. escape in destinations like: `\1` can be ambiguated with digits in URL

2. regex trim will trim out many abnormal char from source URL

```js
const REGEX_TRIM = /(\([^\)]*)|\^|\$|\*|\(|\)|\[|\{|\\|\|/g; // rest metachar: .+?-
const trimRegex = s => s.replace(REGEX_TRIM, "");
```
