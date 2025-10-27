/**
 * assets/js/main.js
 * Niural AI — U.S. Carrier Map
 *
 * NOTE: This is a formatting / clarity refactor only.
 *       No functional changes were introduced.
 *
 * Author: Refactor (keeps original behaviour)
 * Date:   2025-10-25
 */

/* ============================================================================
   Section: Module scope / constants
   ============================================================================ */

(() => {
  'use strict';

  // -------------------------
  // Config / data paths
  // -------------------------
  const APP_CONFIG_PATH = 'data/appConfig.json';
  const STATE_DATA_PATH = 'data/stateData.json';
  const TOPO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

  // -------------------------
  // DOM handles that exist from markup
  // -------------------------
  const svgEl = document.getElementById('map');
  const territoriesKV = document.getElementById('territoriesKV');
  const tooltipEl = d3.select('#tooltip');
  const detailTitle = d3.select('#detailTitle');
  const detailBodyKV = d3.select('#detailBodyKV');
  const searchInput = document.getElementById('stateSearch');
  const exportBtn = document.getElementById('exportBtn');
  const themeToggleBtn = document.getElementById('themeToggle');
  const rootEl = document.documentElement;

  // -------------------------
  // Helpers: CSS var fetch + color chooser
  // -------------------------
  const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /**
   * Return a hex/color string for a given carrier name.
   * Defaults to Aetna color if unknown.
   * @param {string} carrier
   * @returns {string}
   */
  const colorForCarrier = (carrier) => {
    if (!carrier) return getCSSVar('--aetna');
    switch (carrier.toLowerCase()) {
      case 'aetna': return getCSSVar('--aetna');
      case 'restricted': return getCSSVar('--restricted');
      default: return getCSSVar('--aetna');
    }
  };

  // -------------------------
  // FIPS <-> USPS maps & name map
  // -------------------------
  const fipsToUSPS = {
    1: 'AL', 2: 'AK', 4: 'AZ', 5: 'AR', 6: 'CA', 8: 'CO', 9: 'CT', 10: 'DE', 11: 'DC', 12: 'FL',
    13: 'GA', 15: 'HI', 16: 'ID', 17: 'IL', 18: 'IN', 19: 'IA', 20: 'KS', 21: 'KY', 22: 'LA', 23: 'ME',
    24: 'MD', 25: 'MA', 26: 'MI', 27: 'MN', 28: 'MS', 29: 'MO', 30: 'MT', 31: 'NE', 32: 'NV', 33: 'NH',
    34: 'NJ', 35: 'NM', 36: 'NY', 37: 'NC', 38: 'ND', 39: 'OH', 40: 'OK', 41: 'OR', 42: 'PA', 44: 'RI',
    45: 'SC', 46: 'SD', 47: 'TN', 48: 'TX', 49: 'UT', 50: 'VT', 51: 'VA', 53: 'WA', 54: 'WV', 55: 'WI', 56: 'WY'
  };

  const nameToUSPS = {
    'Alabama': 'AL','Alaska': 'AK','Arizona': 'AZ','Arkansas': 'AR','California': 'CA','Colorado': 'CO',
    'Connecticut': 'CT','Delaware': 'DE','District of Columbia': 'DC','Florida': 'FL','Georgia': 'GA',
    'Hawaii': 'HI','Idaho': 'ID','Illinois': 'IL','Indiana': 'IN','Iowa': 'IA','Kansas': 'KS',
    'Kentucky': 'KY','Louisiana': 'LA','Maine': 'ME','Maryland': 'MD','Massachusetts': 'MA',
    'Michigan': 'MI','Minnesota': 'MN','Mississippi': 'MS','Missouri': 'MO','Montana': 'MT',
    'Nebraska': 'NE','Nevada': 'NV','New Hampshire': 'NH','New Jersey': 'NJ','New Mexico': 'NM',
    'New York': 'NY','North Carolina': 'NC','North Dakota': 'ND','Ohio': 'OH','Oklahoma': 'OK',
    'Oregon': 'OR','Pennsylvania': 'PA','Rhode Island': 'RI','South Carolina': 'SC','South Dakota': 'SD',
    'Tennessee': 'TN','Texas': 'TX','Utah': 'UT','Vermont': 'VT','Virginia': 'VA','Washington': 'WA',
    'West Virginia': 'WV','Wisconsin': 'WI','Wyoming': 'WY'
  };

  const uspsList = Object.values(fipsToUSPS);

  /* ============================================================================
     Section: load configs and initialize
     ============================================================================ */

  /**
   * Load both config files in parallel and then initialize the map.
   * No state change occurs here beyond wiring UI.
   */
  const init = async () => {
    const [appConfig, stateConfig] = await Promise.all([
      fetch(APP_CONFIG_PATH).then(r => r.json()),
      fetch(STATE_DATA_PATH).then(r => r.json())
    ]);

    // Branding
    const appTitleEl = document.getElementById('appTitle');
    const appSubtitleEl = document.getElementById('appSubtitle');
    const footBrandEl = document.getElementById('footBrand');

    if (appTitleEl) appTitleEl.textContent = appConfig.branding?.title ?? appTitleEl.textContent;
    if (appSubtitleEl) appSubtitleEl.textContent = appConfig.branding?.subtitle ?? appSubtitleEl.textContent;
    if (footBrandEl) footBrandEl.textContent = appConfig.footerText || '© Niural AI — Carrier visualization';

    // Territories KV
    territoriesKV.innerHTML = '';
    Object.entries(appConfig.territories || {}).forEach(([k, v]) => {
      const key = document.createElement('div');
      key.textContent = k;
      const val = document.createElement('div');
      val.textContent = v;
      territoriesKV.appendChild(key);
      territoriesKV.appendChild(val);
    });

    // Build final per-state data then render map
    const stateDataFinal = buildStateData(stateConfig, appConfig);
    await renderMap(stateDataFinal, appConfig);
  };

  /* ============================================================================
     Section: build state data (apply rules + overrides)
     ============================================================================ */

  /**
   * Returns the final per-state object after applying rules, restricted overrides,
   * important notes, and notable states.
   *
   * @param {Object} stateConfig
   * @param {Object} appConfig
   * @returns {Object} stateDataFinal map keyed by USPS code
   */
  const buildStateData = (stateConfig = {}, appConfig = {}) => {
    const rules = stateConfig.rules || {};
    const large101 = new Set(rules.largeGroup101 || []);
    const restrictedSet = new Set(Object.keys(stateConfig.restrictedStates || {}));
    const importantMap = stateConfig.importantStates || {};

    const stateDataFinal = {};

    uspsList.forEach((code) => {
      stateDataFinal[code] = {
        carrier: (restrictedSet.has(code) ? 'Restricted' : (rules.defaultCarrier || 'Aetna')),
        largeGroupDefinition: (large101.has(code) ? '101+ FTEs' : '51+ FTEs'),
        coverageNotes: 'Standard Aetna coverage',
        sdiRequirements: '—',
        salesNotes: ''
      };
    });

    // Apply restricted overrides
    Object.entries(stateConfig.restrictedStates || {}).forEach(([code, o]) => {
      if (!stateDataFinal[code]) stateDataFinal[code] = {};
      Object.assign(stateDataFinal[code], {
        carrier: 'Restricted',
        coverageNotes: o.coverageNotes || 'State-specific PEO compliance rules',
        sdiRequirements: o.sdiRequirements || '—',
        salesNotes: o.salesNotes || ''
      });
    });

    // Apply important states
    Object.entries(importantMap).forEach(([code, o]) => {
      if (!stateDataFinal[code]) stateDataFinal[code] = {};
      Object.assign(stateDataFinal[code], {
        important: true,
        ageGroupNotes: o.ageGroupNotes || stateDataFinal[code].ageGroupNotes,
        salesNotes: o.salesNotes || stateDataFinal[code].salesNotes
      });
    });

    // Apply notable (non-starred) states
    Object.entries(stateConfig.notableStates || {}).forEach(([code, o]) => {
      if (!stateDataFinal[code]) stateDataFinal[code] = {};
      Object.assign(stateDataFinal[code], {
        coverageNotes: o.coverageNotes || stateDataFinal[code].coverageNotes,
        sdiRequirements: o.sdiRequirements || stateDataFinal[code].sdiRequirements,
        salesNotes: o.salesNotes || stateDataFinal[code].salesNotes
      });
    });

    return stateDataFinal;
  };

  /* ============================================================================
     Section: map rendering (D3 + TopoJSON)
     ============================================================================ */

  /**
   * Main render function — configures projection, draws states, labels, badges,
   * legend, and wires UI handlers. Mirrors original logic exactly.
   *
   * @param {Object} stateDataFinal keyed by USPS code
   * @param {Object} appConfig
   */
  const renderMap = async (stateDataFinal, appConfig = {}) => {
    // Basic SVG setup
    const svg = d3.select('#map');
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Projection / path
    const projection = d3.geoAlbersUsa().translate([width / 2, height / 2])
      .scale(Math.min(width, height) * 1.25);  // Map scale adjusted for better fit
    const path = d3.geoPath().projection(projection);

    // Tooltip and detail elements are already assigned above
    // Load topojson
    const usTopo = await d3.json(TOPO_URL);
    const statesGeo = topojson.feature(usTopo, usTopo.objects.states);
    const statesMesh = topojson.mesh(usTopo, usTopo.objects.states, (a, b) => a !== b);

    // Root group
    const g = svg.append('g').attr('id', 'gRoot');

    // Draw states
    const statePaths = g.selectAll('path.state')
      .data(statesGeo.features)
      .join('path')
      .attr('class', 'state')
      .attr('d', path)
      .attr('fill', (d) => {
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        return colorForCarrier(stateDataFinal[code]?.carrier);
      })
      .attr('stroke', 'rgba(255,255,255,.16)')
      .attr('stroke-width', 0.8)
      .on('mousemove', (event, d) => {
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        const name = d.properties.name;
        const info = stateDataFinal[code] || {};
        showTooltip(event.pageX, event.pageY, name, code, info);
      })
      .on('mouseleave', hideTooltip)
      .on('click', (event, d) => {
        statePaths.classed('selected', false);
        d3.select(event.currentTarget).classed('selected', true);
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        const name = d.properties.name;
        renderDetail(name, code, stateDataFinal[code] || {});
      })
      .attr('tabindex', 0)
      .on('keydown', (event, d) => {
        if (event.key === 'Enter') {
          const node = event.currentTarget;
          statePaths.classed('selected', false);
          d3.select(node).classed('selected', true);
          const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
          const name = d.properties.name;
          renderDetail(name, code, stateDataFinal[code] || {});
        }
      });

    // Labels (abbr)
    const labels = g.selectAll('text.abbr')
      .data(statesGeo.features)
      .join('text')
      .attr('class', 'abbr')
      .attr('transform', (d) => `translate(${path.centroid(d)})`)
      .html((d) => `<tspan>${(fipsToUSPS[d.id] || nameToUSPS[d.properties.name])}</tspan>`);

    // Offsets for small / overlapping states
    const offsets = {
      RI: [12, -2], CT: [12, 2], MA: [18, -8], NJ: [10, 6],
      DE: [14, 8], MD: [20, 12], DC: [-6, 8]
    };

    labels.attr('transform', (d) => {
      const c = path.centroid(d);
      const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
      const off = offsets[code];
      return off ? `translate(${c[0] + off[0]},${c[1] + off[1]})` : `translate(${c[0]},${c[1]})`;
    });

    // Asterisk badges for states with important notes
    const badgedFeatures = statesGeo.features.filter((d) => stateDataFinal[(fipsToUSPS[d.id] || nameToUSPS[d.properties.name])]?.important);
    const badges = g.selectAll('text.badge')
      .data(badgedFeatures)
      .join('text')
      .attr('class', 'badge')
      .attr('transform', (d) => {
        const c = path.centroid(d);
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        const off = offsets[code] || [0, 0];
        return `translate(${c[0] + off[0] + 10},${c[1] + off[1] - 8})`;
      })
      .text('*');

    // Borders overlay
    g.append('path')
      .datum(statesMesh)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,.33)')
      .attr('stroke-width', 0.6)
      .attr('d', path);

    /* Legend rendering (embedded SVG legend that avoids overlapping) */
    let legend;
    const renderLegend = () => {
      if (legend) legend.remove();
      legend = svg.append('g').attr('id', 'svgLegend');

      // Compute map bounding box
      const innerX = 0;
      const innerY = 0;
      const innerW = svg.node().clientWidth;
      const innerH = svg.node().clientHeight;


      // Responsive sizing
      const scale = Math.max(1, Math.min(1, svg.node().clientWidth / 1000));
      const PAD = 16 * scale;
      const ITEM_H = 20 * scale;
      const SW = 12 * scale;
      const RADIUS = 10 * scale;
      const FONT = 12 * scale;
      const BOX_W = Math.min(260, Math.max(220, svg.node().clientWidth * 0.22));

      const items = [
        { label: (appConfig.legend?.aetna || 'Aetna'), color: getCSSVar('--aetna') },
        { label: (appConfig.legend?.restricted || 'Restricted'), color: getCSSVar('--restricted') }
      ];

      const legendMargin = Math.max(16, svg.node().clientWidth * 0.02);
      const legendX = innerX + legendMargin;
      const legendY = innerY + legendMargin;

      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      const bgColor = isLightTheme ? 'rgba(255,255,255,0.9)' : 'rgba(19,19,26,0.92)';
      const strokeColor = isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';

      const bg = legend.append('rect')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('rx', RADIUS)
        .attr('ry', RADIUS)
        .attr('width', BOX_W)
        .attr('fill', bgColor)
        .attr('stroke', strokeColor);

      const titleEl = legend.append('text')
        .attr('x', legendX + PAD)
        .attr('y', legendY + PAD)
        .attr('fill', isLightTheme ? '#111827' : '#EDEDEF')
        .attr('font-size', `${FONT}px`)
        .attr('font-weight', '700')
        .attr('dominant-baseline', 'hanging')
        .text('Legend');

      const titleBox = titleEl.node().getBBox();
      let yCursor = titleBox.y + titleBox.height + (8 * scale);

      // Items
      items.forEach((it) => {
        legend.append('rect')
          .attr('x', legendX + PAD)
          .attr('y', yCursor)
          .attr('width', SW)
          .attr('height', SW)
          .attr('rx', 3 * scale)
          .attr('fill', it.color)
          .attr('stroke', isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,.2)');

        legend.append('text')
          .attr('x', legendX + PAD + SW + 6 * scale)
          .attr('y', yCursor)
          .attr('fill', isLightTheme ? '#111827' : '#EDEDEF')
          .attr('font-size', `${FONT}px`)
          .attr('font-weight', '500')
          .attr('dominant-baseline', 'hanging')
          .text(it.label);

        yCursor += ITEM_H;
      });

      // Resize bg to content
      const boxH = (yCursor - legendY) + PAD;
      bg.attr('height', boxH);
    };

    renderLegend();
    window.addEventListener('resize', d3.zoomIdentity, { passive: true }); // noop to keep layout smooth
    window.addEventListener('resize', d3.timeout(renderLegend, 0));     // re-render legend on resize

    // Clean up stray undefined text nodes after legend render
    setTimeout(() => {
      g.selectAll('text')
        .filter(function () {
          const t = (this.textContent || '').trim().toLowerCase();
          const isValidAbbr = /^[A-Z]{2}$/.test((this.textContent || '').trim());
          const isStar = (this.textContent || '').trim() === '*';
          return (t === 'undefined' || t === '' || (!isValidAbbr && !isStar));
        })
        .remove();
    }, 200);

    /* ============================================================================
       Section: Search
       ============================================================================ */

    searchInput.addEventListener('input', (e) => {
      const q = (e.target.value || '').trim().toLowerCase();
      if (!q) {
        statePaths.classed('selected', false);
        return;
      }

      const match = statesGeo.features.find((f) => {
        const code = (fipsToUSPS[f.id] || nameToUSPS[f.properties.name] || '').toLowerCase();
        return f.properties.name.toLowerCase().startsWith(q) || code.startsWith(q);
      });

      if (match) {
        const node = statePaths.filter((d) => d === match).node();
        if (node) {
          statePaths.classed('selected', false);
          node.classList.add('selected');
          const code = (fipsToUSPS[match.id] || nameToUSPS[match.properties.name]);
          renderDetail(match.properties.name, code, stateDataFinal[code] || {});

          // Gentle pan/zoom
          const [[x0, y0], [x1, y1]] = path.bounds(match);
          const s = Math.min(5, 0.85 / Math.max((x1 - x0) / width, (y1 - y0) / height));
          const tx = (width / 2) - s * (x0 + x1) / 2;
          const ty = (height / 2) - s * (y0 + y1) / 2;
          g.transition().duration(550).attr('transform', `translate(${tx},${ty}) scale(${s})`);
        }
      }
    });

    /* ============================================================================
       Section: Filters
       ============================================================================ */

    const filterInputs = Array.from(document.querySelectorAll('.filters input'));

    const applyFilters = () => {
      const active = new Set(filterInputs.filter(i => i.checked).map(i => i.value.toLowerCase()));

      statePaths.classed('dim', (d) => {
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        const info = stateDataFinal[code] || {};
        const carrier = (info.carrier || 'Unknown').toLowerCase();
        const includeCarrier = active.has(carrier);
        const includeImportant = info.important ? active.has('important') : true;
        return !(includeCarrier && includeImportant);
      });

      labels.each(function (d) {
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        const info = stateDataFinal[code] || {};
        const carrier = (info.carrier || 'Unknown').toLowerCase();
        const includeCarrier = active.has(carrier);
        const includeImportant = info.important ? active.has('important') : true;
        d3.select(this).attr('opacity', (includeCarrier && includeImportant) ? 1 : 0.25);
      });

      badges.attr('opacity', (d) => {
        const code = (fipsToUSPS[d.id] || nameToUSPS[d.properties.name]);
        const info = stateDataFinal[code] || {};
        const includeImportant = info.important ? active.has('important') : true;
        const carrier = (info.carrier || 'Unknown').toLowerCase();
        return (active.has(carrier) && includeImportant) ? 1 : 0.15;
      });
    };

    filterInputs.forEach((inp) => inp.addEventListener('change', applyFilters));
    applyFilters();

    /* ============================================================================
       Section: Tooltip & details rendering
       ============================================================================ */

    /**
     * Show tooltip near the mouse with state summary.
     * @param {number} x - pageX
     * @param {number} y - pageY
     * @param {string} name - state name
     * @param {string} code - USPS code
     * @param {Object} info - state info object
     */
    function showTooltip(x, y, name, code, info) {
      tooltipEl.html(`
        <h4>${name} <span style="opacity:.75;font-weight:500;">(${code})${info.important ? ' *' : ''}</span></h4>
        <div class="mini-kv">
          <div>Carrier</div><div><span class="dot" style="background:${colorForCarrier(info.carrier)}"></span>${info.carrier || 'Unknown'}</div>
          <div>Large Group</div><div>${info.largeGroupDefinition || 'TBD'}</div>
          <div>Coverage</div><div>${info.coverageNotes || 'TBD'}</div>
          <div>SDI</div><div>${info.sdiRequirements || '—'}</div>
        </div>
        ${info.salesNotes ? `<div style="margin-top:6px; color:var(--muted)">${info.salesNotes}</div>` : ''}
      `);
      tooltipEl.style('left', `${x}px`)
        .style('top', `${y}px`)
        .style('opacity', 1)
        .attr('aria-hidden', 'false')
        .style('transform', 'translate(-50%,-120%)');
    }

    function hideTooltip() {
      tooltipEl.style('opacity', 0).attr('aria-hidden', 'true');
    }

    /**
     * Render the detailed sidebar for a selected state.
     * @param {string} name
     * @param {string} code
     * @param {Object} info
     */
    function renderDetail(name, code, info) {
      detailTitle.text(`${name} (${code})${info.important ? ' *' : ''}`);
      detailBodyKV.html('');

      const rows = [
        ['Primary carrier', info.carrier || 'Unknown'],
        ['Large group definition', info.largeGroupDefinition || 'TBD'],
        ['Coverage notes', info.coverageNotes || 'TBD'],
        ['SDI requirements', info.sdiRequirements || '—'],
        ['Sales nuances', info.salesNotes || '—']
      ];

      rows.forEach(([k, v]) => {
        detailBodyKV.append('div').text(k);
        if (k === 'Primary carrier') {
          detailBodyKV.append('div').html(`<span class="chip"><span style="width:8px;height:8px;border-radius:99px;background:${colorForCarrier(info.carrier)};display:inline-block"></span>${v}</span>`);
        } else {
          detailBodyKV.append('div').text(v);
        }
      });
    }

    /* ============================================================================
       Section: Page interactions (reset selection, export PNG, theme toggle)
       ============================================================================ */

    // Reset selection by clicking outside the map
    document.body.addEventListener('click', (e) => {
      const mapEl = document.getElementById('map');
      if (!mapEl.contains(e.target)) {
        statePaths.classed('selected', false);
        g.transition().duration(400).attr('transform', 'translate(0,0) scale(1)');
        detailTitle.text('No state selected');
        detailBodyKV.html(`
          <div>Primary carrier</div><div>—</div>
          <div>Large group definition</div><div>—</div>
          <div>Age group notes</div><div>—</div>
          <div>Sales nuances</div><div>—</div>`);
      }
    }, true);

    // Export PNG
    exportBtn.addEventListener('click', downloadPNG);

    function downloadPNG() {
      const svgNode = document.getElementById('map');
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgNode);
      const bbox = svgNode.getBoundingClientRect();
      const pixelRatio = Math.max(2, window.devicePixelRatio || 1);

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bbox.width * pixelRatio);
      canvas.height = Math.round(bbox.height * pixelRatio);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b0f18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.onload = () => {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
        const a = document.createElement('a');
        a.download = 'niural_us_carrier_map.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    }

    // Theme toggle logic
    if (localStorage.getItem('niuralTheme') === 'light') {
      rootEl.setAttribute('data-theme', 'light');
      themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      if (isLight) {
        rootEl.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('niuralTheme', 'dark');
      } else {
        rootEl.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('niuralTheme', 'light');
      }

      // Re-render the legend background to reflect theme change
      if (typeof renderLegend === 'function') renderLegend();
    });
  }; // end renderMap

  /* ============================================================================
     Bootstrap
     ============================================================================ */
  // Start the app
  init().catch((err) => {
    // Keep behaviour identical to original (no change) but surface a console error
    console.error('Failed to initialize Niural US Carrier Map', err);
  });

})();
