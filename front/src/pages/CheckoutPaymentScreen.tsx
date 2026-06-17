import { useState } from "react";
import { ChevronLeft, CreditCard, Check, Lock, Shield } from "lucide-react";
import { CheckoutStepper } from "../lib/shared-components";

export function CheckoutPaymentScreen({
  onPay,
  onBack,
}: {
  onPay: () => void;
  onBack: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [errors, setErrors] = useState({
    cardHolder: false,
    cardNumber: false,
    expiryDate: false,
    cvc: false,
  });

  const isFormFilled =
    formData.cardHolder.trim() !== "" &&
    formData.cardNumber.trim() !== "" &&
    formData.expiryDate.trim() !== "" &&
    formData.cvc.trim() !== "";

  const validateForm = () => {
    const newErrors = {
      cardHolder: formData.cardHolder.trim() === "",
      cardNumber: formData.cardNumber.trim() === "",
      expiryDate: formData.expiryDate.trim() === "",
      cvc: formData.cvc.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handlePay = () => {
    if (!agreed) return;
    if (validateForm()) onPay();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER */}
      <div className="flex items-center px-5 py-3 border-b border-border">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft size={20} />
        </button>
        <h2 className="flex-1 text-center text-base font-black">Paiement</h2>
        <div className="w-6" />
      </div>

      <CheckoutStepper step={2} />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #1B3FAB, #2d5cd8)",
          }}
        >
          <div className="text-[10px] font-bold text-white/60 tracking-widest mb-2">
            TOTAL À PAYER
          </div>
          <div className="text-4xl font-black text-white">59.07 €</div>
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>Pneu: 55.17 €</span>
            <span>Livraison: 3.90 €</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground">
              CARTE BANCAIRE
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground">Nom du titulaire*</span>
            <input
              type="text"
              placeholder="Ex: Marie Dupont"
              value={formData.cardHolder}
              onChange={(e) => handleInputChange("cardHolder", e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                errors.cardHolder ? "border-red-500" : "border-border focus:border-primary"
              }`}
            />

            <span className="text-xs font-semibold text-foreground">Numéro de carte*</span>
            <input
              type="text"
              placeholder="Numéro de carte"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                errors.cardNumber ? "border-red-500" : "border-border focus:border-primary"
              }`}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-semibold text-foreground">Date d'expiration*</span>
                <input
                  type="text"
                  placeholder="MM / AA"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                    errors.expiryDate ? "border-red-500" : "border-border focus:border-primary"
                  }`}
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-foreground">CVC*</span>
                <input
                  type="text"
                  placeholder="CVC"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange("cvc", e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none ${
                    errors.cvc ? "border-red-500" : "border-border focus:border-primary"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <button
            onClick={() => setAgreed(!agreed)}
            className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
            style={{
              borderColor: agreed ? "#1B3FAB" : "#d1d5db",
              background: agreed ? "#1B3FAB" : "transparent",
            }}
          >
            {agreed && <Check size={12} color="white" />}
          </button>

          <p className="text-xs text-muted-foreground leading-relaxed">
            J'accepte les{" "}
            <span className="font-bold text-foreground">conditions générales de vente</span>{" "}
            Michelin et la{" "}
            <span className="font-bold text-foreground">politique de confidentialité (RGPD)</span>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield size={12} />
          Paiement sécurisé · Cryptage SSL 256-bit
        </div>

        <button
          onClick={handlePay}
          disabled={!agreed || !isFormFilled}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: agreed && isFormFilled ? "#1B3FAB" : "#c7d3f5",
          }}
        >
          <Lock size={14} />
          Payer 59.07 €
        </button>
      </div>
    </div>
  );
}
