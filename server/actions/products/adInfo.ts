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
      cookie:
        "ttwid=1%7Cy3s-1dU8lkLvfMlVQXfsgdK8r5pJU5h7XvwEUI1T5mc%7C1725428568%7C63e3866682f9622b096844d2ca9a2f02c9317214643ee1861d637863deb35a7b; tt_chain_token=MslylPZ7LrZFD55GyLXObg==; passport_csrf_token=2ae1ce92915363e23fa22b2ed39847ea; passport_csrf_token_default=2ae1ce92915363e23fa22b2ed39847ea; i18next=en; passport_auth_status_ads=505541b237b7607d2c60afb5495a7c4e%2C; passport_auth_status_ss_ads=505541b237b7607d2c60afb5495a7c4e%2C; sso_uid_tt_ads=af7216655054b4898c397d65f1fc19d137b723f9789ade7d53a9e6548132417b; sso_uid_tt_ss_ads=af7216655054b4898c397d65f1fc19d137b723f9789ade7d53a9e6548132417b; sso_user_ads=8299260f85966d9ddd46a5fbcd83bcbd; sso_user_ss_ads=8299260f85966d9ddd46a5fbcd83bcbd; sid_ucp_sso_v1_ads=1.0.0-KDMxYWYyNjk0MDY2NjQ1OGRiNTE1MGJmZThmYzYxMzVhYjcyZjExM2IKHwiRiL-039nO7GYQjPbktgYYzCQgDDCL9uS2BjgIQBIQAxoDc2cxIiA4Mjk5MjYwZjg1OTY2ZDlkZGQ0NmE1ZmJjZDgzYmNiZA; ssid_ucp_sso_v1_ads=1.0.0-KDMxYWYyNjk0MDY2NjQ1OGRiNTE1MGJmZThmYzYxMzVhYjcyZjExM2IKHwiRiL-039nO7GYQjPbktgYYzCQgDDCL9uS2BjgIQBIQAxoDc2cxIiA4Mjk5MjYwZjg1OTY2ZDlkZGQ0NmE1ZmJjZDgzYmNiZA; odin_tt=5e7ec5d4b9e75426af3185b61810ce4d42bc462b1e96d1cbe59390f159b65216941b7e13b27fcfb389dafee10cd69dfe486086a07bb808d2178a0904b9e770f8; sid_guard_ads=a7d00688f51eaa5b7913326535155c62%7C1725512460%7C5184000%7CMon%2C+04-Nov-2024+05%3A01%3A00+GMT; uid_tt_ads=4819e891dfbd5aee9fad5b55bbebb01df25c722981241c3ce25cbb528ef2907a; uid_tt_ss_ads=4819e891dfbd5aee9fad5b55bbebb01df25c722981241c3ce25cbb528ef2907a; sid_tt_ads=a7d00688f51eaa5b7913326535155c62; sessionid_ads=a7d00688f51eaa5b7913326535155c62; sessionid_ss_ads=a7d00688f51eaa5b7913326535155c62; sid_ucp_v1_ads=1.0.0-KDllZDBmMTAzNWVhZWM0YWJjZTcxYjM3MzMxYzQwMWUwY2IxMWM5MGUKGQiRiL-039nO7GYQjPbktgYYzCQgDDgIQBIQAxoDc2cxIiBhN2QwMDY4OGY1MWVhYTViNzkxMzMyNjUzNTE1NWM2Mg; ssid_ucp_v1_ads=1.0.0-KDllZDBmMTAzNWVhZWM0YWJjZTcxYjM3MzMxYzQwMWUwY2IxMWM5MGUKGQiRiL-039nO7GYQjPbktgYYzCQgDDgIQBIQAxoDc2cxIiBhN2QwMDY4OGY1MWVhYTViNzkxMzMyNjUzNTE1NWM2Mg; csrftoken=; lang_type=en; msToken=srOasQZUR4vwqy-_zhSUmGhX7SeeNz5gybAqqUtLB5n0CvSzJZK2nAqvcd78BU3iamvYt7XmfdX3sBOZFr2wZ3y8NXIh2Jw3UzFDIwgtqV3ASHwI-rbnxt27jedC; msToken=SKDMdiW94aLpD9Myf9oYhuRUBE7xuFsOqWL1Mx1PVyVWEfoFDzqk7qrRjnc84LVWLt_hi13xE4mzOdpNTmfk8xs0DRzvc7JP22HSdCGfqmglTGzhi2yLDmAfef3kB6AGt1F3SjYsIJdg",
    };

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
