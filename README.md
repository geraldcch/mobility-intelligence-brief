# Mobility Intelligence Brief

A fortnightly intelligence briefing on the mobility sector, built for the corporate strategy team and senior leadership of an automotive distributor operating across the Middle East and Europe.

**Live site: https://geraldcch.github.io/mobility-intelligence-brief/**

## What this is

The company distributes vehicles under agreements with manufacturers — historically Japanese, increasingly Chinese — into markets where it holds distribution rights. It does not manufacture. Its economics therefore turn on which brands it represents, which markets it can import into, what regulation permits, how it retails, and what competitors are doing to its channel.

This briefing is organised around those levers rather than around automotive news generally. Every item carries an implication line addressed to this business specifically; the underlying facts are available elsewhere, so the interpretation is the product.

Readers can filter by area of interest and by country or jurisdiction, move between editions, and assign a proposed action to each item. Triage can be exported to CSV, because the realistic alternative to this product is someone forwarding a link by email, and a briefing that cannot be moved into a deck or a message loses to that.

## Repository structure

```
index.html      Page structure. Static, no build step.
styles.css      All styling. No framework.
app.js          Rendering, filtering, action persistence, CSV export.
data.json       All editorial content and all controlled vocabularies.
README.md       This file.
GENERATE_EDITION.md   Operating procedure for producing the next edition.
```

Deliberately a static site: no server, no database, no build pipeline, no dependencies. It is hosted free on GitHub Pages and will keep working without maintenance.

All paths are relative. The repository is not named `geraldcch.github.io`, so the site sits at a subpath and a leading slash would break it.

## Where the content lives

Everything editorial is in `data.json`. `app.js` reads the vocabularies — areas, jurisdictions, actions, impact criteria — from that file rather than hardcoding them, so the taxonomy can change without touching code.

To add an edition, append one object to the `editions` array. The array is in ascending order and the app opens on the last entry, so the newest edition goes at the end. `GENERATE_EDITION.md` contains a prompt that drafts this object.

Two things must never change once published: **item `id` values**, because saved actions are keyed on them, and **area slugs**, because they are filter keys and are referenced by every item.

`data.json` is fetched at load. A syntax error anywhere in it takes the whole site down to an error notice, so validate the JSON before committing.

## Editorial method

**Inclusion.** An item must pass three gates. Does it change one of: brands we can carry, markets we can sell into, what we are permitted to sell, how we retail or at what margin, aftersales annuity, or market volume? Could a named function inside the company plausibly act differently within 12 months because of it? Is it verifiable against a named publication with a resolving URL and a date inside the edition window? Any failure means the item is cut rather than softened.

**Automatic exclusions.** Concept cars and motor-show reveals; motorsport; autonomous-driving research with no near-term commercial path; US-only news unless it moves a brand the company represents; earnings releases with no strategic content; vendor market-research listings and marketplace SEO content.

**Verification.** Every `source_date` must fall inside its edition's window, and windows are contiguous Monday-to-Sunday fortnights with no gaps or overlaps. That constraint is what keeps the archive honest and is the first thing worth checking.

**Impact.** *High* — changes a decision we would otherwise take, or moves volume or gross profit in a market we sell in, within 12 months; rare, and capped at three per edition. *Medium* — informs planning or revises our read of a market, but forces no decision this cycle; registration data and directional policy signals normally sit here. *Low* — context, logged for the record. Impact and action must agree: a high-impact item cannot sit at Unreviewed or No action, because if nothing is being done about it, it is not high impact. The app flags that contradiction on screen.

## Division of labour

Collection and drafting are AI-assisted. Screening, verification and the final rating are human.

That split is not a formality. During the build, a draft item stated that the IMO had advised ships to avoid transiting the Strait of Hormuz, and cited a source that did not contain the claim. The advisory was real, but it came from different reporting on a different date. Nothing about the sentence looked wrong — it was fluent, plausible, and consistent with everything around it. It was caught only by opening the cited article and reading it.

That is the characteristic failure mode. Language models are strong at breadth of search and at drafting to a fixed schema, and weak at the boundary between what a source actually says and what would reasonably follow from it. A briefing whose value rests on the reader trusting the sourcing cannot delegate that boundary. So:

- **AI does:** source discovery, first-pass screening against the inclusion rule, summary and implication drafting to schema, consistency checks across a set.
- **A human does:** opens every cited URL, confirms the date on the article page rather than a listing page, checks that each claim in the summary is present in the source, sets the final impact rating and action, and writes or approves the editor's note.

Specific traps encountered and now screened for: listing-page dates differing from article dates; sites that render the current date into archived pages, making an old article look current; reports of memoranda of understanding written in language that reads like completed deals; and Gulf volume or market-share figures, which are not published the way European registration data is and should not be stated without attribution to a named report.

## Known limitations

- Proposed actions are stored in the browser's local storage. They are per-browser and per-device, not shared between users. CSV export is the only way to move a triage list elsewhere. This was a deliberate trade to keep the site static and dependency-free.
- Six items ship pre-triaged so the feature is visibly in use on first load. A reviewer who exports without changing anything will see those rows.
- Edition 1 is a pilot issue with two items and no editorial ranking. Coverage is thinner than later editions; this is stated in its editor's note rather than concealed.
- Gulf franchise and standards coverage is the weakest part of the current editions. The relevant sources are poorly indexed by general search and need direct visits.
- Point-in-time artefact. Content covers 15 June to 26 July 2026 and is not updated automatically.
