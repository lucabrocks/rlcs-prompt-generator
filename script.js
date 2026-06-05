const form = document.getElementById("promptForm");

const articleType = document.getElementById("articleType");
const contentLength = document.getElementById("contentLength");
const customWordCount = document.getElementById("customWordCount");
const customLengthWrap = document.getElementById("customLengthWrap");
const articleTopic = document.getElementById("articleTopic");
const seoKeywords = document.getElementById("seoKeywords");
const audienceLevel = document.getElementById("audienceLevel");
const redditSummary = document.getElementById("redditSummary");
const liquipediaLinks = document.getElementById("liquipediaLinks");
const blastLink = document.getElementById("blastLink");
const ballchasingLink = document.getElementById("ballchasingLink");
const jsonUrl = document.getElementById("jsonUrl");

const generatedPrompt = document.getElementById("generatedPrompt");
const copyPrompt = document.getElementById("copyPrompt");
const downloadPrompt = document.getElementById("downloadPrompt");
const resetForm = document.getElementById("resetForm");
const statusMessage = document.getElementById("statusMessage");

const STORAGE_KEY = "rlcs_editorial_prompt_tool_v4";

function showStatus(message) {
  statusMessage.textContent = message;

  setTimeout(() => {
    statusMessage.textContent = "";
  }, 2600);
}

function toggleCustomLengthField() {
  if (contentLength.value === "Custom") {
    customLengthWrap.classList.remove("hidden");
  } else {
    customLengthWrap.classList.add("hidden");
  }
}

function getLengthRule(length) {
  if (length.includes("Short")) return "Short: 300–600 words";
  if (length.includes("Standard")) return "Standard: 700–1,200 words";
  if (length.includes("Detailed")) return "Detailed: 1,200–1,900 words";
  if (length.includes("Deep Dive")) return "Deep Dive: 1,900–3,000 words";

  return `Custom: ${customWordCount.value.trim() || "[CUSTOM_WORD_COUNT]"}`;
}

function getArticleStructure(type) {
  const structures = {
    "Match Report": `
Use this structure:
<h1>[SEO-friendly match report headline]</h1>
<p>[Strong lead: result + importance + main storyline]</p>
<h2>How the series unfolded</h2>
<h2>The turning point</h2>
<h2>The player who changed the match</h2>
<h2>What this result means</h2>
<h2>What comes next</h2>

Required logic:
- State the result early.
- Explain the importance of the match.
- Describe how the series developed.
- Identify the turning point.
- Highlight the key player or players.
- Explain what the result means for both teams.
- End with what comes next.`,

    "Form Check": `
Use this structure:
<h1>[Team/Event form check headline]</h1>
<p>[Intro: why this team matters before the event]</p>
<h2>Where the team stands right now</h2>
<h2>Recent results and momentum</h2>
<h2>Strengths that could carry them</h2>
<h2>Questions they still need to answer</h2>
<h2>The main storyline</h2>
<h2>Realistic expectations</h2>`,

    "Player Profile": `
Use this structure:
<h1>[Player profile headline]</h1>
<p>[Intro: who the player is and why they matter]</p>
<h2>Who is [player]?</h2>
<h2>Why [player] matters in Rocket League esports</h2>
<h2>Playstyle and strengths</h2>
<h2>Career story so far</h2>
<h2>Current form and role</h2>
<h2>Why fans keep watching</h2>`,

    "Team Story": `
Use this structure:
<h1>[Team story headline]</h1>
<p>[Intro: why this team’s story matters]</p>
<h2>Why this team matters</h2>
<h2>The beginning of the story</h2>
<h2>The rise</h2>
<h2>The defining players and moments</h2>
<h2>Where the team stands today</h2>
<h2>The bigger storyline</h2>`,

    "Storyline Article": `
Use this structure:
<h1>[Storyline headline]</h1>
<p>[Intro: central tension or question]</p>
<h2>Why this storyline matters now</h2>
<h2>The background</h2>
<h2>The teams and players at the center</h2>
<h2>What fans are paying attention to</h2>
<h2>What could happen next</h2>`,

    "Ranking Article": `
Use this structure:
<h1>[Ranking headline]</h1>
<p>[Intro: what is being ranked and why]</p>
<h2>Ranking criteria</h2>
<h2>The ranking</h2>
<h3>1. [Entry]</h3>
<h3>2. [Entry]</h3>
<h2>Biggest takeaways</h2>`,

    "Beginner Guide": `
Use this structure:
<h1>[Guide headline]</h1>
<p>[Direct beginner-friendly answer]</p>
<h2>What does [topic] mean?</h2>
<h2>How it works in Rocket League esports</h2>
<h2>Why it matters</h2>
<h2>Example in RLCS</h2>
<h2>Common questions</h2>`,

    "Event Preview": `
Use this structure:
<h1>[Event preview headline]</h1>
<p>[Intro: why the event matters]</p>
<h2>Event overview</h2>
<h2>Favorites and contenders</h2>
<h2>Teams to watch</h2>
<h2>Players to watch</h2>
<h2>Biggest storylines</h2>
<h2>What to expect</h2>`,

    "Event Recap": `
Use this structure:
<h1>[Event recap headline]</h1>
<p>[Intro: winner + major event meaning]</p>
<h2>How the event was won</h2>
<h2>The defining matches</h2>
<h2>Standout players</h2>
<h2>Winners and losers</h2>
<h2>What this means for the season</h2>`,

    "Roster Change Analysis": `
Use this structure:
<h1>[Roster change headline]</h1>
<p>[Intro: what changed and why it matters]</p>
<h2>The roster move</h2>
<h2>Why the change matters</h2>
<h2>What the team gains</h2>
<h2>Questions around the move</h2>
<h2>What comes next</h2>`,

    "Custom": `
Create a logical editorial structure based on the article topic.
Still follow SEO, factual accuracy, clean HTML and professional editorial rules.`
  };

  return structures[type] || structures.Custom;
}

function buildPrompt() {
  return `You are a professional English-language Rocket League esports writer, SEO editor and content strategist.

Your task is to create a high-quality article for a professional Rocket League esports website.

The website is not a simple results database and not a copy of Liquipedia, BLAST, ShiftRLE or Reddit. The goal is to create an editorial Rocket League esports magazine that explains matches, teams, players, tournaments and storylines in a clear, engaging and professional way.

Core editorial principle:
Do not just report what happened. Explain why it matters.

==================================================
INPUT
==================================================

Article Type:
${articleType.value}

Content Length:
${contentLength.value}

Custom Word Count:
${contentLength.value === "Custom" ? customWordCount.value.trim() || "[CUSTOM_WORD_COUNT]" : "[NOT_USED]"}

Length Rule:
${getLengthRule(contentLength.value)}

Article Topic / Story Notes:
${articleTopic.value.trim() || "[ARTICLE_TOPIC_AND_STORY_NOTES]"}

SEO Keywords:
${seoKeywords.value.trim() || "[SEO_KEYWORDS]"}

Audience Level:
${audienceLevel.value}

Reddit Fan Summary:
${redditSummary.value.trim() || "[NO_REDDIT_FAN_SUMMARY_PROVIDED]"}

Liquipedia Link(s):
${liquipediaLinks.value.trim() || "[LIQUIPEDIA_LINKS]"}

BLAST.tv Link:
${blastLink.value.trim() || "[BLAST_LINK]"}

Ballchasing.com Link:
${ballchasingLink.value.trim() || "[BALLCHASING_LINK]"}

Article URL / URL for JSON-LD:
${jsonUrl.value.trim() || "ARTICLE_URL"}

==================================================
SOURCE AND RESEARCH RULES
==================================================

Use reliable sources to verify facts before writing.

Primary source hierarchy:

1. Liquipedia Rocket League
Use Liquipedia for:
- current teams
- rosters
- roster changes
- tournament results
- tournament brackets
- dates
- event names
- player histories
- team histories
- standings
- historical results
- general competitive context

2. BLAST.tv Rocket League
Use BLAST for:
- current RLCS information
- match pages
- player statistics
- team statistics
- rankings
- event information
- specific statistical claims

3. Reddit Fan Summary
Use the Reddit fan summary only as fan sentiment and community interpretation.
Do not treat Reddit as a factual authority.
Do not quote Reddit users.
Do not name Reddit users.
Do not invent fan reactions.
Only use Reddit sentiment if the summary clearly describes repeated patterns.
If the Reddit reaction is mixed, present it as mixed.

4. RocketLeague.com
Use for official RLCS information, formats, schedules, announcements and tournament context.

5. Ballchasing.com
Use for replay-based statistics only when it genuinely adds value.

6. ShiftRLE
Use for roster moves, transfer news, scene updates and interviews.

==================================================
FACTUAL ACCURACY RULES
==================================================

Accuracy is more important than fluency.

Do not invent:
- match results
- tournament placements
- roster changes
- dates
- quotes
- statistics
- player achievements
- team achievements
- transfers
- brackets
- prize pools
- rankings
- Reddit opinions
- community reactions

If information cannot be verified, clearly state that it could not be verified.

If information is missing, include:
“Information needed before publication: [describe what must be checked manually].”

Never fill factual gaps with guesses.

When using specific statistics, mention the source naturally in the text.
Examples:
- “According to BLAST’s player statistics…”
- “Ballchasing replay data suggests…”

==================================================
SEO RULES
==================================================

The article must be SEO-friendly while still sounding natural and editorial.

Use the provided SEO keywords naturally:
- in the H1 if possible
- in at least one H2 if natural
- in the introduction
- in the body text where relevant
- in the meta title
- in the meta description
- in the URL slug if appropriate

Do not keyword-stuff.
Use semantic variations.
Use one clear H1.
Use clean H2 sections.
Use H3 only where helpful.
Use short paragraphs.
Write a strong intro.
Write a clear conclusion.
Answer the reader’s likely search intent early.

==================================================
ARTICLE STRUCTURE
==================================================

${getArticleStructure(articleType.value)}

==================================================
OUTPUT FORMAT
==================================================

Return the final output in this order:

1. Content Brief
Briefly summarize:
- article type
- target category
- target topic hub if relevant
- main search intent
- target audience
- recommended angle
- estimated word count

2. H1 / Headline Variants
Provide 5 H1 headline variants.
Make them SEO-friendly but natural.
Mark one as “Recommended H1”.

3. SEO Metadata
Provide:
- SEO Title, max. 60 characters if possible
- Meta Description, max. 155–160 characters if possible
- URL Slug
- Primary Keyword
- Secondary Keywords
- Suggested Tags
- Suggested Category
- Suggested Topic Hub if relevant

4. HTML Article
Write the full article in clean semantic HTML.

HTML rules:
- Use <article>
- Use exactly one <h1>
- Use <h2> for main sections
- Use <h3> only when useful
- Use <p> for paragraphs
- Use <ul> and <li> only when it improves readability
- Do not use inline CSS
- Do not use external links inside the article body unless specifically required
- Do not use tables unless the article type clearly benefits from one
- Keep paragraphs readable and not too long
- Write naturally in English
- Make the article feel like professional esports journalism

5. JSON-LD Structured Data
Provide valid JSON-LD using Schema.org Article schema.

Include:
- @context
- @type
- headline
- description
- author
- publisher
- datePublished
- dateModified
- mainEntityOfPage
- keywords
- articleSection
- inLanguage

Use placeholder values where unknown:
- WEBSITE_NAME
- WEBSITE_URL
- AUTHOR_NAME
- LOGO_URL
- ARTICLE_URL
- YYYY-MM-DD

6. Source Notes
List the sources that should be checked or were used conceptually:
- Liquipedia
- BLAST.tv
- Reddit fan summary if provided
- RocketLeague.com if relevant
- Ballchasing if relevant
- ShiftRLE if relevant
- Other sources if relevant

For each source, briefly explain what it was used for.

7. Information Needed Before Publication
If any factual information could not be verified, list it clearly.
If everything is sufficiently supported, write:
“No major factual gaps identified, but final publication should still include a manual source check.”

8. Internal Linking Suggestions
Suggest internal links to existing or future website pages.
For each link, explain why it is useful.

9. Optional Follow-Up Content Ideas
Suggest 3–5 related article ideas that would strengthen the topic cluster.

==================================================
STYLE RULES
==================================================

Write in professional English.

The tone should be:
- clear
- confident
- editorial
- analytical
- story-driven
- accessible
- not overly casual
- not overly academic
- not exaggerated or clickbait-heavy

Avoid:
- empty hype phrases
- generic claims
- unsupported statements
- fake certainty
- overuse of statistics
- copying source wording
- keyword stuffing
- long direct quotes
- Reddit quotes
- invented fan reactions
- invented statistics
- invented results

Prefer:
- strong but accurate headlines
- clear explanations
- short paragraphs
- context before opinion
- storytelling backed by facts
- careful wording when uncertain
- “why it matters” framing
- natural SEO integration
- fan sentiment only when clearly supported

==================================================
FINAL QUALITY CHECK
==================================================

Before giving the final answer, check:
- Is the article type structure appropriate?
- Is the article written in English?
- Is the HTML clean and usable?
- Is there exactly one H1?
- Are SEO keywords integrated naturally?
- Is the intro strong and relevant?
- Does the article explain why the topic matters?
- Are factual claims cautious and verifiable?
- Are specific statistics sourced?
- Is Reddit only used as summarized fan sentiment if provided?
- Are no Reddit users quoted or named?
- Are there no invented facts?
- Are metadata and JSON-LD included?
- Are internal linking suggestions included?
- Are remaining factual gaps clearly listed?

==================================================
FINAL NATURAL-LANGUAGE QUALITY PASS
==================================================

Before returning the final text, revise the complete draft once more. Preserve the intended meaning, all verified facts, the requested tone, the target audience, the language variant and any required format. Do not add unsupported claims, invented references or fabricated details.

The final result should read like a carefully edited text written for this specific purpose, not like an unreviewed template.

1. Improve sentence rhythm

* Use a natural mix of short, medium-length and longer sentences.
* Remove repetitive sentence patterns and unnecessary explanatory clauses.
* Avoid making every sentence equally polished, equally long or structurally identical.
* Do not deliberately insert spelling or grammar mistakes. Create natural variation through rhythm and phrasing instead.

2. Improve paragraph flow

* Vary paragraph length according to the content.
* Connect related ideas with meaningful transitions.
* Do not isolate every thought in a separate, self-contained block.
* Allow ideas to develop instead of closing each paragraph with a mechanical summary.

3. Remove unnecessary overstructuring

* Do not default to numbered sections, identical subsections or lists with exactly three items.
* Use bullet points only when they genuinely improve readability.
* Convert artificial list structures into prose where appropriate.
* Avoid repetitive headings, excessive title-style capitalization, unnecessary colons, excessive bold formatting, emojis and decorative dividers unless the requested format requires them.
* Do not repeat the task in the introduction or restate the complete text in a long conclusion.

4. Use specific, concrete language

* Replace vague generalizations with supported details from the available material.
* Explain why a point matters in the specific context.
* Prefer precise nouns and direct verbs over abstract claims about importance, complexity or impact.
* Use examples, names, facts and figures when they are available and relevant.
* Do not invent anecdotes, statistics or contextual details.

5. Avoid generic promotional language

* Remove exaggerated promises and empty marketing phrases.
* Review words and phrases such as: delve into, underscore, pivotal, multifaceted, foster, crucial, transformative, utilise, revolutionize, innovative, cutting-edge, game-changing and seamless integration.
* Do not delete these terms automatically. Replace them when a simpler or more specific expression communicates the point more clearly.
* Avoid inflated claims about significance, legacy, symbolism or future potential unless they are supported by the content.

6. Reduce formulaic phrasing

* Avoid repetitive transitions that mechanically announce a contrast, summary or broader perspective.
* Avoid repeated hedging that weakens straightforward statements.
* Limit rhetorical patterns such as repeated three-part lists and frequent “not only ... but also” constructions.
* Do not end every section by summarizing the point that was just made.

7. Match the audience and channel

* Use the requested language variant consistently.
* Adjust terminology to the reader’s expected level of knowledge.
* Define abbreviations only when the explanation is genuinely useful.
* Remove unnecessarily technical vocabulary and overly formal wording when simpler language is more suitable.
* Keep the tone appropriate to the text type: factual, editorial, professional, conversational or promotional as requested.

8. Use punctuation naturally

* Use dashes sparingly and only when they improve the sentence.
* Replace repeated dashes with full stops, commas or subordinate clauses where this improves readability.
* Review the text as a whole instead of optimizing each sentence in isolation.

9. Check logic and factual integrity

* Ensure that connected statements actually belong together logically.
* Remove contextual mismatches that sound plausible but do not make sense.
* Verify that every cited source exists and supports the associated claim.
* Clearly mark direct quotations.
* Remove unsupported claims rather than filling information gaps with plausible assumptions.

10. Remove chatbot and copy-and-paste artifacts

* Delete meta-comments, drafting notes, placeholders, knowledge-limit disclaimers and offers to provide more information.
* Remove email-style greetings or sign-offs when the requested format does not require them.
* Strip unnecessary Markdown remnants and formatting artifacts.
* Check for accidental spaces at the beginning of paragraphs.

11. Perform a consistency check

* Read the final text as one document.
* Ensure that the voice, level of formality and writing quality remain consistent throughout.
* Remove abrupt changes in tone, register or sentence style.
* Keep the text natural, direct and specific without making it artificially casual.

Return only the fully revised final text. Do not describe the editing process and do not mention this quality pass.

Now generate the article based on the provided input.`;
}

function saveState() {
  const state = {
    articleType: articleType.value,
    contentLength: contentLength.value,
    customWordCount: customWordCount.value,
    articleTopic: articleTopic.value,
    seoKeywords: seoKeywords.value,
    audienceLevel: audienceLevel.value,
    redditSummary: redditSummary.value,
    liquipediaLinks: liquipediaLinks.value,
    blastLink: blastLink.value,
    ballchasingLink: ballchasingLink.value,
    jsonUrl: jsonUrl.value,
    generatedPrompt: generatedPrompt.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return;

  try {
    const state = JSON.parse(saved);

    articleType.value = state.articleType || "Match Report";
    contentLength.value = state.contentLength || "Standard";
    customWordCount.value = state.customWordCount || "";
    articleTopic.value = state.articleTopic || "";
    seoKeywords.value = state.seoKeywords || "";
    audienceLevel.value = state.audienceLevel || "Regular RLCS viewer";
    redditSummary.value = state.redditSummary || "";
    liquipediaLinks.value = state.liquipediaLinks || "";
    blastLink.value = state.blastLink || "";
    ballchasingLink.value = state.ballchasingLink || "";
    jsonUrl.value = state.jsonUrl || "";
    generatedPrompt.value = state.generatedPrompt || "";

    toggleCustomLengthField();
  } catch (error) {
    console.error("Could not load saved state:", error);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  generatedPrompt.value = buildPrompt();
  saveState();
  showStatus("Prompt generated.");
});

copyPrompt.addEventListener("click", async function () {
  if (!generatedPrompt.value.trim()) {
    showStatus("Generate a prompt first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(generatedPrompt.value);
    showStatus("Prompt copied.");
  } catch (error) {
    generatedPrompt.select();
    document.execCommand("copy");
    showStatus("Prompt copied.");
  }
});

downloadPrompt.addEventListener("click", function () {
  if (!generatedPrompt.value.trim()) {
    showStatus("Generate a prompt first.");
    return;
  }

  const blob = new Blob([generatedPrompt.value], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "rocket-league-article-prompt.txt";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showStatus("Prompt downloaded.");
});

resetForm.addEventListener("click", function () {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  generatedPrompt.value = "";
  toggleCustomLengthField();
  showStatus("Form reset.");
});

[
  articleType,
  contentLength,
  customWordCount,
  articleTopic,
  seoKeywords,
  audienceLevel,
  redditSummary,
  liquipediaLinks,
  blastLink,
  ballchasingLink,
  jsonUrl
].forEach(function (field) {
  field.addEventListener("input", saveState);
  field.addEventListener("change", saveState);
});

contentLength.addEventListener("change", function () {
  toggleCustomLengthField();
  saveState();
});

loadState();
toggleCustomLengthField();