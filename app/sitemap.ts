import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    { path: "/assessment", priority: 0.9 },
    { path: "/ato-debt-help", priority: 0.8 },
    { path: "/ato-payment-plan", priority: 0.8 },
    { path: "/ato-payment-plan-calculator", priority: 0.8 },
    { path: "/am-i-insolvent", priority: 0.7 },
    { path: "/director-penalty-notice", priority: 0.8 },
    { path: "/small-business-restructuring", priority: 0.8 },
    { path: "/voluntary-administration", priority: 0.8 },
    { path: "/safe-harbour", priority: 0.7 },
    { path: "/liquidation-alternatives", priority: 0.8 },
    { path: "/what-it-costs", priority: 0.7 },
    { path: "/privacy", priority: 0.2 },
  ];
  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));
}
