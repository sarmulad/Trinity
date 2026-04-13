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

const STATIC_FALLBACK_PRICES: Record<string, number> = {
  WTI_USD: 85.42,
  BRENT_CRUDE_USD: 88.1,
  NATURAL_GAS_USD: 2.54,
  GASOLINE_RBOB_USD: 2.31,
  LOUISIANA_LIGHT_USD: 84.76,
  OKLAHOMA_SWEET_USD: 83.2,
  OKLAHOMA_SOUR_USD: 80.65,
  WESTERN_OKLAHOMA_SWEET_USD: 82.48,
  OKLAHOMA_INTERMEDIATE_USD: 82.94,
  KANSAS_COMMON_USD: 82.75,
  NW_KANSAS_SWEET_USD: 81.9,
  SW_KANSAS_SWEET_USD: 82.12,
  OPEC_BASKET_USD: 84.03,
};

function formatPrice(code: string, price: number) {
  const unit = code.includes("GAS") ? "MCF" : "BBL";
  return `$${price.toFixed(2)}/${unit}`;
}

function buildFallbackData(): TickerItem[] {
  return CODES.map((code) => {
    const price = STATIC_FALLBACK_PRICES[code] ?? 0;
    return {
      code,
      label: SHORT_LABELS[code] ?? code,
      price,
      formatted: price > 0 ? formatPrice(code, price) : "—",
    };
  });
}

let cache: { data: TickerItem[]; fetchedAt: number } | null = null;
const ONE_HOUR = 60 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.fetchedAt < ONE_HOUR) {
    return NextResponse.json(cache.data, {
      headers: { "x-price-source": "cache" },
    });
  }

  if (!process.env.OIL_PRICE_API_KEY) {
    return NextResponse.json(buildFallbackData(), {
      headers: { "x-price-source": "fallback" },
    });
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
    return NextResponse.json(results, {
      headers: { "x-price-source": "live" },
    });
  }

  if (cache)
    return NextResponse.json(cache.data, {
      headers: { "x-price-source": "cache" },
    });

  return NextResponse.json(buildFallbackData(), {
    headers: { "x-price-source": "fallback" },
  });
}
