(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const level1 = translator.snoopLexiconLevel1;
  const level2 = translator.snoopLexiconLevel2;
  const level3 = translator.snoopLexiconLevel3;
  const izzleAaveData = translator.snoopLexiconIzzleAaveData;
  const styleData = translator.snoopLexiconStyleData;

  if (!level1 || !level2 || !level3 || !izzleAaveData || !styleData) {
    throw new Error(
      "snoop-lexicon-level1.js, snoop-lexicon-level2.js, snoop-lexicon-level3.js, snoop-lexicon-izzle-aave.js, and snoop-lexicon-style-data.js must load before snoop-lexicon-data.js",
    );
  }

  function freezeRules(rules) {
    return Object.freeze(
      rules.map((rule) =>
        Object.freeze({
          ...rule,
          exceptions: Object.freeze(rule.exceptions || []),
        }),
      ),
    );
  }

  function freezeOpeners(openers) {
    return Object.freeze({
      warning: Object.freeze(openers.warning),
      success: Object.freeze(openers.success),
      question: Object.freeze(openers.question),
      neutral: Object.freeze(openers.neutral),
    });
  }

  const lexiconData = Object.freeze({
    source: Object.freeze({ datasets: "datasets.json", notes: "snoop.md" }),
    phonologicalRules: freezeRules([
      {
        name: "drop_g_ing",
        minLevel: 1,
        pattern: /\b([a-z]{3,})ing\b/gi,
        replacement: "$1in'",
        exceptions: [/^(?:king|ring|thing|bring|sling|fling|string)$/i],
      },
      {
        name: "drop_er",
        minLevel: 1,
        pattern: /\b([a-z]{3,})er\b/g,
        replacement: "$1a",
        exceptions: [/^(?:water|after|under)$/i],
      },
      {
        name: "demonstrative_the",
        minLevel: 1,
        pattern: /\bthe\b/gi,
        replacement: "da",
      },
      {
        name: "demonstrative_this",
        minLevel: 1,
        pattern: /\bthis\b/gi,
        replacement: "dis",
      },
      {
        name: "demonstrative_that",
        minLevel: 1,
        pattern: /\bthat\b/gi,
        replacement: "dat",
      },
      {
        name: "demonstrative_them",
        minLevel: 1,
        pattern: /\bthem\b/gi,
        replacement: "dem",
      },
      {
        name: "demonstrative_they",
        minLevel: 1,
        pattern: /\bthey\b/gi,
        replacement: "dey",
      },
      {
        name: "demonstrative_there",
        minLevel: 1,
        pattern: /\bthere\b/gi,
        replacement: "dere",
      },
      {
        name: "demonstrative_those",
        minLevel: 1,
        pattern: /\bthose\b/gi,
        replacement: "doze",
      },
      {
        name: "drop_and",
        minLevel: 1,
        pattern: /\band\b/gi,
        replacement: "an'",
      },
      {
        name: "drop_just",
        minLevel: 1,
        pattern: /\bjust\b/gi,
        replacement: "jus'",
      },
      {
        name: "drop_about",
        minLevel: 1,
        pattern: /\babout\b/gi,
        replacement: "'bout",
      },
      {
        name: "west_coast_cc",
        minLevel: 3,
        pattern: /\b([a-z]{2,}?)(?:cks|ks)\b/gi,
        replacement: "$1cc",
        exceptions: [/^(?:looks|works|weeks)$/i],
      },
    ]),
    lexicalSubstitutions: Object.freeze({ level1, level2, level3 }),
    izzleFixedFormsLevel2: izzleAaveData.izzleFixedFormsLevel2,
    izzleFixedFormsLevel3: izzleAaveData.izzleFixedFormsLevel3,
    aaveRules: izzleAaveData.aaveRules,
    geographicInjection: styleData.geographicInjection,
    carCulture: styleData.carCulture,
    melodicChant: styleData.melodicChant,
    quoteBank: styleData.quoteBank,
    izzleQualifyingPatterns:
      /\b(?:party|money|friend|home|house|block|hood|flow|style|vibe|game|time|plan|dream|goal|music|work|ride|boss|crew|paper|drink|juice|smooth)\b/gi,
    discourseMarkers: Object.freeze({
      openers: freezeOpeners({
        warning: [
          "Hold up hold up hold up!",
          "Pump ya brakes!",
          "Whoa whoa whoa,",
          "Aye check it,",
        ],
        success: [
          "That's what's up!",
          "Smooth like a Cadillac,",
          "We in there!",
          "Big tings poppin',",
        ],
        question: [
          "What's crackin'?",
          "What it do?",
          "Peep this -",
          "Talk to me,",
        ],
        neutral: ["Peep game,", "Real talk,", "Check it,", "Yo,", "Aye,"],
      }),
      closers: Object.freeze([
        "ya dig?",
        "you feel me?",
        "fo' shizzle.",
        "na'mean?",
        "ya heard?",
        "chuuch.",
        "bow wow.",
      ]),
      fillers: freezeRules([
        { pattern: /\byou\s+know\b/gi, replacement: "ya know" },
        { pattern: /\bkind\s+of\b/gi, replacement: "kinda" },
        { pattern: /\bsort\s+of\b/gi, replacement: "kinda" },
        { pattern: /\bon\s+the\s+real\b/gi, replacement: "real talk" },
      ]),
    }),
    cadence: Object.freeze({
      emphasisWords: Object.freeze([
        "smooth",
        "fly",
        "tight",
        "dope",
        "clean",
        "big",
        "fresh",
        "cool",
        "great",
        "easy",
      ]),
      commaLeadIns: Object.freeze([
        "Yo",
        "Aye",
        "Check it",
        "Peep game",
        "Real talk",
        "On the real",
        "Talk to me",
      ]),
    }),
    addressTerms: Object.freeze([
      "baby",
      "nephew",
      "cuz",
      "player",
      "dogg",
      "loc",
      "homie",
    ]),
    countryReplacements: freezeRules([
      { pattern: /North\s+Korea/gi, replacement: "Uptown Korea" },
      { pattern: /South\s+Korea/gi, replacement: "Downtown Korea" },
    ]),
    thirdPersonTitles: Object.freeze([
      "The Dogg",
      "Big Snoop",
      "Tha Doggfather",
      "Uncle Snoop",
    ]),
  });

  translator.snoopLexiconData = lexiconData;

  if (typeof module === "object" && module.exports) {
    module.exports = lexiconData;
  }
})();
