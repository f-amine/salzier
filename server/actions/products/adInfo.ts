"use server";

import {
  AdDetailsResponse,
  TiktokAdDataDetailed,
  TikTokHeaders,
} from "@/types/tiktok";
import { fetchAndStoreHeaders, getLatestHeaders } from "./adsUtils";

export async function tiktokAdDetails({
  id = "",
}: {
  id?: string;
} = {}): Promise<AdDetailsResponse> {
  try {
    let headers: TikTokHeaders = (await getLatestHeaders())!;
    const tiktokUrl = new URL(
      "https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/detail",
    );
    const appendParamIfValue = (key: string, value: string | undefined) => {
      if (value !== undefined && value !== null && value !== "") {
        tiktokUrl.searchParams.append(key, value.toString());
      }
    };

    appendParamIfValue("material_id", id);
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
      cookie:    };

    if (headers.timestamp)
      requestHeaders.timestamp = headers.timestamp.toString();
    if (headers.userSign) requestHeaders["user-sign"] = headers.userSign;
    if (headers.webId) requestHeaders["web-id"] = headers.webId;

    const tiktokResponse = await fetch(tiktokUrl.toString(), {
      headers: requestHeaders,
      method: "GET",
      next: { revalidate: 259200 },
    });

    if (!tiktokResponse.ok) {
      throw new Error(
        `TikTok API request failed with status ${tiktokResponse.status}`,
      );
    }

    const data = await tiktokResponse.json();
    console.log(data);

    if (data.code === 40101 && data.msg === "no permission") {
      console.log("Detected 'no permission' error. Fetching new headers...");
      headers = await fetchAndStoreHeaders();
      return tiktokAdDetails({
        id,
      });
    }

    const result: AdDetailsResponse = data;
    return result;
  } catch (error) {
    console.error("Error fetching data from TikTok Ads API:", error);
    return {
      code: 500,
      msg: error instanceof Error ? error.message : "An unknown error occurred",
      request_id: "",
      data: {} as TiktokAdDataDetailed,
    };
  }
}
