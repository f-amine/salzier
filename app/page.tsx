"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { tiktokAdsList } from "@/server/actions/products/adsSearch";
import TikTokAdCard from "./tiktokAdsComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { TiktokAdData, TiktokApiResponse } from "@/types/tiktok";
import { tiktokFiltersData } from "@/server/actions/products/filters";
import { ModeToggle } from "@/components/ui/toggleDarkMode";

export default function Home() {
  const [data, setData] = useState<TiktokAdData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    period: "180",
    page: 1,
    limit: "20",
    orderBy: "for_you",
    like: "",
    countryCode: "AE",
    adLanguage: "",
    industry: "",
    objective: "",
    keyword: "",
  });

  const fetchData = async (isLoadMore = false) => {
    if (!hasMore && isLoadMore) return;

    setLoading(true);
    try {
      const nextPage = isLoadMore ? filters.page + 1 : filters.page;
      const result: TiktokApiResponse = await tiktokAdsList({
        ...filters,
        page: nextPage.toString(),
      });
      console.log("tiktokAdsList result:", result);
      if ("error" in result) {
        setError(result.error);
        setData([]);
        setHasMore(false);
      } else {
        setError(null);
        setHasMore(result.pagination.has_more);
        if (isLoadMore) {
          setData((prevData) => [...prevData, ...result.tiktokData]);
        } else {
          setData(result.tiktokData);
        }
        setFilters((prev) => ({ ...prev, page: nextPage }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An unexpected error occurred");
      setData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    setHasMore(true);
    fetchData();
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchData(true);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastAdElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );
  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <header className="text-center">
        <h1 className="text-3xl font-bold">TikTok Ads</h1>
        <ModeToggle />
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search ads..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="period">Period</Label>
          <Select
            value={filters.period}
            onValueChange={(value) => handleFilterChange("period", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {tiktokFiltersData.period.map((period) => (
                <SelectItem key={period.id} value={period.id.toString()}>
                  {period.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="country">Country</Label>{" "}
          <Select
            value={filters.countryCode}
            onValueChange={(value) => handleFilterChange("countryCode", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {tiktokFiltersData.country.map((country) => (
                <SelectItem key={country.id} value={country.label}>
                  {country.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="orderBy">Order By</Label>
          <Select
            value={filters.orderBy}
            onValueChange={(value) => handleFilterChange("orderBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              {tiktokFiltersData.orderBy.map((order) => (
                <SelectItem key={order.id} value={order.label}>
                  {order.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="adLanguage">Ad Language</Label>
          <Select
            value={filters.adLanguage}
            onValueChange={(value) => handleFilterChange("adLanguage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {tiktokFiltersData.ad_language.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={filters.industry}
            onValueChange={(value) => handleFilterChange("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {tiktokFiltersData.industry.map((industry) => (
                <SelectItem key={industry.id} value={industry.id.toString()}>
                  {industry.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="objective">Objective</Label>
          <Select
            value={filters.objective}
            onValueChange={(value) => handleFilterChange("objective", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select objective" />
            </SelectTrigger>
            <SelectContent>
              {tiktokFiltersData.objective.map((objective) => (
                <SelectItem key={objective.id} value={objective.id.toString()}>
                  {objective.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-full">
          <Button onClick={handleSearch} className="w-full">
            Search
          </Button>
        </div>
      </div>
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {error ? (
          <p className="text-red-500 col-span-full">{error}</p>
        ) : data.length > 0 ? (
          data.map((ad: TiktokAdData, index: number) => (
            <div
              key={ad.id}
              ref={index === data.length - 1 ? lastAdElementRef : null}
            >
              <TikTokAdCard ad={ad} />
            </div>
          ))
        ) : (
          <p className="col-span-full">No ads data available</p>
        )}
        {loading && (
          <p className="col-span-full text-center">Loading more ads...</p>
        )}
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <p>© 2024 TikTok Ads Viewer</p>
      </footer>
    </div>
  );
}
