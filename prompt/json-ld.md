## REQUIRED OUTPUT: JSON-LD STRUCTURED DATA

Output the following JSON-LD as the third code block.
Fill in every PLACEHOLDER. Do not change the structure. Keep "inLanguage": "en".

Article schema (ALWAYS include):

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "ARTICLE_HEADLINE",
  "description": "META_DESCRIPTION",
  "author": {
    "@type": "Organization",
    "name": "Backboard RL",
    "url": "https://WEBSITE_DOMAIN/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Backboard RL",
    "url": "https://WEBSITE_DOMAIN/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://WEBSITE_DOMAIN/PFAD_ZUM_LOGO.png"
    }
  },
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{JSON_URL}}"
  },
  "url": "{{JSON_URL}}",
  "keywords": [
    "KEYWORD_1",
    "KEYWORD_2",
    "KEYWORD_3"
  ],
  "articleSection": "ARTICLE_SECTION",
  "inLanguage": "en"
}
</script>

FAQPage schema (include ONLY if the article contains a visible FAQ section):
Append a second JSON-LD block of @type "FAQPage". Each question becomes a Question node,
each answer an Answer node. Question text and answer text MUST match the visible HTML
word-for-word — do not paraphrase or shorten. If the article has no visible FAQ section,
omit this block entirely.
