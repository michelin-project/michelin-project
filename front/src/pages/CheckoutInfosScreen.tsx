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

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    address: false,
    postalCode: false,
    city: false,
  });

  const isFormFilled =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.address.trim() !== "" &&
    formData.postalCode.trim() !== "" &&
    formData.city.trim() !== "";

  const validateForm = () => {
    const newErrors = {
      firstName: formData.firstName.trim() === "",
      lastName: formData.lastName.trim() === "",
      email: formData.email.trim() === "",
      address: formData.address.trim() === "",
      postalCode: formData.postalCode.trim() === "",
      city: formData.city.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue();
    }
  };

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
        <h2 className="flex-1 text-center text-base font-black">Informations</h2>
        <div className="w-6" />
      </div>

      <CheckoutStepper step={1} />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-5">
        
        {/* COORDONNÉES */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">
            VOS COORDONNÉES
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">

              {/* Prénom */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">Prénom*</span>
                <input
                  type="text"
                  placeholder="Ex : Marie"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>

              {/* Nom */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">Nom*</span>
                <input
                  type="text"
                  placeholder="Ex : Dupont"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>

            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground">Email*</span>
              <input
                type="email"
                placeholder="Ex : marie.dupont@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
              />
            </div>

          </div>
        </div>

        {/* ADRESSE */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground mb-3">
            ADRESSE DE LIVRAISON
          </div>

          <div className="space-y-3">

            {/* Adresse */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground">Adresse*</span>
              <input
                type="text"
                placeholder="Ex : 12 rue Victor Hugo"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                  errors.address
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              {/* Code postal */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">Code postal*</span>
                <input
                  type="text"
                  placeholder="Ex : 75001"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className={`px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                    errors.postalCode
                      ? "border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>

              {/* Ville */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">Ville*</span>
                <input
                  type="text"
                  placeholder="Ex : Paris"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                    errors.city
                      ? "border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>

            </div>

            {/* Pays */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground">Pays*</span>
              <div className="w-full px-4 py-3.5 rounded-2xl bg-muted text-sm text-foreground">
                France
              </div>
            </div>

          </div>
        </div>

        {/* BOUTON */}
        <button
          onClick={handleContinue}
          disabled={!isFormFilled}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isFormFilled ? "#1B3FAB" : "#c7d3f5",
          }}
        >
          Continuer vers le paiement
        </button>

      </div>
    </PhoneFrame>
  );
}
