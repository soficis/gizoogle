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

  function freezeQuoteCategory(category) {
    return Object.freeze({
      keywords: category.keywords,
      quotes: Object.freeze(category.quotes),
    });
  }

  const styleData = Object.freeze({
    geographicInjection: Object.freeze({
      triggerKeywords:
        /\b(visit|fly|drive|trip|tour|travel|commute|cruise|city|neighborhood|district|coast|county|street|avenue|town|suburb)\b/i,
      references: Object.freeze([
        "LBC",
        "Long Beach",
        "West Coast",
        "the 213",
        "the coast",
        "the block",
        "Eastside",
        "the 562",
      ]),
      prefixTemplates: Object.freeze([
        "Straight outta {{reference}},",
        "From {{reference}},",
        "Representin' {{reference}},",
      ]),
      suffixTemplates: Object.freeze([
        ", all da way from {{reference}}.",
        ", {{reference}} style.",
        ", {{reference}} represent.",
      ]),
    }),
    carCulture: Object.freeze({
      level2: freezeRules([
        { pattern: /\bvehicle\b/gi, replacement: "Lex" },
        { pattern: /\bvehicles\b/gi, replacement: "Lexes" },
      ]),
      level3: freezeRules([
        { pattern: /\b(?:ride|rizzle)\b/gi, replacement: "low-low" },
        { pattern: /\b(?:rides|rizzles)\b/gi, replacement: "low-lows" },
      ]),
    }),
    melodicChant: Object.freeze({
      triggerKeywords:
        /\b(music|mizzle|song|songs|jam|jams|beat|beats|vibe|vibes|party|kickback|function|dance|groove)\b/i,
      phrases: Object.freeze([
        "Da-da-da-da-dah,",
        "La-da-da-da-dah,",
      ]),
    }),
    quoteBank: Object.freeze({
      motivation: freezeQuoteCategory({
        keywords:
          /\b(grind|hustle|goal|ambition|dream|effort|strive|hard\s+work)\b/i,
        quotes: Object.freeze([
          "The game is to be sold, not to be told.",
          "If it's flipping hamburgers at McDonald's, be the best hamburger flipper in the world.",
        ]),
      }),
      success: freezeQuoteCategory({
        keywords:
          /\b(win|success|achievement|accomplish|victory|crush\s+it|nailed\s+it)\b/i,
        quotes: Object.freeze([
          "I want to thank me for believing in me.",
          "You've got to pay the cost to be the boss.",
        ]),
      }),
      chill: freezeQuoteCategory({
        keywords: /\b(relax|calm|vibe|weekend|vacation|rest|peace)\b/i,
        quotes: Object.freeze(["Just chill, 'til the next episode."]),
      }),
      authenticity: freezeQuoteCategory({
        keywords: /\b(real|truth|respect|genuine|honest|keep\s+it\s+real)\b/i,
        quotes: Object.freeze([
          "Real recognize real, fake recognize fake.",
          "You don't get respect if you don't deserve it.",
        ]),
      }),
      financial: freezeQuoteCategory({
        keywords: /\b(money|revenue|profit|business|income|salary|invest)\b/i,
        quotes: Object.freeze(["My mind on my money and my money on my mind."]),
      }),
      humor: freezeQuoteCategory({
        keywords: /\b(funny|laugh|joke|comedy|hilarious)\b/i,
        quotes: Object.freeze([
          "When I'm no longer rapping, I want to open up an ice cream parlor and call myself Scoop Dogg.",
        ]),
      }),
    }),
  });

  translator.snoopLexiconStyleData = styleData;

  if (typeof module === "object" && module.exports) {
    module.exports = styleData;
  }
})();
