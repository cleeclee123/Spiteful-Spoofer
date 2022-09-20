/**
 * Spiteful Spoofer
 * @version 1.0
 * @author Chris Lee <cl114@illinois.edu>
 * code was originally written for another project : Check it out below!
 * Project Helper Function : https://github.com/cleeclee123/Project-Helper-Function
 * 
 * Spiteful Spoofer will rotate through scraped user-agent string and proxies
 * Will return a request header interface as a promise 
 * Examples in Project Helper Function of implementation
 * 
 * Just for fun :)
 */

const axios = require("axios");
const cheerio = require("cheerio");

// scrapes sslproxies.org for port numbers and ip addresses
// returns the generated proxy as a string
const generateProxy = async function () {
  const ERROR_MESSAGE = "Error with Proxy Generator";
  let ipAddresses = [];
  let portNumbers = [];

  await axios
    .get("https://sslproxies.org/")
    .then(async function (response) {
      // load html data with cheerio
      const $ = cheerio.load(response.data);

      // loop through table tag, grab second nth-child
      $("td:nth-child(1)").each((index, element) => {
        ipAddresses[index] = $(element).text();
      });

      // loop through table tag, grab second nth-child
      $("td:nth-child(2)").each((index, element) => {
        portNumbers[index] = $(element).text();
      });

      ipAddresses.join(", ");
      portNumbers.join(", ");
    })
    .catch(async function (error) {
      return `${ERROR_MESSAGE} ${error}`;
    });

  let randomNumber = Math.floor(Math.random() * 100);
  let proxy = `http://${ipAddresses[randomNumber]}:${portNumbers[randomNumber]}`;

  return proxy;
};

// function to rotate user agents by scraping a github repo with a bunch of UA strings
// returns the scraped user-agent string
const rotateUserAgent = async function () {
  const ERROR_MESSAGE = "Error with User Agent Rotater";
  let userAgents = [];

  await axios
    .get(
      "https://github.com/tamimibrahim17/List-of-user-agents/blob/master/Chrome.txt"
    )
    .then(async function (repsonse) {
      // load html with cheerio
      const $ = cheerio.load(repsonse.data);

      // loop through tr tag, loop through table tag, grab second nth-child
      // check for space (valid user agent) and will only scrap windows, mac, and x11 (linux) uas
      $("tr > td:nth-child(2)").each((index, element) => {
        if (
          ($(element).text().includes(" ") &&
            $(element).text().includes("(Windows")) ||
          ($(element).text().includes(" ") &&
            $(element).text().includes("(Macintosh")) ||
          ($(element).text().includes(" ") &&
            $(element).text().includes("(X11"))
        ) {
          userAgents[index] = $(element).text();
        }
      });

      userAgents.join(", ");
    })
    .catch(async function (error) {
      return `${ERROR_MESSAGE} ${error}`;
    });

  let randomNumber = Math.floor(Math.random() * 100);
  let rotatedUserAgent = userAgents[randomNumber];
  return String(rotatedUserAgent);
};

// handles all of the callbacks to ua rotater and proxy generator
// CALLBACK HELL LOL
async function handlerCB() {
  return rotateUserAgent().then(async function (ua) {
    return generateProxy().then(async function (proxy) {
      return { userAgent: ua, proxy: proxy };
    });
  });
}

// write request header interface
const buildRequestHeader = async function () {
  return handlerCB().then(async function (data) {
    let platformUA = "";
    if (String(data.userAgent).includes("(Windows")) {
      platformUA = "Windows";
    } else if (String(data.userAgent).includes("(Macintosh")) {
      platformUA = "macOS";
    } else if (String(data.userAgent).includes("(X11")) {
      platformUA = "Linux";
    } else {
      platformUA = "Chrome OS";
    }
    return (headersOptions = {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Referer: "https://www.google.com",
        Connection: "keep-alive",
        DNT: "1",
        Proxy: data.proxy,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "Sec-Ch-Ua-Mobile": "?0",
        "sec-ch-ua-platform": platformUA,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": data.userAgent,
        "X-Amzn-Trace-Id": "Root=1-629e4d2d-69ff09fd3184deac1df68d18",
      },
    });
  });
};

module.exports = {
  buildRequestHeader,
};