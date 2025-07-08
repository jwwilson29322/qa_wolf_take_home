# Cypress + Playwright Automation Framework

This is a sample end-to-end test automation framework built using Cypress and Playwright, originally created as part of a QA Engineering take-home challenge. It has been adapted to showcase a clean, modular, and maintainable structure for UI test automation.


## Folder Structure

```
.
├── cypress
│   └── e2e                     # All end-to-end Cypress test cases
│       └── hn_sorting.spec.js 	# Main test file validating sorting logic
├── support                    	# Shared Cypress & Playwright utilities
│   ├── commands.js            	# Functions for article scraping and sorting
│   └── selectors.js           	# Centralized page selectors for maintainability
├── fixtures
│   └── hn_sorting.js          	# Shared configuration variables (e.g., base URL, paths)
├── utils (optional)           	# Place for reusable helper utilities if needed
├── index.js                   	# CLI-based Playwright validation script for Hacker News
├── cypress.config.js          	# Cypress configuration
├── playwright.config.js       	# Playwright configuration
├── package.json
├── .gitignore
├── LICENSE (optional)
└── README.md                  	# You're reading this :)
```



## Features

Cypress for UI test automation with reusable utilities

Playwright for CLI and formal test suite validations

Modular utility structure for article extraction and sorting logic

Three test scenarios implemented with Playwright:

✅ Sorting verification of newest articles

📉 Fewer than expected articles

🕓 Articles missing time metadata

Easy to scale and maintain

Compatible with GitHub Actions or other CI tools


## How to Install & Run

```
npm install
npx cypress open           # Run Cypress tests via UI

node index.js [limit]      # Run Playwright CLI script 		(default: 100 articles)

npx playwright test        # Run Playwright test suite 		(default: 100 articles)
$env:ARTICLE_LIMIT=30 npx playwright test --reporter=html   	(override article limit)

npx playwright show-report # Open test html report
```


## About This Project

This framework was built to demonstrate core test automation skills including:

Working with dynamic web content

Verifying sorting behavior of paginated articles

Handling missing or malformed article data

Writing CLI and formal test cases using Playwright

Structuring reusable utility functions

Using Cypress for robust UI testing with modular test files and selectors


## Cypress Test Overview

This Cypress spec loads the Hacker News newest page and runs validations using custom commands in support/commands.js. The selectors used are managed centrally in support/selectors.js for maintainability.

Test structure includes:

Navigating through multiple pages

Extracting article timestamps

Verifying sorting order


## Author

Jeff Wilson

Test Automation Engineer

https://www.linkedin.com/in/jw-wilson/