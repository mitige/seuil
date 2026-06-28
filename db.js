/**
 * Seuil - Base de données locale de substances et de leurs interactions
 * Contenu rédactionnel original ; données factuelles d'après des sources publiques de réduction des risques.
 */

const INTERACTION_CATEGORIES = {
    "synergy": {
        "name": "Synergie & Intensification",
        "color": "#3b82f6", /* Bleu */
        "class": "int-synergy",
        "description": "Les effets peuvent se renforcer dans plusieurs dimensions à la fois. L’intensité devient plus difficile à prévoir, même avec des doses habituellement tolérées."
    },
    "low_risk": {
        "name": "Risque faible documenté",
        "color": "#10b981", /* Vert */
        "class": "int-low-risk",
        "description": "Aucune interaction majeure n’est documentée dans cette base, mais cela ne signifie pas absence de risque : produit, dose, santé et contexte restent déterminants."
    },
    "decrease": {
        "name": "Diminution / Annulation",
        "color": "#84cc16", /* Vert clair / Lime */
        "class": "int-decrease",
        "description": "Une substance peut atténuer ou masquer les effets de l’autre. Attention : masquer un effet ne supprime pas forcément la toxicité ni le risque de redosage."
    },
    "caution": {
        "name": "Prudence / Imprévisible",
        "color": "#eab308", /* Jaune */
        "class": "int-caution",
        "description": "Association instable : anxiété, confusion, malaise physique ou réactions contradictoires sont possibles. Prudence maximale et éviter les redoses rapprochées."
    },
    "unsafe": {
        "name": "Risqué / Risques accrus",
        "color": "#f97316", /* Orange */
        "class": "int-unsafe",
        "description": "Les risques physiologiques ou psychologiques augmentent nettement : charge cardiovasculaire, sédation, toxicité cumulative ou perte de contrôle peuvent apparaître."
    },
    "dangerous": {
        "name": "Dangereux / Éviter",
        "color": "#ef4444", /* Rouge */
        "class": "int-dangerous",
        "description": "Combinaison à éviter : risque élevé de malaise grave, détresse respiratoire, accident cardiovasculaire, blackout ou comportement dangereux."
    },
    "deadly": {
        "name": "Mortel / Danger de mort",
        "color": "#7f1d1d", /* Rouge foncé / bordeaux */
        "class": "int-deadly",
        "description": "Danger vital documenté. Ne pas associer : le risque de coma, d’arrêt respiratoire, d’étouffement, d’overdose ou de séquelles irréversibles est majeur."
    },
    "unknown": {
        "name": "Non documenté / Inconnu",
        "color": "#9ca3af", /* Gris */
        "class": "int-unknown",
        "description": "Données insuffisantes ou absentes. En réduction des risques, l’inconnu doit être traité comme potentiellement dangereux."
    }
};

const SUBSTANCE_DB = {

    // === Fiches détaillées additionnelles ===
    // Paliers = fourchettes de réduction des risques publiques et convergentes (repères
    // indicatifs et non prescriptifs), jamais une recommandation. Rédaction originale Seuil.
    "mescaline": {
        "name": "Mescaline", "category": "Psychédélique", "class": "psychedelic",
        "description": "Phénéthylamine psychédélique naturellement présente dans certains cactus (peyotl, San Pedro). Expérience longue, à forte composante corporelle, précédée de nausées fréquentes.",
        "dosages": { "unit": "mg", "threshold": "50 mg", "light": "100 - 200 mg", "common": "200 - 350 mg", "strong": "350 - 500 mg", "heavy": "500 mg +" },
        "durations": { "onset": "45 - 90 min", "comeup": "1 - 2 h", "peak": "4 - 6 h", "offset": "2 - 4 h", "total": "8 - 12 h" },
        "durations_seconds": { "onset": 3600, "comeup": 3600, "peak": 14400, "offset": 7200, "total": 36000 },
        "aliases": ["peyotl", "san pedro", "cactus"],
        "forms": ["cactus séché/frais", "poudre", "extrait"],
        "legal_status": "Stupéfiant en France ; statut variable ailleurs. Cette fiche n'est pas un avis juridique.",
        "profile": "La durée et la lenteur de montée sont les principaux pièges : redoser par impatience est une cause fréquente d'expérience qui dérape. Les nausées initiales sont attendues.",
        "effects": ["Modification visuelle et émotionnelle progressive, introspection.", "Nausées et inconfort corporel en montée.", "Effets longs qui demandent un cadre dégagé."],
        "risk_factors": ["Antécédents psychotiques ou bipolaires.", "Association au lithium ou à certains antidépresseurs.", "Cactus mal identifié ou extrait de concentration inconnue."],
        "avoid_if": ["État psychique fragile ou contexte non sécurisé.", "Obligation importante dans la journée.", "Conduite et activités à risque."],
        "warning_signs": ["Angoisse qui ne redescend pas, panique.", "Vomissements importants et déshydratation.", "Douleur thoracique, malaise."],
        "aftercare": ["Repos, hydratation, repas léger après les nausées.", "Espacer largement les expériences psychédéliques.", "En parler si le vécu reste pesant."],
        "rdr_rules": ["Attendre la fin complète de la montée (très lente) avant toute idée de redose.", "Bien identifier le cactus/extrait et prévoir une personne sobre.", "Anticiper les nausées : estomac léger, environnement calme."]
    },
    "1p_lsd": {
        "name": "1P-LSD", "category": "Psychédélique (lysergamide)", "class": "psychedelic",
        "description": "Lysergamide très proche du LSD, le plus souvent sur buvard. Profil subjectif quasi identique au LSD ; sa diffusion tient à un statut légal mouvant.",
        "dosages": { "unit": "µg", "threshold": "10 µg", "light": "25 - 75 µg", "common": "75 - 150 µg", "strong": "150 - 300 µg", "heavy": "300 µg +" },
        "durations": { "onset": "20 - 60 min", "comeup": "1 - 2 h", "peak": "3 - 5 h", "offset": "2 - 4 h", "total": "8 - 12 h" },
        "durations_seconds": { "onset": 2400, "comeup": 3600, "peak": 14400, "offset": 10800, "total": 36000 },
        "aliases": ["1-propionyl-LSD"],
        "forms": ["buvard", "solution"],
        "legal_status": "Statut variable et évolutif selon les pays. Cette fiche n'est pas un avis juridique.",
        "profile": "Comme le LSD, l'expérience dépend fortement du dosage du buvard (souvent incertain) et du contexte émotionnel.",
        "effects": ["Modification des perceptions, du sens du temps et de l'émotion.", "Effets très longs.", "Pupilles dilatées, tension, parfois nausées en montée."],
        "risk_factors": ["Dosage réel du buvard incertain.", "Antécédents psychotiques ou bipolaires.", "Association au lithium (risque de crise)."],
        "avoid_if": ["État psychique fragile ou cadre non sécurisé.", "Conduite ou activité exigeant vigilance.", "Lendemain chargé."],
        "warning_signs": ["Angoisse durable, panique, idées noires.", "Confusion sévère ou agitation incontrôlable.", "Signes physiques inhabituels."],
        "aftercare": ["Repos et environnement calme.", "Espacer les usages (tolérance rapide).", "Parler à une personne de confiance si besoin."],
        "rdr_rules": ["Commencer bas, attendre la montée complète avant toute redose.", "Cadre rassurant, personne sobre, jamais seul.", "Vérifier au mieux l'origine du buvard."]
    },
    "2c_i": {
        "name": "2C-I", "category": "Psychédélique (phénéthylamine)", "class": "psychedelic",
        "description": "Phénéthylamine 2C à composante visuelle marquée et légèrement stimulante. L'écart entre dose agréable et dose inconfortable est étroit.",
        "dosages": { "unit": "mg", "threshold": "2 mg", "light": "5 - 10 mg", "common": "10 - 20 mg", "strong": "20 - 30 mg", "heavy": "30 mg +" },
        "durations": { "onset": "30 - 75 min", "comeup": "30 - 60 min", "peak": "2 - 4 h", "offset": "1 - 2 h", "total": "6 - 10 h" },
        "durations_seconds": { "onset": 3000, "comeup": 2700, "peak": 10800, "offset": 5400, "total": 28800 },
        "aliases": [],
        "forms": ["poudre", "gélule", "comprimé"],
        "legal_status": "Stupéfiant dans de nombreux pays ; statut variable. Cette fiche n'est pas un avis juridique.",
        "profile": "Sensible à la quantité : une petite différence de pesée change nettement l'expérience. Ne pas confondre avec des dérivés plus toxiques (NBOMe).",
        "effects": ["Visuels marqués, stimulation, euphorie ou anxiété selon le contexte.", "Tension, mâchoires serrées possibles.", "Montée parfois inconfortable."],
        "risk_factors": ["Pesée imprécise (actif à faible quantité).", "Confusion possible avec un NBOMe bien plus dangereux.", "Antécédents cardiaques ou psychiatriques."],
        "avoid_if": ["Problème cardiaque, forte chaleur.", "État psychique fragile.", "Association à d'autres stimulants ou psychédéliques."],
        "warning_signs": ["Angoisse intense durable.", "Douleur thoracique, malaise, fièvre.", "Confusion ou agitation sévère."],
        "aftercare": ["Repos, hydratation modérée.", "Espacer les usages.", "Surveiller le retour au calme."],
        "rdr_rules": ["Peser précisément (balance de précision au milligramme) et commencer bas.", "Vérifier l'identité : un buvard « 2C-I » peut être un NBOMe.", "Attendre la montée complète avant toute redose."]
    },
    "2c_e": {
        "name": "2C-E", "category": "Psychédélique (phénéthylamine)", "class": "psychedelic",
        "description": "Phénéthylamine 2C réputée intense et introspective, à montée parfois éprouvante physiquement. Très sensible aux variations de quantité.",
        "dosages": { "unit": "mg", "threshold": "2 mg", "light": "5 - 10 mg", "common": "10 - 15 mg", "strong": "15 - 25 mg", "heavy": "25 mg +" },
        "durations": { "onset": "30 - 90 min", "comeup": "30 - 60 min", "peak": "3 - 5 h", "offset": "1 - 2 h", "total": "6 - 10 h" },
        "durations_seconds": { "onset": 3600, "comeup": 2700, "peak": 14400, "offset": 5400, "total": 28800 },
        "aliases": [],
        "forms": ["poudre", "gélule"],
        "legal_status": "Statut variable selon les pays. Cette fiche n'est pas un avis juridique.",
        "profile": "Quelques milligrammes de différence changent fortement l'expérience ; la montée corporelle peut être difficile.",
        "effects": ["Visuels profonds, introspection, intensité émotionnelle.", "Inconfort physique en montée.", "Effets longs."],
        "risk_factors": ["Pesée imprécise (marge étroite).", "Antécédents psychiatriques.", "Mélanges, notamment stimulants."],
        "avoid_if": ["État psychique fragile, cadre non sécurisé.", "Problème cardiaque.", "Conduite et activités à risque."],
        "warning_signs": ["Angoisse ou panique durable.", "Douleur thoracique, malaise.", "Confusion sévère."],
        "aftercare": ["Repos, calme, hydratation.", "Espacer fortement les usages.", "Débriefer si le vécu reste lourd."],
        "rdr_rules": ["Peser au milligramme près et commencer bas.", "Patienter longuement avant toute redose.", "Cadre rassurant et personne sobre."]
    },
    "4_aco_dmt": {
        "name": "4-AcO-DMT", "category": "Psychédélique (tryptamine)", "class": "psychedelic",
        "description": "Tryptamine de synthèse apparentée à la psilocybine, dont elle partage l'essentiel du profil. Souvent en poudre ou en gélules, ce qui rend l'auto-dosage incertain.",
        "dosages": { "unit": "mg", "threshold": "2 mg", "light": "5 - 10 mg", "common": "10 - 25 mg", "strong": "25 - 35 mg", "heavy": "35 mg +" },
        "durations": { "onset": "15 - 45 min", "comeup": "20 - 40 min", "peak": "1.5 - 3 h", "offset": "1 - 2 h", "total": "3 - 6 h" },
        "durations_seconds": { "onset": 1800, "comeup": 1800, "peak": 7200, "offset": 3600, "total": 14400 },
        "aliases": ["psilacétine"],
        "forms": ["poudre", "gélule"],
        "legal_status": "Statut variable selon les pays. Cette fiche n'est pas un avis juridique.",
        "profile": "Proche de la psilocybine mais en poudre : l'homogénéité et la pesée sont les principaux enjeux de sécurité.",
        "effects": ["Visuels, euphorie ou introspection, vagues émotionnelles.", "Nausées possibles en montée.", "Profil proche des champignons."],
        "risk_factors": ["Pesée imprécise de la poudre.", "Antécédents psychiatriques.", "Mélanges."],
        "avoid_if": ["État psychique fragile.", "Cadre non sécurisé.", "Conduite et activités à risque."],
        "warning_signs": ["Angoisse durable, panique.", "Confusion sévère.", "Malaise physique inhabituel."],
        "aftercare": ["Repos et calme.", "Espacer les usages (tolérance croisée avec la psilocybine).", "Parler si besoin."],
        "rdr_rules": ["Peser précisément et commencer bas.", "Attendre la montée complète avant toute redose.", "Cadre rassurant, jamais seul."]
    },
    "mda": {
        "name": "MDA", "category": "Empathogène / psychédélique", "class": "empathogen",
        "description": "Proche de la MDMA mais à composante psychédélique et stimulante plus marquée, et à durée plus longue. La charge cardiaque et thermique est au moins aussi importante.",
        "dosages": { "unit": "mg", "threshold": "20 mg", "light": "30 - 70 mg", "common": "70 - 130 mg", "strong": "130 - 180 mg", "heavy": "180 mg +" },
        "durations": { "onset": "30 - 60 min", "comeup": "30 - 60 min", "peak": "2 - 4 h", "offset": "1 - 2 h", "total": "6 - 8 h" },
        "durations_seconds": { "onset": 2700, "comeup": 2700, "peak": 10800, "offset": 7200, "total": 25200 },
        "aliases": ["sass", "tenamfétamine"],
        "forms": ["cristaux", "poudre", "gélule"],
        "legal_status": "Stupéfiant en France. Cette fiche n'est pas un avis juridique.",
        "profile": "Plus longue et plus « psychédélique » que la MDMA, avec la même charge sur le cœur et la thermorégulation : la chaleur et les redoses sont les risques majeurs.",
        "effects": ["Empathie, énergie, stimulation sensorielle, visuels légers.", "Hausse de température, du cœur et de la tension.", "Descente et fatigue marquées."],
        "risk_factors": ["Surchauffe et déshydratation en milieu chaud et dansant.", "Redoses qui aggravent la charge cardiaque.", "Association à d'autres stimulants ou antidépresseurs (risque sérotoninergique)."],
        "avoid_if": ["Problème cardiaque, forte chaleur.", "Prise d'antidépresseurs (IMAO/ISRS).", "Effort intense sans pause ni hydratation."],
        "warning_signs": ["Température très élevée, malaise, raideur.", "Douleur thoracique, perte de connaissance.", "Confusion ou agitation extrême."],
        "aftercare": ["Se rafraîchir, se reposer, réhydrater avec des sels.", "Espacer fortement les usages.", "Récupération calme sur plusieurs jours."],
        "rdr_rules": ["Surveiller température et hydratation (petites gorgées, sans excès).", "Limiter fortement les redoses (durée longue).", "Pauses entre les sessions."]
    },
    "mephedrone": {
        "name": "Méphédrone (4-MMC)", "category": "Stimulant (cathinone)", "class": "stimulant",
        "description": "Cathinone de synthèse stimulante et empathogène, à durée courte qui pousse au re-dosage compulsif. Les rafales accentuent descente et épuisement.",
        "dosages": { "unit": "mg", "threshold": "15 mg", "light": "50 - 100 mg", "common": "100 - 200 mg", "strong": "200 - 300 mg", "heavy": "300 mg +" },
        "durations": { "onset": "15 - 45 min", "comeup": "15 - 30 min", "peak": "1 - 2 h", "offset": "1 - 2 h", "total": "2 - 4 h" },
        "durations_seconds": { "onset": 1500, "comeup": 1200, "peak": 5400, "offset": 5400, "total": 12600 },
        "aliases": ["4-MMC", "miaow", "méph"],
        "forms": ["poudre", "cristaux", "gélule"],
        "legal_status": "Stupéfiant en France. Cette fiche n'est pas un avis juridique.",
        "profile": "La durée très courte est le piège central : l'envie de re-doser revient vite et mène facilement à des rafales épuisantes et risquées pour le cœur.",
        "effects": ["Énergie, euphorie, empathie, désinhibition.", "Cœur rapide, mâchoires serrées, insomnie.", "Descente marquée et envie de re-doser."],
        "risk_factors": ["Re-dosage compulsif et rafales.", "Charge cardiovasculaire et hausse de température.", "Insufflation répétée (lésions nasales)."],
        "avoid_if": ["Problème cardiaque ou de tension.", "Forte chaleur, effort intense.", "Association à d'autres stimulants."],
        "warning_signs": ["Douleur thoracique, palpitations marquées.", "Surchauffe, malaise, confusion.", "Angoisse extrême qui ne redescend pas."],
        "aftercare": ["Sommeil, alimentation, réhydratation.", "Repérer l'usage compulsif et faire de vraies pauses.", "Aide spécialisée si la consommation échappe."],
        "rdr_rules": ["Fixer une limite et limiter les redoses malgré l'envie.", "Surveiller cœur, température et hydratation.", "Ne pas combiner avec d'autres stimulants."]
    },
    "methylphenidate": {
        "name": "Méthylphénidate", "category": "Stimulant (médicament détourné)", "class": "stimulant",
        "description": "Stimulant prescrit dans le TDAH, parfois détourné. Hors cadre médical, il expose aux mêmes risques cardiovasculaires et de dépendance que les autres stimulants.",
        "dosages": { "unit": "mg", "threshold": "5 mg", "light": "5 - 15 mg", "common": "15 - 30 mg", "strong": "30 - 50 mg", "heavy": "50 mg +" },
        "durations": { "onset": "20 - 60 min", "comeup": "20 - 40 min", "peak": "2 - 3 h", "offset": "1 - 2 h", "total": "3 - 5 h" },
        "durations_seconds": { "onset": 1800, "comeup": 1800, "peak": 7200, "offset": 5400, "total": 14400 },
        "aliases": ["Ritaline", "Concerta", "MPH"],
        "forms": ["comprimé", "comprimé à libération prolongée"],
        "legal_status": "Médicament sur ordonnance (stupéfiant). Détournement illégal. Cette fiche n'est pas un avis juridique.",
        "profile": "Les formes à libération prolongée écrasées ou détournées rapprochent le profil de celui des stimulants à fort potentiel d'abus.",
        "effects": ["Éveil, concentration, énergie, coupe-faim.", "Cœur rapide, tension, insomnie.", "Irritabilité et descente."],
        "risk_factors": ["Insufflation et redoses (potentiel compulsif).", "Charge cardiovasculaire.", "Association à d'autres stimulants ou IMAO."],
        "avoid_if": ["Problème cardiaque ou de tension.", "Forte chaleur, effort intense.", "Antécédents de troubles anxieux sévères."],
        "warning_signs": ["Douleur thoracique, palpitations.", "Maux de tête violents, troubles visuels.", "Angoisse ou agitation extrême."],
        "aftercare": ["Sommeil et alimentation après l'effet.", "Espacer les usages.", "Aide si l'usage devient incontrôlé."],
        "rdr_rules": ["Limiter les redoses et ne pas insuffler les formes LP.", "Surveiller cœur et hydratation.", "Ne pas combiner avec d'autres stimulants."]
    },
    "modafinil": {
        "name": "Modafinil", "category": "Stimulant (eugéroïque)", "class": "stimulant",
        "description": "Promoteur d'éveil prescrit (narcolepsie), détourné comme « stimulant cognitif ». Effet plus discret que les stimulants classiques, mais insomnie, anxiété et interactions possibles.",
        "dosages": { "unit": "mg", "threshold": "25 mg", "light": "50 - 100 mg", "common": "100 - 200 mg", "strong": "200 - 400 mg", "heavy": "400 mg +" },
        "durations": { "onset": "30 - 60 min", "comeup": "1 - 2 h", "peak": "3 - 6 h", "offset": "4 - 8 h", "total": "10 - 15 h" },
        "durations_seconds": { "onset": 3600, "comeup": 5400, "peak": 18000, "offset": 21600, "total": 46800 },
        "aliases": ["Modiodal", "Provigil"],
        "forms": ["comprimé"],
        "legal_status": "Médicament sur ordonnance. Détournement illégal. Cette fiche n'est pas un avis juridique.",
        "profile": "Durée très longue : pris trop tard, il empêche de dormir toute la nuit. Réduit l'efficacité de certains contraceptifs et interagit avec divers médicaments.",
        "effects": ["Éveil, concentration, baisse de la fatigue.", "Maux de tête, bouche sèche, anxiété possible.", "Insomnie si pris tard."],
        "risk_factors": ["Insomnie et anxiété en cas de surdosage.", "Interactions médicamenteuses (contraceptifs, autres traitements).", "Réactions cutanées graves rares mais sérieuses."],
        "avoid_if": ["Problème cardiaque ou de tension non suivi.", "Fin de journée (sommeil).", "Association à d'autres stimulants."],
        "warning_signs": ["Éruption cutanée, fièvre, atteinte des muqueuses (arrêter et consulter).", "Douleur thoracique, palpitations.", "Anxiété ou agitation marquée."],
        "aftercare": ["Prévoir une nuit possiblement écourtée ; ne pas compenser par un sédatif sans avis.", "Espacer les usages.", "Hydratation et repas réguliers."],
        "rdr_rules": ["Prendre tôt dans la journée à cause de la durée.", "Vérifier les interactions (dont contraception).", "Ne pas empiler avec d'autres stimulants."]
    },
    "dxm": {
        "name": "Dextrométhorphane (DXM)", "category": "Dissociatif (antitussif détourné)", "class": "dissociative",
        "description": "Antitussif courant aux effets dissociatifs à forte quantité, par « plateaux ». Souvent associé dans les sirops à d'autres principes actifs (paracétamol, antihistaminiques) qui deviennent toxiques aux quantités détournées.",
        "dosages": { "unit": "mg", "threshold": "50 mg (effet antitussif)", "light": "100 - 200 mg (1er plateau)", "common": "200 - 400 mg (2e plateau)", "strong": "400 - 600 mg (3e plateau)", "heavy": "600 mg + (4e plateau, risque élevé)" },
        "durations": { "onset": "30 - 60 min", "comeup": "1 - 2 h", "peak": "2 - 4 h", "offset": "1 - 3 h", "total": "5 - 8 h" },
        "durations_seconds": { "onset": 2700, "comeup": 5400, "peak": 10800, "offset": 7200, "total": 25200 },
        "aliases": ["DXM", "robo"],
        "forms": ["sirop", "gélule", "comprimé"],
        "legal_status": "En vente libre dans certains pays sous forme antitussive ; détournement déconseillé. Cette fiche n'est pas un avis juridique.",
        "profile": "Le danger n°1 du détournement vient des CO-FORMULANTS : un sirop « tout-en-un » peut contenir du paracétamol (toxicité hépatique) ou des antihistaminiques mortels à ces quantités. N'utiliser que du DXM seul.",
        "effects": ["Dissociation par paliers, distorsions, euphorie ou malaise.", "Perte de coordination et d'équilibre.", "Nausées fréquentes."],
        "risk_factors": ["Co-formulants toxiques (paracétamol, antihistaminiques, pseudoéphédrine).", "Syndrome sérotoninergique avec antidépresseurs (ISRS/IMAO).", "Chutes et fausses routes."],
        "avoid_if": ["Sirop contenant d'autres principes actifs.", "Prise d'antidépresseurs.", "Seul, en hauteur ou près de l'eau."],
        "warning_signs": ["Fièvre, rigidité, agitation (syndrome sérotoninergique).", "Vomissements en position allongée, gêne respiratoire.", "Confusion qui ne redescend pas."],
        "aftercare": ["Repos jusqu'au retour complet de la coordination.", "Hydratation douce.", "Espacer fortement les usages."],
        "rdr_rules": ["N'utiliser que du DXM SEUL : écarter tout sirop multi-composants.", "Jamais avec des antidépresseurs (sérotoninergique).", "Rester en sécurité, accompagné, jamais en hauteur ou près de l'eau."]
    },
    "kratom": {
        "name": "Kratom", "category": "Opioïde végétal", "class": "depressant",
        "description": "Plante dont les alcaloïdes agissent sur les récepteurs opioïdes : plutôt stimulant à faible quantité, plutôt sédatif à quantité plus élevée. Dépendance et interactions possibles, notamment avec d'autres dépresseurs.",
        "dosages": { "unit": "g (feuille séchée)", "threshold": "1 g", "light": "2 - 4 g", "common": "4 - 6 g", "strong": "6 - 8 g", "heavy": "8 g +" },
        "durations": { "onset": "15 - 45 min", "comeup": "30 - 60 min", "peak": "1.5 - 3 h", "offset": "1 - 2 h", "total": "3 - 6 h" },
        "durations_seconds": { "onset": 1800, "comeup": 1800, "peak": 7200, "offset": 5400, "total": 16200 },
        "aliases": ["mitragyna speciosa", "mitragynine"],
        "forms": ["poudre de feuille", "gélule", "extrait (bien plus puissant)"],
        "legal_status": "Statut variable selon les pays. Cette fiche n'est pas un avis juridique.",
        "profile": "Les EXTRAITS concentrés sont beaucoup plus forts que la feuille et changent totalement les repères de quantité. La dépendance s'installe avec l'usage quotidien.",
        "effects": ["Faible quantité : stimulation, énergie.", "Quantité plus élevée : sédation, antalgie, opioïde-like.", "Nausées, constipation, démangeaisons."],
        "risk_factors": ["Extraits concentrés mal évalués.", "Association à d'autres dépresseurs (alcool, benzodiazépines, opioïdes).", "Usage quotidien : dépendance et sevrage."],
        "avoid_if": ["Association à un autre dépresseur.", "Conduite ou activité à risque.", "Grossesse, traitement médical sans avis."],
        "warning_signs": ["Somnolence profonde, respiration ralentie (surtout en mélange).", "Vomissements importants.", "Signes de sevrage en cas d'arrêt brutal après usage régulier."],
        "aftercare": ["Hydratation, repas léger.", "Repérer l'installation d'un usage quotidien.", "Aide spécialisée en cas de dépendance."],
        "rdr_rules": ["Distinguer feuille et extrait : commencer très bas avec un extrait.", "Ne pas mélanger aux autres dépresseurs.", "Surveiller la régularité de l'usage (dépendance)."]
    },
    "codeine": {
        "name": "Codéine", "category": "Opioïde (médicament détourné)", "class": "depressant",
        "description": "Opioïde faible présent dans certains antalgiques et antitussifs. Le détournement à fortes quantités cumule le risque opioïde et la toxicité des autres principes actifs associés (paracétamol notamment).",
        "dosages": { "unit": "mg", "threshold": "15 mg", "light": "30 - 60 mg", "common": "60 - 120 mg", "strong": "120 - 200 mg", "heavy": "200 mg +" },
        "durations": { "onset": "30 - 60 min", "comeup": "30 - 60 min", "peak": "1 - 3 h", "offset": "1 - 2 h", "total": "4 - 6 h" },
        "durations_seconds": { "onset": 2400, "comeup": 1800, "peak": 7200, "offset": 5400, "total": 18000 },
        "aliases": ["codéine", "sirop codéiné"],
        "forms": ["comprimé", "sirop (souvent codéine + autres actifs)"],
        "legal_status": "Médicament sur ordonnance en France. Détournement illégal et dangereux. Cette fiche n'est pas un avis juridique.",
        "profile": "Le danger majeur du détournement vient des CO-FORMULANTS (paracétamol surtout) : les quantités d'opioïde recherchées amènent des doses de paracétamol hépatotoxiques voire mortelles. Le risque respiratoire monte vite en mélange.",
        "effects": ["Antalgie, détente, somnolence, légère euphorie.", "Constipation, nausées, démangeaisons.", "Ralentissement respiratoire à forte quantité."],
        "risk_factors": ["Paracétamol/ibuprofène associés (toxicité d'organe).", "Association à l'alcool, aux benzodiazépines (dépression respiratoire).", "Métaboliseurs rapides (effet renforcé imprévisible)."],
        "avoid_if": ["Préparation contenant du paracétamol à forte dose.", "Association à un autre dépresseur.", "Seul, sans surveillance."],
        "warning_signs": ["Respiration lente, lèvres bleutées, impossibilité de réveiller (urgence : 15/112, naloxone).", "Douleur abdominale, signes hépatiques (paracétamol).", "Somnolence profonde."],
        "aftercare": ["Surveiller la personne, position latérale de sécurité si elle somnole.", "Ne jamais cumuler les sources de paracétamol.", "Aide spécialisée en cas d'usage répété."],
        "rdr_rules": ["Écarter toute préparation contenant du paracétamol pour un usage détourné.", "Ne jamais mélanger aux autres dépresseurs.", "Disposer de naloxone si possible et ne pas consommer seul."]
    },

    "cannabis": {
        "name": "Cannabis",
        "category": "Cannabinoïde",
        "class": "cannabinoid",
        "description": "Cannabinoïde végétal dont les effets varient fortement selon la teneur en THC/CBD, la voie d’administration, la tolérance et le contexte émotionnel.",
        "dosages": {
            "unit": "mg de THC",
            "threshold": "1 - 2 mg",
            "light": "2.5 - 5 mg",
            "common": "5 - 15 mg",
            "strong": "15 - 30 mg",
            "heavy": "30 mg +"
        },
        "durations": {
            "onset": "5 - 15 min (inhalé) / 30 - 90 min (oral)",
            "comeup": "15 - 30 min (inhalé) / 1 - 2 h (oral)",
            "peak": "1 - 2 h (inhalé) / 3 - 5 h (oral)",
            "offset": "1 - 2 h (inhalé) / 2 - 4 h (oral)",
            "total": "2 - 4 h (inhalé) / 4 - 8 h (oral)"
        },
        "durations_seconds": {
            "onset": 600,
            "comeup": 1800,
            "peak": 5400,
            "offset": 5400,
            "total": 13200
        },
        "rdr_rules": [
            "Éviter de conduire ou d’utiliser un outil dangereux tant que l’attention, la coordination et le temps de réaction ne sont pas revenus à la normale.",
            "Avec les formes orales, attendre largement avant toute redose : la montée lente est une cause fréquente de malaise intense.",
            "En cas d’anxiété aiguë : réduire les stimulations, respirer lentement, s’hydrater par petites gorgées et rester avec une personne rassurante.",
            "Ne pas confondre cannabis naturel et cannabinoïdes de synthèse : ces derniers sont beaucoup plus imprévisibles et peuvent provoquer des intoxications graves.",
            "Si l’usage devient quotidien, nécessaire pour dormir ou anxiolytique par défaut, noter ce signal et envisager un échange avec un professionnel ou une structure d’aide."
        ],
        "aliases": [
            "THC",
            "weed",
            "herbe",
            "résine",
            "shit",
            "haschich"
        ],
        "forms": [
            "fleurs/résine",
            "extraits",
            "produits comestibles",
            "vaporisation/inhalation"
        ],
        "legal_status": "Interdit en France hors cadre spécifique ; CBD réglementé séparément.",
        "profile": "Le cannabis n’a pas un profil unique : un produit riche en THC, un edible, un usage à jeun ou un contexte anxieux peuvent transformer une expérience perçue comme habituelle en épisode très inconfortable. La fiche insiste donc sur la temporalité, la prudence avec l’oral et le repérage des usages de compensation.",
        "effects": [
            "Modification de l’attention, du temps perçu, de la mémoire de travail et de la coordination.",
            "Euphorie, détente ou au contraire anxiété, paranoïa, confusion et boucles de pensée selon le contexte.",
            "Bouche sèche, yeux rouges, augmentation possible du rythme cardiaque, faim, somnolence ou vertiges.",
            "Avec les produits oraux : montée plus lente, effets plus longs et redoses plus faciles à mal évaluer."
        ],
        "risk_factors": [
            "Produits très concentrés en THC ou mal étiquetés ; faible tolérance ; consommation à jeun ; fatigue ou stress.",
            "Antécédents personnels ou familiaux de troubles psychotiques, épisodes anxieux sévères ou idées suicidaires.",
            "Association avec alcool, psychédéliques ou cannabinoïdes de synthèse, qui peut majorer confusion et panique.",
            "Usage quotidien pour gérer sommeil, anxiété ou ennui : risque de dépendance psychologique, irritabilité au sevrage et perte de contrôle."
        ],
        "avoid_if": [
            "Conduite, travail, garde d’enfant, baignade ou activité nécessitant coordination et réflexes.",
            "Période de crise émotionnelle, solitude, environnement imprévisible ou obligation importante dans les heures suivantes.",
            "Grossesse, allaitement, adolescence ou traitement médical sans avis professionnel."
        ],
        "warning_signs": [
            "Douleur thoracique, malaise avec perte de connaissance, agitation extrême, idées suicidaires ou hallucinations inquiétantes.",
            "Vomissements répétés, confusion importante ou impossibilité de se calmer malgré un environnement rassurant.",
            "Usage qui augmente vite, besoin de consommer dès le matin ou impossibilité de faire une pause prévue."
        ],
        "aftercare": [
            "Prévoir sommeil, repas simple et hydratation modérée ; éviter les décisions importantes pendant la descente ou le lendemain.",
            "Noter contexte, forme, heure, intensité et anxiété éventuelle pour repérer les situations qui se répètent.",
            "En cas de bad trip, débriefer à froid plutôt que reconsommer pour ‘corriger’ l’expérience."
        ],
        "dosage_warning": "Repères très variables : la teneur réelle en THC/CBD, la voie orale et la tolérance changent fortement l’intensité. Ces valeurs ne sont pas une recommandation."
    },
    "cannabis_synthese": {
        "name": "Cannabinoïdes de synthèse",
        "category": "Cannabinoïde",
        "class": "cannabinoid",
        "description": "Substances chimiques qui imitent certains effets du cannabis mais avec une puissance, une durée et une toxicité beaucoup moins prévisibles que le THC végétal.",
        "dosages": {
            "unit": "non standardisé",
            "threshold": "Non applicable",
            "light": "Non applicable",
            "common": "Non applicable",
            "strong": "Non applicable",
            "heavy": "Non applicable"
        },
        "durations": {
            "onset": "quelques minutes (inhalé) / variable selon forme",
            "comeup": "5 - 20 min",
            "peak": "30 min - 2 h",
            "offset": "1 - 4 h",
            "total": "2 - 8 h ou plus selon molécule"
        },
        "durations_seconds": {
            "onset": 300,
            "comeup": 900,
            "peak": 3600,
            "offset": 7200,
            "total": 21600
        },
        "rdr_rules": [
            "Ne pas appliquer les repères du cannabis naturel : la puissance peut être très supérieure et la composition varie d’un lot à l’autre.",
            "Éviter les mélanges, surtout alcool, stimulants, cannabis naturel ou autres dépresseurs : de nombreux accidents impliquent une polyconsommation.",
            "Traiter agitation extrême, convulsions, douleur thoracique, perte de connaissance ou idées suicidaires comme une urgence médicale.",
            "Ne pas rester seul : l’imprévisibilité augmente le risque de panique, chute, malaise cardiaque ou comportement dangereux.",
            "En cas d’usage répété, demander de l’aide rapidement : tolérance, craving et symptômes de sevrage peuvent apparaître vite."
        ],
        "aliases": [
            "Spice",
            "PTC",
            "Buddha Blue",
            "HHC/HHCP/THCP selon produits",
            "JWH",
            "MDMB"
        ],
        "forms": [
            "e-liquide",
            "mélange végétal pulvérisé",
            "poudre",
            "produit vendu comme ‘encens’ ou ‘research chemical’"
        ],
        "legal_status": "De nombreuses molécules et familles sont classées stupéfiants ; le statut varie selon la molécule.",
        "profile": "À traiter comme une catégorie à haut risque plutôt que comme une variante du cannabis. L’étiquette commerciale ne garantit ni la molécule, ni la concentration, ni l’homogénéité du produit.",
        "effects": [
            "Effets cannabinoïdes parfois très marqués : ivresse, dissociation, altération du temps et des perceptions.",
            "Anxiété intense, agitation, hallucinations, paranoïa ou confusion possibles, parfois brutalement.",
            "Tachycardie, hypertension, vomissements, tremblements, convulsions ou perte de connaissance selon la molécule.",
            "Durée et intensité difficiles à prévoir ; certaines molécules peuvent produire des effets prolongés ou retardés."
        ],
        "risk_factors": [
            "Produit non homogène : une zone du support peut contenir beaucoup plus de principe actif qu’une autre.",
            "Tolérance faible, antécédents psychiatriques, pathologie cardiaque/rénale ou consommation isolée.",
            "Polyconsommation, notamment alcool, stimulants, cannabis naturel, benzodiazépines ou opioïdes.",
            "Usage quotidien : risque de dépendance, sevrage rapide, irritabilité, insomnie, craving et symptômes physiques."
        ],
        "avoid_if": [
            "Antécédents de psychose, attaques de panique sévères, troubles cardiaques/rénaux ou traitement psychiatrique non stabilisé.",
            "Produit inconnu, e-liquide non identifié, mélange végétal sans analyse ou emballage marketing trompeur.",
            "Contexte festif dense, forte chaleur, conduite ou activité où une perte de contrôle serait dangereuse."
        ],
        "warning_signs": [
            "Convulsions, perte de connaissance, douleur thoracique, respiration anormale, confusion sévère ou agitation incontrôlable.",
            "Idées suicidaires, auto-agressivité, hallucinations menaçantes ou paranoïa intense.",
            "Symptômes de manque rapides entre les prises : tremblements, sueurs, insomnie, craving, tachycardie."
        ],
        "aftercare": [
            "Après un épisode difficile, éviter de reconsommer pour ‘redescendre’ : demander un avis médical si symptômes neurologiques, cardiaques ou psychiatriques.",
            "Noter précisément le produit, le lot, le contexte et les symptômes ; conserver l’emballage peut aider les soignants en cas d’urgence.",
            "Chercher une structure d’analyse ou de réduction des risques si le produit reste non identifié."
        ],
        "dosage_warning": "Aucun palier fiable : la concentration réelle et la molécule active sont trop variables. Le suivi sert ici à documenter, pas à calibrer."
    },
    "alcool": {
        "name": "Alcool",
        "category": "Dépresseur",
        "class": "depressant",
        "description": "Dépresseur du système nerveux central : il altère le jugement, la coordination, la vigilance et augmente fortement les risques lorsqu’il est associé à d’autres substances.",
        "dosages": {
            "unit": "g d’alcool pur",
            "threshold": "10 g",
            "light": "10 - 20 g",
            "common": "30 - 40 g",
            "strong": "50 - 70 g",
            "heavy": "80 g +"
        },
        "durations": {
            "onset": "10 - 30 min",
            "comeup": "20 - 45 min",
            "peak": "1 - 2.5 h",
            "offset": "2 - 4 h",
            "total": "3 - 6 h (dépend fortement de la quantité)"
        },
        "durations_seconds": {
            "onset": 1200,
            "comeup": 2400,
            "peak": 7200,
            "offset": 7200,
            "total": 18000
        },
        "rdr_rules": [
            "Alterner avec de l’eau et manger avant ou pendant la soirée réduit certains malaises, mais ne rend pas la consommation sans risque.",
            "Éviter absolument les mélanges avec benzodiazépines, opioïdes, GHB/GBL et kétamine : coma, vomissement inhalé et détresse respiratoire deviennent beaucoup plus probables.",
            "Fixer une limite avant de commencer et noter les grammes d’alcool pur limite l’escalade liée à la désinhibition.",
            "Si une personne ne répond plus normalement, respire lentement ou vomit en étant somnolente : position latérale de sécurité et appel immédiat au 15/112.",
            "Après un épisode de perte de contrôle, black-out ou consommation malgré une limite fixée, prendre ce signal au sérieux plutôt que le banaliser."
        ],
        "aliases": [
            "éthanol",
            "alcool éthylique",
            "boisson alcoolisée"
        ],
        "forms": [
            "bière",
            "vin",
            "spiritueux",
            "cocktails",
            "prémix"
        ],
        "legal_status": "Légal pour les adultes, strictement encadré ; conduite sous alcool interdite au-delà des seuils légaux.",
        "profile": "L’alcool est souvent banalisé parce qu’il est légal, mais c’est l’un des mélanges les plus problématiques : il désinhibe, masque certains signaux de danger et potentialise de nombreux dépresseurs.",
        "effects": [
            "Désinhibition, altération du jugement, baisse de vigilance, coordination dégradée et temps de réaction plus lent.",
            "Nausées, vomissements, somnolence, trous noirs mnésiques, comportements impulsifs ou agressivité.",
            "Déshydratation relative, hypoglycémie possible, sommeil de mauvaise qualité et récupération longue.",
            "À doses élevées : confusion, hypothermie, coma éthylique, respiration ralentie et risque d’étouffement."
        ],
        "risk_factors": [
            "Consommation rapide, jeux d’alcool, mélange avec boissons énergisantes ou contexte de chaleur/danse prolongée.",
            "Association avec sédatifs, opioïdes, GHB/GBL, kétamine ou autres dépresseurs.",
            "Antécédents de troubles hépatiques, pancréatiques, épilepsie, traitement médicamenteux ou grossesse.",
            "Black-outs répétés, besoin de boire pour dormir ou gérer l’anxiété, consommation solitaire ou perte de contrôle."
        ],
        "avoid_if": [
            "Conduite, baignade, hauteur, sexualité non discutée, décision financière ou conflit.",
            "Prise de médicaments sédatifs, opioïdes, antidépresseurs ou antipsychotiques sans avis médical.",
            "Fatigue extrême, jeûne, vomissements déjà présents ou antécédent de coma éthylique."
        ],
        "warning_signs": [
            "Inconscience, respiration lente ou irrégulière, peau froide, vomissements répétés, convulsions ou impossibilité de réveiller la personne.",
            "Confusion sévère, chute avec traumatisme, douleur thoracique ou comportement dangereux pour soi/autrui.",
            "Signes de sevrage après usage régulier : tremblements, sueurs, agitation, hallucinations ou convulsions."
        ],
        "aftercare": [
            "Dormir en sécurité, idéalement surveillé si forte intoxication ; ne pas laisser une personne très alcoolisée seule sur le dos.",
            "Le lendemain : hydratation modérée, repas simple, repos et évitement de conduite si fatigue ou brouillard mental.",
            "Analyser les situations de perte de contrôle : lieu, rythme, entourage, émotions, mélanges et limites dépassées."
        ],
        "dosage_warning": "Repères en grammes d’alcool pur : un verre standard français correspond environ à 10 g, mais le volume servi, le degré d’alcool, la vitesse de consommation, fatigue et mélanges modifient fortement le risque."
    },
    "mdma": {
        "name": "MDMA / Ecstasy",
        "category": "Empathogène",
        "class": "empathogen",
        "description": "Empathogène stimulant agissant notamment sur la sérotonine, la dopamine et la noradrénaline. Les risques augmentent avec la chaleur, l’effort, les redoses et les mélanges.",
        "dosages": {
            "unit": "mg",
            "threshold": "30 - 50 mg",
            "light": "50 - 75 mg",
            "common": "75 - 125 mg",
            "strong": "125 - 175 mg",
            "heavy": "175 mg +"
        },
        "durations": {
            "onset": "20 - 60 min",
            "comeup": "30 - 60 min",
            "peak": "2 - 3 h",
            "offset": "1.5 - 2 h",
            "total": "3.5 - 6 h"
        },
        "durations_seconds": {
            "onset": 2400,
            "comeup": 3000,
            "peak": 9000,
            "offset": 6000,
            "total": 20400
        },
        "rdr_rules": [
            "Espacer largement les prises : les sessions rapprochées augmentent descentes difficiles, fatigue émotionnelle et usage compulsif.",
            "Éviter les redoses impulsives : l’effet peut encore monter alors que l’envie de reprendre apparaît. Notez l’heure exacte et la dose cumulée.",
            "Surveiller la chaleur : pauses au frais, vêtements respirants et hydratation régulière mais modérée. Boire excessivement peut aussi devenir dangereux.",
            "Éviter les mélanges sérotoninergiques ou stimulants, notamment tramadol, IMAO, certains antidépresseurs et stimulants forts : risque de syndrome sérotoninergique, convulsions ou hyperthermie.",
            "La descente n’est pas un échec : prévoir repos, alimentation, sommeil et soutien émotionnel diminue le risque de reconsommer pour compenser."
        ],
        "aliases": [
            "ecstasy",
            "taz",
            "molly",
            "MD"
        ],
        "forms": [
            "comprimé",
            "cristaux",
            "poudre",
            "gélule"
        ],
        "legal_status": "Classée stupéfiant ; usage non médical interdit.",
        "profile": "La MDMA combine stimulation et empathie. Le risque central n’est pas seulement la dose isolée : c’est l’accumulation chaleur + danse + manque de sommeil + redoses + mélange, qui augmente la charge cardiovasculaire et neuropsychique.",
        "effects": [
            "Empathie, sociabilité, euphorie, intensification sensorielle et stimulation physique.",
            "Mâchoires serrées, transpiration, accélération cardiaque, nausées, difficulté à uriner ou vision floue.",
            "Après-coup possible : fatigue, irritabilité, humeur basse, anxiété, sommeil perturbé et baisse de motivation.",
            "Effet variable selon composition réelle : comprimés et poudres peuvent contenir d’autres stimulants ou dosages inattendus."
        ],
        "risk_factors": [
            "Chaleur, danse prolongée, foule, déshydratation ou hydratation excessive sans sels minéraux.",
            "Redoses rapprochées, sessions rapprochées dans le temps, manque de sommeil et alimentation insuffisante.",
            "Antidépresseurs, IMAO, tramadol, lithium, stimulants ou autres substances sérotoninergiques.",
            "Antécédents cardiaques, épilepsie, troubles bipolaires/psychotiques ou anxiété sévère."
        ],
        "avoid_if": [
            "Température élevée, événement sans accès à eau/repos, ou impossibilité de quitter l’environnement.",
            "Traitement médical psychotrope sans avis professionnel, surtout IMAO, ISRS/IRSN, lithium ou tramadol.",
            "Objectif de ‘tenir toute la nuit’ malgré fatigue importante : c’est un facteur de surchauffe et de décisions risquées."
        ],
        "warning_signs": [
            "Température très élevée, confusion, agitation extrême, rigidité musculaire, convulsions ou perte de connaissance.",
            "Douleur thoracique, essoufflement, malaise, palpitations inquiétantes ou maux de tête violents.",
            "Après la session : humeur très basse, idées noires, anxiété persistante ou impossibilité de dormir plusieurs nuits."
        ],
        "aftercare": [
            "Prévoir un lendemain sans obligation lourde, repas salé/simple, repos et sommeil plutôt qu’une compensation par autres substances.",
            "Noter dose cumulée, redoses, température, sommeil et état émotionnel à J+1/J+3 pour repérer les seuils personnels de fatigue.",
            "Si la descente devient très sombre ou dure plusieurs jours, demander de l’aide plutôt que rester isolé."
        ],
        "dosage_warning": "Repères indicatifs uniquement : comprimés et poudres peuvent être fortement dosés ou adultérés. L’analyse de produit est préférable quand elle est accessible."
    },
    "lsd": {
        "name": "LSD-25",
        "category": "Psychédélique",
        "class": "psychedelic",
        "description": "Psychédélique puissant à longue durée d’action. L’intensité dépend fortement du set & setting, de la dose réelle, de l’expérience et de l’état psychologique.",
        "dosages": {
            "unit": "µg (microgrammes)",
            "threshold": "10 - 20 µg",
            "light": "20 - 75 µg",
            "common": "75 - 150 µg",
            "strong": "150 - 300 µg",
            "heavy": "300 µg +"
        },
        "durations": {
            "onset": "20 - 60 min",
            "comeup": "1 - 2 h",
            "peak": "3 - 5 h",
            "offset": "3 - 5 h",
            "total": "8 - 12 h"
        },
        "durations_seconds": {
            "onset": 2400,
            "comeup": 5400,
            "peak": 14400,
            "offset": 14400,
            "total": 36600
        },
        "rdr_rules": [
            "Préparer le set & setting : lieu sûr, durée disponible, téléphone chargé, absence d’obligation et personnes de confiance.",
            "Prévoir un accompagnant sobre lors des premières expériences, des doses élevées ou d’un contexte émotionnel fragile.",
            "La durée peut dépasser 12 heures avec fatigue résiduelle : ne prévoyez pas conduite, travail ou responsabilités juste après.",
            "En expérience difficile : réduire les stimulations, changer doucement d’environnement, respirer et rappeler que l’effet évolue avec le temps.",
            "Éviter de chercher à ‘casser’ l’expérience par des mélanges non maîtrisés : cela peut ajouter des risques au lieu de résoudre la panique."
        ],
        "aliases": [
            "acide",
            "buvard",
            "trip",
            "L"
        ],
        "forms": [
            "buvard",
            "goutte",
            "micro-pointe",
            "solution"
        ],
        "legal_status": "Classé stupéfiant ; usage non médical interdit.",
        "profile": "Le LSD exige surtout de la marge temporelle et psychologique. La difficulté vient souvent moins d’un danger toxique direct que de la durée, de l’intensité mentale, des décisions sous confusion et des environnements mal préparés.",
        "effects": [
            "Altérations visuelles, sensorielles, émotionnelles et cognitives ; modification du temps et du sens de soi.",
            "Euphorie, introspection ou émergence d’anxiété, boucles de pensée, confusion et peur de perdre le contrôle.",
            "Stimulation légère à modérée, pupilles dilatées, tension corporelle, mâchoires serrées ou difficulté à dormir.",
            "Tolérance rapide aux psychédéliques classiques, mais récupération psychologique plus variable que la tolérance pharmacologique."
        ],
        "risk_factors": [
            "Dose réelle inconnue, contexte bruyant/chaotique, conflit relationnel, manque de sommeil ou émotion instable.",
            "Antécédents psychotiques, épisode maniaque, trouble bipolaire non stabilisé ou anxiété sévère.",
            "Cannabis pendant le plateau ou la descente : peut relancer brutalement l’intensité et la paranoïa.",
            "Mélange avec stimulants : augmente tension, agitation, insomnie et risque de panique."
        ],
        "avoid_if": [
            "Responsabilités dans la journée, trajet non sécurisé, environnement où il faut se cacher ou interagir avec des inconnus.",
            "Période de crise, deuil, privation de sommeil, instabilité psychiatrique ou pression sociale à consommer.",
            "Buvard d’origine incertaine sans test : certains produits vendus comme LSD peuvent avoir un profil de risque différent."
        ],
        "warning_signs": [
            "Agitation incontrôlable, comportement dangereux, confusion sévère, idées suicidaires ou incapacité à reconnaître son environnement.",
            "Douleur thoracique, convulsions, hyperthermie, perte de connaissance ou suspicion de produit différent.",
            "Anxiété, déréalisation ou flashbacks perturbants qui persistent après plusieurs jours."
        ],
        "aftercare": [
            "Prévoir une phase d’intégration calme : sommeil, repas, lumière douce, conversation de confiance si besoin.",
            "Noter les déclencheurs d’anxiété et les éléments aidants pour améliorer les décisions futures, y compris décider de ne pas recommencer.",
            "Éviter les psychédéliques rapprochés : la fatigue psychique peut s’accumuler même si la tolérance baisse."
        ],
        "dosage_warning": "Les microgrammes ne sont pas vérifiables à l’œil nu ; les buvards sont parfois mal répartis ou mal identifiés. Ces paliers sont indicatifs, pas une recommandation."
    },
    "champignons": {
        "name": "Champignons (psilocybine)",
        "category": "Psychédélique",
        "class": "psychedelic",
        "description": "Psychédélique à psilocybine/psilocine dont la puissance varie beaucoup selon l’espèce, le lot, la conservation, l’estomac et l’état émotionnel.",
        "dosages": {
            "unit": "g (secs, type Cubensis)",
            "threshold": "0.25 - 0.5 g",
            "light": "0.5 - 1.5 g",
            "common": "1.5 - 3 g",
            "strong": "3 - 5 g",
            "heavy": "5 g +"
        },
        "durations": {
            "onset": "15 - 45 min (à jeun)",
            "comeup": "30 - 75 min",
            "peak": "2 - 3 h",
            "offset": "1.5 - 2 h",
            "total": "4 - 7 h"
        },
        "durations_seconds": {
            "onset": 1800,
            "comeup": 3150,
            "peak": 9000,
            "offset": 6300,
            "total": 20250
        },
        "rdr_rules": [
            "La variabilité de puissance est importante : ne vous fiez pas uniquement à l’apparence ou aux expériences précédentes.",
            "Les nausées et l’inconfort de montée sont fréquents ; un environnement calme et une personne rassurante aident à limiter la panique.",
            "Les effets peuvent être très émotionnels : éviter en période de crise, de deuil, de forte anxiété ou d’isolement.",
            "Espacer les expériences laisse le temps à la tolérance et au psychisme de récupérer.",
            "Ne jamais consommer un champignon sauvage mal identifié : le risque toxique n’a rien à voir avec l’effet psychédélique recherché."
        ],
        "aliases": [
            "psilo",
            "magic mushrooms",
            "cubensis"
        ],
        "forms": [
            "champignons secs",
            "champignons frais",
            "truffes selon pays",
            "préparation alimentaire"
        ],
        "legal_status": "Psilocybine/psilocine classées stupéfiants en France ; cueillette sauvage = risque toxique majeur si identification incertaine.",
        "profile": "La psilocybine est souvent plus courte que le LSD mais peut être très émotionnelle et corporelle. La fiche met l’accent sur l’identification, la variabilité de puissance et la préparation psychologique.",
        "effects": [
            "Altérations visuelles, émotionnelles et corporelles ; introspection, rires, émerveillement ou anxiété.",
            "Nausées, bâillements, frissons, inconfort gastrique et variations de température ressentie.",
            "Sensibilité accrue à l’environnement social : une remarque ou un lieu anxiogène peut influencer l’expérience.",
            "Après-coup possible : fatigue, clarté émotionnelle ou au contraire vulnérabilité et besoin de calme."
        ],
        "risk_factors": [
            "Espèce ou lot inconnu, conservation dégradée, mélange de champignons ou dosage basé sur une estimation visuelle.",
            "Antécédents psychotiques, trouble bipolaire, forte anxiété, isolement ou contexte émotionnel lourd.",
            "Cannabis, alcool ou stimulants pendant l’expérience, qui peuvent rendre le vécu plus confus.",
            "Confusion entre champignons psychoactifs et champignons toxiques lors d’une cueillette."
        ],
        "avoid_if": [
            "Lieu public, forêt sans accompagnement, météo difficile ou impossibilité de rentrer en sécurité.",
            "Cueillette sans identification experte ; ne jamais se fier seulement à une photo ou à une application.",
            "Prise pour ‘se réparer’ en urgence pendant une crise personnelle."
        ],
        "warning_signs": [
            "Vomissements incoercibles, douleurs abdominales sévères, jaunisse, confusion persistante ou suspicion de champignon toxique.",
            "Panique incontrôlable, comportement dangereux, idées suicidaires ou incapacité à être rassuré.",
            "Symptômes psychiques qui persistent plusieurs jours avec insomnie, déréalisation ou anxiété intense."
        ],
        "aftercare": [
            "Prévoir repas léger, sommeil et temps calme ; éviter de surinterpréter l’expérience à chaud.",
            "Débriefer avec une personne fiable si l’expérience a remué des thèmes émotionnels forts.",
            "Noter espèce supposée, état sec/frais, contexte et intensité pour éviter les approximations futures."
        ],
        "dosage_warning": "Repères limités aux champignons secs de type Cubensis : autres espèces, fraîcheur et conservation changent fortement la puissance."
    },
    "ketamine": {
        "name": "Kétamine",
        "category": "Dissociatif",
        "class": "dissociative",
        "description": "Dissociatif anesthésique qui peut altérer fortement la motricité, la perception du corps, la mémoire et l’orientation, avec des risques accrus en contexte de mélange.",
        "dosages": {
            "unit": "mg",
            "threshold": "5 - 15 mg",
            "light": "15 - 30 mg",
            "common": "30 - 75 mg",
            "strong": "75 - 150 mg",
            "heavy": "150 mg +"
        },
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "50 mg",
                "light": "50 - 100 mg",
                "common": "100 - 300 mg",
                "strong": "300 - 450 mg",
                "heavy": "450 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 - 15 mg",
                "light": "15 - 30 mg",
                "common": "30 - 75 mg",
                "strong": "75 - 150 mg",
                "heavy": "150 mg +"
            }
        },
        "bioavailability_by_route": {
            "Oral": "16 - 29 %",
            "Insufflé": "45 - 50 %"
        },
        "durations": {
            "default": {
                "onset": "1 - 3 min (insufflé)",
                "comeup": "5 - 15 min",
                "peak": "15 - 45 min",
                "offset": "30 - 60 min",
                "total": "1 - 2 h"
            },
            "Oral": {
                "onset": "10 - 30 min",
                "comeup": "5 - 20 min",
                "peak": "45 - 90 min",
                "offset": "3 - 6 h",
                "total": "4 - 8 h (avec after-effects)"
            },
            "Insufflé": {
                "onset": "1 - 3 min",
                "comeup": "5 - 15 min",
                "peak": "15 - 45 min",
                "offset": "30 - 60 min",
                "total": "1 - 2 h"
            }
        },
        "durations_seconds": {
            "default": {
                "onset": 120,
                "comeup": 600,
                "peak": 1800,
                "offset": 2700,
                "total": 6000
            },
            "Oral": {
                "onset": 1200,
                "comeup": 750,
                "peak": 4050,
                "offset": 16200,
                "total": 21600
            },
            "Insufflé": {
                "onset": 120,
                "comeup": 600,
                "peak": 1800,
                "offset": 2700,
                "total": 6000
            }
        },
        "rdr_rules": [
            "S’asseoir ou s’allonger avant la montée : la coordination et l’équilibre peuvent chuter brutalement.",
            "Éviter les mélanges avec alcool, opioïdes, GHB/GBL ou benzodiazépines : sédation, vomissements, inconscience et respiration ralentie peuvent devenir critiques.",
            "Les usages répétés ou prolongés exposent à des douleurs urinaires, cystites, atteintes rénales/hépatiques et dépendance : consulter rapidement en cas de symptômes urinaires.",
            "Utiliser du matériel personnel et propre limite les irritations et transmissions infectieuses par voie nasale.",
            "Ne pas confondre courte durée et faible risque : l’envie de redoser peut installer une session plus longue que prévu."
        ],
        "aliases": [
            "keta",
            "K",
            "special K"
        ],
        "forms": [
            "poudre/cristaux",
            "solution médicale détournée",
            "comprimé rare ou produit adultéré"
        ],
        "legal_status": "Médicament anesthésique encadré ; usage non médical interdit.",
        "profile": "La kétamine est dissociative : l’évaluation du corps, de l’espace et du danger peut disparaître avant que la personne n’en ait conscience. Les principaux risques immédiats sont les chutes, vomissements, confusion et mélanges dépresseurs ; les risques chroniques touchent surtout vessie, reins/foie et dépendance.",
        "effects": [
            "Dissociation, flottement, anesthésie partielle, altération du corps, de la distance et du temps.",
            "Troubles de coordination, parole ralentie, nausées, vision double, confusion ou amnésie partielle.",
            "À intensité élevée : immobilité, expérience de type ‘K-hole’, panique ou incapacité à communiquer clairement.",
            "Après-coup possible : fatigue, mémoire floue, humeur plate ou envie de redoser."
        ],
        "risk_factors": [
            "Alcool, GHB/GBL, benzodiazépines, opioïdes ou autres dépresseurs : cumul sédatif et vomissements dangereux.",
            "Lieu avec escaliers, eau, foule dense, objets coupants ou besoin de se déplacer.",
            "Usage fréquent : douleurs urinaires, envies pressantes, sang dans les urines, douleurs abdominales ou lombaires.",
            "Tolérance et redoses : augmentation rapide des quantités et perte de repères de session."
        ],
        "avoid_if": [
            "Douleurs urinaires déjà présentes, infection urinaire, pathologie rénale/hépatique ou antécédent de cystite liée à la kétamine.",
            "Conduite, baignade, sexualité sans consentement clairement discuté, sortie seul ou environnement non sécurisé.",
            "Recherche d’endormissement ou de descente après stimulants : le mélange peut masquer des signaux d’urgence."
        ],
        "warning_signs": [
            "Perte de connaissance, respiration lente, vomissement avec somnolence, chute importante ou confusion qui ne régresse pas.",
            "Douleurs urinaires, sang dans les urines, besoin d’uriner très fréquent ou douleurs lombaires après usages répétés.",
            "Craving, usage solitaire, augmentation rapide des doses ou impossibilité de respecter les pauses prévues."
        ],
        "aftercare": [
            "Rester posé jusqu’au retour complet de la coordination ; éviter de conduire ou rentrer seul immédiatement.",
            "Surveiller les symptômes urinaires les jours suivants ; consulter tôt plutôt que banaliser.",
            "Noter nombre de redoses et quantité cumulée : c’est souvent plus parlant que la dose initiale."
        ],
        "dosage_warning": "Repères indicatifs uniquement pour voie insufflée : concentration réelle, voie, tolérance et redoses changent fortement l’intensité et les risques."
    },
    "amphetamine": {
        "name": "Amphétamine (speed)",
        "category": "Stimulant",
        "class": "stimulant",
        "description": "Stimulant du système nerveux central qui augmente vigilance, énergie et tension physiologique, mais peut aussi entraîner anxiété, insomnie, tachycardie et compulsions.",
        "dosages": {
            "unit": "mg (amphétamine pure estimée)",
            "threshold": "5 - 10 mg",
            "light": "10 - 20 mg",
            "common": "20 - 40 mg",
            "strong": "40 - 70 mg",
            "heavy": "70 mg +"
        },
        "durations": {
            "onset": "20 - 60 min (oral) / 5 - 15 min (insufflé)",
            "comeup": "1 - 2 h (oral) / 15 - 30 min (insufflé)",
            "peak": "2 - 4 h (oral) / 1.5 - 3 h (insufflé)",
            "offset": "3 - 6 h",
            "total": "6 - 12 h"
        },
        "durations_seconds": {
            "onset": 1800,
            "comeup": 3600,
            "peak": 10800,
            "offset": 16200,
            "total": 32400
        },
        "rdr_rules": [
            "Le risque de ritualisation et de dépendance psychologique augmente avec les prises rapprochées et les redoses compulsives.",
            "Surveiller rythme cardiaque, température, mâchoires serrées, agitation et douleurs thoraciques. En cas de symptôme inquiétant : avis médical ou 15/112.",
            "Préparer la descente : alimentation légère, repos, hydratation modérée et absence d’obligation importante le lendemain.",
            "Éviter les prises tardives : le manque de sommeil amplifie anxiété, irritabilité et décisions risquées.",
            "Éviter les mélanges stimulants : additionner caféine forte, cocaïne, cathinones ou MDMA augmente la charge cardiovasculaire."
        ],
        "aliases": [
            "speed",
            "pep",
            "amphét"
        ],
        "forms": [
            "poudre",
            "pâte",
            "gélule",
            "comprimé"
        ],
        "legal_status": "Classée stupéfiant ; certains dérivés peuvent exister comme médicaments strictement prescrits selon pays.",
        "profile": "L’amphétamine pousse souvent à prolonger : travailler, danser, parler, redoser. La réduction des risques passe par le sommeil, la limite de session, l’attention au cœur/température et la prévention des usages fonctionnels répétés.",
        "effects": [
            "Vigilance, énergie, confiance, bavardage, réduction de l’appétit et de la fatigue.",
            "Tachycardie, tension, mâchoires serrées, transpiration, tremblements, difficulté à uriner ou à dormir.",
            "Anxiété, irritabilité, focalisation excessive, impulsivité ou comportements répétitifs.",
            "Descente possible : fatigue, humeur basse, faim, sommeil perturbé, craving ou irritabilité."
        ],
        "risk_factors": [
            "Redoses rapprochées, privation de sommeil, chaleur, effort prolongé, déshydratation ou caféine élevée.",
            "Association avec autres stimulants, MDMA, cathinones, cocaïne ou médicaments augmentant noradrénaline/sérotonine.",
            "Antécédents cardiaques, hypertension, anxiété sévère, trouble bipolaire/psychotique ou épilepsie.",
            "Usage pour performance, travail ou gestion du poids : glissement possible vers dépendance fonctionnelle."
        ],
        "avoid_if": [
            "Douleur thoracique, palpitations inhabituelles, fièvre, crise d’angoisse ou absence de sommeil déjà importante.",
            "Activité physique intense en chaleur ou contexte sans accès à repos/eau.",
            "Besoin de conduire ou prendre des décisions importantes pendant la montée ou la descente."
        ],
        "warning_signs": [
            "Douleur thoracique, malaise, essoufflement, confusion, hyperthermie, convulsions ou agitation impossible à calmer.",
            "Paranoïa, hallucinations, agressivité inhabituelle ou insomnie de plus d’une nuit.",
            "Usage compulsif malgré symptômes physiques, perte de poids, isolement ou retards répétés de sommeil."
        ],
        "aftercare": [
            "Prévoir repas, hydratation modérée, environnement calme et sommeil ; éviter alcool/sédatifs comme solution automatique de descente.",
            "Noter heure de dernière prise et sommeil réel : c’est essentiel pour comprendre anxiété et humeur des jours suivants.",
            "Faire une pause si la session a nécessité plusieurs redoses ou si la descente a été marquée."
        ],
        "dosage_warning": "Les produits vendus comme speed sont très variables en pureté et adultérants ; les paliers en substance pure ne reflètent pas forcément le produit réel."
    },
    "methamphetamine": {
        "name": "Méthamphétamine",
        "category": "Stimulant",
        "class": "stimulant",
        "description": "Stimulant amphétaminique puissant, souvent plus intense et plus long que l’amphétamine, avec risques importants d’insomnie prolongée, craving, hyperthermie, troubles psychiatriques et cardiovasculaires.",
        "dosages": {
            "unit": "non standardisé",
            "threshold": "Non applicable",
            "light": "Non applicable",
            "common": "Non applicable",
            "strong": "Non applicable",
            "heavy": "Non applicable"
        },
        "durations": {
            "onset": "10 - 20 min (insufflé) / 30 - 60 min (oral)",
            "comeup": "20 - 90 min",
            "peak": "3 - 6 h",
            "offset": "4 - 12 h",
            "total": "8 - 24 h ou plus"
        },
        "durations_seconds": {
            "onset": 1800,
            "comeup": 3600,
            "peak": 16200,
            "offset": 28800,
            "total": 57600
        },
        "rdr_rules": [
            "Prévoir que les effets et l’insomnie peuvent dépasser largement la session : ne pas planifier conduite, travail ou obligations ensuite.",
            "Éviter redoses et mélanges stimulants : la charge cardiovasculaire, l’agitation et la paranoïa montent rapidement.",
            "Surveiller température, douleur thoracique, confusion, agitation et absence de sommeil ; appeler le 15/112 en cas de symptôme sévère.",
            "L’usage répété peut installer craving, perte de poids, troubles dentaires, irritabilité et épisodes psychotiques : demander de l’aide tôt.",
            "Pendant la descente, privilégier repos, alimentation et soutien plutôt que sédatifs ou alcool en automédication."
        ],
        "aliases": [
            "meth",
            "crystal",
            "ice",
            "tina",
            "shabu",
            "yabaa"
        ],
        "forms": [
            "cristaux",
            "poudre",
            "comprimé/gélule"
        ],
        "legal_status": "Classée stupéfiant ; usage non médical interdit.",
        "profile": "La méthamphétamine se distingue par sa durée et son potentiel compulsif. Une session peut déborder sur un ou plusieurs jours si le sommeil est repoussé, ce qui augmente les risques psychiatriques et cardiovasculaires.",
        "effects": [
            "Stimulation intense, vigilance, confiance, bavardage, libido accrue ou focalisation prolongée.",
            "Insomnie longue, tachycardie, hypertension, transpiration, bruxisme, perte d’appétit et déshydratation.",
            "Anxiété, irritabilité, suspicion, hallucinations, comportements répétitifs ou désorganisation après manque de sommeil.",
            "Descente parfois marquée : épuisement, humeur basse, craving, sommeil désorganisé et douleurs corporelles."
        ],
        "risk_factors": [
            "Privation de sommeil, binge, sexualité longue sans pauses, chaleur, déshydratation et redoses multiples.",
            "Association avec autres stimulants, poppers, médicaments de l’érection, MDMA, cathinones ou cocaïne.",
            "Antécédents cardiaques, hypertension, psychose, bipolarité, épilepsie ou anxiété sévère.",
            "Usage en contexte de chemsex ou de performance : augmentation des risques sexuels, infectieux et de perte de limite."
        ],
        "avoid_if": [
            "Déjà privé de sommeil, anxieux, fiévreux, douloureux au thorax ou sous traitement stimulant/psychiatrique sans avis médical.",
            "Environnement sans possibilité réelle de dormir, manger, s’isoler et demander de l’aide.",
            "Projet de compenser la descente avec alcool, benzodiazépines ou opioïdes."
        ],
        "warning_signs": [
            "Douleur thoracique, AVC suspect, hyperthermie, convulsions, confusion, agitation extrême ou perte de connaissance.",
            "Paranoïa, hallucinations, idées suicidaires ou insomnie persistante avec désorganisation.",
            "Craving incontrôlable, binge répété, perte de poids rapide ou négligence de l’hygiène/sommeil."
        ],
        "aftercare": [
            "Prioriser sommeil, repas, douche, environnement calme et contact de confiance ; reporter décisions importantes.",
            "Noter durée réelle d’éveil, nombre de redoses et conséquences à J+1/J+3 pour objectiver le coût de la session.",
            "Consulter si symptômes psychiques, cardiovasculaires ou infectieux persistent."
        ],
        "dosage_warning": "Aucun palier fiable n’est fourni : puissance, durée, tolérance et contexte changent fortement le risque. Cette fiche sert au suivi et à la prudence, pas au calibrage."
    },
    "cocaine": {
        "name": "Cocaïne",
        "category": "Stimulant",
        "class": "stimulant",
        "description": "Stimulant à action brève qui augmente fortement dopamine, noradrénaline et tension cardiovasculaire. La courte durée favorise les redoses et la perte de contrôle.",
        "dosages": {
            "unit": "mg",
            "threshold": "5 - 10 mg",
            "light": "10 - 30 mg",
            "common": "30 - 60 mg",
            "strong": "60 - 90 mg",
            "heavy": "90 mg +"
        },
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "13 mg",
                "light": "13 - 75 mg",
                "common": "75 - 150 mg",
                "strong": "150 - 225 mg",
                "heavy": "225 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "5 - 10 mg",
                "light": "10 - 30 mg",
                "common": "30 - 60 mg",
                "strong": "60 - 90 mg",
                "heavy": "90 mg +"
            },
            "Inhalé": {
                "unit": "mg",
                "threshold": "2,5 mg",
                "light": "5 - 15 mg",
                "common": "15 - 30 mg",
                "strong": "30 - 45 mg",
                "heavy": "45 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "2 - 5 mg",
                "common": "5 - 10 mg",
                "strong": "10 - 15 mg",
                "heavy": "15 mg +"
            }
        },
        "bioavailability_by_route": {
            "Oral": "20 - 60 %",
            "Insufflé": "25 - 80 %",
            "Inhalé": "~70 %",
            "Intraveineux": "100 %",
            "Rectal": "60 - 80 % (est.)"
        },
        "durations": {
            "default": {
                "onset": "3 - 10 min (insufflé)",
                "comeup": "5 - 12 min",
                "peak": "7,5 - 16 min",
                "offset": "10 - 25 min",
                "total": "10 - 90 min"
            },
            "Oral": {
                "onset": "30 - 40 min",
                "comeup": "40 - 50 min",
                "peak": "60 - 180 min",
                "offset": "10 - 25 min",
                "total": "120 - 240 min"
            },
            "Insufflé": {
                "onset": "3 - 10 min",
                "comeup": "5 - 12 min",
                "peak": "7,5 - 16 min",
                "offset": "10 - 25 min",
                "total": "10 - 90 min"
            },
            "Inhalé": {
                "onset": "3 - 5 sec",
                "comeup": "1 - 2 min",
                "peak": "2 - 10 min",
                "offset": "1 - 5 min",
                "total": "5 - 15 min"
            },
            "Intraveineux": {
                "onset": "3 - 5 sec",
                "comeup": "1 - 2 min",
                "peak": "2 - 10 min",
                "offset": "1 - 5 min",
                "total": "5 - 15 min"
            },
            "Rectal": {
                "onset": "3 - 5 min",
                "comeup": "5 - 15 min",
                "peak": "10 - 30 min",
                "offset": "30 - 45 min",
                "total": "45 - 90 min (descente résiduelle : 1 - 4 h)"
            }
        },
        "durations_seconds": {
            "default": {
                "onset": 390,
                "comeup": 510,
                "peak": 705,
                "offset": 1050,
                "total": 3000
            },
            "Oral": {
                "onset": 2100,
                "comeup": 2700,
                "peak": 7200,
                "offset": 1050,
                "total": 10800
            },
            "Insufflé": {
                "onset": 390,
                "comeup": 510,
                "peak": 705,
                "offset": 1050,
                "total": 3000
            },
            "Inhalé": {
                "onset": 4,
                "comeup": 90,
                "peak": 360,
                "offset": 180,
                "total": 600
            },
            "Intraveineux": {
                "onset": 4,
                "comeup": 90,
                "peak": 360,
                "offset": 180,
                "total": 600
            },
            "Rectal": {
                "onset": 240,
                "comeup": 600,
                "peak": 1200,
                "offset": 2250,
                "total": 4050
            }
        },
        "rdr_rules": [
            "Risque élevé de dépendance, de craving et d’accidents cardiovasculaires, surtout avec redoses rapprochées ou effort physique.",
            "Utiliser du matériel nasal personnel, propre et non partagé pour réduire les risques d’infections et d’hépatites.",
            "Rincer les narines au sérum physiologique après la session et laisser des jours de récupération limite l’irritation nasale.",
            "Éviter absolument l’alcool : la formation de cocaéthylène augmente nettement la toxicité cardiaque et les comportements à risque.",
            "La courte durée favorise le ‘encore une dernière’ : définir une limite de temps/quantité avant le début de session est un repère central."
        ],
        "aliases": [
            "coke",
            "C",
            "neige",
            "poudre"
        ],
        "forms": [
            "poudre chlorhydrate",
            "crack/free base",
            "produit adultéré possible"
        ],
        "legal_status": "Classée stupéfiant ; usage non médical interdit.",
        "profile": "La cocaïne crée un cycle court : montée rapide, pic bref, craving et redose. Le cœur et les vaisseaux sont au premier plan, même chez des personnes jeunes ou sans diagnostic connu.",
        "effects": [
            "Euphorie, énergie, confiance, vigilance, parole accélérée, réduction de la fatigue et de l’appétit.",
            "Tachycardie, tension, vasoconstriction, transpiration, pupilles dilatées, mâchoires serrées et anxiété.",
            "Descente brève mais parfois dure : irritabilité, craving, fatigue, humeur basse ou suspicion.",
            "Irritation nasale, saignements, perte d’odorat ou lésions si usage répété par voie nasale."
        ],
        "risk_factors": [
            "Alcool, autres stimulants, effort physique, chaleur, stress, manque de sommeil ou antécédents cardiaques.",
            "Redoses rapprochées, utilisation en contexte de travail/sexualité/performance, accès à une quantité importante.",
            "Matériel partagé, muqueuses abîmées, saignements : hausse des risques infectieux.",
            "Crack/free base : montée plus rapide et craving souvent plus intense."
        ],
        "avoid_if": [
            "Douleur thoracique, hypertension, palpitations, migraine inhabituelle, anxiété sévère ou traitement stimulant.",
            "Consommation d’alcool prévue ou déjà commencée.",
            "Besoin de conduire, négocier, gérer un conflit ou prendre une décision financière."
        ],
        "warning_signs": [
            "Douleur thoracique, faiblesse d’un côté, trouble de la parole, convulsions, essoufflement, malaise ou maux de tête violents.",
            "Paranoïa, hallucinations, agitation extrême, agressivité inhabituelle ou idées suicidaires en descente.",
            "Saignements nasaux répétés, plaies, fièvre ou symptômes infectieux."
        ],
        "aftercare": [
            "Se reposer, manger, hydrater modérément et éviter de prolonger avec alcool ou sédatifs.",
            "Rincer le nez au sérum physiologique ; laisser cicatriser avant toute nouvelle exposition nasale.",
            "Noter les déclencheurs de craving et les redoses : fréquence, contexte social, alcool, argent disponible."
        ],
        "dosage_warning": "Pureté et adultérants varient fortement ; la dose en poudre ne reflète pas forcément la dose de cocaïne active."
    },
    "cathinones": {
        "name": "Cathinones (3-MMC, 3-CMC, 4-MMC…)",
        "category": "Stimulant",
        "class": "stimulant",
        "description": "Famille de stimulants de synthèse aux effets variables, parfois proches de la cocaïne, de la MDMA ou des amphétamines. Les différences entre molécules rendent les paliers et risques difficiles à généraliser.",
        "dosages": {
            "unit": "non standardisé",
            "threshold": "Non applicable",
            "light": "Non applicable",
            "common": "Non applicable",
            "strong": "Non applicable",
            "heavy": "Non applicable"
        },
        "durations": {
            "onset": "10 - 45 min selon voie/molécule",
            "comeup": "15 - 60 min",
            "peak": "1 - 3 h",
            "offset": "1 - 3 h",
            "total": "2 - 6 h ou plus selon molécule"
        },
        "durations_seconds": {
            "onset": 1200,
            "comeup": 2400,
            "peak": 7200,
            "offset": 7200,
            "total": 18000
        },
        "rdr_rules": [
            "Ne pas généraliser d’une cathinone à l’autre : 3-MMC, 3-CMC, méphédrone, MDPV ou alpha-PVP n’ont pas la même puissance ni la même durée.",
            "Éviter les redoses rapprochées : craving, tachycardie, anxiété, hyperthermie et comportements compulsifs peuvent monter vite.",
            "Éviter les mélanges avec MDMA, cocaïne, amphétamines, tramadol, IMAO ou antidépresseurs sans avis médical : risques cardiovasculaires, convulsifs et sérotoninergiques.",
            "En contexte sexuel, prévoir pauses, hydratation, protection, consentement explicite et limites avant la session.",
            "Si usage injecté ou matériel partagé : risque infectieux majeur ; se rapprocher d’un CAARUD/CSAPA pour matériel stérile et conseils adaptés."
        ],
        "aliases": [
            "3-MMC",
            "3-CMC",
            "4-MMC",
            "méphédrone",
            "sels de bain",
            "bath salts"
        ],
        "forms": [
            "poudre",
            "cristaux",
            "gélule",
            "comprimé",
            "produit vendu comme research chemical"
        ],
        "legal_status": "Les dérivés de la cathinone sont classés stupéfiants en France.",
        "profile": "Cette fiche couvre une famille, pas une molécule unique. L’incertitude est le point central : composition, puissance, durée, adultérants et effets empathogènes/stimulants varient beaucoup.",
        "effects": [
            "Stimulation, empathie, sociabilité, libido accrue, confiance, concentration ou euphorie selon la molécule.",
            "Tachycardie, tension, transpiration, bruxisme, tremblements, nausées, vasoconstriction et insomnie.",
            "Craving, redoses compulsives, anxiété, paranoïa, irritabilité ou confusion après manque de sommeil.",
            "Descente possible : humeur basse, fatigue, honte, anxiété, besoin de réassurance ou envie de reprendre."
        ],
        "risk_factors": [
            "Produit mal identifié, molécule substituée, pureté inconnue ou nom commercial trompeur.",
            "Binge, chemsex, privation de sommeil, sexualité prolongée, chaleur, déshydratation ou non-alimentation.",
            "Mélanges stimulants/sérotoninergiques : MDMA, cocaïne, amphétamines, méthamphétamine, tramadol, IMAO.",
            "Injection, muqueuses lésées ou partage de matériel : risques infectieux et complications locales."
        ],
        "avoid_if": [
            "Antécédents cardiaques, hypertension, épilepsie, bipolarité/psychose, anxiété sévère ou traitement psychotrope non discuté.",
            "Session sans limite de temps, sans sommeil possible ou avec forte pression sexuelle/sociale.",
            "Produit présenté seulement par un nom de rue ou une étiquette ‘not for human consumption’."
        ],
        "warning_signs": [
            "Douleur thoracique, hyperthermie, convulsions, confusion, agitation extrême ou perte de connaissance.",
            "Paranoïa, hallucinations, idées suicidaires, violence ou insomnie prolongée.",
            "Fièvre, abcès, rougeur douloureuse, plaie ou symptômes infectieux après usage avec matériel invasif."
        ],
        "aftercare": [
            "Prévoir nourriture, sommeil, hygiène, dépistage IST si contexte sexuel à risque, et contact de confiance.",
            "Noter molécule supposée, source, redoses, durée d’éveil, humeur à J+1/J+3 et limites dépassées.",
            "En cas de craving ou usage rapproché, contacter une structure de réduction des risques ou d’addictologie avant que le cycle ne s’installe."
        ],
        "dosage_warning": "Aucun palier fiable n’est fourni pour cette famille : les molécules ont des puissances et durées trop différentes. L’analyse de produit est prioritaire quand elle est accessible."
    },
    "2cb": {
        "name": "2C-B",
        "category": "Psychédélique",
        "class": "psychedelic",
        "description": "Psychédélique phényléthylamine au profil stimulant. De petites variations de dose ou de voie peuvent changer fortement l’intensité et l’anxiété corporelle.",
        "dosages": {
            "unit": "mg",
            "threshold": "2 - 5 mg",
            "light": "5 - 15 mg",
            "common": "15 - 25 mg",
            "strong": "25 - 40 mg",
            "heavy": "40 mg +"
        },
        "dosages_by_route": {
            "Oral": {
                "unit": "mg",
                "threshold": "5 mg",
                "light": "10 - 15 mg",
                "common": "15 - 25 mg",
                "strong": "25 - 45 mg",
                "heavy": "45 mg +"
            },
            "Insufflé": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 8 mg",
                "common": "8 - 12 mg",
                "strong": "12 - 23 mg",
                "heavy": "23 mg +"
            },
            "Rectal": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "5 - 8 mg",
                "common": "8 - 12 mg",
                "strong": "12 - 23 mg",
                "heavy": "23 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "1 mg",
                "light": "1 - 2,5 mg",
                "common": "2,5 - 5 mg",
                "strong": "5 - 10 mg",
                "heavy": "10 mg +"
            }
        },
        "bioavailability_by_route": {
            "Oral": "Non quantifiée",
            "Insufflé": "Non quantifiée",
            "Rectal": "Non quantifiée",
            "Intraveineux": "100 % (par définition)"
        },
        "durations": {
            "default": {
                "onset": "20 - 40 min (oral)",
                "comeup": "60 - 90 min",
                "peak": "60 - 90 min",
                "offset": "2,5 - 3,5 h",
                "total": "5 - 7 h"
            },
            "Oral": {
                "onset": "20 - 40 min",
                "comeup": "60 - 90 min",
                "peak": "60 - 90 min",
                "offset": "2,5 - 3,5 h",
                "total": "5 - 7 h"
            },
            "Insufflé": {
                "onset": "1 - 5 min",
                "comeup": "15 - 30 min",
                "peak": "60 - 90 min",
                "offset": "2 - 3 h",
                "total": "4 - 6 h"
            },
            "Rectal": {
                "onset": "5 - 20 min",
                "comeup": "10 - 30 min",
                "peak": "2 - 4 h",
                "offset": "1 - 2 h",
                "total": "4 - 8 h"
            },
            "Intraveineux": {
                "onset": "5 - 15 sec",
                "comeup": "0 - 1 min",
                "peak": "15 - 30 min",
                "offset": "1,5 - 2 h",
                "total": "2 - 3 h"
            }
        },
        "durations_seconds": {
            "default": {
                "onset": 1800,
                "comeup": 4500,
                "peak": 4500,
                "offset": 10800,
                "total": 21600
            },
            "Oral": {
                "onset": 1800,
                "comeup": 4500,
                "peak": 4500,
                "offset": 10800,
                "total": 21600
            },
            "Insufflé": {
                "onset": 180,
                "comeup": 1350,
                "peak": 4500,
                "offset": 9000,
                "total": 18000
            },
            "Rectal": {
                "onset": 750,
                "comeup": 1200,
                "peak": 10800,
                "offset": 5400,
                "total": 18150
            },
            "Intraveineux": {
                "onset": 10,
                "comeup": 30,
                "peak": 1350,
                "offset": 6300,
                "total": 9000
            }
        },
        "rdr_rules": [
            "Les variations de quelques milligrammes peuvent être significatives : une estimation visuelle est particulièrement risquée.",
            "La voie nasale est très douloureuse et peut augmenter brutalement l’intensité ; elle accroît aussi les irritations locales.",
            "Le côté stimulant peut majorer tension, nausée ou anxiété : privilégier un environnement calme et éviter les mélanges stimulants.",
            "Même si la tolérance diffère du LSD, l’espacement reste important pour récupérer mentalement.",
            "Attention aux comprimés vendus comme 2C-B : dose réelle et présence d’autres substances ne sont pas garanties sans analyse."
        ],
        "aliases": [
            "Nexus",
            "tucibi/tusi (souvent mélange différent)",
            "2CB"
        ],
        "forms": [
            "poudre",
            "comprimé",
            "gélule"
        ],
        "legal_status": "Classé stupéfiant ; usage non médical interdit.",
        "profile": "Le 2C-B se situe entre stimulation corporelle et psychédélisme. Sa marge subjective peut sembler fine : quelques milligrammes ou une voie différente changent fortement le vécu.",
        "effects": [
            "Visuels, intensification tactile, euphorie, stimulation légère à marquée et sensibilité émotionnelle.",
            "Nausées, tension corporelle, frissons, tremblements, mâchoires serrées ou anxiété somatique.",
            "À intensité élevée : confusion, surcharge sensorielle, panique ou incapacité à interagir normalement.",
            "Descente généralement plus courte que LSD, mais fatigue et vulnérabilité émotionnelle possibles."
        ],
        "risk_factors": [
            "Pesée imprécise, comprimés non analysés, poudre mal homogénéisée ou confusion avec des mélanges vendus comme ‘tusi’.",
            "Mélanges avec stimulants, MDMA, cocaïne, cathinones ou cannabis.",
            "Anxiété corporelle, nausée, environnement dense, chaleur ou pression sociale.",
            "Antécédents psychiatriques ou cardiovasculaires."
        ],
        "avoid_if": [
            "Produit rose ‘tusi/tucibi’ non analysé : il s’agit souvent d’un mélange qui ne contient pas forcément du 2C-B.",
            "Contexte où une montée anxieuse ou nauséeuse serait difficile à gérer.",
            "Prise pour prolonger une session MDMA/stimulants déjà fatigante."
        ],
        "warning_signs": [
            "Douleur thoracique, hyperthermie, confusion sévère, agitation impossible à calmer ou perte de connaissance.",
            "Panique persistante, idées suicidaires ou comportement dangereux.",
            "Irritation nasale importante, saignement ou douleur intense après exposition nasale."
        ],
        "aftercare": [
            "Retour au calme, hydratation modérée, repas et sommeil ; éviter l’empilement avec une autre session.",
            "Noter forme, dose supposée, intensité corporelle et anxiété pour mieux repérer la marge personnelle.",
            "En cas de comprimé ou mélange suspect, signaler/faire analyser si possible."
        ],
        "dosage_warning": "Le 2C-B se dose au milligramme ; une estimation visuelle est dangereuse. Les produits vendus comme ‘tusi’ sont souvent des mélanges différents."
    },
    "dmt": {
        "name": "DMT (diméthyltryptamine)",
        "category": "Psychédélique",
        "class": "psychedelic",
        "description": "Tryptamine psychédélique extrêmement intense et très brève par inhalation, avec altération rapide de la perception corporelle, de l’espace et de la capacité à interagir.",
        "dosages": {
            "unit": "mg",
            "threshold": "2 - 5 mg",
            "light": "5 - 12 mg",
            "common": "12 - 25 mg",
            "strong": "25 - 40 mg",
            "heavy": "40 mg +"
        },
        "dosages_by_route": {
            "Inhalé": {
                "unit": "mg",
                "threshold": "2 mg",
                "light": "10 - 20 mg",
                "common": "20 - 40 mg",
                "strong": "40 - 60 mg",
                "heavy": "60 mg +"
            },
            "Intraveineux": {
                "unit": "mg",
                "threshold": "4 mg",
                "light": "4 - 10 mg",
                "common": "10 - 15 mg",
                "strong": "15 - 20 mg",
                "heavy": "20 mg +"
            }
        },
        "bioavailability_by_route": {
            "Inhalé": "Non quantifiée",
            "Intraveineux": "100 % (par définition)"
        },
        "durations": {
            "default": {
                "onset": "20 - 40 sec (inhalé/vaporisé)",
                "comeup": "1 - 3 min",
                "peak": "2 - 8 min",
                "offset": "1 - 6 min",
                "total": "5 - 20 min"
            },
            "Inhalé": {
                "onset": "20 - 40 sec",
                "comeup": "1 - 3 min",
                "peak": "2 - 8 min",
                "offset": "1 - 6 min",
                "total": "5 - 20 min"
            },
            "Intraveineux": {
                "onset": "2 - 10 sec",
                "comeup": "70 - 100 sec",
                "peak": "2 - 5 min",
                "offset": "10 - 20 min",
                "total": "15 - 30 min"
            }
        },
        "durations_seconds": {
            "default": {
                "onset": 30,
                "comeup": 120,
                "peak": 300,
                "offset": 210,
                "total": 750
            },
            "Inhalé": {
                "onset": 30,
                "comeup": 120,
                "peak": 300,
                "offset": 210,
                "total": 750
            },
            "Intraveineux": {
                "onset": 6,
                "comeup": 85,
                "peak": 210,
                "offset": 900,
                "total": 1350
            }
        },
        "rdr_rules": [
            "S’asseoir ou s’allonger dans un espace dégagé : la perte de repères corporels peut être immédiate.",
            "La présence d’une personne sobre réduit les risques de chute, brûlure, panique ou mauvaise manipulation d’un objet chaud.",
            "Éviter en période de fragilité psychologique, d’angoisse intense ou après privation de sommeil.",
            "Prévoir un temps de retour au calme après l’expérience avant toute interaction sociale, déplacement ou décision importante.",
            "Ne pas associer à IMAO/ayahuasca/pharmahuasca sans connaissances médicales solides : les risques et la durée changent complètement."
        ],
        "aliases": [
            "N,N-DMT",
            "changa selon préparation",
            "spirit molecule"
        ],
        "forms": [
            "cristaux/poudre",
            "préparation végétale type changa",
            "breuvage ayahuasca hors fiche"
        ],
        "legal_status": "DMT classée stupéfiant ; certains usages rituels existent hors cadre français.",
        "profile": "La DMT inhalée est très brève mais peut être extrêmement désorganisante. Le danger pratique principal vient de l’incapacité soudaine à gérer son corps ou le matériel, plus que de la durée totale.",
        "effects": [
            "Altérations visuelles et auditives intenses, immersion, dissolution du sens de soi, perception d’entités ou scènes complexes.",
            "Accélération cardiaque, tremblements, larmes, nausée, peur intense ou incapacité temporaire à parler.",
            "Retour rapide mais parfois émotionnellement chargé, avec besoin de calme et d’intégration.",
            "Avec IMAO : durée et risques deviennent très différents ; cette fiche ne couvre pas ce cadre."
        ],
        "risk_factors": [
            "Position debout, objets chauds, lieu encombré, isolement ou absence de personne sobre.",
            "Préparations contenant des IMAO, traitements antidépresseurs/psychiatriques ou substances sérotoninergiques.",
            "Antécédents psychotiques, bipolarité, anxiété sévère ou traumatisme récent.",
            "Volonté de répéter plusieurs expériences sans temps d’intégration."
        ],
        "avoid_if": [
            "Présence d’IMAO, ayahuasca, harmalas ou traitement psychotrope non évalué médicalement.",
            "Lieu où une perte totale d’interaction pendant quelques minutes serait dangereuse.",
            "État de panique, fatigue extrême ou pression du groupe."
        ],
        "warning_signs": [
            "Chute, brûlure, perte de connaissance, douleur thoracique, convulsions ou confusion qui persiste.",
            "Panique durable, idées suicidaires, déréalisation persistante ou insomnie après l’expérience.",
            "Signes compatibles avec syndrome sérotoninergique si mélange : fièvre, rigidité, agitation, diarrhée, confusion."
        ],
        "aftercare": [
            "Rester assis/allongé jusqu’au retour complet ; prendre un temps calme avant téléphone, rue ou transports.",
            "Débriefer sans imposer d’interprétation immédiate : certaines expériences demandent du recul.",
            "Éviter d’enchaîner pour ‘comprendre’ à tout prix si l’expérience a été déstabilisante."
        ],
        "dosage_warning": "Les paliers concernent la DMT inhalée/vaporisée uniquement. Les préparations avec IMAO changent totalement durée, intensité et interactions."
    },
    "benzodiazepines": {
        "name": "Benzodiazépines",
        "category": "Dépresseur",
        "class": "depressant",
        "description": "Médicaments anxiolytiques et sédatifs agissant sur le système GABA. Hors suivi médical, les risques majeurs sont blackout, dépendance, sevrage dangereux et mélanges dépresseurs.",
        "dosages": {
            "unit": "mg d’alprazolam équivalent",
            "threshold": "0.1 - 0.25 mg",
            "light": "0.25 - 0.5 mg",
            "common": "0.5 - 1.5 mg",
            "strong": "1.5 - 3 mg",
            "heavy": "3 mg +"
        },
        "durations": {
            "onset": "15 - 45 min",
            "comeup": "20 - 60 min",
            "peak": "1 - 4 h",
            "offset": "2 - 8 h",
            "total": "4 - 12 h ou plus selon demi-vie"
        },
        "durations_seconds": {
            "onset": 1800,
            "comeup": 2400,
            "peak": 9000,
            "offset": 18000,
            "total": 31200
        },
        "rdr_rules": [
            "Ne pas arrêter brutalement après un usage régulier : le sevrage peut être grave et nécessite un accompagnement médical.",
            "Blackouts et amnésie peuvent conduire à des redoses involontaires, prises de risques ou mélanges non planifiés.",
            "Ne pas utiliser pour ‘gérer’ systématiquement les descentes : cela peut installer une dépendance croisée.",
            "Éviter strictement alcool, GHB/GBL, opioïdes et autres sédatifs : la dépression respiratoire peut devenir mortelle.",
            "Ne pas conduire : la sédation, l’amnésie et les réflexes altérés peuvent persister le lendemain, surtout avec demi-vie longue."
        ],
        "aliases": [
            "benzos",
            "alprazolam",
            "diazépam",
            "clonazépam",
            "lorazépam",
            "Xanax/Valium selon spécialités"
        ],
        "forms": [
            "comprimé",
            "gouttes",
            "forme injectable médicale"
        ],
        "legal_status": "Médicaments sur prescription ; usage hors prescription et trafic interdits.",
        "profile": "Les benzodiazépines peuvent donner l’impression d’une sécurité parce qu’elles apaisent. Le risque majeur est justement cette désinhibition amnésique : oublier qu’on a pris, redoser, mélanger, puis ne plus pouvoir consentir ou réagir correctement.",
        "effects": [
            "Anxiolyse, sédation, relâchement musculaire, baisse de vigilance et ralentissement psychomoteur.",
            "Amnésie antérograde, désinhibition, confusion, troubles de l’équilibre et paroles ralenties.",
            "Avec usage répété : tolérance, dépendance, irritabilité, insomnie rebond et anxiété entre les prises.",
            "Sevrage brutal possible : anxiété majeure, tremblements, hallucinations, convulsions."
        ],
        "risk_factors": [
            "Alcool, opioïdes, GHB/GBL, kétamine, antihistaminiques sédatifs ou autres dépresseurs.",
            "Demi-vie longue, redoses oubliées, comprimés contrefaits ou dosages non équivalents entre molécules.",
            "Usage pour dormir après stimulants, surtout si cela devient systématique.",
            "Antécédents de dépendance, apnée du sommeil, BPCO ou vulnérabilité respiratoire."
        ],
        "avoid_if": [
            "Alcool ou opioïdes déjà consommés, somnolence importante, respiration lente ou personne seule.",
            "Conduite, travail, sexualité non discutée à l’avance ou décision engageante.",
            "Arrêt soudain après usage quotidien : demander un avis médical pour diminuer progressivement."
        ],
        "warning_signs": [
            "Respiration lente, inconscience, vomissements, impossibilité de réveiller, lèvres bleutées ou confusion sévère.",
            "Comportements inhabituels sans souvenir, prises répétées non prévues ou mélange oublié.",
            "Tremblements, agitation, hallucinations ou convulsions après réduction/arrêt."
        ],
        "aftercare": [
            "Laisser passer la sédation avant toute responsabilité ; prévoir surveillance si mélange ou dose élevée.",
            "Noter heure, molécule et quantité pour éviter les redoses amnésiques.",
            "En cas d’usage régulier, envisager un plan médical de réduction plutôt qu’un arrêt brutal."
        ],
        "dosage_warning": "Équivalences très approximatives : chaque benzodiazépine a une puissance et une demi-vie différentes. Ne pas convertir sans avis médical."
    },
    "opioides": {
        "name": "Opioïdes / opiacés",
        "category": "Dépresseur",
        "class": "depressant",
        "description": "Famille de substances agissant sur les récepteurs opioïdes. Le risque principal est la dépression respiratoire, fortement aggravée par la tolérance variable, les produits puissants et les mélanges.",
        "dosages": {
            "unit": "mg de morphine équivalent",
            "threshold": "2 - 5 mg",
            "light": "5 - 10 mg",
            "common": "10 - 25 mg",
            "strong": "25 - 50 mg",
            "heavy": "50 mg +"
        },
        "durations": {
            "onset": "10 - 30 min (oral) / très rapide selon voie",
            "comeup": "30 - 60 min",
            "peak": "1.5 - 3 h",
            "offset": "2 - 4 h",
            "total": "4 - 8 h ou plus selon molécule"
        },
        "durations_seconds": {
            "onset": 1200,
            "comeup": 2700,
            "peak": 8100,
            "offset": 10800,
            "total": 22800
        },
        "rdr_rules": [
            "Risque élevé de dépendance physique et psychologique, avec tolérance et sevrage parfois difficiles à gérer sans aide médicale.",
            "La surdose se manifeste notamment par respiration lente ou absente, lèvres bleutées, inconscience, ronflements anormaux : appelez immédiatement le 15/112.",
            "Avoir de la naloxone disponible et prévenir l’entourage de son usage peut sauver une vie, mais n’annule pas la nécessité d’appeler les secours.",
            "Éviter strictement alcool, benzodiazépines, GHB/GBL, kétamine et autres dépresseurs : le cumul sédatif peut être mortel.",
            "Après une pause, une hospitalisation ou un sevrage, la tolérance chute : le risque de surdose augmente fortement."
        ],
        "aliases": [
            "opiacés",
            "morphine",
            "héroïne",
            "oxycodone",
            "codéine",
            "méthadone selon contexte"
        ],
        "forms": [
            "médicaments",
            "poudre",
            "comprimé",
            "solution",
            "patch selon molécule"
        ],
        "legal_status": "Certains opioïdes sont des médicaments sur prescription ; usage hors prescription et produits illicites interdits.",
        "profile": "Le danger opioïde central est respiratoire. Une personne peut sembler dormir alors que sa respiration devient insuffisante. Les mélanges dépresseurs et la perte de tolérance sont les deux grands pièges.",
        "effects": [
            "Analgésie, détente, chaleur, euphorie ou apaisement, somnolence, pupilles serrées.",
            "Nausées, constipation, démangeaisons, ralentissement, confusion et respiration plus lente.",
            "Tolérance, dépendance physique, craving et syndrome de sevrage avec douleurs, diarrhée, anxiété et insomnie.",
            "Avec produits puissants ou inconnus : marge très faible entre effet et surdose."
        ],
        "risk_factors": [
            "Alcool, benzodiazépines, GHB/GBL, kétamine, antihistaminiques sédatifs ou autres dépresseurs.",
            "Tolérance basse ou diminuée après pause, prison, hospitalisation, cure, sevrage ou rupture d’approvisionnement.",
            "Produit inconnu, comprimé contrefait, fentanyl/nitazènes ou concentration variable.",
            "Consommation seul, absence de naloxone ou personne non formée autour."
        ],
        "avoid_if": [
            "Somnolence déjà forte, alcool/benzos/GHB consommés, respiration lente ou absence de personne pouvant appeler les secours.",
            "Reprise après abstinence avec les repères d’avant : la tolérance n’est plus la même.",
            "Patch ou médicament non prescrit, comprimé d’origine incertaine ou mélange de plusieurs opioïdes."
        ],
        "warning_signs": [
            "Triade typique : inconscience ou réveil difficile, pupilles serrées, respiration lente/superficielle ou absente.",
            "Ronflements/gargouillis anormaux, lèvres bleues/grises, peau froide, vomissements avec somnolence.",
            "Sevrage sévère, idées suicidaires, douleurs ou infection si usage invasif."
        ],
        "aftercare": [
            "Après naloxone ou suspicion de surdose : secours indispensables, car l’effet de l’opioïde peut revenir après la naloxone.",
            "Garder naloxone accessible, informer proches et noter les périodes de baisse de tolérance.",
            "Chercher un accompagnement CSAPA/CAARUD ou médical pour substitution, matériel, dépistage et réduction des risques."
        ],
        "dosage_warning": "Les équivalences morphine sont très approximatives et ne s’appliquent pas aux opioïdes très puissants ou aux produits inconnus."
    },
    "fentanyl_nitazenes": {
        "name": "Fentanyl, fentanyloïdes & nitazènes",
        "category": "Dépresseur",
        "class": "depressant",
        "description": "Opioïdes de synthèse très puissants ou ultra-puissants. Le risque de surdose est élevé, surtout avec produits inconnus, comprimés contrefaits, perte de tolérance et mélanges dépresseurs.",
        "dosages": {
            "unit": "non applicable",
            "threshold": "Non applicable",
            "light": "Non applicable",
            "common": "Non applicable",
            "strong": "Non applicable",
            "heavy": "Non applicable"
        },
        "durations": {
            "onset": "quelques minutes à 30 min selon forme",
            "comeup": "variable",
            "peak": "variable",
            "offset": "variable",
            "total": "30 min à 72 h selon molécule et forme (patchs : prolongé)"
        },
        "durations_seconds": {
            "onset": 600,
            "comeup": 1800,
            "peak": 7200,
            "offset": 14400,
            "total": 28800
        },
        "rdr_rules": [
            "Ne pas utiliser de repères de dosage généraux : puissance, forme, analogue et concentration rendent l’estimation dangereuse.",
            "Avoir de la naloxone disponible, informer l’entourage et appeler immédiatement le 15/112 en cas de somnolence anormale ou respiration ralentie.",
            "Éviter tout mélange avec alcool, benzodiazépines, GHB/GBL, opioïdes, kétamine ou autres dépresseurs : risque d’arrêt respiratoire.",
            "Les comprimés ou poudres contrefaits peuvent contenir ces opioïdes sans que l’utilisateur le sache : l’analyse de produit est un enjeu majeur.",
            "Après une pause ou baisse de tolérance, le risque de décès augmente fortement."
        ],
        "aliases": [
            "fentanyl",
            "carfentanyl",
            "ocfentanyl",
            "nitazènes",
            "isotonitazène",
            "protonitazène"
        ],
        "forms": [
            "patch/médicament",
            "poudre",
            "comprimé contrefait",
            "buvard",
            "spray/solution selon produit"
        ],
        "legal_status": "Fentanyl médical strictement prescrit ; fentanyloïdes/nitazènes non médicaux classés ou interdits selon molécules.",
        "profile": "Cette fiche est volontairement non dosante. Pour ces opioïdes, l’information la plus importante est l’urgence respiratoire : reconnaître vite, appeler, administrer la naloxone si disponible et surveiller jusqu’aux secours.",
        "effects": [
            "Sédation, analgésie, euphorie ou apaisement, pupilles serrées, somnolence et respiration ralentie.",
            "Nausées, vomissements, confusion, perte de conscience et arrêt respiratoire en cas de surdose.",
            "Durée très variable : formes à libération prolongée ou patchs peuvent exposer longtemps.",
            "Naloxone utile mais parfois plusieurs administrations peuvent être nécessaires selon produit/durée."
        ],
        "risk_factors": [
            "Produit non identifié, poudre/comprimé acheté hors circuit médical, adultération d’autres substances.",
            "Alcool, benzodiazépines, GHB/GBL, opioïdes, kétamine ou autres dépresseurs.",
            "Tolérance basse, reprise après pause, usage seul, absence de naloxone ou entourage non informé.",
            "Patchs : libération prolongée, résidus actifs même après usage, danger pour enfants/animaux."
        ],
        "avoid_if": [
            "Toute consommation non prescrite ou produit d’origine incertaine : risque vital disproportionné.",
            "Être seul, dormir, boire de l’alcool ou prendre des sédatifs/opioïdes en parallèle.",
            "Manipulation de patchs ou formes médicales hors prescription."
        ],
        "warning_signs": [
            "Respiration lente, rare ou absente ; ronflements/gargouillis ; lèvres bleutées ; personne impossible à réveiller.",
            "Pupilles très serrées, peau froide, vomissements, relâchement complet ou perte de connaissance.",
            "Ré-endormissement après naloxone : l’opioïde peut durer plus longtemps que l’antidote."
        ],
        "aftercare": [
            "Appel 15/112 obligatoire après suspicion de surdose, même si la personne se réveille après naloxone.",
            "Se procurer de la naloxone via pharmacie, CSAPA ou CAARUD quand c’est possible et former l’entourage.",
            "Documenter produit, forme, heure et symptômes pour les soignants ; ne pas jeter ce qui peut aider l’identification."
        ],
        "dosage_warning": "Aucun palier sûr ou généralisable : la puissance peut varier d’un facteur très élevé. Cette fiche ne fournit volontairement pas de dosage."
    },
    "tramadol": {
        "name": "Tramadol",
        "category": "Dépresseur",
        "class": "depressant",
        "description": "Antalgique opioïde sur prescription, avec activité sérotoninergique/noradrénergique. Hors suivi médical, il combine risques opioïdes, convulsions et syndrome sérotoninergique.",
        "dosages": {
            "unit": "mg (médicament prescrit)",
            "threshold": "Sur prescription uniquement",
            "light": "Sur prescription uniquement",
            "common": "Sur prescription uniquement",
            "strong": "Sur prescription uniquement",
            "heavy": "Risque élevé hors prescription"
        },
        "durations": {
            "onset": "30 - 60 min (libération immédiate)",
            "comeup": "1 - 2 h",
            "peak": "2 - 4 h",
            "offset": "4 - 8 h",
            "total": "6 - 12 h ou plus selon forme"
        },
        "durations_seconds": {
            "onset": 2400,
            "comeup": 5400,
            "peak": 10800,
            "offset": 21600,
            "total": 36000
        },
        "rdr_rules": [
            "Ne pas mélanger avec MDMA, antidépresseurs sérotoninergiques, IMAO ou autres stimulants : risque de convulsions et syndrome sérotoninergique.",
            "Ne pas associer avec alcool, benzodiazépines, GHB/GBL, opioïdes ou autres dépresseurs : risque respiratoire et black-out.",
            "Respecter strictement une prescription médicale ; ne pas utiliser pour gérer une descente ou potentialiser une autre substance.",
            "Ne pas arrêter brutalement après usage régulier sans avis médical : sevrage opioïde et symptômes anxieux peuvent être difficiles.",
            "Appeler le 15/112 en cas de convulsion, confusion, fièvre, rigidité, respiration lente ou perte de connaissance."
        ],
        "aliases": [
            "Ixprim selon association",
            "Contramal/Topalgic selon spécialités",
            "opioïde atypique"
        ],
        "forms": [
            "comprimé",
            "gélule",
            "gouttes",
            "libération immédiate ou prolongée"
        ],
        "legal_status": "Médicament sur prescription ; usage hors prescription dangereux et illégal.",
        "profile": "Le tramadol est souvent sous-estimé parce qu’il est prescrit. Sa particularité est de cumuler un effet opioïde et une action sur la sérotonine/noradrénaline, ce qui le rend particulièrement problématique avec MDMA, antidépresseurs et stimulants.",
        "effects": [
            "Antalgie, détente, somnolence, nausées, vertiges, démangeaisons, constipation.",
            "Effets sérotoninergiques possibles : sueurs, agitation, tremblements, diarrhée, confusion.",
            "Risque de convulsions, y compris à doses non extrêmes chez certaines personnes ou en mélange.",
            "Dépendance et sevrage possibles après usage répété."
        ],
        "risk_factors": [
            "MDMA, ISRS/IRSN, IMAO, lithium, millepertuis, stimulants, cathinones ou cocaïne.",
            "Alcool, benzodiazépines, opioïdes, GHB/GBL ou autres dépresseurs.",
            "Épilepsie, antécédents de convulsions, insuffisance respiratoire, interactions médicamenteuses.",
            "Formes à libération prolongée : accumulation et durée plus longue que prévu."
        ],
        "avoid_if": [
            "Toute association avec MDMA ou antidépresseur sans avis médical.",
            "Alcool ou sédatifs déjà consommés, somnolence importante ou conduite prévue.",
            "Utilisation non prescrite, surtout pour ‘adoucir’ une descente de stimulant."
        ],
        "warning_signs": [
            "Convulsion, perte de connaissance, respiration lente, lèvres bleutées ou vomissements avec somnolence.",
            "Fièvre, rigidité musculaire, agitation, confusion, diarrhée et tremblements : suspicion de syndrome sérotoninergique.",
            "Sevrage marqué : anxiété, douleurs, diarrhée, insomnie, agitation ou idées noires."
        ],
        "aftercare": [
            "Ne pas redoser pour compenser une descente ; surveiller somnolence et respiration, surtout avec mélanges.",
            "En cas d’usage régulier, discuter d’une diminution encadrée avec un médecin.",
            "Noter les médicaments et substances associés : c’est crucial en cas d’urgence."
        ],
        "dosage_warning": "Médicament à utiliser uniquement selon prescription. Les paliers récréatifs ne sont pas fournis car les interactions et convulsions rendent l’usage hors cadre particulièrement risqué."
    },
    "ghb": {
        "name": "GHB / GBL",
        "category": "Dépresseur",
        "class": "depressant",
        "description": "Dépresseur puissant du système nerveux central, souvent liquide, avec une marge très étroite entre effets recherchés, perte de conscience et coma.",
        "dosages": {
            "unit": "g (GHB) ou ml (GBL)",
            "threshold": "0.5 - 1.0 g",
            "light": "1.0 - 1.5 g",
            "common": "1.5 - 2.5 g",
            "strong": "2.5 - 3.0 g",
            "heavy": "3.0 g +"
        },
        "durations": {
            "onset": "10 - 20 min",
            "comeup": "15 - 30 min",
            "peak": "45 - 90 min",
            "offset": "30 - 60 min",
            "total": "2 - 4 h"
        },
        "durations_seconds": {
            "onset": 900,
            "comeup": 1350,
            "peak": 4050,
            "offset": 2700,
            "total": 9000
        },
        "rdr_rules": [
            "La marge de sécurité est très étroite : une petite erreur de mesure ou de concentration peut entraîner une perte de conscience.",
            "Ne jamais associer avec alcool, benzodiazépines, opioïdes ou autres dépresseurs : coma et arrêt respiratoire peuvent survenir rapidement.",
            "Noter l’heure exacte de chaque prise et éviter les redoses rapprochées : l’accumulation est une cause majeure d’accident.",
            "Étiqueter clairement tout contenant et ne jamais laisser un verre ou flacon accessible à une autre personne.",
            "En cas de personne inconsciente ou respiration anormale : ne pas attendre que ‘ça passe’, appeler le 15/112."
        ],
        "aliases": [
            "G",
            "GBL",
            "liquid ecstasy",
            "1,4-BD"
        ],
        "forms": [
            "liquide",
            "poudre soluble",
            "précurseurs GBL/BD selon contexte"
        ],
        "legal_status": "GHB classé stupéfiant hors usages médicaux ; vente au public de GBL/BD interdite en France.",
        "profile": "Le GHB/GBL est une substance où l’erreur de mesure, la concentration inconnue et la redose rapprochée sont au cœur des accidents. La différence entre effet sédatif, sommeil profond et coma peut être faible.",
        "effects": [
            "Désinhibition, détente, euphorie, sociabilité, somnolence ou vertiges.",
            "Nausées, vomissements, confusion, pertes de mémoire, mouvements désordonnés.",
            "À dose élevée ou en mélange : sommeil brutal, coma, respiration ralentie et risque d’étouffement.",
            "Sevrage potentiellement sévère chez usagers réguliers : anxiété, tremblements, insomnie, délire ou convulsions."
        ],
        "risk_factors": [
            "Alcool, benzodiazépines, opioïdes, kétamine ou tout dépresseur.",
            "GBL plus concentré/caustique, flacon mal étiqueté, bouchon ou estimation visuelle.",
            "Redoses avant la fin du pic, perte de mémoire de l’heure, usage en contexte sexuel ou produit laissé sans surveillance.",
            "Usage fréquent : dépendance et sevrage médicalement risqué."
        ],
        "avoid_if": [
            "Alcool consommé dans la soirée, sédatifs, opioïdes, fatigue extrême ou personne seule.",
            "Concentration inconnue, contenant non étiqueté, absence de moyen de noter l’heure.",
            "Antécédent de perte de connaissance au GHB/GBL ou sevrage déjà vécu."
        ],
        "warning_signs": [
            "Sommeil impossible à interrompre, respiration lente/irrégulière, vomissements, peau froide, lèvres bleutées.",
            "Confusion sévère, agitation paradoxale, chute, convulsions ou personne qui alterne réveil et inconscience.",
            "Sevrage : tremblements, agitation, hallucinations, tachycardie ou impossibilité de dormir après usage répété."
        ],
        "aftercare": [
            "Après malaise ou G-hole, rester surveillé jusqu’au retour complet ; ne pas laisser dormir seul sur le dos.",
            "Jeter ou isoler tout contenant non identifié ; noter concentration, heure et contexte si l’information existe.",
            "En usage régulier, demander une aide médicale avant arrêt brutal."
        ],
        "dosage_warning": "GHB, GBL et 1,4-BD n’ont pas la même concentration ni cinétique. Une valeur en ml sans concentration connue n’a pas de sens fiable."
    },
    "protoxyde_azote": {
        "name": "Protoxyde d’azote",
        "category": "Dissociatif",
        "class": "dissociative",
        "description": "Gaz à effet très bref pouvant provoquer euphorie, dissociation et vertiges, mais aussi manque d’oxygène, chutes, brûlures par le froid et atteintes neurologiques en usage répété.",
        "dosages": {
            "unit": "non standardisé",
            "threshold": "Non applicable",
            "light": "Non applicable",
            "common": "Non applicable",
            "strong": "Non applicable",
            "heavy": "Non applicable"
        },
        "durations": {
            "onset": "quasi immédiat",
            "comeup": "quelques secondes",
            "peak": "30 sec - 2 min",
            "offset": "2 - 5 min",
            "total": "2 - 15 min avec vigilance résiduelle possible"
        },
        "durations_seconds": {
            "onset": 10,
            "comeup": 20,
            "peak": 90,
            "offset": 180,
            "total": 600
        },
        "rdr_rules": [
            "Risque d’asphyxie : toute sensation de manque d’air, confusion ou malaise impose d’arrêter et de demander de l’aide.",
            "Éviter les usages répétés ou intensifs : fourmillements, engourdissements, faiblesse ou troubles de marche peuvent signaler une atteinte neurologique.",
            "Éviter debout, près de l’eau, sur un balcon, en conduite ou avec objets dangereux : vertige et chute peuvent être immédiats.",
            "Ne pas mélanger avec alcool, dépresseurs ou autres substances qui diminuent vigilance et coordination.",
            "Consulter rapidement en cas de symptômes neurologiques, même s’ils paraissent intermittents."
        ],
        "aliases": [
            "proto",
            "gaz hilarant",
            "N2O",
            "ballon"
        ],
        "forms": [
            "cartouche/bonbonne",
            "usage médical MEOPA encadré",
            "gaz industriel/alimentaire détourné"
        ],
        "legal_status": "Vente interdite aux mineurs ; usages médicaux/industriels encadrés.",
        "profile": "Le protoxyde est bref, ce qui peut donner envie d’enchaîner. Le risque augmente surtout avec la répétition, le manque d’oxygène, les chutes et les atteintes neurologiques liées à l’inactivation fonctionnelle de la vitamine B12.",
        "effects": [
            "Euphorie brève, rires, flottement, distorsions auditives/visuelles, dissociation légère.",
            "Vertiges, perte d’équilibre, nausées, maux de tête, somnolence ou baisse de vigilance.",
            "À forte répétition : confusion, faiblesse, troubles de coordination et symptômes neurologiques.",
            "Le froid du gaz sous pression peut provoquer des brûlures graves au contact direct."
        ],
        "risk_factors": [
            "Enchaînement répété, grandes bonbonnes, hyperventilation, manque d’oxygène ou consommation seul.",
            "Carence en vitamine B12, régime restrictif, certains traitements, grossesse ou antécédents neurologiques.",
            "Alcool, benzodiazépines, opioïdes, GHB/GBL, kétamine ou tout produit altérant coordination/vigilance.",
            "Utilisation debout, en voiture, près de l’eau, en hauteur ou dans un espace non ventilé."
        ],
        "avoid_if": [
            "Fourmillements, engourdissements, faiblesse, troubles de marche ou fatigue neurologique déjà présents.",
            "Grossesse, déficit en B12 connu/suspecté, antécédent neurologique ou usage répété récent.",
            "Contexte où une chute ou une perte de vigilance brève peut être grave."
        ],
        "warning_signs": [
            "Difficulté à marcher, faiblesse des jambes, engourdissements, fourmillements persistants ou troubles urinaires.",
            "Perte de connaissance, confusion, cyanose, douleur thoracique ou essoufflement.",
            "Brûlures par le froid, lésions de bouche/voies aériennes ou malaise répété."
        ],
        "aftercare": [
            "Arrêter et consulter si symptômes neurologiques : ils peuvent s’aggraver sans prise en charge.",
            "Éviter de conduire ou de repartir seul tant que vertiges et baisse de vigilance persistent.",
            "Documenter fréquence et quantité approximative : la répétition est un signal de risque."
        ],
        "dosage_warning": "Aucun palier fiable ou recommandé : le danger dépend surtout de la répétition, de l’oxygénation, du contexte et de la vulnérabilité neurologique."
    },
    "poppers": {
        "name": "Poppers (nitrites d’alkyle)",
        "category": "Vasodilatateur",
        "class": "other",
        "description": "Vasodilatateurs volatils à effet très bref, associés à chute de tension, maux de tête, irritation, brûlures chimiques et interactions graves avec certains médicaments de l’érection.",
        "dosages": {
            "unit": "non standardisé",
            "threshold": "Non applicable",
            "light": "Non applicable",
            "common": "Non applicable",
            "strong": "Non applicable",
            "heavy": "Non applicable"
        },
        "durations": {
            "onset": "quelques secondes",
            "comeup": "quelques secondes",
            "peak": "15 - 60 sec",
            "offset": "1 - 5 min",
            "total": "2 - 10 min"
        },
        "durations_seconds": {
            "onset": 5,
            "comeup": 10,
            "peak": 45,
            "offset": 180,
            "total": 300
        },
        "rdr_rules": [
            "Ne jamais associer avec médicaments de l’érection ou traitements vasodilatateurs : chute de tension grave possible.",
            "Éviter en cas de problème cardiaque, tension basse, malaise récent, anémie ou traitement cardiovasculaire sans avis médical.",
            "Tenir éloigné des yeux, de la peau et des muqueuses : irritation et brûlures chimiques peuvent survenir.",
            "Éviter alcool et stimulants : la combinaison peut majorer malaise, palpitations et décisions sexuelles risquées.",
            "En contexte sexuel, consentement, préservatifs/PrEP/dépistage et pauses restent prioritaires."
        ],
        "aliases": [
            "nitrite d’amyle",
            "nitrite d’isopropyle",
            "rush",
            "jungle juice selon marques"
        ],
        "forms": [
            "liquide volatil en flacon"
        ],
        "legal_status": "Statut de vente variable selon composition et usage présenté ; ne pas ingérer.",
        "profile": "Le poppers est bref mais agit fortement sur les vaisseaux. Les risques principaux sont la chute de tension, les interactions cardiovasculaires et les lésions chimiques par contact.",
        "effects": [
            "Chaleur, flush facial, détente musculaire brève, désinhibition et sensation de rush.",
            "Maux de tête, vertiges, nausées, palpitations, baisse de tension ou malaise.",
            "Irritations/brûlures si contact avec peau, yeux, nez ou bouche ; danger grave en cas d’ingestion.",
            "Peut altérer le jugement sexuel par désinhibition et urgence du contexte."
        ],
        "risk_factors": [
            "Médicaments de l’érection type inhibiteurs PDE5, traitements de tension, pathologie cardiaque ou hypotension.",
            "Association avec stimulants, alcool ou chaleur ; sexualité prolongée sans pauses.",
            "Contact avec muqueuses/peau, flacon renversé, produit dégradé ou ingestion accidentelle.",
            "Anémie, déficit G6PD ou vulnérabilités sanguines : risque de méthémoglobinémie selon exposition."
        ],
        "avoid_if": [
            "Médicament de l’érection, douleur thoracique, malaise, tension basse, trouble cardiaque ou essoufflement.",
            "Conduite, douche/bain chaud, sauna ou situation où un vertige peut faire chuter.",
            "Produit sur la peau/yeux ou flacon accessible à enfants/animaux."
        ],
        "warning_signs": [
            "Malaise, perte de connaissance, douleur thoracique, essoufflement, lèvres bleutées ou confusion.",
            "Brûlure chimique, douleur oculaire, ingestion accidentelle ou vomissements après contact oral.",
            "Troubles visuels persistants ou maux de tête intenses."
        ],
        "aftercare": [
            "S’asseoir en cas de vertige ; rincer abondamment en cas de contact peau/yeux et demander avis médical si douleur persiste.",
            "Après malaise ou interaction possible avec médicament de l’érection : avis médical urgent.",
            "Faire un point sur les risques sexuels pris pendant la désinhibition : dépistage, TPE/PrEP selon contexte et délai."
        ],
        "dosage_warning": "Aucun palier fiable : ne pas ingérer, ne pas appliquer sur les muqueuses, et ne pas mélanger avec médicaments de l’érection."
    },
    "cafeine": {
        "name": "Caféine",
        "category": "Stimulant",
        "class": "stimulant",
        "description": "Stimulant courant présent dans café, thé, sodas et boissons énergisantes. Les excès majorent anxiété, palpitations, insomnie et effets des autres stimulants.",
        "dosages": {
            "unit": "mg",
            "threshold": "10 - 20 mg",
            "light": "20 - 50 mg",
            "common": "50 - 150 mg",
            "strong": "150 - 400 mg",
            "heavy": "400 mg +"
        },
        "durations": {
            "onset": "10 - 20 min",
            "comeup": "15 - 45 min",
            "peak": "1 - 2 h",
            "offset": "1 - 3 h",
            "total": "3 - 6 h"
        },
        "durations_seconds": {
            "onset": 900,
            "comeup": 1800,
            "peak": 5400,
            "offset": 7200,
            "total": 15300
        },
        "rdr_rules": [
            "Les fortes quantités ou boissons énergisantes peuvent provoquer palpitations, tremblements, anxiété et insomnie.",
            "Éviter de l’ajouter à des stimulants puissants : la charge cardiovasculaire et l’anxiété peuvent augmenter inutilement.",
            "Chez un consommateur quotidien, l’arrêt brutal peut entraîner maux de tête, fatigue et irritabilité quelques jours.",
            "Attention aux poudres ou comprimés concentrés : les erreurs de mesure deviennent beaucoup plus dangereuses qu’avec des boissons.",
            "Éviter en fin de journée si le sommeil est déjà fragile ou si une descente de stimulant est prévue."
        ],
        "aliases": [
            "café",
            "thé",
            "maté",
            "boisson énergisante",
            "guarana"
        ],
        "forms": [
            "boisson",
            "comprimé",
            "poudre",
            "préworkout"
        ],
        "legal_status": "Légale ; compléments et poudres concentrées à manipuler avec prudence.",
        "profile": "La caféine est légale et quotidienne, mais elle peut amplifier anxiété, palpitations et insomnie, surtout quand elle s’ajoute à d’autres stimulants ou à un manque de sommeil.",
        "effects": [
            "Vigilance, baisse de somnolence, concentration et légère stimulation.",
            "Tremblements, anxiété, palpitations, reflux, diarrhée ou irritabilité à dose élevée.",
            "Délai de sommeil allongé et sommeil plus fragmenté, parfois même quand la personne se sent ‘habituée’.",
            "Sevrage possible : maux de tête, fatigue, humeur basse, somnolence."
        ],
        "risk_factors": [
            "Boissons énergisantes avec alcool, stimulants, préworkouts, manque de sommeil ou anxiété.",
            "Hypertension, troubles du rythme, grossesse, reflux important ou traitement stimulant.",
            "Poudre concentrée : risque d’erreur de mesure et surdosage.",
            "Usage pour compenser systématiquement dette de sommeil ou descente."
        ],
        "avoid_if": [
            "Palpitations, crise d’angoisse, douleur thoracique, insomnie sévère ou stimulant déjà consommé.",
            "Fin de journée quand le sommeil est prioritaire.",
            "Mesure approximative de poudre pure ou complément concentré."
        ],
        "warning_signs": [
            "Palpitations importantes, douleur thoracique, malaise, agitation extrême, vomissements ou confusion.",
            "Insomnie persistante, anxiété qui augmente ou besoin d’augmenter les quantités pour fonctionner.",
            "Maux de tête et fatigue au sevrage qui poussent à reprendre malgré envie de réduire."
        ],
        "aftercare": [
            "Réduire progressivement si usage quotidien élevé ; prioriser sommeil plutôt que redose de caféine.",
            "Noter heure de dernière prise et qualité du sommeil pour repérer le seuil personnel.",
            "Hydratation et repas peuvent aider, mais ne font pas disparaître la stimulation."
        ],
        "dosage_warning": "Les quantités varient fortement selon boissons, compléments et poudres concentrées ; éviter toute mesure approximative avec des produits purs ou très concentrés."
    }
};

// Matrice d'interactions (Tripsit style)
// Clé triée par ordre alphabétique : "substanceA-substanceB"
const INTERACTION_MATRIX = {
    // ALCOOL
    "alcool-cannabis": {
        "category": "caution",
        "note": "L’alcool peut amplifier l’intensité et la confusion liées au THC. Nausées, vomissements, malaise, anxiété aiguë et perte de coordination sont plus probables, surtout avec les formes orales de cannabis."
    },
    "alcool-mdma": {
        "category": "caution",
        "note": "L’alcool peut masquer ou brouiller les effets de la MDMA, favoriser les redoses et augmenter déshydratation, hyperthermie, jugement altéré et charge hépatique. Mélange défavorable en contexte festif ou chaleur."
    },
    "alcool-lsd": {
        "category": "decrease",
        "note": "L’alcool peut réduire certains effets perçus du LSD tout en dégradant le jugement et la coordination. Le risque est de boire davantage sans mesurer l’intoxication réelle."
    },
    "alcool-champignons": {
        "category": "decrease",
        "note": "L’alcool peut rendre l’expérience plus confuse, augmenter les nausées et diminuer la capacité à traverser sereinement une montée difficile."
    },
    "alcool-ketamine": {
        "category": "deadly",
        "note": "MÉLANGE EXTRÊMEMENT DANGEREUX. Sédation, vomissements, chute, perte de connaissance et respiration ralentie peuvent se combiner. Risque majeur d’étouffement et d’urgence vitale."
    },
    "alcool-amphetamine": {
        "category": "unsafe",
        "note": "Le stimulant peut masquer l’ivresse et pousser à boire davantage. Déshydratation, impulsivité, agressivité, hypertension et surmenage cardiovasculaire augmentent nettement."
    },
    "alcool-cocaine": {
        "category": "dangerous",
        "note": "MÉLANGE TRÈS TOXIQUE. L’association forme du cocaéthylène, augmente la durée de stimulation et majore les risques cardiaques, AVC, impulsivité, déshydratation et redoses compulsives."
    },
    "alcool-benzodiazepines": {
        "category": "deadly",
        "note": "DANGER DE MORT. L’addition sédative favorise blackouts, vomissements, coma et dépression respiratoire. Une dose habituellement tolérée peut devenir dangereuse en mélange."
    },
    "alcool-opioides": {
        "category": "deadly",
        "note": "DANGER DE MORT. L’alcool potentialise la sédation opioïde et peut provoquer respiration lente, inconscience, vomissement inhalé et décès. Appel 15/112 en cas de doute."
    },
    "alcool-ghb": {
        "category": "deadly",
        "note": "DANGER DE MORT. L’alcool rend le GHB/GBL beaucoup plus imprévisible. Perte de conscience, coma, vomissements et arrêt respiratoire peuvent survenir rapidement, même avec de petites quantités."
    },

    // CANNABIS
    "cannabis-mdma": {
        "category": "caution",
        "note": "Le cannabis peut intensifier la confusion, les perceptions visuelles et l’anxiété sous MDMA. Il peut aussi rendre la descente plus floue et favoriser des redoses mal évaluées."
    },
    "cannabis-lsd": {
        "category": "caution",
        "note": "Mélange fréquent mais très imprévisible. Le cannabis peut relancer ou amplifier brutalement les effets du LSD, avec confusion, paranoïa, boucles de pensée ou panique."
    },
    "cannabis-champignons": {
        "category": "caution",
        "note": "Le cannabis peut amplifier visions, introspection et instabilité émotionnelle sous psilocybine. Les bouffées d’anxiété et la désorientation sont plus probables pendant la montée ou le plateau."
    },
    "cannabis-ketamine": {
        "category": "synergy",
        "note": "Synergie dissociative notable. Les pertes de repères, vertiges, confusion et chutes deviennent plus probables, surtout debout ou dans un environnement chargé."
    },
    "cannabis-amphetamine": {
        "category": "caution",
        "note": "Le cannabis peut sembler calmer certains effets, mais l’association peut augmenter rythme cardiaque, anxiété, paranoïa et confusion sur l’état réel d’intoxication."
    },
    "cannabis-cocaine": {
        "category": "caution",
        "note": "Risque accru d’anxiété, de paranoïa, de palpitations et de décisions impulsives. La courte durée de la cocaïne peut aussi pousser à redoser sous confusion."
    },
    "cannabis-benzodiazepines": {
        "category": "low_risk",
        "note": "Les benzodiazépines peuvent réduire l’anxiété liée au THC, mais augmentent somnolence, troubles de mémoire et perte de coordination. Éviter conduite et redoses automatiques."
    },
    "cannabis-opioides": {
        "category": "low_risk",
        "note": "Sédation, nausées et somnolence peuvent augmenter. Chez les opioïdes, toute sédation supplémentaire mérite prudence, surtout sans personne sobre à proximité."
    },
    "cannabis-ghb": {
        "category": "caution",
        "note": "Peut augmenter somnolence, étourdissements, nausées et perte de coordination. Le risque augmente si d’autres dépresseurs sont présents."
    },

    // MDMA
    "lsd-mdma": {
        "category": "synergy",
        "note": "Association très intense et longue, parfois appelée candyflip. Les effets émotionnels, stimulants et visuels peuvent se renforcer ; chaleur, confusion, redoses et durée prolongée augmentent les risques."
    },
    "champignons-mdma": {
        "category": "synergy",
        "note": "Forte synergie émotionnelle et sensorielle. L’euphorie peut masquer la montée psychédélique, tandis que chaleur, confusion et redoses deviennent plus difficiles à surveiller."
    },
    "ketamine-mdma": {
        "category": "synergy",
        "note": "La kétamine peut modifier brutalement la descente de MDMA et augmenter désorientation, chutes, confusion et incapacité à demander de l’aide. Éviter l’environnement debout ou bondé."
    },
    "amphetamine-mdma": {
        "category": "unsafe",
        "note": "Double stimulation avec risque accru d’hyperthermie, tachycardie, hypertension, anxiété et récupération difficile. Les redoses deviennent particulièrement risquées."
    },
    "cocaine-mdma": {
        "category": "unsafe",
        "note": "La cocaïne peut brouiller les effets empathogènes de la MDMA tout en augmentant tension artérielle, charge cardiaque, anxiété et envie de redoser. Association défavorable."
    },
    "benzodiazepines-mdma": {
        "category": "decrease",
        "note": "Les benzodiazépines peuvent atténuer stimulation et anxiété, mais ajoutent sédation, amnésie et risque de redosage involontaire. Prudence accrue avec alcool ou autres dépresseurs."
    },
    "mdma-opioides": {
        "category": "unsafe",
        "note": "Association à éviter, surtout avec tramadol : risque de syndrome sérotoninergique, convulsions, sédation contradictoire et décisions de redose mal évaluées."
    },
    "ghb-mdma": {
        "category": "caution",
        "note": "La stimulation peut masquer la sédation du GHB/GBL. Lorsque la MDMA baisse, perte de conscience, vomissements ou coma peuvent apparaître soudainement."
    },

    // LSD / PSYCHEDELIQUES
    "champignons-lsd": {
        "category": "synergy",
        "note": "Tolérance croisée et intensification psychédélique. Les effets peuvent devenir très longs, confus et émotionnellement exigeants, avec risque accru de panique ou perte de repères."
    },
    "ketamine-lsd": {
        "category": "synergy",
        "note": "Synergie psychédélique-dissociative très intense. La motricité, l’orientation et la capacité à communiquer peuvent chuter rapidement ; environnement sécurisé et personne sobre fortement recommandés."
    },
    "amphetamine-lsd": {
        "category": "unsafe",
        "note": "La stimulation peut transformer l’anxiété psychédélique en agitation, paranoïa, boucles de pensée et surmenage cardiovasculaire. Association défavorable."
    },
    "cocaine-lsd": {
        "category": "unsafe",
        "note": "La cocaïne augmente tension, impulsivité et anxiété, ce qui peut déstabiliser fortement l’expérience LSD et favoriser paranoïa ou panique."
    },
    "benzodiazepines-lsd": {
        "category": "decrease",
        "note": "Les benzodiazépines peuvent atténuer l’anxiété et certains effets mentaux, mais ajoutent sédation, amnésie et risque de mélange dépresseur. Ce n’est pas une solution anodine."
    },
    "lsd-opioides": {
        "category": "decrease",
        "note": "Les opioïdes peuvent engourdir l’expérience et masquer l’inconfort, mais ajoutent sédation, nausées et risque respiratoire s’ils sont combinés à d’autres dépresseurs."
    },
    "ghb-lsd": {
        "category": "low_risk",
        "note": "Le GHB/GBL peut réduire l’anxiété perçue mais ajoute désinhibition, sédation et risque de perte de repères. Toute redose devient plus difficile à évaluer."
    },

    // CHAMPIGNONS (similaire LSD)
    "champignons-ketamine": {
        "category": "synergy",
        "note": "La dissociation et les visions peuvent être fortement amplifiées. Le risque de confusion, chute, panique ou incapacité à communiquer augmente."
    },
    "amphetamine-champignons": {
        "category": "unsafe",
        "note": "La stimulation peut amplifier anxiété, tensions corporelles, panique et rythme cardiaque pendant une expérience déjà émotionnellement variable."
    },
    "champignons-cocaine": {
        "category": "unsafe",
        "note": "La cocaïne augmente tension, impulsivité et anxiété, ce qui peut rendre l’expérience confuse, instable et difficile à apaiser."
    },
    "benzodiazepines-champignons": {
        "category": "decrease",
        "note": "Les benzodiazépines peuvent atténuer l’anxiété, mais ajoutent amnésie et sédation. Éviter tout mélange avec alcool ou autres dépresseurs."
    },

    // KETAMINE
    "amphetamine-ketamine": {
        "category": "unsafe",
        "note": "Combinaison souvent désorientante : stimulation cardiovasculaire d’un côté, coordination altérée de l’autre. Risque de chutes, décisions impulsives et fausse impression de contrôle."
    },
    "cocaine-ketamine": {
        "category": "unsafe",
        "note": "La cocaïne peut masquer la dissociation et pousser à reprendre, puis la kétamine réapparaît avec retard. Risques : troubles cardiaques, confusion, chutes et détresse psychique."
    },
    "benzodiazepines-ketamine": {
        "category": "dangerous",
        "note": "Mélange sédatif lourd : amnésie, chute, perte de conscience et respiration ralentie sont plus probables. Risque aggravé par alcool, opioïdes ou GHB/GBL."
    },
    "ketamine-opioides": {
        "category": "deadly",
        "note": "MÉLANGE EXTRÊMEMENT DANGEREUX. Sédation, réflexes diminués, vomissements et respiration ralentie peuvent se combiner. Risque de décès par étouffement ou dépression respiratoire."
    },
    "ghb-ketamine": {
        "category": "deadly",
        "note": "DANGER DE MORT. Deux dépresseurs puissants : inconscience rapide, coma, vomissement inhalé et arrêt respiratoire sont possibles. Association à éviter absolument."
    },

    // STIMULANTS (Amphétamines / Cocaïne)
    "amphetamine-cocaine": {
        "category": "unsafe",
        "note": "Double stimulation cardiovasculaire : tachycardie, hypertension, vasoconstriction, douleurs thoraciques, anxiété et paranoïa peuvent s’additionner fortement."
    },
    "amphetamine-benzodiazepines": {
        "category": "caution",
        "note": "Mélange antagoniste : les benzodiazépines peuvent masquer la stimulation et pousser à reprendre. Amnésie, fatigue cardiovasculaire et redoses mal évaluées deviennent plus probables."
    },
    "benzodiazepines-cocaine": {
        "category": "caution",
        "note": "Les benzodiazépines peuvent réduire la nervosité, mais elles masquent l’intoxication et favorisent redoses, amnésie et surcharge cardiovasculaire liée à la cocaïne."
    },
    "amphetamine-opioides": {
        "category": "dangerous",
        "note": "Association stimulant-opioïde très dangereuse : la stimulation masque la sédation, puis l’opioïde peut provoquer une surdose respiratoire lorsque le stimulant baisse. Charge cardiaque élevée."
    },
    "cocaine-opioides": {
        "category": "deadly",
        "note": "Combinaison extrêmement mortelle. La cocaïne augmente la demande cardiaque tandis que l’opioïde ralentit la respiration. Risque d’arrêt cardiaque, détresse respiratoire et overdose retardée."
    },
    "amphetamine-ghb": {
        "category": "unsafe",
        "note": "Le stimulant peut masquer la sédation du GHB/GBL et encourager les redoses. Quand la stimulation baisse, perte de conscience ou coma peuvent apparaître brutalement."
    },
    "cocaine-ghb": {
        "category": "unsafe",
        "note": "La cocaïne peut masquer la sédation du GHB/GBL. Lorsque son effet chute, perte de connaissance, vomissements ou coma peuvent survenir rapidement."
    },

    // AUTRES
    "benzodiazepines-opioides": {
        "category": "deadly",
        "note": "DANGER DE MORT. Synergie sédative majeure : respiration lente, coma et overdose mortelle sont des risques connus, même avec des doses isolément tolérées."
    },
    "benzodiazepines-ghb": {
        "category": "deadly",
        "note": "DANGER DE MORT. Deux dépresseurs puissants du système nerveux central : perte de conscience, vomissements, coma et arrêt respiratoire peuvent survenir très vite."
    },
    "ghb-opioides": {
        "category": "deadly",
        "note": "DANGER DE MORT. Sédation et dépression respiratoire peuvent se cumuler très rapidement. Risque de décès par étouffement, coma ou arrêt respiratoire."
    },
    "cafeine-cocaine": {
        "category": "unsafe",
        "note": "Sur-stimulation cardiovasculaire : tension, rythme cardiaque, tremblements, anxiété et insomnie augmentent sans bénéfice en réduction des risques."
    },
    "cafeine-amphetamine": {
        "category": "unsafe",
        "note": "Addition stimulante : rythme cardiaque, tension, anxiété, tremblements et insomnie prolongée peuvent augmenter nettement."
    },

    // AJOUTS FICHES ENRICHIES v1.4.0
    "2cb-cannabis_synthese": {
            "category": "dangerous",
            "note": "Mélange psychique très imprévisible : hallucinations, paranoïa, panique, confusion ou comportements dangereux peuvent être brutalement amplifiés."
    },
    "2cb-cathinones": {
            "category": "unsafe",
            "note": "La stimulation peut rendre le psychédélique plus anxieux, confus et physiquement éprouvant. Risque de panique, insomnie et décisions impulsives."
    },
    "2cb-fentanyl_nitazenes": {
            "category": "dangerous",
            "note": "Un opioïde très puissant peut provoquer somnolence, nausées et respiration lente pendant une expérience déjà confuse. Risque d’urgence difficile à reconnaître."
    },
    "2cb-methamphetamine": {
            "category": "unsafe",
            "note": "La stimulation longue peut rendre l’expérience psychédélique plus anxieuse, insomniaque et paranoïde. Charge cardiovasculaire et comportements impulsifs augmentent."
    },
    "2cb-poppers": {
            "category": "caution",
            "note": "Le rush vasodilatateur peut majorer vertiges, anxiété corporelle, confusion ou malaise pendant une expérience déjà altérée."
    },
    "2cb-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde peut intensifier brièvement la dissociation et la confusion psychédélique. Risque de chute, panique ou perte de repères."
    },
    "2cb-tramadol": {
            "category": "caution",
            "note": "Le tramadol peut ajouter nausées, confusion, baisse du seuil convulsif et interactions sérotoninergiques. Mélange imprévisible, surtout avec autres médicaments."
    },
    "alcool-cannabis_synthese": {
            "category": "dangerous",
            "note": "Association imprévisible : désinhibition, vomissements, sédation ou agitation peuvent se combiner. Les cannabinoïdes de synthèse sont beaucoup plus variables que le cannabis naturel."
    },
    "alcool-cathinones": {
            "category": "unsafe",
            "note": "L’alcool peut masquer la stimulation et favoriser les redoses, la déshydratation, l’impulsivité et les prises de risque, notamment en contexte sexuel ou festif."
    },
    "alcool-fentanyl_nitazenes": {
            "category": "deadly",
            "note": "DANGER DE MORT. Les opioïdes très puissants additionnés à un dépresseur exposent à coma, vomissements, arrêt respiratoire et décès. Naloxone et appel 15/112 en cas de doute."
    },
    "alcool-methamphetamine": {
            "category": "unsafe",
            "note": "La stimulation peut masquer l’ivresse et pousser à boire davantage. Déshydratation, impulsivité, agressivité, surchauffe et charge cardiovasculaire augmentent nettement."
    },
    "alcool-poppers": {
            "category": "caution",
            "note": "Alcool et poppers peuvent majorer vertiges, chute de tension, désinhibition et prises de risque, notamment en contexte sexuel."
    },
    "alcool-protoxyde_azote": {
            "category": "dangerous",
            "note": "Baisse de vigilance, vertiges, sédation ou dissociation peuvent se cumuler. Risque de chute, vomissements, asphyxie ou retard à appeler les secours."
    },
    "alcool-tramadol": {
            "category": "deadly",
            "note": "DANGER DE MORT. L’alcool additionne la sédation opioïde et augmente vomissements, black-out, respiration lente et perte de conscience."
    },
    "amphetamine-cannabis_synthese": {
            "category": "dangerous",
            "note": "Les cannabinoïdes de synthèse peuvent déjà provoquer tachycardie, hypertension, panique ou convulsions. Les stimulants augmentent fortement la charge cardiovasculaire et l’imprévisibilité."
    },
    "amphetamine-cathinones": {
            "category": "dangerous",
            "note": "Addition stimulante : rythme cardiaque, tension, température, anxiété, paranoïa et craving peuvent augmenter fortement."
    },
    "amphetamine-fentanyl_nitazenes": {
            "category": "deadly",
            "note": "Combinaison stimulant-opioïde très dangereuse : le stimulant peut masquer la sédation, puis la respiration peut s’arrêter lorsque l’effet stimulant baisse."
    },
    "amphetamine-methamphetamine": {
            "category": "dangerous",
            "note": "Addition de deux amphétaminiques : tachycardie, hypertension, hyperthermie, agitation, insomnie prolongée et paranoïa peuvent devenir sévères."
    },
    "amphetamine-poppers": {
            "category": "unsafe",
            "note": "Vasodilatation et stimulation peuvent provoquer palpitations, malaise, tension instable, anxiété et surcharge cardiovasculaire."
    },
    "amphetamine-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde ajoute vertiges et manque d’oxygène potentiel à une stimulation cardiovasculaire. Risque de malaise, chute ou anxiété."
    },
    "amphetamine-tramadol": {
            "category": "dangerous",
            "note": "Le tramadol abaisse le seuil convulsif et possède une activité sérotoninergique. Avec un stimulant, risque de convulsions, agitation, hyperthermie et toxicité cardiovasculaire."
    },
    "benzodiazepines-cafeine": {
            "category": "caution",
            "note": "Mélange antagoniste : la caféine masque la sédation, les benzodiazépines masquent la stimulation. Redoses et mauvais jugement deviennent plus probables."
    },
    "benzodiazepines-cannabis_synthese": {
            "category": "unsafe",
            "note": "La sédation ou la confusion peut masquer des signaux d’intoxication. Avec un produit aussi imprévisible, le mélange doit être évité et surveillé comme potentiellement grave."
    },
    "benzodiazepines-cathinones": {
            "category": "caution",
            "note": "Les benzodiazépines peuvent masquer la stimulation mais ajoutent amnésie et sédation. Risque de redoses mal évaluées et dépendance croisée."
    },
    "benzodiazepines-fentanyl_nitazenes": {
            "category": "deadly",
            "note": "DANGER DE MORT. Les opioïdes très puissants additionnés à un dépresseur exposent à coma, vomissements, arrêt respiratoire et décès. Naloxone et appel 15/112 en cas de doute."
    },
    "benzodiazepines-methamphetamine": {
            "category": "caution",
            "note": "Les benzodiazépines peuvent masquer la stimulation sans supprimer la charge cardiovasculaire. Risque d’amnésie, redoses mal évaluées et dépendance croisée."
    },
    "benzodiazepines-poppers": {
            "category": "unsafe",
            "note": "Chute de tension, sédation ou dissociation peuvent se combiner. Risque de malaise, chute, confusion et retard à reconnaître une urgence."
    },
    "benzodiazepines-protoxyde_azote": {
            "category": "dangerous",
            "note": "Baisse de vigilance, vertiges, sédation ou dissociation peuvent se cumuler. Risque de chute, vomissements, asphyxie ou retard à appeler les secours."
    },
    "benzodiazepines-tramadol": {
            "category": "deadly",
            "note": "DANGER DE MORT. Addition de dépresseurs/opioïdes : sédation, vomissements, coma et dépression respiratoire peuvent devenir mortels."
    },
    "cafeine-cannabis_synthese": {
            "category": "dangerous",
            "note": "Les cannabinoïdes de synthèse peuvent déjà provoquer tachycardie, hypertension, panique ou convulsions. Les stimulants augmentent fortement la charge cardiovasculaire et l’imprévisibilité."
    },
    "cafeine-cathinones": {
            "category": "dangerous",
            "note": "Addition stimulante : rythme cardiaque, tension, température, anxiété, paranoïa et craving peuvent augmenter fortement."
    },
    "cafeine-fentanyl_nitazenes": {
            "category": "caution",
            "note": "La caféine ne protège pas de la surdose opioïde et peut donner une fausse impression de vigilance. La respiration peut rester dangereusement ralentie."
    },
    "cafeine-ghb": {
            "category": "caution",
            "note": "La caféine peut masquer partiellement la somnolence sans réduire le risque de perte de conscience au GHB/GBL."
    },
    "cafeine-mdma": {
            "category": "unsafe",
            "note": "La caféine peut augmenter tension, rythme cardiaque, anxiété, chaleur et insomnie sous MDMA. Elle n’améliore pas la réduction des risques."
    },
    "cafeine-methamphetamine": {
            "category": "unsafe",
            "note": "Addition stimulante : palpitations, tension, anxiété, tremblements et insomnie prolongée peuvent augmenter sans bénéfice de réduction des risques."
    },
    "cafeine-poppers": {
            "category": "unsafe",
            "note": "Vasodilatation et stimulation peuvent provoquer palpitations, malaise, tension instable, anxiété et surcharge cardiovasculaire."
    },
    "cafeine-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde ajoute vertiges et manque d’oxygène potentiel à une stimulation cardiovasculaire. Risque de malaise, chute ou anxiété."
    },
    "cafeine-tramadol": {
            "category": "dangerous",
            "note": "Le tramadol abaisse le seuil convulsif et possède une activité sérotoninergique. Avec un stimulant, risque de convulsions, agitation, hyperthermie et toxicité cardiovasculaire."
    },
    "cannabis-cannabis_synthese": {
            "category": "unsafe",
            "note": "Le cannabis naturel ne permet pas de prédire ni de stabiliser les cannabinoïdes de synthèse. Risque de panique, vomissements, tachycardie, confusion et redose mal évaluée."
    },
    "cannabis-cathinones": {
            "category": "caution",
            "note": "Le cannabis peut augmenter confusion, anxiété ou paranoïa pendant une stimulation cathinone, surtout en descente ou après manque de sommeil."
    },
    "cannabis-fentanyl_nitazenes": {
            "category": "caution",
            "note": "Le cannabis peut augmenter somnolence, confusion et nausées, mais ne protège pas de la dépression respiratoire opioïde."
    },
    "cannabis-methamphetamine": {
            "category": "caution",
            "note": "Le cannabis peut augmenter anxiété, paranoïa et confusion sous stimulation prolongée. Il peut aussi donner une fausse impression de détente sans réduire la charge cardiaque."
    },
    "cannabis-poppers": {
            "category": "caution",
            "note": "Le rush vasodilatateur peut majorer vertiges, anxiété corporelle, confusion ou malaise pendant une expérience déjà altérée."
    },
    "cannabis-protoxyde_azote": {
            "category": "caution",
            "note": "Vertiges, dissociation, anxiété et perte de coordination peuvent augmenter. Risque de chute ou de panique, surtout debout ou dans un lieu encombré."
    },
    "cannabis-tramadol": {
            "category": "caution",
            "note": "Somnolence, confusion, nausées et baisse de vigilance peuvent augmenter. Le cannabis peut aussi masquer des signaux d’intoxication."
    },
    "cannabis_synthese-cathinones": {
            "category": "dangerous",
            "note": "Les cannabinoïdes de synthèse peuvent déjà provoquer tachycardie, hypertension, panique ou convulsions. Les stimulants augmentent fortement la charge cardiovasculaire et l’imprévisibilité."
    },
    "cannabis_synthese-champignons": {
            "category": "dangerous",
            "note": "Mélange psychique très imprévisible : hallucinations, paranoïa, panique, confusion ou comportements dangereux peuvent être brutalement amplifiés."
    },
    "cannabis_synthese-cocaine": {
            "category": "dangerous",
            "note": "Les cannabinoïdes de synthèse peuvent déjà provoquer tachycardie, hypertension, panique ou convulsions. Les stimulants augmentent fortement la charge cardiovasculaire et l’imprévisibilité."
    },
    "cannabis_synthese-dmt": {
            "category": "dangerous",
            "note": "Mélange psychique très imprévisible : hallucinations, paranoïa, panique, confusion ou comportements dangereux peuvent être brutalement amplifiés."
    },
    "cannabis_synthese-fentanyl_nitazenes": {
            "category": "unsafe",
            "note": "La sédation ou la confusion peut masquer des signaux d’intoxication. Avec un produit aussi imprévisible, le mélange doit être évité et surveillé comme potentiellement grave."
    },
    "cannabis_synthese-ghb": {
            "category": "unsafe",
            "note": "La sédation ou la confusion peut masquer des signaux d’intoxication. Avec un produit aussi imprévisible, le mélange doit être évité et surveillé comme potentiellement grave."
    },
    "cannabis_synthese-ketamine": {
            "category": "dangerous",
            "note": "Dissociation et intoxication cannabinoïde imprévisible peuvent se renforcer : chute, panique, confusion, perte de repères et comportements dangereux sont plus probables."
    },
    "cannabis_synthese-lsd": {
            "category": "dangerous",
            "note": "Mélange psychique très imprévisible : hallucinations, paranoïa, panique, confusion ou comportements dangereux peuvent être brutalement amplifiés."
    },
    "cannabis_synthese-methamphetamine": {
            "category": "dangerous",
            "note": "Les cannabinoïdes de synthèse peuvent déjà provoquer tachycardie, hypertension, panique ou convulsions. Les stimulants augmentent fortement la charge cardiovasculaire et l’imprévisibilité."
    },
    "cannabis_synthese-opioides": {
            "category": "unsafe",
            "note": "La sédation ou la confusion peut masquer des signaux d’intoxication. Avec un produit aussi imprévisible, le mélange doit être évité et surveillé comme potentiellement grave."
    },
    "cathinones-champignons": {
            "category": "unsafe",
            "note": "La stimulation peut rendre le psychédélique plus anxieux, confus et physiquement éprouvant. Risque de panique, insomnie et décisions impulsives."
    },
    "cathinones-cocaine": {
            "category": "dangerous",
            "note": "Addition stimulante : rythme cardiaque, tension, température, anxiété, paranoïa et craving peuvent augmenter fortement."
    },
    "cathinones-dmt": {
            "category": "unsafe",
            "note": "La stimulation peut rendre le psychédélique plus anxieux, confus et physiquement éprouvant. Risque de panique, insomnie et décisions impulsives."
    },
    "cathinones-fentanyl_nitazenes": {
            "category": "deadly",
            "note": "Combinaison stimulant-opioïde très dangereuse : le stimulant peut masquer la sédation, puis la respiration peut s’arrêter lorsque l’effet stimulant baisse."
    },
    "cathinones-ghb": {
            "category": "dangerous",
            "note": "La stimulation peut masquer le GHB/GBL et encourager une redose dangereuse. Lorsque l’effet stimulant baisse, coma ou perte de conscience peuvent survenir brutalement."
    },
    "cathinones-ketamine": {
            "category": "unsafe",
            "note": "Le dissociatif peut masquer la stimulation et inversement. Risques de chutes, confusion, redoses et perte de repères de session."
    },
    "cathinones-lsd": {
            "category": "unsafe",
            "note": "La stimulation peut rendre le psychédélique plus anxieux, confus et physiquement éprouvant. Risque de panique, insomnie et décisions impulsives."
    },
    "cathinones-mdma": {
            "category": "dangerous",
            "note": "Risque sérotoninergique et stimulant accru : hyperthermie, convulsions, tachycardie, anxiété sévère et descente difficile deviennent plus probables."
    },
    "cathinones-methamphetamine": {
            "category": "dangerous",
            "note": "Addition stimulante : rythme cardiaque, tension, température, anxiété, paranoïa et craving peuvent augmenter fortement."
    },
    "cathinones-opioides": {
            "category": "dangerous",
            "note": "Le stimulant peut masquer une sédation opioïde, puis la respiration peut ralentir lorsque la stimulation baisse. Risque d’overdose retardée et charge cardiaque élevée."
    },
    "cathinones-poppers": {
            "category": "unsafe",
            "note": "Vasodilatation et stimulation peuvent provoquer palpitations, malaise, tension instable, anxiété et surcharge cardiovasculaire."
    },
    "cathinones-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde ajoute vertiges et manque d’oxygène potentiel à une stimulation cardiovasculaire. Risque de malaise, chute ou anxiété."
    },
    "cathinones-tramadol": {
            "category": "dangerous",
            "note": "Le tramadol abaisse le seuil convulsif et possède une activité sérotoninergique. Avec un stimulant, risque de convulsions, agitation, hyperthermie et toxicité cardiovasculaire."
    },
    "champignons-fentanyl_nitazenes": {
            "category": "dangerous",
            "note": "Un opioïde très puissant peut provoquer somnolence, nausées et respiration lente pendant une expérience déjà confuse. Risque d’urgence difficile à reconnaître."
    },
    "champignons-methamphetamine": {
            "category": "unsafe",
            "note": "La stimulation longue peut rendre l’expérience psychédélique plus anxieuse, insomniaque et paranoïde. Charge cardiovasculaire et comportements impulsifs augmentent."
    },
    "champignons-poppers": {
            "category": "caution",
            "note": "Le rush vasodilatateur peut majorer vertiges, anxiété corporelle, confusion ou malaise pendant une expérience déjà altérée."
    },
    "champignons-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde peut intensifier brièvement la dissociation et la confusion psychédélique. Risque de chute, panique ou perte de repères."
    },
    "champignons-tramadol": {
            "category": "caution",
            "note": "Le tramadol peut ajouter nausées, confusion, baisse du seuil convulsif et interactions sérotoninergiques. Mélange imprévisible, surtout avec autres médicaments."
    },
    "cocaine-fentanyl_nitazenes": {
            "category": "deadly",
            "note": "Combinaison stimulant-opioïde très dangereuse : le stimulant peut masquer la sédation, puis la respiration peut s’arrêter lorsque l’effet stimulant baisse."
    },
    "cocaine-methamphetamine": {
            "category": "dangerous",
            "note": "Double stimulation cardiovasculaire majeure : vasoconstriction, douleur thoracique, AVC, crise cardiaque, paranoïa et agitation sont des risques importants."
    },
    "cocaine-poppers": {
            "category": "unsafe",
            "note": "Vasodilatation et stimulation peuvent provoquer palpitations, malaise, tension instable, anxiété et surcharge cardiovasculaire."
    },
    "cocaine-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde ajoute vertiges et manque d’oxygène potentiel à une stimulation cardiovasculaire. Risque de malaise, chute ou anxiété."
    },
    "cocaine-tramadol": {
            "category": "dangerous",
            "note": "Le tramadol abaisse le seuil convulsif et possède une activité sérotoninergique. Avec un stimulant, risque de convulsions, agitation, hyperthermie et toxicité cardiovasculaire."
    },
    "dmt-fentanyl_nitazenes": {
            "category": "dangerous",
            "note": "Un opioïde très puissant peut provoquer somnolence, nausées et respiration lente pendant une expérience déjà confuse. Risque d’urgence difficile à reconnaître."
    },
    "dmt-methamphetamine": {
            "category": "unsafe",
            "note": "La stimulation longue peut rendre l’expérience psychédélique plus anxieuse, insomniaque et paranoïde. Charge cardiovasculaire et comportements impulsifs augmentent."
    },
    "dmt-poppers": {
            "category": "caution",
            "note": "Le rush vasodilatateur peut majorer vertiges, anxiété corporelle, confusion ou malaise pendant une expérience déjà altérée."
    },
    "dmt-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde peut intensifier brièvement la dissociation et la confusion psychédélique. Risque de chute, panique ou perte de repères."
    },
    "dmt-tramadol": {
            "category": "caution",
            "note": "Le tramadol peut ajouter nausées, confusion, baisse du seuil convulsif et interactions sérotoninergiques. Mélange imprévisible, surtout avec autres médicaments."
    },
    "fentanyl_nitazenes-ghb": {
            "category": "deadly",
            "note": "DANGER DE MORT. Les opioïdes très puissants additionnés à un dépresseur exposent à coma, vomissements, arrêt respiratoire et décès. Naloxone et appel 15/112 en cas de doute."
    },
    "fentanyl_nitazenes-ketamine": {
            "category": "deadly",
            "note": "DANGER DE MORT. Les opioïdes très puissants additionnés à un dépresseur exposent à coma, vomissements, arrêt respiratoire et décès. Naloxone et appel 15/112 en cas de doute."
    },
    "fentanyl_nitazenes-lsd": {
            "category": "dangerous",
            "note": "Un opioïde très puissant peut provoquer somnolence, nausées et respiration lente pendant une expérience déjà confuse. Risque d’urgence difficile à reconnaître."
    },
    "fentanyl_nitazenes-mdma": {
            "category": "deadly",
            "note": "Combinaison stimulant-opioïde très dangereuse : le stimulant peut masquer la sédation, puis la respiration peut s’arrêter lorsque l’effet stimulant baisse."
    },
    "fentanyl_nitazenes-methamphetamine": {
            "category": "deadly",
            "note": "Combinaison stimulant-opioïde très dangereuse : le stimulant peut masquer la sédation, puis la respiration peut s’arrêter lorsque l’effet stimulant baisse."
    },
    "fentanyl_nitazenes-opioides": {
            "category": "deadly",
            "note": "DANGER DE MORT. Les opioïdes très puissants additionnés à un dépresseur exposent à coma, vomissements, arrêt respiratoire et décès. Naloxone et appel 15/112 en cas de doute."
    },
    "fentanyl_nitazenes-poppers": {
            "category": "unsafe",
            "note": "Chute de tension, sédation ou dissociation peuvent se combiner. Risque de malaise, chute, confusion et retard à reconnaître une urgence."
    },
    "fentanyl_nitazenes-protoxyde_azote": {
            "category": "dangerous",
            "note": "Baisse de vigilance, vertiges, sédation ou dissociation peuvent se cumuler. Risque de chute, vomissements, asphyxie ou retard à appeler les secours."
    },
    "fentanyl_nitazenes-tramadol": {
            "category": "deadly",
            "note": "DANGER DE MORT. Les opioïdes très puissants additionnés à un dépresseur exposent à coma, vomissements, arrêt respiratoire et décès. Naloxone et appel 15/112 en cas de doute."
    },
    "ghb-methamphetamine": {
            "category": "dangerous",
            "note": "La méthamphétamine peut masquer la sédation du GHB/GBL et encourager les redoses. Quand la stimulation baisse, perte de conscience ou coma peuvent apparaître brutalement."
    },
    "ghb-poppers": {
            "category": "unsafe",
            "note": "Chute de tension, sédation ou dissociation peuvent se combiner. Risque de malaise, chute, confusion et retard à reconnaître une urgence."
    },
    "ghb-protoxyde_azote": {
            "category": "dangerous",
            "note": "Baisse de vigilance, vertiges, sédation ou dissociation peuvent se cumuler. Risque de chute, vomissements, asphyxie ou retard à appeler les secours."
    },
    "ghb-tramadol": {
            "category": "deadly",
            "note": "DANGER DE MORT. Addition de dépresseurs/opioïdes : sédation, vomissements, coma et dépression respiratoire peuvent devenir mortels."
    },
    "ketamine-methamphetamine": {
            "category": "unsafe",
            "note": "Stimulation cardiovasculaire et dissociation se masquent mutuellement : risque de chutes, confusion, redoses et fausse impression de contrôle."
    },
    "ketamine-poppers": {
            "category": "unsafe",
            "note": "Chute de tension, sédation ou dissociation peuvent se combiner. Risque de malaise, chute, confusion et retard à reconnaître une urgence."
    },
    "ketamine-protoxyde_azote": {
            "category": "dangerous",
            "note": "Baisse de vigilance, vertiges, sédation ou dissociation peuvent se cumuler. Risque de chute, vomissements, asphyxie ou retard à appeler les secours."
    },
    "ketamine-tramadol": {
            "category": "deadly",
            "note": "DANGER DE MORT. Addition de dépresseurs/opioïdes : sédation, vomissements, coma et dépression respiratoire peuvent devenir mortels."
    },
    "lsd-methamphetamine": {
            "category": "unsafe",
            "note": "La stimulation longue peut rendre l’expérience psychédélique plus anxieuse, insomniaque et paranoïde. Charge cardiovasculaire et comportements impulsifs augmentent."
    },
    "lsd-poppers": {
            "category": "caution",
            "note": "Le rush vasodilatateur peut majorer vertiges, anxiété corporelle, confusion ou malaise pendant une expérience déjà altérée."
    },
    "lsd-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde peut intensifier brièvement la dissociation et la confusion psychédélique. Risque de chute, panique ou perte de repères."
    },
    "lsd-tramadol": {
            "category": "caution",
            "note": "Le tramadol peut ajouter nausées, confusion, baisse du seuil convulsif et interactions sérotoninergiques. Mélange imprévisible, surtout avec autres médicaments."
    },
    "mdma-methamphetamine": {
            "category": "dangerous",
            "note": "Double stimulation avec composante sérotoninergique : hyperthermie, déshydratation, tachycardie, anxiété, confusion et syndrome sérotoninergique deviennent plus probables."
    },
    "mdma-poppers": {
            "category": "unsafe",
            "note": "Vasodilatation et stimulation peuvent provoquer palpitations, malaise, tension instable, anxiété et surcharge cardiovasculaire."
    },
    "mdma-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde ajoute vertiges et manque d’oxygène potentiel à une stimulation cardiovasculaire. Risque de malaise, chute ou anxiété."
    },
    "mdma-tramadol": {
            "category": "dangerous",
            "note": "Association à éviter : le tramadol augmente le risque de convulsions et de syndrome sérotoninergique avec la MDMA."
    },
    "methamphetamine-opioides": {
            "category": "deadly",
            "note": "Association stimulant-opioïde très dangereuse : la stimulation masque la sédation, puis l’opioïde peut provoquer une surdose respiratoire lorsque le stimulant baisse."
    },
    "methamphetamine-poppers": {
            "category": "unsafe",
            "note": "Vasodilatation et stimulation peuvent provoquer palpitations, malaise, tension instable, anxiété et surcharge cardiovasculaire."
    },
    "methamphetamine-protoxyde_azote": {
            "category": "caution",
            "note": "Le protoxyde ajoute vertiges et manque d’oxygène potentiel à une stimulation cardiovasculaire. Risque de malaise, chute ou anxiété."
    },
    "methamphetamine-tramadol": {
            "category": "dangerous",
            "note": "Le tramadol abaisse le seuil convulsif et possède une activité sérotoninergique. Avec un stimulant, risque de convulsions, agitation, hyperthermie et toxicité cardiovasculaire."
    },
    "opioides-poppers": {
            "category": "unsafe",
            "note": "Chute de tension, sédation ou dissociation peuvent se combiner. Risque de malaise, chute, confusion et retard à reconnaître une urgence."
    },
    "opioides-protoxyde_azote": {
            "category": "dangerous",
            "note": "Baisse de vigilance, vertiges, sédation ou dissociation peuvent se cumuler. Risque de chute, vomissements, asphyxie ou retard à appeler les secours."
    },
    "opioides-tramadol": {
            "category": "deadly",
            "note": "DANGER DE MORT. Addition de dépresseurs/opioïdes : sédation, vomissements, coma et dépression respiratoire peuvent devenir mortels."
    },
    "poppers-protoxyde_azote": {
            "category": "unsafe",
            "note": "Deux effets très brefs mais déstabilisants : vertiges, hypotension, manque d’oxygène et chute deviennent plus probables."
    }

};
