const form = document.getElementById("redditForm");
const redditUrl = document.getElementById("redditUrl");
const topic = document.getElementById("topic");
const entities = document.getElementById("entities");
const summaryDepth = document.getElementById("summaryDepth");
const outputStyle = document.getElementById("outputStyle");
const pastedComments = document.getElementById("pastedComments");
const additionalNotes = document.getElementById("additionalNotes");
const generatedPrompt = document.getElementById("generatedPrompt");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

const successMessage = document.getElementById("successMessage");
const redditUrlError = document.getElementById("redditUrlError");

const STORAGE_KEY = "rl_reddit_summary_prompt_creator";

function getSelectedFocusAreas() {
  return Array.from(document.querySelectorAll('input[name="focusAreas"]:checked'))
    .map((checkbox) => checkbox.value);
}

function setSelectedFocusAreas(values) {
  const checkboxes = document.querySelectorAll('input[name="focusAreas"]');

  checkboxes.forEach((checkbox) => {
    checkbox.checked = values.includes(checkbox.value);
  });
}

function showSuccess(message) {
  successMessage.textContent = message;

  setTimeout(() => {
    successMessage.textContent = "";
  }, 2500);
}

function validateForm() {
  let isValid = true;

  redditUrlError.textContent = "";

  if (!redditUrl.value.trim()) {
    redditUrlError.textContent = "Please add a Reddit discussion link.";
    isValid = false;
  }

  return isValid;
}

function createPrompt() {
  const selectedFocusAreas = getSelectedFocusAreas();

  const hasPastedComments = pastedComments.value.trim().length > 0;

  return `You are a professional Rocket League esports community sentiment analyst and editorial assistant.

Your task is to analyze a Reddit discussion about Rocket League esports and summarize the fan sentiment in a careful, useful and publication-safe way.

This is NOT a factual match report.
This is NOT a source for verified results, statistics, rosters or tournament facts.
This is only a fan sentiment summary.

==================================================
INPUT
==================================================

Reddit Discussion Link:
${redditUrl.value.trim() || "[REDDIT_LINK]"}

Match / Event / Topic:
${topic.value.trim() || "[MATCH_OR_TOPIC]"}

Teams / Players to watch:
${entities.value.trim() || "[TEAMS_PLAYERS_OR_ENTITIES]"}

Summary Depth:
${summaryDepth.value}

Output Style:
${outputStyle.value}

Focus Areas:
${selectedFocusAreas.length ? selectedFocusAreas.join(", ") : "Overall fan mood, player reactions, team reactions, article storylines"}

Additional Notes:
${additionalNotes.value.trim() || "[NO_ADDITIONAL_NOTES]"}

${hasPastedComments ? `Pasted Reddit Comments:
${pastedComments.value.trim()}` : `Pasted Reddit Comments:
No comments were pasted. Use the Reddit link if you have browsing access. If you cannot access the thread, clearly ask the user to paste the comments or discussion text.`}

==================================================
CORE TASK
==================================================

Summarize the overall fan discussion around this Rocket League esports topic.

Focus on repeated patterns across the discussion, such as:
- whether fans thought the match was exciting, boring, chaotic, one-sided or tense
- which players were repeatedly praised
- which players were repeatedly criticized
- which teams were discussed positively or negatively
- what fans saw as the turning point
- whether the community reaction was clear or divided
- which storylines could be useful for a professional article
- what should NOT be used because the reaction is too unclear or too mixed

==================================================
STRICT REDDIT RULES
==================================================

Use Reddit only as a source for fan sentiment, community interpretation and emotional reaction.

Do not treat Reddit as a factual authority.

Do not:
- quote Reddit users directly
- name Reddit users
- copy long Reddit comments
- base a conclusion on one isolated comment
- present fan opinion as fact
- say “everyone thinks”
- invent community reactions
- invent controversy
- exaggerate the strength of the fan consensus
- use hostile or insulting wording from Reddit directly

Only include a sentiment if it appears as a clear repeated pattern across multiple comments.

If opinions are mixed, say that the discussion was divided.

If one player is praised by some fans and criticized by others, do NOT present a simple conclusion like “fans praised Player X.”
Instead, write something like:
“Fan discussion around Player X appeared divided, with some focusing on strong moments and others questioning consistency.”

If the pattern is too unclear, do not include it as a finding.

==================================================
HOW TO HANDLE PLAYER AND TEAM SENTIMENT
==================================================

When summarizing player or team reactions:

1. Clear positive pattern
Use only if multiple comments point in the same direction.
Example:
“Fans repeatedly highlighted Player X as one of the main reasons the series stayed competitive.”

2. Clear negative pattern
Use careful wording.
Example:
“A recurring concern in the discussion was Team X’s difficulty closing out pressure situations.”

3. Mixed reaction
Do not force a conclusion.
Example:
“Reaction to Player X was mixed rather than clearly positive or negative.”

4. Isolated comment
Ignore it.

5. Meme or joke
Only include if it became a repeated theme and helps explain the fan mood.

==================================================
OUTPUT FORMAT
==================================================

Return the final answer in this structure:

1. Short Fan Sentiment Summary
Write 1–2 short paragraphs explaining the overall mood of the discussion.

2. Main Discussion Themes
Use bullet points.
Each bullet should describe one repeated theme.
Avoid weak or unsupported points.

3. Player Reactions
Summarize only clear or clearly divided player sentiment.
Use careful wording.
Do not invent player narratives.

4. Team Reactions
Summarize only clear or clearly divided team sentiment.
Explain how fans talked about the teams.

5. Match Entertainment Value
Explain whether fans generally seemed to view the match as exciting, tense, boring, chaotic, frustrating or one-sided.
Only say this if supported by repeated comments.

6. Divided or Unclear Opinions
List topics where the fan discussion was mixed, unclear or not strong enough for a confident conclusion.

7. Article-Usable Insights
Provide 3–6 insights that could be safely used in a professional Rocket League esports article.
Write them in an editorial but cautious style.

8. What Not To Use
List any claims, reactions or narratives that should not be used because they are based on isolated comments, unclear discussion or unverified information.

9. Clean Summary for Main Article Prompt
Write a compact version that can be pasted into a larger Rocket League article prompt.
This section should be clean, neutral and ready to use as input.

==================================================
STYLE REQUIREMENTS
==================================================

Write in professional English.

The tone should be:
- clear
- neutral
- analytical
- editorial
- careful
- useful for esports writing

Avoid:
- exaggerated language
- Reddit slang unless it is explained neutrally
- direct quotes
- usernames
- fake certainty
- unsupported claims
- overconfident community conclusions

Prefer:
- “A recurring theme was…”
- “Fan discussion largely focused on…”
- “The reaction appeared divided…”
- “Several comments pointed toward…”
- “This should be treated carefully because…”
- “The clearest article angle from the discussion is…”

==================================================
FINAL CHECK
==================================================

Before giving the final answer, check:
- Did you avoid direct Reddit quotes?
- Did you avoid usernames?
- Did you avoid treating Reddit as factual proof?
- Did you only include repeated sentiment patterns?
- Did you mark mixed opinions as mixed?
- Did you avoid inventing fan reactions?
- Did you include a clean summary that can be pasted into the main article prompt?

Now analyze the Reddit discussion and create the fan sentiment summary.`;
}

function saveState() {
  const state = {
    redditUrl: redditUrl.value,
    topic: topic.value,
    entities: entities.value,
    summaryDepth: summaryDepth.value,
    outputStyle: outputStyle.value,
    focusAreas: getSelectedFocusAreas(),
    pastedComments: pastedComments.value,
    additionalNotes: additionalNotes.value,
    generatedPrompt: generatedPrompt.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const rawState = localStorage.getItem(STORAGE_KEY);

  if (!rawState) return;

  try {
    const state = JSON.parse(rawState);

    redditUrl.value = state.redditUrl || "";
    topic.value = state.topic || "";
    entities.value = state.entities || "";
    summaryDepth.value = state.summaryDepth || "Standard";
    outputStyle.value = state.outputStyle || "Editorial Notes";
    pastedComments.value = state.pastedComments || "";
    additionalNotes.value = state.additionalNotes || "";
    generatedPrompt.value = state.generatedPrompt || "";

    if (Array.isArray(state.focusAreas)) {
      setSelectedFocusAreas(state.focusAreas);
    }
  } catch (error) {
    console.error("Could not load saved Reddit summary state:", error);
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  generatedPrompt.value = "";
  redditUrlError.textContent = "";

  setSelectedFocusAreas([
    "Overall fan mood",
    "Match entertainment value",
    "Player reactions",
    "Team reactions",
    "Controversial or divided opinions",
    "Storylines for an article"
  ]);

  showSuccess("Reset complete.");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  generatedPrompt.value = createPrompt();
  saveState();
  showSuccess("Prompt generated successfully.");
});

copyBtn.addEventListener("click", async () => {
  if (!generatedPrompt.value.trim()) {
    showSuccess("Generate a prompt first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(generatedPrompt.value);
    showSuccess("Prompt copied successfully.");
  } catch (error) {
    generatedPrompt.select();
    document.execCommand("copy");
    showSuccess("Prompt copied successfully.");
  }
});

downloadBtn.addEventListener("click", () => {
  if (!generatedPrompt.value.trim()) {
    showSuccess("Generate a prompt first.");
    return;
  }

  const blob = new Blob([generatedPrompt.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "rocket-league-reddit-summary-prompt.txt";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showSuccess("Prompt downloaded.");
});

resetBtn.addEventListener("click", resetState);

[
  redditUrl,
  topic,
  entities,
  summaryDepth,
  outputStyle,
  pastedComments,
  additionalNotes
].forEach((element) => {
  element.addEventListener("input", saveState);
  element.addEventListener("change", saveState);
});

document.querySelectorAll('input[name="focusAreas"]').forEach((checkbox) => {
  checkbox.addEventListener("change", saveState);
});

loadState();