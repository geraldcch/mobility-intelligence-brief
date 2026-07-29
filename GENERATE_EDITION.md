# Generating the next edition

This is the operating procedure for producing a new fortnightly edition.

Copy the prompt below into a fresh chat with a model that has **live web search enabled**. Without search the model cannot verify anything and will invent sources; that is not a marginal risk, it is the expected outcome. Do not reuse an old chat, because the prompt is self-contained by design and prior context will contaminate the run.

The output is one JSON edition object. Append it to the `editions` array in `data.json`, at the end. Then do the human pass: open every URL, confirm every date on the article page itself, and check that each claim in each summary is actually present in its source. Validate the JSON before committing — a single malformed comma takes the whole site down.

Expect to cut items during the human pass. That is the procedure working.

---

```
You are producing one edition of a fortnightly intelligence briefing. Read all
of these instructions before starting, then use live web search throughout. Do
not rely on your training data for any factual claim.

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

## What to output

A single JSON object representing one edition, ready to append to the
"editions" array in data.json. Output only the JSON object, then a short plain
list of anything you were unable to verify. No preamble, no commentary inside
the JSON.

## Deriving the edition identity from today's date

Editions are contiguous Monday-to-Sunday fortnights. No gaps, no overlaps.

Anchor: Edition 3 ran Monday 13 July 2026 to Sunday 26 July 2026, published
Monday 27 July 2026.

Every subsequent edition starts 14 days after the previous one. So Edition N
starts on 2026-07-13 plus 14 x (N - 3) days, ends 13 days after it starts, and
is published the following day.

Work out which edition is due: take the most recent fortnight in that sequence
that has fully ended before today. If today is inside a fortnight, that
fortnight is not finished and you produce the previous one.

Then set:
- id: "ed-0NN" — three digits, zero padded. Edition 4 is "ed-004".
- number: the integer N.
- start_date, end_date, published_date: ISO YYYY-MM-DD.
- label: pre-formatted, exactly this style: "27 Jul '26 – 9 Aug '26". Three
  letter month, no leading zero on the day, two digit year after an apostrophe,
  spaced en dash. The app never formats dates, so this string must be correct.
- Item ids: "eN-01", "eN-02" and so on, sequential, zero padded to two digits.
  For Edition 4: "e4-01". Ids are permanent once published.

State the window you have derived before you begin searching, so it can be
checked.

## Item schema

Every item is an object with exactly these fields:

  id            string, required. "eN-01" format. Permanent.
  headline      string, required. 90 characters or fewer. Sentence case. No
                trailing full stop.
  summary       string, required. 25 to 45 words. What happened, neutral
                register, no interpretation. Every factual claim here must be
                present in the cited source.
  initial_view  string, required. 20 to 35 words. The implication for this
                distributor. Hedged register — "looks due for", "would need",
                "appears to" — not directive. This is a first read to open
                discussion, not a recommendation.
  is_top        boolean, required.
  top_rank      integer 1 to 5 if is_top is true, otherwise null. Required.
                Sequential from 1, no gaps.
  area          string, required. Exactly one of the five slugs below. One
                primary area per item — do not hedge across two.
  markets       array of strings, required. One or more codes from the
                jurisdiction list below.
  brands        array of strings, required. Free text. May be empty: [].
                Display metadata only, not filterable.
  impact        string, required. "high", "medium" or "low".
  source_name   string, required. The publication, e.g. "Reuters".
  source_url    string, required. Full https URL that resolves.
  source_date   string, required. ISO YYYY-MM-DD. Must fall inside the edition
                window.
  seed_action   string or null. One of the five action slugs below, or null.
                Null means the item shows as Unreviewed.

Edition-level fields: id, number, start_date, end_date, published_date, label,
editor_note (string), items (array).

Plain example of one item, for shape only — do not reuse this content:

  {
    "id": "e4-01",
    "headline": "Example headline in sentence case, under ninety characters",
    "summary": "Twenty-five to forty-five words describing what happened, in
    neutral register, with every claim traceable to the cited source and no
    interpretation mixed in.",
    "initial_view": "Twenty to thirty-five words on what this means for a
    distributor, hedged rather than directive.",
    "is_top": true,
    "top_rank": 1,
    "area": "regulation_trade",
    "markets": ["EU", "CN"],
    "brands": ["BYD"],
    "impact": "high",
    "source_name": "Reuters",
    "source_url": "https://example.com/article",
    "source_date": "2026-08-04",
    "seed_action": "escalate"
  }

## The five areas

regulation_trade — Regulation & Trade
  Type approval and homologation, emissions and safety rules, tariffs and
  duties, rules of origin, local-content requirements, shipping and routing.
  Governs whether we can land, certify and legally sell a unit, and at what
  cost.

product_powertrain — Product & Powertrain
  Model launches and facelifts, powertrain mix, specification suitability for
  regional climate and fuel quality, recalls and warranty exposure. Governs
  what reaches our showrooms and what it displaces in the existing line-up.

retail_aftersales — Retail & Aftersales
  Agency and dealer contracts, direct-to-consumer and online retail, showroom
  formats, used and certified pre-owned, fleet, finance and insurance — and
  separately, service networks, parts logistics, warranty terms and the
  ownership-economics annuity. Governs how we sell, and what we continue to
  earn after the sale.

competition_brand — Competition & Brand Moves
  Distribution agreements, market entries and exits, competitor franchise wins,
  registrations and market share, pricing and discounting, macro and
  consumer-credit conditions, grey and parallel imports. Governs the portfolio
  we can represent and the volume the market gives us. Market and registration
  data belongs here despite the label.

charging_energy — Charging & Energy
  Charging network build-out, grid capacity and constraints, tariffs and
  incentives, fuel quality, observed EV adoption. An operating precondition: an
  EV franchise is worth only what the local energy infrastructure can support.

## Jurisdiction codes

Filterable — countries and regional jurisdictions:
  Middle East & North Africa: SA Saudi Arabia, AE United Arab Emirates,
  KW Kuwait, QA Qatar, OM Oman, BH Bahrain, TR Türkiye, EG Egypt, MA Morocco,
  DZ Algeria, JO Jordan, LB Lebanon
  Europe: GB United Kingdom, DE Germany, FR France, IT Italy, ES Spain,
  PL Poland, NL Netherlands, NO Norway, DK Denmark, BE Belgium, MT Malta
  Jurisdictions: EU European Union, GCC Gulf Cooperation Council, UNECE UNECE,
  GLOBAL Global

Not filterable — source markets, shown as context tags only:
  CN China, JP Japan, KR South Korea

Source markets are where decisions are made, not markets the company
distributes into. Use them on items where a manufacturer's home-market
decision is the story, but never as the only code on an item.

Supranational items are often the most consequential ones, which is why EU,
GCC and UNECE are first-class codes rather than being forced into a country
field. Use them.

## Actions

  unreviewed  Unreviewed — the default
  no_action   No action — logged, explicitly not material
  monitor     Monitor — re-check next cycle
  deep_dive   Deep dive — assign analytical work
  escalate    Escalate — above the strategy team's authority

## Impact criteria

high    Changes a decision we would otherwise take, or moves volume or gross
        profit in a market we sell in, within 12 months. Rare by design.
        Maximum three per edition, and fewer is normal.
medium  Informs planning or revises our read of a market, but forces no
        decision this cycle. Registration data and directional policy signals
        normally sit here.
low     Context. Logged for the record.

Impact and action must agree. A high-impact item cannot carry "unreviewed" or
"no_action" — if nothing is being done about it, it is not high impact.
Conversely do not mark something high merely because it is interesting or
prominent in the news. Retrospective analysis of a regime already in force is
medium, not high.

## Inclusion rule — three gates, all must pass

1. Lever test. Does it change one of: brands we can carry, markets we can sell
   into, what we are permitted to sell, how we retail or at what margin,
   aftersales annuity, or market volume?
2. Actionability test. Could a named function inside the company plausibly do
   something differently in the next 12 months because of it?
3. Verifiability test. Real URL that resolves, named publication, date inside
   the edition window.

Any failure means cut the item. Do not soften it, do not widen the window, do
not substitute a weaker source. If two items say the same thing, keep the one
nearer the company's own markets.

## Automatic exclusions

Concept cars and motor-show reveals. Motorsport. Autonomous-driving research
with no near-term commercial path. US-only news unless it moves a brand the
company represents. Earnings releases with no strategic content. Vendor
market-research listings and press releases (Ken Research, Mordor
Intelligence, TechSci and similar). Marketplace and dealer-platform SEO blogs.
Aggregator rewrites where the original publication is reachable — cite the
original.

## Sources to screen

Europe and global:
  European Commission press corner and the Official Journal — cite the
  Commission over any report of the Commission. ACEA for EU/EFTA/UK
  registrations by market and powertrain. SMMT for the UK, KBA for Germany.
  UNECE WP.29 for vehicle regulation and type approval. Reuters. Automotive
  News Europe. Automotive Management (am-online). Fleet News. Just Auto.
  Autovista24 for pricing and residuals. Electrive for charging and EV policy.
  Transport & Environment for EU transport policy analysis. S&P Global
  Mobility. Automotive Logistics for shipping, RoRo capacity and ports. OEM
  newsrooms: Toyota, BYD, Geely, Chery, GWM, Changan.

Gulf and MENA — general search reaches these poorly, so visit them directly:
  SPA (Saudi Press Agency) and WAM (Emirates News Agency) for official and
  regulatory announcements. SASO and GSO for Saudi and GCC standards, which
  are the primary source for homologation items and rarely used. Argaam for
  Saudi financial news. Zawya for wider Gulf business. The National, Gulf
  News, Khaleej Times, Arab News, Saudi Gazette. AGBI. Distributor and OEM
  newsrooms, where competitor franchise news usually breaks first: Abdul Latif
  Jameel and Jameel Motors, Al-Futtaim, Mohamed Yousuf Naghi Motors, AW
  Rostamani, Juffali, Ali Alghanim.

One learned lesson worth applying: for this company's Middle East exposure,
the operative coverage often sits in shipping, logistics and marine-insurance
trade press rather than in car media. Search there too.

Two standing cautions. Gulf vehicle registration and volume data is not
published the way ACEA publishes Europe's — never state a Gulf volume or share
figure without attributing it to a named report. And Gulf press routinely
reports memoranda and framework agreements in language that reads like
completed deals; if the source says memorandum, intent or exploring, the
summary must say so too.

## Verification rules

- Every source_url must be a real URL you retrieved during this session and
  that resolves. Never construct a plausible-looking URL.
- Read the date off the article page, not off a listing or index page. Some
  sites render today's date into archived pages, which makes old articles look
  current. If the two disagree, trust the article page; if you cannot resolve
  it, drop the item and say so.
- Every claim in the summary must be present in the cited source. Do not carry
  a fact across from a different article, and do not add a detail that would
  reasonably follow but is not stated. This is the single most common failure.
- If a search returns nothing for a category, market or theme, say it returned
  nothing. Do not fill the gap with something weaker.

## Volume

Target 7 to 10 items. Minimum 5. Mark 3 to 5 as top items, ranked. Leave one
or two items with seed_action null so the Unreviewed default is visible.

If fewer than 5 items pass all three gates, output what passed and say so.
A short honest edition is correct; a padded one is not.

## Editor's note

Write editor_note as two or three sentences. Name the through-line of the
fortnight, then name any coverage gap explicitly — a region, a category or a
theme that is thin or absent this cycle. Do not conceal a gap. Stating it is
what makes the rest of the edition credible.

## Finally

This output is a draft for human verification, not publishable copy. A human
will open every URL, confirm every date, and check every claim against its
source before anything is committed. Write accordingly: prefer fewer items you
are confident in, flag anything uncertain in your closing list rather than
smoothing it into the text, and never present an inference in the register of
a fact.
```
