# Generating the next edition

The operating procedure for producing a new fortnightly edition.

**How to use it.** Paste the prompt below into a fresh chat with live web search enabled. It will ask you two questions before it starts searching. Answer them, review the window it confirms, and let it run. It returns a paste-ready block for `data.json` plus a verification checklist.

**Two things that matter.** Use a fresh chat every time — the prompt is self-contained and prior context contaminates the run. And web search must be on; without it the model cannot verify anything and will invent sources, which is the expected outcome rather than a marginal risk.

**Expect to cut items during verification.** That is the procedure working, not failing.

---

```
You are producing one edition of a fortnightly intelligence briefing. Read all
of these instructions before doing anything. Use live web search throughout and
do not rely on training data for any factual claim.

═══════════════════════════════════════════════════════════════════════
STEP 1 — ASK BEFORE YOU START. Do not search yet.
═══════════════════════════════════════════════════════════════════════

Ask the user these two questions and wait for answers:

  1. What is today's date?
  2. Anything to prioritise or avoid this cycle — a market, a theme, a
     developing story from last edition? "Nothing particular" is a valid
     answer.

Do not guess the date. Your own sense of the current date is unreliable and
every date validation in this procedure depends on it.

Once you have the date, find it in the schedule below and identify the most
recent edition whose window has FULLY ENDED. If today falls inside a window,
that fortnight is not finished — produce the previous one.

  Edition  Window                        Published
  ─────────────────────────────────────────────────────
  4        Mon 27 Jul – Sun 9 Aug 2026   Mon 10 Aug 2026
  5        Mon 10 Aug – Sun 23 Aug 2026  Mon 24 Aug 2026
  6        Mon 24 Aug – Sun 6 Sep 2026   Mon 7 Sep 2026
  7        Mon 7 Sep – Sun 20 Sep 2026   Mon 21 Sep 2026
  8        Mon 21 Sep – Sun 4 Oct 2026   Mon 5 Oct 2026
  9        Mon 5 Oct – Sun 18 Oct 2026   Mon 19 Oct 2026
  10       Mon 19 Oct – Sun 1 Nov 2026   Mon 2 Nov 2026
  11       Mon 2 Nov – Sun 15 Nov 2026   Mon 16 Nov 2026
  12       Mon 16 Nov – Sun 29 Nov 2026  Mon 30 Nov 2026
  13       Mon 30 Nov – Sun 13 Dec 2026  Mon 14 Dec 2026
  14       Mon 14 Dec – Sun 27 Dec 2026  Mon 28 Dec 2026
  15       Mon 28 Dec 2026 – Sun 10 Jan  Mon 11 Jan 2027

If today is past 11 Jan 2027 the table has run out: continue the pattern in
14-day steps from Edition 15 and say that you have done so.

Then state, in one line, the edition number and window you will produce, and
begin.

═══════════════════════════════════════════════════════════════════════
STEP 2 — THE PUBLICATION
═══════════════════════════════════════════════════════════════════════

"Mobility Intelligence Brief" is a fortnightly briefing for the corporate
strategy team and senior leadership of an automotive distributor operating
across the Middle East and Europe.

The company distributes vehicles under agreements with manufacturers —
historically Japanese, increasingly Chinese — into markets where it holds
distribution rights. It does not manufacture. Its economics turn on which
brands it represents, which markets it can import into, what regulation
permits, how it retails, and what competitors are doing to its channel.

Screen and write for that business, not for automotive news generally. The
facts are available anywhere; the implication for a distributor is the product.

═══════════════════════════════════════════════════════════════════════
STEP 3 — WHAT QUALIFIES
═══════════════════════════════════════════════════════════════════════

Three gates. All must pass, or cut the item.

  1. LEVER — does it change one of: brands we can carry, markets we can sell
     into, what we are permitted to sell, how we retail or at what margin,
     aftersales annuity, or market volume?
  2. ACTIONABILITY — could a named function inside the company plausibly do
     something differently in the next 12 months because of it?
  3. VERIFIABILITY — real URL that resolves, named publication, date inside the
     edition window.

Do not soften a gate, widen the window, or substitute a weaker source. Where
two items say the same thing, keep the one nearer the company's own markets.

Automatically excluded: concept cars and motor-show reveals; motorsport;
autonomous-driving research with no near-term commercial path; US-only news
unless it moves a brand the company represents; earnings releases with no
strategic content; vendor market-research listings (Ken Research, Mordor,
TechSci and similar); marketplace and dealer-platform SEO blogs; aggregator
rewrites where the original publication is reachable.

═══════════════════════════════════════════════════════════════════════
STEP 4 — WHERE TO LOOK
═══════════════════════════════════════════════════════════════════════

EUROPE AND GLOBAL
  European Commission press corner and Official Journal — cite the Commission
  over any report of it. ACEA for EU/EFTA/UK registrations by market and
  powertrain. SMMT (UK), KBA (Germany). UNECE WP.29 for vehicle regulation and
  type approval. Reuters. Automotive News Europe. Automotive Management
  (am-online). Fleet News. Just Auto. Autovista24 for pricing and residuals.
  Electrive for charging and EV policy. Transport & Environment for EU
  transport policy analysis. S&P Global Mobility. Automotive Logistics for
  shipping, RoRo capacity and ports. OEM newsrooms: Toyota, BYD, Geely, Chery,
  GWM, Changan.

GULF AND MENA — general search reaches these poorly. Visit them directly.
  SPA (Saudi Press Agency) and WAM (Emirates News Agency) for official and
  regulatory announcements. SASO and GSO for Saudi and GCC standards — the
  primary source for homologation items and rarely used by anyone. Argaam for
  Saudi financial news. Zawya for wider Gulf business. The National, Gulf News,
  Khaleej Times, Arab News, Saudi Gazette, AGBI. Distributor and OEM newsrooms,
  where competitor franchise news usually breaks first: Abdul Latif Jameel and
  Jameel Motors, Al-Futtaim, Mohamed Yousuf Naghi Motors, AW Rostamani,
  Juffali, Ali Alghanim.

A learned lesson: for this company's Middle East exposure, the operative
coverage often sits in shipping, logistics and marine-insurance trade press
rather than car media. Search there too.

TWO STANDING CAUTIONS
  Gulf vehicle registration and volume data is not published the way ACEA
  publishes Europe's. Never state a Gulf volume or share figure without
  attributing it to a named report.

  Gulf press routinely reports memoranda and framework agreements in language
  that reads like completed deals. If the source says memorandum, intent, or
  exploring, the summary must say so too.

═══════════════════════════════════════════════════════════════════════
STEP 5 — VERIFICATION RULES
═══════════════════════════════════════════════════════════════════════

- Every source_url must be a URL you actually retrieved this session and that
  resolves. Never construct a plausible-looking URL.
- Read the date off the article page, not a listing or index page. Some sites
  render today's date into archived pages, making old articles look current. If
  the two disagree, trust the article page; if you cannot resolve it, drop the
  item and say so.
- Every claim in the summary must be present in the cited source. Do not carry
  a fact across from a different article, and do not add a detail that would
  reasonably follow but is not stated. This is the most common failure mode.
- Report a range as a range. Never present its upper bound as the figure.
- Never attribute a statement, advisory or position to an organisation unless
  the source says it did so.
- If a search returns nothing for a market, category or theme, say so. Do not
  fill the gap.

═══════════════════════════════════════════════════════════════════════
STEP 6 — SCHEMA
═══════════════════════════════════════════════════════════════════════

Edition object: id, number, start_date, end_date, published_date, label,
editor_note, items.

  id               "ed-0NN", three digits zero-padded. Edition 4 → "ed-004"
  number           integer
  start_date       ISO YYYY-MM-DD, from the schedule
  end_date         ISO YYYY-MM-DD, from the schedule
  published_date   ISO YYYY-MM-DD, from the schedule
  label            Exactly this style: "27 Jul '26 – 9 Aug '26"
                   Three-letter month, no leading zero on day, two-digit year
                   after an apostrophe, spaced en dash. The app never formats
                   dates, so this string must be right.
  editor_note      Two or three sentences (see Step 7)

Item object — exactly these fields:

  id             "eN-01" format, sequential, two digits. Permanent once shipped
  headline       ≤ 90 chars, sentence case, no trailing full stop
  summary        25–45 words. What happened, neutral register, no
                 interpretation. Every claim traceable to the cited source
  initial_view   20–35 words. The implication for this distributor. Hedged
                 register — "looks due for", "would need", "appears to" — not
                 directive. A first read to open discussion, not a
                 recommendation
  is_top         boolean
  top_rank       1–5 if is_top, else null. Sequential from 1, no gaps
  area           exactly one slug from Step 6a. One primary area — do not hedge
  markets        array, one or more codes from Step 6b
  brands         array of free text, may be []. Display only, not filterable
  impact         "high" | "medium" | "low"
  source_name    the publication, e.g. "Reuters"
  source_url     full https URL that resolves
  source_date    ISO YYYY-MM-DD, inside the edition window
  seed_action    one slug from Step 6c, or null (null shows as Unreviewed)

── 6a. AREAS ──

regulation_trade — Regulation & Trade
  Type approval and homologation, emissions and safety rules, tariffs and
  duties, rules of origin, local-content requirements, shipping and routing.
  Governs whether we can land, certify and legally sell a unit, and at what
  cost.

product_powertrain — Product & Powertrain
  Model launches and facelifts, powertrain mix, specification suitability for
  regional climate and fuel quality, recalls and warranty exposure. Governs
  what reaches our showrooms and what it displaces.

retail_aftersales — Retail & Aftersales
  Agency and dealer contracts, direct-to-consumer and online retail, showroom
  formats, used and certified pre-owned, fleet, finance and insurance — and
  separately service networks, parts logistics, warranty terms and the
  ownership-economics annuity. Governs how we sell and what we earn after.

competition_brand — Competition & Brand Moves
  Distribution agreements, market entries and exits, competitor franchise wins,
  registrations and market share, pricing and discounting, macro and
  consumer-credit conditions, grey and parallel imports. Governs the portfolio
  we can represent and the volume the market gives us. Registration and market
  data belongs here despite the label.

charging_energy — Charging & Energy
  Charging network build-out, grid capacity and constraints, tariffs and
  incentives, fuel quality, observed EV adoption. An operating precondition: an
  EV franchise is worth only what the local energy infrastructure supports.

── 6b. JURISDICTION CODES ──

FILTERABLE
  MENA:    SA Saudi Arabia · AE United Arab Emirates · KW Kuwait · QA Qatar
           OM Oman · BH Bahrain · TR Türkiye · EG Egypt · MA Morocco
           DZ Algeria · JO Jordan · LB Lebanon
  Europe:  GB United Kingdom · DE Germany · FR France · IT Italy · ES Spain
           PL Poland · NL Netherlands · NO Norway · DK Denmark · BE Belgium
           MT Malta
  Regional: EU European Union · GCC Gulf Cooperation Council · UNECE · GLOBAL

NOT FILTERABLE — source markets, context tags only
  CN China · JP Japan · KR South Korea
  Use where a manufacturer's home-market decision is the story, but never as
  the only code on an item.

Supranational items are often the most consequential, which is why EU, GCC and
UNECE are first-class codes rather than being forced into a country field.

── 6c. ACTIONS ──

  unreviewed  the default
  no_action   logged, explicitly not material
  monitor     re-check next cycle
  deep_dive   assign analytical work
  escalate    above the strategy team's authority

── 6d. IMPACT ──

  high    Changes a decision we would otherwise take, or moves volume or gross
          profit in a market we sell in, within 12 months. Rare by design.
  medium  Informs planning or revises our read of a market, but forces no
          decision this cycle. Registration data and directional policy
          signals normally sit here.
  low     Context. Logged for the record.

Impact and action must agree. A high-impact item cannot carry "unreviewed" or
"no_action" — if nothing is being done about it, it is not high impact. Do not
mark something high because it is interesting or prominent. Retrospective
analysis of a regime already in force is medium.

── 6e. VOLUME ──

Target 7–10 items, minimum 5. Mark 3–5 as top, ranked. Leave one or two with
seed_action null so the Unreviewed default is visible. If fewer than 5 pass all
three gates, output what passed and say so — a short honest edition is correct,
a padded one is not.

═══════════════════════════════════════════════════════════════════════
STEP 7 — EDITOR'S NOTE
═══════════════════════════════════════════════════════════════════════

Two or three sentences. Name the through-line of the fortnight, then name any
coverage gap explicitly — a region, category or theme that is thin or absent.
Do not conceal a gap. Stating it is what makes the rest credible.

═══════════════════════════════════════════════════════════════════════
STEP 8 — OUTPUT, IN THIS ORDER AND NOTHING ELSE
═══════════════════════════════════════════════════════════════════════

PART 1 — Paste-ready block

A fenced code block containing a leading comma, then the edition object,
indented to sit inside the editions array:

  ,
  {
    "id": "ed-004",
    ...
  }

The leading comma is deliberate. The user pastes this immediately after the
closing brace of the last existing edition and before the closing bracket of
the array, so the comma must be there.

PART 2 — Verification checklist

A numbered list, one row per item, each showing: item id · source name · the
URL · the date to confirm · and the single specific claim in that summary most
worth checking against the source. This is what the human pass works through,
so make it usable rather than decorative.

PART 3 — Flags

Anything you could not verify, any market or category that came back empty, any
judgement call you would want a human to review. If there is nothing, say so.

PART 4 — What to do next

Plain numbered instructions:
  1. Work through the verification checklist above; cut anything that fails
  2. Open data.json, find the closing brace of the last edition object, and
     paste Part 1 immediately after it
  3. Validate the JSON — one malformed comma blanks the whole site
  4. Commit, then hard-refresh the live URL and confirm the new edition appears
     in the selector and defaults to current

═══════════════════════════════════════════════════════════════════════
FINALLY
═══════════════════════════════════════════════════════════════════════

This output is a draft for human verification, not publishable copy. A human
will open every URL, confirm every date and check every claim before anything
is committed. Write accordingly: prefer fewer items you are confident in, flag
uncertainty in Part 3 rather than smoothing it into the text, and never present
an inference in the register of a fact.
```
