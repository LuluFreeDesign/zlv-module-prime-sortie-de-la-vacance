import { useState } from 'react';
import { SearchBar } from '@/app/components/SearchBar';
import { Callout } from '@/app/components/Callout';
import { communes } from '@/data/communes';

export default function App() {
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  // Incremented on each search so the result is re-announced even if the same commune is selected again
  const [searchCount, setSearchCount] = useState(0);

  const handleSelectCommune = (commune: string, eligible: boolean) => {
    setSelectedCommune(commune);
    setIsEligible(eligible);
    setSearchCount((count) => count + 1);
  };

  return (
    <div className="fr-container fr-py-4w">
      <main>
        <SearchBar
          onSelectCommune={handleSelectCommune}
          communes={communes}
        />

        {/* Status message present from page load so screen readers announce the result (RGAA 7.5) */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {selectedCommune && isEligible !== null && (
            <Callout
              key={searchCount}
              type={isEligible ? 'success' : 'error'}
              title={
                isEligible
                  ? `Votre logement pourrait être éligible à la prime de sortie de vacance de l'Anah !`
                  : `Votre logement n'est pas éligible à la prime de sortie de vacance de l'Anah.`
              }
              message={
                isEligible
                  ? `La commune de ${selectedCommune} fait partie des zones rurales éligibles à la prime de sortie de vacance.`
                  : (
                    <>
                      La commune de {selectedCommune} ne fait pas partie des zones rurales éligibles à la prime de sortie de vacance. Cependant, vous pouvez vous rendre sur le site <a href="https://mesaides.france-renov.gouv.fr/" target="_blank" rel="noopener noreferrer" title="Mes aides réno - nouvelle fenêtre">Mes aides réno</a> afin de voir si d'autres aides peuvent être disponibles pour votre projet.
                    </>
                  )
              }
            />
          )}
        </div>

        {isEligible && (
          <div className="zlv-conditions fr-mt-3w fr-p-3w">
            <h3 className="fr-h6 fr-mb-2w">Conditions d'éligibilité à l'obtention de la prime :</h3>
            <ul className="fr-mb-3w">
              <li>Le logement doit être vacant depuis au moins 2 ans</li>
              <li>Les travaux doivent permettre une sortie de vacance effective</li>
              <li>Le projet doit respecter les critères de performance énergétique</li>
            </ul>

            <h3 className="fr-h6 fr-mb-1w">Comment obtenir la prime ?</h3>
            <p>
              Pour obtenir la prime, contactez votre conseiller local France Rénov'. Il vous guidera à travers les démarches nécessaires pour déposer votre demande de subvention et de prime.
            </p>

            <ul className="fr-btns-group fr-btns-group--inline-md">
              <li>
                <a
                  className="fr-btn"
                  href="https://france-renov.gouv.fr/preparer-projet/trouver-conseiller"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Contacter mon conseiller - nouvelle fenêtre"
                >
                  Contacter mon conseiller
                </a>
              </li>
              <li>
                <a
                  className="fr-btn fr-btn--secondary"
                  href="https://aides-territoires.beta.gouv.fr/aides/prime-sortie-de-la-vacance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Consulter les conditions détaillées - nouvelle fenêtre"
                >
                  Consulter les conditions détaillées
                </a>
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
