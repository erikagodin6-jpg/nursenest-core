import React from "react";
import { getSitePage } from "@/content/site/site-registry";

type Props = {
  page: keyof typeof import("@/content/site/site-registry").SITE_REGISTRY;
};

export default function SitePageRenderer({ page }: Props) {
  const data = getSitePage(page);

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="text-sm opacity-80">{item.a}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="p-4 border rounded-lg">
          <h3 className="font-semibold capitalize">{key}</h3>

          {Array.isArray(value) ? (
            <ul className="list-disc ml-5 text-sm">
              {value.map((v: string, i: number) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-80">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
