"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  DollarSign,
  Target,
  Globe,
  Tag,
  Flag,
  Key,
  PlayCircle,
  Info,
  ArrowUpRightSquare,
  DownloadCloud,
  BarChart2,
  Play,
  Users,
  UserPlus,
  ShoppingCart,
  LucideIcon,
} from "lucide-react";
import { TiktokAdDataDetailed } from "@/types/tiktok";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getObjectiveValue } from ".";

interface TikTokAdDetailsProps {
  adDetails: TiktokAdDataDetailed;
}

export default function TikTokAdDetails({ adDetails }: TikTokAdDetailsProps) {
  const metrics = [
    { icon: ThumbsUp, label: "Likes", value: adDetails.like },
    { icon: MessageCircle, label: "Comments", value: adDetails.comment },
    { icon: Share2, label: "Shares", value: adDetails.share },
    { icon: DollarSign, label: "Cost", value: adDetails.cost },
  ];

  const iconMap = {
    campaign_objective_traffic: ArrowUpRightSquare,
    campaign_objective_app_install: DownloadCloud,
    campaign_objective_conversion: BarChart2,
    campaign_objective_video_view: Play,
    campaign_objective_reach: Users,
    campaign_objective_lead_generation: UserPlus,
    campaign_objective_product_sales: ShoppingCart,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlayCircle className="w-6 h-6 text-primary" />
            <span>Ad Video</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TikTokVideoPlayer
            videoUrl={adDetails.video_info?.video_url?.["720p"] || ""}
            coverImage={adDetails.video_info?.cover || ""}
          />
        </CardContent>
      </Card>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {metrics.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold">
                      {item.value != null
                        ? item.label === "Cost"
                          ? `$${Number(item.value).toFixed(2)}`
                          : item.value
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-primary" />
            <span>Objectives</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {adDetails.objectives && adDetails.objectives.length > 0 ? (
              adDetails.objectives.map((obj, index) => {
                const IconComponent = (iconMap[
                  obj.label as keyof typeof iconMap
                ] || Target) as LucideIcon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 bg-secondary/10 p-3 rounded-md shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {getObjectiveValue(obj.label)}
                    </span>
                  </motion.div>
                );
              })
            ) : (
              <span className="text-sm text-muted-foreground">
                No objectives available
              </span>
            )}
          </motion.div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-6 h-6 text-primary" />
            <span>Keywords</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {adDetails.keyword_list && adDetails.keyword_list.length > 0 ? (
              adDetails.keyword_list.map((keyword, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-primary/10 rounded-full text-sm shadow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {keyword}
                </motion.span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No keywords available
              </span>
            )}
          </motion.div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flag className="w-6 h-6 text-primary" />
            <span>Countries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {adDetails.country_code && adDetails.country_code.length > 0 ? (
              adDetails.country_code.map((country, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-secondary/10 rounded-full text-sm shadow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {country}
                </motion.span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No countries available
              </span>
            )}
          </motion.div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-6 h-6 text-primary" />
            <span>Additional Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-500" />
              {adDetails.landing_page ? (
                <a
                  href={adDetails.landing_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Landing Page
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">
                  No landing page available
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-green-500" />
              <span>
                {adDetails.source
                  ? `Source: ${adDetails.source}`
                  : "No source available"}
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface TikTokVideoPlayerProps {
  videoUrl: string;
  coverImage: string;
}

function TikTokVideoPlayer({ videoUrl, coverImage }: TikTokVideoPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg"
    >
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover"
          poster={coverImage}
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full aspect-[9/16] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No video available
          </span>
        </div>
      )}
    </motion.div>
  );
}
