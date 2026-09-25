# 🔥 Myntra Deal Sentinel

An automated system to track, filter, and alert on high-discount deals (65%–70%+ OFF) from curated, established brands on Myntra with localized delivery context.

Includes:
1. **Interactive Bookmarklet**: A floating UI on `myntra.com` to scan categories on demand with custom discount thresholds.
2. **Automated Telegram Bot**: Runs in GitHub Actions, monitors Myntra periodically, and sends instant photo deal alerts to your Telegram channel/chat.
3. **Multi-Category Scalable Architecture**: Easily add future categories (e.g. Clothes, Shoes, Watches) simply by updating `myntra_brands_and_categories.json`.

---

## 📁 Repository Structure

```text
├── myntra_brands_and_categories.json   # Curated brand lists, category base paths & product mappings
├── myntra_bookmarklet.js               # Browser bookmarklet script with floating UI
├── bot_checker.py                      # Python sentinel scanner & Telegram dispatcher
├── seen_deals.json                     # Database of already-notified deals (prevents duplicate alerts)
└── .github/
    └── workflows/
        └── deal_sentinel.yml           # GitHub Actions workflow (runs bot & auto-commits seen_deals.json)
```

---

## 🚀 Part 1: How to Install the Bookmarklet in Your Browser

Because the script is hosted on GitHub, you can use a **1-line loader bookmarklet**. This eliminates any browser bookmark character limits and ensures that anytime you push updates to GitHub, your browser automatically uses the latest version.

### Step 1: Create the Browser Bookmark
1. In your browser (Chrome / Brave / Edge / Firefox), open your **Bookmarks Bar** (`Ctrl + Shift + B`).
2. Right-click the bar $\rightarrow$ **Add page...** (or **Add bookmark**).
3. Set **Name**: `🔥 Myntra Deals`
4. Set **URL** to this code (replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO` with your repository details):

```javascript
javascript:(function(){const s=document.createElement('script');s.src='https://raw.githubusercontent.com/jairaj26/myntra-deals/main/myntra_bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();
```

### Step 2: Use It on Myntra
1. Go to [Myntra.com](https://www.myntra.com).
2. Click your `🔥 Myntra Deals` bookmark.
3. A floating panel appears in the top-right corner.
4. Select a category (`Haircare`, `Skincare`, `Perfumes`, `Makeup`), pick your discount threshold (e.g. `65%+`), and click **Fetch Highest Discount Deals**.
5. It will query Myntra with your delivery pincode (`560032`), display deals sorted by steepest discount, and provide direct buy links.

---

## 🤖 Part 2: How to Setup the Automated Telegram Bot

### Step 1: Create a Telegram Bot
1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the prompts to choose a name and username.
3. Copy the **HTTP API Bot Token** (e.g. `7123456789:AAH...`).

### Step 2: Get Your Telegram Chat or Channel ID
* **For a Channel or Supergroup**:
  1. Add your bot as an **Administrator** in your channel.
  2. Send a test message in the channel.
  3. Your chat ID is the channel username (e.g. `@my_deal_channel`) or numeric ID (e.g. `-1001234567890`).
* **For Private DM to Yourself**:
  1. Start a conversation with `@userinfobot` on Telegram.
  2. Copy your numeric `Id`.

---

## ⚙️ Part 3: Setup GitHub Actions & Secrets

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Myntra Deal Sentinel"
   git branch -M main
   git remote add origin https://github.com/jairaj26/myntra-deals.git
   git push -u origin main
   ```

2. In your GitHub repository:
   * Go to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
   * Click **New repository secret** and add:

   | Secret Name | Description | Example Value |
   | :--- | :--- | :--- |
   | `TELEGRAM_BOT_TOKEN` | Bot token from `@BotFather` | `7123456789:AAH...` |
   | `TELEGRAM_CHAT_ID` | Your Chat ID or Channel Handle | `@my_deals_channel` or `123456789` |
   | `PINCODE` | *(Optional)* Target delivery pincode | `560032` (default) |
   | `MIN_DISCOUNT_PERCENT` | *(Optional)* Minimum discount to trigger alert | `70` (default) |

3. Enable Workflow Permissions:
   * Go to **Settings** $\rightarrow$ **Actions** $\rightarrow$ **General**.
   * Under **Workflow permissions**, select **Read and write permissions** (required so the bot can commit updated `seen_deals.json`).
   * Click **Save**.

4. Test Run:
   * Go to the **Actions** tab in your repository.
   * Click **Myntra Deal Sentinel** $\rightarrow$ **Run workflow**.
   * Check the logs to see deals being found and posted to your Telegram channel!

---

## ⏰ Part 4: Scheduling with cron-job.org

GitHub Actions has a built-in schedule (`*/30 * * * *`), but to ensure reliable, punctual execution every 15–30 minutes, you can trigger it via [cron-job.org](https://cron-job.org):

1. **Create a GitHub Personal Access Token (PAT)**:
   * Go to GitHub $\rightarrow$ **Settings** $\rightarrow$ **Developer settings** $\rightarrow$ **Personal access tokens** $\rightarrow$ **Tokens (classic)**.
   * Generate a token with the `repo` scope.
2. **Setup cron-job.org**:
   * Create an account on [cron-job.org](https://cron-job.org) $\rightarrow$ **Create Cronjob**.
   * **URL**:
     ```text
     https://api.github.com/repos/jairaj26/myntra-deals/actions/workflows/deal_sentinel.yml/dispatches
     ```
   * **Method**: `POST`
   * **Request Headers**:
     * `Authorization`: `Bearer YOUR_GITHUB_PAT_TOKEN`
     * `Accept`: `application/vnd.github.v3+json`
     * `User-Agent`: `cron-job-org`
   * **Request Body**:
     ```json
     {"ref":"main"}
     ```
   * **Schedule**: Every 15 minutes, 30 minutes, or 1 hour.

---

## 📈 Part 5: How to Scale to Other Categories (Clothes, Shoes, etc.)

To add new categories, simply edit `myntra_brands_and_categories.json`. Add a new section under `categories`:

```json
"Men Footwear": {
  "displayName": "Men Footwear",
  "basePath": "men-footwear",
  "brands": [
    "Nike",
    "Puma",
    "Adidas",
    "Red Tape",
    "Reebok",
    "Skechers",
    "Woodland",
    "Asics"
  ],
  "productTypes": {
    "Casual Shoes": ["Casual Shoes"],
    "Sports Shoes": ["Sports Shoes"],
    "Sneakers": ["Sneakers"]
  }
},
"Men Clothing": {
  "displayName": "Men Clothing",
  "basePath": "men-clothing",
  "brands": [
    "Levi's",
    "U.S. Polo Assn.",
    "Jack & Jones",
    "Tommy Hilfiger",
    "WROGN",
    "Flying Machine"
  ],
  "productTypes": {
    "T-Shirts": ["Tshirts"],
    "Shirts": ["Shirts"],
    "Jeans": ["Jeans"]
  }
}
```

Both `bot_checker.py` and `myntra_bookmarklet.js` will automatically pick up the new categories, query their respective `basePath`, and track their deals without modifying any code!
