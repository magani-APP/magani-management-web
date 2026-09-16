"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Contrôle l'affichage du raccourci "Maga — officine" dans la sidebar.
 *
 * Il n'existe pas (encore) d'endpoint backend pour ce réglage : la préférence
 * est donc persistée localement (localStorage) et synchronisée en direct
 * entre la page Paramètres et la Sidebar via un évènement custom, puisque
 * les deux composants sont montés en même temps mais ne partagent pas
 * directement d'état React.
 */

const STORAGE_KEY = "magani:maga-officine-enabled";
const CHANGE_EVENT = "magani:maga-officine-changed";

// Visible par défaut (comportement actuel de l'app).
const DEFAULT_ENABLED = true;

function readStoredValue(): boolean {
  if (typeof window === "undefined") return DEFAULT_ENABLED;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return DEFAULT_ENABLED;
  return raw === "true";
}

function writeStoredValue(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(value));
  // On diffère la notification des autres composants (setTimeout 0) : le
  // dispatch de l'évènement appelle synchronement les listeners d'autres
  // composants (ex. la Sidebar) et peut donc déclencher un setState pendant
  // le rendu du composant appelant (ex. si React invoque un updater
  // fonctionnel pendant sa phase de rendu). En sortant le dispatch de la
  // pile d'appel courante, on évite l'erreur React "Cannot update a
  // component while rendering a different component".
  window.setTimeout(() => {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, 0);
}

export function useMagaVisibility() {
  const [enabled, setEnabledState] = useState<boolean>(DEFAULT_ENABLED);

  useEffect(() => {
    // Synchronise avec la valeur réellement stockée dès le montage (le
    // rendu serveur ne connaît pas localStorage).
    setEnabledState(readStoredValue());

    function handleChange() {
      setEnabledState(readStoredValue());
    }

    window.addEventListener(CHANGE_EVENT, handleChange);
    // "storage" couvre le cas multi-onglets.
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  // Important : on ne fait AUCUN effet de bord (localStorage, dispatchEvent)
  // à l'intérieur d'un updater fonctionnel passé à setState. React peut
  // appeler cet updater pendant la phase de rendu, ce qui exécuterait alors
  // l'effet de bord (et le setState qu'il déclenche ailleurs) en plein
  // rendu — c'est exactement l'erreur rencontrée. On calcule donc la
  // prochaine valeur AVANT d'appeler setState, en dehors de tout updater.
  const setEnabled = useCallback((value: boolean) => {
    writeStoredValue(value);
    setEnabledState(value);
  }, []);

  const toggle = useCallback(() => {
    const next = !readStoredValue();
    writeStoredValue(next);
    setEnabledState(next);
  }, []);

  return { enabled, setEnabled, toggle };
}
