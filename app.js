(function () {
  'use strict';

  // Triage selections live in this browser only, keyed on the immutable item id.
  var STORE_KEY = 'mib.actions.v1';

  var data = null;
  var editionId = null;
  var actions = readActions();

  function readActions() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeActions() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(actions));
    } catch (e) {
      // Private browsing or storage disabled — selections just won't persist.
    }
  }

  function el(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function edition() {
    for (var i = 0; i < data.editions.length; i++) {
      if (data.editions[i].id === editionId) { return data.editions[i]; }
    }
    return data.editions[data.editions.length - 1];
  }

  // A user's saved choice wins; otherwise fall back to the seeded status.
  function actionFor(item) {
    if (Object.prototype.hasOwnProperty.call(actions, item.id)) { return actions[item.id]; }
    return item.seed_action || 'unreviewed';
  }

  function filters() {
    return { market: el('marketSelect').value, area: el('areaSelect').value };
  }

  function matches(item, f) {
    if (f.market && item.markets.indexOf(f.market) === -1) { return false; }
    if (f.area && item.area !== f.area) { return false; }
    return true;
  }

  /* ---------- populate the dropdowns ---------- */

  function buildSelects() {
    var ed = el('editionSelect');
    ed.innerHTML = '';
    // Newest first in the dropdown, so the current edition is the default choice.
    for (var i = data.editions.length - 1; i >= 0; i--) {
      var e = data.editions[i];
      var isLatest = (i === data.editions.length - 1);
      ed.innerHTML += '<option value="' + esc(e.id) + '">Edition ' + e.number + ' — ' +
        esc(e.label) + (isLatest ? ' (current)' : '') + '</option>';
    }

    // Only offer markets that actually appear somewhere in the data.
    var used = {};
    data.editions.forEach(function (e) {
      e.items.forEach(function (it) {
        it.markets.forEach(function (m) { used[m] = true; });
      });
    });

    var mk = el('marketSelect');
    mk.innerHTML = '<option value="">All jurisdictions</option>';
    data.market_groups.forEach(function (g) {
      var opts = '';
      g.codes.forEach(function (c) {
        if (used[c]) { opts += '<option value="' + esc(c) + '">' + esc(data.markets[c] || c) + '</option>'; }
      });
      if (opts) { mk.innerHTML += '<optgroup label="' + esc(g.label) + '">' + opts + '</optgroup>'; }
    });

    var ar = el('areaSelect');
    ar.innerHTML = '<option value="">All areas of interest</option>';
    Object.keys(data.areas).forEach(function (slug) {
      ar.innerHTML += '<option value="' + esc(slug) + '">' + esc(data.areas[slug]) + '</option>';
    });
  }

  /* ---------- render one item ---------- */

  function card(item) {
    var act = actionFor(item);
    var names = item.markets.map(function (c) { return data.markets[c] || c; }).join(' · ');

    var opts = '';
    Object.keys(data.actions).forEach(function (slug) {
      opts += '<option value="' + esc(slug) + '"' + (slug === act ? ' selected' : '') + '>' +
        esc(data.actions[slug]) + '</option>';
    });

    var crit = data.impact_criteria && data.impact_criteria[item.impact] ? data.impact_criteria[item.impact] : '';

    return '<article class="item' + (act !== 'unreviewed' ? ' flagged' : '') + '">' +
      '<div class="i-head">' +
        (item.is_top ? '<span class="rank">' + item.top_rank + '</span>' : '') +
        '<h3>' + esc(item.headline) + '</h3>' +
      '</div>' +
      '<div class="i-tags">' +
        '<span class="tag area">' + esc(data.areas[item.area] || item.area) + '</span>' +
        '<span class="tag impact ' + esc(item.impact) + '" title="' + esc(crit) + '">' +
          esc(item.impact) + ' impact</span>' +
        '<span class="tag">' + esc(names) + '</span>' +
        (item.brands && item.brands.length
          ? '<span class="tag">' + esc(item.brands.join(', ')) + '</span>' : '') +
      '</div>' +
      '<p class="i-sum">' + esc(item.summary) + '</p>' +
      '<p class="i-so"><span class="so-lb">So what</span>' + esc(item.so_what) + '</p>' +
      '<div class="i-foot">' +
        '<a class="src" href="' + esc(item.source_url) + '" target="_blank" rel="noopener">' +
          esc(item.source_name) + '</a>' +
        '<span class="date">' + esc(item.source_date) + '</span>' +
        '<label class="act-lb">Action' +
          '<select class="act" data-id="' + esc(item.id) + '">' + opts + '</select>' +
        '</label>' +
      '</div>' +
    '</article>';
  }

  /* ---------- render the page ---------- */

  function render() {
    var e = edition();
    var f = filters();
    var filtering = !!(f.market || f.area);

    el('editionMeta').textContent = 'Edition ' + e.number + ' · ' + e.label +
      ' · published ' + e.published_date + ' · ' + e.items.length +
      (e.items.length === 1 ? ' item' : ' items');

    var note = el('editorNote');
    if (e.editor_note) { note.textContent = e.editor_note; note.hidden = false; }
    else { note.hidden = true; }

    var visible = e.items.filter(function (it) { return matches(it, f); });

    // The top block is an editorial ranking, so it only makes sense unfiltered.
    // Once a filter is on, collapse to a single result list.
    var top = e.items.filter(function (it) { return it.is_top; })
      .sort(function (a, b) { return a.top_rank - b.top_rank; });

    if (!filtering && top.length) {
      el('topSection').hidden = false;
      el('topHeading').textContent = 'Top ' + top.length + ' this fortnight';
      el('topList').innerHTML = top.map(card).join('');
      el('feedHeading').innerHTML = 'Full feed <span class="count">' + e.items.length + '</span>';
      el('feedDesc').textContent = 'All items in this edition, filterable by jurisdiction and area of interest.';
      el('feedList').innerHTML = e.items.map(card).join('');
    } else {
      el('topSection').hidden = true;
      el('feedHeading').innerHTML = (filtering ? 'Filtered results' : 'Full feed') +
        ' <span class="count">' + visible.length + ' of ' + e.items.length + '</span>';
      el('feedDesc').textContent = filtering
        ? 'Showing items matching the current filters.'
        : 'All items in this edition.';
      el('feedList').innerHTML = visible.map(card).join('');
    }

    var empty = el('emptyState');
    var shown = el('feedList').children.length;
    if (shown === 0) {
      empty.hidden = false;
      empty.textContent = e.items.length === 0
        ? 'This edition has no items yet.'
        : 'No items in this edition match those filters. Clear the filters or try a broader jurisdiction.';
    } else {
      empty.hidden = true;
    }

    bindActionSelects();
  }

  function bindActionSelects() {
    var sels = document.querySelectorAll('select.act');
    for (var i = 0; i < sels.length; i++) {
      sels[i].onchange = function () {
        actions[this.getAttribute('data-id')] = this.value;
        writeActions();
        render();
      };
    }
  }

  /* ---------- CSV export of everything triaged ---------- */

  function exportCsv() {
    var rows = [['Edition', 'Item ID', 'Action', 'Headline', 'Area', 'Jurisdictions', 'Impact', 'Source', 'Date', 'URL']];

    data.editions.forEach(function (e) {
      e.items.forEach(function (it) {
        var act = actionFor(it);
        if (act === 'unreviewed') { return; }
        rows.push([
          'Edition ' + e.number,
          it.id,
          data.actions[act] || act,
          it.headline,
          data.areas[it.area] || it.area,
          it.markets.map(function (c) { return data.markets[c] || c; }).join('; '),
          it.impact,
          it.source_name,
          it.source_date,
          it.source_url
        ]);
      });
    });

    if (rows.length === 1) {
      window.alert('Nothing has been triaged yet. Assign an action to an item first.');
      return;
    }

    var csv = rows.map(function (r) {
      return r.map(function (cell) {
        return '"' + String(cell).replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\r\n');

    var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mobility-brief-triage.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- start ---------- */

  fetch('data.json')
    .then(function (r) {
      if (!r.ok) { throw new Error('HTTP ' + r.status); }
      return r.json();
    })
    .then(function (json) {
      data = json;
      if (data.publication) { el('pubName').textContent = data.publication; }
      if (data.subtitle) { el('pubSub').textContent = data.subtitle; }
      editionId = data.editions[data.editions.length - 1].id;

      buildSelects();
      el('editionSelect').value = editionId;

      el('editionSelect').onchange = function () {
        editionId = this.value;
        el('marketSelect').value = '';
        el('areaSelect').value = '';
        render();
      };
      el('marketSelect').onchange = render;
      el('areaSelect').onchange = render;
      el('clearBtn').onclick = function () {
        el('marketSelect').value = '';
        el('areaSelect').value = '';
        render();
      };
      el('exportBtn').onclick = exportCsv;

      render();
    })
    .catch(function (err) {
      var box = el('loadError');
      box.hidden = false;
      box.textContent = 'Could not load data.json (' + err.message +
        '). If you opened this file directly from disk, view it on the live URL instead — browsers block local file reads.';
      el('editionMeta').textContent = '';
    });
})();
