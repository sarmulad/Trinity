"use client";

import { MoreInfo } from "./types";

interface MoreInformationProps {
  info: MoreInfo;
}

export function MoreInformation({ info }: MoreInformationProps) {
  const fields = [
    { label: "Lease Type", value: info.leaseType },
    { label: "Power Type", value: info.powerType },
    { label: "Producers", value: info.producers },
    { label: "Data Frequency", value: info.dataFrequency },
    { label: "Injectors", value: info.injectors },
    { label: "Buyer", value: info.buyer },
    { label: "Tanks", value: info.tanks },
    { label: "Route", value: info.route },
    { label: "Lift Types", value: info.liftTypes },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e2025] p-5">
      <p className="mb-4 text-sm font-semibold text-white">More Information</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 lg:grid-cols-4">
        {fields.map((item) => (
          <div key={item.label} className="space-y-0.5">
            <p className="text-[10px] text-white/40">{item.label}</p>
            <p className="text-sm text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
