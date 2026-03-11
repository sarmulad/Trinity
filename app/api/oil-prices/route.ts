import { NextResponse } from "next/server";

const CODES = [
  "WTI_USD",
  "NATURAL_GAS_USD",
  "BRENT_CRUDE_USD",
  "GASOLINE_RBOB_USD",
  "LOUISIANA_LIGHT_USD",
  "OKLAHOMA_SWEET_USD",
  "OKLAHOMA_SOUR_USD",
  "WESTERN_OKLAHOMA_SWEET_USD",
  "OKLAHOMA_INTERMEDIATE_USD",
  "KANSAS_COMMON_USD",
  "NW_KANSAS_SWEET_USD",
  "SW_KANSAS_SWEET_USD",
  "OPEC_BASKET_USD",
];

const SHORT_LABELS: Record<string, string> = {
  WTI_USD: "WTI",
  BRENT_CRUDE_USD: "BRENT",
  NATURAL_GAS_USD: "NG",
  GASOLINE_RBOB_USD: "RBOB",
  LOUISIANA_LIGHT_USD: "LA LIGHT",
  OKLAHOMA_SWEET_USD: "OK SWEET",
  OKLAHOMA_SOUR_USD: "OK SOUR",
  WESTERN_OKLAHOMA_SWEET_USD: "W.OK SWEET",
  OKLAHOMA_INTERMEDIATE_USD: "OK INT.",
  KANSAS_COMMON_USD: "KS COMMON",
  NW_KANSAS_SWEET_USD: "NW KS",
  SW_KANSAS_SWEET_USD: "SW KS",
  OPEC_BASKET_USD: "OPEC",
};

export interface TickerItem {
  code: string;
  label: string;
  price: number;
  formatted: string;
}

let cache: { data: TickerItem[]; fetchedAt: number } | null = null;
const ONE_HOUR = 60 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.fetchedAt < ONE_HOUR) {
    return NextResponse.json(cache.data);
  }

  const results: TickerItem[] = [];

  await Promise.allSettled(
    CODES.map(async (code) => {
      try {
        const res = await fetch(
          `https://api.oilpriceapi.com/v1/prices/latest?by_code=${code}`,
          {
            headers: {
              Authorization: `Token ${process.env.OIL_PRICE_API_KEY}`,
              "Content-Type": "application/json",
            },
            next: { revalidate: 3600 },
          },
        );

        if (!res.ok) return;

        const json = await res.json();

        if (json.status === "success" && json.data?.price != null) {
          results.push({
            code,
            label: SHORT_LABELS[code] ?? code,
            price: json.data.price,
            formatted: json.data.formatted ?? `$${json.data.price.toFixed(2)}`,
          });
        }
      } catch {}
    }),
  );

  results.sort((a, b) => CODES.indexOf(a.code) - CODES.indexOf(b.code));

  if (results.length > 0) {
    cache = { data: results, fetchedAt: Date.now() };
    return NextResponse.json(results);
  }

  if (cache) return NextResponse.json(cache.data);

  return NextResponse.json(
    { error: "Failed to fetch prices" },
    { status: 500 },
  );
}
