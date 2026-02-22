(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const levelOneSubstitutions = Object.freeze([
    Object.freeze({ pattern: /\bhello\b/gi, replacement: "yo" }),
    Object.freeze({ pattern: /\bhi\b/gi, replacement: "yo" }),
    Object.freeze({ pattern: /\bfriend\b/gi, replacement: "homie" }),
    Object.freeze({ pattern: /\bfriends\b/gi, replacement: "homies" }),
    Object.freeze({ pattern: /\bman\b/gi, replacement: "playa" }),
    Object.freeze({ pattern: /\bpeople\b/gi, replacement: "folks" }),
    Object.freeze({ pattern: /\bmoney\b/gi, replacement: "paper" }),
    Object.freeze({ pattern: /\bcash\b/gi, replacement: "paper" }),
    Object.freeze({ pattern: /\bcar\b/gi, replacement: "ride" }),
    Object.freeze({ pattern: /\bcars\b/gi, replacement: "rides" }),
    Object.freeze({ pattern: /\bhouse\b/gi, replacement: "crib" }),
    Object.freeze({ pattern: /\bhome\b/gi, replacement: "crib" }),
    Object.freeze({ pattern: /\bneighborhood\b/gi, replacement: "hood" }),
    Object.freeze({ pattern: /\bstreet\b/gi, replacement: "block" }),
    Object.freeze({ pattern: /\bcool\b/gi, replacement: "smooth" }),
    Object.freeze({ pattern: /\bgood\b/gi, replacement: "tight" }),
    Object.freeze({ pattern: /\brelax\b/gi, replacement: "chill" }),
    Object.freeze({ pattern: /\bparty\b/gi, replacement: "kickback" }),
    Object.freeze({ pattern: /\bdrink\b/gi, replacement: "sip" }),
    Object.freeze({ pattern: /\beat\b/gi, replacement: "munch" })
  ]);

  translator.snoopLexiconLevel1 = levelOneSubstitutions;

  if (typeof module === "object" && module.exports) {
    module.exports = levelOneSubstitutions;
  }
})();
