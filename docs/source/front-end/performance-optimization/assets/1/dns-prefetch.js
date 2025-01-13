const fs = require("fs");
const { parse } = require("node-html-parser");
const { glob } = require("glob");
const urlRegex = require("url-regex");

const urls = new Set();
async function searchDomain() {
  const files = await glob("dist/**/*.{html,js,css}", { nodir: true });
  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    const matches = source.match(urlRegex());
    if (matches) {
      matches.forEach((url) => {
        const domain = new URL(url).origin;
        urls.add(domain);
      });
    }
  }
}

async function insertLinks() {
  const files = await glob("dist/**/*.html", { nodir: true });
  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    const root = parse(source);
    urls.forEach((url) => {
      console.log(url);
      root
        .querySelector("head")
        .insertAdjacentHTML(
          "beforeend",
          `<link rel="dns-prefetch" href="${url}">`
        );
    });
    fs.writeFileSync(file, root.toString());
  }
}

async function main() {
  console.log("DNS Prefetching started");
  await searchDomain();
  await insertLinks();
  console.log("DNS Prefetching Done");
}

main();
