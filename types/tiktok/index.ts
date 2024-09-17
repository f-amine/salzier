export type TiktokAdData = {
  ad_title?: string;
  brand_name?: string;
  cost?: number;
  ctr?: number;
  favorite?: boolean;
  id: string;
  industry_key: string;
  is_search: boolean;
  like: number;
  objective_key: string;
  tag?: number;
  video_info: VideoInfo;
};

export type VideoInfo = {
  cover: string;
  duration: number;
  vid: string;
  video_url: {
    [key: string]: string;
  };
  width: number;
  height: number;
};
export type Pagination = {
  has_more: boolean;
  page: number;
  size: number;
  total_count: number;
};
export type TiktokApiSuccessResponse = {
  tiktokData: TiktokAdData[];
  pagination: Pagination;
};

export type TiktokApiErrorResponse = {
  error: string;
};

export type TiktokApiResponse =
  | TiktokApiSuccessResponse
  | TiktokApiErrorResponse;

export type TikTokHeaders = {
  userSign: string;
  timestamp: number;
  webId: string;
};

export type TiktokAdDataDetailed = {
  ad_title: string;
  brand_name: string;
  comment: number;
  cost: number;
  country_code: string[];
  ctr: number;
  favorite: boolean;
  has_summary: boolean;
  highlight_text: string;
  id: string;
  industry_key: string;
  is_search: boolean;
  keyword_list: string[];
  landing_page: string;
  like: number;
  objective_key: string;
  objectives: Array<{
    label: string;
    value: number;
  }>;
  share: number;
  source: string;
  source_key: number;
  video_info: VideoInfo;
  voice_over: boolean;
};

export type AdDetailsResponse = {
  code: number;
  msg: string;
  request_id: string;
  data: TiktokAdDataDetailed;
};
