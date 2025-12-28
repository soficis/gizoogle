/**
 * Gizoogle Translator - The Hybrid
 * 
 * Authentically blends 1993 "Doggystyle" with 2025 "Mogul Snoop" voice.
 * 
 * The AI code-switches between two energies:
 * - Mode A "The Doggy Dogg" (1993-1996): Guarded, laconic, survivalist. Triggered by warnings, errors, failures.
 * - Mode B "The Mogul" (2020-2025): Generous, expansive, strategic. Triggered by success, instructions, profits.
 * 
 * Real Snoop transitions by connecting street survival to business strategy using "chess, not checkers" logic.
 */
(function (root, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    root.GizoogleTranslator = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  // ============================================================================
  // Constants - Vocabulary
  // ============================================================================

  // Mode A: "The Doggy Dogg" (1993–1996) - Guarded, survivalist responses for errors/warnings
  const MODE_A_INTROS = [
    "Man, this whole setup lookin' twisted",
    "Yo, peep this. The system actin' scandalous right now",
    "Hold up, somethin' ain't right here",
    "Listen here, this is real",
    "On the real, we got a situation"
  ];

  const MODE_A_BRIDGE_PHRASES = [
    "It's chess, not checkers.",
    "But we ain't foldin'.",
    "But that's the play.",
    "We just pivot and slide to the next move.",
    "That's the game right there."
  ];

  const MODE_A_VOCABULARY = {
    twisted: ["twisted", "scandalous", "rough", "shady"],
    bounce_back: ["bounce back", "reset the board", "run it back", "recover"],
    chill: ["chill", "easy", "don't stress", "breathe"],
    real: ["on the real", "real talk", "straight up", "no cap"]
  };

  // Mode B: "The Mogul" (2020–2025) - Strategic, generous responses for success/instructions
  const MODE_B_INTROS = [
    "Look here, loved one",
    "See, here's the thing",
    "Check it out, family",
    "Listen to your Uncle Snoop",
    "Let me break this down for ya"
  ];

  const MODE_B_WISDOM = [
    "You gotta own the masters to run the game.",
    "That's how you protect your IP.",
    "Let that spirit cook.",
    "Don't rush the process.",
    "That's the real wealth right there.",
    "You building something here.",
    "We stay strategic."
  ];

  const MODE_B_VOCABULARY = {
    admin: ["owner", "the speculator", "the boss"],
    save: ["vault", "catalog", "put in the vault"],
    try_again: ["run the play back", "reset", "one more time"],
    wait: ["let it marinate", "don't rush", "give it time"],
    user: ["loved one", "family", "nephew/niece"],
    settings: ["spices", "seasoning", "flavor profile", "ingredients"],
    edit: ["remix", "add flavor to", "spice up"],
    custom: ["signature", "homemade", "secret recipe"],
    processing: ["in the kitchen", "on the stove", "simmering"],
    finish: ["plate it up", "serve it", "ready to eat"],
    password: ["secret code", "G-Code", "combination"],
    private: ["low profile", "between us", "for the fam only"],
    security: ["lock it down", "keep it guarded", "the code"],
    unknown: ["unverified", "strange face", "who dis?"]
  };

  // Authentic 1993 slang (not parody "-izzle" speech)
  const AUTHENTIC_90S_SLANG = [
    { pattern: /\bG\b/gi, replacement: "G" },
    { pattern: /\bloc(s?)\b/gi, replacement: (m) => m.toLowerCase().endsWith('s') ? "locs" : "loc" },
    { pattern: /\btwisted\b/gi, replacement: "twisted" }
  ];

  const SENTENCE_TAGS = [
    "you feel me?",
    "ya dig?",
    "know what I'm sayin'?",
    "no doubt.",
    "that's the play.",
    "real simple.",
    "fo' shizzle.",
    "believe dat.",
    "straight like that.",
    "smooth moves only.",
    "keep it pushin'.",
    "that's how we do.",
    "I love that for us.",
    "we stay ready.",
    "n' ery-thing."
  ];

  const SOUND_EFFECTS = {
    success: ["Click-clack.", "Bing-bong.", "Westside.", "Boss moves.", "Clean."],
    impact: ["Boom.", "Click-clack.", "Real talk."],
    pivot: ["Skrrrt.", "Hold up.", "Plot twist."],
    neutral: []
  };

  const ADDRESS_TERMS = ["nephew", "family", "cuh", "boss", "big dog", "my guy"];

  const AFFIRMATIONS = [
    "I love to see it.",
    "That's beautiful.",
    "Boss moves right there.",
    "I'm honored.",
    "We movin'.",
    "That's legendary.",
    "Smooth operator status."
  ];

  const REASSURANCES = [
    "No stress, we gon' smooth it out.",
    "No panic, we got this.",
    "We gon' get it back right.",
    "Ain't nothin' but a thang.",
    "We handle situations, not problems.",
    "That's just a speed bump, we keep it movin'."
  ];

  // ============================================================================
  // Constants - Configuration
  // ============================================================================

  const MIN_LEVEL = 1;
  const MAX_LEVEL = 3;
  const DEFAULT_LEVEL = 3;

  const LONG_SENTENCE_THRESHOLD = 15;
  const SHORT_TEXT_THRESHOLD = 4;
  const MAX_INTRO_WORDS = 22;
  const MAX_REASSURANCE_WORDS = 24;
  const MAX_AFFIRMATION_WORDS = 16;
  const MAX_CONFUSION_WORDS = 14;
  const MIN_ADDRESS_TERM_WORDS = 6;
  const MAX_ADDRESS_TERM_WORDS = 20;

  // ============================================================================
  // Constants - Patterns to Preserve
  // ============================================================================

  const PRESERVE_PATTERNS = [
    /\bhttps?:\/\/[^\s<>"')\]]+/gi,
    /\bwww\.[^\s<>"')\]]+/gi,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
  ];

  const WORDS_TO_SKIP_ING_REPLACEMENT = new Set([
    "thing", "nothing", "anything", "something", "everything",
    "string", "king", "ring", "sing", "bring", "wing", "bling"
  ]);

  // ============================================================================
  // State
  // ============================================================================

  let currentLevel = DEFAULT_LEVEL;

  function setLevel(level) {
    const numericLevel = Number(level);
    if (!Number.isFinite(numericLevel)) return;
    currentLevel = clampLevel(numericLevel);
  }

  function clampLevel(level) {
    return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
  }

  // ============================================================================
  // Utility Functions
  // ============================================================================

  function computeHash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash >>> 0;
  }

  function selectByHash(options, seed) {
    if (!options || options.length === 0) return "";
    const index = seed % options.length;
    return options[index < 0 ? index + options.length : index];
  }

  function countWords(text) {
    const words = text.trim().match(/[A-Za-z0-9']+/g);
    return words ? words.length : 0;
  }

  function spellOutWord(word) {
    return word
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .split("")
      .join("-");
  }

  function hasTerminalPunctuation(text) {
    return /[.!?]\s*$/.test(text);
  }

  function endsWithQuestion(text) {
    return /\?\s*$/.test(text);
  }

  // ============================================================================
  // Case Preservation
  // ============================================================================

  function startsWithUppercase(text) {
    const firstChar = text.charAt(0);
    return firstChar && firstChar.toUpperCase() === firstChar && firstChar.toLowerCase() !== firstChar;
  }

  function preserveCase(original, replacement) {
    if (startsWithUppercase(original)) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  function replaceWordPreservingCase(text, regex, replacement) {
    return text.replace(regex, (match) => preserveCase(match, replacement));
  }

  // ============================================================================
  // URL/Email Masking
  // ============================================================================

  function maskPreservedContent(input) {
    const preserved = [];
    let text = input;

    for (const pattern of PRESERVE_PATTERNS) {
      text = text.replace(pattern, (match) => {
        const id = preserved.length;
        preserved.push(match);
        return `\u0000GZ${id}\u0000`;
      });
    }

    return { text, preserved };
  }

  function unmaskPreservedContent(input, preserved) {
    if (!preserved || preserved.length === 0) return input;
    return input.replace(/\u0000GZ(\d+)\u0000/g, (_match, id) => preserved[Number(id)] ?? "");
  }

  // ============================================================================
  // Text Splitting
  // ============================================================================

  function splitByNewlines(text) {
    return text.split(/(\r?\n+)/);
  }

  function splitIntoSentences(chunk) {
    const matches = chunk.match(/\s*[^.!?]+(?:[.!?]+|$)/g);
    return matches && matches.length ? matches : [chunk];
  }

  // ============================================================================
  // Mode Detection (The Hybrid Code-Switch)
  // ============================================================================

  /**
   * Detect which mode the text should use:
   * Mode A: "The Doggy Dogg" - for warnings, errors, failures (guarded, survivalist)
   * Mode B: "The Mogul" - for success, instructions, profits (generous, strategic)
   */
  function detectMode(text) {
    const lower = text.toLowerCase();

    // Mode A triggers: Warnings, errors, technical failures, defensive statements
    const isModeA = /\b(warning|caution|danger|error|failed|failure|problem|issue|hiccup|cannot|lost|crashed|frozen|timed out|timeout|timeout|network|connection\s+(lost|failed|dropped))\b/.test(lower);
    
    if (isModeA) return "A"; // "The Doggy Dogg" - survival mode

    // Mode B triggers: Success messages, instructions, welcomes, profit/numbers, teaching moments
    const isModeB = /\b(success|successful|complete|completed|done|saved|locked in|approved|confirmed|learn|teach|instruction|tutorial|guide|welcome|setup|onboarding|profit|revenue|equity|leverage|owner|masters|catalog|vault)\b/.test(lower);
    
    if (isModeB) return "B"; // "The Mogul" - strategic mode

    // Default to neutral but lean toward Mode B for positive/instructional content
    return "neutral";
  }

  /**
   * Generate a code-switch bridge that connects Mode A observation to Mode B solution.
   * "It's chess, not checkers" is the philosophy.
   */
  function generateCodeSwitchBridge(text, seed) {
    const bridgePhrases = [
      "But chill... we gotta maneuver.",
      "But we ain't foldin'.",
      "But that's the play.",
      "But listen, we reset.",
      "But here's the move."
    ];

    const bridge = selectByHash(bridgePhrases, seed);
    return ` ${bridge} This a chess move.`;
  }

  // ============================================================================
  // UI Text Detection & Sentiment Analysis
  // ============================================================================

  function looksLikeUiText(text) {
    const lower = text.toLowerCase();
    const uiActionWords = /\b(click|tap|press|submit|confirm|continue|retry|refresh|settings?)\b/;
    const uiStateWords = /\b(save|saved|file|error|failed|failure|problem|issue|timeout|timed out|network|internet|connection|signal|loading)\b/;
    const uiPhraseWords = /\b(are you sure|please|warning|success|complete)\b/;

    return uiActionWords.test(lower) || uiStateWords.test(lower) || uiPhraseWords.test(lower);
  }

  function detectSentimentBucket(text) {
    const lower = text.toLowerCase();

    const isSuccess = /\b(saved|locked in|complete|completed|done|success|smooth|approved|confirmed)\b/.test(lower);
    if (isSuccess) return "success";

    const isWarning = /\b(warning|caution|danger|cannot|failed|failure|error|problem|issue|hiccup)\b/.test(lower);
    if (isWarning) return "impact";

    const isPivot = /\b(instead|however|but|different|change|switch|actually|wait)\b/.test(lower);
    if (isPivot) return "pivot";

    return "neutral";
  }

  // ============================================================================
  // Sentence Structure Transformations
  // ============================================================================

  function splitLongSentence(sentence, seed) {
    const wordCount = countWords(sentence);
    if (wordCount <= LONG_SENTENCE_THRESHOLD) return sentence;

    const pivotMatch = sentence.search(/\s+(but|and|so|because|while|though|however)\s+/i);
    if (pivotMatch > 0) {
      const connector = selectByHash(["... ", " — ", ", see, "], seed);
      return sentence.slice(0, pivotMatch).trimEnd() + connector + sentence.slice(pivotMatch).trimStart();
    }

    const words = sentence.split(/\s+/);
    const midPoint = Math.min(Math.max(Math.floor(words.length / 2), 6), words.length - 6);
    words.splice(midPoint, 0, selectByHash(["—", "...", ", feel me,"], seed));
    return words.join(" ");
  }

  // ============================================================================
  // Urgency Softening
  // ============================================================================

  function softenUrgentLanguage(text) {
    let result = text;
    result = result.replace(/\bASAP\b/g, "soon as you can");
    result = result.replace(/\bas soon as possible\b/gi, "soon as you can");
    result = result.replace(/\bimmediately\b/gi, "right quick");
    result = result.replace(/\bright away\b/gi, "right quick");
    result = result.replace(/\burgently\b/gi, "right quick");
    result = result.replace(/\burgent\b/gi, "important");
    result = result.replace(/\brequired\b/gi, "needed");
    result = result.replace(/\bmandatory\b/gi, "gotta-have");
    return result;
  }

  // ============================================================================
  // Coach Frame Transformations
  // ============================================================================

  function applyCoachFrameToImperatives(text) {
    let result = text;

    // "Please wait" patterns
    result = result.replace(/^\s*Please\s+(wait|hold on|hold)\b/i, "Hold up");
    result = result.replace(/^\s*Please\s+(check|click|tap|press|select|enter|try|refresh|submit)\b/i, "Go on and $1");
    result = result.replace(/^\s*Please\s+/i, "Please, ");

    result = result.replace(/^\s*Kindly\s+(wait|hold on|hold)\b/i, "Hold up");
    result = result.replace(/^\s*Kindly\s+(check|click|tap|press|select|enter|try|refresh|submit)\b/i, "Go on and $1");
    result = result.replace(/^\s*Kindly\s+/i, "Please, ");

    return result;
  }

  function applyCoachFrameToPronouns(text) {
    let result = text;

    result = result.replace(/\bYou must\b/gi, "We gotta");
    result = result.replace(/\bYou need to\b/gi, "We gotta");
    result = result.replace(/\bYou should\b/gi, "We should");
    result = result.replace(/\bYou have to\b/gi, "We gotta");
    result = result.replace(/\bYou are required to\b/gi, "We gon' need ta");

    return result;
  }

  function applyCoachFrameToContractions(text) {
    let result = text;

    result = result.replace(/\bI am\b/gi, "I'm");
    result = result.replace(/\bWe will\b/gi, "We gon'");
    result = result.replace(/\bgoing to\b/gi, "gon'");
    result = result.replace(/\bwill be\b/gi, "gon' be");
    result = result.replace(/\bIt is\b/gi, "It's");
    result = result.replace(/\bThat is\b/gi, "That's");
    result = result.replace(/\bThis is\b/gi, "This here's");
    result = result.replace(/\bThere is\b/gi, "There's");
    result = result.replace(/\bThere are\b/gi, "There's");

    return result;
  }

  function applyPassiveToActiveTransform(text) {
    if (!looksLikeUiText(text)) return text;

    return text.replace(
      /^(The|This|That)\s+(.+?)\s+must\s+be\s+(saved|submitted|deleted)(\b[\s\S]*)$/i,
      (_match, _det, object, verb, tail) => {
        const actionMap = { submitted: "send in", deleted: "drop", saved: "lock in" };
        const action = actionMap[verb.toLowerCase()] || "save";
        const obj = String(object || "").trim();
        const needsDeterminer = obj && !/^(the|a|an|this|that|these|those|your|my|our|their)\b/i.test(obj);
        const target = needsDeterminer ? `that ${obj}` : obj;
        return `We gotta ${action} ${target}${tail || ""}`.trim();
      }
    );
  }

  function applyCoachFrame(text) {
    let result = text;
    result = applyCoachFrameToImperatives(result);
    result = applyCoachFrameToPronouns(result);
    result = applyCoachFrameToContractions(result);
    result = applyPassiveToActiveTransform(result);
    return result;
  }

  // ============================================================================
  // Metaphor Transformations
  // ============================================================================

  function applyConnectionMetaphors(text, seed) {
    let result = text;

    result = result.replace(/\b(network\s+connection\s+lost|connection\s+lost)\b/gi, (match) => {
      const options = [
        "hold up, the connection took a nap on us",
        "the signal went ghost on us",
        "we lost da signal",
        "connection caught a case of the butterflies"
      ];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    result = result.replace(/\b(timed out|timeout)\b/gi, (match) => preserveCase(match, "took too long"));

    result = result.replace(/\b(network|internet)\s+settings\b/gi, (match) =>
      preserveCase(match, "connection settings")
    );

    return result;
  }

  function applyCrashMetaphors(text, seed) {
    let result = text;

    result = result.replace(/\b(crash(ed)?|froze|frozen)\b/gi, (match) => {
      const options = ["took a nap", "fell asleep on us", "went night-night"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    result = result.replace(/\b(bug|bugs)\b/gi, (match) => {
      const isPlural = match.toLowerCase().endsWith("s");
      return preserveCase(match, isPlural ? "little gremlins" : "little gremlin");
    });

    return result;
  }

  function applyMetaphors(text, seed) {
    let result = text;
    result = applyConnectionMetaphors(result, seed);
    result = applyCrashMetaphors(result, seed);
    return result;
  }

  // ============================================================================
  // UI Phrase Transformations
  // ============================================================================

  function applyCommonUiPhrases(text, seed) {
    let result = text;

    result = result.replace(/\bplease\s+wait\b/gi, () =>
      selectByHash(["hold up a sec", "give it a second", "sit tight a sec", "let it marinate"], seed)
    );

    result = result.replace(/\btry again\b/gi, () =>
      selectByHash(["run it back", "try again", "give it another go", "let's run it back"], seed)
    );

    result = result.replace(/\bclick here\b/gi, () =>
      selectByHash(["tap in right here", "hit this button", "slide in right here"], seed)
    );

    result = result.replace(/\blearn more\b/gi, () =>
      selectByHash(["peep da details", "get da lowdown", "see what's good"], seed)
    );

    result = result.replace(/\bget started\b/gi, () =>
      selectByHash(["let's get it", "let's roll", "time to move"], seed)
    );

    result = result.replace(/\bsign up\b/gi, () =>
      selectByHash(["join da family", "slide in", "get down wit' us"], seed)
    );

    result = result.replace(/\blog in\b/gi, () =>
      selectByHash(["tap in", "slide in", "get in there"], seed)
    );

    result = result.replace(/\blog out\b/gi, () =>
      selectByHash(["dip out", "bounce", "catch ya later"], seed)
    );

    return result;
  }

  function applyQuestionTransforms(text, seed) {
    let result = text;

    if (seed % 2 === 0) {
      result = result.replace(/\bAre you sure\b/gi, "You sure");
      result = result.replace(/\bwant to\b/gi, "wanna");
    }

    return result;
  }

  function applyUiPhrases(text, seed) {
    let result = text;
    result = applyCommonUiPhrases(result, seed);
    result = applyQuestionTransforms(result, seed);
    return result;
  }

  // ============================================================================
  // Sentence Intro Additions
  // ============================================================================

  function shouldAddIntro(text, seed, sentenceIndex, level) {
    const trimmed = text.trim();

    if (!trimmed) return false;
    if (sentenceIndex !== 0) return false;
    if (!looksLikeUiText(trimmed)) return false;
    if (countWords(trimmed) > MAX_INTRO_WORDS) return false;
    if (seed % 2 !== 0 && level < MAX_LEVEL) return false;
    if (/\bhold up\b/i.test(trimmed)) return false;
    if (/^(hold up|hold on|alright|okay|ok|now look|see,|look,|aye,|yo,|check it)/i.test(trimmed)) return false;

    return true;
  }

  function addSentenceIntro(text, seed, sentenceIndex, level) {
    if (!shouldAddIntro(text, seed, sentenceIndex, level)) return text;

    const trimmed = text.trim();

    const basicIntros = ["Hold up,", "Now look,", "Alright,", "See,"];
    const extendedIntros = [...basicIntros, "Aye,", "Yo,", "Check it,", "Peep this,"];
    const intros = level >= MAX_LEVEL ? extendedIntros : basicIntros;

    const intro = selectByHash(intros, seed);
    const shouldLowerCase = /^(Are|Is|Do|Does|Did|Can|Could|Would|Should|Will|Have|Has|Had)\b/.test(trimmed);
    const rest = shouldLowerCase ? trimmed.charAt(0).toLowerCase() + trimmed.slice(1) : trimmed;

    return `${intro} ${rest}`;
  }

  // ============================================================================
  // Death Row Era Vocabulary (Mode Switching)
  // ============================================================================

  /**
   * Enhanced vocabulary reflecting Snoop's 2025 "Mogul" era mixed with 1993 street logic.
   * Maps terms to their Mode A (street) and Mode B (business) equivalents.
   */
  function applyAdminOwnerReplacements(text, seed, mode) {
    // "Admin" / "Owner" -> "Top Dogg" (93) or "The Speculator" (25)
    if (mode === "B") {
      return text.replace(/\badmin(istrator|istrators)?\b/gi, (m) => {
        const options = ["owner", "the speculator", "the boss"];
        return preserveCase(m, selectByHash(options, computeHash(m.toLowerCase()) + seed));
      });
    }
    return text.replace(/\badmin(istrator|istrators)?\b/gi, (m) =>
      preserveCase(m, "top dog")
    );
  }

  function applySaveVaultReplacements(text, seed, mode) {
    // "Save" / "Keep" -> "Stash" (93) or "Vault/Catalog" (25)
    if (mode === "B") {
      return text.replace(/\b(save|saved|saving)\b/gi, (m) => {
        const options = ["vault", "catalog", "put in the vault", "lock away"];
        return preserveCase(m, selectByHash(options, computeHash(m.toLowerCase()) + seed));
      });
    }
    return text.replace(/\b(save|saved|saving)\b/gi, (m) =>
      preserveCase(m, "stash")
    );
  }

  function applyTryAgainReplacements(text, seed, mode) {
    // "Try Again" -> "Bounce back" (93) or "Run the play back" (25)
    if (mode === "B") {
      return text.replace(/\b(try again|retry|retrying)\b/gi, (m) => {
        const options = ["run the play back", "reset", "run it back again"];
        return preserveCase(m, selectByHash(options, computeHash(m.toLowerCase()) + seed));
      });
    }
    return text.replace(/\b(try again|retry|retrying)\b/gi, (m) =>
      preserveCase(m, "bounce back")
    );
  }

  function applyWaitReplacements(text, seed, mode) {
    // "Wait" -> "Chill" (93) or "Let it marinate" (25)
    if (mode === "B") {
      return text.replace(/\b(wait|waiting|please wait|hold on)\b/gi, (m) => {
        const options = ["let it marinate", "don't rush the process", "give it time"];
        return preserveCase(m, selectByHash(options, computeHash(m.toLowerCase()) + seed));
      });
    }
    return text.replace(/\b(wait|waiting|please wait|hold on)\b/gi, (m) =>
      preserveCase(m, "chill")
    );
  }

  function applyUserReplacements(text, seed) {
    // "User" -> "Homie" or "Loved One" (depending on context)
    return text.replace(/\b(users?)\b/gi, (match) => {
      const isPlural = match.toLowerCase().endsWith("s");
      const singularOptions = ["my people", "family", "loved one", "nephew"];
      const pluralOptions = ["my people", "da family", "loved ones", "y'all"];
      const options = isPlural ? pluralOptions : singularOptions;
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });
  }

  /**
   * Cooking/Recipe Metaphors (Mode B): Transform technical terms into culinary wisdom.
   * "Let that spirit cook" philosophy - building something with care and intention.
   */
  function applyCookingMetaphors(text, seed, mode) {
    if (mode !== "B") return text;

    let result = text;

    // Settings -> Spices/Flavor profile
    result = result.replace(/\b(settings?|preferences?|config(uration)?)\b/gi, (match) => {
      const options = ["spices", "seasoning", "flavor profile", "ingredients"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Edit -> Remix/Add flavor to
    result = result.replace(/\b(edit|modify|adjust|tweak|update)\b/gi, (match) => {
      const options = ["remix", "add flavor to", "spice up"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Custom -> Signature/Homemade
    result = result.replace(/\b(custom|personalized?|bespoke)\b/gi, (match) => {
      const options = ["signature", "homemade", "secret recipe"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Processing/Running -> In the kitchen/On the stove
    result = result.replace(/\b(processing|running|executing|working)\b/gi, (match) => {
      const options = ["in the kitchen", "on the stove", "simmering"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Finish/Complete -> Plate it up/Ready to eat
    result = result.replace(/\b(finish(ed)?|complete(d)?|ready|done)\b/gi, (match) => {
      const options = ["plate it up", "serve it", "ready to eat"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    return result;
  }

  function applyModeAwareReplacements(text, seed, mode) {
    let result = text;
    result = applyAdminOwnerReplacements(result, seed, mode);
    result = applySaveVaultReplacements(result, seed, mode);
    result = applyTryAgainReplacements(result, seed, mode);
    result = applyWaitReplacements(result, seed, mode);
    result = applyUserReplacements(result, seed);
    result = applyCookingMetaphors(result, seed, mode);
    return result;
  }

  // ============================================================================
  // Dictionary Replacements
  // ============================================================================

  function applyLoadingReplacements(text) {
    return text.replace(/^\s*Loading\b/gi, (match) => preserveCase(match, "Let it marinate"));
  }

  function applyErrorReplacements(text, seed) {
    return text.replace(/\b(errors?|problems?|issues?)\b/gi, (match) => {
      const isPlural = match.toLowerCase().endsWith("s");
      const singularOptions = ["hiccup", "situation", "bump in da road", "little thing"];
      const pluralOptions = ["hiccups", "situations", "bumps in da road", "little things"];
      const options = isPlural ? pluralOptions : singularOptions;
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });
  }

  function applyConnectionReplacements(text, seed) {
    return text.replace(/\b(connection|network|signal)\b/gi, (match) => {
      const options = ["connection", "signal", "line"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });
  }

  function applySuccessReplacements(text, seed) {
    return text.replace(/\b(success|successful|successfully)\b/gi, (match) => {
      const options = ["smooth", "clean", "boss moves", "on point"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });
  }

  function applyAdjectiveReplacements(text) {
    let result = text;
    result = replaceWordPreservingCase(result, /\b(great|excellent)\b/gi, "legendary");
    result = replaceWordPreservingCase(result, /\b(good)\b/gi, "smooth");
    result = replaceWordPreservingCase(result, /\b(bad)\b/gi, "rough");
    result = replaceWordPreservingCase(result, /\beasy\b/gi, "smooth");
    result = replaceWordPreservingCase(result, /\bsimple\b/gi, "chill");
    result = replaceWordPreservingCase(result, /\bdifficult\b/gi, "tricky");
    result = replaceWordPreservingCase(result, /\bhard\b/gi, "tough");
    result = replaceWordPreservingCase(result, /\bimportant\b/gi, "major");
    result = replaceWordPreservingCase(result, /\bcritical\b/gi, "real major");
    return result;
  }

  function applyActionReplacements(text) {
    let result = text;
    result = replaceWordPreservingCase(result, /\bclick here\b/gi, "tap in right here");
    result = replaceWordPreservingCase(result, /\bclick\b/gi, "tap");
    result = replaceWordPreservingCase(result, /\bpress\b/gi, "hit");
    result = replaceWordPreservingCase(result, /\bsubmit\b/gi, "send in");
    result = replaceWordPreservingCase(result, /\brefresh\b/gi, "reload");
    result = replaceWordPreservingCase(result, /\bdelete\b/gi, "drop");
    result = replaceWordPreservingCase(result, /\bremove\b/gi, "clear out");
    result = replaceWordPreservingCase(result, /\bstart\b/gi, "kick off");
    result = replaceWordPreservingCase(result, /\bbegin\b/gi, "get it started");
    result = replaceWordPreservingCase(result, /\bcontinue\b/gi, "keep it movin'");
    result = replaceWordPreservingCase(result, /\bfinish\b/gi, "wrap it up");
    result = replaceWordPreservingCase(result, /\bcomplete\b/gi, "seal da deal");
    return result;
  }

  function applySaveReplacements(text) {
    let result = text;
    result = replaceWordPreservingCase(result, /\bhave been saved\b/gi, "been locked in");
    result = replaceWordPreservingCase(result, /\bhas been saved\b/gi, "been locked in");
    result = replaceWordPreservingCase(result, /\bwas saved\b/gi, "got locked in");
    result = replaceWordPreservingCase(result, /\bis saved\b/gi, "is locked in");
    return result;
  }

  function applySecurityReplacements(text, seed) {
    let result = text;
    
    // Password/Code -> Secret Code, G-Code, Combination
    result = result.replace(/\b(password|passcode|pin|code)\b/gi, (match) => {
      const options = ["secret code", "G-Code", "combination"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Private/Secure -> Low profile, Between us, For the fam only
    result = result.replace(/\b(private|secure|confidential|restricted)\b/gi, (match) => {
      const options = ["low profile", "between us", "for the fam only"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Security -> Lock it down, Keep it guarded, The code
    result = result.replace(/\b(security|secure)\b/gi, (match) => {
      const options = ["lock it down", "keep it guarded", "the code"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    // Unknown/Error -> Unverified, Strange face, Who dis?
    result = result.replace(/\b(unknown|unrecognized|unfamiliar)\b/gi, (match) => {
      const options = ["unverified", "strange face", "who dis?"];
      return preserveCase(match, selectByHash(options, computeHash(match.toLowerCase()) + seed));
    });

    return result;
  }

  function applyStateReplacements(text) {
    let result = text;
    result = replaceWordPreservingCase(result, /\btimed out\b/gi, "took too long");
    result = replaceWordPreservingCase(result, /\bloading\b/gi, "marinating");
    result = replaceWordPreservingCase(result, /\bwait\b/gi, "hold up");
    result = replaceWordPreservingCase(result, /\bprocessing\b/gi, "cookin'");
    result = replaceWordPreservingCase(result, /\bwarning\b/gi, "heads up");
    result = replaceWordPreservingCase(result, /\bcaution\b/gi, "heads up");
    result = replaceWordPreservingCase(result, /\bdanger\b/gi, "watch out");
    return result;
  }

  function applyCourtesyReplacements(text) {
    let result = text;
    result = replaceWordPreservingCase(result, /\bthank you\b/gi, "appreciate ya");
    result = replaceWordPreservingCase(result, /\bthanks\b/gi, "preciate it");
    result = replaceWordPreservingCase(result, /\bsorry\b/gi, "my bad");
    result = replaceWordPreservingCase(result, /\bexcuse me\b/gi, "pardon me");
    return result;
  }

  function applyDictionary(text, seed, mode) {
    let result = text;
    result = applyLoadingReplacements(result);
    result = applyModeAwareReplacements(result, seed, mode);
    result = applyErrorReplacements(result, seed);
    result = applyConnectionReplacements(result, seed);
    result = applySuccessReplacements(result, seed);
    result = applyAdjectiveReplacements(result);
    result = applyActionReplacements(result);
    result = applySaveReplacements(result);
    result = applySecurityReplacements(result, seed);
    result = applyStateReplacements(result);
    result = applyCourtesyReplacements(result);
    return result;
  }

  // ============================================================================
  // Snoop Lexicon (Signature Phrases)
  // ============================================================================

  function applySignaturePhrases(text) {
    let result = text;
    result = result.replace(/\bfor sure\b/gi, (m) => preserveCase(m, "fo' shizzle"));
    result = result.replace(/\bdefinitely\b/gi, (m) => preserveCase(m, "no doubt"));
    result = result.replace(/\bokay\b/gi, (m) => preserveCase(m, "aight"));
    result = result.replace(/\bfriend(s)?\b/gi, (m, s) => preserveCase(m, s ? "homies" : "homie"));
    result = result.replace(/\bbuddy\b/gi, (m) => preserveCase(m, "homie"));
    result = result.replace(/\bpal\b/gi, (m) => preserveCase(m, "homie"));
    result = result.replace(/\bcool\b/gi, (m) => preserveCase(m, "chill"));
    result = result.replace(/\bawesome\b/gi, (m) => preserveCase(m, "legendary"));
    result = result.replace(/\bamazing\b/gi, (m) => preserveCase(m, "legendary"));
    result = result.replace(/\bfantastic\b/gi, (m) => preserveCase(m, "legendary"));
    result = result.replace(/\bwonderful\b/gi, (m) => preserveCase(m, "beautiful"));
    result = result.replace(/\bperfect\b/gi, (m) => preserveCase(m, "on point"));
    result = result.replace(/\byes\b/gi, (m) => preserveCase(m, "fasho"));
    result = result.replace(/\bnope\b/gi, (m) => preserveCase(m, "nah"));
    result = result.replace(/\bno\b/gi, (m) => preserveCase(m, "nah"));
    return result;
  }

  function applySlangVocabulary(text) {
    let result = text;
    result = result.replace(/\bmoney\b/gi, (m) => preserveCase(m, "cheddar"));
    result = result.replace(/\bcar\b/gi, (m) => preserveCase(m, "whip"));
    result = result.replace(/\bhouse\b/gi, (m) => preserveCase(m, "crib"));
    result = result.replace(/\bhome\b/gi, (m) => preserveCase(m, "crib"));
    result = result.replace(/\bparty\b/gi, (m) => preserveCase(m, "function"));
    result = result.replace(/\bpolice\b/gi, (m) => preserveCase(m, "one time"));
    result = result.replace(/\bcops?\b/gi, (m) => preserveCase(m, "one time"));
    result = result.replace(/\brelax\b/gi, (m) => preserveCase(m, "chill"));
    result = result.replace(/\bcalm down\b/gi, (m) => preserveCase(m, "easy now"));
    result = result.replace(/\bstupid\b/gi, (m) => preserveCase(m, "trippin'"));
    result = result.replace(/\bcrazy\b/gi, (m) => preserveCase(m, "wild"));
    result = result.replace(/\bincredible\b/gi, (m) => preserveCase(m, "off da chain"));
    return result;
  }

  function applyRespectfulAddress(text) {
    let result = text;
    result = result.replace(/\bSir\b/gi, (m) => preserveCase(m, "big dog"));
    result = result.replace(/\bMr\.\b/gi, "big");
    result = result.replace(/\bMrs\.\b/gi, "Ms.");
    return result;
  }

  function applyIzzleSuffix(text, seed, level) {
    if (level < MAX_LEVEL) return text;

    let result = text;

    /**
     * Authentic izzle rule: Only use if it creates internal rhyme or softens harsh concepts.
     * Bad: "The connection-izzle is brok-izzle."
     * Authentic: "The connection is fizzled, but we still in the hizzle." (AABB rhyme)
     */

    // Only apply izzle for softening negatives with rhyme scheme
    if (/\b(broke|broken)\b/gi.test(result)) {
      result = result.replace(/\bbroken\b/gi, (m) => preserveCase(m, "fizzled"));
    }

    // "sure" -> "shizzle" has history in Snoop's speech
    result = result.replace(/\bsure\b/gi, (m) => preserveCase(m, "shizzle"));

    // Real occasionally becomes "rizzle" but only with rhyme context
    if (seed % 3 === 0 && /\breal\b.*\b(deal|feel|meal|heal|wheel|steal)\b/i.test(result)) {
      result = result.replace(/\breal\b/gi, (m) => preserveCase(m, "rizzle"));
    }

    return result;
  }

  /**
   * Double-G Stutter: Authentic 90s Snoop often repeated consonants for percussive effect.
   * "We talkin' B-I-G business" - spell out keywords rhythmically.
   */
  function applyDoubleGStutter(text, seed, level) {
    if (level < MAX_LEVEL || seed % 13 !== 0) return text;

    let result = text;

    // Spell out emphasis words rhythmically
    const stutWords = ["business", "game", "play", "moves"];

    for (const word of stutWords) {
      if (new RegExp(`\\b${word}\\b`, "i").test(result)) {
        const spelled = spellOutWord(word);
        result = result.replace(new RegExp(`\\b${word}\\b`, "i"), (m) =>
          preserveCase(m, spelled)
        );
        break; // Only spell one per sentence
      }
    }

    return result;
  }

  function applySnoopLexicon(text, seed, level) {
    if (level <= MIN_LEVEL) return text;

    let result = text;
    result = applySignaturePhrases(result);
    result = applySlangVocabulary(result);
    result = applyRespectfulAddress(result);
    result = applyIzzleSuffix(result, seed, level);
    return result;
  }

  // ============================================================================
  // Light Gizoogle (Basic Word Replacements)
  // ============================================================================

  function applyArticleReplacements(text, level) {
    let result = text;
    result = replaceWordPreservingCase(result, /\bthe\b/gi, level >= MAX_LEVEL ? "tha" : "da");
    result = replaceWordPreservingCase(result, /\band\b/gi, "n'");
    result = replaceWordPreservingCase(result, /\bwith\b/gi, "wit'");
    result = replaceWordPreservingCase(result, /\bfor\b/gi, "fo'");

    if (level >= MAX_LEVEL) {
      result = replaceWordPreservingCase(result, /\bto\b/gi, "ta");
      result = replaceWordPreservingCase(result, /\bof\b/gi, "o'");
    }

    return result;
  }

  function applyPronounReplacements(text, seed, level) {
    let result = text;

    if (level >= 2 || seed % 5 === 0) {
      result = replaceWordPreservingCase(result, /\byour\b/gi, "yo");
    }
    if (level >= 2 || seed % 7 === 0) {
      result = replaceWordPreservingCase(result, /\byou\b/gi, "ya");
    }

    return result;
  }

  function applyContractionReplacements(text, level) {
    if (level < 2) return text;

    let result = text;
    result = replaceWordPreservingCase(result, /\bjust\b/gi, "jus'");
    result = replaceWordPreservingCase(result, /\babout\b/gi, "'bout");
    result = replaceWordPreservingCase(result, /\bnothing\b/gi, "nothin'");
    result = replaceWordPreservingCase(result, /\bsomething\b/gi, "somethin'");
    result = replaceWordPreservingCase(result, /\banything\b/gi, "anythin'");
    result = replaceWordPreservingCase(result, /\beverything\b/gi, "everythin'");

    if (level >= MAX_LEVEL) {
      result = replaceWordPreservingCase(result, /\bokay\b/gi, "aight");
      result = replaceWordPreservingCase(result, /\bvery\b/gi, "real");
      result = replaceWordPreservingCase(result, /\bgood\b/gi, "smooth");
      result = replaceWordPreservingCase(result, /\bgonna\b/gi, "gon'");
    }

    return result;
  }

  function applyLightGizoogle(text, seed, level) {
    const trimmed = text.trim();
    if (!trimmed) return text;

    const wordCount = countWords(trimmed);
    const isTooShort = wordCount < SHORT_TEXT_THRESHOLD && level < MAX_LEVEL;
    const shouldSkip = level === MIN_LEVEL && seed % 2 !== 0;

    if (isTooShort || shouldSkip) return text;

    let result = text;
    result = applyArticleReplacements(result, level);
    result = applyPronounReplacements(result, seed, level);
    result = applyContractionReplacements(result, level);
    return result;
  }

  // ============================================================================
  // West Coast Grammar (Zero Copula, Invariant Be)
  // ============================================================================

  /**
   * Deep West Coast Grammar transformation for authentic speech patterns.
   * Uses zero copula (dropping "is/are"), invariant be, and future tense reduction.
   * 
   * Examples:
   * - "The system is processing" -> "The system processing"
   * - "There is a problem" -> "It's a problem"
   * - "We are going to reset" -> "We finna reset"
   */
  function applyWestCoastGrammar(text, seed, level) {
    if (level < MAX_LEVEL) return text;

    let result = text;

    // Rule 1: Zero Copula - Drop "is/are" before -ing verbs
    // "The system is processing" -> "The system processing"
    result = result.replace(/\b(is|are)\s+([a-z]+ing)\b/gi, "$2");

    // Rule 2: "There is/are" -> "It's" (Snoop conversational style)
    // "There is a problem" -> "It's a problem"
    result = result.replace(/\bThere\s+(is|are)\b/gi, "It's");

    // Rule 3: Future tense reduction - "is/are going to" -> "finna" or "bout to"
    // "We are going to reset" -> "We finna reset" or "We bout to reset"
    if (seed % 2 === 0) {
      result = result.replace(/\b(is|are)\s+going\s+to\b/gi, "finna");
    } else {
      result = result.replace(/\b(is|are)\s+going\s+to\b/gi, "bout to");
    }

    // Rule 4: Invariant "be" for habitual action
    // "The app runs slow" -> "The app be running slow"
    if (seed % 5 === 0) {
      result = result.replace(/\b(runs|works|loads)\s+(slow|fast|smooth)/gi, (match, verb, speed) => {
        const stem = verb.replace(/s$/, "");
        return `be ${stem}in' ${speed}`;
      });
    }

    return result;
  }

  // ============================================================================
  // Phonetics (Sound Changes)
  // ============================================================================

  function applyIngDropping(text, seed, level) {
    if (level === MIN_LEVEL && seed % 3 !== 0) return text;

    return text.replace(/\b([A-Za-z]{3,})ing\b/g, (match, stem) => {
      if (WORDS_TO_SKIP_ING_REPLACEMENT.has(match.toLowerCase())) return match;
      if (/^[A-Z]/.test(match)) return match;
      return `${stem}in'`;
    });
  }

  function applyHeavyPhonetics(text, level) {
    if (level < MAX_LEVEL) return text;

    let result = text;
    result = replaceWordPreservingCase(result, /\bwhat\b/gi, "wha'");
    result = replaceWordPreservingCase(result, /\bthat\b/gi, "dat");
    result = replaceWordPreservingCase(result, /\bthis\b/gi, "dis");
    result = replaceWordPreservingCase(result, /\bthem\b/gi, "'em");
    result = replaceWordPreservingCase(result, /\bthose\b/gi, "dem");
    return result;
  }

  function applyPhonetics(text, seed, level) {
    const trimmed = text.trim();
    if (!trimmed) return text;

    let result = text;
    result = applyIngDropping(result, seed, level);
    result = applyHeavyPhonetics(result, level);
    return result;
  }

  // ============================================================================
  // Emphasis (Spell-Out and Izzle)
  // ============================================================================

  function applySpellOutEmphasis(text, seed, level) {
    let result = text;

    const emphasisRules = [
      { pattern: /\breal\b/i, word: "REAL" },
      { pattern: /\blove\b/i, word: "LOVE" },
      { pattern: /\bteam\b/i, word: "TEAM" },
      { pattern: /\bsmooth\b/i, word: "SMOOTH" }
    ];

    for (const rule of emphasisRules) {
      if (!rule.pattern.test(result)) continue;
      if ((seed + computeHash(rule.word)) % 13 !== 0) continue;
      if (level < 2 && seed % 2 !== 0) continue;

      result = result.replace(rule.pattern, spellOutWord(rule.word));
      break;
    }

    return result;
  }

  function applyForShizzlePunchline(text, seed, level) {
    const shouldApply = level >= 2 || seed % 29 === 0;
    const hasForSure = /\bfor sure\b/i.test(text);
    const alreadyHasShizzle = /\bfo'? shizzle\b/i.test(text);

    if (shouldApply && hasForSure && !alreadyHasShizzle) {
      return text.replace(/\bfor sure\b/gi, (match) =>
        preserveCase(match, "for sure... fo' shizzle")
      );
    }

    return text;
  }

  function applyEmphasis(text, seed, level) {
    let result = text;
    result = applySpellOutEmphasis(result, seed, level);
    result = applyForShizzlePunchline(result, seed, level);
    return result;
  }

  // ============================================================================
  // Preacher Rhythm (Anadiplosis / Emphatic Repetition)
  // ============================================================================

  /**
   * When Snoop gives advice or preaches, he uses rhetorical repetition.
   * Repeating the first verb at the end for emphasis (anadiplosis).
   * 
   * Examples:
   * - "Focus on the details... I said FOCUS..."
   * - "Listen to me... I said LISTEN..."
   */
  function applyPreacherRepetition(text, seed, level) {
    if (level < MAX_LEVEL || seed % 19 !== 0) return text;

    const trimmed = text.trim();
    const imperativeMatch = trimmed.match(/^(Look|Listen|Focus|Watch|Stop|Read|Click|Tap|Remember|Check|Understand|Know|Feel|See)\b/i);

    if (!imperativeMatch || trimmed.length > 60) return text;

    const verb = imperativeMatch[1];
    const base = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;

    return `${base}... I said ${verb.toUpperCase()}...`;
  }

  // ============================================================================
  // Address Term Addition
  // ============================================================================

  function shouldAddAddressTerm(text, seed, level) {
    if (level < 2) return false;

    const trimmed = text.trim();
    if (!trimmed) return false;

    const wordCount = countWords(trimmed);
    if (wordCount < MIN_ADDRESS_TERM_WORDS || wordCount > MAX_ADDRESS_TERM_WORDS) return false;

    const alreadyHasAddressTerm = ADDRESS_TERMS.some(term =>
      text.toLowerCase().includes(term)
    );
    if (alreadyHasAddressTerm) return false;

    if (seed % 7 !== 0 && level < MAX_LEVEL) return false;

    return true;
  }

  function addAddressTerm(text, seed, level) {
    if (!shouldAddAddressTerm(text, seed, level)) return text;

    const trimmed = text.trim();
    const term = selectByHash(ADDRESS_TERMS, seed);

    if (hasTerminalPunctuation(trimmed)) {
      return trimmed.replace(/([.!?])\s*$/, `, ${term}$1`);
    }

    return `${trimmed}, ${term}`;
  }

  // ============================================================================
  // Affirmation and Reassurance
  // ============================================================================

  function shouldAddSuccessAffirmation(text, seed, level) {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const lower = trimmed.toLowerCase();

    const isSuccess = /\b(locked in|saved|complete|completed|done|success|smooth|clean|approved|confirmed)\b/.test(lower);
    const hasError = /\b(error|failed|failure|problem|issue|cannot)\b/.test(lower);

    if (!isSuccess || hasError) return false;
    if (countWords(trimmed) > MAX_AFFIRMATION_WORDS) return false;

    const isLockedIn = /\bbeen locked in\b/.test(lower) || /\blocked in\b/.test(lower);
    if (!isLockedIn && seed % 2 !== 0 && level < MAX_LEVEL) return false;

    return true;
  }

  function addSuccessAffirmation(text, seed, level) {
    if (!shouldAddSuccessAffirmation(text, seed, level)) return text;

    const trimmed = text.trim();
    const affirmation = selectByHash(AFFIRMATIONS, seed);

    const alreadyContainsAffirmation = new RegExp(
      affirmation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"
    ).test(trimmed);

    if (alreadyContainsAffirmation) return text;

    const base = hasTerminalPunctuation(trimmed) ? trimmed : `${trimmed}.`;
    return `${base} ${affirmation}`;
  }

  function shouldAddReassurance(text, seed, level) {
    const trimmed = text.trim();
    if (!trimmed) return false;
    if (!looksLikeUiText(trimmed)) return false;

    const lower = trimmed.toLowerCase();
    const isProblem = /\b(error|failed|failure|problem|issue|timeout|timed out|lost|hiccup|situation)\b/.test(lower);
    if (!isProblem) return false;

    if (countWords(trimmed) > MAX_REASSURANCE_WORDS) return false;
    if (/\b(no stress|we got|we gon'|we gonna|we will|ain't nothin')\b/i.test(trimmed)) return false;
    if (seed % 3 !== 0 && level < MAX_LEVEL) return false;

    return true;
  }

  function addReassurance(text, seed, level) {
    if (!shouldAddReassurance(text, seed, level)) return text;

    const trimmed = text.trim();
    const reassurance = selectByHash(REASSURANCES, seed);
    const base = hasTerminalPunctuation(trimmed) ? trimmed : `${trimmed}.`;

    return `${base} ${reassurance}`;
  }

  // ============================================================================
  // Confusion Rewrite
  // ============================================================================

  function rewriteConfusion(text, seed) {
    const trimmed = text.trim();
    if (!trimmed) return text;

    const lower = trimmed.toLowerCase();
    if (!/\bconfused\b/.test(lower)) return text;
    if (countWords(trimmed) > MAX_CONFUSION_WORDS) return text;
    if (seed % 2 !== 0) return text;

    if (/\binstructions?\b/.test(lower)) {
      return "Man, these instructions lookin' a little cloudy. Let's slow it down and figure out da play.";
    }

    return "Man, it's lookin' a little cloudy. Let's slow it down and figure out da play.";
  }

  // ============================================================================
  // Tags and Sound Effects
  // ============================================================================

  function shouldAddTag(text, seed, level) {
    const trimmed = text.trim();
    const wordCount = countWords(trimmed);

    if (endsWithQuestion(trimmed)) return false;
    if (!hasTerminalPunctuation(trimmed)) return false;

    const minWords = level >= MAX_LEVEL ? 6 : 10;
    if (wordCount < minWords) return false;

    const tagSeed = computeHash(trimmed) + seed;
    const tagChance = level >= MAX_LEVEL ? 4 : 5;

    return tagSeed % tagChance === 0;
  }

  function shouldAddSound(text, seed, level) {
    const bucket = detectSentimentBucket(text);
    const sounds = SOUND_EFFECTS[bucket] || [];

    if (sounds.length === 0) return false;

    const soundSeed = computeHash(text.trim()) + seed;
    const soundChance = level >= MAX_LEVEL ? 5 : 7;

    return soundSeed % soundChance === 0;
  }

  function addTagAndSound(text, seed, sentenceIndex, level) {
    const trimmed = text.trim();
    if (!trimmed) return text;
    if (trimmed.includes("\u0000GZ")) return text;
    if (/(https?:\/\/|www\.|@)/i.test(trimmed)) return text;

    let result = text;
    const tagSeed = computeHash(trimmed) + seed + sentenceIndex * 101;
    const addTag = shouldAddTag(text, tagSeed, level);

    if (addTag) {
      const tag = selectByHash(SENTENCE_TAGS, tagSeed);
      result = result.replace(/\s*$/, "");
      result += ` — ${tag}`;
    }

    const soundSeed = computeHash(trimmed) + seed + sentenceIndex * 97;
    const addSound = shouldAddSound(text, soundSeed, level) && !addTag;

    if (addSound) {
      const bucket = detectSentimentBucket(trimmed);
      const sound = selectByHash(SOUND_EFFECTS[bucket], soundSeed);
      result = result.replace(/\s*$/, "");
      if (!hasTerminalPunctuation(result)) result += ".";
      result += ` ${sound}`;
    }

    return result;
  }

  // ============================================================================
  // Custom Country Replacements
  // ============================================================================

  function applyCountryReplacements(text) {
    let result = text;
    result = result.replace(/North\s+Korea/gi, "Uptown Korea");
    result = result.replace(/South\s+Korea/gi, "downtown korea");
    return result;
  }

  // ============================================================================
  // Geographical Anchoring (LBC - Long Beach Connection)
  // ============================================================================

  /**
   * Snoop centers the universe in Long Beach and the Eastside.
   * Global and worldwide references get anchored to California geography.
   * 
   * Examples:
   * - "Worldwide" -> "From the LBC to the whole map"
   * - "Global" -> "Worldwide Eastsidaz"
   * - "Local" -> "Neighborhood"
   */
  function applyGeographicAnchors(text, seed, level) {
    if (level < 2) return text;

    let result = text;

    // "Worldwide" -> "From the LBC to the whole map"
    result = result.replace(/\bworldwide\b/gi, (m) =>
      preserveCase(m, "from the LBC to the whole map")
    );

    // "Global" -> "Worldwide Eastsidaz"
    result = result.replace(/\bglobal\b/gi, (m) =>
      preserveCase(m, "worldwide Eastsidaz")
    );

    // "Local" -> "Neighborhood"
    result = result.replace(/\blocal\b/gi, (m) =>
      preserveCase(m, "neighborhood")
    );

    return result;
  }

  // ============================================================================
  // UI Artifact Normalization
  // ============================================================================

  function normalizeUiArtifacts(chunk) {
    return chunk.replace(/\bLoading\?\s+please\s+wait\b/gi, "Loading… please wait");
  }

  // ============================================================================
  // Scenario-Specific Prompt Engineering Formulas
  // ============================================================================

  /**
   * Scenario A: Warning Message
   * Formula: [1993 Stoicism] + [2025 Reassurance]
   * Example: "Yo, peep this. The system actin' scandalous right now (93).
   *          But we ain't foldin'. We just pivot and slide to the next play. Tap retry."
   */
  function formatWarningScenario(text, seed) {
    const trimmed = text.trim();
    if (!/\b(warning|error|failed|problem|issue)\b/i.test(trimmed)) return text;

    const modeAIntro = selectByHash(MODE_A_INTROS, seed);
    const bridge = generateCodeSwitchBridge(text, seed);
    const solution = selectByHash([
      "Tap retry.",
      "Hit refresh and we got you.",
      "Reset and run it back.",
      "Let's smooth this out."
    ], seed + 17);

    return `${modeAIntro}. ${trimmed}${bridge} ${solution}`;
  }

  /**
   * Scenario B: Tutorial / Instruction
   * Formula: [Grandpa Metaphor] + [Specific Command] + [Signature Tag]
   * Example: "See, you gotta treat this app like a fine suit. Keep it clean.
   *           Click that icon right there—yeah, the shiny one—and step into the room."
   */
  function formatTutorialScenario(text, seed) {
    const trimmed = text.trim();
    if (!/\b(click|tap|press|select|enter|instruction|step|follow)\b/i.test(trimmed)) return text;

    const metaphors = [
      "See, you gotta treat this app like a fine suit. Keep it clean.",
      "Check it out, family. This is like keepin' your crib organized.",
      "Listen here. This is like waxin' your whip—do it smooth.",
      "See here, loved one. Treat this like buildin' your empire."
    ];

    const metaphor = selectByHash(metaphors, seed);
    const tag = selectByHash(SENTENCE_TAGS, seed + 23);

    return `${metaphor} ${trimmed} — ${tag}`;
  }

  /**
   * Scenario C: Terms of Service / Agreement
   * Formula: [The "Masters" Frame]
   * Example: "Before we shake hands on this, make sure you read the paperwork.
   *           We keepin' everything transparent. You own yours, I own mine."
   */
  function formatAgreementScenario(text, seed) {
    const trimmed = text.trim();
    if (!/\b(agree|accept|terms|policy|service|condition)\b/i.test(trimmed)) return text;

    const frames = [
      "Before we shake hands on this, make sure you read the paperwork. We keepin' everything transparent. You own yours, I own mine.",
      "Look, this is how we do business. Everything on the table, no games. You read it, I read it, we both good?",
      "See, we gotta keep it straight. This is the contract, baby. You own your masters, we own ours. That's equity right there."
    ];

    const frame = selectByHash(frames, seed);
    return `${frame} ${trimmed}`;
  }

  // ============================================================================
  // Sentence Processing Pipeline
  // ============================================================================

  function processSentence(sentence, seed, sentenceIndex, level) {
    const leadingWhitespace = sentence.match(/^\s*/)?.[0] ?? "";
    const trailingWhitespace = sentence.match(/\s*$/)?.[0] ?? "";
    let core = sentence.trim();

    if (!core) return sentence;

    // Detect mode (The Hybrid code-switch)
    const mode = detectMode(core);

    // Apply scenario-specific formatting for strong signals
    if (sentenceIndex === 0) {
      if (/\b(warning|error|failed|critical|problem)\b/i.test(core) && mode === "A") {
        core = formatWarningScenario(core, seed);
      } else if (/\b(click|tap|press|instruction|tutorial|step)\b/i.test(core) && mode === "B") {
        core = formatTutorialScenario(core, seed);
      } else if (/\b(agree|accept|terms|policy|service)\b/i.test(core)) {
        core = formatAgreementScenario(core, seed);
      }
    }

    core = splitLongSentence(core, seed + sentenceIndex);
    core = softenUrgentLanguage(core);
    core = rewriteConfusion(core, seed + sentenceIndex);
    core = applyMetaphors(core, seed + sentenceIndex);
    core = applyCoachFrame(core);
    core = applyUiPhrases(core, seed + sentenceIndex);
    core = addSentenceIntro(core, seed + sentenceIndex, sentenceIndex, level);
    
    // Pass mode to dictionary for mode-aware replacements
    core = applyDictionary(core, seed + sentenceIndex, mode);
    
    core = applySnoopLexicon(core, seed + sentenceIndex, level);
    core = applyLightGizoogle(core, seed + sentenceIndex, level);
    
    // Apply double-G stutter (emphasis rule)
    core = applyDoubleGStutter(core, seed + sentenceIndex, level);
    
    // Apply West Coast Grammar (zero copula, invariant be, future tense)
    core = applyWestCoastGrammar(core, seed + sentenceIndex, level);
    
    core = applyPhonetics(core, seed + sentenceIndex, level);
    
    // Apply geographical anchoring (LBC references)
    core = applyGeographicAnchors(core, seed + sentenceIndex, level);
    
    core = applyEmphasis(core, seed + sentenceIndex, level);
    
    // Apply preacher rhythm (emphatic repetition)
    core = applyPreacherRepetition(core, seed + sentenceIndex, level);
    
    core = addAddressTerm(core, seed + sentenceIndex, level);
    core = addSuccessAffirmation(core, seed + sentenceIndex, level);
    core = addReassurance(core, seed + sentenceIndex, level);
    core = addTagAndSound(core, seed, sentenceIndex, level);

    return leadingWhitespace + core + trailingWhitespace;
  }

  function processChunk(chunk, seed, level) {
    if (!chunk || chunk.startsWith("\n")) return chunk;

    const normalizedChunk = normalizeUiArtifacts(chunk);
    const sentences = splitIntoSentences(normalizedChunk);

    const processedSentences = sentences.map((sentence, index) =>
      processSentence(sentence, seed, index, level)
    );

    return processedSentences.join("");
  }

  // ============================================================================
  // Main Translation Function
  // ============================================================================

  function translateText(input, options = {}) {
    if (!input || !input.trim()) return input;

    const level = options.level !== undefined && Number.isFinite(options.level)
      ? clampLevel(options.level)
      : currentLevel;

    let text = input;
    text = applyCountryReplacements(text);

    const seed = computeHash(text) + level * 97;
    const { text: maskedText, preserved } = maskPreservedContent(text);

    const chunks = splitByNewlines(maskedText);
    const processedChunks = chunks.map(chunk => processChunk(chunk, seed, level));

    const result = processedChunks.join("");
    return unmaskPreservedContent(result, preserved);
  }

  // ============================================================================
  // Public API
  // ============================================================================

  return {
    translateText,
    setLevel
  };
});
