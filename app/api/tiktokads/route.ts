import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-extra";

interface TikTokHeaders {
  userSign: string | null;
  timestamp: string | null;
  webId: string | null;
}

export async function GET(request: NextRequest) {
  console.log("hello");
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") || "30";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const orderBy = searchParams.get("orderBy") || "for_you";
  const like = searchParams.get("like") || "";
  const countryCode = searchParams.get("countryCode") || "MA";
  const adLanguage = searchParams.get("adLanguage") || "";
  const industryKey = searchParams.get("industryKey") || "";
  const objectiveKey = searchParams.get("objectiveKey") || "";

  const validPeriods = ["7", "30", "180"];
  if (!validPeriods.includes(period.toString())) {
    return NextResponse.json(
      { error: "Invalid period. Must be 7, 30, or 180." },
      { status: 400 },
    );
  }

  try {
    const { userSign, timestamp, webId }: TikTokHeaders = await getHeaders();
    const url = new URL(
      "https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list",
    );
    const appendParamIfValue = (key: string, value: string) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, value.toString());
      }
    };

    appendParamIfValue("like", like);
    appendParamIfValue("objective", objectiveKey);
    appendParamIfValue("industry", industryKey);
    appendParamIfValue("period", period.toString());
    appendParamIfValue("page", page.toString());
    appendParamIfValue("limit", limit.toString());
    appendParamIfValue("order_by", orderBy);
    appendParamIfValue("country_code", countryCode);
    appendParamIfValue("ad_language", adLanguage);

    const headers: HeadersInit = {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,ar-MA;q=0.8,ar;q=0.7",
      lang: "en",
      priority: "u=1, i",
      "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie: "",
    };

    if (timestamp) headers.timestamp = timestamp;
    if (userSign) headers["user-sign"] = userSign;
    if (webId) headers["web-id"] = webId;

    const response = await fetch(url, {
      headers,
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      tiktokData: data.data.materials,
    });
  } catch (error) {
    console.error("Error fetching data from TikTok API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data",
      },
      { status: 500 },
    );
  }
}

async function getHeaders(): Promise<TikTokHeaders> {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/snap/bin/chromium",
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  let userSign = null;
  let timestamp = null;
  let webId = null;

  page.on("request", (request) => {
    const url = request.url();
    if (url?.includes("access_token")) {
      const headers = request.headers();
      userSign = headers["user-sign"];
      timestamp = headers["timestamp"];
      webId = headers["web-id"];
    }
    request.continue();
  });

  await page.goto(
    "https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?period=30&region=US",
    {
      waitUntil: "networkidle2",
    },
  );

  const pages = await browser.pages();
  await Promise.all(pages.map((page) => page.close()));
  await browser.close();

  return { userSign, timestamp, webId };
}
