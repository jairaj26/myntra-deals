/**
 * Myntra Deal Sentinel - Interactive Bookmarklet
 * Version: 2.1.0
 * 
 * Injects a floating deal-hunting panel directly on Myntra.
 * Fetches server-filtered deals for curated brands sorted by highest discount.
 */

(function () {
  const PANEL_ID = 'myntra-deal-sentinel-panel';

  // Toggle panel if already open
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
    return;
  }

  const DEFAULT_PINCODE = '560032';

  // Embedded Curated Brand Lists (Modular by Category)
  const CATEGORY_DATA = {
    "Haircare": {
      basePath: "personal-care",
      brands: [
        "&honey", "2.Oh!", "ARATA", "Bare Anatomy", "BBLUNT", "Biolage", "BIOTOP PROFESSIONAL",
        "BRILLARE", "Dabur", "Dove", "Dr. Batras", "Earth Rhythm", "Fix My Curls", "Garnier",
        "Head & Shoulders", "indulekha", "Kesh King", "Khadi Natural", "LOreal", "LOreal Professionnel",
        "Mamaearth", "MATRIX", "MOROCCANOIL", "Nat Habit", "Neutrogena", "OGX", "OLAPLEX", "Pantene",
        "Pilgrim", "Plum", "Schwarzkopf", "Schwarzkopf PROFESSIONAL", "Streax", "Streax Professional",
        "Sunsilk", "THE BODY SHOP", "TRESemme", "Tresemme", "Trichup", "Vedix", "WELLA PROFESSIONALS",
        "Wella Professionals", "WishCare", "WOW Skin Science"
      ]
    },
    "Skincare": {
      basePath: "personal-care",
      brands: [
        "Anua", "Aqualogica", "Aroma Magic", "Aveeno", "Aveeno Baby", "Avene", "Axis-Y", "AYUR HERBALS",
        "Be Bodywise", "Beauty of Joseon", "Bella Vita Organic", "BIODERMA", "Biotique", "Blue Nectar",
        "BOROLINE", "BOROPLUS", "Burt's Bees", "Celimax", "CeraVe", "Cetaphil", "Chemist at Play",
        "CLARINS", "Clean & Clear", "Clinique", "Conscious Chemist", "COSRX", "Daily Life Forever52",
        "deconstruct", "Dermalogica", "Dettol", "DOT & KEY", "DR. SHETHS", "Earth Rhythm",
        "Elizabeth Arden", "Estee Lauder", "ETUDE", "Eucerin", "Eveline Cosmetics", "everyuth Naturals",
        "FIXDERMA", "Forest Essentials", "FoxTale", "Garnier", "Ghar Soaps", "Himalaya", "Innisfree",
        "Isntree", "KAMA AYURVEDA", "Khadi Natural", "Klairs", "L.A. Girl", "Lakme", "Laneige",
        "Lotus Herbals", "Love Beauty & Planet", "Mamaearth", "mCaffeine", "Minimalist", "Neutrogena",
        "Nivea", "NIVEA", "Olay", "Paula's Choice", "Pears", "Pilgrim", "Plum", "POND'S",
        "Quench Botanics", "Re'equil", "Sanfe", "Sebamed", "Simple", "The Body Shop", "THE BODY SHOP",
        "The Derma co.", "The Face Shop", "The Ordinary", "Torriden", "Vaseline", "Vicco", "VLCC",
        "WishCare", "WOW Skin Science"
      ]
    },
    "Perfumes": {
      basePath: "personal-care",
      brands: [
        "4711", "ADIDAS", "Afnan", "AHMED AL MAGHRIBI", "Ajmal", "Al-Nuaim", "AL Hubb", "Arabiyat Prestige",
        "Archies", "Armaf", "AXE", "Azzaro", "Bath & Body Works", "BEARDO", "Bella Vita Organic",
        "Bombay Shaving Company", "BRUT", "Bvlgari", "Calvin Klein", "Carolina Herrera", "Coach",
        "DAVIDOFF", "Denver", "DIESEL", "Dior", "Elizabeth Arden", "EM5", "Engage", "Envy",
        "Fastrack", "Fogg", "Forest Essentials", "Franck Olivier", "FRENCH ESSENCE", "GUCCI",
        "Guerlain", "Guess", "HE", "Hugo Boss", "Issey Miyake", "Jaguar", "Jimmy Choo", "Jo Malone London",
        "KAMA AYURVEDA", "Kenzo", "Lacoste", "Lattafa", "Maison Margiela", "Marks & Spencer", "MINISO",
        "Montblanc", "Nautica", "Nike", "Old Spice", "One8 by Virat Kohli", "Paco Rabanne", "Park Avenue",
        "Police", "Prada", "Ralph Lauren", "Rasasi", "Skinn by Titan", "The Body Shop", "THE BODY SHOP",
        "The Man Company", "Titan", "Tom Ford", "Ustraa", "Versace", "VERSACE", "Victoria's Secret",
        "WILD STONE", "Wild Stone", "Yardley London", "Yves Saint Laurent"
      ]
    },
    "Makeup": {
      basePath: "personal-care",
      brands: [
        "ANASTASIA BEVERLY HILLS", "bareMinerals", "Blue Heaven", "Bobbi Brown", "Chambor", "Character",
        "Colorbar", "Coloressence", "Colors Queen", "Daily Life Forever52", "e.l.f.", "ELLE 18",
        "essence", "Estee Lauder", "ETUDE", "FACES CANADA", "FAE BEAUTY", "FOCALLURE", "Huda Beauty",
        "HUDA BEAUTY", "Insight Cosmetics", "Kay Beauty", "Kiko Milano", "L.A. Girl", "Lakme",
        "M.A.C", "Makeup Revolution London", "MARS", "MATTLOOK", "Maybelline", "Milani",
        "NYX Professional Makeup", "PAC", "Plum", "Recode", "Renee", "Revlon", "Sephora Collection",
        "Smashbox", "SUGAR", "SWISS BEAUTY", "Too Faced", "Urban Decay", "Wet n Wild"
      ]
    },
    "Men Topwear": {
      basePath: "men-topwear",
      brands: [
        "ADIDAS",
        "Aeropostale",
        "Allen Solly",
        "Allen Solly Sport",
        "AMERICAN EAGLE OUTFITTERS",
        "Andamen",
        "Antony Morato",
        "Arrow",
        "Arrow New York",
        "Arrow Sport",
        "Basics",
        "Being Human",
        "Bewakoof",
        "Blackberrys",
        "Calvin Klein Jeans",
        "Cantabil",
        "Celio",
        "Classic Polo",
        "ColorPlus",
        "Columbia",
        "Crimsoune Club",
        "Dennis Lingo",
        "DIESEL",
        "Difference of Opinion",
        "Duke",
        "Fabindia",
        "FAHRENHEIT",
        "FILA",
        "Flying Machine",
        "FOREVER 21",
        "French Connection",
        "GANT",
        "GAP",
        "GUESS",
        "H&M",
        "HERE&NOW",
        "HIGHLANDER",
        "House of Pataudi",
        "HRX by Hrithik Roshan",
        "Indian Terrain",
        "INVICTUS",
        "Jack & Jones",
        "John Players",
        "Kook N Keech",
        "Lacoste",
        "Lee",
        "Lee Cooper",
        "Levis",
        "Linen Club",
        "LOCOMOTIVE",
        "Louis Philippe",
        "Louis Philippe Jeans",
        "Louis Philippe Sport",
        "MANGO MAN",
        "Marks & Spencer",
        "Mast & Harbour",
        "Metronaut",
        "Monte Carlo",
        "Mufti",
        "Nautica",
        "New Balance",
        "Nike",
        "Park Avenue",
        "Parx",
        "Pepe Jeans",
        "Peter England",
        "Peter England Casuals",
        "Powerlook",
        "Puma",
        "RARE RABBIT",
        "Raymond",
        "Red Tape",
        "Reebok",
        "Roadster",
        "SELECTED",
        "Snitch",
        "SPYKAR",
        "Status Quo",
        "Ted Baker",
        "THE BEAR HOUSE",
        "The Indian Garage Co",
        "The Souled Store",
        "Tommy Hilfiger",
        "U.S. Polo Assn.",
        "U.S. Polo Assn. Denim Co.",
        "UNDER ARMOUR",
        "United Colors of Benetton",
        "Van Heusen",
        "Van Heusen Sport",
        "Wildcraft",
        "Wrangler",
        "WROGN"
]
    }
  };

  // State
  let currentProducts = [];
  let isFetching = false;

  // Build Floating UI Panel
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <style>
      #${PANEL_ID} {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 440px;
        max-height: 90vh;
        background: #181820;
        color: #f3f4f6;
        border-radius: 14px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        border: 1px solid #33333d;
        overflow: hidden;
      }
      #${PANEL_ID} * { box-sizing: border-box; }
      #${PANEL_ID} .hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #23232c;
        border-bottom: 1px solid #383844;
      }
      #${PANEL_ID} .hdr h3 { margin: 0; font-size: 15px; font-weight: 700; color: #ff3f6c; }
      #${PANEL_ID} .close-btn {
        background: none; border: none; color: #9ca3af; font-size: 20px; cursor: pointer; padding: 2px 6px;
      }
      #${PANEL_ID} .close-btn:hover { color: #fff; }
      #${PANEL_ID} .controls { padding: 12px 16px; background: #1e1e26; border-bottom: 1px solid #33333d; }
      #${PANEL_ID} .row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
      #${PANEL_ID} label { font-size: 12px; color: #9ca3af; }
      #${PANEL_ID} select, #${PANEL_ID} input {
        background: #2a2a36; border: 1px solid #444455; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 12px;
      }
      #${PANEL_ID} .cat-btns { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
      #${PANEL_ID} .cat-btn {
        flex: 1; min-width: 85px; padding: 7px 4px; background: #2f2f3d; border: 1px solid #444458;
        color: #e5e7eb; border-radius: 6px; cursor: pointer; font-size: 11.5px; font-weight: 600; text-align: center;
        transition: all 0.2s;
      }
      #${PANEL_ID} .cat-btn.active, #${PANEL_ID} .cat-btn:hover {
        background: #ff3f6c; border-color: #ff3f6c; color: #fff;
      }
      #${PANEL_ID} .fetch-btn {
        width: 100%; padding: 10px; background: #10b981; border: none; color: #fff; font-weight: 700;
        font-size: 13px; border-radius: 6px; cursor: pointer; transition: background 0.2s;
      }
      #${PANEL_ID} .fetch-btn:hover { background: #059669; }
      #${PANEL_ID} .fetch-btn:disabled { background: #4b5563; cursor: not-allowed; }
      #${PANEL_ID} .status { padding: 6px 16px; font-size: 11px; color: #10b981; background: #15151c; }
      #${PANEL_ID} .results-container {
        flex: 1; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 10px;
      }
      #${PANEL_ID} .card {
        display: flex; gap: 10px; background: #23232e; border: 1px solid #373747; border-radius: 8px;
        padding: 8px; text-decoration: none; color: inherit; transition: transform 0.15s, border-color 0.15s;
      }
      #${PANEL_ID} .card:hover { transform: translateY(-2px); border-color: #ff3f6c; }
      #${PANEL_ID} .card img { width: 68px; height: 90px; object-fit: cover; border-radius: 4px; background: #333; }
      #${PANEL_ID} .card-info { flex: 1; min-width: 0; }
      #${PANEL_ID} .card-brand { font-size: 11px; font-weight: 700; color: #ff3f6c; text-transform: uppercase; }
      #${PANEL_ID} .card-title {
        font-size: 12px; font-weight: 500; color: #e5e7eb; white-space: nowrap; overflow: hidden;
        text-overflow: ellipsis; margin: 2px 0 4px 0;
      }
      #${PANEL_ID} .price-row { display: flex; align-items: baseline; gap: 6px; margin: 4px 0; }
      #${PANEL_ID} .price-deal { font-size: 14px; font-weight: 800; color: #10b981; }
      #${PANEL_ID} .price-mrp { font-size: 11px; text-decoration: line-through; color: #9ca3af; }
      #${PANEL_ID} .badge-discount {
        background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444;
        font-weight: 700; font-size: 10px; padding: 1px 4px; border-radius: 4px;
      }
      #${PANEL_ID} .rating-pill { font-size: 10px; color: #fbbf24; }
      #${PANEL_ID} .footer {
        padding: 8px 16px; background: #1c1c24; border-top: 1px solid #33333d; font-size: 11px; color: #9ca3af;
        display: flex; justify-content: space-between; align-items: center;
      }
    </style>

    <div class="hdr">
      <h3>🔥 Myntra Deal Sentinel</h3>
      <button class="close-btn" id="mds-close">&times;</button>
    </div>

    <div class="controls">
      <label>1. Select Category:</label>
      <div class="cat-btns" id="mds-categories">
        ${Object.keys(CATEGORY_DATA).map((cat, idx) => `
          <button class="cat-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat}">${cat}</button>
        `).join('')}
      </div>

      <div class="row">
        <label>Min Discount:</label>
        <select id="mds-discount">
          <option value="55">55% & Above</option>
          <option value="60">60% & Above</option>
          <option value="65" selected>65% & Above</option>
          <option value="70">70% & Above</option>
          <option value="75">75% & Above</option>
          <option value="80">80% & Above</option>
        </select>

        <label style="margin-left: 10px;">Pincode:</label>
        <input type="text" id="mds-pincode" value="${DEFAULT_PINCODE}" style="width: 75px;" />
      </div>

      <button class="fetch-btn" id="mds-fetch-btn">⚡ Fetch Highest Discount Deals</button>
    </div>

    <div class="status" id="mds-status">Ready. Select a category and hit Fetch.</div>

    <div class="results-container" id="mds-results">
      <div style="text-align: center; color: #6b7280; padding: 40px 10px;">
        No deals loaded yet. Click Fetch to scan Myntra for top brand discounts.
      </div>
    </div>

    <div class="footer">
      <span id="mds-count">0 items found</span>
      <span>Pin: <strong id="mds-pin-lbl">${DEFAULT_PINCODE}</strong></span>
    </div>
  `;

  document.body.appendChild(panel);

  // Bind Events
  const closeBtn = panel.querySelector('#mds-close');
  const catBtns = panel.querySelectorAll('.cat-btn');
  const fetchBtn = panel.querySelector('#mds-fetch-btn');
  const statusEl = panel.querySelector('#mds-status');
  const resultsEl = panel.querySelector('#mds-results');
  const countEl = panel.querySelector('#mds-count');
  const pincodeInput = panel.querySelector('#mds-pincode');
  const discountSelect = panel.querySelector('#mds-discount');
  const pinLbl = panel.querySelector('#mds-pin-lbl');

  let selectedCategory = Object.keys(CATEGORY_DATA)[0];

  closeBtn.onclick = () => { panel.style.display = 'none'; };

  catBtns.forEach(btn => {
    btn.onclick = () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
    };
  });

  pincodeInput.onchange = () => {
    pinLbl.textContent = pincodeInput.value.trim() || DEFAULT_PINCODE;
  };

  // Fetch logic
  fetchBtn.onclick = async () => {
    if (isFetching) return;
    isFetching = true;
    fetchBtn.disabled = true;
    fetchBtn.textContent = '⏳ Fetching deals...';

    const pincode = pincodeInput.value.trim() || DEFAULT_PINCODE;
    const minDiscount = parseInt(discountSelect.value, 10);
    const catConfig = CATEGORY_DATA[selectedCategory];

    if (!catConfig || !catConfig.brands.length) {
      statusEl.textContent = 'Category not found or has no brands configured.';
      isFetching = false;
      fetchBtn.disabled = false;
      return;
    }

    statusEl.textContent = `Scanning ${catConfig.brands.length} brands in ${selectedCategory}...`;
    resultsEl.innerHTML = '<div style="text-align: center; padding: 30px; color: #9ca3af;">Scanning Myntra for steepest discounts...</div>';

    try {
      // Chunk brands into batches of 35
      const BATCH_SIZE = 35;
      const brandBatches = [];
      for (let i = 0; i < catConfig.brands.length; i += BATCH_SIZE) {
        brandBatches.push(catConfig.brands.slice(i, i + BATCH_SIZE));
      }

      let allFetchedProducts = [];

      for (let bIdx = 0; bIdx < brandBatches.length; bIdx++) {
        const batch = brandBatches[bIdx];
        const brandsParam = batch.join(',');
        const targetUrl = `https://www.myntra.com/${catConfig.basePath}?f=Brand:${encodeURIComponent(brandsParam)}&sort=discount&p=1`;

        statusEl.textContent = `Fetching batch ${bIdx + 1}/${brandBatches.length}...`;

        const resp = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'x-location-context': `pincode=${pincode};source=USER_INPUT`,
            'x-meta-app': 'channel=web',
            'x-myntraweb': 'Yes',
            'x-requested-with': 'browser'
          },
          credentials: 'include'
        });

        if (!resp.ok) {
          console.warn('Batch fetch failed with status:', resp.status);
          continue;
        }

        const html = await resp.text();
        const extracted = extractProductsFromHtml(html);
        if (extracted && extracted.length) {
          allFetchedProducts.push(...extracted);
        }
      }

      // Deduplicate by productId and filter by min discount
      const uniqueMap = new Map();
      allFetchedProducts.forEach(p => {
        if (!uniqueMap.has(p.productId)) {
          const mrp = p.mrp || 0;
          const price = p.price || 0;
          if (mrp > 0 && price > 0) {
            const discountPct = Math.round(((mrp - price) / mrp) * 100);
            if (discountPct >= minDiscount) {
              uniqueMap.set(p.productId, { ...p, calculatedDiscount: discountPct });
            }
          }
        }
      });

      // Sort by discount percentage descending
      const sortedDeals = Array.from(uniqueMap.values()).sort((a, b) => b.calculatedDiscount - a.calculatedDiscount);
      currentProducts = sortedDeals;

      renderDeals(sortedDeals);
      statusEl.textContent = `Done! Found ${sortedDeals.length} deals at ${minDiscount}%+ off.`;
      countEl.textContent = `${sortedDeals.length} items found`;

    } catch (err) {
      console.error('Fetch error:', err);
      statusEl.textContent = 'Error fetching deals: ' + err.message;
      resultsEl.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">Failed to fetch: ${err.message}</div>`;
    } finally {
      isFetching = false;
      fetchBtn.disabled = false;
      fetchBtn.textContent = '⚡ Fetch Highest Discount Deals';
    }
  };

  // Helper to extract JSON objects matching curly braces
  function extractJsonObject(str, startIdx) {
    let braceCount = 0;
    let inString = false;
    let escape = false;

    for (let i = startIdx; i < str.length; i++) {
      const char = str[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            return str.substring(startIdx, i + 1);
          }
        }
      }
    }
    return null;
  }

  // Helper to extract products from either window.__myx or pageStateData
  function extractProductsFromHtml(html) {
    // 1. Try window.__myx (standard for filtered search URLs)
    const myxPrefix = 'window.__myx = ';
    const myxIdx = html.indexOf(myxPrefix);
    if (myxIdx !== -1) {
      try {
        const jsonStr = extractJsonObject(html, myxIdx + myxPrefix.length);
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          const prods = parsed?.searchData?.results?.products;
          if (prods && prods.length) return prods;
        }
      } catch (e) {
        console.warn('myx parse error:', e);
      }
    }

    // 2. Try pageStateData (standard for root category landing pages)
    const psPrefix = 'var pageStateData = { data: ';
    const psIdx = html.indexOf(psPrefix);
    if (psIdx !== -1) {
      try {
        const jsonStr = extractJsonObject(html, psIdx + psPrefix.length);
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          if (parsed?.products?.length) return parsed.products;
        }
      } catch (e) {
        console.warn('pageStateData parse error:', e);
      }
    }

    return [];
  }

  // Render product cards
  function renderDeals(products) {
    if (!products.length) {
      resultsEl.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 30px;">No deals found matching this discount threshold. Try lowering the discount filter.</div>';
      return;
    }

    resultsEl.innerHTML = products.map(p => {
      const fullUrl = 'https://www.myntra.com/' + (p.landingPageUrl || '');
      const ratingStr = p.rating ? `★ ${p.rating.toFixed(1)} (${(p.ratingCount || 0).toLocaleString()})` : '';

      return `
        <a class="card" href="${fullUrl}" target="_blank" rel="noopener">
          <img src="${p.searchImage}" alt="${p.brand}" loading="lazy" />
          <div class="card-info">
            <div class="card-brand">${p.brand}</div>
            <div class="card-title" title="${p.product}">${p.product}</div>
            <div class="price-row">
              <span class="price-deal">₹${p.price}</span>
              <span class="price-mrp">₹${p.mrp}</span>
              <span class="badge-discount">${p.calculatedDiscount}% OFF</span>
            </div>
            ${ratingStr ? `<div class="rating-pill">${ratingStr}</div>` : ''}
          </div>
        </a>
      `;
    }).join('');
  }
})();
