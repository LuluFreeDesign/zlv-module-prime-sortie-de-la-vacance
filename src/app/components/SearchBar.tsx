import { useState, useRef, useEffect, useId } from 'react';

interface SearchBarProps {
  onSelectCommune: (commune: string, isEligible: boolean) => void;
  communes: Array<{ name: string; isEligible: boolean; inseeCode?: string }>;
}

export function SearchBar({ onSelectCommune, communes }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Unique ids so the ARIA references stay valid even if the component is rendered more than once
  const baseId = useId().replace(/:/g, '');
  const listboxId = `commune-suggestions-${baseId}`;
  const statusId = `commune-status-${baseId}`;
  const optionId = (index: number) => `commune-option-${baseId}-${index}`;

  // Filter communes based on search query (by name or INSEE code)
  const filteredCommunes = searchQuery.trim().length >= 2
    ? communes.filter((commune) =>
        commune.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (commune.inseeCode && commune.inseeCode.includes(searchQuery.trim()))
      ).slice(0, 10) // Limit to 10 results
    : [];

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isExpanded = showSuggestions && filteredCommunes.length > 0;
  const activeIndex = isExpanded && selectedIndex < filteredCommunes.length ? selectedIndex : -1;

  // Keep the active option visible inside the listbox.
  // Scroll the listbox itself rather than calling scrollIntoView(), which would also
  // scroll the parent page when the simulator is embedded in an iframe.
  useEffect(() => {
    const listbox = listboxRef.current;
    if (!listbox || activeIndex < 0) return;
    const option = listbox.children[activeIndex] as HTMLElement | undefined;
    if (!option) return;
    if (option.offsetTop < listbox.scrollTop) {
      listbox.scrollTop = option.offsetTop;
    } else if (option.offsetTop + option.offsetHeight > listbox.scrollTop + listbox.clientHeight) {
      listbox.scrollTop = option.offsetTop + option.offsetHeight - listbox.clientHeight;
    }
  }, [activeIndex]);

  // Keyboard navigation (WAI-ARIA combobox pattern)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        if (filteredCommunes.length === 0) return;
        e.preventDefault();
        if (!showSuggestions) {
          setShowSuggestions(true);
          setSelectedIndex(0);
          return;
        }
        setSelectedIndex((prev) =>
          prev < filteredCommunes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        if (filteredCommunes.length === 0) return;
        e.preventDefault();
        if (!showSuggestions) {
          setShowSuggestions(true);
          setSelectedIndex(filteredCommunes.length - 1);
          return;
        }
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommunes.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelectCommune(filteredCommunes[activeIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        if (isExpanded) {
          e.preventDefault();
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Tab':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectCommune = (commune: { name: string; isEligible: boolean; inseeCode?: string }) => {
    onSelectCommune(commune.name, commune.isEligible);
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Search for exact match (case insensitive) by name or INSEE code
    const exactMatch = communes.find(
      (commune) => commune.name.toLowerCase() === searchQuery.trim().toLowerCase() ||
        (commune.inseeCode && commune.inseeCode === searchQuery.trim())
    );
    
    if (exactMatch) {
      handleSelectCommune(exactMatch);
    } else {
      // If no exact match, try to find the first partial match by name or INSEE code
      const partialMatch = communes.find((commune) =>
        commune.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (commune.inseeCode && commune.inseeCode.includes(searchQuery.trim()))
      );
      
      if (partialMatch) {
        handleSelectCommune(partialMatch);
      } else {
        // No match found - still trigger the result with isEligible = false
        onSelectCommune(searchQuery.trim(), false);
        setSearchQuery('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }
  };

  return (
    <div ref={searchRef} className="zlv-combobox">
      <label className="fr-label fr-mb-1w" htmlFor="commune-search">
        Saisissez la commune dans laquelle se situe votre logement vacant
        <span className="fr-hint-text">Nom de la commune ou code INSEE. Exemples : La Rochette, Nantes, 73215</span>
      </label>

      {/* Barre de recherche DSFR (le focus DSFR reste visible : outline 2px #0a76f6, RGAA 10.7) */}
      <div className="fr-search-bar" role="search">
        <input
          ref={inputRef}
          id="commune-search"
          className="fr-input"
          type="text"
          role="combobox"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Ex : La Rochette, Nantes, 73215"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isExpanded}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        />
        <button type="button" className="fr-btn" onClick={handleSearch} title="Rechercher">
          Rechercher
        </button>
      </div>

      {/* Suggestions dropdown */}
      {/* Listbox is always in the DOM so aria-controls never points to a missing id */}
      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-label="Communes suggérées"
        hidden={!isExpanded}
        className="zlv-combobox__listbox"
      >
        {isExpanded && filteredCommunes.map((commune, index) => (
          <li
            key={commune.inseeCode ?? `${commune.name}-${index}`}
            id={optionId(index)}
            role="option"
            aria-selected={activeIndex === index}
            // Keep focus on the input when clicking an option
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSelectCommune(commune)}
            onMouseEnter={() => setSelectedIndex(index)}
            className="zlv-combobox__option"
          >
            {commune.name}
          </li>
        ))}
      </ul>

      {/* Status message announced to screen readers (RGAA 7.5) */}
      <p id={statusId} role="status" className="fr-sr-only">
        {showSuggestions && searchQuery.trim().length >= 2
          ? filteredCommunes.length === 0
            ? 'Aucune commune trouvée'
            : `${filteredCommunes.length} commune${filteredCommunes.length > 1 ? 's' : ''} suggérée${filteredCommunes.length > 1 ? 's' : ''}, utilisez les flèches haut et bas pour naviguer`
          : ''}
      </p>

      {/* No results message */}
      {showSuggestions && searchQuery.trim().length >= 2 && filteredCommunes.length === 0 && (
        <div aria-hidden="true" className="zlv-combobox__empty">
          Aucune commune trouvée
        </div>
      )}
    </div>
  );
}
