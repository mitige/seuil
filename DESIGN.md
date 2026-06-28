# DESIGN.md - Journal RDR

Source de vérité du système visuel. Toute génération ou édition d'UI doit s'y conformer.

## Principe directeur

Direction unique : interface sombre, sobre, technique et clinique. La profondeur vient de la bordure et de la nuance tonale, pas d'effets décoratifs. Le contenu et la lisibilité passent avant l'ornement.

## Couleurs

### Accent principal

- `--color-primary: #6E8BFF`
- `--accent-strong: #5B7BFF`
- `--accent-soft: rgba(110,139,255,0.15)`
- `--color-primary-glow: rgba(110,139,255,0.35)`

Aucun second accent décoratif. Les couleurs de risque restent strictement sémantiques.

### Surfaces

- `--bg-main #07080B`
- `--bg-side #0A0B0F`
- `--bg-card #101216`
- `--bg-card-2 #16181E`
- `--bg-inset #0B0C10`
- `--border-color rgba(255,255,255,.07)`
- `--border-strong rgba(255,255,255,.11)`

### Texte

- `--color-text #E8EBF2`
- `--color-text-muted #8A94A8`
- `--text-dim #5C6577`

### Palette sémantique

Réservée aux classes de substances, niveaux d'interaction et statuts de règles. Elle ne doit jamais servir de décoration gratuite.

## Typographie

Polices **auto-hébergées** (woff2 dans `fonts/`, servies en `'self'` - conformes à la CSP et disponibles hors-ligne via le service worker). Aucun CDN externe.

- UI / titres : **Space Grotesk** - `'Space Grotesk', ui-sans-serif, system-ui, sans-serif`
- Chiffres : **JetBrains Mono** - `'JetBrains Mono', ui-monospace, 'SF Mono', monospace`, `tabular-nums`

Ne pas réintroduire Google Fonts/Adobe Fonts via CDN : utiliser des woff2 auto-hébergés. Toute police externe exigerait de modifier la CSP et la politique de confidentialité.

## Motion

Motion fonctionnelle uniquement. Pas de halo pulsé, pas de statut animé décoratif. `prefers-reduced-motion` doit rester respecté.

## Conteneurs

Profondeur maximale : section > carte. Séparation interne par bordure ou nuance tonale, jamais par empilement de cartes décoratives.

## Icônes

Utiliser uniquement les SVG inline déjà présents, style trait simple. Ne pas mélanger plusieurs familles d'icônes.

## Accessibilité

Conserver au minimum : langue de page, labels de formulaires, focus visible, lien d'évitement, navigation au clavier, contrastes élevés et textes explicites pour les états critiques.

## Couche IA (optionnelle)

Pont local `serve.py` (same-origin, **CSP inchangée**) vers le CLI `claude`/`codex` ; **opt-in, désactivé par défaut**, repli copier-coller si le pont est absent. Réponses IA **échappées** (anti-XSS) avant rendu. Aucun second accent introduit ; UI conforme (Space Grotesk, accent indigo unique, statuts statiques, conteneurs - 2 niveaux).
