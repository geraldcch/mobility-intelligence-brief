card.appendChild(el('h3', null, item.headline));

    var iv = el('div', 'iv');
    var ivLabel = el('span', 'iv-label', 'Initial view');
    ivLabel.title = 'A first read for discussion, not a settled position or a recommendation to act.';
    iv.appendChild(ivLabel);
    iv.appendChild(el('p', null, item.initial_view));
    card.appendChild(iv);

    card.appendChild(el('p', 'summary', item.summary));
