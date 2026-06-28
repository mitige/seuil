/*
 * index-substances.js - Répertoire élargi de Seuil (contenu 100 % original)
 *
 * Fiches de référence condensées rédigées par Seuil. Elles n'intègrent
 * volontairement AUCUNE posologie, voie ni protocole d'usage : seulement la
 * famille, une description factuelle et des repères de réduction des risques.
 *
 * Les seules données factuelles utilisées (nom usuel, famille pharmacologique)
 * relèvent de la connaissance commune et ne reprennent aucun contenu rédactionnel
 * tiers. Ces entrées restent masquées dans le guide tant qu'aucune recherche
 * n'est effectuée (drapeau isExtendedEntry).
 */
(function () {
    if (typeof SUBSTANCE_DB === "undefined") return;

    // Repères de prudence communs, déclinés par grande famille (rédaction Seuil).
    var FAMILY = {
        psychedelic: {
            effects: [
                "Modification des perceptions visuelles et auditives, de la pensée et du sens du temps.",
                "Vagues émotionnelles intenses, de l'euphorie à l'angoisse selon l'état d'esprit et l'environnement.",
                "Effets physiques fréquents : pupilles dilatées, variations de température, tension, nausées en montée."
            ],
            risk_factors: [
                "Quantité mal évaluée (surtout sur buvard ou poudre non testée) et confusion possible avec une molécule beaucoup plus puissante.",
                "Antécédents personnels ou familiaux de troubles psychotiques ou bipolaires.",
                "Environnement instable, isolement ou état émotionnel fragile au moment de la prise."
            ],
            avoid_if: [
                "État psychique fragile, période de crise ou contexte non sécurisé.",
                "Conduite, travail ou toute activité exigeant vigilance et coordination.",
                "Association avec d'autres psychoactifs, en particulier le lithium ou certains antidépresseurs."
            ],
            warning_signs: [
                "Angoisse qui s'installe et ne redescend pas, panique, idées noires.",
                "Confusion sévère, perte de contact prolongée avec la réalité ou agitation incontrôlable.",
                "Signes physiques inhabituels : douleur thoracique, fièvre, raideur musculaire, malaise."
            ],
            aftercare: [
                "Prévoir du repos, un environnement calme et une personne de confiance joignable.",
                "Éviter les décisions importantes et l'enchaînement des expériences ; laisser du temps entre deux usages.",
                "Si le vécu reste pesant plusieurs jours, en parler à une personne de confiance ou à une structure d'aide."
            ],
            rdr_rules: [
                "Vérifier autant que possible l'identité réelle du produit : sur buvard, une molécule peut en cacher une autre, parfois bien plus dangereuse.",
                "Commencer prudemment et attendre largement avant d'envisager toute redose : la montée peut être lente.",
                "Choisir un cadre rassurant, prévoir une personne sobre et ne jamais consommer seul."
            ]
        },
        dissociative: {
            effects: [
                "Sensation de détachement du corps et de l'environnement, distorsions de l'espace et du temps.",
                "Troubles de l'équilibre, de la coordination et de l'élocution.",
                "À quantité élevée : perte de repères importante pouvant aller jusqu'à l'immobilisation."
            ],
            risk_factors: [
                "Auto-dosage difficile (poudres, produits peu documentés) et montées par paliers qui poussent à re-doser.",
                "Chutes, blessures et fausses routes liées à la perte de coordination.",
                "Usage répété rapproché : tolérance rapide et atteintes possibles de la vessie avec certains produits."
            ],
            avoid_if: [
                "Seul, en hauteur, près de l'eau ou dans un lieu non sécurisé.",
                "Conduite ou activité nécessitant équilibre et vigilance.",
                "Association avec alcool, opioïdes ou autres dépresseurs (risque respiratoire et de fausse route)."
            ],
            warning_signs: [
                "Vomissements en position allongée, difficulté à respirer, perte de connaissance.",
                "Agitation extrême ou confusion qui ne redescend pas, douleur thoracique.",
                "Douleurs urinaires, sang dans les urines ou envies fréquentes avec un usage répété."
            ],
            aftercare: [
                "Se réhydrater doucement et rester au repos jusqu'au retour complet de la coordination.",
                "Espacer fortement les usages pour limiter tolérance et atteintes urinaires.",
                "Consulter en cas de douleurs urinaires persistantes."
            ],
            rdr_rules: [
                "Rester assis ou allongé en sécurité ; ne jamais consommer seul, ni en hauteur ou près de l'eau.",
                "Attendre très longtemps avant toute redose : les effets peuvent monter tardivement.",
                "Ne pas mélanger avec d'autres dépresseurs."
            ]
        },
        stimulant: {
            effects: [
                "Énergie, éveil, confiance et désinhibition ; baisse de l'appétit et du sommeil.",
                "Accélération du cœur et de la respiration, tension, mâchoires serrées.",
                "Descente fréquente avec fatigue, irritabilité, baisse de moral et envie de re-doser."
            ],
            risk_factors: [
                "Usage en rafales et redoses rapprochées : épuisement, hausse de la tension et de la température.",
                "Quantités actives parfois très faibles pour certains produits de synthèse : surdosage facile.",
                "Problèmes cardiaques, hypertension, chaleur et déshydratation."
            ],
            avoid_if: [
                "Problème cardiaque ou de tension connu.",
                "Forte chaleur, effort physique intense sans hydratation, manque de sommeil.",
                "Association avec d'autres stimulants ou avec certains médicaments (antidépresseurs notamment)."
            ],
            warning_signs: [
                "Douleur thoracique, palpitations marquées, malaise, fièvre, confusion.",
                "Maux de tête violents, troubles de la vue ou de la parole.",
                "Agitation ou angoisse extrême qui ne redescend pas."
            ],
            aftercare: [
                "Récupérer en sommeil et en alimentation ; se réhydrater sans excès.",
                "Espacer largement les usages et repérer les usages compulsifs.",
                "Si l'usage devient difficile à contrôler, en parler à une structure d'aide."
            ],
            rdr_rules: [
                "Limiter les redoses et surveiller cœur, température et hydratation.",
                "Faire des pauses réelles entre les prises et entre les sessions.",
                "Ne pas combiner plusieurs stimulants ni forcer l'effort physique."
            ]
        },
        depressant: {
            effects: [
                "Détente, somnolence, ralentissement de la respiration et des réflexes.",
                "Baisse de l'anxiété, parfois euphorie, troubles de la mémoire et de la coordination.",
                "Tolérance et dépendance qui s'installent avec l'usage répété."
            ],
            risk_factors: [
                "Dépression respiratoire, surtout en cas d'association entre dépresseurs (opioïdes + benzodiazépines + alcool).",
                "Perte de tolérance après une pause : une quantité auparavant supportée peut devenir dangereuse.",
                "Produits de pureté inconnue, parfois contaminés par des opioïdes de synthèse très puissants."
            ],
            avoid_if: [
                "Association avec un autre dépresseur (alcool, benzodiazépines, opioïdes).",
                "Seul, sans personne capable d'intervenir.",
                "Conduite ou activité nécessitant vigilance."
            ],
            warning_signs: [
                "Respiration très lente ou bruyante, lèvres ou ongles bleutés, impossibilité de réveiller la personne.",
                "Somnolence profonde ou perte de connaissance.",
                "Sevrage avec convulsions, confusion ou agitation sévère (benzodiazépines, gabapentinoïdes)."
            ],
            aftercare: [
                "Surveiller la personne jusqu'au retour à la normale ; position latérale de sécurité si elle somnole.",
                "Ne jamais arrêter brutalement un usage régulier de benzodiazépines ou de gabapentinoïdes sans avis médical.",
                "En cas de dépendance, chercher un accompagnement médical."
            ],
            rdr_rules: [
                "Ne jamais mélanger plusieurs dépresseurs : c'est la principale cause de surdoses mortelles.",
                "Pour les opioïdes : disposer de naloxone si possible et ne pas consommer seul.",
                "Tenir compte de la perte de tolérance après toute pause."
            ]
        },
        empathogen: {
            effects: [
                "Ouverture émotionnelle, empathie, énergie et stimulation sensorielle.",
                "Hausse de la température, du rythme cardiaque et de la tension ; mâchoires serrées.",
                "Composante psychédélique possible : modifications perceptives selon la molécule."
            ],
            risk_factors: [
                "Surchauffe et déshydratation en milieu chaud et dansant ; à l'inverse, excès d'eau sans apport en sels.",
                "Durée longue et redoses qui aggravent la descente et la charge cardiaque.",
                "Association avec d'autres stimulants ou avec des antidépresseurs (risque sérotoninergique)."
            ],
            avoid_if: [
                "Problème cardiaque, forte chaleur ou prise d'antidépresseurs.",
                "Effort physique intense prolongé sans pause ni hydratation adaptée.",
                "Association avec d'autres stimulants ou empathogènes."
            ],
            warning_signs: [
                "Température très élevée, malaise, confusion, raideur musculaire.",
                "Maux de tête violents, douleur thoracique, perte de connaissance.",
                "Agitation ou angoisse extrême."
            ],
            aftercare: [
                "Se rafraîchir, se reposer et se réhydrater avec un apport en sels.",
                "Espacer fortement les usages pour limiter la descente et la charge sur l'organisme.",
                "Prévoir une récupération calme sur plusieurs jours."
            ],
            rdr_rules: [
                "Surveiller température et hydratation (par petites gorgées, sans excès).",
                "Limiter fortement les redoses et faire des pauses entre les sessions.",
                "Éviter de combiner avec d'autres stimulants."
            ]
        },
        cannabinoid: {
            effects: [
                "Modification de l'humeur, de la perception du temps et de l'appétit ; détente ou au contraire anxiété selon le produit et le contexte.",
                "Bouche sèche, yeux rouges, accélération possible du rythme cardiaque, somnolence ou vertiges.",
                "Avec les cannabinoïdes de synthèse ou semi-synthétiques, des effets bien plus imprévisibles et parfois disproportionnés."
            ],
            risk_factors: [
                "Produits semi-synthétiques mal caractérisés, dosés de façon inégale et de pureté variable.",
                "Antécédents personnels ou familiaux de troubles psychotiques ou d'anxiété sévère.",
                "Consommation à jeun, fatigue, stress ou association à l'alcool."
            ],
            avoid_if: [
                "Conduite ou activité nécessitant attention et coordination.",
                "État anxieux, contexte imprévisible ou obligation importante ensuite.",
                "Grossesse, adolescence ou antécédents psychiatriques sans avis professionnel."
            ],
            warning_signs: [
                "Crise d'angoisse ou de paranoïa qui ne redescend pas, confusion importante.",
                "Malaise, douleur thoracique ou vomissements répétés (parfois cycliques avec l'usage chronique).",
                "Avec l'inhalation de produits synthétiques, gêne respiratoire ou toux inhabituelle."
            ],
            aftercare: [
                "Se poser au calme, s'hydrater par petites gorgées et manger léger.",
                "Éviter d'enchaîner ; repérer un usage quotidien qui devient automatique.",
                "Si l'usage sert à dormir ou à gérer l'anxiété en continu, en parler à un professionnel."
            ],
            rdr_rules: [
                "Se méfier des cannabinoïdes de synthèse/semi-synthétiques « légaux » : effets imprévisibles, commencer très prudemment.",
                "Éviter l'association à l'alcool (malaises) et la conduite.",
                "Privilégier des produits identifiés et espacer les usages."
            ]
        },
        other: {
            effects: [
                "Profil atypique et souvent imprévisible selon la substance (sédation, délire, distorsions, état onirique).",
                "Effets fréquemment désagréables : confusion, amnésie, nausées, agitation.",
                "Frontière floue entre dose « active » et dose toxique pour beaucoup de ces produits."
            ],
            risk_factors: [
                "Identité et concentration très difficiles à vérifier (plantes, champignons, médicaments détournés).",
                "Marge de sécurité étroite et effets retardés propices au surdosage.",
                "Antécédents cardiaques ou psychiatriques selon la substance."
            ],
            avoid_if: [
                "Seul, sans personne sobre capable d'intervenir.",
                "Conduite, hauteur, eau ou environnement non sécurisé.",
                "Association à d'autres psychoactifs ou à des médicaments."
            ],
            warning_signs: [
                "Confusion ou délire qui ne redescend pas, agitation incontrôlable, hallucinations angoissantes.",
                "Fièvre, bouche très sèche, cœur très rapide, rétention urinaire (signes anticholinergiques).",
                "Douleur thoracique, convulsions ou perte de connaissance."
            ],
            aftercare: [
                "Rester dans un lieu calme et surveillé jusqu'au retour complet à la normale.",
                "S'hydrater, se reposer et éviter d'enchaîner les expériences.",
                "Consulter si les symptômes physiques persistent ou inquiètent."
            ],
            rdr_rules: [
                "Considérer ces produits comme imprévisibles : commencer très prudemment et ne jamais consommer seul.",
                "Vérifier l'identité réelle (confusions fréquentes, notamment avec les champignons ou les plantes).",
                "Ne pas mélanger et garder une personne sobre à proximité."
            ]
        }
    };

    var SHARED = {
        dosage_warning: "Fiche de référence sans posologie : Seuil n'intègre volontairement aucun palier de dose, voie ni rythme pour cette entrée. Ne pas s'en servir pour choisir une quantité.",
        forms: ["Forme et pureté réelles à vérifier avant toute interprétation."],
        legal_status: "Statut juridique variable selon la molécule, le pays et l'évolution des classements. Cette fiche n'est pas un avis juridique.",
        metabolism: "Métabolisme spécifique non documenté dans cette fiche. Vérifier les sources médicales ou pharmaceutiques, surtout en cas de traitement, maladie hépatique ou maladie rénale.",
        dosages: { unit: "non renseigné", threshold: "Non documenté", light: "Non documenté", common: "Non documenté", strong: "Non documenté", heavy: "Non documenté" },
        durations: { onset: "Non documenté", comeup: "Non documenté", peak: "Non documenté", offset: "Non documenté", total: "Non documenté" }
    };

    // ~20 entrées courantes absentes des fiches de base. Descriptions rédigées par Seuil.
    var ENTRIES = [
        { id: "1p_lsd", name: "1P-LSD", category: "Psychédélique (lysergamide)", class: "psychedelic", aliases: ["1-propionyl-LSD"],
          description: "Lysergamide proche du LSD, le plus souvent vendu sur buvard. Son profil subjectif est généralement décrit comme très voisin de celui du LSD ; sa diffusion tient surtout à un statut légal mouvant selon les pays." },
        { id: "2c_i", name: "2C-I", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine psychédélique de la famille des 2C, à composante visuelle marquée et légèrement stimulante. L'écart entre une dose active et une dose inconfortable est étroit." },
        { id: "2c_e", name: "2C-E", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine de la famille 2C réputée intense et introspective, avec une montée parfois éprouvante sur le plan physique. Très sensible aux variations de quantité." },
        { id: "doc", name: "DOC", category: "Psychédélique (amphétamine)", class: "psychedelic", aliases: [],
          description: "Amphétamine psychédélique à action très longue (souvent plus de douze heures) et puissante au milligramme. Sa durée et sa puissance exposent à des redoses mal évaluées." },
        { id: "mescaline", name: "Mescaline", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: ["peyotl", "san pedro"],
          description: "Phénéthylamine psychédélique présente naturellement dans certains cactus. Effets longs, à forte composante corporelle, avec des nausées fréquentes en début d'expérience." },
        { id: "4_aco_dmt", name: "4-AcO-DMT", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: ["psilacétine"],
          description: "Tryptamine de synthèse apparentée à la psilocybine, dont elle partage l'essentiel du profil. Souvent rencontrée en poudre ou en gélules, ce qui rend l'auto-dosage incertain." },
        { id: "nbome_25i", name: "25I-NBOMe", category: "Psychédélique (NBOMe)", class: "psychedelic", aliases: ["25I", "N-bomb"],
          description: "Psychédélique de synthèse extrêmement puissant, actif sur buvard et fréquemment vendu à tort comme du LSD. Sa toxicité et sa faible marge de sécurité font de cette confusion une cause connue d'accidents graves." },

        { id: "mxe", name: "Méthoxétamine (MXE)", category: "Dissociatif", class: "dissociative", aliases: ["MXE"],
          description: "Dissociatif de synthèse apparenté à la kétamine, mais à action plus longue et plus difficile à doser. Les surdoses dissociatives et les pertes de repères sont fréquemment rapportées." },
        { id: "3_meo_pcp", name: "3-MeO-PCP", category: "Dissociatif", class: "dissociative", aliases: ["3-MeO"],
          description: "Dissociatif de la famille de la PCP, puissant et stimulant, à marge étroite. Les effets peuvent monter par paliers tardifs, ce qui favorise des redoses dangereuses." },
        { id: "dxm", name: "Dextrométhorphane (DXM)", category: "Dissociatif (antitussif détourné)", class: "dissociative", aliases: ["DXM"],
          description: "Antitussif courant aux effets dissociatifs à forte quantité. Souvent associé dans les sirops à d'autres principes actifs (paracétamol, antihistaminiques) qui deviennent toxiques aux quantités détournées." },

        { id: "mephedrone", name: "Méphédrone (4-MMC)", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["4-MMC", "miaow"],
          description: "Cathinone de synthèse à la fois stimulante et empathogène, de durée courte, ce qui pousse au re-dosage compulsif. La consommation en rafales accentue descente et épuisement." },
        { id: "mdpv", name: "MDPV", category: "Stimulant (cathinone)", class: "stimulant", aliases: [],
          description: "Cathinone de synthèse très puissante et de longue durée, fortement associée à l'usage compulsif, à l'insomnie et à l'agitation. Active à de très faibles quantités." },
        { id: "methylphenidate", name: "Méthylphénidate", category: "Stimulant (médicament détourné)", class: "stimulant", aliases: ["Ritaline", "Concerta"],
          description: "Stimulant prescrit dans le TDAH, parfois détourné. Hors cadre médical, il expose aux mêmes risques cardiovasculaires et de dépendance que les autres stimulants." },

        { id: "mda", name: "MDA", category: "Empathogène / psychédélique", class: "empathogen", aliases: ["sass"],
          description: "Proche de la MDMA mais à composante psychédélique et stimulante plus marquée, et à durée plus longue. La charge sur le cœur et la thermorégulation est au moins aussi importante que celle de la MDMA." },

        { id: "heroine", name: "Héroïne", category: "Opioïde", class: "depressant", aliases: ["diamorphine"],
          description: "Opioïde puissant à action rapide et à fort potentiel de dépendance. Le risque majeur est la dépression respiratoire, très aggravée par l'association à l'alcool ou aux benzodiazépines et par une contamination aux opioïdes de synthèse." },
        { id: "oxycodone", name: "Oxycodone", category: "Opioïde (médicament détourné)", class: "depressant", aliases: ["OxyContin"],
          description: "Opioïde analgésique sur ordonnance, parfois détourné. Les formes à libération prolongée écrasées ou détournées exposent à un surdosage rapide et à la dépression respiratoire." },
        { id: "codeine", name: "Codéine", category: "Opioïde (médicament détourné)", class: "depressant", aliases: [],
          description: "Opioïde faible présent dans certains antalgiques et antitussifs. Le détournement à fortes quantités cumule le risque opioïde et la toxicité des autres principes actifs associés (paracétamol notamment)." },
        { id: "kratom", name: "Kratom", category: "Opioïde végétal", class: "depressant", aliases: ["mitragyna speciosa"],
          description: "Plante dont les alcaloïdes agissent sur les récepteurs opioïdes : plutôt stimulant à faible quantité, plutôt sédatif à quantité plus élevée. Dépendance et interactions possibles, notamment avec d'autres dépresseurs." },
        { id: "phenibut", name: "Phénibut", category: "Dépresseur (GABAergique)", class: "depressant", aliases: [],
          description: "Dérivé du GABA aux effets anxiolytiques et sédatifs, à tolérance qui s'installe vite. L'arrêt après un usage répété peut provoquer un sevrage marqué ; l'association aux autres dépresseurs est risquée." },
        { id: "pregabaline", name: "Prégabaline", category: "Dépresseur (gabapentinoïde)", class: "depressant", aliases: ["Lyrica"],
          description: "Médicament gabapentinoïde prescrit (douleurs, anxiété), parfois détourné. Sédatif, il majore fortement l'effet dépresseur des opioïdes, de l'alcool et des benzodiazépines, avec un risque respiratoire." },

        // - Psychédéliques (lysergamides, phénéthylamines, tryptamines, NBOMe) -
        { id: "ald_52", name: "ALD-52 (1A-LSD)", category: "Psychédélique (lysergamide)", class: "psychedelic", aliases: ["1A-LSD"],
          description: "Lysergamide acétylé proche du LSD, au profil très voisin ; diffusé surtout pour des raisons de statut légal mouvant." },
        { id: "al_lad", name: "AL-LAD", category: "Psychédélique (lysergamide)", class: "psychedelic", aliases: [],
          description: "Lysergamide apparenté au LSD, souvent décrit comme un peu plus visuel, plus court et moins anxiogène pour certains ; reste sensible à la quantité." },
        { id: "eth_lad", name: "ETH-LAD", category: "Psychédélique (lysergamide)", class: "psychedelic", aliases: [],
          description: "Lysergamide réputé puissant et chargé émotionnellement, parfois plus physique que le LSD ; très sensible aux faibles variations de quantité." },
        { id: "1cp_lsd", name: "1cP-LSD", category: "Psychédélique (lysergamide)", class: "psychedelic", aliases: [],
          description: "Lysergamide proche du 1P-LSD et du LSD, vendu sur buvard pour des raisons de statut légal ; profil considéré comme très voisin du LSD." },
        { id: "lsa", name: "LSA (graines)", category: "Psychédélique (lysergamide naturel)", class: "psychedelic", aliases: ["ergine", "rose hawaïenne", "liseron"],
          description: "Alcaloïde lysergamide présent dans certaines graines (liseron, rose hawaïenne). Effets psychédéliques plus corporels et sédatifs que le LSD, avec des nausées marquées." },
        { id: "dob", name: "DOB", category: "Psychédélique (amphétamine)", class: "psychedelic", aliases: [],
          description: "Amphétamine psychédélique très puissante au milligramme et à action très longue ; la montée lente favorise des redoses dangereuses." },
        { id: "dom", name: "DOM (STP)", category: "Psychédélique (amphétamine)", class: "psychedelic", aliases: ["STP"],
          description: "Amphétamine psychédélique puissante et de très longue durée ; quantités actives faibles et marge étroite." },
        { id: "doi", name: "DOI", category: "Psychédélique (amphétamine)", class: "psychedelic", aliases: [],
          description: "Amphétamine psychédélique de très longue durée, puissante au milligramme, à montée lente propice au surdosage par impatience." },
        { id: "2c_p", name: "2C-P", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine 2C parmi les plus puissantes et les plus longues, à montée très lente - d'où un risque élevé de surdosage si l'on redose par impatience." },
        { id: "2c_t_7", name: "2C-T-7", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine soufrée de la famille 2C-T, à montée lente et longue ; associée à des accidents lors de redoses ou de mélanges avec des MAOI." },
        { id: "2c_t_2", name: "2C-T-2", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine soufrée 2C-T, psychédélique et corporelle ; potentiellement dangereuse avec les inhibiteurs de la MAO." },
        { id: "2c_d", name: "2C-D", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine 2C plutôt douce et plus courte que d'autres 2C ; reste sensible à la quantité." },
        { id: "2c_b_fly", name: "2C-B-FLY", category: "Psychédélique (phénéthylamine)", class: "psychedelic", aliases: [],
          description: "Phénéthylamine de type « FLY ». A été confondue avec des analogues bien plus toxiques (Bromo-DragonFLY), d'où une vérification d'identité absolument cruciale." },
        { id: "5_meo_dmt", name: "5-MeO-DMT", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: ["venin de crapaud"],
          description: "Tryptamine extrêmement puissante et fulgurante (crapaud du Colorado ou synthèse). Effets très intenses et déstabilisants ; dangereuse en association avec des MAOI." },
        { id: "4_ho_met", name: "4-HO-MET", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: ["metocine"],
          description: "Tryptamine apparentée à la psilocine, souvent décrite comme visuelle et euphorisante ; en poudre, l'auto-dosage est incertain." },
        { id: "4_ho_mipt", name: "4-HO-MiPT", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: ["miprocine"],
          description: "Tryptamine proche de la psilocine, plutôt corporelle et sociale ; poudre difficile à doser avec précision." },
        { id: "5_meo_mipt", name: "5-MeO-MiPT", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: ["moxy"],
          description: "Tryptamine stimulante et psychédélique à composante corporelle marquée ; très sensible à la quantité." },
        { id: "dpt", name: "DPT", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: [],
          description: "Tryptamine psychédélique brève et souvent intense, au profil moins prévisible et plus déroutant que la psilocybine." },
        { id: "dipt", name: "DiPT", category: "Psychédélique (tryptamine)", class: "psychedelic", aliases: [],
          description: "Tryptamine atypique surtout connue pour distordre l'audition, avec peu d'effets visuels." },
        { id: "ibogaine", name: "Ibogaïne", category: "Psychédélique / oneirogène", class: "psychedelic", aliases: ["iboga"],
          description: "Alcaloïde de l'iboga aux effets oniriques très longs. Présente une cardiotoxicité réelle (troubles du rythme) qui en fait l'un des psychédéliques les plus risqués physiquement ; jamais sans surveillance médicale." },
        { id: "nbome_25c", name: "25C-NBOMe", category: "Psychédélique (NBOMe)", class: "psychedelic", aliases: ["25C"],
          description: "NBOMe puissant actif sur buvard, souvent vendu à tort comme du LSD. Toxicité et marge étroite : la confusion avec le LSD est une cause connue d'accidents graves." },
        { id: "nbome_25b", name: "25B-NBOMe", category: "Psychédélique (NBOMe)", class: "psychedelic", aliases: ["25B"],
          description: "NBOMe psychédélique puissant et potentiellement toxique, fréquemment confondu avec du LSD sur buvard." },

        // - Dissociatifs -
        { id: "pcp", name: "Phencyclidine (PCP)", category: "Dissociatif", class: "dissociative", aliases: ["angel dust"],
          description: "Dissociatif puissant à la réputation imprévisible : désorientation, agitation et risques comportementaux marqués, surtout à forte quantité." },
        { id: "2_fdck", name: "2-FDCK", category: "Dissociatif", class: "dissociative", aliases: ["2-fluorodeschlorokétamine"],
          description: "Dissociatif analogue fluoré de la kétamine, au profil voisin mais moins documenté ; auto-dosage incertain en poudre." },
        { id: "dck", name: "Deschlorokétamine (DCK)", category: "Dissociatif", class: "dissociative", aliases: ["DCK"],
          description: "Analogue de la kétamine plus puissant et plus long, avec un risque accru de « trou » dissociatif et de surdosage." },
        { id: "o_pce", name: "O-PCE", category: "Dissociatif", class: "dissociative", aliases: ["eticyclidone"],
          description: "Dissociatif de la famille de la PCP, puissant et stimulant, à montée par paliers propice aux redoses dangereuses." },
        { id: "3_ho_pcp", name: "3-HO-PCP", category: "Dissociatif", class: "dissociative", aliases: [],
          description: "Dissociatif puissant de la famille PCP doté d'une composante opioïde, ce qui ajoute un risque de dépression respiratoire." },
        { id: "diphenidine", name: "Diphénidine", category: "Dissociatif", class: "dissociative", aliases: ["DPD"],
          description: "Dissociatif long et puissant à marge étroite ; ses effets retardés favorisent les redoses dangereuses." },
        { id: "mxp", name: "Méthoxphénidine (MXP)", category: "Dissociatif", class: "dissociative", aliases: ["2-MeO-diphénidine"],
          description: "Dissociatif de type diarylethylamine, long et difficile à doser ; plusieurs intoxications rapportées." },
        { id: "salvia", name: "Salvia divinorum", category: "Dissociatif / atypique", class: "dissociative", aliases: ["salvinorine A"],
          description: "Plante dont la salvinorine A provoque des effets dissociatifs très intenses et brefs, souvent déroutants voire effrayants ; à n'utiliser qu'assis, accompagné et en sécurité." },

        // - Stimulants (cathinones, amphétamines fluorées, eugéroïques, plantes) -
        { id: "a_pvp", name: "α-PVP", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["alpha-PVP", "flakka"],
          description: "Cathinone de synthèse très puissante, fortement associée à l'usage compulsif, l'insomnie et l'agitation ; active à faible quantité." },
        { id: "a_php", name: "α-PHP", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["alpha-PHP"],
          description: "Cathinone stimulante de synthèse à fort potentiel compulsif et insomniant." },
        { id: "3_mmc", name: "3-MMC", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["métaphédrone"],
          description: "Cathinone proche de la méphédrone, stimulante et empathogène, à durée courte qui pousse au re-dosage compulsif." },
        { id: "4_mec", name: "4-MEC", category: "Stimulant (cathinone)", class: "stimulant", aliases: [],
          description: "Cathinone stimulante apparentée à la méphédrone, avec descente marquée et envie de re-doser." },
        { id: "3_cmc", name: "3-CMC", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["clophédrone"],
          description: "Cathinone stimulante de diffusion récente, au profil proche des autres cathinones (compulsion, insomnie, anxiété)." },
        { id: "nep", name: "N-éthylpentédrone (NEP)", category: "Stimulant (cathinone)", class: "stimulant", aliases: [],
          description: "Cathinone stimulante puissante, à fort potentiel d'usage compulsif." },
        { id: "hexen", name: "Hexen (N-éthylhexédrone)", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["NEH"],
          description: "Cathinone stimulante de courte durée, propice aux rafales et à l'épuisement rapide." },
        { id: "eutylone", name: "Eutylone", category: "Stimulant (cathinone)", class: "stimulant", aliases: ["bk-EBDB"],
          description: "Cathinone stimulante fréquemment retrouvée comme adultérant vendu pour de la MDMA, avec insomnie et anxiété marquées." },
        { id: "2_fma", name: "2-FMA", category: "Stimulant (amphétamine fluorée)", class: "stimulant", aliases: [],
          description: "Amphétamine fluorée stimulante, parfois recherchée pour des effets « fonctionnels » ; reste un stimulant avec charge cardiovasculaire." },
        { id: "4_fa", name: "4-FA", category: "Stimulant (amphétamine fluorée)", class: "stimulant", aliases: ["4-FMP", "flux"],
          description: "Amphétamine fluorée à mi-chemin entre stimulant et empathogène ; associée à des maux de tête et à un risque cardiovasculaire/hémorragique signalé." },
        { id: "ethylphenidate", name: "Éthylphénidate", category: "Stimulant", class: "stimulant", aliases: ["EPH"],
          description: "Stimulant proche du méthylphénidate, souvent insufflé, à fort potentiel compulsif et irritant pour les muqueuses." },
        { id: "modafinil", name: "Modafinil", category: "Stimulant (eugéroïque)", class: "stimulant", aliases: ["Modiodal"],
          description: "Promoteur d'éveil prescrit (narcolepsie), détourné comme « stimulant cognitif » ; effet plus discret mais insomnie, anxiété et interactions médicamenteuses possibles." },
        { id: "nicotine", name: "Nicotine", category: "Stimulant", class: "stimulant", aliases: ["tabac", "e-liquide"],
          description: "Stimulant du tabac et des e-liquides, à très fort potentiel de dépendance. Effets cardiovasculaires et toxicité aiguë sérieuse en cas d'ingestion de liquide concentré." },
        { id: "ephedrine", name: "Éphédrine", category: "Stimulant", class: "stimulant", aliases: ["pseudoéphédrine"],
          description: "Sympathomimétique (décongestionnant, parfois dopant) à charge cardiovasculaire et tensionnelle ; risqué à l'effort et en mélange." },
        { id: "khat", name: "Khat", category: "Stimulant (cathinone végétale)", class: "stimulant", aliases: ["qat"],
          description: "Feuilles à mâcher contenant de la cathinone naturelle : stimulation, coupe-faim et dépendance avec l'usage régulier." },

        // - Empathogènes -
        { id: "methylone", name: "Méthylone (bk-MDMA)", category: "Empathogène (cathinone)", class: "empathogen", aliases: ["bk-MDMA", "M1"],
          description: "Cathinone aux effets empathogènes plus faibles et plus courts que la MDMA, mais avec une charge cardiovasculaire et thermique réelle." },
        { id: "ethylone", name: "Éthylone", category: "Empathogène (cathinone)", class: "empathogen", aliases: ["bk-MDEA"],
          description: "Cathinone empathogène-stimulante parfois vendue pour de la MDMA, à effets plus courts et plus stimulants." },
        { id: "6_apb", name: "6-APB", category: "Empathogène (benzofurane)", class: "empathogen", aliases: ["Benzo Fury"],
          description: "Empathogène-stimulant de la famille des benzofuranes, à durée longue : charge cardiovasculaire prolongée et redoses risquées." },
        { id: "5_apb", name: "5-APB", category: "Empathogène (benzofurane)", class: "empathogen", aliases: [],
          description: "Empathogène-stimulant benzofurane proche du 6-APB, long et chargeant pour le cœur." },
        { id: "mdea", name: "MDEA", category: "Empathogène", class: "empathogen", aliases: ["Eve"],
          description: "Empathogène proche de la MDMA aux effets un peu plus doux, mais aux mêmes risques cardiaques et de surchauffe." },

        // - Dépresseurs (précurseurs GHB, Z-drugs, benzodiazépines, myorelaxants, plantes) -
        { id: "gbl", name: "GBL", category: "Dépresseur (précurseur du GHB)", class: "depressant", aliases: ["gamma-butyrolactone"],
          description: "Solvant transformé en GHB par l'organisme : effets identiques au GHB mais montée plus rapide et marge encore plus étroite, d'où un risque élevé de surdosage et de coma." },
        { id: "bdo", name: "1,4-butanediol (BDO)", category: "Dépresseur (précurseur du GHB)", class: "depressant", aliases: ["1,4-B"],
          description: "Précurseur converti en GHB par l'organisme, aux mêmes risques (surdosage, coma) avec un délai d'action variable." },
        { id: "zolpidem", name: "Zolpidem", category: "Dépresseur (hypnotique « Z-drug »)", class: "depressant", aliases: ["Stilnox", "Ambien"],
          description: "Hypnotique apparenté aux benzodiazépines : amnésie, comportements automatiques et dépendance ; dangereux en mélange avec d'autres dépresseurs." },
        { id: "zopiclone", name: "Zopiclone", category: "Dépresseur (hypnotique « Z-drug »)", class: "depressant", aliases: ["Imovane"],
          description: "Hypnotique « Z-drug » proche des benzodiazépines, sédatif, avec dépendance et risque accru en association." },
        { id: "alprazolam", name: "Alprazolam", category: "Dépresseur (benzodiazépine)", class: "depressant", aliases: ["Xanax"],
          description: "Benzodiazépine puissante et d'action rapide : forte désinhibition/amnésie, dépendance rapide et danger majeur avec l'alcool ou les opioïdes." },
        { id: "diazepam", name: "Diazépam", category: "Dépresseur (benzodiazépine)", class: "depressant", aliases: ["Valium"],
          description: "Benzodiazépine de longue durée : sédation, dépendance et sevrage potentiellement sévère ; danger en mélange dépresseur." },
        { id: "clonazepam", name: "Clonazépam", category: "Dépresseur (benzodiazépine)", class: "depressant", aliases: ["Rivotril"],
          description: "Benzodiazépine longue et puissante, au même profil de dépendance et de risque en association." },
        { id: "etizolam", name: "Étizolam", category: "Dépresseur (thiénodiazépine)", class: "depressant", aliases: [],
          description: "Apparenté aux benzodiazépines, souvent vendu en comprimés mal dosés : risque de surdosage en mélange et de sevrage." },
        { id: "flualprazolam", name: "Flualprazolam", category: "Dépresseur (benzodiazépine de synthèse)", class: "depressant", aliases: [],
          description: "Benzodiazépine de synthèse très puissante, retrouvée dans de faux comprimés ; risque élevé de surdosage et de dépression respiratoire en mélange." },
        { id: "clonazolam", name: "Clonazolam", category: "Dépresseur (benzodiazépine de synthèse)", class: "depressant", aliases: [],
          description: "Benzodiazépine de synthèse extrêmement puissante, active à de très faibles quantités : amnésie et surdosage faciles." },
        { id: "gabapentine", name: "Gabapentine", category: "Dépresseur (gabapentinoïde)", class: "depressant", aliases: ["Neurontin"],
          description: "Gabapentinoïde prescrit (douleurs, épilepsie), parfois détourné ; sédatif, il majore l'effet dépresseur des opioïdes et le risque respiratoire." },
        { id: "baclofene", name: "Baclofène", category: "Dépresseur (myorelaxant)", class: "depressant", aliases: ["Lioresal"],
          description: "Myorelaxant agoniste GABA-B détourné pour ses effets ; sédation et surdosage potentiellement grave (dépression respiratoire, coma)." },
        { id: "carisoprodol", name: "Carisoprodol", category: "Dépresseur (myorelaxant)", class: "depressant", aliases: ["Soma"],
          description: "Myorelaxant métabolisé en méprobamate, sédatif et dépendogène ; dangereux en mélange avec d'autres dépresseurs." },
        { id: "kava", name: "Kava", category: "Dépresseur (plante anxiolytique)", class: "depressant", aliases: ["kava-kava"],
          description: "Plante du Pacifique aux effets relaxants et anxiolytiques ; hépatotoxicité possible en usage intensif ou avec des produits de mauvaise qualité." },
        { id: "amanite", name: "Amanite tue-mouches", category: "Atypique (muscimol)", class: "depressant", aliases: ["amanita muscaria", "muscimol"],
          description: "Champignon contenant muscimol et acide iboténique : effets sédatifs et oniriques atypiques, nausées et confusion. À ne jamais confondre avec d'autres amanites mortelles." },

        // - Opioïdes -
        { id: "morphine", name: "Morphine", category: "Opioïde", class: "depressant", aliases: [],
          description: "Opioïde de référence : analgésie, sédation et surtout dépression respiratoire, très aggravée par l'alcool et les benzodiazépines." },
        { id: "methadone", name: "Méthadone", category: "Opioïde (substitution)", class: "depressant", aliases: [],
          description: "Opioïde de substitution à action très longue : le risque respiratoire est différé et cumulatif, d'où des surdoses tardives, surtout en mélange." },
        { id: "buprenorphine", name: "Buprénorphine", category: "Opioïde (substitution)", class: "depressant", aliases: ["Subutex", "Suboxone"],
          description: "Opioïde de substitution à effet « plafond » sur la respiration, plus sûr seul mais dangereux avec les benzodiazépines ; peut précipiter un manque." },
        { id: "hydromorphone", name: "Hydromorphone", category: "Opioïde (médicament détourné)", class: "depressant", aliases: ["Sophidone"],
          description: "Opioïde puissant sur ordonnance, à fort risque respiratoire, notamment détourné par injection." },
        { id: "tapentadol", name: "Tapentadol", category: "Opioïde", class: "depressant", aliases: ["Palexia"],
          description: "Antalgique opioïde à composante noradrénergique : risque opioïde classique, plus un risque sérotoninergique en mélange." },
        { id: "o_dsmt", name: "O-DSMT", category: "Opioïde de synthèse", class: "depressant", aliases: ["O-desméthyltramadol"],
          description: "Métabolite actif du tramadol vendu comme opioïde de synthèse : dépression respiratoire, et risque de convulsions/sérotoninergique." },
        { id: "tianeptine", name: "Tianeptine", category: "Atypique (effet opioïde à forte dose)", class: "depressant", aliases: ["Stablon"],
          description: "Antidépresseur atypique qui agit comme un opioïde à forte quantité : dépendance et surdosage possibles, parfois vendu en « complément »." },
        { id: "loperamide", name: "Lopéramide", category: "Opioïde (médicament détourné)", class: "depressant", aliases: ["Imodium"],
          description: "Antidiarrhéique opioïde qui, détourné à très haute quantité, expose à de graves troubles du rythme cardiaque parfois mortels." },

        // - Cannabinoïdes (semi-synthétiques et apparentés) -
        { id: "hhc", name: "HHC", category: "Cannabinoïde (semi-synthétique)", class: "cannabinoid", aliases: ["hexahydrocannabinol"],
          description: "Cannabinoïde semi-synthétique vendu comme « légal », aux effets proches du THC mais mal caractérisés et de pureté très variable." },
        { id: "thco", name: "THC-O", category: "Cannabinoïde (semi-synthétique)", class: "cannabinoid", aliases: ["THC-O-acétate"],
          description: "Ester semi-synthétique du THC, plus puissant et à montée retardée. Inhalé en vape, il a été associé à des atteintes pulmonaires." },
        { id: "delta8", name: "Delta-8-THC", category: "Cannabinoïde", class: "cannabinoid", aliases: ["Δ8-THC"],
          description: "Isomère du THC un peu moins puissant, souvent produit à partir de CBD avec des impuretés de synthèse possibles." },
        { id: "thcp", name: "THCP", category: "Cannabinoïde", class: "cannabinoid", aliases: [],
          description: "Cannabinoïde nettement plus puissant que le THC à poids égal : effets faciles à sous-estimer, surtout en comestible." },
        { id: "cbc", name: "CBC", category: "Cannabinoïde (non enivrant)", class: "cannabinoid", aliases: ["cannabichromene", "cannabichromène"],
          description: "Cannabinoïde végétal mineur du cannabis, peu ou pas enivrant seul. Les données humaines restent limitées ; la teneur réelle dépend fortement du produit." },
        { id: "cbd", name: "CBD", category: "Cannabinoïde (non enivrant)", class: "cannabinoid", aliases: ["cannabidiol"],
          description: "Cannabinoïde non enivrant (pas d'effet planant), mais avec des interactions médicamenteuses possibles et une qualité/étiquetage très variables." },

        // - Déliriants / atypiques -
        { id: "dph", name: "Diphénhydramine (DPH)", category: "Déliriant (antihistaminique)", class: "other", aliases: ["Benadryl"],
          description: "Antihistaminique courant qui, à forte quantité, provoque un délire anticholinergique très désagréable et dangereux (cœur, hyperthermie, confusion)." },
        { id: "datura", name: "Datura / scopolamine", category: "Déliriant (anticholinergique)", class: "other", aliases: ["belladone", "stramoine"],
          description: "Plante anticholinergique provoquant un délire intense et dangereux, avec amnésie, tachycardie et risque vital ; dose impossible à maîtriser." },
        { id: "nutmeg", name: "Noix de muscade", category: "Atypique (myristicine)", class: "other", aliases: ["myristicine"],
          description: "Épice qui, à forte quantité, donne des effets atypiques très retardés et une longue gueule de bois désagréable, avec nausées marquées ; faible intérêt récréatif." }
    ];

    // Données détaillées par substance (paliers, durées, profil, conseils ciblés),
    // chargées depuis substances-data.js. À défaut, repli sur les repères de famille.
    var RICH = (typeof window !== "undefined" && window.SEUIL_RICH) || {};

    ENTRIES.forEach(function (e) {
        if (SUBSTANCE_DB[e.id]) {
            if (!SUBSTANCE_DB[e.id].id) SUBSTANCE_DB[e.id].id = e.id;
            return; // ne jamais écraser une fiche existante
        }
        var fam = FAMILY[e.class] || FAMILY.psychedelic;
        var rich = RICH[e.id] || null;
        var aliases = (e.aliases && e.aliases.length ? e.aliases.slice() : []);

        var entry = {
            id: e.id,
            name: e.name,
            category: e.category,
            class: e.class,
            description: e.description,
            aliases: aliases.slice(0, 8),
            forms: (rich && rich.forms) || SHARED.forms.slice(),
            legal_status: (rich && rich.legal_status) || SHARED.legal_status,
            metabolism: (rich && rich.metabolism) || SHARED.metabolism,
            effects: (rich && rich.effects) || fam.effects,
            risk_factors: (rich && rich.risk_factors) || fam.risk_factors,
            avoid_if: (rich && rich.avoid_if) || fam.avoid_if,
            warning_signs: (rich && rich.warning_signs) || fam.warning_signs,
            aftercare: (rich && rich.aftercare) || fam.aftercare,
            rdr_rules: (rich && rich.rdr_rules) || fam.rdr_rules
        };

        if (rich) {
            // Fiche enrichie : paliers, durées et courbe d'effets disponibles.
            Object.keys(rich).forEach(function (field) {
                entry[field] = rich[field];
            });
            if (!entry.dosages) entry.dosages = Object.assign({}, SHARED.dosages);
            if (!entry.durations) entry.durations = Object.assign({}, SHARED.durations);
        } else {
            // Repli : fiche condensée sans posologie (répertoire de référence).
            entry.isExtendedEntry = true;
            entry.aliases = entry.aliases.concat("Fiche condensée").slice(0, 8);
            entry.dosages = Object.assign({}, SHARED.dosages);
            entry.durations = Object.assign({}, SHARED.durations);
            entry.dosage_warning = SHARED.dosage_warning;
        }

        SUBSTANCE_DB[e.id] = entry;
    });

    Object.keys(SUBSTANCE_DB).forEach(function (id) {
        if (SUBSTANCE_DB[id] && !SUBSTANCE_DB[id].id) SUBSTANCE_DB[id].id = id;
        if (SUBSTANCE_DB[id] && !SUBSTANCE_DB[id].metabolism && !SUBSTANCE_DB[id].omit_quantitative_tables) {
            SUBSTANCE_DB[id].metabolism = SHARED.metabolism;
        }
    });

    delete SUBSTANCE_DB.ibogaine;
    if (RICH && RICH.ibogaine) delete RICH.ibogaine;
})();
