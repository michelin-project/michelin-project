import { useState } from "react";
import { MichelinMark } from "../lib/shared-components";
import { API_URL } from "../lib/api";

export function Register({ onBack, onDone, onSwitch }: {
  onBack: () => void;
  onDone: () => void;
  onSwitch: () => void; // switch vers Login
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirm: false,
    mismatch: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormFilled =
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirm.trim() !== "";

  const validateForm = () => {
    const newErrors = {
      email: email.trim() === "",
      password: password.trim() === "",
      confirm: confirm.trim() === "",
      mismatch: password !== confirm,
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
      const res = await fetch(`${API_URL}/auth/register`, {
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
      <button type="button" onClick={onBack} className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        Retour
      </button>

      <MichelinMark />

      <h1 className="mt-8 text-3xl font-black tracking-tight">Inscription</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Créez votre compte Michelin pour accéder aux fonctionnalités avancées.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        {error && (
          <div className="p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error}
          </div>
        )}

        {/* Email */}
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

        {/* Mot de passe */}
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

        {/* Confirmation */}
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Confirmer le mot de passe*</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className={`mt-1 w-full h-12 rounded-xl border bg-surface px-4 text-sm focus:outline-none ${
              errors.confirm || errors.mismatch
                ? "border-red-500"
                : "border-border focus:border-primary"
            }`}
          />
          {errors.mismatch && (
            <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </label>

        <button
          type="submit"
          disabled={!isFormFilled || loading}
          className="w-full mt-3 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button type="button" onClick={onSwitch} className="text-sm text-primary font-medium">
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}
