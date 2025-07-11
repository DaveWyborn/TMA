const ServiceBox = ({
  title,
  intro,
  services,
  selected,
  onToggle,
  activeTagline,
  setActiveTagline,
}: {
  title: string;
  intro: string;
  services: {
    name: string;
    type: string; // "Included" | "Add-on" | "Advanced"
    tagline: string;
    popular: boolean;
  }[];
  selected: string[];
  onToggle: (serviceName: string, type: string) => void;
  activeTagline: string | null;
  setActiveTagline: (name: string | null) => void;
}) => {
  const includedServices = services.filter((s) => s.type === "Included");
  const addOns = services.filter((s) => s.type === "Add-on");
  const advancedAddOns = services.filter((s) => s.type === "Advanced");

  return (
    <div className="border rounded-lg p-4 bg-white w-full">
      <h4 className="text-lg font-semibold mb-4 text-[var(--primary-color)]">
        {title}
      </h4>

      <div className="mb-4 p-4 bg-[#f8f6fc] border rounded text-sm text-[var(--primary-color)]">
        {activeTagline
          ? services.find((s) => s.name === activeTagline)?.tagline
          : intro}
      </div>

      <div className="space-y-6">
        {/* ✅ Core Services: always included */}
        {includedServices.length > 0 && (
          <>
            <h5 className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-1">
              Core Services (Always Included)
            </h5>
            <div className="flex flex-col gap-2">
              {includedServices.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50"
                >
                  <span>{service.name}</span>
                  <span className="text-[10px] uppercase text-gray-500">
                    Included
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ Add-ons */}
        {addOns.length > 0 && (
          <>
            <h5 className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-1">
              Add-ons
            </h5>
            <div className="flex flex-col gap-2">
              {addOns.map((service) => {
                const isSelected = selected.includes(service.name);
                return (
                  <button
                    key={service.name}
                    onClick={() => {
                      onToggle(service.name, service.type);
                      setActiveTagline(
                        service.name === activeTagline ? null : service.name
                      );
                    }}
                    className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:border-[var(--accent-soft)] transition"
                  >
                    <span>{service.name}</span>
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isSelected
                          ? "bg-[var(--accent-soft)]"
                          : "bg-gray-300"
                      }`}
                    ></span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ✅ Advanced Add-ons */}
        {advancedAddOns.length > 0 && (
          <>
            <h5 className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-1">
              Advanced Add-ons
            </h5>
            <div className="flex flex-col gap-2">
              {advancedAddOns.map((service) => {
                const isSelected = selected.includes(service.name);
                return (
                  <button
                    key={service.name}
                    onClick={() => {
                      onToggle(service.name, service.type);
                      setActiveTagline(
                        service.name === activeTagline ? null : service.name
                      );
                    }}
                    className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 text-sm bg-[#f8f6fc] hover:border-[var(--accent-soft)] transition"
                  >
                    <span>{service.name}</span>
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isSelected
                          ? "bg-[var(--accent-soft)]"
                          : "bg-gray-300"
                      }`}
                    ></span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceBox;
