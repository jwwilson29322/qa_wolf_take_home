const { chromium } = require("playwright");
const { BASE_URL, NEWEST_PATH, DEFAULT_MAX_ARTICLES } = require("../fixtures/hn_sorting");
const {
  extractArticlesFromPage,
  convertToMinutes,
  isSortedDescending,
  getNextPageUrl,
} = require("../support/commands");

async function sortHackerNewsArticles(limit) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let articles = [];
  let currentPage = BASE_URL + NEWEST_PATH;

  while (articles.length < limit) {
    await page.goto(currentPage);
    const pageArticles = await extractArticlesFromPage(page);

    for (const article of pageArticles) {
      if (article.timeText && articles.length < limit) {
        articles.push(article);
      }
    }

    currentPage = await getNextPageUrl(page);
    if (!currentPage) break;
  }

  const timeValues = articles.map(article => convertToMinutes(article.timeText));
  const isSorted = isSortedDescending(timeValues);

  if (isSorted) {
    console.log(`First ${articles.length} articles are sorted from newest to oldest.`);
  } else {
    console.log("Articles are NOT sorted correctly.");
  }

  await browser.close();
}

// CLI override: `node index.js 50` or use default of 100
if (require.main === module) {
  const input = parseInt(process.argv[2], 10);
  const limit = Number.isInteger(input) && input > 0 ? input : DEFAULT_MAX_ARTICLES;
  sortHackerNewsArticles(limit);
}
