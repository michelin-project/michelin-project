import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PhoneFrame, StatusBar, CheckoutStepper } from "../lib/shared-components";

export function CheckoutInfosScreen({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex items-center px-5 py-3 border-b border-border flex-shrink-0">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft size={20} />
        </button>
        <h2 className="flex-1 text-center text-base font-black">
          Informations
        </h2>
        <div className="w-6" />
      </div>
      <CheckoutStepper step={1} />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-5">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">
            VOS COORDONNÉES
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="PRÉNOM"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="NOM"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <input
              type="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">
            ADRESSE DE LIVRAISON
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="ADRESSE"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="CODE POSTAL"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                className="px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="VILLE"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground">
                PAYS
              </span>
              <div className="w-full px-4 py-3.5 rounded-2xl bg-muted text-sm text-foreground">
                France
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white"
          style={{ background: "#1B3FAB" }}
        >
          Continuer vers le paiement
        </button>
      </div>
    </PhoneFrame>
  );
}
