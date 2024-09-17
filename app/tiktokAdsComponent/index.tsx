import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  Heart,
  DollarSign,
  BarChart2,
  Briefcase,
  Target,
  Volume2,
  VolumeX,
} from "lucide-react";
import { tiktokFiltersData } from "@/server/actions/products/filters";
import { motion } from "framer-motion";
import { AdDetailsResponse, TiktokAdData } from "@/types/tiktok";
import { tiktokAdDetails } from "@/server/actions/products/adInfo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TikTokAdDetails from "./AdDetails";

interface TikTokAdCardProps {
  ad: TiktokAdData;
}

export default function TikTokAdCard({ ad }: TikTokAdCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [adDetails, setAdDetails] = useState<AdDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      videoRef.current.muted = isMuted;
    }
  }, [isHovered, isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };
  const handleFetchDetails = async () => {
    setIsLoading(true);
    try {
      const details = await tiktokAdDetails({ id: ad.id });
      setAdDetails(details);
    } catch (error) {
      console.error("Error fetching ad details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onMouseDown={handleFetchDetails}
          className="cursor-pointer"
        >
          <Card className="w-full max-w-sm overflow-hidden bg-gradient-to-br from-blue-50 to-white-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="relative">
              <CardTitle className="text-lg font-semibold truncate z-10 relative">
                {ad.ad_title || "Untitled Ad"}
              </CardTitle>
              <p className="text-sm text-muted-foreground z-10 relative">
                {ad.brand_name || "Unknown Brand"}
              </p>
              <motion.div
                className="absolute inset-0 opacity-20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </CardHeader>
            <CardContent
              className="p-0 bg-background rounded-b-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative w-full pb-[177.78%] mb-4 overflow-hidden rounded-b-lg shadow-lg">
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <video
                    ref={videoRef}
                    src={ad.video_info.video_url["720p"]}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    poster={ad.video_info.cover}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </motion.div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm px-6 pb-6">
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <BarChart2 className="w-5 h-5 text-blue-500" />
                  <span>
                    CTR: {ad.ctr ? `${(ad.ctr * 100).toFixed(2)}%` : "N/A"}
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span>
                    Cost: {ad.cost ? `$${ad.cost.toFixed(2)}` : "N/A"}
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Briefcase className="w-5 h-5 text-orange-500" />
                  <span>Industry: {getIndustryValue(ad.industry_key)}</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>Objective: {getObjectiveValue(ad.objective_key)}</span>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800"
                >
                  <ThumbsUp className="w-4 h-4 mr-2 text-blue-500" />
                  {ad.like || 0}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800"
                >
                  <Heart
                    className="w-4 h-4 mr-2 text-red-500"
                    fill={ad.favorite ? "currentColor" : "none"}
                  />
                  {ad.favorite ? "Favorited" : "Favorite"}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto ">
        <SheetHeader>
          <SheetTitle>{adDetails?.data.ad_title || "Ad Details"}</SheetTitle>
          <SheetDescription>
            {adDetails?.data.brand_name || "Loading..."}
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : adDetails ? (
          <TikTokAdDetails adDetails={adDetails.data} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>Failed to load ad details. Please try again.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export const getIndustryValue = (industryKey: string) => {
  const industry = tiktokFiltersData.industry.find(
    (ind) => ind.label === industryKey,
  );
  return industry ? industry.value : "Not specified";
};

export const getObjectiveValue = (objectiveKey: string) => {
  const objective = tiktokFiltersData.objective.find(
    (obj) => obj.label === objectiveKey,
  );
  return objective ? objective.value : "Not specified";
};
