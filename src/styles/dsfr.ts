/*
 * Système de Design de l'État (DSFR) : seulement le cœur et les composants utilisés,
 * pour garder le fichier unique léger. Le cœur fournit la typographie Marianne
 * et le focus visible DSFR (outline 2px #0a76f6, offset 2px — RGAA 10.7).
 * Les polices sont chargées depuis jsDelivr (voir dsfrFontsCdn dans vite.config.ts).
 */
import '@gouvfr/dsfr/dist/core/core.main.min.css';
import '@gouvfr/dsfr/dist/component/link/link.main.min.css';
import '@gouvfr/dsfr/dist/component/button/button.main.min.css';
import '@gouvfr/dsfr/dist/component/form/form.main.min.css';
import '@gouvfr/dsfr/dist/component/input/input.main.min.css';
import '@gouvfr/dsfr/dist/component/search/search.main.min.css';
import '@gouvfr/dsfr/dist/component/alert/alert.main.min.css';
