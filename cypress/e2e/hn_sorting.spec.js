const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');
const { BASE_URL, DEFAULT_MAX_ARTICLES, NEWEST_PATH } = require('../fixtures/hn_sorting');
const {
    extractArticlesFromPage,
    convertToMinutes,
    isSortedDescending,
    getNextPageUrl,
} = require('../support/commands');

/**
 * Get desired article count from env, fallback to default
 */
const getArticleCount = () => {
    const fromEnv = parseInt(process.env.ARTICLE_LIMIT, 10);
    if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
    return DEFAULT_MAX_ARTICLES;
};

/**
 * Utility to generate fake articles for simulation in Test 2
 */
const generateArticles = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        timeText: `${i + 1} minutes ago`,
    }));
};

const MAX_ARTICLES = getArticleCount();

/**
 * Test 1: Verify Sorting of 100 articles (or input number) by date DESC
 */
test(`Hacker News newest page should show first ${MAX_ARTICLES} articles sorted from newest to oldest`, async () => {

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let articles = [];
    let currentPage = BASE_URL + NEWEST_PATH;

    while (articles.length < MAX_ARTICLES) {
        await page.goto(currentPage);
        const pageArticles = await extractArticlesFromPage(page);

        for (const article of pageArticles) {
            if (article.timeText && articles.length < MAX_ARTICLES) {
                articles.push(article);
            }
        }

        currentPage = await getNextPageUrl(page);
        if (!currentPage) break;
    }

    const timeValues = articles.map(article => convertToMinutes(article.timeText));

    console.log(`\n--- Article Order Verification for first ${MAX_ARTICLES} articles ---`);
    articles.slice(0, MAX_ARTICLES).forEach((a, i) => {
        console.log(`${i + 1}. ${a.title} — ${a.timeText} (${convertToMinutes(a.timeText)} min ago)`);
    });

    expect(articles.length).toBe(MAX_ARTICLES);
    expect(isSortedDescending(timeValues)).toBe(true);

    await browser.close();
});

/**
 * Test 2: Handle less than 100 articles (or input number)
 */
test(`Should handle case when fewer than ${MAX_ARTICLES} count exist`, async () => {

    const count = Math.max(1, MAX_ARTICLES - 10);
    const simulatedArticles = generateArticles(count);

    console.log(`\n--- Fewer than ${MAX_ARTICLES} Articles ---`);
    simulatedArticles.forEach(a => {
        console.log(` - ${a.title}: ${a.timeText}`);
    });

    const timeValues = simulatedArticles.map(a => convertToMinutes(a.timeText));
    const sorted = isSortedDescending(timeValues);

    expect(simulatedArticles.length).toBeLessThan(MAX_ARTICLES);
    expect(sorted).toBe(true);
});

/**
 * Test 3: Handle articles missing timeText
 */
test('Should handle articles without timeText', async () => {
    const mixedArticles = [
        { id: '1', title: 'With time 1', timeText: '5 minutes ago' },
        { id: '2', title: 'No timeText' },
        { id: '3', title: 'With time 2', timeText: '10 minutes ago' },
    ];

    console.log('\n--- Articles with and without timeText ---');
    mixedArticles.forEach(a => {
        console.log(` - ${a.title}: ${a.timeText || 'Missing timeText'}`);
    });

    const filtered = mixedArticles.filter(a => a.timeText);
    const timeValues = filtered.map(a => convertToMinutes(a.timeText));
    const sorted = isSortedDescending(timeValues);

    expect(filtered.length).toBe(2);
    expect(sorted).toBe(true);
});
