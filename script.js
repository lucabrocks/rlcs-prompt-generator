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

/*
  The prompt text itself lives in the /prompt folder, not in this file:

    prompt/rules.md                  editorial rules, sources, SEO, output format
    prompt/json-ld.md                the JSON-LD specification
    prompt/structures/<type>.md      one article structure per article type

  Both this tool and any AI workflow read the same files, so a rule only
  ever has to be changed in one place. Placeholders look like {{THIS}}.
*/

const PROMPT_DIR = "prompt";

const STRUCTURE_FILES = {
  "Match Report": "match-report.md",
  "Form Check": "form-check.md",
  "Player Profile": "player-profile.md",
  "Team Story": "team-story.md",
  "Storyline Article": "storyline-article.md",
  "Ranking Article": "ranking-article.md",
  "Beginner Guide": "beginner-guide.md",
  "Event Preview": "event-preview.md",
  "Event Recap": "event-recap.md",
  "Roster Change Analysis": "roster-change-analysis.md",
  "Custom": "custom.md"
};

const textCache = new Map();

async function loadText(path) {
  if (textCache.has(path)) return textCache.get(path);

  const response = await fetch(path, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Could not load ${path} (HTTP ${response.status})`);
  }

  const text = await response.text();
  textCache.set(path, text);

  return text;
}

function fillPlaceholders(template, values) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (match, key) {
    return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match;
  });
}

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

async function buildPrompt() {
  const structureFile = STRUCTURE_FILES[articleType.value] || STRUCTURE_FILES.Custom;

  const [rules, jsonLd, structure] = await Promise.all([
    loadText(`${PROMPT_DIR}/rules.md`),
    loadText(`${PROMPT_DIR}/json-ld.md`),
    loadText(`${PROMPT_DIR}/structures/${structureFile}`)
  ]);

  const articleUrl = jsonUrl.value.trim() || "ARTICLE_URL";

  return fillPlaceholders(rules, {
    ARTICLE_TYPE: articleType.value,
    CONTENT_LENGTH: contentLength.value,
    CUSTOM_WORD_COUNT:
      contentLength.value === "Custom"
        ? customWordCount.value.trim() || "[CUSTOM_WORD_COUNT]"
        : "[NOT_USED]",
    LENGTH_RULE: getLengthRule(contentLength.value),
    ARTICLE_TOPIC: articleTopic.value.trim() || "[ARTICLE_TOPIC_AND_STORY_NOTES]",
    SEO_KEYWORDS: seoKeywords.value.trim() || "[SEO_KEYWORDS]",
    AUDIENCE_LEVEL: audienceLevel.value,
    REDDIT_SUMMARY: redditSummary.value.trim() || "[NO_REDDIT_FAN_SUMMARY_PROVIDED]",
    LIQUIPEDIA_LINKS: liquipediaLinks.value.trim() || "[LIQUIPEDIA_LINKS]",
    BLAST_LINK: blastLink.value.trim() || "[BLAST_LINK]",
    BALLCHASING_LINK: ballchasingLink.value.trim() || "[BALLCHASING_LINK]",
    JSON_URL: articleUrl,
    ARTICLE_STRUCTURE: structure.trim(),
    JSON_LD_SECTION: fillPlaceholders(jsonLd.trim(), { JSON_URL: articleUrl })
  });
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

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  showStatus("Generating prompt...");

  try {
    generatedPrompt.value = await buildPrompt();
    saveState();
    showStatus("Prompt generated.");
  } catch (error) {
    console.error(error);

    if (window.location.protocol === "file:") {
      showStatus(
        "Open this tool through its web address, not as a local file. The prompt files cannot be loaded from file://."
      );
    } else {
      showStatus(`Could not build the prompt: ${error.message}`);
    }
  }
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
