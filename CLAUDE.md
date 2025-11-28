# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension called "Amazon Report Downloader" (v1.1) that provides quick access to Amazon Seller Central reports. The extension adds a popup interface with buttons to navigate directly to specific business reports and other Amazon seller reports.

## Architecture

The extension follows a standard Chrome Extension Manifest V3 architecture:

- **manifest.json**: Extension configuration with permissions for `activeTab`, `tabs`, and `https://sellercentral.amazon.com/*`
- **popup.html**: Main UI with dark theme styling and report buttons
- **popup.js**: Background script handling popup interactions and tab navigation
- **content.js**: Content script for message passing (currently unused in main flow)

## Key Components

### URL Construction Logic
The extension constructs Amazon Seller Central URLs dynamically:
- Business reports use date ranges (7, 30, 60, 90, 180, 365 days) 
- URLs target specific report ID `102%3ADetailSalesTrafficByChildItem` with predefined columns
- Date formatting follows `YYYY-MM-DD` format

### Report Types
- **Business Reports**: Detail Page Sales & Traffic reports with configurable date ranges
- **Static Reports**: All Listings, FBA Inventory, Manage FBA Inventory, Inventory Ledger

### Navigation Approach
Uses `chrome.tabs.update()` followed by forced reload with `chrome.tabs.reload()` to ensure reports load properly on Amazon's SPA.

## Development

### Testing the Extension
1. Load unpacked extension in Chrome from this directory
2. Navigate to any Amazon Seller Central page
3. Click extension icon to test popup functionality
4. Verify report links navigate correctly

### Chrome Extension APIs Used
- `chrome.tabs.query()` - Get active tab
- `chrome.tabs.update()` - Navigate to report URLs  
- `chrome.tabs.reload()` - Force page refresh
- `chrome.tabs.create()` - Open reports in new tabs
- `chrome.runtime.sendMessage()` - Message passing (legacy)

### File Structure
```
/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── popup.js              # Popup logic and tab management
├── content.js            # Content script (legacy message handling)
└── images/               # Extension icons (16, 48, 128px)
```

## URL Patterns

Business report URL template:
```
https://sellercentral.amazon.com/business-reports/ref=xx_sitemetric_favb_xx#/report?id=102%3ADetailSalesTrafficByChildItem&chartCols=&columns=0%2F1%2F2%2F3%2F8%2F9%2F14%2F15%2F20%2F21%2F26%2F27%2F28%2F29%2F30%2F31%2F32%2F33%2F34%2F35%2F36%2F37&fromDate=${fromDate}&toDate=${toDate}
```

Static report URLs are hardcoded in `REPORT_URLS` object in popup.js.