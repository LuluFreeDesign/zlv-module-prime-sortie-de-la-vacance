import { useState } from 'react';
import { SearchBar } from '@/app/components/SearchBar';
import { Callout } from '@/app/components/Callout';
import { communes } from '@/data/communes';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const handleSelectCommune = (commune: string, eligible: boolean) => {
    setSelectedCommune(commune);
    setIsEligible(eligible);
  };

  return (
    <div 
      className="min-h-screen p-6 md:p-8"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-3xl mx-auto">
        <main>
          <SearchBar 
            onSelectCommune={handleSelectCommune}
            communes={communes}
          />

          {selectedCommune && isEligible !== null && (
            <Callout
              type={isEligible ? 'success' : 'error'}
              title={
                isEligible
                  ? `Votre logement pourrait être éligible à la prime de sortie de vacance de l'Anah !`
                  : `Vous n'êtes malheureusement pas éligible à cette prime.`
              }
              message={
                isEligible
                  ? `La commune de ${selectedCommune} fait partie des zones rurales éligibles à la prime de sortie de vacance.`
                  : `La commune de ${selectedCommune} ne fait pas partie des zones rurales éligibles à cette prime. Cependant, d'autres aides peuvent être disponibles pour votre projet.`
              }
            />
          )}

          {isEligible && (
            <div className="mt-6 p-4 border" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>
              <h6 
                className="mb-3"
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: '1.5'
                }}
              >
                Conditions d'éligibilité à l'obtention de la prime :
              </h6>
              <ul className="list-disc list-inside space-y-2 mb-6" style={{ color: 'var(--foreground)' }}>
                <li>Le logement doit être vacant depuis au moins 2 ans</li>
                <li>Les travaux doivent permettre une sortie de vacance effective</li>
                <li>Le projet doit respecter les critères de performance énergétique</li>
              </ul>
              
              <h6 
                className="mb-2"
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: '1.5'
                }}
              >
                Comment obtenir la prime ?
              </h6>
              <p className="mb-4" style={{ color: 'var(--foreground)' }}>
                Pour obtenir la prime, contactez votre conseiller local France Rénov'. Il vous guidera à travers les démarches nécessaires pour déposer votre demande de subvention et de prime.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://france-renov.gouv.fr/preparer-projet/trouver-conseiller"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    borderRadius: 'var(--radius)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Contacter mon conseiller
                </a>
                <a
                  href="https://aides-territoires.beta.gouv.fr/aides/prime-sortie-de-la-vacance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border hover:opacity-70 transition-opacity"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--primary)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  Consulter les conditions détaillées
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
