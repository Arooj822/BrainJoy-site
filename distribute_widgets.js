const fs = require('fs');

const indexHtml = fs.readFileSync('public/index.html', 'utf8');

function extractSection(id) {
    const startRegex = new RegExp(`<section id="${id}"[^>]*>`, 'i');
    const startMatch = indexHtml.match(startRegex);
    if (!startMatch) return null;

    let startIndex = startMatch.index;
    let depth = 0;
    let endIndex = startIndex;
    
    // A simple parser to find the matching </section>
    // This is a naive approach but works well for nicely formatted HTML
    const tagRegex = /<\/?section[^>]*>/gi;
    tagRegex.lastIndex = startIndex;
    
    let match;
    while ((match = tagRegex.exec(indexHtml)) !== null) {
        if (match[0].toLowerCase().startsWith('<section')) {
            depth++;
        } else if (match[0].toLowerCase() === '</section>') {
            depth--;
            if (depth === 0) {
                endIndex = match.index + match[0].length;
                break;
            }
        }
    }
    
    return indexHtml.substring(startIndex, endIndex);
}

function injectIntoDashboard(dashboardPath, injectionHtml, beforeTag) {
    let dashboard = fs.readFileSync(dashboardPath, 'utf8');
    if (dashboard.includes(injectionHtml.trim().substring(0, 50))) {
        console.log(`Already injected into ${dashboardPath}`);
        return;
    }
    dashboard = dashboard.replace(beforeTag, injectionHtml + '\n\n' + beforeTag);
    fs.writeFileSync(dashboardPath, dashboard);
    console.log(`Successfully injected into ${dashboardPath}`);
}

// 1. Student Dashboard
const studentWidgets = [
    extractSection('subjects-menu'),
    extractSection('learning-tools'),
    extractSection('quizzes'),
    extractSection('videos')
].filter(Boolean).join('\n\n');

if (studentWidgets) {
    injectIntoDashboard('public/assets/student/dashboard.html', studentWidgets, '</main>');
}

// 2. Teacher Dashboard
const teacherWidgets = [
    extractSection('planner-section'),
    extractSection('teaching-games')
].filter(Boolean).join('\n\n');

if (teacherWidgets) {
    injectIntoDashboard('public/assets/teacher/portfolio.html', teacherWidgets, '</main>');
}

// 3. Admin Dashboard
const adminWidgets = [
    extractSection('stats'),
    extractSection('partners')
].filter(Boolean).join('\n\n');

if (adminWidgets) {
    injectIntoDashboard('public/assets/admin/portal.html', adminWidgets, '</main>');
}

// 4. Parent Dashboard
const parentWidgets = [
    extractSection('stats') // Parents also like some stats
].filter(Boolean).join('\n\n');

if (parentWidgets) {
    injectIntoDashboard('public/assets/parent/portal.html', parentWidgets, '</main>');
}

console.log('Done!');
