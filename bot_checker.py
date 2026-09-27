#!/usr/bin/env python3
"""
Myntra Deal Sentinel - Automated Telegram Bot Dispatcher
Designed to run on GitHub Actions or locally via cron.

Features:
- Reads categories and brands from myntra_brands_and_categories.json
- Queries Myntra server-filtered by brand & sorted by discount
- Injects pincode location context (x-location-context: pincode=560032;source=USER_INPUT)
- Robust extraction from both window.__myx and pageStateData
- Deduplicates against seen_deals.json to ensure zero spam
- Posts rich photo cards to Telegram via Telegram Bot API
"""

import os
import sys
import json
import time
import urllib.parse
from datetime import datetime, timezone
import requests

# Ensure UTF-8 output on all operating systems (Windows console fix for emojis)
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

# ----------------- Configuration & Env Vars -----------------
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "myntra_brands_and_categories.json")
SEEN_DEALS_PATH = os.path.join(os.path.dirname(__file__), "seen_deals.json")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

# Load JSON Config
if os.path.exists(CONFIG_PATH):
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        CONFIG = json.load(f)
else:
    print(f"Error: Configuration file not found at {CONFIG_PATH}")
    sys.exit(1)

PINCODE = os.getenv("PINCODE", CONFIG.get("pincode", "560032")).strip()
MIN_DISCOUNT = int(os.getenv("MIN_DISCOUNT_PERCENT", CONFIG.get("botMinDiscount", 70)))
BATCH_SIZE = 35  # Max brands per URL query to keep URLs clean and safe

# ----------------- Helper Functions -----------------

def load_seen_deals():
    if os.path.exists(SEEN_DEALS_PATH):
        try:
            with open(SEEN_DEALS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return set(data.get("seenProductIds", []))
        except Exception as e:
            print(f"Warning: Could not parse seen_deals.json: {e}")
    return set()

def save_seen_deals(seen_set):
    payload = {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "totalDealsSeen": len(seen_set),
        "seenProductIds": sorted(list(seen_set))
    }
    with open(SEEN_DEALS_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

def extract_products_from_html(html_text):
    """Extracts raw JSON product list from Myntra's SSR state (window.__myx or pageStateData)."""
    # 1. Check window.__myx (standard for filtered search URLs)
    idx = html_text.find("window.__myx = ")
    if idx != -1:
        try:
            d, _ = json.JSONDecoder().raw_decode(html_text[idx + len("window.__myx = "):])
            products = d.get("searchData", {}).get("results", {}).get("products", [])
            if products:
                return products
        except Exception as e:
            print(f"  [Parse] window.__myx parse error: {e}")

    # 2. Check pageStateData (standard for root category landing pages)
    idx = html_text.find("var pageStateData = { data: ")
    if idx != -1:
        try:
            d, _ = json.JSONDecoder().raw_decode(html_text[idx + len("var pageStateData = { data: "):])
            products = d.get("products", [])
            if products:
                return products
        except Exception as e:
            print(f"  [Parse] pageStateData parse error: {e}")

    return []

def get_product_threshold(product, cat_data):
    """Calculates effective minimum discount threshold using category defaults,
    brand tier overrides (both exclusive lower-threshold brands and heavy discounters),
    and articleType overrides (e.g. Smartwatches: 95%, Wallets: 90%, Jewellery: 95%)."""
    base_thresh = int(cat_data.get("botMinDiscount", cat_data.get("minDiscount", MIN_DISCOUNT)))

    # 1. Determine brand baseline (override if explicitly defined, otherwise category default)
    brand = product.get("brand", "").strip()
    brand_overrides = CONFIG.get("brandOverrides", {})
    brand_thresh = None
    if brand in brand_overrides:
        brand_thresh = brand_overrides[brand]
    else:
        for b_name, b_min in brand_overrides.items():
            if b_name.lower() == brand.lower():
                brand_thresh = b_min
                break

    thresh = brand_thresh if brand_thresh is not None else base_thresh

    # 2. Check articleType / category overrides (anti-inflation floors)
    art_type = ""
    if isinstance(product.get("articleType"), dict):
        art_type = product.get("articleType", {}).get("typeName", "")
    elif isinstance(product.get("articleType"), str):
        art_type = product.get("articleType")
    p_cat = product.get("category", "") or ""

    for target_name, min_d in CONFIG.get("articleTypeOverrides", {}).items():
        if (target_name.lower() in art_type.lower()) or (target_name.lower() in p_cat.lower()):
            thresh = max(thresh, min_d)

    return thresh

def send_telegram_alert(product, discount_pct):
    """Sends a formatted product deal with photo to Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print(f"  [Dry Run] Telegram credentials not configured. Skipping alert dispatch for product {product.get('productId')}")
        return False

    brand = product.get("brand", "Deal")
    title = product.get("product", "") or product.get("productName", "")
    price = product.get("price", 0)
    mrp = product.get("mrp", 0)
    rating = product.get("rating", 0)
    rating_count = product.get("ratingCount", 0)
    img_url = product.get("searchImage", "")
    rel_url = product.get("landingPageUrl", "")
    product_url = f"https://www.myntra.com/{rel_url}" if rel_url else "https://www.myntra.com"

    rating_str = f"⭐ <b>Rating:</b> {rating:.1f}/5 ({rating_count:,} reviews)\n" if rating else ""

    caption = (
        f"🔥 <b>{discount_pct}% OFF</b> | <b>{brand}</b>\n"
        f"<b>{title}</b>\n\n"
        f"💰 <b>Deal Price:</b> ₹{price:,} (MRP: <s>₹{mrp:,}</s>)\n"
        f"{rating_str}"
        f"📍 <b>Location:</b> Pincode {PINCODE}\n\n"
        f"🛒 <a href=\"{product_url}\"><b>👉 Click Here to Buy on Myntra</b></a>"
    )

    # 1. Try sending with photo
    if img_url:
        photo_endpoint = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "photo": img_url,
            "caption": caption,
            "parse_mode": "HTML"
        }
        try:
            resp = requests.post(photo_endpoint, json=payload, timeout=15)
            if resp.ok:
                return True
            else:
                print(f"  Telegram sendPhoto returned {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"  Telegram sendPhoto error: {e}")

    # 2. Fallback to standard text message if photo fails
    msg_endpoint = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": caption,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }
    try:
        resp = requests.post(msg_endpoint, json=payload, timeout=15)
        return resp.ok
    except Exception as e:
        print(f"  Telegram sendMessage error: {e}")
        return False

# ----------------- Main Execution -----------------

def main():
    print(f"=== Myntra Deal Sentinel Started ===")
    print(f"Time (UTC): {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Target Pincode: {PINCODE} | Minimum Discount: {MIN_DISCOUNT}%")

    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("NOTICE: Running in DRY-RUN mode. Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID in environment to post alerts.")

    seen_ids = load_seen_deals()
    print(f"Loaded {len(seen_ids)} previously seen product IDs from seen_deals.json")

    session = requests.Session()
    session.headers.update({
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "x-location-context": f"pincode={PINCODE};source=USER_INPUT",
        "x-meta-app": "channel=web",
        "x-myntraweb": "Yes",
        "x-requested-with": "browser",
        "priority": "u=0, i"
    })

    is_dry_run = "--dry-run" in sys.argv or os.getenv("DRY_RUN", "0").lower() in ("1", "true", "yes")
    if is_dry_run:
        print("\n🧪 [DRY RUN MODE ENABLED] Alerts will NOT be sent to Telegram, and seen_deals.json will not be updated.")

    categories = CONFIG.get("categories", {})
    new_deals_found = 0
    dry_run_deals = []

    for cat_name, cat_data in categories.items():
        base_path = cat_data.get("basePath", "personal-care")
        brands = cat_data.get("brands", [])
        cat_threshold = int(cat_data.get("botMinDiscount", cat_data.get("minDiscount", MIN_DISCOUNT)))

        if not brands:
            continue

        print(f"\nScanning Category: [{cat_name}] ({len(brands)} brands configured, Base Discount: {cat_threshold}%)")

        # Separate exclusive brands (threshold < cat_threshold) into a dedicated batch
        # so their top discounts are never pushed off page 1 by other brands with higher discounts
        brand_overrides = CONFIG.get("brandOverrides", {})

        def get_brand_thresh(b):
            if b in brand_overrides:
                return brand_overrides[b]
            for ob, ov in brand_overrides.items():
                if ob.lower() == b.lower():
                    return ov
            return cat_threshold

        exclusive_brands = [b for b in brands if get_brand_thresh(b) < cat_threshold]
        standard_brands = [b for b in brands if get_brand_thresh(b) >= cat_threshold]

        brand_batches = []
        if exclusive_brands:
            brand_batches.append(exclusive_brands)
        for i in range(0, len(standard_brands), BATCH_SIZE):
            brand_batches.append(standard_brands[i:i + BATCH_SIZE])

        for b_idx, batch in enumerate(brand_batches):
            is_exclusive_batch = any(get_brand_thresh(b) < cat_threshold for b in batch)
            batch_label = "🌟 Exclusive Brands Batch" if is_exclusive_batch else f"Batch {b_idx + 1}/{len(brand_batches)}"
            brands_str = ",".join(batch)
            if "?" in base_path:
                path_part, query_part = base_path.split("?", 1)
                existing_params = urllib.parse.parse_qs(query_part, keep_blank_values=True)
                existing_f = existing_params.get("f", [""])[0]
                merged_f = f"{existing_f}::Brand:{brands_str}" if existing_f else f"Brand:{brands_str}"
                params = {
                    "f": merged_f,
                    "sort": "discount",
                    "p": 1
                }
                for k, v in existing_params.items():
                    if k not in ("f", "sort", "p"):
                        params[k] = v[0]
                url = f"https://www.myntra.com/{path_part}?{urllib.parse.urlencode(params)}"
            else:
                params = {
                    "f": f"Brand:{brands_str}",
                    "sort": "discount",
                    "p": 1
                }
                url = f"https://www.myntra.com/{base_path}?{urllib.parse.urlencode(params)}"
            print(f"  Fetching {batch_label} ({len(batch)} brands: {', '.join(batch[:4])}{'...' if len(batch) > 4 else ''})...")

            try:
                resp = session.get(url, timeout=20)
                if not resp.ok:
                    print(f"  HTTP error {resp.status_code} for URL: {url}")
                    continue

                products = extract_products_from_html(resp.text)
                if products:
                    discounts = [round(((p.get("mrp", 0) - p.get("price", 0)) / p.get("mrp", 1)) * 100) for p in products if p.get("mrp", 0) > 0]
                    max_d = max(discounts) if discounts else 0
                    print(f"  Extracted {len(products)} products. Highest discount in batch: {max_d}%")
                else:
                    print(f"  Extracted 0 products from response. Status: {resp.status_code}, HTML length: {len(resp.text)}")
                    if "Access Denied" in resp.text or "Captcha" in resp.text:
                        print("  [Warning] Myntra CDN blocked the request from this IP.")

                for p in products:
                    pid = p.get("productId")
                    if not pid or (pid in seen_ids and not is_dry_run):
                        continue

                    mrp = p.get("mrp", 0)
                    price = p.get("price", 0)
                    if mrp <= 0 or price <= 0:
                        continue

                    discount_pct = round(((mrp - price) / mrp) * 100)
                    item_threshold = get_product_threshold(p, cat_data)

                    if discount_pct >= item_threshold:
                        art = p.get("articleType", {}).get("typeName") if isinstance(p.get("articleType"), dict) else p.get("articleType", "")
                        deal_info = {
                            "category": cat_name,
                            "brand": p.get("brand"),
                            "product": p.get("product"),
                            "price": price,
                            "mrp": mrp,
                            "discount": discount_pct,
                            "threshold": item_threshold,
                            "articleType": art,
                            "url": f"https://www.myntra.com/{p.get('landingPageUrl', '')}"
                        }

                        if is_dry_run:
                            print(f"  ⭐ [DRY RUN QUALIFIED] {p.get('brand')} - {p.get('product')[:35]} ({discount_pct}% >= {item_threshold}% - Rs.{price} / MRP Rs.{mrp})")
                            dry_run_deals.append(deal_info)
                        else:
                            print(f"  ⭐ NEW DEAL! {p.get('brand')} - {p.get('product')[:40]}... ({discount_pct}% OFF >= {item_threshold}% - Rs.{price})")
                            success = send_telegram_alert(p, discount_pct)
                            seen_ids.add(pid)
                            new_deals_found += 1
                            time.sleep(1.2)  # Rate limiting between Telegram dispatches

            except Exception as e:
                print(f"  Error fetching batch: {e}")

            time.sleep(1)  # Delay between batch requests

    if is_dry_run:
        print("\n" + "=" * 60)
        print(f"🧪 [DRY RUN RESULTS] Total Qualifying Deals Found: {len(dry_run_deals)}")
        print("=" * 60)
        by_cat = {}
        for d in dry_run_deals:
            by_cat.setdefault(d["category"], []).append(d)
        for cat, items in by_cat.items():
            print(f"\n📂 Category: [{cat}] ({len(items)} deals)")
            for it in items:
                print(f"   • {it['discount']}% OFF (Min {it['threshold']}%) | {it['brand']} - {it['product'][:40]} | ₹{it['price']} (MRP ₹{it['mrp']})")
        print("\n🧪 [DRY RUN COMPLETE] Zero alerts sent. State file untouched.")
    else:
        # Persist updated seen deals
        save_seen_deals(seen_ids)
        print(f"\n=== Summary ===")
        print(f"New deals alerted: {new_deals_found}")
        print(f"Total historical deals recorded: {len(seen_ids)}")
        print(f"=== Myntra Deal Sentinel Finished ===")

if __name__ == "__main__":
    main()
