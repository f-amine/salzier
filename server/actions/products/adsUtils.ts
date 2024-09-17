import { createClient } from "@/lib/subpabase/server";
import { TiktokAdData, TikTokHeaders } from "@/types/tiktok";

const supabase = createClient();
export async function getLatestHeaders(): Promise<TikTokHeaders | null> {
  const { data, error } = await supabase
    .from("tiktokheaders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest headers:", error);
    return null;
  }

  if (data && data.length > 0) {
    return {
      userSign: data[0].userSign,
      timestamp: data[0].timestamp,
      webId: data[0].webId,
    };
  }

  console.log("No headers found in the database.");
  return null;
}

export async function areHeadersValid(): Promise<boolean> {
  const latestHeaders = await getLatestHeaders();
  if (!latestHeaders) return false;

  const now = new Date();
  const headerCreationTime = new Date(latestHeaders.timestamp);
  const timeDifference = now.getTime() - headerCreationTime.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference <= 1;
}

export async function fetchAndStoreHeaders(): Promise<TikTokHeaders> {
  const headersResponse = await fetch(
    `${process.env.NODE_URL}/api/tiktok-headers`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!headersResponse.ok) {
    throw new Error(
      `Headers API request failed with status ${headersResponse.status}`,
    );
  }

  const headersData: TikTokHeaders = await headersResponse.json();

  await supabase.from("tiktokheaders").delete().neq("id", 0);
  const { error } = await supabase.from("tiktokheaders").insert([
    {
      userSign: headersData.userSign,
      timestamp: headersData.timestamp,
      webId: headersData.webId,
    },
  ]);

  if (error) {
    console.error("Error inserting new headers:", error);
    throw error;
  }

  return headersData;
}

export async function insertAdsToDatabase(materials: TiktokAdData[]) {
  const chunkSize = 1000;

  let successfulUpserts = 0;

  // Process materials in chunks
  for (let i = 0; i < materials.length; i += chunkSize) {
    const chunk = materials.slice(i, i + chunkSize);
    const chunkResults = await processChunk(chunk);
    successfulUpserts += chunkResults.length;
    console.log(
      `Processed chunk ${i / chunkSize + 1}. Successful upserts so far: ${successfulUpserts}`,
    );
  }

  console.log(`Successfully upserted ${successfulUpserts} ads`);
}

async function processChunk(chunk: TiktokAdData[]) {
  const upsertPromises = chunk.map(async (material) => {
    try {
      const { data, error } = await supabase
        .from("tiktokads")
        .upsert(
          {
            id: material.id,
            ad_title: material.ad_title,
            brand_name: material.brand_name,
            cost: material.cost,
            ctr: material.ctr,
            industry_key: material.industry_key,
            tag: material.tag,
            is_search: material.is_search,
            like: material.like,
            objective_key: material.objective_key,
            vid_id: material.video_info?.vid,
            duration: material.video_info?.duration,
            cover: material.video_info?.cover,
            video_url: material.video_info?.video_url?.["720p"] ?? null,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          },
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error upserting ad ${material.id}:`, error);
      return null;
    }
  });

  const results = await Promise.all(upsertPromises);
  return results.filter((result) => result !== null);
}
