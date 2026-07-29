(function () {
  'use strict';

  var STORAGE_KEY = 'mib.actions.v1';
  var IMPACT_ORDER = { high: 0, medium: 1, low: 2 };

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

  function
