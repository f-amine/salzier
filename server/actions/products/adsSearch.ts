"use server";

import { TiktokApiResponse, TikTokHeaders } from "@/types/tiktok";
import {
  fetchAndStoreHeaders,
  getLatestHeaders,
  insertAdsToDatabase,
} from "./adsUtils";

export async function tiktokAdsList({
  period = "30",
  page = "1",
  limit = "20",
  orderBy = "for_you",
  like = "",
  countryCode = "MA",
  adLanguage = "",
  industry = "",
  objectiveKey = "",
  keyword = "",
}: {
  period?: string;
  page?: string;
  limit?: string;
  orderBy?: string;
  like?: string;
  countryCode?: string;
  adLanguage?: string;
  industry?: string;
  objectiveKey?: string;
  keyword?: string;
} = {}): Promise<TiktokApiResponse> {
  try {
    let headers: TikTokHeaders = (await getLatestHeaders())!;
    const tiktokUrl = new URL(
      "https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list",
    );
    const appendParamIfValue = (key: string, value: string | undefined) => {
      if (value !== undefined && value !== null && value !== "") {
        tiktokUrl.searchParams.append(key, value.toString());
      }
    };

    appendParamIfValue("like", like);
    appendParamIfValue("objective", objectiveKey);
    appendParamIfValue("industry", industry);
    appendParamIfValue("period", period);
    appendParamIfValue("page", page);
    appendParamIfValue("limit", limit);
    appendParamIfValue("order_by", orderBy);
    appendParamIfValue("country_code", countryCode);
    appendParamIfValue("ad_language", adLanguage);
    appendParamIfValue("keyword", keyword);

    const requestHeaders: HeadersInit = {
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
      cookie:
    };

    if (headers.timestamp)
      requestHeaders.timestamp = headers.timestamp.toString();
    if (headers.userSign) requestHeaders["user-sign"] = headers.userSign;
    if (headers.webId) requestHeaders["web-id"] = headers.webId;

    const tiktokResponse = await fetch(tiktokUrl.toString(), {
      headers: requestHeaders,
      method: "GET",
      next: { revalidate: 7200 }, // Cache for 2 hours (7200 seconds)
    });

    if (!tiktokResponse.ok) {
      throw new Error(
        `TikTok API request failed with status ${tiktokResponse.status}`,
      );
    }

    const data = await tiktokResponse.json();

    if (data.code === 40101 && data.msg === "no permission") {
      console.log("Detected 'no permission' error. Fetching new headers...");
      headers = await fetchAndStoreHeaders();
      return tiktokAdsList({
        period,
        page,
        limit,
        orderBy,
        like,
        countryCode,
        adLanguage,
        industry,
        objectiveKey,
        keyword,
      });
    }

    const result: TiktokApiResponse = {
      tiktokData: data.data.materials,
      pagination: data.data.pagination,
    };

    insertAdsToDatabase(data.data.materials).catch((error) => {
      console.error("Error inserting ads to database:", error);
    });

    return result;
  } catch (error) {
    console.error("Error fetching data from TikTok Ads API:", error);
    return {
      error: "Failed to fetch data",
    };
  }
}
