const { BASE_URL } = require("../config/fixtures");
const { ARTICLE_ROW, ARTICLE_TITLE, ARTICLE_TIME, MORE_LINK } = require("./selectors");

async function extractArticlesFromPage(page) {
    return await page.evaluate(({ ARTICLE_ROW, ARTICLE_TITLE, ARTICLE_TIME }) => {
        const rows = Array.from(document.querySelectorAll(ARTICLE_ROW));
        return rows.map(row => {
            const id = row.getAttribute("id");
            const title = row.querySelector(ARTICLE_TITLE)?.innerText || "";
            const subtextRow = row.nextElementSibling;
            const timeText = subtextRow?.querySelector(ARTICLE_TIME)?.innerText || "";
            return { id, title, timeText };
        });
    }, { ARTICLE_ROW, ARTICLE_TITLE, ARTICLE_TIME });
}

function convertToMinutes(timeString) {
    const text = timeString.toLowerCase();
    const parts = text.split(" ");
    const number = parseInt(parts[0], 10);
    if (text.includes("minute")) return number;
    if (text.includes("hour")) return number * 60;
    if (text.includes("day")) return number * 1440;
    return 999999;
}

function isSortedDescending(timeValues) {
    for (let i = 1; i < timeValues.length; i++) {
        if (timeValues[i] < timeValues[i - 1]) {
            return false;
        }
    }
    return true;
}

async function getNextPageUrl(page) {
    const moreLink = await page.$(MORE_LINK);
    if (!moreLink) return null;
    const href = await moreLink.getAttribute("href");
    return new URL(href, BASE_URL).href;
}

module.exports = {
    extractArticlesFromPage,
    convertToMinutes,
    isSortedDescending,
    getNextPageUrl,
};
