import React from "react";
import { Sparkles, Check } from "lucide-react";
import type { Addon } from "../types/bookings.types";

type Props = {
  guests: number;
  selectedAddons: Addon[];
  onChange: (addons: Addon[]) => void;
};

const AVAILABLE_ADDONS: Addon[] = [
  {
    id: "addon-catering",
    name: "Gourmet Catering Services",
    price: 650,
    priceType: "perHead",
    description: "Premium buffet dinner, hot/cold appetizers, desserts, and premium beverage station.",
  },
  {
    id: "addon-decor",
    name: "Luxury Stage & Theme Decoration",
    price: 12000,
    priceType: "fixed",
    description: "Stunning floral centerpieces, customized backdrops, drapery, and atmospheric uplighting.",
  },
  {
    id: "addon-av",
    name: "AV & Professional Sound System",
    price: 4500,
    priceType: "fixed",
    description: "High-performance speakers, sound mixers, dual cordless microphones, and a projector setup.",
  },
  {
    id: "addon-photo",
    name: "Photography & Videography Coverage",
    price: 15000,
    priceType: "fixed",
    description: "Full-event coverage by two professional photographers, raw high-res images, and a highlight video.",
  },
  {
    id: "addon-valet",
    name: "Valet & Guest Parking Assistance",
    price: 3000,
    priceType: "fixed",
    description: "Assigned parking attendants, security marshalling, and marked spaces to guide your guests.",
  },
];

const AddonsSection: React.FC<Props> = ({
  guests,
  selectedAddons,
  onChange,
}) => {
  const toggleAddon = (addon: Addon) => {
    let updated: Addon[];

    if (selectedAddons.find((a) => a.id === addon.id)) {
      updated = selectedAddons.filter((a) => a.id !== addon.id);
    } else {
      updated = [...selectedAddons, { ...addon, quantity: 1 }];
    }

    onChange(updated);
  };

  const getAddonCostString = (addon: Addon): string => {
    if (addon.priceType === "perHead") {
      const total = addon.price * guests;
      return `₹${addon.price.toLocaleString("en-IN")} × ${guests} guests = ₹${total.toLocaleString("en-IN")}`;
    }
    return `₹${addon.price.toLocaleString("en-IN")} flat rate`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="bg-primary/10 text-primary p-2 rounded-xl">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Enhance Your Event (Add-ons)</h3>
          <p className="text-xs text-muted">Select professional custom packages to upgrade your booking</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {AVAILABLE_ADDONS.map((addon) => {
          const isSelected = selectedAddons.some((a) => a.id === addon.id);

          return (
            <div
              key={addon.id}
              onClick={() => toggleAddon(addon)}
              className={`flex items-start justify-between border rounded-2xl p-4 cursor-pointer transition-all select-none ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50 hover:bg-primary/5/10"
              }`}
            >
              <div className="flex gap-3.5 items-start">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-1 transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background"
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>

                <div className="space-y-1">
                  <span className={`text-sm font-bold block ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {addon.name}
                  </span>
                  <p className="text-xs text-muted leading-relaxed max-w-xl">
                    {addon.description}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mt-1.5">
                    {getAddonCostString(addon)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddonsSection;