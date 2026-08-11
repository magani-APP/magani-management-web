\# PharmaOS — Design System Reference

\*\*Pour les développeurs · Version 1.0 · Août 2026\*\*



\---



\## 1. Identité visuelle



Application Pharmacie est une application SaaS de gestion de pharmacie positionnée entre \*\*Linear\*\* (densité, précision, raccourcis clavier) et \*\*Apple Health\*\* (calme, clarté, confiance médicale). L'interface est conçue pour être utilisée 8h+ par jour en environnement professionnel — chaque décision de design favorise la lisibilité et réduit la fatigue cognitive.



\---



\## 2. Palette de couleurs



\### Couleurs de marque



| Nom | Hex | Usage |

|---|---|---|

| Emerald Primary | `#0B8F68` | Boutons primaires, liens actifs, indicateurs positifs |

| Emerald Deep | `#07634B` | Hover/pressed states sur primaire, dégradés |

| Emerald Darkest | `#173A30` | Textes sur fond sombre, titres foncés |

| Lime Accent | `#A8F24A` | Highlights ponctuels uniquement : point actif sidebar, barre de progression objectif, marge élevée |



> \*\*Règle d'usage du Lime\*\* : ne jamais utiliser `#A8F24A` comme couleur de texte ni comme fond de grande surface. Réservé aux micro-accents visuels (< 8px de hauteur).



\### Couleurs de fond



| Nom | Hex | Usage |

|---|---|---|

| Background | `#F5F7F5` | Fond global de l'application |

| Surface / Card | `#FFFFFF` | Cartes, panneaux, tableaux |

| Surface Alt | `#F9FBFA` | Rangées de tableau alternées, hover états |

| Muted Surface | `#F0F7F3` | Fond secondaire, labels de catégories |



\### Couleurs sémantiques



| Nom | Hex | Usage |

|---|---|---|

| Success | `#0B8F68` | Même que primary — stock OK, statut actif |

| Warning | `#F59E0B` | Stock bas, délais, alertes modérées |

| Danger | `#EF4444` | Stock critique, erreurs, annulations |

| Info | `#3B82F6` | Informations neutres, carte bancaire, réservations app |

| Purple | `#8B5CF6` | Paiements mixtes, tags admin/rôles |

| Teal | `#14B8A6` | Approvisionnements, mouvements entrants |

| Orange | `#F97316` | Alertes prix, transactions, modificatins |



\### Couleurs de paiement (Mobile Money — branding opérateurs)



| Opérateur | Hex |

|---|---|

| MTN Mobile Money | `#FFC107` |

| Orange Money | `#FF6200` |

| Espèces | `#0B8F68` |

| Carte bancaire | `#3B82F6` |

| Mixte | `#8B5CF6` |



\### Couleurs de texte



| Nom | Hex | Usage |

|---|---|---|

| Foreground / Primary text | `#0F1A15` | Titres, valeurs importantes, texte courant |

| Secondary text | `#4A5E54` | Labels de navigation |

| Muted text | `#6B7A6F` | Descriptions, sous-titres |

| Placeholder / Faint | `#9AAEA3` | Placeholders, métadonnées, labels désactivés |

| Hairline text | `#C8D5CC` | Numéros de rang, séparateurs texte |



\### Bordures et séparateurs



| Nom | Valeur | Usage |

|---|---|---|

| Border principal | `rgba(11, 143, 104, 0.10)` | Bordure standard des cartes |

| Border card | `#E8EDEA` | Bordure opaque pour tableaux et sections |

| Divider | `#F0F5F2` | Séparateurs internes légers |

| Glassmorphism border | `rgba(255, 255, 255, 0.75)` | Bordure des éléments glass (sidebar, topbar) |



\---



\## 3. Typographie



\### Police principale : Geist



```

font-family: 'Geist', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

```



Import Google Fonts :

```css

@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800\&family=Geist+Mono:wght@400;500;600\&display=swap');

```



\### Police mono : Geist Mono



Utilisée exclusivement pour :

\- Codes SKU/références produits

\- Valeurs numériques tabulaires (prix, quantités en tableau)

\- Timestamps du journal d'activité

\- Raccourcis clavier



```

font-family: 'Geist Mono', ui-monospace, monospace;

```



\### Échelle typographique



| Rôle | Taille | Poids | Usage |

|---|---|---|---|

| Display / KPI valeur | `22px` | `700` | Grandes métriques dashboard |

| Page title | `20px` | `700` | H1 des écrans |

| Section title | `16px` | `700` | Titres de sections de contenu |

| Component title | `14px` (sm) | `700` | Titres de cartes, panels |

| Body / Table content | `12px` (xs) | `600` labels, `400` values | Texte courant, tableaux |

| Caption / Meta | `11px` | `500–600` | Sous-titres, timestamps |

| Label / Badge | `10px` | `700` | Badges, état des statuts |

| Micro / Tag | `9px` | `700` | Libellés uppercase, raccourcis clavier |



\### Règles typographiques



\- \*\*Letter-spacing\*\* : `tracking-\[0.07em]` ou `tracking-\[0.08em]` pour tous les labels uppercase

\- \*\*Line-height\*\* : `leading-none` pour grandes valeurs, `leading-snug` pour multi-lignes

\- \*\*Anti-aliasing\*\* : `WebkitFontSmoothing: "antialiased"` + `MozOsxFontSmoothing: "grayscale"` sur le root



\---



\## 4. Espacement (Spacing Scale)



Système basé sur un incrément de 4px (Tailwind default).



| Token Tailwind | px | Usage type |

|---|---|---|

| `p-0.5` / `gap-0.5` | 2px | Micro-gaps entre badges |

| `p-1` / `gap-1` | 4px | Gap interne petits composants |

| `p-1.5` / `gap-1.5` | 6px | Gaps buttons, badges |

| `p-2` / `gap-2` | 8px | Padding standard interne |

| `p-2.5` / `gap-2.5` | 10px | Padding items de liste, cartes compactes |

| `p-3` / `gap-3` | 12px | Gap entre composants |

| `p-4` / `gap-4` | 16px | Padding cartes standard |

| `p-5` / `gap-5` | 20px | Padding panels principaux |

| `p-6` / `gap-6` | 24px | Padding sections de page |

| `p-7` | 28px | Padding contenu reports/settings |

| `p-8` | 32px | Padding max contenu détail |



\---



\## 5. Border Radius



| Token | px | Usage |

|---|---|---|

| `rounded-lg` | 8px | Inputs, petits buttons, micro-composants |

| `rounded-xl` | 12px | Buttons standards, badges, items de liste |

| `rounded-2xl` | 16px | \*\*Cartes principales\*\*, tableaux, panels |

| `rounded-full` | 50% | Toggles, avatars, badges ronds, indicateurs |



> \*\*Règle\*\* : Les cartes principales utilisent toujours `rounded-2xl` (16px). Les composants imbriqués utilisent `rounded-xl` (12px). Ne jamais mélanger des radius éloignés dans un même composant.



\---



\## 6. Ombres



| Nom | Valeur CSS | Usage |

|---|---|---|

| Card hover | `0 8px 24px rgba(11,143,104,0.08)` | Cartes KPI au hover |

| Sidebar | `0 4px 32px rgba(11,143,104,0.09), 0 1px 0 rgba(11,143,104,0.04), inset 0 1px 0 rgba(255,255,255,0.6)` | Floating sidebar |

| Button primary | `0 4px 16px rgba(11,143,104,0.35)` | Bouton "Encaisser" |

| Button normal | `0 2px 8px rgba(11,143,104,0.28)` | Bouton primaire standard |

| Drawer | `-4px 0 24px rgba(11,143,104,0.06)` | Panneau latéral produit |

| Tooltip | `0 8px 24px rgba(0,0,0,0.08)` | Tooltips Recharts |



\---



\## 7. Glassmorphism



Appliqué \*\*uniquement\*\* sur : sidebar flottante, top bar, modales, overlays.



```css

/\* Sidebar glassmorphism \*/

background: rgba(255, 255, 255, 0.88);

backdrop-filter: blur(24px) saturate(180%);

\-webkit-backdrop-filter: blur(24px) saturate(180%);

border: 1px solid rgba(255, 255, 255, 0.75);

```



```css

/\* Top bar glassmorphism \*/

background: rgba(245, 247, 245, 0.88);

backdrop-filter: blur(20px) saturate(160%);

\-webkit-backdrop-filter: blur(20px) saturate(160%);

border-bottom: 1px solid rgba(11, 143, 104, 0.07);

```



```css

/\* Sticky day headers (journal) \*/

background: rgba(245, 247, 245, 0.95);

backdrop-filter: blur(8px);

```



> \*\*Règle\*\* : Ne PAS appliquer glassmorphism aux cartes de contenu, tableaux ou formulaires. L'effet est réservé aux éléments superposés qui doivent laisser transparaître le fond.



\---



\## 8. Composants UI



\### Bouton primaire

```

px: 14px (px-3.5)    py: 8px (py-2)

border-radius: 12px (rounded-xl)

background: #0B8F68

text: white, 10px, font-bold

shadow: 0 2px 8px rgba(11,143,104,0.3)

hover: opacity 0.9

active: scale(0.98)

```



\### Bouton Encaisser (CTA principal POS)

```

width: 100%    py: 16px (py-4)

border-radius: 16px (rounded-2xl)

background: linear-gradient(135deg, #0B8F68, #07634B)

text: white, 14px, font-bold

shadow: 0 4px 20px rgba(11,143,104,0.40)

disabled: opacity 0.4

```



\### Bouton secondaire / outline

```

px: 12px    py: 8px

border-radius: 12px

border: 1px solid #E8EDEA

background: white

text: #6B7A6F, 10px, font-bold

hover: border-color rgba(11,143,104,0.30), color #0B8F68

```



\### Input de recherche

```

height: 36px (py-2)

padding-left: 32px (espace pour icône)

border-radius: 12px

border: 1px solid rgba(11,143,104,0.10)

background: rgba(255,255,255,0.85)

focus: border rgba(11,143,104,0.40) + ring rgba(11,143,104,0.08)

font: 12px, font-medium, Geist

placeholder: #9AAEA3

```



\### Input de recherche POS (large)

```

height: 52px (py-3.5)

border: 2px solid #E8EDEA

focus: border 2px solid #0B8F68 + shadow 0 0 0 4px rgba(11,143,104,0.08)

font: 14px, font-medium

```



\### Badge / Pill status

```

padding: 2px 8px (px-2 py-0.5)

border-radius: full

font: 9–10px, font-bold

border: 1px solid



En stock:    bg #ECFDF5  text #065F46  border #A7F3D0  dot #10B981

Stock bas:   bg #FFFBEB  text #92400E  border #FDE68A  dot #F59E0B

Critique:    bg #FEF2F2  text #991B1B  border #FECACA  dot #EF4444

Expiré:      bg #F9FAFB  text #6B7280  border #E5E7EB  dot #9CA3AF

```



\### Badge réservation

```

Nouvelle:    bg #EFF6FF  text #1D4ED8  border #BFDBFE

Confirmée:   bg #F0FAF6  text #065F46  border #A7F3D0

Préparée:    bg #FFFBEB  text #92400E  border #FDE68A

Retirée:     bg #F9FAFB  text #6B7280  border #E5E7EB

Annulée:     bg #FEF2F2  text #991B1B  border #FECACA

```



\### Toggle

```

width: 40px    height: 22px    border-radius: full

ON:  background #0B8F68   thumb translateX(21px)

OFF: background #D1D5DB   thumb translateX(3px)

thumb: 16×16px, white, rounded-full, shadow-sm

transition: transform 200ms, background-color 200ms

```



\### Carte KPI (Dashboard)

```

padding: 20px (p-5)

border-radius: 16px (rounded-2xl)

border: 1px solid #E8EDEA

background: white

hover: shadow 0 8px 24px rgba(11,143,104,0.05)

transition: all 200ms



Icon container: 32×32px, rounded-xl, background: color + "14" (alpha 8%)

Valeur: 22px, font-bold, #0F1A15, tracking-tight

Label: 9px, font-bold, #9AAEA3, uppercase, tracking-\[0.08em]

```



\### Tableau dense

```

header background: #F5F7F5

header text: 9px, font-bold, #9AAEA3, uppercase, tracking-\[0.08em]

row: border-top 1px solid #F0F5F2

row hover: background #F9FBFA

row selected: background rgba(240,250,246,0.6) — emerald-50/60

cell padding: 16px horizontal, 14px vertical (px-4 py-3.5)

cell font: 11px

sticky header: z-index 10

``` 



\### Sidebar (floating)

```

width: 228px

position: fixed  left: 8px  top: 8px  bottom: 8px

border-radius: 16px (rounded-2xl)

glassmorphism (cf. section 7)

nav item active: background #0B8F68, text white, shadow 0 2px 8px rgba(11,143,104,0.28)

nav item hover: background #F0F7F3, text #0B8F68

section header: 9px, font-bold, #C8D5CC, uppercase, tracking-\[0.08em]

main content margin-left: 240px

```



\---



\## 9. Icônes



Bibliothèque : \*\*Lucide React\*\* (https://lucide.dev)



| Taille | Usage |

|---|---|

| `size={11–12}` | Icônes dans les badges, mini-boutons |

| `size={13–14}` | Navigation sidebar, boutons standards |

| `size={15–16}` | Icônes dans les inputs, KPI cards |

| `size={18–20}` | POS search bar, titres de sections |

| `size={24–28}` | États vides (empty states) |



\### Icônes clés de l'application



| Écran | Icône | Nom Lucide |

|---|---|---|

| Dashboard | `LayoutDashboard` | — |

| Caisse POS | `ShoppingCart` | — |

| Produits | `Package2` | — |

| Rapports | `BarChart2` | — |

| Journal | `ClipboardList` | — |

| Réservations | `CalendarCheck` | — |

| Paramètres | `Settings` | — |

| Médicament / produit | `Pill` | Uniformiser sur tous les écrans |

| Scanner barcode | `ScanLine` | POS only |

| Source App | `Smartphone` | Réservations |



\---



\## 10. Layout et grille



\### Structure globale

```

App root: flex, h-screen, overflow-hidden

&#x20; Sidebar: fixed, 228px, left 8px / top 8px / bottom 8px

&#x20; Main column: flex-col, margin-left 240px, h-full

&#x20;   TopBar: sticky, height ≈ 57px, glassmorphism

&#x20;   Content area: flex-1, overflow-hidden

&#x20;     \[Screen content]

```



\### Grille de contenu (Dashboard)

12 colonnes, gap 16px (gap-4). Breakpoints non définis pour le MVP desktop.



| Zone | Colonnes |

|---|---|

| Graphe CA | col-span-8 |

| Donut paiements | col-span-4 |

| Alertes | col-span-4 |

| Top produits | col-span-5 |

| Vue propriétaire | col-span-3 |



\### Écrans à panneau latéral

\- \*\*Produits\*\* : `flex-1` table + `w-\[370px]` drawer (flex sibling, pas fixed)

\- \*\*Réservations\*\* : `w-\[400px]` liste + `flex-1` détail

\- \*\*Rapports / Settings\*\* : `w-\[210–218px]` nav + `flex-1` contenu



\### POS

```

Left panel: flex-1, padding 20px

&#x20; Search: fixed height

&#x20; Categories: flex, overflow-x-auto, no-scrollbar

&#x20; Product grid: flex-1, overflow-y-auto, 3 colonnes

Right panel: w-\[340px], fixed, flex-col

&#x20; Header + items (scroll) + footer (fixed)

```



\---



\## 11. Animations \& transitions



Toutes les transitions doivent être \*\*légères et rapides\*\* :



| Propriété | Durée | Easing |

|---|---|---|

| Couleur / opacity | `150ms` | ease |

| Shadow | `200ms` | ease |

| Scale (active state) | `100ms` | ease |

| Toggle thumb | `200ms` | ease |

| Drawer apparition | CSS flex (pas d'animation) | — |



```css

/\* Transition standard \*/

transition: all 150ms ease;



/\* Transitions spécifiques \*/

transition-colors: 150ms;

transition-shadow: 200ms;

hover:opacity: 0.9;

active:scale: 0.98;

```



> \*\*Pas d'animations d'entrée/sortie complexes au MVP.\*\* Les éléments apparaissent immédiatement via changement d'état React. Garder framer-motion / motion en réserve pour v2.



\---



\## 12. Scrollbars



Les scrollbars sont masquées par défaut sur tous les panneaux scrollables :

```css

scrollbar-width: none;          /\* Firefox \*/

::-webkit-scrollbar { display: none; }  /\* Chrome/Safari \*/

\-ms-overflow-style: none;       /\* IE/Edge \*/

```



\---



\## 13. États des composants



\### Bouton primaire

| État | Apparence |

|---|---|

| Default | bg #0B8F68, shadow normal |

| Hover | opacity 0.90 |

| Active / Pressed | scale(0.98) |

| Disabled | opacity 0.40, cursor not-allowed |

| Loading | — (à définir v2) |



\### Input

| État | Apparence |

|---|---|

| Default | border rgba(11,143,104,0.10) |

| Focus | border rgba(11,143,104,0.40) + ring rgba(11,143,104,0.08) |

| Filled | border rgba(11,143,104,0.40) |

| Error | border #EF4444 + bg rouge-50 |



\### Row de tableau

| État | Background |

|---|---|

| Default pair | `white` |

| Default impair | `#FDFEFE` |

| Hover | `#F9FBFA` |

| Selected | `rgba(240,250,246,0.6)` |



\### État vide (Empty state)

```

Icône: 24–28px, couleur #C8D5CC

Titre: 14px, font-bold, #6B7A6F

Description: 12px, #9AAEA3

CTA (si applicable): bouton outline emerald

Centré verticalement dans le conteneur

```



\---



\## 14. Accessibilité



\- Contraste minimum : \*\*4.5:1\*\* pour le texte courant (WCAG AA)

\- Contraste large texte (≥ 18px bold) : \*\*3:1\*\*

\- `#0F1A15` sur blanc : ratio ≈ 17:1 ✓

\- `#0B8F68` sur blanc : ratio ≈ 3.8:1 — à éviter pour du texte body, OK pour des icônes et du texte large/bold

\- `#9AAEA3` sur blanc : ratio ≈ 2.9:1 — uniquement pour les labels non-essentiels

\- Tous les boutons ont un état `:focus-visible` via `outline-ring/50` (Tailwind base)

\- Les tableaux ont des headers `<th>` avec scope

\- Les toggles sont des `<button>` avec aria-pressed



\---



\## 15. Variables CSS personnalisées (theme.css)



```css

:root {

&#x20; --background: #F5F7F5;

&#x20; --foreground: #0F1A15;

&#x20; --card: #ffffff;

&#x20; --card-foreground: #0F1A15;

&#x20; --primary: #0B8F68;

&#x20; --primary-foreground: #ffffff;

&#x20; --secondary: #F0F7F3;

&#x20; --secondary-foreground: #07634B;

&#x20; --muted: #E8EDEA;

&#x20; --muted-foreground: #6B7A6F;

&#x20; --accent: #A8F24A;

&#x20; --accent-foreground: #173A30;

&#x20; --destructive: #EF4444;

&#x20; --destructive-foreground: #ffffff;

&#x20; --border: rgba(11, 143, 104, 0.10);

&#x20; --input-background: #F0F5F2;

&#x20; --ring: #0B8F68;

&#x20; --radius: 1rem;  /\* 16px \*/

}

```



Classes Tailwind correspondantes : `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `border-border`, etc.



\---



\## 16. Nommage et conventions



\### Couleurs custom (via style inline)

Pour les couleurs non disponibles dans la palette Tailwind étendue, utiliser `style={{ color: "#0B8F68" }}` plutôt que des classes JIT arbitraires pour une meilleure lisibilité du code.



\### Classes utilitaires fréquentes



```jsx

// Texte muted avec uppercase tracking

"text-\[9px] font-bold text-\[#9AAEA3] uppercase tracking-\[0.08em]"



// Valeur principale dashboard

"text-\[22px] font-bold text-\[#0F1A15] tracking-tight leading-none"



// Bordure standard carte

"border border-\[#E8EDEA] rounded-2xl bg-white"



// Transition standard

"transition-all duration-150"

"transition-colors"



// Input focus ring emerald

"focus:border-\[#0B8F68]/40 focus:ring-2 focus:ring-\[#0B8F68]/10"

```



\---



\## 17. Do's \& Don'ts



\### ✓ Do

\- Utiliser `#0B8F68` comme seul accent coloré dominant

\- Garder `#A8F24A` pour des accents < 8px de hauteur uniquement

\- Arrondir toutes les cartes à `rounded-2xl` (16px)

\- Utiliser `font-mono` (Geist Mono) pour tous les nombres tabulaires

\- Masquer les scrollbars sur tous les panneaux

\- Maintenir une hiérarchie typographique claire : 22px valeur > 14px titre > 12px body > 9px label



\### ✗ Don't

\- Ne pas utiliser de gradients autres que `linear-gradient(135deg, #0B8F68, #07634B)` (bouton CTA uniquement)

\- Ne pas appliquer glassmorphism sur des cartes de contenu

\- Ne pas utiliser `#A8F24A` comme couleur de texte

\- Ne pas mélanger des radius de 8px et 16px dans un même composant

\- Ne pas utiliser de shadows lourdes (> `0.12` opacity) sur les cartes standard

\- Ne pas créer de nouvelles palettes de couleurs sans les ajouter dans ce document



\---



\*Document maintenu par l'équipe design PharmaOS. Dernière mise à jour : 09/08/2026.\*



