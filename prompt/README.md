# Prompt source

The prompt text for the RLCS Editorial Prompt Tool lives here, not inside `script.js`.
Both the browser tool and any AI workflow read these same files, so an editorial rule
only ever has to be changed in one place.

## Files

| File | Contains |
| --- | --- |
| `rules.md` | Editorial principle, input block, source hierarchy, factual accuracy rules, SEO rules, output format, final instructions |
| `json-ld.md` | The JSON-LD specification (Article schema, plus FAQPage when the article has a visible FAQ section) |
| `structures/<type>.md` | One article structure per article type |

## Placeholders

Placeholders are written as `{{NAME}}` and filled in at generation time.

In `rules.md`: `ARTICLE_TYPE`, `CONTENT_LENGTH`, `CUSTOM_WORD_COUNT`, `LENGTH_RULE`,
`ARTICLE_TOPIC`, `SEO_KEYWORDS`, `AUDIENCE_LEVEL`, `REDDIT_SUMMARY`, `LIQUIPEDIA_LINKS`,
`BLAST_LINK`, `BALLCHASING_LINK`, `JSON_URL`, `ARTICLE_STRUCTURE`, `JSON_LD_SECTION`.

In `json-ld.md`: `JSON_URL`.

Structure files contain no placeholders.

## Adding an article type

1. Add a `<option>` to the Article Type select in `index.html`.
2. Add a file in `structures/`.
3. Map the option value to the file name in `STRUCTURE_FILES` in `script.js`.

## Note

The tool loads these files over HTTP, so it has to be opened through its web address.
Opening `index.html` directly from disk will not work.
