const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const content = fs.readFileSync('public/index.html', 'utf8');

const dom = new JSDOM(content, {
  runScripts: "dangerously",
  resources: "usable"
});

setTimeout(() => {
    const document = dom.window.document;
    
    // Test openModal existence
    if (typeof dom.window.openModal === 'function') {
        console.log("openModal function exists.");
    } else {
        console.log("openModal function DOES NOT exist or failed to load.");
    }
    
    // Test click on Sign Up button
    const signupBtn = document.querySelector('.btn.signup-btn');
    if (signupBtn) {
        console.log("Found Sign Up Button. Attributes:");
        for(let i=0; i<signupBtn.attributes.length; i++) {
           console.log(`- ${signupBtn.attributes[i].name}="${signupBtn.attributes[i].value}"`);
        }
    } else {
        console.log("Could not find .btn.signup-btn");
    }
    
}, 1000);
