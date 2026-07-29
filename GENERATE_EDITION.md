# Generating the next edition

Operating procedure for producing a new fortnightly edition.

**How to run it**

1. Open the last edition in `data.json` and note its `number`, `id` and `end_date`.
2. Open a **fresh chat with live web search enabled**. Without search the model cannot verify anything and will invent sources — that is the expected outcome, not a marginal risk. Don't reuse an old chat; the prompt is self-contained and prior context contaminates the run.
3. Fill in the four lines at the top of the prompt below, then paste the whole thing.
4. The model returns a paste-ready JSON block and a checklist.
5. **Do the human pass** — open every URL, read every date off the article page itself, and confirm every claim in every summary appears in its cited source.
6. Paste into `data.json`, validate the JSON, commit.

Expect to cut items during step 5. That is the procedure working, not failing.

---

```
RUN CONTEXT — fill these in before sending

Today's date:
Last edition number:
Last edition id:
Last edition end_date:

---

You are producing one edition of a fortnightly intelligence briefing. Read all
of these instructions before starting, then use live web search throughout.
Do not rely on training data for any factual claim.

If any of the four run-context lines above is blank, ask for it rather than
guessing.

## The publication

"Mobility Intelligence Brief" is a fortnightly briefing for the corporate
strategy team and senior leadership of an automotive distributor operating
across the Middle East and Europe.

The company distributes vehicles under agreements with manufacturers —
historically Japanese, increasingly Chinese — into markets where it holds
distribution rights. It does not manufacture. Its economics turn on which
brands it represents, which markets it can import into, what regulation
permits, how it retails, and what competitors are doing to its channel.

Screen and write for that business specifically, not for automotive news
generally. The facts are available anywhere; the implication for a distributor
is the product.

## Step 1 — derive the window, and state it before searching

Editions are contiguous Monday-to-Sunday fortnights with no gaps or overlaps.

- start_date = last edition's end_date + 1 day
- end_date = start_date + 13 days
- published_date = end_date + 1 day
- number = last edition number + 1
- id = "ed-" + number zero-padded to three digits
- Item ids = "eN-01", "eN-02" ... where N is the number
- label = pre-formatted exactly like "27 Jul '26 – 9 Aug '26" — three-letter
  month, no leading zero on the day, two-digit year after an apostrophe,
  spaced en dash. The app never formats dates, so this string must be right.

**If end_date has not fully passed as of today's date, stop.** Say the current
fortnight is still open, give the date it closes, and produce nothing.

State the derived window and edition number before you begin searching.

## Step 2 — the schema

Every field below is required. This example shows the shape; do not reuse
the content.

{
  "id": "ed-004",
  "number": 4,
  "start_date": "2026-07-27",
  "end_date": "2026-08-09",
  "published_date": "2026-08-10",
  "label": "27 Jul '26 – 9 Aug '26",
  "editor_note": "Two or three sentences: the through-line of the fortnight, then any coverage gap named explicitly.",
  "items": [
    {
      "id": "e4-01",
      "headline": "Sentence case, 90 characters or fewer, no trailing full stop",
      "summary": "25-45 words. What happened, neutral register, no interpretation. Every factual claim here must appear in the cited source.",
      "initial_view": "20-35 words on the implication for this distributor. Hedged - 'looks due for', 'would need', 'appears to' - never directive. A first read to open discussion, not a recommendation.",
      "is_top": true,
      "top_rank": 1,
      "area": "regulation_trade",
      "markets": ["EU", "CN"],
      "brands": ["BYD"],
      "impact": "high",
      "source_name": "Reuters",
      "source_url": "https://example.com/real-article-that-resolves",
      "source_date": "2026-08-04",
      "seed_action": "escalate"
    }
  ]
}

Notes on the fields that carry constraints:
- top_rank: integer 1-5 when is_top is true, otherwise null. Sequential, no
  gaps.
- area: exactly one slug from the five below. One primary area per item — do
  not hedge across two.
- markets: one or more codes from the list below.
- brands: free text, may be []. Display metadata only, not filterable.
- impact: "high", "medium" or "low".
- source_date: ISO, and must fall inside the edition window.
- seed_action: one of the five action slugs, or null. Null shows as Unreviewed.

## Step 3 — controlled vocabularies

**Areas** (slug — name — what it governs)

regulation_trade — Regulation & Trade — Type approval and homologation,
emissions and safety rules, tariffs and duties, rules of origin, local-content
requirements, shipping and routing. Whether we can land, certify and legally
sell a unit, and at what cost.

product_powertrain — Product & Powertrain — Launches and facelifts, powertrain
mix, specification suitability for regional climate and fuel quality, recalls
and warranty exposure. What reaches our showrooms and what it displaces.

retail_aftersales — Retail & Aftersales — Agency and dealer contracts,
direct-to-consumer and online retail, showroom formats, used and certified
pre-owned, fleet, finance and insurance; and separately service networks,
parts logistics, warranty terms and the ownership annuity. How we sell, and
what we keep earning after the sale.

competition_brand — Competition & Brand Moves — Distribution agreements,
market entries and exits, competitor franchise wins, registrations and market
share, pricing and discounting, macro and consumer-credit conditions, grey and
parallel imports. The portfolio we can represent and the volume the market
gives us. Registration and market data belongs here despite the label.

charging_energy — Charging & Energy — Network build-out, grid capacity and
constraints, tariffs and incentives, fuel quality, observed EV adoption. An
operating precondition: an EV franchise is worth only what local infrastructure
supports.

**Jurisdictions — filterable**

MENA: SA Saudi Arabia, AE United Arab Emirates, KW Kuwait, QA Qatar, OM Oman,
BH Bahrain, TR Türkiye, EG Egypt, MA Morocco, DZ Algeria, JO Jordan,
LB Lebanon

Europe: GB United Kingdom, DE Germany, FR France, IT Italy, ES Spain,
PL Poland, NL Netherlands, NO Norway, DK Denmark, BE Belgium, MT Malta

Regional: EU European Union, GCC Gulf Cooperation Council, UNECE UNECE,
GLOBAL Global

**Jurisdictions — context tags only, not filterable**

CN China, JP Japan, KR South Korea

These are where manufacturer decisions are made, not markets the company
distributes into. Use them where a home-market decision is the story, but
never as the only code on an item.

Supranational items are frequently the most consequential, which is why EU,
GCC and UNECE are first-class codes rather than being forced into a country
field. Use them.

**Actions**

unreviewed — the default
no_action — logged, explicitly not material
monitor — re-check next cycle
deep_dive — assign analytical work
escalate — above the strategy team's authority

**Impact**

high — Changes a decision we would otherwise take, or moves volume or gross
profit in a market we sell in, within 12 months. Rare by design.
medium — Informs planning or revises our read of a market, but forces no
decision this cycle. Registration data and directional policy signals normally
sit here.
low — Context. Logged for the record.

Impact and action must agree. A high-impact item cannot carry "unreviewed" or
"no_action" — if nothing is being done about it, it is not high impact.
Equally, do not mark something high because it is interesting or prominent in
the news. Retrospective analysis of a regime already in force is medium.

## Step 4 — what gets in

Three gates, all must pass:

1. **Lever test.** Does it change one of: brands we can carry, markets we can
   sell into, what we are permitted to sell, how we retail or at what margin,
   aftersales annuity, or market volume?
2. **Actionability test.** Could a named function inside the company
   plausibly do something differently in the next 12 months because of it?
3. **Verifiability test.** Real URL that resolves, named publication, date
   inside the window.

Any failure means cut. Do not soften the item, widen the window, or substitute
a weaker source. Where two items say the same thing, keep the one nearer the
company's own markets.

**Automatic exclusions.** Concept cars and motor-show reveals. Motorsport.
Autonomous-driving research with no near-term commercial path. US-only news
unless it moves a brand the company represents. Earnings with no strategic
content. Vendor market-research listings (Ken Research, Mordor, TechSci and
similar). Marketplace and dealer-platform SEO blogs. Aggregator rewrites where
the original is reachable — cite the original.

## Step 5 — where to look

**Europe and global.** European Commission press corner and Official Journal —
cite the Commission over any report of it. ACEA for EU/EFTA/UK registrations
by market and powertrain. SMMT (UK), KBA (Germany). UNECE WP.29 for vehicle
regulation and type approval. Reuters. Automotive News Europe. Automotive
Management (am-online). Fleet News. Just Auto. Autovista24 for pricing and
residuals. Electrive for charging and EV policy. Transport & Environment for
EU transport policy analysis. S&P Global Mobility. Automotive Logistics for
shipping, RoRo capacity and ports. OEM newsrooms: Toyota, BYD, Geely, Chery,
GWM, Changan.

**Gulf and MENA — general search reaches these poorly, so visit them
directly.** SPA and WAM for official and regulatory announcements. SASO and
GSO for Saudi and GCC standards — the primary source for homologation items
and rarely used by anyone. Argaam for Saudi financial news, Zawya for wider
Gulf business. The National, Gulf News, Khaleej Times, Arab News, Saudi
Gazette, AGBI. Distributor and OEM newsrooms, where competitor franchise news
usually breaks first: Abdul Latif Jameel and Jameel Motors, Al-Futtaim,
Mohamed Yousuf Naghi Motors, AW Rostamani, Juffali, Ali Alghanim.

One learned lesson: for this company's Middle East exposure the operative
coverage often sits in shipping, logistics and marine-insurance trade press
rather than car media. Search there too.

**Two standing cautions.** Gulf vehicle registration and volume data is not
published the way ACEA publishes Europe's — never state a Gulf volume or share
figure without attributing it to a named report. And Gulf press routinely
reports memoranda and framework agreements in language that reads like
completed deals; if the source says memorandum, intent or exploring, the
summary must say so too.

## Step 6 — verification, non-negotiable

- Every source_url must be a URL you actually retrieved in this session and
  that resolves. Never construct a plausible-looking URL.
- Read the date off the article page, not a listing or index page. Some sites
  render today's date into archived pages, making old articles look current.
  If the two disagree, trust the article page; if you cannot resolve it, drop
  the item and say so.
- Every claim in a summary must be present in the cited source. Do not carry a
  fact across from a different article, and do not add a detail that would
  reasonably follow but is not stated. This is the most common failure mode and
  it has happened on this publication before.
- If a search returns nothing for a category, market or theme, say it returned
  nothing. Do not fill the gap with something weaker.

## Step 7 — volume

Target 7-10 items, minimum 5. Mark 3-5 as top items, ranked. Leave one or two
items with seed_action null so the Unreviewed default is visible.

If fewer than 5 pass all three gates, output what passed and say so. A short
honest edition is correct; a padded one is not.

## Step 8 — output format

Produce exactly three parts, in this order.

**Part 1 — Window.** The derived edition number, window and label. State this
before searching, not after.

**Part 2 — Paste-ready JSON.** A single fenced code block containing a leading
comma, then the complete edition object, indented to sit inside the "editions"
array. Nothing else in the block — no comments, no ellipses, no placeholders.
Like this:

,
{
  "id": "...",
  ...
}

**Part 3 — Handover.** Under a heading "What to do next", give:
(a) a numbered checklist naming the actual edition number and item count —
    verify the N URLs, confirm dates on the article pages, paste after the
    closing brace of edition N-1, validate the JSON, commit, hard-refresh;
(b) a list of every URL with its stated date, as a verification worksheet;
(c) anything you could not verify, could not date, or deliberately excluded,
    and why.

## Finally

This output is a draft for human verification, not publishable copy. A human
will open every URL, confirm every date, and check every claim against its
source before anything is committed. Write accordingly: prefer fewer items you
are confident in, surface uncertainty in Part 3 rather than smoothing it into
the text, and never present an inference in the register of a fact.
```
