(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

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

  function freezeVerbMap(verbMap) {
    return Object.freeze({ ...verbMap });
  }

  const izzleAaveData = Object.freeze({
    izzleFixedFormsLevel2: freezeRules([
      {
        pattern: /\bfor\s+sure,?\s+my\s+(?:friend|homie)\b/gi,
        replacement: "fo shizzle, my nizzle",
      },
      { pattern: /\bfor\s+sure\b/gi, replacement: "fo shizzle" },
      { pattern: /\bmy\s+(?:friends|homies)\b/gi, replacement: "my nizzles" },
      { pattern: /\bmy\s+(?:friend|homie)\b/gi, replacement: "my nizzle" },
      {
        pattern: /\bin\s+(?:the|da)\s+(?:house|crib)\b/gi,
        replacement: "in da hizzle",
      },
      {
        pattern: /\bat\s+(?:the|da)\s+(?:house|crib)\b/gi,
        replacement: "at da hizzle",
      },
      {
        pattern: /\boff\s+(?:the|da)\s+hook\b/gi,
        replacement: "off da hizzle",
      },
      { pattern: /\bfor\s+real\b/gi, replacement: "fa rizzle" },
      {
        pattern: /\b(?:the|da)\s+(?:house|crib)\b/gi,
        replacement: "da hizzle",
      },
    ]),
    izzleFixedFormsLevel3: freezeRules([
      { pattern: /\b(?:this|dis)\s+place\b/gi, replacement: "dis bizzle" },
      {
        pattern: /\b(?:this|dis)\s+(?:thing|thang)\b/gi,
        replacement: "dis dizzle",
      },
      {
        pattern: /\bfor\s+sure\s+indeed\b/gi,
        replacement: "fo shizzle dizzle",
      },
    ]),
    aaveRules: Object.freeze({
      zeroCopula: freezeRules([
        {
          pattern:
            /\b(he|she|it)\s+is\s+(?=[a-z]+(?:ing|in')(?:\b|\s|[.,!?]))/gi,
          replacement: "$1 ",
        },
        {
          pattern:
            /\b(they|dey|we|you)\s+are\s+(?=[a-z]+(?:ing|in')(?:\b|\s|[.,!?]))/gi,
          replacement: "$1 ",
        },
        {
          pattern:
            /\b(he|she|it)\s+is\s+(ready|cool|smooth|tight|fly|dope|real|crazy|wild|hot|cold|big|bad|good|right|wrong|sick|tired|late|early|fast|slow)\b/gi,
          replacement: "$1 $2",
        },
        {
          pattern:
            /\b(they|dey|we|you)\s+are\s+(ready|cool|smooth|tight|fly|dope|real|crazy|wild|hot|cold|big|bad|good|right|wrong|sick|tired|late|early|fast|slow)\b/gi,
          replacement: "$1 $2",
        },
      ]),
      thirdPersonSingular: Object.freeze({
        verbMap: freezeVerbMap({
          goes: "go",
          runs: "run",
          walks: "walk",
          talks: "talk",
          comes: "come",
          makes: "make",
          takes: "take",
          gives: "give",
          gets: "get",
          says: "say",
          plays: "play",
          works: "work",
          looks: "look",
          seems: "seem",
          wants: "want",
          needs: "need",
          likes: "like",
          lives: "live",
          moves: "move",
          does: "do",
          knows: "know",
          thinks: "think",
          feels: "feel",
          keeps: "keep",
          brings: "bring",
          starts: "start",
          tells: "tell",
        }),
      }),
    }),
  });

  translator.snoopLexiconIzzleAaveData = izzleAaveData;

  if (typeof module === "object" && module.exports) {
    module.exports = izzleAaveData;
  }
})();
