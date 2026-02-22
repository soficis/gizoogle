(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const domain = gizoogle.domain || (gizoogle.domain = {});
  const translator = domain.translator || (domain.translator = {});

  const levelTwoSubstitutions = Object.freeze([
    Object.freeze({ pattern: /\bgirlfriend\b/gi, replacement: "shawty" }),
    Object.freeze({ pattern: /\bboyfriend\b/gi, replacement: "playa" }),
    Object.freeze({ pattern: /\bwoman\b/gi, replacement: "queen" }),
    Object.freeze({ pattern: /\bwomen\b/gi, replacement: "queens" }),
    Object.freeze({ pattern: /\bguy\b/gi, replacement: "G" }),
    Object.freeze({ pattern: /\bguys\b/gi, replacement: "Gs" }),
    Object.freeze({ pattern: /\bteam\b/gi, replacement: "crew" }),
    Object.freeze({ pattern: /\bboss\b/gi, replacement: "big dogg" }),
    Object.freeze({ pattern: /\bleader\b/gi, replacement: "shot-calla" }),
    Object.freeze({ pattern: /\bkid\b/gi, replacement: "nephew" }),
    Object.freeze({ pattern: /\bkids\b/gi, replacement: "youngins" }),
    Object.freeze({ pattern: /\bwallet\b/gi, replacement: "paper stash" }),
    Object.freeze({ pattern: /\bpaycheck\b/gi, replacement: "scrilla" }),
    Object.freeze({ pattern: /\bsalary\b/gi, replacement: "paper stack" }),
    Object.freeze({ pattern: /\brich\b/gi, replacement: "stacked" }),
    Object.freeze({ pattern: /\bpoor\b/gi, replacement: "broke" }),
    Object.freeze({ pattern: /\bphone\b/gi, replacement: "line" }),
    Object.freeze({ pattern: /\blaptop\b/gi, replacement: "rig" }),
    Object.freeze({ pattern: /\bcomputer\b/gi, replacement: "rig" }),
    Object.freeze({ pattern: /\bapp\b/gi, replacement: "joint" }),
    Object.freeze({ pattern: /\bwebsite\b/gi, replacement: "spot" }),
    Object.freeze({ pattern: /\bleave\b/gi, replacement: "bounce" }),
    Object.freeze({ pattern: /\bleaving\b/gi, replacement: "bouncin'" }),
    Object.freeze({ pattern: /\barrive\b/gi, replacement: "pull up" }),
    Object.freeze({ pattern: /\barriving\b/gi, replacement: "pullin' up" }),
    Object.freeze({ pattern: /\blook\b/gi, replacement: "peep" }),
    Object.freeze({ pattern: /\blooking\b/gi, replacement: "peepin'" }),
    Object.freeze({ pattern: /\bsee\b/gi, replacement: "peep" }),
    Object.freeze({ pattern: /\bwork\b/gi, replacement: "grind" }),
    Object.freeze({ pattern: /\bworking\b/gi, replacement: "grindin'" }),
    Object.freeze({ pattern: /\bhurry\b/gi, replacement: "ease up" }),
    Object.freeze({ pattern: /\bwait\b/gi, replacement: "hold tight" }),
    Object.freeze({ pattern: /\bstart\b/gi, replacement: "kick off" }),
    Object.freeze({ pattern: /\bstop\b/gi, replacement: "pump brakes" }),
    Object.freeze({ pattern: /\bfinish\b/gi, replacement: "wrap it up" }),
    Object.freeze({ pattern: /\bwin\b/gi, replacement: "come up" }),
    Object.freeze({ pattern: /\bwinning\b/gi, replacement: "comin' up" }),
    Object.freeze({ pattern: /\bgreat\b/gi, replacement: "dope" }),
    Object.freeze({ pattern: /\bawesome\b/gi, replacement: "fly" }),
    Object.freeze({ pattern: /\bnice\b/gi, replacement: "clean" }),
    Object.freeze({ pattern: /\bdifficult\b/gi, replacement: "rough" }),
    Object.freeze({ pattern: /\beasy\b/gi, replacement: "smooth" }),
    Object.freeze({ pattern: /\bpolice\b/gi, replacement: "five-oh" }),
    Object.freeze({ pattern: /\bcops\b/gi, replacement: "po-po" }),
    Object.freeze({ pattern: /\bparty\b/gi, replacement: "function" }),
    Object.freeze({ pattern: /\bmusic\b/gi, replacement: "beats" }),
    Object.freeze({ pattern: /\bsong\b/gi, replacement: "jam" }),
    Object.freeze({ pattern: /\bmarijuana\b/gi, replacement: "sticky icky" }),
    Object.freeze({ pattern: /\bcannabis\b/gi, replacement: "indo" }),
    Object.freeze({ pattern: /\bsmoke\b/gi, replacement: "blaze" }),
    Object.freeze({ pattern: /\bfood\b/gi, replacement: "munchies" }),
    Object.freeze({ pattern: /\beating\b/gi, replacement: "munchin'" }),
    Object.freeze({ pattern: /\bbeer\b/gi, replacement: "brew" }),
    Object.freeze({ pattern: /\bliquor\b/gi, replacement: "juice" }),
    Object.freeze({ pattern: /\bneighborhood\b/gi, replacement: "turf" }),
    Object.freeze({ pattern: /\bcity\b/gi, replacement: "town" }),
    Object.freeze({ pattern: /\bunderstand\b/gi, replacement: "peep game" }),
    Object.freeze({ pattern: /\bthink\b/gi, replacement: "vibe on" })
  ]);

  translator.snoopLexiconLevel2 = levelTwoSubstitutions;

  if (typeof module === "object" && module.exports) {
    module.exports = levelTwoSubstitutions;
  }
})();
