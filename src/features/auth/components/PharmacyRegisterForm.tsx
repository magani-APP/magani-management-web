"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, MapPinned, Phone, ArrowRight, AlertCircle } from "lucide-react";
import { authErrorMessage, registerPharmacy } from "@/api/auth.api";
import { AuthField } from "./AuthField";
import { AuthCopy, AuthBackLink, AuthFormWrapper } from "./AuthHeading";
import { clearRegisterDraft, readRegisterDraft } from "../register-draft";
import {
  isCameroonPhone,
  normalizeCameroonPhone,
  regionForCity,
  resolvePharmacyCoordinates,
} from "../pharmacy-location";

export function PharmacyRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!readRegisterDraft()) {
      router.replace("/register");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const draft = readRegisterDraft();
    if (!draft) {
      router.replace("/register");
      return;
    }

    const normalizedPhone = normalizeCameroonPhone(phone);
    if (!isCameroonPhone(normalizedPhone)) {
      setError("Utilisez un numéro camerounais, ex. +2376XXXXXXXX.");
      return;
    }
    if (address.trim().length < 5) {
      setError("L’adresse doit contenir au moins 5 caractères.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const coordinates = await resolvePharmacyCoordinates(city);
      await registerPharmacy({
        ...draft,
        pharmacy: {
          name: name.trim(),
          address: address.trim(),
          city: city.trim(),
          region: regionForCity(city) ?? city.trim(),
          phone: normalizedPhone,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      });
      clearRegisterDraft();
      router.replace("/");
    } catch (submitError) {
      setError(authErrorMessage(submitError, "Impossible de créer votre espace pour le moment. Réessayez."));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-mode-view">
      <AuthBackLink href="/register" label="Retour au compte" />

      <AuthCopy
        eyebrow="Étape 2 / 2 — votre officine"
        title="Présentez votre pharmacie."
        description="Quelques infos suffisent. La position est détectée automatiquement."
      />

      {error && (
        <div className="auth-error">
          <AlertCircle strokeWidth={2} aria-hidden="true" />
          {error}
        </div>
      )}

      <AuthFormWrapper onSubmit={handleSubmit}>
        <AuthField
          id="pharmacy-name"
          label="Nom de l’officine"
          icon={Building2}
          type="text"
          autoComplete="organization"
          placeholder="Ex. Pharmacie de la République"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={2}
          required
        />

        <AuthField
          id="pharmacy-address"
          label="Adresse"
          icon={MapPin}
          type="text"
          autoComplete="street-address"
          placeholder="Ex. Boulevard de la République, Akwa"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          minLength={5}
          required
        />

        <AuthField
          id="pharmacy-city"
          label="Ville"
          icon={MapPinned}
          type="text"
          autoComplete="address-level2"
          placeholder="Ex. Douala"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          minLength={2}
          required
        />

        <AuthField
          id="pharmacy-phone"
          label="Téléphone de l’officine"
          icon={Phone}
          type="tel"
          autoComplete="tel"
          placeholder="+2376XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Création..." : "Créer mon espace"}</span>
          <ArrowRight strokeWidth={2} />
        </button>
      </AuthFormWrapper>
    </div>
  );
}
