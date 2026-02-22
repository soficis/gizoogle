<div align="center">
  
# 🌿 Gizoogle 🌿

### Tha Doggfather's Unofficial Page Translator — runnin' 100% local, no cap

What's good nephew — welcome to **Gizoogle**, tha one an' only browser extension dat takes whatever webpage you lookin' at an' flips every visible word into dat authentic, laid-back, West Coast Snoop Dogg flavor. Not some cheap knock-off neither — we talkin' real phonological transforms, genuine -izzle morphology, data-driven vocabulary from tha man's own linguistic fingerprint. Dis ain't yo average find-an'-replace, dis is computational sociolinguistics, baby.

An' check it — everything runs **right in yo browser**. No cloud calls, no uploads, no phomin' home ta nobody. Yo data stays on yo machine, period. Chuuch.

</div>

---

## 🏎️ Quick Start — How Ta Get Dis Runnin'

Works on **Chrome, Edge, Brave**, or any Chromium-based browser. Keepin' it simple, nephew:

### 1. Grab Da Code

Download da [latest ZIP release](https://github.com/soficis/gizoogle/archive/refs/heads/main.zip) an' extract dat folder somewhere safe.

_(Developers: `git clone https://github.com/soficis/gizoogle.git` then `npm install`. If you wanna run da dev scripts, grab [`datasets.json`](https://huggingface.co/datasets/huggingartists/snoop-dogg/resolve/main/datasets.json) from HuggingFace an' drop it in da root — it ain't included in Git 'cause it's 4.5MB of raw Snoop linguistics.)_

### 2. Load It Up

1. Open yo browser extensions page (`chrome://extensions/` or `edge://extensions/`).
2. Flip on **Developer mode** (toggle in da top corner).
3. Hit **"Load unpacked"**.
4. Point it at da `gizoogle` folder you just extracted.
5. Boom — **Gizoogle** shows up in yo extensions list. We in there.

### 3. Activate Da Vibes

Click dat Gizoogle icon in yo toolbar, check **Enabled**, slide dat **Snoopiness** dial ta yo level, an' peep da page transform right before yo eyes. Ya dig?

---

## 🎛️ Snoopiness Levels

| Level | Name           | What It Do                                                                                                                                                                                                                                                                                                                                                                                   |
| ----- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Chill**      | Light touch — phonological transforms only. `-ing` → `-in'`, `the` → `da`, dropped finals, dat kinda smooth. Ya grandma could still read it.                                                                                                                                                                                                                                                 |
| **2** | **G-Funk**     | Now we cookin'. Full lexical substitutions (friend → homie, money → paper, car → ride), izzle fixed forms (for sure → fo shizzle), discourse markers, mode-aware openers. Dis is da standard Snoop flavor.                                                                                                                                                                                   |
| **3** | **Doggfather** | Full immersion. Dynamic -izzle morphology, AAVE grammar restructuring, car culture vocabulary (ride → low-low, vehicle → Lex), LBC/West Coast geographic identity tags, melodic chant vocalizations, cadence transforms wit' emphasis elongation + em-dash fragmentation, direct address terms, rotatin' signature tags, authenticated quote injection, and West Coast orthography (`-cks` → `-cc`, terminal voiced `-s` → `-z`). If Big Snoop was a browser extension, dis is what he'd sound like, ya heard? |

---

## ⚙️ What It Do

- **Translates visible page text** — every readable word on da page gets run through tha 14-stage Snoop pipeline. Smooth like a Cadillac, baby.
- **Keeps up wit' dynamic pages** — new content loads? We catch dat. MutationObserver stays watchin', rescannin' changed subtrees on da fly.
- **Skips what shouldn't be touched** — `<code>`, `<pre>`, form fields, editable text, `<script>`, `<svg>` — all dat technical stuff passes through clean.
- **Preserves URLs an' emails** — links an' email addresses come out untouched, fa rizzle.

---

## 🧠 Architecture & How It Works Under Da Hood

Follows a **functional-core / imperative-shell** architecture. All translation logic is **pure** — no browser APIs in da domain layer, no side effects, no surprises.

Da translator runs a **data-driven, 14-stage pipeline** powered by a frozen lexicon extracted from real Snoop Dogg linguistics:

```text
Input Text
  → Phonological Rules      (-ing → -in', th- → d-, -er → -a, -cks → -cc)
  → AAVE Restructuring      (zero copula + 3PS omission with deterministic variation)
  → Core Substitutions      (friend → homie, money → paper, house → crib)
  → Izzle Morphology        (for sure → fo shizzle, dynamic -izzle at level 3)
  → Level Substitutions     (level 2+3 vocabulary stacks, 80+ swaps)
  → Car Culture Vocabulary  (ride → low-low, vehicle → Lex)
  → Terminal S Orthography  (dogs → dogz, plans → planz)
  → Geographic Flavor       (LBC/West Coast identity injection on location text)
  → Discourse Markers       (fillers: ya know, kinda | third-person: Tha Doggfather)
  → Mode Prefix             (warning → "Hold up hold up hold up!", success → "That's what's up!")
  → Melodic Chant           (Da-da-da-da-dah, injected on musical contexts)
  → Cadence Transforms      (emphasis elongation, em-dash fragmentation, address terms, comma cadence)
  → Signature Tags          (rotating closers: "ya dig?", "you feel me?", "chuuch.")
  → Quote Injection         (authenticated Snoop quotes mapped by intent)
Output Text
```

Every stage is a **pure function**. Every output is **deterministic** — same input + same level = same output, every time. No `Math.random()`, jus' hash-based selection. Tests love it, you'll love it.

### Code Layers

| Layer                    | What Lives There                                                        |
| ------------------------ | ----------------------------------------------------------------------- |
| `src/domain/translator/` | Pure translation logic, lexicon data, pipeline. Zero browser API usage. |
| `src/app/`               | Use-case orchestration, settings service, error reporting.              |
| `src/adapters/`          | Browser integration — `chrome.storage`, tab messaging, DOM traversals.  |
| `src/content-script/`    | Runtime shell fo' da page translation lifecycle.                        |
| `src/ui/popup/`          | Popup presentation an' controller logic.                                |
| `src/shared/`            | Shared contracts — constants, validation, error codes.                  |

### Quality Gates

```bash
npm run check      # syntax validation + policy checks (no TODOs, no legacy files)
npm run test       # 43 tests (unit + integration) + smoke test
npm run build      # manifest + popup runtime validation
npm run benchmark  # optional performance check
```

---

## 📁 Documentation

All project documentation lives in da `docs/` folder:

| File                                                                                          | What It Covers                                            |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [quality-gates.md](docs/quality-gates.md)                                                     | How ta run check, test, build commands                    |
| [architecture.md](docs/architecture.md)                                                       | Translator architecture and current pipeline stages       |
| [codex_roadmap.md](docs/codex_roadmap.md)                                                     | v0.5.0 implementation roadmap for Phases 9–14             |
| [snoop_model.md](docs/snoop_model.md)                                                         | Implementation research and feasibility notes             |
| [claude_roadmap_v0.4.0.md](docs/archive/claude_roadmap_v0.4.0.md)                             | Archived v0.4.0 roadmap and completion audit              |
| [Snoop Dogg Voice Translator Upgrade.md](docs/Snoop%20Dogg%20Voice%20Translator%20Upgrade.md) | Computational sociolinguistic framework fo' da translator |
| [codex_agents.md](docs/codex_agents.md)                                                       | Coding standards an' agent guidelines                     |
| [snoop.md](docs/snoop.md)                                                                     | Curated Snoop Dogg quotes an' reference material          |
| [COMMIT_MESSAGE.md](docs/COMMIT_MESSAGE.md)                                                   | Latest commit message fo' da current release              |

---

## ⚖️ License & FOSS Philosophizing (GPLv3)

Dis project is licensed under da **GNU General Public License v3.0**.

Now listen close, 'cause Big Snoop gotta drop some knowledge on ya 'bout **Free Software**. We ain't jus' talkin' 'bout free like free beer — we talkin' 'bout free like **Freedom**, ya dig? Free as in speech. Free as in you got da right ta run dis code, study dis code, change dis code, an' share dis code wit' yo homies. Dat's what FOSS is all about.

When you lock code down in a proprietary cage, you stiflin' da community. But when you put it out under da GPL, you guaranteein' dat da software stays free fo' everybody, fo'ever. You take dis code an' build somethin' dope wit' it? You gotta share dat new hotness back wit' da streets under da same rules. We keep da ecosystem open, we keep it collaborative, an' we keep it movin' forward together. Chuuch.

---

## 🙏 Shout-Outs & Gratitude

Big love an' maximum respect ta da real ones who made dis possible:

- **Richard Stallman (RMS)**: Da true OG of da Free Software movement. Without RMS layin' down da law wit' da GNU Project an' da GPL, we wouldn't have da open-source world we thrive in today. Man's a legend, straight up.
- **The Original Gizoogle Creator**: Respect ta da visionary who first looked at da internet an' said, "Dis needs more Snoop." You paved da way, homie.
- **Martha Stewart**: My main homegirl. Always keepin' it elegant, always keepin' it G. We see you cookin' up a storm, Martha. Whistle while you work!
- **Snoop D-O-Double-G**: Da inspiration, da muse, da undisputed King of da West Coast. Dis whole project is a tribute ta yo undeniable linguistic genius an' dat smooth, laid-back energy you bring ta everything you touch.

---

## ⚠️ Legal Disclaimer

**Please read carefully:** This browser extension is a fan-made parody project created for entertainment and educational purposes only.

This project, its creator, and its codebase have **absolutely zero affiliation, endorsement, sponsorship, or connection** with Calvin Broadus Jr. (Snoop Dogg), his management, his record labels, or the original creators of the "Gizoogle" website.

No infringement or harm is intended. The linguistics, stylistic choices, and translations are algorithmic parodies inspired by public personas. Use this extension responsibly and enjoy the vibes.

---

<div align="center">

> _"When I'm no longer rapping, I want to open up an ice cream parlor and call myself Scoop Dogg."_ — Snoop Dogg

**v0.5.0** · Made wit' love from da LBC 🏠

</div>
