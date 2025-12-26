/**
 * Gizoogle Translator
 * 
 * Transforms text into Snoop Dogg-inspired speech following the "Uncle Snoop" era voice.
 * Based on research notes for authentic, modern, supportive translation style.
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
    "we stay ready."
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
  const DEFAULT_LEVEL = 2;

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
  // UI Text Detection
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

  function applyUserReplacements(text, seed) {
    return text.replace(/\b(user|users)\b/gi, (match) => {
      const isPlural = match.toLowerCase().endsWith("s");
      const singularOptions = ["my people", "family", "nephew"];
      const pluralOptions = ["my people", "da family", "ya'll"];
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

  function applyDictionary(text, seed) {
    let result = text;
    result = applyLoadingReplacements(result);
    result = applyErrorReplacements(result, seed);
    result = applyUserReplacements(result, seed);
    result = applyConnectionReplacements(result, seed);
    result = applySuccessReplacements(result, seed);
    result = applyAdjectiveReplacements(result);
    result = applyActionReplacements(result);
    result = applySaveReplacements(result);
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
    result = result.replace(/\bsure\b/gi, (m) => preserveCase(m, "shizzle"));

    if (seed % 3 === 0) {
      result = result.replace(/\breal\b/gi, (m) => preserveCase(m, "rizzle"));
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
  // UI Artifact Normalization
  // ============================================================================

  function normalizeUiArtifacts(chunk) {
    return chunk.replace(/\bLoading\?\s+please\s+wait\b/gi, "Loading… please wait");
  }

  // ============================================================================
  // Sentence Processing Pipeline
  // ============================================================================

  function processSentence(sentence, seed, sentenceIndex, level) {
    const leadingWhitespace = sentence.match(/^\s*/)?.[0] ?? "";
    const trailingWhitespace = sentence.match(/\s*$/)?.[0] ?? "";
    let core = sentence.trim();

    if (!core) return sentence;

    core = splitLongSentence(core, seed + sentenceIndex);
    core = softenUrgentLanguage(core);
    core = rewriteConfusion(core, seed + sentenceIndex);
    core = applyMetaphors(core, seed + sentenceIndex);
    core = applyCoachFrame(core);
    core = applyUiPhrases(core, seed + sentenceIndex);
    core = addSentenceIntro(core, seed + sentenceIndex, sentenceIndex, level);
    core = applyDictionary(core, seed + sentenceIndex);
    core = applySnoopLexicon(core, seed + sentenceIndex, level);
    core = applyLightGizoogle(core, seed + sentenceIndex, level);
    core = applyPhonetics(core, seed + sentenceIndex, level);
    core = applyEmphasis(core, seed + sentenceIndex, level);
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
