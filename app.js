(function () {
  'use strict';

  var STORAGE_KEY = 'mib.actions.v1';
  var IMPACT_ORDER = { high: 0, medium: 1, low: 2 };
  var WEAK_ACTIONS = { unreviewed: 1, no_action: 1 };

  var state = {
    data: null,
    editionId: null,
    area: 'all',
    market: 'all',
    actions: {},
    persistent: true
  };

  var dom = {};

  /* ---------- helpers ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined && text !== null) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function readStorage() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      state.persistent = false;
      return {};
    }
  }

  function writeStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.actions));
    } catch (err) {
      state.persistent = false;
    }
  }

  function areaMeta(slug) {
    return (state.data.areas && state.data.areas[slug]) || { name: slug, definition: '' };
  }

  function marketMeta(code) {
    return (state.data.markets && state.data.markets[code]) ||
      { name: code, group: 'Other', filterable: false };
  }

  function actionLabel(slug) {
    return (state.data.actions && state.data.actions[slug]) || slug;
  }

  /* A saved choice always wins, including an explicit "unreviewed".
     Absent a saved choice we fall back to the seeded action. */
  function actionFor(item) {
    if (Object.prototype.hasOwnProperty.call(state.actions, item.id)) {
      return state.actions[item.id];
    }
    return item.seed_action || 'unreviewed';
  }

  function currentEdition() {
    var eds = state.data.editions;
    for (var i = 0; i < eds.length; i++) {
      if (eds[i].id === state.editionId) { return eds[i]; }
    }
    return eds[eds.length - 1];
  }

  function editionItems() {
    var ed = currentEdition();
    return (ed && ed.items) ? ed.items : [];
  }

  function filterActive() {
    return state.area !== 'all' || state.market !== 'all';
  }

  function matches(item) {
    if (state.area !== 'all' && item.area !== state.area) { return false; }
    if (state.market !== 'all') {
      if ((item.markets || []).indexOf(state.market) === -1) { return false; }
    }
    return true;
  }

  function sortItems(items) {
    return items.slice().sort(function (a, b) {
      if (a.is_top && b.is_top) { return (a.top_rank || 99) - (b.top_rank || 99); }
      if (a.is_top) { return -1; }
      if (b.is_top) { return 1; }
      var ia = IMPACT_ORDER[a.impact], ib = IMPACT_ORDER[b.impact];
      if (ia === undefined) { ia = 9; }
      if (ib === undefined) { ib = 9; }
      if (ia !== ib) { return ia - ib; }
      return String(b.source_date).localeCompare(String(a.source_date));
    });
  }

  /* ---------- selects ---------- */

  function buildEditionSelect() {
    var sel = dom.editionSelect;
    clear(sel);
    state.data.editions.forEach(function (ed) {
      var count = (ed.items || []).length;
      var suffix = count ? '' : ' — no items';
      var opt = el('option', null, 'Edition ' + ed.number + ' · ' + ed.label + suffix);
      opt.value = ed.id;
      sel.appendChild(opt);
    });
    sel.value = state.editionId;
  }

  /* Options are built from the selected edition only, with counts, so a
     dropdown never offers a value that returns nothing on its own. */
  function buildAreaSelect() {
    var sel = dom.areaSelect;
    var items = editionItems();
    var counts = {};
    items.forEach(function (it) { counts[it.area] = (counts[it.area] || 0) + 1; });

    clear(sel);
    var all = el('option', null, 'All areas (' + items.length + ')');
    all.value = 'all';
    sel.appendChild(all);

    Object.keys(state.data.areas).forEach(function (slug) {
      if (!counts[slug]) { return; }
      var opt = el('option', null, areaMeta(slug).name + ' (' + counts[slug] + ')');
      opt.value = slug;
      sel.appendChild(opt);
    });

    if (state.area !== 'all' && !counts[state.area]) { state.area = 'all'; }
    sel.value = state.area;
  }

  function buildMarketSelect() {
    var sel = dom.marketSelect;
    var items = editionItems();
    var counts = {};
    items.forEach(function (it) {
      (it.markets || []).forEach(function (code) {
        if (!marketMeta(code).filterable) { return; }
        counts[code] = (counts[code] || 0) + 1;
      });
    });

    clear(sel);
    var all = el('option', null, 'All jurisdictions (' + items.length + ')');
    all.value = 'all';
    sel.appendChild(all);

    (state.data.market_groups || []).forEach(function (group) {
      var codes = Object.keys(state.data.markets).filter(function (code) {
        var m = marketMeta(code);
        return m.filterable && m.group === group && counts[code];
      });
      if (!codes.length) { return; }
      codes.sort(function (a, b) {
        return marketMeta(a).name.localeCompare(marketMeta(b).name);
      });
      var grp = document.createElement('optgroup');
      grp.label = group;
      codes.forEach(function (code) {
        var opt = el('option', null, marketMeta(code).name + ' (' + counts[code] + ')');
        opt.value = code;
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });

    if (state.market !== 'all' && !counts[state.market]) { state.market = 'all'; }
    sel.value = state.market;
  }

  /* ---------- impact / action coherence ---------- */

  function coherenceMessage(item, action) {
    if (item.impact === 'high' && WEAK_ACTIONS[action]) {
      return 'Rated high impact but carrying no work. Either the rating is too ' +
        'high or this needs a deep dive.';
    }
    if (item.impact === 'low' && action === 'escalate') {
      return 'Rated low impact but escalated. Worth re-rating if this really ' +
        'needs leadership time.';
    }
    return '';
  }

  /* ---------- cards ---------- */

  function buildCard(item, showRank) {
    var card = el('article', 'card' + (item.is_top ? ' is-top' : ''));

    if (showRank && item.is_top && item.top_rank) {
      card.appendChild(el('span', 'card-rank', 'Top item ' + item.top_rank));
    }

    card.appendChild(el('h3', null, item.headline));

    /* What happened, before what it might mean. */
    card.appendChild(el('p', 'summary', item.summary));

    var iv = el('div', 'iv');
    var ivLabel = el('span', 'iv-label', 'Initial view');
    ivLabel.title = 'A first read for discussion, not a settled position or a recommendation to act.';
    iv.appendChild(ivLabel);
    iv.appendChild(el('p', null, item.initial_view));
    card.appendChild(iv);

    var badges = el('div', 'badges');

    var area = el('span', 'badge badge-area', areaMeta(item.area).name);
    area.title = areaMeta(item.area).definition;
    badges.appendChild(area);

    var impact = el('span', 'badge badge-impact ' + item.impact, item.impact + ' impact');
    impact.title = (state.data.impact_criteria || {})[item.impact] || '';
    badges.appendChild(impact);

    (item.markets || []).forEach(function (code) {
      var meta = marketMeta(code);
      var tag = el('span', 'badge' + (meta.filterable ? '' : ' badge-src'), meta.name);
      if (!meta.filterable) {
        tag.title = 'Source market — shown for context, not offered as a filter.';
      }
      badges.appendChild(tag);
    });

    (item.brands || []).forEach(function (brand) {
      badges.appendChild(el('span', 'badge', brand));
    });

    card.appendChild(badges);

    var foot = el('div', 'card-foot');

    var src = el('p', 'src');
    src.appendChild(document.createTextNode('Source: '));
    var link = el('a', null, item.source_name);
    link.href = item.source_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    src.appendChild(link);
    src.appendChild(document.createTextNode(' · '));
    src.appendChild(el('span', 'mono', item.source_date));
    foot.appendChild(src);

    var field = el('div', 'action-field');
    var selectId = 'action-' + item.id;
    var label = el('label', null, 'Proposed action');
    label.setAttribute('for', selectId);
    field.appendChild(label);

    var select = document.createElement('select');
    select.id = selectId;
    Object.keys(state.data.actions).forEach(function (slug) {
      var opt = el('option', null, actionLabel(slug));
      opt.value = slug;
      select.appendChild(opt);
    });
    select.value = actionFor(item);
    field.appendChild(select);

    var flag = el('p', 'coherence');
    flag.id = 'coherence-' + item.id;
    flag.setAttribute('role', 'status');
    field.appendChild(flag);

    function syncFlag() {
      var msg = coherenceMessage(item, select.value);
      flag.textContent = msg;
      flag.hidden = !msg;
    }
    syncFlag();

    select.addEventListener('change', function () {
      state.actions[item.id] = select.value;
      writeStorage();
      syncFlag();
      dom.exportStatus.textContent = '';
    });

    foot.appendChild(field);
    card.appendChild(foot);
    return card;
  }

  /* ---------- rendering ---------- */

  function renderMasthead() {
    var ed = currentEdition();
    dom.editionFlag.textContent = 'Edition ' + ed.number;
    dom.editionLabel.textContent = ed.label;
    dom.publishedDate.textContent = 'Published ' + ed.published_date;

    clear(dom.editorNote);
    if (ed.editor_note) {
      dom.editorNote.appendChild(el('p', null, ed.editor_note));
      dom.editorNote.hidden = false;
    } else {
      dom.editorNote.hidden = true;
    }
  }

  function renderTop() {
    clear(dom.topBody);
    clear(dom.topHead);

    var tops = editionItems().filter(function (it) { return it.is_top; });

    if (!tops.length) {
      dom.topSection.hidden = true;
      return;
    }
    dom.topSection.hidden = false;

    if (filterActive()) {
      dom.topHead.appendChild(el('h2', null, 'Top items'));
      var note = el('div', 'empty');
      note.appendChild(el('strong', null, 'Editorial ranking paused while filters are active'));
      var p = el('p', null,
        'The top items are a judgment about the fortnight as a whole, so the ' +
        'ranking is not applied to a filtered subset. ');
      var btn = el('button', 'inline-btn', 'Clear filters');
      btn.type = 'button';
      btn.addEventListener('click', resetFilters);
      p.appendChild(btn);
      p.appendChild(document.createTextNode(' to see them.'));
      note.appendChild(p);
      dom.topBody.appendChild(note);
      return;
    }

    dom.topHead.appendChild(el('h2', null, 'Top ' + tops.length + ' this fortnight'));
    dom.topHead.appendChild(el('span', 'mono', 'Ranked by editorial judgment'));

    sortItems(tops).forEach(function (item) {
      dom.topBody.appendChild(buildCard(item, true));
    });
  }

  function renderFeed() {
    clear(dom.feedBody);
    var all = editionItems();
    var shown = sortItems(all.filter(matches));

    dom.count.textContent = all.length
      ? 'Showing ' + shown.length + ' of ' + all.length + ' items in this edition'
      : 'No items in this edition';

    if (!all.length) {
      var shell = el('div', 'empty');
      shell.appendChild(el('strong', null, 'This archive edition has no items yet'));
      shell.appendChild(el('p', null,
        'The window and label are recorded so the archive reads continuously. ' +
        'Use the edition selector in the masthead to return to the current edition.'));
      dom.feedBody.appendChild(shell);
      return;
    }

    if (!shown.length) {
      var none = el('div', 'empty');
      none.appendChild(el('strong', null, 'No items match this combination'));
      var p = el('p', null, 'Nothing in this edition sits in that area and jurisdiction together. ');
      var btn = el('button', 'inline-btn', 'Reset filters');
      btn.type = 'button';
      btn.addEventListener('click', resetFilters);
      p.appendChild(btn);
      p.appendChild(document.createTextNode('.'));
      none.appendChild(p);
      dom.feedBody.appendChild(none);
      return;
    }

    shown.forEach(function (item) {
      dom.feedBody.appendChild(buildCard(item, true));
    });
  }

  function render() {
    renderMasthead();
    buildAreaSelect();
    buildMarketSelect();
    renderTop();
    renderFeed();
    dom.resetBtn.disabled = !filterActive();
    dom.exportStatus.textContent = '';
  }

  function resetFilters() {
    state.area = 'all';
    state.market = 'all';
    dom.areaSelect.value = 'all';
    dom.marketSelect.value = 'all';
    render();
  }

  /* ---------- panels ---------- */

  function renderPanels() {
    var defs = el('dl', 'defs');
    Object.keys(state.data.areas).forEach(function (slug) {
      defs.appendChild(el('dt', null, areaMeta(slug).name));
      defs.appendChild(el('dd', null, areaMeta(slug).definition));
    });
    dom.areaDefs.appendChild(defs);
    if (state.data.filter_note) {
      dom.areaDefs.appendChild(el('p', 'panel-tail', state.data.filter_note));
    }

    var crit = el('dl', 'defs');
    var criteria = state.data.impact_criteria || {};
    ['high', 'medium', 'low'].forEach(function (key) {
      if (!criteria[key]) { return; }
      crit.appendChild(el('dt', null, key.charAt(0).toUpperCase() + key.slice(1)));
      crit.appendChild(el('dd', null, criteria[key]));
    });
    dom.impactDefs.appendChild(crit);

    dom.aiNotice.textContent = state.data.ai_notice;
  }

  /* ---------- CSV export ---------- */

  function csvCell(value) {
    var str = (value === null || value === undefined) ? '' : String(value);
    return '"' + str.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    var rows = [[
      'Edition', 'Window', 'Item ID', 'Headline', 'Area', 'Jurisdictions',
      'Brands', 'Impact', 'Proposed action', 'Source', 'Source date',
      'Source URL', 'Initial view'
    ]];

    state.data.editions.forEach(function (ed) {
      (ed.items || []).forEach(function (item) {
        var action = actionFor(item);
        if (action === 'unreviewed') { return; }
        rows.push([
          ed.number, ed.label, item.id, item.headline,
          areaMeta(item.area).name,
          (item.markets || []).map(function (c) { return marketMeta(c).name; }).join('; '),
          (item.brands || []).join('; '),
          item.impact, actionLabel(action),
          item.source_name, item.source_date, item.source_url, item.initial_view
        ]);
      });
    });

    if (rows.length === 1) {
      dom.exportStatus.textContent =
        'Nothing to export — every item is still marked Unreviewed. ' +
        'Assign an action to at least one item first.';
      return;
    }

    var csv = rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mobility-brief-triage.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    dom.exportStatus.textContent =
      'Exported ' + (rows.length - 1) + ' triaged item(s) across all editions. ' +
      'Items marked Unreviewed are excluded.';
  }

  /* ---------- init ---------- */

  function cacheDom() {
    [
      'editionFlag', 'editionLabel', 'publishedDate', 'editorNote', 'aiNotice',
      'editionSelect', 'areaSelect', 'marketSelect', 'resetBtn', 'exportBtn',
      'exportStatus', 'count', 'topSection', 'topHead', 'topBody', 'feedBody',
      'areaDefs', 'impactDefs', 'error'
    ].forEach(function (id) {
      dom[id] = document.getElementById(id);
    });
  }

  function wire() {
    dom.editionSelect.addEventListener('change', function () {
      state.editionId = dom.editionSelect.value;
      state.area = 'all';
      state.market = 'all';
      render();
    });
    dom.areaSelect.addEventListener('change', function () {
      state.area = dom.areaSelect.value;
      render();
    });
    dom.marketSelect.addEventListener('change', function () {
      state.market = dom.marketSelect.value;
      render();
    });
    dom.resetBtn.addEventListener('click', resetFilters);
    dom.exportBtn.addEventListener('click', exportCsv);
  }

  function start(data) {
    state.data = data;
    state.actions = readStorage();

    if (!data.editions || !data.editions.length) {
      dom.error.hidden = false;
      dom.error.textContent = 'No editions found in data.json.';
      return;
    }

    /* Default to the most recent edition in the array. */
    state.editionId = data.editions[data.editions.length - 1].id;

    document.title = data.publication;
    document.getElementById('pubName').textContent = data.publication;
    document.getElementById('pubSubtitle').textContent = data.subtitle;

    cacheDom();
    renderPanels();
    buildEditionSelect();
    wire();
    render();

    if (!state.persistent) {
      dom.exportStatus.textContent =
        'Browser storage is unavailable, so action choices will not survive a refresh.';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    cacheDom();
    fetch('data.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.json();
      })
      .then(start)
      .catch(function (err) {
        dom.error.hidden = false;
        dom.error.textContent =
          'Could not load data.json (' + err.message + '). If you are viewing ' +
          'this from a local file, open it over the published URL instead.';
      });
  });
}());
