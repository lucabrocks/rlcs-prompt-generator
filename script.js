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
  return `You are a professional English-language Rocket League esports writer and SEO editor.

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

Do not write phrases like "According to Liquipedia", "Liquipedia lists" or "Liquipedia shows".
This information is common public knowledge within the Rocket League esports community and must be written as established fact, not cited as a source.

2. BLAST.tv Rocket League and Ballchasing.com
Use BLAST and Ballchasing for background research and context only.
They give you an impression of how a match, team or player performed — similar to the Reddit summary.
Do not attribute statistics to these platforms by name in the article.
Do not write "According to BLAST", "BLAST statistics show", "Ballchasing data suggests" or similar phrases.
Use the data to inform your understanding, not to produce sourced stat passages.

3. Reddit Fan Summary
Use the Reddit fan summary only as fan sentiment and community interpretation.
Do not treat Reddit as a factual authority.
Do not quote Reddit users.
Do not name Reddit users.
Do not invent fan reactions.
Only use Reddit sentiment if the summary clearly describes repeated patterns.
If the Reddit reaction is mixed, present it as mixed.
Do not add a disclaimer sentence or paragraph stating that a section represents community opinion or unverified fan sentiment. Integrate community context naturally into the text without labelling it.

4. RocketLeague.com
Use for official RLCS information, formats, schedules, announcements and tournament context.

5. ShiftRLE
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

==================================================
SEO RULES
==================================================

The article must be SEO-friendly while still sounding natural and editorial.

Use the provided SEO keywords naturally:
- in the H1 if possible
- in at least one H2 — this is required, not optional
- in the introduction
- in the body text where relevant
- in the meta title
- in the meta description
- in the URL slug if appropriate

Do not keyword-stuff.
Use semantic variations.
Use one clear H1.
Use H2 headings that are specific, contextual and SEO-informed — not generic section labels.
Each H2 must reflect the actual argument or angle of that section.
Avoid static, interchangeable headings like "Why X matters" unless it genuinely fits and adds meaning.
Use H3 only where helpful.
Use short paragraphs.
Write a strong intro.
Write a clear conclusion.
Answer the reader’s likely search intent early.

==================================================
ARTICLE STRUCTURE
==================================================

H2 headings in the structure below are starting points, not fixed labels.
Adapt every H2 to reflect the specific content of the article.
Make H2s contextual, specific and — where natural — SEO-relevant.
Replace generic headings like "Why X matters" with headings that describe what actually happens in that section.

${getArticleStructure(articleType.value)}
==================================================
OUTPUT FORMAT – EXCLUSIVELY 3 CODE BLOCKS
==================================================

Output exactly 3 code blocks in this order, with no additional text before or after:

1. HTML ARTICLE (code block: \`\`\`html)
   - Wrap in <article>
   - Use exactly one <h1>
   - Use <h2> for sections, <h3> if needed
   - Use <p> for paragraphs, <ul>/<li> only if it improves readability
   - No inline styles, no external links, no comments

2. METADATA (code block: \`\`\`)
   Title: [factual, concise, max 60 characters]
   Description: [clear, max 160 characters]
   Keywords: [3–5 terms separated by commas]

3. JSON-LD (code block: \`\`\`html)
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "[from <h1>]",
     "description": "[from metadata]",
     "author": { "@type": "Organization", "name": "Backboard RL" },
     "publisher": { "@type": "Organization", "name": "Backboard RL" },
     "datePublished": "2026-06-20",
     "url": "URL PLACEHOLDER",
     "mainEntityOfPage": { "@type": "WebPage", "@id": "URL PLACEHOLDER" },
     "keywords": "[from metadata keywords]"
   }
   </script>

==================================================
FINAL INSTRUCTIONS
==================================================

- Write professionally in British English
- Use normal, everyday British English phrasing
- Avoid words or idioms that strongly suggest Indian or Australian English
- Each sentence must make a meaningful statement; avoid filler sentences
- Do not use unnecessary repetition; do not repeat ideas unless it is essential
- Do not use semicolons or em dashes
- Avoid the typical AI phrase pattern "It is not only X, but Y"
- Integrate SEO keywords naturally
- Do not invent facts, statistics, or sources
- Use clear, confident, story-driven tone
- Ensure HTML is clean and semantic
- Ensure JSON-LD is syntactically valid
- Do not add a concluding sentence that is vague, generic or lacks substance — end on a meaningful statement or do not add a final sentence at all
- Do not write "According to Liquipedia", "Liquipedia lists" or any attribution to Liquipedia in the article text
- Do not add disclaimer sentences about community opinions being unverified — integrate that context naturally
- H2 headings must be specific and contextual; avoid generic labels that could apply to any article

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