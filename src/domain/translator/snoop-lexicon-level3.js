(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const levelThreeSubstitutions = Object.freeze([
    Object.freeze({ pattern: /\bfor\s+sure\b/gi, replacement: "fo shizzle" }),
    Object.freeze({ pattern: /\breally\b/gi, replacement: "fa rizzle" }),
    Object.freeze({ pattern: /\bmy\s+homie\b/gi, replacement: "my nizzle" }),
    Object.freeze({ pattern: /\bcrib\b/gi, replacement: "hizzle" }),
    Object.freeze({ pattern: /\bvery\b/gi, replacement: "hella" }),
    Object.freeze({ pattern: /\beveryone\b/gi, replacement: "errybody" }),
    Object.freeze({ pattern: /\beverybody\b/gi, replacement: "errybody" }),
    Object.freeze({ pattern: /\blittle\b/gi, replacement: "lil'" }),
    Object.freeze({ pattern: /\bgoing\s+to\b/gi, replacement: "finna" }),
    Object.freeze({ pattern: /\bgonna\b/gi, replacement: "finna" }),
    Object.freeze({ pattern: /\bare\s+not\b/gi, replacement: "ain't" }),
    Object.freeze({ pattern: /\bis\s+not\b/gi, replacement: "ain't" }),
    Object.freeze({ pattern: /\bdo\s+not\b/gi, replacement: "don't" }),
    Object.freeze({ pattern: /\bcannot\b/gi, replacement: "cain't" }),
    Object.freeze({ pattern: /\bnever\b/gi, replacement: "neva" }),
    Object.freeze({ pattern: /\balways\b/gi, replacement: "all day" }),
    Object.freeze({ pattern: /\bokay\b/gi, replacement: "aight" }),
    Object.freeze({ pattern: /\ball\s+right\b/gi, replacement: "aight" }),
    Object.freeze({ pattern: /\bthing\b/gi, replacement: "thang" }),
    Object.freeze({ pattern: /\bthings\b/gi, replacement: "thangs" }),
    Object.freeze({ pattern: /\bstyle\b/gi, replacement: "steez" }),
    Object.freeze({ pattern: /\bold\b/gi, replacement: "OG" }),
    Object.freeze({ pattern: /\byes\b/gi, replacement: "fa sho" }),
    Object.freeze({ pattern: /\bmaybe\b/gi, replacement: "might could" }),
    Object.freeze({ pattern: /\bwatch\s+out\b/gi, replacement: "peep game" }),
    Object.freeze({ pattern: /\bbecause\b/gi, replacement: "'cause" }),
    Object.freeze({ pattern: /\bthem\b/gi, replacement: "dem" }),
    Object.freeze({ pattern: /\bthose\b/gi, replacement: "doze" }),
    Object.freeze({ pattern: /\byour\b/gi, replacement: "yo" }),
    Object.freeze({ pattern: /\byou\b/gi, replacement: "ya" }),
    Object.freeze({ pattern: /\band\b/gi, replacement: "an'" }),
    Object.freeze({ pattern: /\bto\b/gi, replacement: "ta" }),
    Object.freeze({ pattern: /\bof\b/gi, replacement: "o'" }),
    Object.freeze({ pattern: /\bover\b/gi, replacement: "ova" }),
    Object.freeze({ pattern: /\bbefore\b/gi, replacement: "befo'" }),
    Object.freeze({ pattern: /\baround\b/gi, replacement: "round" }),
    Object.freeze({ pattern: /\binto\b/gi, replacement: "inta" }),
    Object.freeze({ pattern: /\bbetter\b/gi, replacement: "betta" })
  ]);

  translator.snoopLexiconLevel3 = levelThreeSubstitutions;

  if (typeof module === "object" && module.exports) {
    module.exports = levelThreeSubstitutions;
  }
})();
