import { ReactNode } from 'react';

interface CalloutProps {
  type: 'success' | 'error';
  title: string;
  message: string | ReactNode;
}

// Alerte DSFR : https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/alerte
export function Callout({ type, title, message }: CalloutProps) {
  return (
    <div className={`fr-alert fr-alert--${type} fr-mt-3w`}>
      <h3 className="fr-alert__title">{title}</h3>
      <p>{message}</p>
    </div>
  );
}
