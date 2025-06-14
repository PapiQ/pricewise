import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice, extractCurrency, extractDescription } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  /* curl https://api.brightdata.com/request -H "Content-Type: application/json" -H "Authorization: Bearer ab907058f76b822f8691c58587e928d32b4818d42e5ea21baf2f18f2e48fe20a" -d "{\"zone\": \"pricewise\",\"url\": \"https://geo.brdtest.com/welcome.txt?product=unlocker&method=api\", \"format\": \"raw\"}" */

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();
    /* const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $("a.size-base.a-color-price")
    ); */

    const currentPrice = extractPrice(
      $(".priceToPay .a-offscreen"), // Most accurate
      $(".priceToPay .a-price-whole").parent(), // Gets the full span with both whole and fraction
      $(
        ".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay .a-offscreen"
      )
    );

    const originalPrice = extractPrice(
      $(".a-price.a-text-price .a-offscreen"),
      $("#priceblock_ourprice"),
      $("#listPrice"),
      $("#priceblock_dealprice")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);

    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    console.log("Scraped product data:", data);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product ${error.message}`);
  }
}
