/*
 * substances-data.js - Données détaillées du répertoire élargi de Seuil.
 *
 * Pour chaque entrée condensée de index-substances.js, ce fichier fournit des
 * repères de réduction des risques : paliers de dose (fourchettes publiques et
 * convergentes, indicatives et NON prescriptives), durées des phases, profil et
 * conseils ciblés.
 *
 * Avertissement : ces fourchettes sont des repères de réduction des risques, pas
 * des recommandations. La pureté réelle, la tolérance, le poids, les médicaments
 * et le contexte changent tout. Pour les opioïdes et dépresseurs, les paliers
 * supposent une personne SANS tolérance : une tolérance modifie radicalement ces
 * valeurs. En cas de doute, considérer la dose comme inconnue.
 *
 * Exposé en global SEUIL_RICH ; consommé par index-substances.js.
 */
(function () {
    "use strict";

    // Raccourcis de construction (réduisent le risque d'erreur de saisie).
    function dz(unit, t, l, c, s, h) {
        return { unit: unit, threshold: t, light: l, common: c, strong: s, heavy: h };
    }
    function dr(on, cu, pk, of, tot) {
        return { onset: on, comeup: cu, peak: pk, offset: of, total: tot };
    }
    function ds(on, cu, pk, of, tot) {
        return { onset: on, comeup: cu, peak: pk, offset: of, total: tot };
    }

    var RICH = {

        // ============================================================
        // PSYCHÉDÉLIQUES - Lysergamides
        // ============================================================
        "ald_52": {
            dosages: dz("µg", "10 µg", "25 - 75 µg", "75 - 150 µg", "150 - 300 µg", "300 µg +"),
            durations: dr("20 - 60 min", "1 - 2 h", "3 - 6 h", "3 - 5 h", "8 - 14 h"),
            durations_seconds: ds(2400, 5400, 16200, 14400, 39600),
            profile: "Profil subjectif quasi identique au LSD. Le dosage réel d'un buvard est presque toujours incertain : c'est le principal facteur de surprise.",
            rdr_rules: ["Traiter un buvard comme un dosage inconnu : commencer bas, ne jamais redoser avant la fin complète de la montée.", "Cadre rassurant, personne sobre, jamais seul.", "Pas de lithium ni d'IMAO : risque de crise."]
        },
        "al_lad": {
            dosages: dz("µg", "5 µg", "20 - 50 µg", "50 - 100 µg", "100 - 150 µg", "150 µg +"),
            durations: dr("20 - 40 min", "30 - 60 min", "2 - 4 h", "1 - 3 h", "5 - 8 h"),
            durations_seconds: ds(1800, 2700, 10800, 7200, 23400),
            profile: "Souvent décrit comme plus visuel, plus court et moins anxiogène que le LSD, mais reste très sensible à la quantité sur buvard.",
            rdr_rules: ["Commencer bas même si la réputation est « douce ».", "Attendre la montée complète avant toute redose.", "Éviter lithium et IMAO."]
        },
        "eth_lad": {
            dosages: dz("µg", "5 µg", "10 - 30 µg", "30 - 75 µg", "75 - 150 µg", "150 µg +"),
            durations: dr("20 - 60 min", "1 - 2 h", "3 - 5 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(2400, 5400, 14400, 10800, 28800),
            profile: "Puissant et chargé émotionnellement, parfois plus physique que le LSD. De très petites variations de dose changent nettement l'expérience.",
            rdr_rules: ["Doses faibles : l'écart entre confortable et débordant est étroit.", "Montée parfois physique : prévoir un cadre calme.", "Pas de lithium ni d'IMAO."]
        },
        "1cp_lsd": {
            dosages: dz("µg", "10 µg", "25 - 75 µg", "75 - 150 µg", "150 - 300 µg", "300 µg +"),
            durations: dr("30 - 60 min", "1 - 2 h", "4 - 6 h", "2 - 4 h", "9 - 13 h"),
            durations_seconds: ds(2700, 5400, 18000, 10800, 39600),
            profile: "Promédicament très proche du 1P-LSD et du LSD. Montée parfois un peu plus lente : ne pas conclure trop vite à un buvard faible.",
            rdr_rules: ["Patienter : la montée peut être lente, ne pas redoser par impatience.", "Cadre sécurisé, personne sobre.", "Éviter lithium et IMAO."]
        },
        "lsa": {
            dosages: dz("graines", "1 - 2 graines", "2 - 4 graines", "4 - 8 graines", "8 - 12 graines", "12 graines +"),
            durations: dr("30 - 90 min", "1 - 2 h", "3 - 5 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(3600, 5400, 14400, 10800, 28800),
            profile: "Lysergamide naturel (graines de rose hawaïenne / liseron) : effets plus corporels et sédatifs que le LSD, nausées marquées. La teneur varie d'une graine à l'autre.",
            forms: ["graines (rose hawaïenne, liseron)", "extrait aqueux"],
            risk_factors: ["Teneur très variable selon les graines et le lot.", "Enrobage chimique de certaines graines du commerce (horticulture).", "Nausées et vasoconstriction marquées."],
            rdr_rules: ["Repères en nombre de graines, jamais précis : commencer bas.", "Privilégier des graines non traitées (enrobages horticoles toxiques).", "Anticiper les nausées : estomac léger, environnement calme."]
        },
        "doc": {
            dosages: dz("mg", "0,5 mg", "0,75 - 1,5 mg", "1,5 - 3 mg", "3 - 5 mg", "5 mg +"),
            durations: dr("1 - 3 h", "2 - 4 h", "6 - 10 h", "4 - 8 h", "12 - 20 h"),
            durations_seconds: ds(7200, 10800, 28800, 21600, 57600),
            profile: "Amphétamine psychédélique très puissante au milligramme et extrêmement longue. La montée lente est un piège classique : redoser par impatience peut transformer la nuit en marathon ingérable.",
            risk_factors: ["Action très longue (12-20 h) sous-estimée.", "Montée lente propice aux redoses dangereuses.", "Vasoconstriction et charge cardiovasculaire prolongées."],
            rdr_rules: ["Ne JAMAIS redoser : la montée peut prendre 3 h.", "Peser au milligramme près (actif à faible quantité).", "Prévoir une journée entière libre et un cadre stable."]
        },
        "dob": {
            dosages: dz("mg", "0,2 mg", "0,5 - 1 mg", "1 - 2,5 mg", "2,5 - 4 mg", "4 mg +"),
            durations: dr("1 - 3 h", "2 - 3 h", "6 - 12 h", "4 - 8 h", "12 - 24 h"),
            durations_seconds: ds(7200, 9000, 32400, 21600, 64800),
            profile: "Amphétamine psychédélique parmi les plus puissantes au milligramme et les plus longues. Forte vasoconstriction ; les redoses par impatience sont une cause connue d'accidents.",
            risk_factors: ["Actif à très faible quantité : surdosage facile sans balance de précision.", "Vasoconstriction marquée (extrémités froides).", "Durée pouvant dépasser 24 h."],
            rdr_rules: ["Balance de précision au milligramme indispensable.", "Aucune redose : montée très lente.", "Surveiller les extrémités froides/douleurs : signes de vasoconstriction."]
        },
        "dom": {
            dosages: dz("mg", "0,5 mg", "1 - 2,5 mg", "2,5 - 5 mg", "5 - 7 mg", "7 mg +"),
            durations: dr("30 - 90 min", "1 - 2 h", "4 - 7 h", "3 - 5 h", "10 - 16 h"),
            durations_seconds: ds(3600, 5400, 19800, 14400, 46800),
            profile: "Amphétamine psychédélique (« STP ») puissante et très longue, à marge étroite. Historiquement liée à des accidents quand elle a été vendue surdosée.",
            rdr_rules: ["Commencer très bas, peser précisément.", "Aucune redose avant la fin de la montée (1-2 h).", "Prévoir une longue durée et un cadre stable."]
        },
        "doi": {
            dosages: dz("mg", "0,5 mg", "0,75 - 1,5 mg", "1,5 - 3 mg", "3 - 4 mg", "4 mg +"),
            durations: dr("2 - 4 h", "2 - 4 h", "8 - 14 h", "4 - 8 h", "16 - 30 h"),
            durations_seconds: ds(10800, 10800, 39600, 21600, 82800),
            profile: "Amphétamine psychédélique à durée extrême (jusqu'à plus de 24 h) et puissante au milligramme. La très longue durée épuise et favorise l'insomnie prolongée.",
            risk_factors: ["Durée extrême : insomnie et épuisement prolongés.", "Vasoconstriction.", "Montée lente propice au surdosage."],
            rdr_rules: ["Ne jamais redoser.", "Anticiper une nuit blanche et le lendemain.", "Balance de précision obligatoire."]
        },

        // ============================================================
        // PSYCHÉDÉLIQUES - Phénéthylamines 2C
        // ============================================================
        "2c_p": {
            dosages: dz("mg", "2 mg", "3 - 6 mg", "6 - 10 mg", "10 - 16 mg", "16 mg +"),
            durations: dr("1 - 2 h", "1 - 2 h", "4 - 7 h", "3 - 5 h", "10 - 16 h"),
            durations_seconds: ds(5400, 5400, 19800, 14400, 46800),
            profile: "Parmi les 2C les plus puissantes et les plus longues, à montée très lente. Le décalage onset/effet est la cause principale de surdosage par redose.",
            risk_factors: ["Montée très lente (jusqu'à 2-3 h) → redoses dangereuses.", "Marge étroite entre dose forte et dose accablante.", "Durée longue, charge physique."],
            rdr_rules: ["Régle d'or : aucune redose. Attendre 3 h avant de juger.", "Peser au milligramme.", "Cadre calme, personne sobre."]
        },
        "2c_d": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("30 - 60 min", "30 - 60 min", "2 - 4 h", "1 - 2 h", "4 - 8 h"),
            durations_seconds: ds(2700, 2700, 10800, 5400, 21600),
            profile: "2C plutôt doux et plus court, parfois utilisé à faible dose. Reste sensible à la quantité et capable d'effets marqués en haut de fourchette.",
            rdr_rules: ["Commencer bas malgré la réputation « légère ».", "Attendre la montée complète avant d'ajuster.", "Ne pas confondre avec un 2C plus puissant."]
        },
        "2c_t_7": {
            dosages: dz("mg", "5 mg", "10 - 15 mg", "15 - 30 mg", "30 - 40 mg", "40 mg +"),
            durations: dr("1 - 3 h", "1 - 2 h", "4 - 8 h", "2 - 4 h", "8 - 15 h"),
            durations_seconds: ds(7200, 5400, 21600, 10800, 41400),
            profile: "Phénéthylamine soufrée (famille 2C-T) à montée lente et longue. Des décès sont survenus lors d'insufflations à forte dose et d'associations avec des IMAO.",
            risk_factors: ["Danger MORTEL avec les IMAO (antidépresseurs, certaines plantes).", "Insufflation à forte dose associée à des décès.", "Montée lente → redoses dangereuses."],
            warning_signs: ["Hyperthermie, rigidité, agitation extrême (syndrome sérotoninergique).", "Douleur thoracique, malaise.", "Angoisse qui ne redescend pas."],
            rdr_rules: ["JAMAIS avec un IMAO. JAMAIS en insufflation.", "Voie orale, dose basse, aucune redose.", "Personne sobre présente."]
        },
        "2c_t_2": {
            dosages: dz("mg", "2 mg", "5 - 12 mg", "12 - 25 mg", "25 - 35 mg", "35 mg +"),
            durations: dr("45 - 90 min", "1 - 2 h", "3 - 6 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(4050, 5400, 16200, 10800, 28800),
            profile: "Phénéthylamine soufrée 2C-T, psychédélique et corporelle. Comme les autres 2C-T, potentiellement dangereuse avec les inhibiteurs de la MAO.",
            risk_factors: ["Danger avec les IMAO.", "Charge corporelle (nausées, tension).", "Marge étroite."],
            rdr_rules: ["Jamais avec un IMAO.", "Voie orale, commencer bas.", "Aucune redose avant la fin de la montée."]
        },
        "2c_b_fly": {
            dosages: dz("mg", "2 mg", "5 - 10 mg", "10 - 18 mg", "18 - 25 mg", "25 mg +"),
            durations: dr("45 - 75 min", "1 - 2 h", "4 - 6 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(3600, 5400, 18000, 10800, 28800),
            profile: "Phénéthylamine « FLY ». Elle a été confondue avec le Bromo-DragonFLY, bien plus puissant et toxique : la vérification d'identité est ici vitale.",
            risk_factors: ["Confusion possible avec le Bromo-DragonFLY (vasoconstriction sévère, nécroses, décès).", "Marge étroite.", "Vasoconstriction."],
            rdr_rules: ["Vérifier impérativement l'identité réelle (risque Bromo-DragonFLY).", "Peser précisément, commencer bas.", "Surveiller les extrémités froides/douloureuses."]
        },

        // ============================================================
        // PSYCHÉDÉLIQUES - Tryptamines
        // ============================================================
        "5_meo_dmt": {
            dosages: dz("mg", "1 mg", "2 - 5 mg", "5 - 10 mg", "10 - 15 mg", "15 mg +"),
            durations: dr("10 - 45 s", "1 - 2 min", "5 - 20 min", "10 - 30 min", "20 - 60 min"),
            durations_seconds: ds(30, 90, 900, 1200, 2400),
            profile: "Tryptamine fulgurante et extrêmement intense (crapaud du Colorado ou synthèse). L'expérience peut être totalement submergeante ; dangereuse avec les IMAO.",
            risk_factors: ["Intensité écrasante, perte de contrôle moteur totale.", "Danger avec les IMAO (incluant l'ayahuasca/harmala).", "Chutes, inhalation de vomi."],
            warning_signs: ["Détresse respiratoire, vomissements allongé.", "Hyperthermie, rigidité (syndrome sérotoninergique si IMAO).", "Agitation extrême."],
            rdr_rules: ["Toujours assis/allongé avec une personne sobre qui sécurise.", "Jamais avec un IMAO/harmala.", "Doses au milligramme : la marge est minuscule."]
        },
        "4_ho_met": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 30 mg", "30 - 45 mg", "45 mg +"),
            durations: dr("20 - 60 min", "30 - 60 min", "2 - 4 h", "1 - 2 h", "4 - 7 h"),
            durations_seconds: ds(2400, 2700, 10800, 5400, 19800),
            profile: "Tryptamine proche de la psilocine (« metocine »), souvent décrite comme visuelle et euphorisante. En poudre, l'auto-dosage est incertain.",
            rdr_rules: ["Peser précisément (poudre active à faible quantité).", "Attendre la montée complète avant toute redose.", "Cadre rassurant, personne sobre."]
        },
        "4_ho_mipt": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 35 mg", "35 - 50 mg", "50 mg +"),
            durations: dr("20 - 45 min", "30 - 60 min", "2 - 4 h", "1 - 2 h", "4 - 6 h"),
            durations_seconds: ds(1950, 2700, 10800, 5400, 18000),
            profile: "Tryptamine (« miprocine ») proche de la psilocine, plutôt corporelle et sociale, avec peu de visuels à dose modérée.",
            rdr_rules: ["Peser précisément.", "Commencer bas, attendre la montée.", "Cadre calme."]
        },
        "5_meo_mipt": {
            dosages: dz("mg", "2 mg", "4 - 8 mg", "8 - 15 mg", "15 - 20 mg", "20 mg +"),
            durations: dr("20 - 45 min", "30 - 60 min", "2 - 3 h", "1 - 2 h", "4 - 6 h"),
            durations_seconds: ds(1950, 2700, 9000, 5400, 18000),
            profile: "Tryptamine stimulante (« moxy ») à composante corporelle marquée, très sensible à la quantité. L'écart entre dose plaisante et inconfortable est faible.",
            rdr_rules: ["Doses faibles, balance de précision.", "Aucune redose avant la fin de la montée.", "Éviter d'associer à d'autres stimulants."]
        },
        "dpt": {
            dosages: dz("mg", "25 mg", "50 - 100 mg", "100 - 150 mg", "150 - 250 mg", "250 mg +"),
            durations: dr("15 - 45 min", "20 - 40 min", "1,5 - 3 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(1800, 1800, 8100, 5400, 14400),
            profile: "Tryptamine brève mais souvent intense et déroutante, au profil moins prévisible que la psilocybine. La montée peut être abrupte.",
            rdr_rules: ["Commencer bas : la montée peut être brutale.", "Cadre sécurisé, personne sobre.", "Pas d'IMAO."]
        },
        "dipt": {
            dosages: dz("mg", "15 mg", "25 - 50 mg", "50 - 100 mg", "100 - 150 mg", "150 mg +"),
            durations: dr("30 - 90 min", "30 - 60 min", "2 - 4 h", "2 - 4 h", "6 - 12 h"),
            durations_seconds: ds(3600, 2700, 10800, 10800, 32400),
            profile: "Tryptamine atypique surtout connue pour distordre l'audition (sons plus graves, décalés), avec peu d'effets visuels. Expérience déroutante plutôt qu'« euphorique ».",
            rdr_rules: ["Commencer bas : effets auditifs déstabilisants.", "Éviter les environnements bruyants.", "Pas d'IMAO."]
        },
        "ibogaine": {
            dosages: dz("mg", "100 mg", "200 - 400 mg", "400 - 800 mg", "8 - 12 mg/kg", "> 12 mg/kg"),
            durations: dr("30 - 90 min", "1 - 3 h", "4 - 8 h", "12 - 24 h", "24 - 48 h"),
            durations_seconds: ds(3600, 7200, 21600, 64800, 129600),
            profile: "Alcaloïde de l'iboga aux effets oniriques très longs. CARDIOTOXIQUE : elle allonge le QT et a causé des arrêts cardiaques. C'est l'un des psychédéliques les plus dangereux physiquement.",
            forms: ["écorce de racine", "extrait (HCl, TA)"],
            risk_factors: ["Cardiotoxicité réelle : allongement du QT, troubles du rythme, décès rapportés.", "Interactions cardiaques et médicamenteuses nombreuses.", "Durée extrême avec immobilisation."],
            warning_signs: ["Palpitations, malaise, douleur thoracique, syncope.", "Vomissements avec déshydratation.", "Confusion sévère."],
            rdr_rules: ["Ne jamais prendre sans bilan cardiaque (ECG) et surveillance médicale.", "Aucune association cardiaque/sérotoninergique.", "Pas un usage récréatif : risque vital documenté."]
        },

        // ============================================================
        // PSYCHÉDÉLIQUES - NBOMe (très dangereux)
        // ============================================================
        "nbome_25i": {
            dosages: dz("µg", "50 µg", "100 - 250 µg", "250 - 800 µg", "800 - 1200 µg", "1200 µg +"),
            durations: dr("15 - 90 min", "30 - 60 min", "3 - 6 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(3150, 2700, 16200, 10800, 28800),
            profile: "Psychédélique de synthèse extrêmement puissant, actif par voie buccale (jamais avalé), très souvent vendu à tort comme du LSD. Marge de sécurité faible : cause connue d'accidents graves et de décès.",
            forms: ["buvard (souvent vendu comme LSD)", "poudre"],
            risk_factors: ["Confusion fréquente avec le LSD : un buvard « LSD » amer peut être un NBOMe.", "Vasoconstriction sévère, convulsions, hyperthermie.", "Marge étroite : surdosage rapide."],
            warning_signs: ["Convulsions, hyperthermie, agitation extrême.", "Douleur thoracique, extrémités froides (vasoconstriction).", "Confusion sévère, malaise."],
            rdr_rules: ["Un buvard au goût amer/métallique n'est PAS du LSD : ne pas consommer.", "Aucune redose : surdosage et convulsions rapides.", "En cas de convulsions/hyperthermie : 15 ou 112 immédiatement."]
        },
        "nbome_25c": {
            dosages: dz("µg", "50 µg", "100 - 250 µg", "250 - 700 µg", "700 - 1000 µg", "1000 µg +"),
            durations: dr("15 - 90 min", "30 - 60 min", "3 - 6 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(3150, 2700, 16200, 10800, 28800),
            profile: "NBOMe puissant actif sur buvard, souvent confondu avec le LSD. Même profil de toxicité que le 25I : vasoconstriction, convulsions, hyperthermie.",
            forms: ["buvard (souvent vendu comme LSD)", "poudre"],
            risk_factors: ["Confusion avec le LSD.", "Vasoconstriction, convulsions, hyperthermie.", "Marge étroite."],
            warning_signs: ["Convulsions, hyperthermie.", "Douleur thoracique, extrémités froides.", "Agitation/confusion sévère."],
            rdr_rules: ["Goût amer = ce n'est pas du LSD.", "Aucune redose.", "Urgence en cas de convulsions/hyperthermie."]
        },
        "nbome_25b": {
            dosages: dz("µg", "50 µg", "100 - 250 µg", "250 - 600 µg", "600 - 900 µg", "900 µg +"),
            durations: dr("15 - 90 min", "30 - 60 min", "3 - 6 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(3150, 2700, 16200, 10800, 28800),
            profile: "NBOMe psychédélique puissant et potentiellement toxique, fréquemment confondu avec du LSD sur buvard. Même prudence extrême que les autres NBOMe.",
            forms: ["buvard (souvent vendu comme LSD)", "poudre"],
            risk_factors: ["Confusion avec le LSD.", "Vasoconstriction, convulsions.", "Marge étroite."],
            warning_signs: ["Convulsions, hyperthermie.", "Douleur thoracique.", "Confusion sévère."],
            rdr_rules: ["Goût amer = pas du LSD.", "Aucune redose.", "Urgence si convulsions/hyperthermie."]
        },

        // ============================================================
        // DISSOCIATIFS
        // ============================================================
        "mxe": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("20 - 90 min", "30 - 60 min", "1 - 3 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(3300, 2700, 7200, 5400, 14400),
            profile: "Dissociatif apparenté à la kétamine mais plus long et plus difficile à doser, avec une montée retardée. Les surdoses dissociatives (« trou ») et pertes de repères sont fréquentes.",
            risk_factors: ["Montée retardée → redoses dangereuses.", "Plus long et plus puissant que la kétamine.", "Atteintes urinaires et de coordination."],
            warning_signs: ["Immobilisation, vomissements allongé, difficulté à respirer.", "Tachycardie, hypertension.", "Confusion qui ne redescend pas."],
            rdr_rules: ["Attendre longtemps avant toute redose (montée tardive).", "Assis/allongé en sécurité, jamais en hauteur ou près de l'eau.", "Pas d'alcool ni d'opioïdes."]
        },
        "3_meo_pcp": {
            dosages: dz("mg", "2 mg", "5 - 10 mg", "10 - 15 mg", "15 - 25 mg", "25 mg +"),
            durations: dr("20 - 60 min", "30 - 90 min", "2 - 4 h", "2 - 4 h", "5 - 9 h"),
            durations_seconds: ds(2400, 3600, 10800, 10800, 25200),
            profile: "Dissociatif de la famille de la PCP, puissant et stimulant, à marge étroite. Les effets montent par paliers tardifs, ce qui favorise des redoses dangereuses et des états maniaques/psychotomimétiques.",
            risk_factors: ["Paliers tardifs → redoses très dangereuses.", "Stimulation, hypertension, états psychotiques.", "Marge étroite (actif à quelques mg)."],
            warning_signs: ["Agitation extrême, délire, paranoïa.", "Hypertension, douleur thoracique.", "Confusion durable."],
            rdr_rules: ["Peser au milligramme, dose basse.", "Aucune redose avant plusieurs heures.", "Éviter totalement en contexte social agité."]
        },
        "2_fdck": {
            dosages: dz("mg", "10 mg", "20 - 50 mg", "50 - 100 mg", "100 - 150 mg", "150 mg +"),
            durations: dr("10 - 30 min", "15 - 30 min", "45 - 90 min", "30 - 60 min", "1,5 - 3 h"),
            durations_seconds: ds(1200, 1350, 4050, 2700, 8100),
            profile: "Analogue fluoré de la kétamine, au profil voisin mais moins documenté. L'auto-dosage en poudre reste incertain.",
            risk_factors: ["Données limitées, pureté variable.", "Mêmes risques que la kétamine (chutes, atteintes urinaires).", "Redoses faciles car durée courte."],
            rdr_rules: ["Doser comme un dissociatif puissant : commencer bas.", "Assis/allongé en sécurité.", "Pas d'alcool ni d'opioïdes."]
        },
        "dck": {
            dosages: dz("mg", "5 mg", "15 - 40 mg", "40 - 80 mg", "80 - 120 mg", "120 mg +"),
            durations: dr("20 - 60 min", "30 - 60 min", "1,5 - 3 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(2400, 2700, 8100, 5400, 14400),
            profile: "Analogue de la kétamine plus puissant et plus long, avec un risque accru de « trou » dissociatif et de surdosage.",
            risk_factors: ["Plus puissant et plus long que la kétamine.", "Trou dissociatif (immobilisation) plus probable.", "Atteintes urinaires possibles."],
            warning_signs: ["Immobilisation, vomissements allongé.", "Difficulté à respirer.", "Confusion durable."],
            rdr_rules: ["Doses plus basses que la kétamine.", "Assis/allongé, jamais seul.", "Pas de dépresseurs associés."]
        },
        "o_pce": {
            dosages: dz("mg", "2 mg", "5 - 15 mg", "15 - 30 mg", "30 - 45 mg", "45 mg +"),
            durations: dr("20 - 45 min", "30 - 60 min", "1,5 - 3 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(1950, 2700, 8100, 5400, 14400),
            profile: "Dissociatif de la famille PCP, puissant et stimulant, à montée par paliers propice aux redoses dangereuses.",
            risk_factors: ["Paliers tardifs → redoses dangereuses.", "Stimulation, hypertension.", "Marge étroite."],
            rdr_rules: ["Dose basse, balance de précision.", "Aucune redose avant la fin complète.", "Cadre calme, pas d'alcool."]
        },
        "3_ho_pcp": {
            dosages: dz("mg", "2 mg", "4 - 8 mg", "8 - 15 mg", "15 - 20 mg", "20 mg +"),
            durations: dr("20 - 60 min", "30 - 60 min", "2 - 4 h", "2 - 4 h", "5 - 9 h"),
            durations_seconds: ds(2400, 2700, 10800, 10800, 25200),
            profile: "Dissociatif de la famille PCP doté en plus d'une composante opioïde : il ajoute un risque de dépression respiratoire à ceux des dissociatifs.",
            risk_factors: ["Composante opioïde → dépression respiratoire.", "Marge étroite, paliers tardifs.", "Danger majeur avec d'autres dépresseurs."],
            warning_signs: ["Respiration lente ou irrégulière, lèvres bleutées.", "Somnolence profonde, impossible à réveiller.", "Immobilisation, vomissements allongé."],
            rdr_rules: ["Traiter aussi comme un opioïde : jamais avec alcool/benzo/opioïdes.", "Avoir de la naloxone à proximité si possible.", "Dose minuscule, aucune redose, personne sobre."]
        },
        "diphenidine": {
            dosages: dz("mg", "25 mg", "50 - 100 mg", "100 - 150 mg", "150 - 200 mg", "200 mg +"),
            durations: dr("30 - 90 min", "1 - 2 h", "2 - 4 h", "2 - 4 h", "5 - 9 h"),
            durations_seconds: ds(3600, 5400, 10800, 10800, 25200),
            profile: "Dissociatif long et puissant à marge étroite, dont les effets retardés favorisent les redoses dangereuses.",
            risk_factors: ["Montée lente et longue → redoses dangereuses.", "Marge étroite.", "Pertes de coordination, chutes."],
            rdr_rules: ["Patienter très longtemps avant tout ajustement.", "Assis/allongé en sécurité.", "Pas de dépresseurs associés."]
        },
        "mxp": {
            dosages: dz("mg", "20 mg", "40 - 70 mg", "70 - 110 mg", "110 - 150 mg", "150 mg +"),
            durations: dr("45 - 90 min", "1 - 2 h", "2 - 4 h", "2 - 4 h", "5 - 8 h"),
            durations_seconds: ds(4050, 5400, 10800, 10800, 23400),
            profile: "Dissociatif de type diarylethylamine, long et difficile à doser ; plusieurs intoxications ont été rapportées.",
            risk_factors: ["Montée lente → redoses dangereuses.", "Difficile à doser, intoxications signalées.", "Pertes de repères marquées."],
            rdr_rules: ["Commencer très bas, attendre longuement.", "Assis/allongé, personne sobre.", "Pas d'alcool ni d'opioïdes."]
        },
        "pcp": {
            dosages: dz("mg", "1 mg", "3 - 5 mg", "5 - 10 mg", "10 - 15 mg", "15 mg +"),
            durations: dr("5 - 30 min", "15 - 30 min", "1 - 3 h", "2 - 4 h", "4 - 8 h"),
            durations_seconds: ds(1050, 1350, 7200, 10800, 21600),
            profile: "Dissociatif puissant à la réputation imprévisible : désorientation, agitation et risques comportementaux marqués, surtout à forte quantité. Anesthésie dissociative pouvant masquer des blessures.",
            risk_factors: ["Agitation, agressivité, comportements dangereux.", "Anesthésie masquant les blessures.", "Hypertension, convulsions à forte dose."],
            warning_signs: ["Agitation extrême, délire, paranoïa.", "Convulsions, hyperthermie.", "Perte de connaissance, vomissements allongé."],
            rdr_rules: ["Dose minuscule, jamais en contexte conflictuel.", "Personne sobre indispensable.", "Pas de dépresseurs ni de stimulants associés."]
        },
        "salvia": {
            dosages: dz("extrait", "feuille brute", "extrait 5x", "extrait 10x", "extrait 20x", "extrait 40x +"),
            durations: dr("15 - 60 s", "30 - 60 s", "1 - 5 min", "5 - 15 min", "15 - 30 min"),
            durations_seconds: ds(40, 45, 180, 600, 1350),
            profile: "Plante dont la salvinorine A provoque des effets dissociatifs très intenses et brefs, souvent déroutants voire effrayants (perte totale de repères). À n'utiliser qu'assis, accompagné, en sécurité.",
            forms: ["feuilles séchées", "extraits concentrés (5x à 60x)"],
            risk_factors: ["Perte de contrôle moteur totale et brutale.", "Chutes, gestes dangereux pendant le pic.", "Vécu parfois très angoissant."],
            warning_signs: ["Déplacements incohérents (risque de chute/blessure).", "Panique intense.", "Désorientation prolongée."],
            rdr_rules: ["TOUJOURS assis/allongé avec une personne sobre qui retient.", "Loin des objets durs, escaliers, fenêtres.", "Une seule inhalation, attendre la fin avant toute autre."]
        },

        // ============================================================
        // STIMULANTS - Cathinones de synthèse
        // ============================================================
        "a_pvp": {
            dosages: dz("mg", "2 mg", "5 - 10 mg", "10 - 20 mg", "20 - 30 mg", "30 mg +"),
            durations: dr("10 - 30 min", "15 - 30 min", "1,5 - 3 h", "2 - 4 h", "4 - 7 h"),
            durations_seconds: ds(1200, 1350, 8100, 10800, 19800),
            profile: "Cathinone très puissante (« flakka »), fortement associée à l'usage compulsif, l'insomnie, l'agitation et des épisodes psychotiques. Active à très faible quantité.",
            risk_factors: ["Compulsion intense (redoses en rafale).", "Insomnie prolongée, psychose, hyperthermie.", "Actif à quelques mg : surdosage facile."],
            warning_signs: ["Agitation extrême, paranoïa, hallucinations.", "Hyperthermie, douleur thoracique.", "Idées délirantes persistantes."],
            rdr_rules: ["Fixer une dose et une limite AVANT, ranger le reste.", "Hydratation, fraîcheur, pauses imposées.", "Éviter totalement si seul ou fatigué."]
        },
        "a_php": {
            dosages: dz("mg", "3 mg", "5 - 15 mg", "15 - 25 mg", "25 - 40 mg", "40 mg +"),
            durations: dr("15 - 30 min", "15 - 30 min", "1,5 - 3 h", "2 - 4 h", "4 - 7 h"),
            durations_seconds: ds(1350, 1350, 8100, 10800, 19800),
            profile: "Cathinone stimulante de synthèse à fort potentiel compulsif et insomniant.",
            risk_factors: ["Compulsion et insomnie marquées.", "Anxiété, paranoïa à dose élevée.", "Surdosage facile (actif à faible quantité)."],
            rdr_rules: ["Doses faibles, limite fixée à l'avance.", "Éviter les rafales : épuisement rapide.", "Hydratation et pauses."]
        },
        "3_mmc": {
            dosages: dz("mg", "15 mg", "25 - 75 mg", "75 - 150 mg", "150 - 250 mg", "250 mg +"),
            durations: dr("15 - 45 min", "15 - 30 min", "1 - 2 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(1800, 1350, 5400, 5400, 14400),
            profile: "Cathinone proche de la méphédrone (« métaphédrone »), stimulante et empathogène, à durée courte qui pousse au re-dosage compulsif.",
            risk_factors: ["Durée courte → redoses compulsives.", "Descente marquée (anxiété, déprime).", "Charge cardiovasculaire en rafale."],
            rdr_rules: ["Espacer et plafonner les redoses (sinon spirale).", "Hydratation modérée, pauses.", "Surveiller le cœur et la tension."]
        },
        "4_mec": {
            dosages: dz("mg", "20 mg", "30 - 80 mg", "80 - 150 mg", "150 - 250 mg", "250 mg +"),
            durations: dr("15 - 45 min", "15 - 30 min", "1 - 2 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(1800, 1350, 5400, 5400, 14400),
            profile: "Cathinone apparentée à la méphédrone, avec descente marquée et envie de re-doser.",
            risk_factors: ["Redoses compulsives.", "Descente difficile.", "Charge cardiovasculaire."],
            rdr_rules: ["Plafonner les redoses.", "Hydratation, pauses.", "Éviter de mélanger aux autres stimulants."]
        },
        "3_cmc": {
            dosages: dz("mg", "20 mg", "30 - 80 mg", "80 - 150 mg", "150 - 220 mg", "220 mg +"),
            durations: dr("15 - 45 min", "15 - 30 min", "1 - 2 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(1800, 1350, 5400, 5400, 14400),
            profile: "Cathinone de diffusion récente (« clophédrone »), au profil proche des autres cathinones : compulsion, insomnie, anxiété.",
            risk_factors: ["Données limitées, pureté variable.", "Compulsion et insomnie.", "Charge cardiovasculaire."],
            rdr_rules: ["Commencer bas (produit peu documenté).", "Plafonner les redoses.", "Hydratation et pauses."]
        },
        "nep": {
            dosages: dz("mg", "5 mg", "10 - 25 mg", "25 - 50 mg", "50 - 80 mg", "80 mg +"),
            durations: dr("15 - 30 min", "15 - 30 min", "1 - 2 h", "1 - 3 h", "3 - 6 h"),
            durations_seconds: ds(1350, 1350, 5400, 7200, 16200),
            profile: "Cathinone stimulante puissante (N-éthylpentédrone), à fort potentiel d'usage compulsif.",
            risk_factors: ["Compulsion forte.", "Insomnie, anxiété.", "Surdosage facile (actif à faible quantité)."],
            rdr_rules: ["Doses faibles, limite fixée.", "Éviter les rafales.", "Hydratation, pauses, fraîcheur."]
        },
        "hexen": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("5 - 20 min", "10 - 20 min", "30 - 90 min", "1 - 2 h", "2 - 4 h"),
            durations_seconds: ds(750, 900, 3600, 5400, 10800),
            profile: "Cathinone (N-éthylhexédrone) de très courte durée, propice aux rafales et à l'épuisement rapide.",
            risk_factors: ["Durée très courte → rafales et épuisement.", "Insomnie, anxiété.", "Charge cardiovasculaire cumulée."],
            rdr_rules: ["Plafonner strictement les redoses (durée trompeuse).", "Hydratation, pauses imposées.", "Arrêter aux premiers signes cardiaques."]
        },
        "eutylone": {
            dosages: dz("mg", "20 mg", "50 - 100 mg", "100 - 200 mg", "200 - 300 mg", "300 mg +"),
            durations: dr("20 - 45 min", "30 - 60 min", "2 - 4 h", "2 - 4 h", "5 - 8 h"),
            durations_seconds: ds(1950, 2700, 10800, 10800, 23400),
            profile: "Cathinone fréquemment retrouvée comme adultérant vendu pour de la MDMA, avec insomnie et anxiété marquées et une durée plus longue.",
            risk_factors: ["Souvent vendue à tort comme MDMA.", "Insomnie sévère, anxiété.", "Charge cardiovasculaire prolongée."],
            rdr_rules: ["Tester son produit : une « MDMA » insomniante est suspecte.", "Plafonner les redoses.", "Hydratation, repos."]
        },

        "mdpv": {
            dosages: dz("mg", "2 mg", "5 - 10 mg", "10 - 15 mg", "15 - 25 mg", "25 mg +"),
            durations: dr("15 - 30 min", "15 - 30 min", "2 - 3 h", "2 - 4 h", "4 - 8 h"),
            durations_seconds: ds(1350, 1350, 9000, 10800, 21600),
            profile: "Cathinone très puissante et de longue durée, fortement associée à l'usage compulsif, à l'insomnie et à l'agitation. Active à de très faibles quantités : le surdosage est facile sans balance de précision.",
            risk_factors: ["Compulsion intense (redoses en rafale).", "Insomnie prolongée, psychose, hyperthermie.", "Actif à quelques mg : surdosage facile."],
            warning_signs: ["Agitation extrême, paranoïa, hallucinations.", "Hyperthermie, douleur thoracique, tachycardie.", "Idées délirantes persistantes."],
            rdr_rules: ["Fixer une dose et une limite AVANT, faire garder le reste.", "Hydratation, fraîcheur, pauses imposées.", "Éviter totalement si seul ou fatigué ; surveiller le cœur."]
        },

        // ============================================================
        // STIMULANTS - Amphétamines fluorées, eugéroïques, plantes
        // ============================================================
        "2_fma": {
            dosages: dz("mg", "10 mg", "20 - 40 mg", "40 - 75 mg", "75 - 110 mg", "110 mg +"),
            durations: dr("30 - 60 min", "30 - 60 min", "2 - 4 h", "2 - 4 h", "5 - 8 h"),
            durations_seconds: ds(2700, 2700, 10800, 10800, 23400),
            profile: "Amphétamine fluorée parfois recherchée pour des effets « fonctionnels » et discrets. Reste un stimulant avec charge cardiovasculaire et risque de redose.",
            rdr_rules: ["Ne pas se fier au côté « doux » : plafonner les doses.", "Hydratation, pauses.", "Surveiller cœur et tension."]
        },
        "4_fa": {
            dosages: dz("mg", "25 mg", "50 - 100 mg", "100 - 150 mg", "150 - 200 mg", "200 mg +"),
            durations: dr("30 - 90 min", "1 - 2 h", "2 - 4 h", "3 - 6 h", "6 - 10 h"),
            durations_seconds: ds(3600, 5400, 10800, 16200, 28800),
            profile: "Amphétamine fluorée à mi-chemin entre stimulant et empathogène. Associée à des maux de tête et à un risque cardiovasculaire/hémorragique signalé, notamment en haut de fourchette.",
            risk_factors: ["Signalements d'accidents hémorragiques/cardiaques à forte dose.", "Maux de tête fréquents.", "Tentation de redose en fin de plateau."],
            warning_signs: ["Mal de tête intense et brutal.", "Douleur thoracique, malaise.", "Hypertension marquée."],
            rdr_rules: ["Ne pas dépasser le palier commun : risque cardiovasculaire dose-dépendant.", "Stopper en cas de mal de tête intense.", "Hydratation, pas de mélange stimulant."]
        },
        "ethylphenidate": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("10 - 30 min", "15 - 30 min", "1 - 2 h", "1 - 3 h", "3 - 5 h"),
            durations_seconds: ds(1200, 1350, 5400, 7200, 14400),
            profile: "Stimulant proche du méthylphénidate, souvent insufflé, à fort potentiel compulsif et très irritant pour les muqueuses nasales.",
            risk_factors: ["Insufflation → lésions nasales, vasoconstriction.", "Compulsion forte.", "Charge cardiovasculaire."],
            rdr_rules: ["Éviter l'insufflation répétée (lésions, infections).", "Plafonner les redoses.", "Hydratation, matériel non partagé."]
        },
        "modafinil": {
            dosages: dz("mg", "50 mg", "100 mg", "100 - 200 mg", "200 - 400 mg", "400 mg +"),
            durations: dr("30 - 60 min", "1 - 2 h", "4 - 8 h", "4 - 8 h", "10 - 15 h"),
            durations_seconds: ds(2700, 5400, 21600, 21600, 45000),
            profile: "Promoteur d'éveil au stimulant discret mais à action très longue : l'insomnie est le principal effet indésirable. Interactions médicamenteuses notables (dont contraception orale).",
            forms: ["comprimé"],
            risk_factors: ["Insomnie prolongée si pris trop tard.", "Réduit l'efficacité de la contraception orale.", "Maux de tête, anxiété, interactions médicamenteuses."],
            rdr_rules: ["Prendre tôt dans la journée (demi-vie longue).", "Attention contraception orale : prévoir une protection complémentaire.", "Hydratation ; ne pas empiler avec d'autres stimulants."]
        },
        "nicotine": {
            dosages: dz("mg", "0,5 mg", "1 - 2 mg", "2 - 4 mg", "4 - 6 mg", "6 mg +"),
            durations: dr("10 - 60 s", "1 - 2 min", "5 - 10 min", "30 - 60 min", "30 - 120 min"),
            durations_seconds: ds(35, 90, 450, 2700, 5400),
            profile: "Stimulant du tabac et des e-liquides à très fort potentiel de dépendance. L'ingestion de liquide concentré (e-liquide) est une cause d'intoxication aiguë grave, surtout chez l'enfant.",
            forms: ["cigarette", "e-liquide", "sachets/gommes"],
            risk_factors: ["Dépendance très rapide.", "Ingestion d'e-liquide concentré : toxicité aiguë (parfois mortelle).", "Effets cardiovasculaires."],
            warning_signs: ["Nausées, vomissements, sueurs, vertiges (surdose).", "Palpitations, malaise.", "Chez l'enfant : urgence absolue après ingestion."],
            rdr_rules: ["Conserver les e-liquides hors de portée des enfants (toxicité aiguë).", "Ne pas avaler les liquides ni cumuler les sources.", "En cas d'ingestion accidentelle : 15 ou centre antipoison."]
        },
        "ephedrine": {
            dosages: dz("mg", "10 mg", "15 - 30 mg", "30 - 50 mg", "50 - 75 mg", "75 mg +"),
            durations: dr("30 - 60 min", "30 min", "1 - 3 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(2700, 1800, 7200, 5400, 14400),
            profile: "Sympathomimétique (décongestionnant, parfois utilisé comme dopant) à forte charge cardiovasculaire et tensionnelle. Risqué à l'effort et en mélange avec d'autres stimulants.",
            forms: ["comprimé", "sirop/décongestionnant"],
            risk_factors: ["Hypertension, troubles du rythme.", "Danger à l'effort physique intense.", "Interactions (IMAO, autres stimulants)."],
            warning_signs: ["Palpitations, douleur thoracique.", "Mal de tête intense, hypertension.", "Malaise à l'effort."],
            rdr_rules: ["Éviter à l'effort intense et par forte chaleur.", "Ne pas associer à d'autres stimulants ni à un IMAO.", "Surveiller tension et cœur."]
        },
        "khat": {
            dosages: dz("g (feuilles fraîches)", "50 g", "100 - 200 g", "200 - 300 g", "300 - 500 g", "500 g +"),
            durations: dr("15 - 45 min", "30 - 60 min", "1,5 - 3 h", "2 - 4 h", "4 - 6 h"),
            durations_seconds: ds(1800, 2700, 8100, 10800, 18000),
            profile: "Feuilles à mâcher contenant de la cathinone naturelle : stimulation, coupe-faim, euphorie légère et dépendance avec l'usage régulier. La fraîcheur des feuilles change la puissance.",
            forms: ["feuilles fraîches à mâcher"],
            risk_factors: ["Dépendance à l'usage régulier.", "Effets cardiovasculaires, problèmes bucco-dentaires.", "Anxiété, insomnie."],
            rdr_rules: ["Hydratation (mastication longue, bouche sèche).", "Espacer les usages.", "Surveiller cœur et tension si usage intensif."]
        },

        // ============================================================
        // EMPATHOGÈNES
        // ============================================================
        "methylone": {
            dosages: dz("mg", "50 mg", "100 - 150 mg", "150 - 250 mg", "250 - 350 mg", "350 mg +"),
            durations: dr("15 - 45 min", "15 - 30 min", "1,5 - 2,5 h", "1 - 2 h", "3 - 5 h"),
            durations_seconds: ds(1800, 1350, 7200, 5400, 14400),
            profile: "Cathinone (« bk-MDMA ») aux effets empathogènes plus faibles et plus courts que la MDMA, mais avec une charge cardiovasculaire et thermique bien réelle. Parfois vendue pour de la MDMA.",
            risk_factors: ["Charge cardiaque et thermique comme la MDMA.", "Durée plus courte → tentation de redose.", "Neurotoxicité possible."],
            warning_signs: ["Hyperthermie, sueurs, malaise.", "Tachycardie, douleur thoracique.", "Confusion."],
            rdr_rules: ["Mêmes précautions que la MDMA : fraîcheur, hydratation mesurée, pauses.", "Espacer largement les usages.", "Une seule redose maximum, réduite."]
        },
        "ethylone": {
            dosages: dz("mg", "50 mg", "100 - 200 mg", "200 - 300 mg", "300 - 400 mg", "400 mg +"),
            durations: dr("20 - 45 min", "30 - 60 min", "2 - 3 h", "1 - 2 h", "4 - 6 h"),
            durations_seconds: ds(1950, 2700, 9000, 5400, 18000),
            profile: "Cathinone empathogène-stimulante (« bk-MDEA ») parfois vendue pour de la MDMA, à effets plus courts et plus stimulants.",
            risk_factors: ["Souvent vendue comme MDMA.", "Charge cardiaque/thermique.", "Insomnie."],
            rdr_rules: ["Tester son produit.", "Fraîcheur, hydratation mesurée.", "Plafonner les redoses."]
        },
        "6_apb": {
            dosages: dz("mg", "20 mg", "40 - 75 mg", "75 - 110 mg", "110 - 150 mg", "150 mg +"),
            durations: dr("45 - 90 min", "1 - 2 h", "4 - 6 h", "3 - 6 h", "8 - 14 h"),
            durations_seconds: ds(4050, 5400, 18000, 16200, 39600),
            profile: "Empathogène-stimulant (benzofurane, « Benzo Fury ») à durée longue : la charge cardiovasculaire est prolongée et les redoses, sur une montée lente, sont particulièrement risquées.",
            risk_factors: ["Durée longue → charge cardiaque prolongée.", "Montée lente → redoses dangereuses.", "Hyperthermie."],
            warning_signs: ["Tachycardie persistante, douleur thoracique.", "Hyperthermie, malaise.", "Anxiété intense."],
            rdr_rules: ["Patienter (montée lente) : aucune redose précoce.", "Anticiper une durée longue (8-14 h).", "Fraîcheur, hydratation, surveillance cardiaque."]
        },
        "5_apb": {
            dosages: dz("mg", "20 mg", "40 - 75 mg", "75 - 110 mg", "110 - 150 mg", "150 mg +"),
            durations: dr("45 - 90 min", "1 - 2 h", "4 - 6 h", "3 - 6 h", "8 - 14 h"),
            durations_seconds: ds(4050, 5400, 18000, 16200, 39600),
            profile: "Empathogène-stimulant benzofurane proche du 6-APB, long et chargeant pour le cœur.",
            risk_factors: ["Durée longue, charge cardiaque prolongée.", "Montée lente → redoses dangereuses.", "Hyperthermie."],
            rdr_rules: ["Aucune redose précoce.", "Durée longue à anticiper.", "Fraîcheur, hydratation, surveillance cardiaque."]
        },
        "mdea": {
            dosages: dz("mg", "50 mg", "75 - 100 mg", "100 - 150 mg", "150 - 200 mg", "200 mg +"),
            durations: dr("30 - 60 min", "30 - 60 min", "2 - 3 h", "1 - 2 h", "4 - 6 h"),
            durations_seconds: ds(2700, 2700, 9000, 5400, 18000),
            profile: "Empathogène proche de la MDMA (« Eve ») aux effets un peu plus doux et sédatifs, mais aux mêmes risques cardiaques et de surchauffe.",
            risk_factors: ["Mêmes risques cardiaques/thermiques que la MDMA.", "Neurotoxicité possible.", "Tentation de redose."],
            rdr_rules: ["Mêmes précautions que la MDMA.", "Fraîcheur, hydratation mesurée, pauses.", "Espacer largement les usages."]
        },

        // ============================================================
        // DÉPRESSEURS - Précurseurs du GHB
        // ============================================================
        "gbl": {
            dosages: dz("ml", "0,3 ml", "0,5 - 1 ml", "1 - 1,5 ml", "1,5 - 2,5 ml", "2,5 ml +"),
            durations: dr("5 - 15 min", "5 - 15 min", "30 - 60 min", "1 - 2 h", "1,5 - 3 h"),
            durations_seconds: ds(600, 600, 2700, 5400, 8100),
            profile: "Solvant transformé en GHB par l'organisme : effets identiques mais montée plus rapide et marge ENCORE plus étroite. Quelques dixièmes de millilitre séparent l'effet recherché du coma.",
            forms: ["liquide (à diluer et mesurer à la seringue/pipette)"],
            risk_factors: ["Marge minuscule : 0,5 ml de trop peut suffire au coma.", "Association à l'alcool = dépression respiratoire majeure.", "Dépendance et sevrage dangereux à l'usage répété."],
            warning_signs: ["Somnolence brutale, impossible à réveiller.", "Respiration lente, vomissements allongé.", "Perte de connaissance."],
            rdr_rules: ["Mesurer à la seringue/pipette, JAMAIS « au jugé ».", "Espacer d'au moins 2-3 h ; noter chaque prise à l'heure près.", "JAMAIS avec de l'alcool ni d'autres dépresseurs ; PLS si endormissement."]
        },
        "bdo": {
            dosages: dz("ml", "0,5 ml", "1 - 1,5 ml", "1,5 - 2,5 ml", "2,5 - 3,5 ml", "3,5 ml +"),
            durations: dr("10 - 30 min", "10 - 20 min", "45 - 90 min", "1 - 2 h", "2 - 4 h"),
            durations_seconds: ds(1200, 900, 4050, 5400, 10800),
            profile: "Précurseur converti en GHB par l'organisme (« 1,4-B »), aux mêmes risques (surdosage, coma) avec un délai d'action plus variable, ce qui trompe sur le moment de redoser.",
            forms: ["liquide (à mesurer précisément)"],
            risk_factors: ["Délai variable → redoses dangereuses.", "Marge étroite, coma.", "Association alcool = danger vital."],
            warning_signs: ["Somnolence brutale, impossible à réveiller.", "Respiration lente.", "Vomissements allongé."],
            rdr_rules: ["Mesurer précisément, attendre l'effet complet avant tout ajout.", "Jamais avec alcool/dépresseurs.", "PLS et surveillance si endormissement."]
        },

        // ============================================================
        // DÉPRESSEURS - Hypnotiques « Z »
        // ============================================================
        "zolpidem": {
            dosages: dz("mg", "2,5 mg", "5 mg", "10 mg", "15 - 20 mg", "20 mg +"),
            durations: dr("15 - 30 min", "15 - 30 min", "1 - 2 h", "2 - 4 h", "4 - 8 h"),
            durations_seconds: ds(1350, 1350, 5400, 10800, 21600),
            profile: "Hypnotique apparenté aux benzodiazépines (« Z-drug ») : amnésie, comportements automatiques (manger, conduire, écrire sans souvenir) et dépendance. Dangereux en mélange avec d'autres dépresseurs.",
            forms: ["comprimé"],
            risk_factors: ["Amnésie et comportements automatiques (parasomnies).", "Dépendance, rebond d'insomnie.", "Danger avec alcool/opioïdes (respiration)."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Comportements automatiques sans souvenir.", "Confusion, chutes."],
            rdr_rules: ["Se coucher immédiatement après la prise (parasomnies).", "Jamais avec alcool/opioïdes/benzos.", "Ne pas conduire ; usage ponctuel uniquement."]
        },
        "zopiclone": {
            dosages: dz("mg", "3,75 mg", "7,5 mg", "7,5 - 11,25 mg", "15 mg", "15 mg +"),
            durations: dr("15 - 30 min", "30 min", "1 - 2 h", "3 - 5 h", "5 - 9 h"),
            durations_seconds: ds(1350, 1800, 5400, 14400, 25200),
            profile: "Hypnotique « Z-drug » proche des benzodiazépines, sédatif, avec goût métallique caractéristique, dépendance et risque accru en association.",
            forms: ["comprimé"],
            risk_factors: ["Dépendance, rebond d'insomnie.", "Amnésie, chutes (personnes âgées).", "Danger avec alcool/opioïdes."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Confusion, chutes.", "Comportements automatiques."],
            rdr_rules: ["Se coucher juste après la prise.", "Jamais avec d'autres dépresseurs.", "Usage ponctuel ; éviter de conduire."]
        },

        // ============================================================
        // DÉPRESSEURS - Benzodiazépines (et apparentés)
        // ============================================================
        "alprazolam": {
            dosages: dz("mg", "0,25 mg", "0,5 mg", "0,5 - 1 mg", "1 - 2 mg", "2 mg +"),
            durations: dr("15 - 45 min", "30 - 60 min", "1 - 2 h", "4 - 6 h", "6 - 12 h"),
            durations_seconds: ds(1800, 2700, 5400, 18000, 32400),
            profile: "Benzodiazépine puissante et d'action rapide (« Xanax ») : forte désinhibition et amnésie, dépendance rapide, et danger majeur avec l'alcool ou les opioïdes (arrêt respiratoire).",
            forms: ["comprimé (faux comprimés fréquents au dosage imprévisible)"],
            risk_factors: ["Danger MORTEL avec alcool et opioïdes (respiration).", "Amnésie, désinhibition → décisions à risque.", "Dépendance rapide, sevrage dangereux (convulsions)."],
            warning_signs: ["Respiration lente, somnolence profonde.", "Trous de mémoire, comportements désinhibés.", "Au sevrage brutal : convulsions, urgence."],
            rdr_rules: ["JAMAIS avec alcool ni opioïdes.", "Ne pas augmenter ni enchaîner (amnésie → surdosage involontaire).", "Ne jamais arrêter brutalement après usage régulier (sevrage convulsif) : avis médical."]
        },
        "diazepam": {
            dosages: dz("mg", "2 mg", "5 mg", "5 - 10 mg", "10 - 20 mg", "20 mg +"),
            durations: dr("15 - 60 min", "30 - 60 min", "1 - 2 h", "4 - 8 h", "8 - 24 h"),
            durations_seconds: ds(2250, 2700, 5400, 21600, 57600),
            profile: "Benzodiazépine de longue durée (« Valium ») : sédation, accumulation sur plusieurs jours, dépendance et sevrage potentiellement sévère. Danger en mélange dépresseur.",
            forms: ["comprimé"],
            risk_factors: ["Demi-vie longue : accumulation et sédation prolongée.", "Danger avec alcool/opioïdes.", "Dépendance, sevrage sévère (convulsions)."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Confusion, chutes.", "Au sevrage : convulsions."],
            rdr_rules: ["Jamais avec alcool ni opioïdes.", "Tenir compte de l'accumulation (effets le lendemain).", "Sevrage uniquement encadré médicalement."]
        },
        "clonazepam": {
            dosages: dz("mg", "0,25 mg", "0,5 mg", "0,5 - 1 mg", "1 - 2 mg", "2 mg +"),
            durations: dr("30 - 60 min", "1 h", "2 - 4 h", "6 - 12 h", "12 - 24 h"),
            durations_seconds: ds(2700, 3600, 10800, 32400, 64800),
            profile: "Benzodiazépine longue et puissante (« Rivotril »), au même profil de dépendance et de risque en association que les autres benzodiazépines.",
            forms: ["comprimé", "solution buvable"],
            risk_factors: ["Action longue, accumulation.", "Danger avec alcool/opioïdes.", "Dépendance, sevrage sévère."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Confusion, chutes.", "Sevrage : convulsions."],
            rdr_rules: ["Jamais avec alcool ni opioïdes.", "Attention à l'accumulation (durée longue).", "Sevrage encadré médicalement."]
        },
        "etizolam": {
            dosages: dz("mg", "0,25 mg", "0,5 mg", "1 mg", "1 - 2 mg", "2 mg +"),
            durations: dr("15 - 45 min", "30 - 60 min", "1 - 2 h", "3 - 5 h", "4 - 7 h"),
            durations_seconds: ds(1800, 2700, 5400, 14400, 19800),
            profile: "Apparenté aux benzodiazépines (thiénodiazépine), souvent vendu en comprimés au dosage très imprécis : un même « comprimé » peut contenir des quantités très variables.",
            forms: ["comprimé/buvard de marché gris (dosage imprévisible)"],
            risk_factors: ["Comprimés au dosage imprévisible.", "Danger avec alcool/opioïdes.", "Dépendance, sevrage."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Amnésie.", "Sevrage : convulsions."],
            rdr_rules: ["Considérer chaque comprimé comme un dosage inconnu.", "Jamais avec alcool ni opioïdes.", "Pas d'arrêt brutal après usage régulier."]
        },
        "flualprazolam": {
            dosages: dz("mg", "0,1 mg", "0,25 mg", "0,5 mg", "0,5 - 1 mg", "1 mg +"),
            durations: dr("30 - 60 min", "1 h", "2 - 4 h", "6 - 10 h", "10 - 18 h"),
            durations_seconds: ds(2700, 3600, 10800, 28800, 50400),
            profile: "Benzodiazépine de synthèse très puissante, retrouvée dans de faux comprimés et de fausses « benzos » : risque élevé de surdosage et de dépression respiratoire en mélange.",
            forms: ["faux comprimés", "buvards", "poudre"],
            risk_factors: ["Très puissante : active à des fractions de milligramme.", "Présente dans de faux comprimés (Xanax contrefaits).", "Danger majeur avec opioïdes/alcool."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Amnésie totale.", "Impossible à réveiller."],
            rdr_rules: ["Ne pas se fier à l'aspect « pharmaceutique » d'un comprimé de rue.", "Jamais avec opioïdes ni alcool.", "Doses minuscules ; sevrage encadré."]
        },
        "clonazolam": {
            dosages: dz("mg", "0,1 mg", "0,25 mg", "0,25 - 0,5 mg", "0,5 - 1 mg", "1 mg +"),
            durations: dr("20 - 45 min", "45 min", "2 - 4 h", "6 - 10 h", "8 - 16 h"),
            durations_seconds: ds(1950, 2700, 10800, 28800, 43200),
            profile: "Benzodiazépine de synthèse extrêmement puissante, active à de très faibles quantités (sous le demi-milligramme). Amnésie et surdosage sont faciles ; le dosage à domicile est quasi impossible sans solution volumétrique.",
            forms: ["poudre", "buvards", "comprimés (dosage très imprécis)"],
            risk_factors: ["Active à <0,5 mg : surdosage facile.", "Amnésie → redoses involontaires en cascade.", "Danger majeur avec opioïdes/alcool."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Amnésie totale, comportements automatiques.", "Impossible à réveiller."],
            rdr_rules: ["Doser uniquement en solution volumétrique (jamais à l'œil).", "Jamais avec opioïdes ni alcool.", "Faire garder le produit par un tiers (amnésie)."]
        },

        // ============================================================
        // DÉPRESSEURS - Gabapentinoïdes, myorelaxants, plantes
        // ============================================================
        "phenibut": {
            dosages: dz("g", "0,25 g", "0,5 - 1 g", "1 - 2 g", "2 - 3 g", "3 g +"),
            durations: dr("2 - 4 h", "1 - 2 h", "4 - 6 h", "6 - 12 h", "12 - 24 h"),
            durations_seconds: ds(10800, 5400, 18000, 32400, 64800),
            profile: "Dérivé du GABA aux effets anxiolytiques et sédatifs, à montée très lente (2-4 h). La tolérance s'installe vite et l'arrêt après usage répété peut provoquer un sevrage marqué et dangereux.",
            forms: ["poudre", "gélule"],
            risk_factors: ["Montée très lente → redoses en stacking dangereuses.", "Tolérance rapide, sevrage sévère (anxiété, insomnie, parfois convulsions).", "Potentialise les autres dépresseurs."],
            warning_signs: ["Sédation profonde si redose précoce.", "Au sevrage : anxiété extrême, insomnie, agitation.", "Respiration lente en mélange."],
            rdr_rules: ["NE PAS redoser : attendre 4 h l'effet complet.", "Usage occasionnel seulement (tolérance/sevrage rapides).", "Jamais quotidien ; pas d'alcool ni d'autres dépresseurs."]
        },
        "gabapentine": {
            dosages: dz("mg", "100 mg", "200 - 600 mg", "600 - 900 mg", "900 - 1800 mg", "1800 mg +"),
            durations: dr("30 - 90 min", "1 - 2 h", "2 - 4 h", "3 - 6 h", "5 - 9 h"),
            durations_seconds: ds(3600, 5400, 10800, 16200, 25200),
            profile: "Gabapentinoïde prescrit (« Neurontin »), parfois détourné. Sédatif, il majore l'effet dépresseur des opioïdes et augmente le risque respiratoire ; absorption qui plafonne aux fortes doses.",
            forms: ["gélule", "comprimé"],
            risk_factors: ["Potentialise les opioïdes → risque respiratoire accru.", "Sédation, vertiges, chutes.", "Sevrage après usage prolongé."],
            warning_signs: ["Somnolence profonde, respiration lente (surtout avec opioïdes).", "Confusion, troubles de l'équilibre.", "Œdèmes."],
            rdr_rules: ["Prudence extrême avec les opioïdes (surdoses documentées).", "Augmenter lentement ; ne pas arrêter brutalement.", "Éviter alcool et autres dépresseurs."]
        },
        "pregabaline": {
            dosages: dz("mg", "25 mg", "50 - 150 mg", "150 - 300 mg", "300 - 450 mg", "450 mg +"),
            durations: dr("30 - 60 min", "1 h", "2 - 4 h", "3 - 6 h", "5 - 9 h"),
            durations_seconds: ds(2700, 3600, 10800, 16200, 25200),
            profile: "Gabapentinoïde prescrit (« Lyrica »), plus puissant que la gabapentine. Il majore fortement l'effet dépresseur des opioïdes, de l'alcool et des benzodiazépines, avec un risque respiratoire réel.",
            forms: ["gélule"],
            risk_factors: ["Potentialise fortement opioïdes/alcool/benzos → risque respiratoire.", "Dépendance, euphorie aux fortes doses.", "Sevrage marqué."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Confusion, troubles de l'équilibre.", "Au sevrage : anxiété, insomnie."],
            rdr_rules: ["Très prudent avec opioïdes (surdoses mortelles documentées).", "Ne pas augmenter ni cumuler les dépresseurs.", "Sevrage progressif encadré."]
        },
        "baclofene": {
            dosages: dz("mg", "10 mg", "20 - 40 mg", "40 - 80 mg", "80 - 120 mg", "120 mg +"),
            durations: dr("30 - 90 min", "1 - 2 h", "2 - 4 h", "3 - 5 h", "4 - 8 h"),
            durations_seconds: ds(3600, 5400, 10800, 14400, 21600),
            profile: "Myorelaxant agoniste GABA-B (« Lioresal »), parfois détourné. Le surdosage est potentiellement grave : sédation profonde, dépression respiratoire, coma, convulsions.",
            forms: ["comprimé"],
            risk_factors: ["Surdosage → coma, dépression respiratoire, convulsions.", "Danger avec autres dépresseurs.", "Sevrage brutal dangereux (après usage prolongé)."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Convulsions.", "Confusion sévère."],
            rdr_rules: ["Ne pas augmenter rapidement ni dépasser les paliers.", "Jamais avec alcool/opioïdes/benzos.", "Ne pas arrêter brutalement après usage prolongé."]
        },
        "carisoprodol": {
            dosages: dz("mg", "175 mg", "350 mg", "350 - 700 mg", "700 - 1050 mg", "1050 mg +"),
            durations: dr("30 - 60 min", "30 - 60 min", "1,5 - 3 h", "2 - 4 h", "4 - 6 h"),
            durations_seconds: ds(2700, 2700, 8100, 10800, 18000),
            profile: "Myorelaxant (« Soma ») métabolisé en méprobamate, sédatif et dépendogène. Dangereux en mélange avec d'autres dépresseurs.",
            forms: ["comprimé"],
            risk_factors: ["Métabolite sédatif (méprobamate) → dépendance.", "Danger avec alcool/opioïdes/benzos.", "Sevrage possible."],
            warning_signs: ["Somnolence profonde, respiration lente.", "Confusion, chutes.", "Au sevrage : agitation, convulsions."],
            rdr_rules: ["Jamais avec d'autres dépresseurs.", "Usage ponctuel ; pas d'arrêt brutal.", "Éviter de conduire."]
        },
        "kava": {
            dosages: dz("g (racine)", "2 g", "4 - 8 g", "8 - 15 g", "15 - 25 g", "25 g +"),
            durations: dr("15 - 30 min", "30 min", "1 - 2 h", "1 - 2 h", "2 - 4 h"),
            durations_seconds: ds(1350, 1800, 5400, 5400, 10800),
            profile: "Plante du Pacifique aux effets relaxants et anxiolytiques, sans perte de lucidité marquée à dose modérée. L'hépatotoxicité est possible en usage intensif ou avec des produits de mauvaise qualité.",
            forms: ["racine en poudre (préparation aqueuse traditionnelle)", "extraits"],
            risk_factors: ["Hépatotoxicité (extraits solvant, usage intensif, alcool associé).", "Sédation, potentialisation des dépresseurs.", "« Kava dermopathie » à l'usage chronique."],
            warning_signs: ["Jaunisse, urines foncées, fatigue (atteinte hépatique).", "Sédation excessive en mélange.", "Nausées."],
            rdr_rules: ["Privilégier la racine noble en préparation aqueuse (pas d'extrait solvant).", "Éviter l'alcool et les médicaments hépatotoxiques.", "Espacer ; surveiller les signes hépatiques."]
        },
        "amanite": {
            dosages: dz("g (champignon séché)", "1 g", "2 - 5 g", "5 - 10 g", "10 - 15 g", "15 g +"),
            durations: dr("30 - 120 min", "1 - 2 h", "2 - 4 h", "2 - 4 h", "6 - 10 h"),
            durations_seconds: ds(5400, 5400, 10800, 10800, 28800),
            profile: "Champignon contenant muscimol et acide iboténique (« amanite tue-mouches ») : effets sédatifs et oniriques atypiques, souvent précédés de nausées et de confusion. À NE JAMAIS confondre avec des amanites mortelles.",
            forms: ["chapeaux séchés (séchage/décarboxylation qui change la puissance)"],
            risk_factors: ["Confusion possible avec des amanites MORTELLES (phalloïde).", "Acide iboténique : nausées, convulsions, délire.", "Puissance très variable selon séchage et spécimen."],
            warning_signs: ["Vomissements importants, convulsions.", "Confusion/délire sévère.", "Somnolence profonde."],
            rdr_rules: ["Identification botanique certaine indispensable (risque mortel).", "Séchage/décarboxylation et doses basses ; commencer très prudemment.", "Personne sobre présente ; pas d'autres dépresseurs."]
        },

        // ============================================================
        // OPIOÏDES (paliers SANS tolérance - la tolérance change tout)
        // ============================================================
        "heroine": {
            dosages: dz("mg", "5 mg", "5 - 10 mg", "10 - 20 mg", "20 - 30 mg", "30 mg +"),
            durations: dr("1 - 5 min", "5 - 15 min", "1 - 2 h", "2 - 3 h", "3 - 5 h"),
            durations_seconds: ds(300, 600, 5400, 9000, 14400),
            profile: "Opioïde puissant à action rapide et à fort potentiel de dépendance. Le risque majeur est la dépression respiratoire, très aggravée par l'alcool/benzodiazépines et par la contamination aux opioïdes de synthèse (fentanyl, nitazènes). Paliers pour personne SANS tolérance.",
            forms: ["poudre (pureté très variable, contamination fentanyl/nitazènes fréquente)"],
            risk_factors: ["Pureté inconnue et contamination fentanyl/nitazènes → surdose imprévisible.", "Dépression respiratoire, surtout avec alcool/benzos.", "Risque accru après une période d'abstinence (tolérance chutée)."],
            warning_signs: ["Respiration lente/arrêtée, lèvres bleutées.", "Impossible à réveiller, ronflement anormal.", "Pupilles en pointe, somnolence profonde."],
            rdr_rules: ["Avoir de la NALOXONE à portée et savoir s'en servir.", "Tester une dose d'essai réduite (contamination fentanyl) ; jamais seul.", "JAMAIS avec alcool/benzodiazépines ; PLS et 15/112 au moindre doute."]
        },
        "morphine": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("15 - 60 min", "30 - 60 min", "1 - 3 h", "2 - 4 h", "4 - 6 h"),
            durations_seconds: ds(2250, 2700, 7200, 10800, 18000),
            profile: "Opioïde de référence : analgésie, sédation et surtout dépression respiratoire, très aggravée par l'alcool et les benzodiazépines. Paliers oraux pour personne SANS tolérance.",
            forms: ["comprimé LP/LI", "solution", "ampoule détournée"],
            risk_factors: ["Dépression respiratoire (majeure avec alcool/benzos).", "Formes LP écrasées → libération massive.", "Dépendance."],
            warning_signs: ["Respiration lente, lèvres bleutées.", "Somnolence profonde, pupilles en pointe.", "Impossible à réveiller."],
            rdr_rules: ["Jamais avec alcool/benzodiazépines.", "Ne pas écraser/injecter les formes LP.", "Naloxone à proximité ; jamais seul."]
        },
        "methadone": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("30 - 60 min", "1 - 3 h", "3 - 6 h", "12 - 24 h", "24 - 48 h"),
            durations_seconds: ds(2700, 7200, 16200, 64800, 129600),
            profile: "Opioïde de substitution à action TRÈS longue : le risque respiratoire est différé et cumulatif, d'où des surdoses tardives, parfois après que l'effet ressenti s'est estompé. Allonge aussi le QT. Paliers pour personne SANS tolérance - extrêmement dangereux sans tolérance.",
            forms: ["sirop", "gélule"],
            risk_factors: ["Effet respiratoire différé/cumulatif → surdoses tardives (2e-3e jour).", "Allongement du QT (troubles du rythme).", "Danger extrême sans tolérance et avec benzos/alcool."],
            warning_signs: ["Respiration lente plusieurs heures après la prise.", "Somnolence profonde, lèvres bleutées.", "Palpitations, malaise."],
            rdr_rules: ["Jamais sans tolérance : la durée masque le danger.", "Aucune redose le même jour (accumulation).", "Jamais avec benzos/alcool ; naloxone à proximité."]
        },
        "buprenorphine": {
            dosages: dz("mg", "0,2 mg", "0,5 - 2 mg", "2 - 8 mg", "8 - 16 mg", "16 mg +"),
            durations: dr("30 - 60 min", "1 - 2 h", "2 - 4 h", "12 - 24 h", "24 - 48 h"),
            durations_seconds: ds(2700, 5400, 10800, 64800, 129600),
            profile: "Opioïde de substitution (« Subutex/Suboxone ») à effet « plafond » sur la respiration : plus sûr seul que les autres opioïdes, mais dangereux avec les benzodiazépines. Pris trop tôt après un autre opioïde, il peut précipiter un manque sévère.",
            forms: ["comprimé/film sublingual"],
            risk_factors: ["Précipite un sevrage si pris trop tôt après un agoniste complet.", "Danger réel avec les benzodiazépines (décès documentés).", "Mésusage par injection."],
            warning_signs: ["Manque brutal (sueurs, douleurs, agitation) si pris trop tôt.", "Avec benzos : respiration lente, somnolence profonde.", "Malaise."],
            rdr_rules: ["Respecter le délai après le dernier opioïde (éviter le manque précipité).", "Jamais avec des benzodiazépines.", "Voie sublinguale ; encadrement médical pour la substitution."]
        },
        "hydromorphone": {
            dosages: dz("mg", "1 mg", "2 - 4 mg", "4 - 8 mg", "8 - 12 mg", "12 mg +"),
            durations: dr("15 - 30 min", "30 - 60 min", "1 - 2 h", "2 - 3 h", "4 - 5 h"),
            durations_seconds: ds(1350, 2700, 5400, 9000, 16200),
            profile: "Opioïde puissant sur ordonnance (« Sophidone »), à fort risque respiratoire, notamment détourné par injection. Paliers oraux pour personne SANS tolérance.",
            forms: ["gélule LP/LI", "ampoule détournée"],
            risk_factors: ["Très puissant : surdosage rapide sans tolérance.", "Injection → risque accru.", "Danger avec alcool/benzos."],
            warning_signs: ["Respiration lente, lèvres bleutées.", "Somnolence profonde, pupilles en pointe.", "Impossible à réveiller."],
            rdr_rules: ["Doses minuscules sans tolérance ; jamais avec alcool/benzos.", "Ne pas écraser/injecter les LP.", "Naloxone à proximité, jamais seul."]
        },
        "tapentadol": {
            dosages: dz("mg", "25 mg", "50 mg", "50 - 100 mg", "100 - 200 mg", "200 mg +"),
            durations: dr("30 - 60 min", "30 - 60 min", "1 - 2 h", "2 - 4 h", "4 - 6 h"),
            durations_seconds: ds(2700, 2700, 5400, 10800, 18000),
            profile: "Antalgique opioïde (« Palexia ») à composante noradrénergique : risque opioïde classique (respiration) plus un risque sérotoninergique et convulsif en mélange (antidépresseurs, tramadol).",
            forms: ["comprimé LP/LI"],
            risk_factors: ["Dépression respiratoire.", "Risque sérotoninergique/convulsif avec antidépresseurs, tramadol, IMAO.", "Dépendance."],
            warning_signs: ["Respiration lente.", "Agitation, fièvre, rigidité (syndrome sérotoninergique).", "Convulsions."],
            rdr_rules: ["Jamais avec alcool/benzos.", "Éviter les associations sérotoninergiques (antidépresseurs, tramadol).", "Ne pas écraser les LP ; naloxone à proximité."]
        },
        "o_dsmt": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("30 - 90 min", "30 - 60 min", "2 - 4 h", "2 - 4 h", "4 - 8 h"),
            durations_seconds: ds(3600, 2700, 10800, 10800, 21600),
            profile: "Métabolite actif du tramadol vendu comme opioïde de synthèse : dépression respiratoire, plus un risque de convulsions et un risque sérotoninergique en mélange.",
            forms: ["poudre", "gélule"],
            risk_factors: ["Dépression respiratoire.", "Convulsions (surtout à forte dose).", "Risque sérotoninergique avec antidépresseurs/IMAO."],
            warning_signs: ["Respiration lente.", "Convulsions, tremblements.", "Agitation, fièvre, rigidité (sérotoninergique)."],
            rdr_rules: ["Doses basses (convulsions dose-dépendantes).", "Jamais avec alcool/benzos ni antidépresseurs sérotoninergiques.", "Naloxone à proximité ; jamais seul."]
        },
        "tianeptine": {
            dosages: dz("mg", "12,5 mg", "25 - 50 mg", "50 - 250 mg", "250 - 500 mg", "500 mg +"),
            durations: dr("15 - 45 min", "30 - 60 min", "1 - 2 h", "2 - 4 h", "3 - 5 h"),
            durations_seconds: ds(1800, 2700, 5400, 10800, 14400),
            profile: "Antidépresseur atypique (« Stablon ») qui agit comme un opioïde à forte quantité. Détourné (parfois vendu en « complément »), il entraîne dépendance et surdosage, avec un sevrage de type opioïde.",
            forms: ["comprimé", "poudre (compléments « gas station »)"],
            risk_factors: ["Effet opioïde à forte dose → dépression respiratoire.", "Dépendance rapide, redoses fréquentes (durée courte).", "Sevrage de type opioïde."],
            warning_signs: ["Respiration lente (fortes doses, mélanges).", "Somnolence profonde.", "Au sevrage : douleurs, agitation, sueurs."],
            rdr_rules: ["Ne pas dépasser les doses thérapeutiques.", "Jamais avec d'autres dépresseurs.", "Sevrage de type opioïde : encadrement médical."]
        },
        "loperamide": {
            dosages: dz("mg", "2 mg", "2 - 8 mg", "dose anti-diarrhéique", "détournement dangereux", "risque cardiaque mortel"),
            durations: dr("1 - 3 h", "2 - 4 h", "4 - 6 h", "6 - 12 h", "12 - 24 h"),
            durations_seconds: ds(7200, 10800, 18000, 32400, 64800),
            profile: "Antidiarrhéique opioïde (« Imodium ») qui n'agit normalement pas sur le cerveau. Détourné à très haute quantité (dizaines de comprimés), il expose à de GRAVES troubles du rythme cardiaque, parfois mortels, sans euphorie fiable.",
            forms: ["comprimé/gélule"],
            risk_factors: ["Mégadoses → allongement du QT, torsades de pointes, arrêt cardiaque.", "Souvent associé à des « potentialisateurs » qui aggravent le risque.", "Faux sentiment de sécurité (médicament en vente libre)."],
            warning_signs: ["Palpitations, malaise, syncope.", "Douleur thoracique.", "Perte de connaissance."],
            rdr_rules: ["Ne jamais dépasser la dose anti-diarrhéique : pas un opioïde récréatif.", "Ne pas l'utiliser pour gérer un manque (risque cardiaque mortel).", "Malaise/palpitations après mégadose : 15 ou 112 immédiatement."]
        },
        "oxycodone": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("20 - 40 min", "30 - 60 min", "1 - 2 h", "2 - 4 h", "4 - 6 h"),
            durations_seconds: ds(1800, 2700, 5400, 10800, 18000),
            profile: "Opioïde analgésique sur ordonnance (« OxyContin »), parfois détourné. Les formes à libération prolongée écrasées exposent à un surdosage rapide et à la dépression respiratoire. Paliers oraux pour personne SANS tolérance.",
            forms: ["comprimé LP/LI"],
            risk_factors: ["Formes LP écrasées → libération massive, surdose.", "Dépression respiratoire (majeure avec alcool/benzos).", "Dépendance."],
            warning_signs: ["Respiration lente, lèvres bleutées.", "Somnolence profonde, pupilles en pointe.", "Impossible à réveiller."],
            rdr_rules: ["Ne pas écraser/sniffer/injecter les LP.", "Jamais avec alcool/benzodiazépines.", "Naloxone à proximité ; jamais seul."]
        },

        // ============================================================
        // CANNABINOÏDES (semi-synthétiques et apparentés)
        // ============================================================
        "hhc": {
            dosages: dz("mg", "2 mg", "5 - 10 mg", "10 - 25 mg", "25 - 40 mg", "40 mg +"),
            durations: dr("2 - 15 min", "15 - 45 min", "1 - 3 h", "1 - 3 h", "2 - 6 h"),
            durations_seconds: ds(900, 1800, 7200, 7200, 14400),
            profile: "Cannabinoïde semi-synthétique vendu comme « légal », aux effets proches du THC mais mal caractérisés et de pureté très variable d'un produit à l'autre. En comestible, montée lente et plus forte.",
            forms: ["fleurs/résine « CBD » enrichies", "vape", "comestible"],
            risk_factors: ["Pureté et dosage très variables (sous-produits de synthèse).", "Comestibles : surconsommation (montée lente).", "Effets et innocuité long terme mal connus."],
            warning_signs: ["Malaise, tachycardie, angoisse intense.", "Vomissements (usage chronique : syndrome cannabinoïde).", "Confusion."],
            rdr_rules: ["Commencer très bas (produit mal caractérisé), surtout en comestible.", "Attendre 2 h avant tout comestible supplémentaire.", "Éviter l'alcool et la conduite."]
        },
        "thco": {
            dosages: dz("mg", "1 mg", "3 - 6 mg", "6 - 15 mg", "15 - 25 mg", "25 mg +"),
            durations: dr("20 - 60 min", "30 - 60 min", "2 - 4 h", "2 - 4 h", "4 - 8 h"),
            durations_seconds: ds(2400, 2700, 10800, 10800, 21600),
            profile: "Ester semi-synthétique du THC (promédicament), plus puissant et à montée RETARDÉE même inhalé : on croit que « ça ne marche pas » et on en reprend. Inhalé en vape, il a été associé à des atteintes pulmonaires (cétène).",
            forms: ["vape", "comestible", "distillat"],
            risk_factors: ["Montée retardée → surconsommation.", "Vape : risque pulmonaire (dégradation en cétène).", "Plus puissant que le THC, pureté variable."],
            warning_signs: ["Malaise, tachycardie, angoisse.", "Toux/gêne respiratoire persistante (vape).", "Confusion, vomissements."],
            rdr_rules: ["Attendre l'effet complet (retardé) avant toute reprise.", "Éviter le vapotage (risque pulmonaire) ; préférer une voie connue.", "Commencer très bas, pas d'alcool."]
        },
        "delta8": {
            dosages: dz("mg", "5 mg", "10 - 20 mg", "20 - 40 mg", "40 - 60 mg", "60 mg +"),
            durations: dr("5 - 15 min", "15 - 45 min", "1 - 3 h", "1 - 3 h", "3 - 6 h"),
            durations_seconds: ds(900, 1800, 7200, 7200, 16200),
            profile: "Isomère du THC environ deux tiers moins puissant, souvent produit à partir de CBD avec des impuretés de synthèse possibles. Effet « plus clair » mais innocuité des sous-produits incertaine.",
            forms: ["vape", "comestible", "fleurs enrichies"],
            risk_factors: ["Impuretés de synthèse (procédé à partir du CBD).", "Comestibles : surconsommation.", "Pureté/étiquetage variables."],
            warning_signs: ["Malaise, tachycardie, angoisse.", "Vomissements (usage chronique).", "Confusion."],
            rdr_rules: ["Privilégier des produits testés en laboratoire.", "Comestible : attendre 2 h avant d'en reprendre.", "Éviter l'alcool et la conduite."]
        },
        "thcp": {
            dosages: dz("mg", "0,3 mg", "0,5 - 1 mg", "1 - 3 mg", "3 - 5 mg", "5 mg +"),
            durations: dr("5 - 15 min", "30 - 90 min", "2 - 4 h", "2 - 4 h", "4 - 10 h"),
            durations_seconds: ds(900, 3600, 10800, 10800, 25200),
            profile: "Cannabinoïde nettement plus puissant que le THC à poids égal : les effets sont faciles à sous-estimer, surtout en comestible où la montée est longue et l'intensité forte.",
            forms: ["vape", "comestible", "distillat (souvent en mélange)"],
            risk_factors: ["Très puissant : surdosage facile (surtout comestible).", "Souvent en mélange à dose imprécise.", "Anxiété/tachycardie marquées."],
            warning_signs: ["Angoisse intense, tachycardie, malaise.", "Vomissements.", "Confusion, « bad trip » cannabique."],
            rdr_rules: ["Doses minuscules : raisonner en fractions de milligramme.", "Comestible : attendre 2-3 h avant toute reprise.", "S'allonger, respirer, sucre lent si malaise."]
        },
        "cbc": {
            dosages: dz("mg (est.)", "2 - 5 mg", "5 - 10 mg", "10 - 25 mg", "25 - 50 mg", "50 mg +"),
            dosages_by_route: {
                "Oral": dz("mg (est.)", "2 - 5 mg", "5 - 10 mg", "10 - 25 mg", "25 - 50 mg", "50 mg +"),
                "Inhalé": dz("mg (est.)", "0,5 - 1 mg", "1 - 3 mg", "3 - 10 mg", "10 - 20 mg", "20 mg +")
            },
            durations: {
                "Oral": dr("30 - 180 min", "1 - 3 h", "2 - 4 h", "3 - 6 h", "6 - 10 h"),
                "Inhalé": dr("2 - 10 min", "5 - 20 min", "10 - 60 min", "1 - 3 h", "2 - 4 h")
            },
            durations_seconds: {
                "Oral": ds(5400, 7200, 10800, 14400, 28800),
                "Inhalé": ds(300, 900, 1800, 7200, 10800)
            },
            bioavailability_by_route: {
                "Oral": "6 - 20 % (est. cannabinoïdes oraux ; CBC absolue inconnue)",
                "Inhalé": "10 - 35 % (est. inhalation cannabinoïdes ; CBC spécifique rare)"
            },
            profile: "CBC (cannabichromène) est un phytocannabinoïde mineur du cannabis, peu ou pas enivrant seul. Les données humaines restent limitées : l'analyse du produit compte plus que le nom commercial.",
            forms: ["huile/extrait", "gélule/comestible", "fleurs ou extraits riches en CBC", "vape"],
            risk_factors: ["Données humaines encore limitées, surtout pour les produits isolés ou enrichis en CBC.", "Teneur réelle, pureté et présence de THC ou d'autres cannabinoïdes très variables selon le produit.", "Inhalation : irritation pulmonaire et exposition aux produits de chauffe, surtout en vape ou extrait."],
            warning_signs: ["Somnolence, malaise, tachycardie ou anxiété si le produit contient aussi du THC.", "Toux, gêne respiratoire ou douleur thoracique après inhalation.", "Interaction possible avec un traitement ou effets inattendus d'un produit mal étiqueté."],
            dosage_warning: "Estimations prudentes : les seules données humaines publiées portent sur une huile orale contenant 6,6 à 26,4 mg de CBC par jour, avec CBD/THC. La biodisponibilité absolue du CBC n'est pas connue.",
            rdr_rules: ["Vérifier l'analyse du produit et supposer la teneur incertaine en l'absence de certificat.", "Par voie orale, attendre la montée complète avant toute reprise : les cannabinoïdes oraux montent lentement.", "Éviter de fumer ou vapoter des extraits non prévus pour l'inhalation."]
        },
        "cbd": {
            dosages: dz("mg", "5 mg", "10 - 25 mg", "25 - 75 mg", "75 - 150 mg", "150 mg +"),
            durations: dr("15 - 45 min", "30 - 60 min", "1 - 3 h", "1 - 3 h", "4 - 8 h"),
            durations_seconds: ds(1800, 2700, 7200, 7200, 21600),
            profile: "Cannabinoïde non enivrant (pas d'effet planant) aux propriétés plutôt relaxantes. Principaux enjeux : interactions médicamenteuses (inhibition d'enzymes du foie) et qualité/étiquetage très variables.",
            forms: ["huile", "fleurs/résine", "comestible", "vape"],
            risk_factors: ["Interactions médicamenteuses (CYP450 : majore d'autres médicaments).", "Étiquetage souvent inexact (teneur réelle variable, traces de THC).", "Qualité d'extraction variable."],
            warning_signs: ["Somnolence, diarrhée (fortes doses).", "Interaction avec un traitement (effets renforcés).", "-"],
            rdr_rules: ["Vérifier les interactions si vous prenez un traitement (anticoagulants, antiépileptiques…).", "Privilégier des produits analysés (certificat d'analyse).", "Commencer bas si objectif thérapeutique."]
        },

        // ============================================================
        // DÉLIRIANTS / ATYPIQUES
        // ============================================================
        "dph": {
            dosages: dz("mg", "100 mg", "150 - 250 mg", "250 - 500 mg", "500 - 700 mg", "700 mg +"),
            durations: dr("30 - 120 min", "1 - 2 h", "3 - 6 h", "3 - 6 h", "8 - 12 h"),
            durations_seconds: ds(5400, 5400, 16200, 16200, 36000),
            profile: "Antihistaminique courant (« Benadryl ») qui, à forte quantité, provoque un délire anticholinergique très désagréable et dangereux : hallucinations effrayantes, cœur emballé, hyperthermie, confusion. Quasi personne ne le réutilise.",
            forms: ["comprimé/gélule", "sirop"],
            risk_factors: ["Délire anticholinergique (hallucinations réalistes, agitation).", "Cardiotoxicité (troubles du rythme), convulsions à forte dose.", "Hyperthermie, rétention urinaire."],
            warning_signs: ["Cœur très rapide, palpitations, douleur thoracique.", "Fièvre, peau sèche et rouge, rétention urinaire.", "Confusion/délire, convulsions."],
            rdr_rules: ["Ne pas détourner : expérience désagréable et cardiotoxique.", "Surdose anticholinergique = urgence (15/112).", "Jamais avec d'autres anticholinergiques ni stimulants."]
        },
        "datura": {
            dosages: dz("non dosable", "Non dosable - teneur imprévisible", "Non dosable", "Non dosable", "Risque vital", "Risque vital"),
            durations: dr("30 - 120 min", "2 - 4 h", "8 - 24 h", "1 - 3 j", "Plusieurs jours"),
            durations_seconds: ds(5400, 10800, 57600, 172800, 259200),
            profile: "Plante anticholinergique (datura, belladone, stramoine) provoquant un délire intense et dangereux, avec amnésie, cœur emballé et risque vital. La teneur en alcaloïdes varie énormément d'une plante, d'une partie et d'une saison à l'autre : aucune dose n'est maîtrisable.",
            forms: ["graines, feuilles, fleurs (teneur en alcaloïdes très variable)"],
            risk_factors: ["Teneur imprévisible → aucune dose sûre, surdoses mortelles.", "Délire anticholinergique réaliste (accidents, blessures).", "Hyperthermie, troubles du rythme, convulsions, coma."],
            warning_signs: ["Cœur très rapide, fièvre, peau sèche/rouge.", "Délire, agitation, hallucinations indistinguables du réel.", "Convulsions, rétention urinaire, perte de connaissance."],
            rdr_rules: ["À considérer comme non maîtrisable : le risque est vital.", "Toute ingestion suspecte = urgence médicale (15/112), préciser « anticholinergique ».", "Jamais seul ; surveillance étroite indispensable."]
        },
        "nutmeg": {
            dosages: dz("g (noix moulue)", "5 g", "5 - 10 g", "10 - 20 g", "20 - 30 g", "30 g +"),
            durations: dr("3 - 6 h", "2 - 4 h", "6 - 10 h", "6 - 12 h", "24 - 48 h"),
            durations_seconds: ds(16200, 10800, 28800, 32400, 129600),
            profile: "Épice (myristicine) qui, à forte quantité, donne des effets atypiques très RETARDÉS (3-6 h) et une longue « gueule de bois » désagréable, avec nausées marquées. La montée tardive pousse à reprendre - erreur classique. Intérêt récréatif faible.",
            forms: ["noix de muscade moulue"],
            risk_factors: ["Onset très retardé (3-6 h) → redoses dangereuses.", "Effets anticholinergiques, tachycardie, nausées intenses.", "Gueule de bois très longue (1-2 j)."],
            warning_signs: ["Cœur très rapide, bouche sèche, malaise.", "Confusion/délire.", "Nausées/vomissements importants, déshydratation."],
            rdr_rules: ["Ne jamais redoser : attendre au moins 6 h (montée très tardive).", "Anticiper 1-2 jours de récupération désagréables.", "Hydratation ; éviter tout autre anticholinergique."]
        }
    };

    window.SEUIL_RICH = RICH;
})();
