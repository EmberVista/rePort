// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to calculate date range
function getDateRange(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return {
        fromDate: formatDate(startDate),
        toDate: formatDate(endDate)
    };
}

// Function to construct Business Reports URL with dates
function constructBusinessReportURL(fromDate, toDate) {
    return `https://sellercentral.amazon.com/business-reports/ref=xx_sitemetric_favb_xx#/report?id=102%3ADetailSalesTrafficByChildItem&fromDate=${fromDate}&toDate=${toDate}&chartCols=&columns=0%2F1%2F2%2F3%2F8%2F9%2F14%2F15%2F20%2F21%2F26%2F27%2F28%2F29%2F30%2F31%2F32%2F33%2F34%2F35%2F36%2F37`;
}

// Function to send message to popup
function sendMessage(type, text) {
    try {
        chrome.runtime.sendMessage({ type, text });
    } catch (e) {
        console.error('Error sending message:', e);
    }
}

// Function to force page reload with new URL
function forceReload(url) {
    console.log('Forcing reload to:', url);
    // Use replace() to force a new page load
    window.location.replace(url);
    
    // If replace() doesn't trigger, try reload() after changing href
    setTimeout(() => {
        if (window.location.href !== url) {
            window.location.href = url;
            window.location.reload(true);
        }
    }, 100);
}

// Function to handle a single date range navigation
function navigateToReport(days) {
    try {
        console.log(`Setting up ${days}-day report...`);
        sendMessage('progress', `Loading ${days}-day report...`);
        
        // Calculate dates
        const { fromDate, toDate } = getDateRange(days);
        
        // Construct URL
        const url = constructBusinessReportURL(fromDate, toDate);
        
        // Force a reload with the new URL
        forceReload(url);
        
    } catch (error) {
        console.error('Error:', error);
        sendMessage('error', error.message);
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadReport') {
        console.log('Navigating to', message.days, 'day report');
        navigateToReport(message.days);
        // Send immediate response
        sendResponse({ received: true });
    }
    // Return true to indicate we'll send a response asynchronously
    return true;
});

console.log('Content script loaded - Force reload version');
