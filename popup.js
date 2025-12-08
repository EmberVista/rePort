// Function to get formatted date
function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to construct Business Reports URL with dates
function constructBusinessReportURL(days) {
    // Use yesterday as the end date (today isn't complete yet)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    // Calculate start date by subtracting days from the end date
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days + 1);
    
    // Format dates
    const toDate = getFormattedDate(endDate);
    const fromDate = getFormattedDate(startDate);
    
    console.log(`Date range: ${fromDate} to ${toDate}`);
    
    // Construct URL exactly as the working example
    const url = `https://sellercentral.amazon.com/business-reports/ref=xx_sitemetric_favb_xx#/report?id=102%3ADetailSalesTrafficByChildItem&chartCols=&columns=0%2F1%2F2%2F3%2F8%2F9%2F14%2F15%2F20%2F21%2F26%2F27%2F28%2F29%2F30%2F31%2F32%2F33%2F34%2F35%2F36%2F37&fromDate=${fromDate}&toDate=${toDate}`;
    return url;
}

// Function to construct monthly Business Reports URL
function constructMonthlyBusinessReportURL(year, month) {
    // Create first day of month
    const startDate = new Date(year, month - 1, 1);
    // Create last day of month
    const endDate = new Date(year, month, 0);
    
    // Format dates
    const fromDate = getFormattedDate(startDate);
    const toDate = getFormattedDate(endDate);
    
    console.log(`Monthly date range: ${fromDate} to ${toDate}`);
    
    // Construct URL exactly as the working example
    const url = `https://sellercentral.amazon.com/business-reports/ref=xx_sitemetric_favb_xx#/report?id=102%3ADetailSalesTrafficByChildItem&chartCols=&columns=0%2F1%2F2%2F3%2F8%2F9%2F14%2F15%2F20%2F21%2F26%2F27%2F28%2F29%2F30%2F31%2F32%2F33%2F34%2F35%2F36%2F37&fromDate=${fromDate}&toDate=${toDate}`;
    return url;
}

// Function to generate monthly report buttons
function generateMonthlyReportButtons() {
    const container = document.getElementById('monthly-reports-container');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
    
    // Generate 15 months starting from 15 months ago up to last month
    for (let i = 15; i >= 1; i--) {
        const targetDate = new Date(currentYear, currentMonth - i - 1, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        
        // Format month name
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[month - 1];
        
        // Get last day of month for display
        const lastDay = new Date(year, month, 0).getDate();
        
        // Create button
        const button = document.createElement('button');
        button.className = 'report-link monthly-report-button';
        button.textContent = `${monthName} 1-${lastDay}, ${year}`;
        button.setAttribute('data-type', 'monthly');
        button.setAttribute('data-year', year);
        button.setAttribute('data-month', month);
        
        container.appendChild(button);
    }
}

// URLs for other reports
const REPORT_URLS = {
    'listings': 'https://sellercentral.amazon.com/listing/reports',
    'fba': 'https://sellercentral.amazon.com/reportcentral/MANAGE_INVENTORY_HEALTH/1',
    'managefba': 'https://sellercentral.amazon.com/reportcentral/FBA_MYI_UNSUPPRESSED_INVENTORY/1',
    'ledger': 'https://sellercentral.amazon.com/reportcentral/LEDGER_REPORT/1'
};

// Function to navigate and force reload
async function navigateAndReload(tabId, url) {
    // First navigate to the URL
    await chrome.tabs.update(tabId, { url: url });
    
    // Wait for navigation to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Force reload the page
    await chrome.tabs.reload(tabId, { bypassCache: true });
}

// Function to add click handlers to report links
function addReportClickHandlers() {
    document.querySelectorAll('.report-link').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                const type = button.getAttribute('data-type');
                const days = button.getAttribute('data-days');
                const year = button.getAttribute('data-year');
                const month = button.getAttribute('data-month');
                
                // Get the active tab
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                
                // Construct URL based on report type
                let url;
                if (type === 'business') {
                    url = constructBusinessReportURL(parseInt(days));
                    console.log(`Opening ${days}-day business report...`);
                    console.log(`URL: ${url}`);
                    
                    // Use the new navigate and reload function
                    await navigateAndReload(tab.id, url);
                } else if (type === 'monthly') {
                    url = constructMonthlyBusinessReportURL(parseInt(year), parseInt(month));
                    console.log(`Opening monthly report for ${month}/${year}...`);
                    console.log(`URL: ${url}`);
                    
                    // Use the new navigate and reload function
                    await navigateAndReload(tab.id, url);
                } else {
                    url = REPORT_URLS[type];
                    console.log(`Opening ${type} report...`);
                    await chrome.tabs.update(tab.id, { url: url });
                }
                
            } catch (error) {
                console.error('Error opening report:', error);
            }
        });
    });
}

// Function to add collapsible section handlers
function addCollapsibleHandlers() {
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('click', () => {
            // Toggle collapsed class on title and its sibling content
            title.classList.toggle('collapsed');
            const content = title.nextElementSibling;
            if (content && content.classList.contains('section-content')) {
                content.classList.toggle('collapsed');
            }
        });
    });
}

// Initialize the popup
function initializePopup() {
    // Generate monthly report buttons
    generateMonthlyReportButtons();

    // Add click handlers to all report links (including newly created monthly ones)
    addReportClickHandlers();

    // Add collapsible section handlers
    addCollapsibleHandlers();

    // Add dropSync link handler
    const dropSyncButton = document.getElementById('dropsync-link');
    if (dropSyncButton) {
        dropSyncButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://dropsync.embervista.com' });
        });
    }
}

// Log when popup is loaded
console.log('Popup script loaded - With force reload functionality');

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);

// Also initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    // DOM not ready yet
} else {
    // DOM is ready
    initializePopup();
}

// Open every single report link in its own tab (excluding monthly reports)
document.getElementById('open-all').addEventListener('click', () => {
  // grab all buttons except the Open All ones and monthly reports
  const buttons = Array.from(document.querySelectorAll('.report-link'))
                       .filter(btn => btn.id !== 'open-all' && btn.id !== 'download-all-monthly' && btn.getAttribute('data-type') !== 'monthly');

  buttons.forEach(btn => {
    const type = btn.getAttribute('data-type');
    const days = btn.getAttribute('data-days');
    let url;

    if (type === 'business') {
      url = constructBusinessReportURL(parseInt(days, 10));
    } else {
      url = REPORT_URLS[type];
    }

    // fire-and-forget – no await
    chrome.tabs.create({ url });
  });
});

// Open all monthly reports in their own tabs
document.getElementById('download-all-monthly').addEventListener('click', () => {
  // grab only monthly report buttons
  const monthlyButtons = Array.from(document.querySelectorAll('.report-link'))
                              .filter(btn => btn.getAttribute('data-type') === 'monthly');

  monthlyButtons.forEach(btn => {
    const year = btn.getAttribute('data-year');
    const month = btn.getAttribute('data-month');
    const url = constructMonthlyBusinessReportURL(parseInt(year, 10), parseInt(month, 10));

    // fire-and-forget – no await
    chrome.tabs.create({ url });
  });
});