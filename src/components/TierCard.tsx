const details = {
  Tracker: {
    services: "0 Standard Services",
    monitoring: "Monthly Monitoring",
    tagline: "Get started with essentials",
  },
  Explorer: {
    services: "2 Standard Services",
    monitoring: "Weekly Monitoring",
    tagline: "Grow with deeper insights",
  },
  Adventurer: {
    services: "4 Standard Services",
    monitoring: "Daily Monitoring",
    tagline: "Optimise & take action daily",
  },
  Trailblazer: {
    services: "6 Standard Services",
    monitoring: "Hourly Monitoring",
    tagline: "Lead with full proactive support",
  },
} as const; // ✅ makes keys and values readonly & precise

// ✅ Create a type for valid tier names:
export type TierName = keyof typeof details;


const TierCard = ({
  tier,
  isActive,
  price,
}: {
  tier: TierName; // ✅ now 'tier' must be valid!
  isActive: boolean;
  price: string;
}) => {
  return (
    <div
      className={`tier-card p-4 border rounded-lg transition ${
        isActive ? "border-[var(--accent-soft)] bg-[#f8f6fc]" : "border-gray-200"
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{tier}</h3>
      <p className="text-lg font-bold mb-2">From {price}/month</p>
      <p>{details[tier].services}</p>
      <p>{details[tier].monitoring}</p>
      <p className="text-sm mt-2 text-gray-600">{details[tier].tagline}</p>
    </div>
  );
};

export default TierCard;
