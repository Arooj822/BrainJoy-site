const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    
    // Capture unhandled exceptions
    page.on('pageerror', error => console.error('BROWSER_ERROR:', error.message));
    page.on('requestfailed', request => console.error('BROWSER_REQUEST_FAILED:', request.url(), request.failure().errorText));

    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle0' });
    
    // Attempt clicking Sign Up
    await page.evaluate(() => {
        const signupBtn = document.querySelector('.btn.signup-btn');
        if (signupBtn) signupBtn.click();
        else console.log('Signup button not found!');
    });
    
    // Wait for potential modal
    await new Promise(r => setTimeout(r, 1000));
    
    await browser.close();
})();
