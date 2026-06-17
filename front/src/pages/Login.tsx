import { useState } from "react";
import { MichelinMark } from "../lib/shared-components";

export function Login({
  onBack,
  onSkip,
  onDone,
  onSwitch,
}: {
  onBack: () => void;
  onSkip: () => void;
  onDone: () => void;
  onSwitch: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormFilled =
    email.trim() !== "" &&
    password.trim() !== "";

  const validateForm = () => {
    const newErrors = {
      email: email.trim() === "",
      password: password.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Une erreur est survenue");
      }

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("michelin_token", data.access_token);
      }

      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-4 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour
      </button>

      <MichelinMark />

      <h1 className="mt-8 text-3xl font-black tracking-tight">Connexion</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        La création de compte est optionnelle. Elle est requise pour rejoindre les challenges Strava.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        {error && (
          <div className="p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Email*</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className={`mt-1 w-full h-12 rounded-xl border bg-surface px-4 text-sm focus:outline-none ${
              errors.email ? "border-red-500" : "border-border focus:border-primary"
            }`}
          />
        </label>

        <label className="block">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Mot de passe*</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`mt-1 w-full h-12 rounded-xl border bg-surface px-4 text-sm focus:outline-none ${
              errors.password ? "border-red-500" : "border-border focus:border-primary"
            }`}
          />
        </label>

        <button
          type="submit"
          disabled={!isFormFilled || loading}
          className="w-full mt-3 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm text-primary font-medium"
        >
          Pas encore de compte ? S'inscrire
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex-1 h-px bg-border" />ou<span className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onDone}
          className="w-full h-12 rounded-xl border border-border bg-background font-medium text-sm flex items-center justify-center gap-2"
        >
          <span className="w-4 h-4 rounded-sm bg-[oklch(0.65_0.18_30)]" />
          Continuer avec Apple
        </button>

        <button
          type="button"
          onClick={onDone}
          className="w-full h-12 rounded-xl bg-[#FC4C02] text-white font-semibold text-sm flex items-center justify-center gap-2"
        >
          Connecter avec Strava
        </button>
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="block mx-auto mt-8 text-sm text-primary font-medium"
      >
        Continuer sans compte
      </button>
    </div>
  );
}
