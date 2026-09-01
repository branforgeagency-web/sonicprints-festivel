import https from "https";
import http from "http";

const SITEMAP_URL = process.env.SITEMAP_URL || "https://sonicprints.shop/sitemap.xml";

console.log(`\n======================================================`);
console.log(`🚀 Sonic Prints XML Sitemap Submission Helper`);
console.log(`======================================================`);
console.log(`Target Sitemap URL: ${SITEMAP_URL}\n`);

// 1. Google Ping API
const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

console.log(`[1] Pinging Google Search Engine: ${googlePingUrl}`);
https.get(googlePingUrl, (res) => {
  console.log(`   --> Response Status: ${res.statusCode} ${res.statusMessage}`);
}).on("error", (err) => {
  console.log(`   --> Ping attempt sent (${err.message}). Note: Google Search Console API / Search Console Portal is the primary submission mechanism.`);
});

// 2. IndexNow Ping (Bing / Yandex / Seznam)
const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=sonicprints2026`;

console.log(`[2] Pinging IndexNow API (Bing/Yandex): ${indexNowUrl}`);
https.get(indexNowUrl, (res) => {
  console.log(`   --> Response Status: ${res.statusCode} ${res.statusMessage}`);
}).on("error", (err) => {
  console.log(`   --> IndexNow ping sent (${err.message})`);
});

console.log(`\n------------------------------------------------------`);
console.log(`📋 Manual Google Search Console Submission Steps:`);
console.log(`------------------------------------------------------`);
console.log(`1. Go to Google Search Console: https://search.google.com/search-console`);
console.log(`2. Select property for: https://sonicprints.shop`);
console.log(`3. Click 'Sitemaps' in the left sidebar navigation.`);
console.log(`4. Under 'Add a new sitemap', enter: sitemap.xml`);
console.log(`5. Click SUBMIT.`);
console.log(`======================================================\n`);
