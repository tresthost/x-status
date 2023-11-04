import("dotenv").config();
import https from "https";
import Twitter from "twitter";

import sites from "@config/sites.js";

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let up = [];
let down = [];

sites.forEach(site => {
  https.get(site, res => {
    if (res.statusCode === 200) {
      up.push(site);
      console.log(`${site} is up`);
    } else {
      down.push(site);
      console.log(`${site} is down`);
    }
  });
});

const tweet = up.length === sites.length
    ? `✅ - All Services are currently Operational. [&time, &date]`.replace(/&time/g, new Date().toLocaleTimeString()).replace(/&date/g, new Date().toLocaleDateString())
    : `❌ - ${down.join(', ')} is currently down. [&time, &date]`.replace(/&time/g, new Date().toLocaleTimeString()).replace(/&date/g, new Date().toLocaleDateString());

client.post('statuses/update', {status: tweet}, (error, tweet, response) => {
  if (error) throw error;
  console.log(tweet);  // Tweet body.
  console.log(response);  // Raw response object.
});
