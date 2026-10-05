#!/usr/bin/env python3
"""
Myntra Deal Sentinel - Local & Mobile 24/7 Daemon Runner
Ideal for running on:
- Android (via Termux) using Indian mobile/Wi-Fi connection
- Local Windows/Linux/Mac PC in background

Runs continuously, checks deals hourly between 12:00 PM and 12:00 AM IST (or custom interval),
posts deals to Telegram, and optionally pushes updated seen_deals.json to GitHub.
"""

import os
import sys
import time
import subprocess
from datetime import datetime, timezone, timedelta

# Import the core checker logic
import bot_checker

# IST Timezone (UTC + 5:30)
IST = timezone(timedelta(hours=5, minutes=30))

# Configuration
CHECK_INTERVAL_SECONDS = int(os.getenv("CHECK_INTERVAL_SECONDS", "3600"))  # Default: 1 hour
ACTIVE_HOURS_IST = range(11, 24)  # 11:00 AM to 11:59 PM IST (peak deal window)
AUTO_GIT_PUSH = os.getenv("AUTO_GIT_PUSH", "true").lower() in ("true", "1", "yes")

def sync_git():
    """Optionally commits and pushes seen_deals.json to GitHub repository."""
    if not AUTO_GIT_PUSH:
        return
    try:
        status = subprocess.run(["git", "status", "--porcelain", "seen_deals.json"], capture_output=True, text=True)
        if "seen_deals.json" in status.stdout:
            print("📦 Syncing updated seen_deals.json to GitHub...")
            subprocess.run(["git", "add", "seen_deals.json"], check=False)
            subprocess.run(["git", "commit", "-m", "chore: update seen_deals database [skip ci]"], check=False)
            subprocess.run(["git", "pull", "--rebase"], check=False)
            subprocess.run(["git", "push"], check=False)
            print("✅ GitHub synchronization complete.")
    except Exception as e:
        print(f"⚠️ Git sync skipped/failed: {e}")

def main_loop():
    print("=" * 60)
    print("🚀 Myntra Deal Sentinel Daemon Started")
    print(f"Check Interval: {CHECK_INTERVAL_SECONDS // 60} minutes")
    print(f"Active IST Window: 11:00 AM - 12:00 AM IST")
    print("=" * 60)

    while True:
        now_ist = datetime.now(IST)
        hour = now_ist.hour

        print(f"\n[{now_ist.strftime('%Y-%m-%d %H:%M:%S IST')}] Checking deal schedule...")

        if hour in ACTIVE_HOURS_IST:
            print(f"🟢 Active hours detected ({hour}:00 IST). Starting deal scan...")
            try:
                bot_checker.main()
                sync_git()
            except Exception as e:
                print(f"❌ Error during scan cycle: {e}")
        else:
            print(f"🌙 Off-peak hours ({hour}:00 IST). Deal scanning skipped until 11:00 AM IST.")

        next_run = datetime.now(IST) + timedelta(seconds=CHECK_INTERVAL_SECONDS)
        print(f"⏳ Sleeping for {CHECK_INTERVAL_SECONDS // 60} mins. Next scan at {next_run.strftime('%H:%M:%S IST')}...")
        time.sleep(CHECK_INTERVAL_SECONDS)

if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        print("\n🛑 Daemon stopped by user.")
        sys.exit(0)
