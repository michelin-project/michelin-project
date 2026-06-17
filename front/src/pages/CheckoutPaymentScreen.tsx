import { useState } from "react";
import { ChevronLeft, CreditCard, Check, Lock, Shield } from "lucide-react";
import { PhoneFrame, StatusBar, CheckoutStepper } from "../lib/shared-components";

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
          Paiement
        </h2>
        <div className="w-6" />
      </div>
      <CheckoutStepper step={2} />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "linear-gradient(135deg, #1B3FAB, #2d5cd8)",
          }}
        >
          <div className="text-[10px] font-bold text-white/60 tracking-widest mb-2">
            TOTAL À PAYER
          </div>
          <div className="text-4xl font-black text-white">
            59.07 €
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>Pneu: 55.17 €</span>
            <span>Livraison: 3.90 €</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard
              size={14}
              className="text-muted-foreground"
            />
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground">
              CARTE BANCAIRE
            </span>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="NOM DU TITULAIRE"
              value={formData.cardHolder}
              onChange={(e) => handleInputChange("cardHolder", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="NUMÉRO DE CARTE"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM / AA"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className="px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="CVC"
                value={formData.cvc}
                onChange={(e) => handleInputChange("cvc", e.target.value)}
                className="px-4 py-3 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
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
            <span className="font-bold text-foreground">
              conditions générales de vente
            </span>{" "}
            Michelin et la{" "}
            <span className="font-bold text-foreground">
              politique de confidentialité (RGPD)
            </span>
            . Mes données sont traitées pour la livraison et le
            suivi de commande uniquement.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield size={12} />
          Paiement sécurisé · Cryptage SSL 256-bit
        </div>

        <button
          onClick={agreed ? onPay : undefined}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-opacity"
          style={{
            background: agreed ? "#1B3FAB" : "#c7d3f5",
            cursor: agreed ? "pointer" : "not-allowed",
          }}
        >
          <Lock size={14} />
          Payer 59.07 €
        </button>
      </div>
    </PhoneFrame>
  );
}
