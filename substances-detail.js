/*
 * substances-detail.js - Contenu narratif de réduction des risques par substance.
 *
 * Pour chaque substance : effets subjectifs, facteurs de risque, contextes à
 * éviter, récupération/suivi après coup et règles prioritaires de réduction des
 * risques. Repères convergents avec les sources publiques de RdR (PsychonautWiki,
 * TripSit, addictovigilance) ; informatif et NON prescriptif.
 *
 * Appliqué par-dessus toutes les fiches (db.js + répertoire élargi).
 */
(function () {
    "use strict";
    var DETAIL = {
    "1cp_lsd": {
        "effects": [
            "Le vécu est rapporté comme très semblable au LSD : altération visuelle, vagues de pensées et coloration émotionnelle intense.",
            "Certains usagers décrivent une montée un peu plus franche, mais elle peut tout de même s'installer par paliers trompeurs.",
            "La stimulation corporelle est nette : éveil, pupilles dilatées, parfois légère tension, sommeil repoussé.",
            "L'orientation euphorie/anxiété dépend largement du moral et de l'environnement au moment de la montée.",
            "La phase de descente est longue et l'endormissement reste difficile en fin de parcours."
        ],
        "risk_factors": [
            "Comme les autres lysergamides, c'est un buvard dont la quantité exacte est invisible et variable d'une production à l'autre.",
            "Les interactions classiques des lysergamides restent valables : danger avec le lithium (convulsions) et imprévisibilité avec les IMAO.",
            "La montée par paliers entretient la tentation des redoses, qui se cumulent en surdose d'effet.",
            "Sa large diffusion comme produit « de recherche » peut faire oublier qu'il s'agit d'un psychédélique aussi puissant que le LSD."
        ],
        "avoid_if": [
            "Si ta situation psychique est fragile, ou en présence d'antécédents personnels ou familiaux de psychose ou de bipolarité.",
            "Si tu prends du lithium, un IMAO ou un médicament psychiatrique dont l'interaction n'a pas été vérifiée.",
            "Si l'environnement n'est pas sûr et apaisant ou si tu manques de temps libre devant toi."
        ],
        "aftercare": [
            "Garde une journée tranquille après coup, car le sommeil revient tard et la fatigue peut durer.",
            "Bois de l'eau, mange simplement au retour de l'appétit, et reporte les tâches qui demandent de la concentration.",
            "Reste attentif à ton humeur les jours suivants et cherche du soutien si quelque chose te pèse."
        ],
        "rdr_rules": [
            "Pars du principe que le dosage d'un buvard est incertain : commence bas et laisse le temps faire.",
            "Proscris le lithium et les IMAO, et vérifie systématiquement tes traitements.",
            "Ne redose pas sur une montée lente : attends qu'elle soit complète avant toute conclusion.",
            "Construis un cadre rassurant et entoure-toi de personnes fiables pour les moments plus intenses."
        ]
    },
    "1p_lsd": {
        "effects": [
            "Les effets sont décrits comme très proches de ceux du LSD : montée progressive, visuels mouvants et pensée associative, ce qui rend la distinction subtile à l'usage.",
            "La montée peut s'installer lentement et par paliers, donnant la fausse impression d'un buvard sous-dosé.",
            "Le corps reste stimulé, avec pupilles dilatées et une vigilance qui éloigne le sommeil pendant de longues heures.",
            "L'humeur module fortement le vécu : selon le contexte, la même intensité penche vers l'euphorie lumineuse ou vers l'inconfort anxieux.",
            "La fin d'expérience s'étire, avec une excitation résiduelle qui retarde l'endormissement."
        ],
        "risk_factors": [
            "C'est un promédicament qui se transforme en LSD dans l'organisme : sa puissance est comparable, mais le buvard reste un objet dont on ne connaît jamais la dose réelle.",
            "Les associations dangereuses du LSD s'appliquent : le lithium expose à un risque de convulsions et les IMAO rendent l'effet imprévisible.",
            "La montée parfois lente pousse aux redoses, qui s'additionnent ensuite en une expérience trop intense.",
            "Le statut « non classé » dans certains pays banalise le produit alors que la prudence requise reste celle d'un psychédélique puissant."
        ],
        "avoid_if": [
            "Si tu vis une période instable sur le plan psychique, ou en cas d'antécédents personnels ou familiaux de psychose ou de trouble bipolaire.",
            "Si tu es sous lithium, sous IMAO ou sous traitement psychiatrique non vérifié.",
            "Si le cadre n'est pas calme et sécurisant, ou si tu n'as pas plusieurs heures libres devant toi."
        ],
        "aftercare": [
            "Réserve le lendemain au repos : le sommeil tarde et la récupération demande du temps.",
            "Hydrate-toi, alimente-toi légèrement dès que la faim revient, et évite d'enchaîner sur des situations exigeantes.",
            "Observe ton état émotionnel dans les jours qui suivent et parle-en si une gêne persiste."
        ],
        "rdr_rules": [
            "Traite-le exactement comme du LSD : dose réelle inconnue sur un buvard, donc prudence et patience avant tout.",
            "Évite formellement le lithium et les IMAO et contrôle tes traitements en cours.",
            "Attends la pleine montée avant de juger de l'intensité, pour ne pas redoser sur une fausse impression de faiblesse.",
            "Mise sur le set & setting et la présence de personnes de confiance pour traverser sereinement les pics émotionnels."
        ]
    },
    "2_fdck": {
        "effects": [
            "Dissociation proche de la kétamine : détachement du corps, esprit qui semble se distancier de la réalité.",
            "Distorsions de l'espace, du temps et des sons, avec une montée qui peut sembler un peu plus progressive.",
            "Euphorie et engourdissement corporel, jusqu'à un état immobilisant proche du K-hole à doses plus fortes.",
            "Perte de coordination et d'équilibre, démarche incertaine et risque de chute.",
            "Profil encore peu documenté : les effets et leur durée varient et restent en partie imprévisibles."
        ],
        "risk_factors": [
            "Documentation limitée : la puissance réelle et la durée sont mal connues, ce qui rend chaque usage incertain.",
            "Mélange avec alcool, opioïdes ou benzodiazépines, qui additionne la sédation et le risque de fausse route.",
            "Position debout pendant la montée, exposant aux chutes du fait de la perte de coordination.",
            "Comme pour la kétamine, un usage répété fait courir un risque d'atteinte de la vessie."
        ],
        "avoid_if": [
            "Tu es seul, sans personne pour intervenir en cas de vomissement ou de perte de repères.",
            "Tu attends de ce produit peu documenté qu'il se comporte exactement comme la kétamine.",
            "Tu as des fragilités cardiaques, urinaires ou psychiques préexistantes."
        ],
        "aftercare": [
            "Reste au calme et au chaud le temps que la coordination et la vigilance reviennent.",
            "Bois de l'eau et surveille les signes urinaires dans les jours qui suivent, comme avec la kétamine.",
            "Espace les usages et reste attentif au risque d'habitude, le profil étant proche d'une substance qui peut devenir compulsive."
        ],
        "rdr_rules": [
            "Reste assis ou allongé sur le côté pendant toute la durée des effets pour éviter chutes et fausse route.",
            "Ne mélange jamais avec l'alcool, les opioïdes ou les benzodiazépines.",
            "Sois accompagné d'une personne sobre capable d'agir si tu vomis ou perds connaissance.",
            "Vu le peu de recul sur ce produit, considère sa puissance comme incertaine et ne redose pas dans l'urgence."
        ]
    },
    "2_fma": {
        "effects": [
            "La montée est progressive et discrète, suivie d'un long plateau de stimulation « propre » : clarté mentale, concentration et énergie, avec une euphorie modérée comparée à d'autres amphétamines.",
            "Le corps est sous tension sympathique : accélération du pouls, hausse de la tension, bouche sèche et baisse de l'appétit, parfois une légère sudation.",
            "La descente est lente et peut s'étirer sur des heures, avec fatigue mentale, irritabilité et difficulté à trouver le sommeil.",
            "L'effet « fonctionnel » donne une fausse impression de contrôle qui pousse à réitérer ou à enchaîner les tâches sans sentir l'épuisement réel.",
            "La bascule vers l'anxiété, l'agitation ou les palpitations peut survenir quand la stimulation cardiovasculaire monte, surtout en redosant."
        ],
        "risk_factors": [
            "La longue durée d'action favorise les redoses successives, qui empilent la charge cardiovasculaire et privent durablement de sommeil.",
            "Une fragilité cardiaque, une hypertension ou la prise d'autres stimulants (caféine, autres amphétamines) majorent fortement la tension sur le cœur.",
            "La déshydratation et l'effort physique prolongé sous l'effet aggravent l'emballement du pouls et la surchauffe.",
            "Le manque de sommeil accumulé sur plusieurs jours fragilise l'humeur et peut faire basculer vers l'anxiété ou la paranoïa."
        ],
        "avoid_if": [
            "Si tu as des antécédents cardiaques, une tension élevée ou des palpitations à l'effort.",
            "Si tu es en phase d'anxiété marquée, d'insomnie ou de grande fatigue accumulée.",
            "Si tu prends déjà d'autres stimulants ou des traitements agissant sur le cœur ou l'humeur."
        ],
        "aftercare": [
            "Prévois plusieurs nuits pour rattraper le sommeil et laisse l'appétit revenir avec des repas réguliers et hydratants.",
            "Surveille un éventuel coup de mou ou une irritabilité dans les jours qui suivent, et allège ton emploi du temps.",
            "Espace nettement les usages pour ne pas installer une habitude de stimulation quotidienne."
        ],
        "rdr_rules": [
            "Pose-toi une limite de durée et de redoses à l'avance, car la sensation de contrôle masque l'épuisement réel.",
            "Hydrate-toi régulièrement, fais des pauses au calme et surveille ton pouls : un cœur qui s'emballe ou une douleur thoracique imposent l'arrêt.",
            "Évite de cumuler avec caféine, énergisants ou autres stimulants pour ne pas surcharger le cœur.",
            "Réserve les dernières prises au début de journée pour préserver une fenêtre de sommeil."
        ]
    },
    "2c_b_fly": {
        "effects": [
            "Montée progressive sur une à deux heures vers un plateau psychédélique de plusieurs heures, souvent décrit comme plus doux qu'un NBOMe.",
            "Visuels colorés et géométriques accompagnés d'une stimulation corporelle et d'une légère excitation.",
            "Composante physique notable : frissons, tension, parfois sensation de fraîcheur dans les extrémités liée à la vasoconstriction.",
            "Tonalité émotionnelle généralement positive mais qui peut basculer vers l'inconfort si la quantité est mal évaluée."
        ],
        "risk_factors": [
            "Risque de confusion avec le Bromo-DragonFLY, bien plus puissant et toxique, responsable de vasoconstrictions sévères, de nécroses et de décès : c'est le danger majeur de cette molécule.",
            "Marge étroite et produit actif à faible quantité, ce qui rend l'estimation visuelle peu fiable.",
            "Vasoconstriction qui peut s'aggraver en cas d'erreur d'identification ou de redose.",
            "L'absence de vérification d'identité laisse passer une éventuelle substitution dangereuse."
        ],
        "avoid_if": [
            "Vous n'êtes pas certain qu'il s'agit bien de 2C-B-FLY et non de Bromo-DragonFLY.",
            "Vous avez des antécédents cardiovasculaires ou des troubles de la circulation.",
            "Vous ressentez déjà des extrémités froides, des fourmillements ou des douleurs aux mains et aux pieds."
        ],
        "aftercare": [
            "Reposez-vous et réchauffez doucement vos extrémités si elles sont restées froides pendant l'expérience.",
            "Hydratez-vous et observez le retour à la normale de la circulation et de la coloration de la peau.",
            "Consultez sans tarder si une douleur, une pâleur ou un engourdissement des extrémités persiste après la descente."
        ],
        "rdr_rules": [
            "Vérifiez impérativement l'identité réelle du produit avant tout : la confusion avec le Bromo-DragonFLY est le risque vital propre à cette molécule.",
            "Pesez précisément et commencez à quantité basse ; aucune redose tant que la montée n'est pas terminée.",
            "Surveillez les extrémités froides ou douloureuses, signe de vasoconstriction, et consultez si cela s'aggrave."
        ]
    },
    "2c_d": {
        "effects": [
            "Montée relativement rapide et durée plus courte que la plupart des autres 2C, ce qui en fait un effet plus maniable mais pas anodin.",
            "Effets visuels et de pensée plus discrets à faible quantité, qui deviennent nettement psychédéliques en haut de fourchette.",
            "Composante corporelle légère (frissons, petites nausées en montée) souvent moins lourde que celle des 2C soufrés.",
            "Tonalité émotionnelle qui peut basculer vers l'inconfort si la quantité est plus élevée que prévu, malgré la réputation de douceur."
        ],
        "risk_factors": [
            "La réputation « légère » incite à augmenter la quantité, alors que le produit reste sensible et marqué en haut de fourchette.",
            "En poudre, une petite erreur de pesée change beaucoup l'intensité ressentie.",
            "La confusion avec un 2C plus puissant (même aspect, même conditionnement) peut transformer une dose modérée en dose forte."
        ],
        "avoid_if": [
            "Votre état émotionnel est instable ou le contexte n'est pas sécurisant.",
            "Vous devez conduire, travailler ou rester pleinement vigilant.",
            "Vous comptez l'associer à d'autres psychoactifs sans en connaître les effets."
        ],
        "aftercare": [
            "Accordez-vous un temps de repos même si l'effet a paru court, la fatigue pouvant arriver après coup.",
            "Hydratez-vous et reprenez une alimentation normale une fois redescendu.",
            "Espacez les usages pour laisser la tolérance retomber et notez votre ressenti pour mieux ajuster ensuite."
        ],
        "rdr_rules": [
            "Commencez bas malgré la réputation « légère » : la fourchette haute peut surprendre.",
            "Attendez la montée complète avant d'envisager tout ajustement ; ne redosez pas dans les premières minutes.",
            "Vérifiez l'identité du produit pour ne pas le confondre avec un 2C beaucoup plus puissant."
        ]
    },
    "2c_e": {
        "effects": [
            "Décrit comme intense et profondément introspectif, avec une forte charge corporelle qui peut dominer une partie de l'expérience.",
            "La montée s'accompagne souvent d'un inconfort physique marqué (tension musculaire, nausée, frissons) avant que le mental ne s'installe.",
            "Les visuels et la pensée peuvent devenir très puissants, demandant une réelle capacité à lâcher prise.",
            "L'intensité rend le basculement vers l'anxiété ou l'overwhelm plus probable si le cadre ou l'état d'esprit ne suivent pas.",
            "La durée est longue et la descente laisse fréquemment une fatigue notable."
        ],
        "risk_factors": [
            "Phénéthylamine puissante à marge étroite : un faible écart de quantité change radicalement l'intensité, et la pesée à l'œil est dangereuse.",
            "La forte charge corporelle peut être éprouvante et générer un inconfort physique marqué.",
            "L'association avec un IMAO est déconseillée et le mélange avec des stimulants aggrave la tension.",
            "L'intensité et la durée majorent le risque de bad trip si l'environnement ou la préparation mentale sont insuffisants."
        ],
        "avoid_if": [
            "Si tu débutes avec les psychédéliques ou si tu es psychiquement fragilisé.",
            "Si tu prends un IMAO ou un traitement psychiatrique non vérifié, ou en cas d'antécédents de psychose ou de bipolarité.",
            "Si tu n'es pas dans un cadre sûr, calme et accompagné, avec du temps devant toi."
        ],
        "aftercare": [
            "Prévois un vrai temps de récupération, la charge corporelle et la durée pouvant laisser épuisé.",
            "Hydrate-toi, mange léger au retour de l'appétit et évite les efforts importants le lendemain.",
            "Reste attentif à ton état physique et émotionnel les jours suivants et parle d'un éventuel contrecoup."
        ],
        "rdr_rules": [
            "Considère sa marge comme particulièrement étroite : commence très prudemment et ne juge jamais l'intensité avant la montée complète.",
            "Évite absolument la pesée approximative, un petit écart pouvant transformer l'expérience.",
            "Proscris les IMAO et les stimulants pour limiter la charge corporelle.",
            "Réserve-le à un cadre sécurisé, accompagné et préparé, vu son intensité et son caractère introspectif."
        ]
    },
    "2c_i": {
        "effects": [
            "Réputé nettement visuel, avec des motifs et des couleurs marqués, sur fond d'une stimulation corporelle perceptible.",
            "La montée peut comporter un passage d'inconfort physique (tension, frissons, nausée) avant l'installation des visuels.",
            "L'énergie stimulante éloigne le sommeil et accentue la perception sensorielle.",
            "L'expérience bascule facilement vers l'anxiété si la stimulation visuelle et corporelle devient trop intense ou le cadre stressant.",
            "La durée est modérée, avec une descente où la fatigue se fait sentir."
        ],
        "risk_factors": [
            "Phénéthylamine à marge étroite : un petit écart de quantité change beaucoup l'intensité, et les poudres ne se dosent pas fiablement à l'œil.",
            "Le marché expose à des substitutions : un produit annoncé « 2C-I » peut contenir un composé différent et plus risqué.",
            "L'association avec un IMAO est déconseillée et le mélange avec des stimulants accentue la charge cardiovasculaire.",
            "Le caractère stimulant et visuel facilite la montée d'anxiété en contexte défavorable."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un traitement psychiatrique non vérifié.",
            "Si tu as une fragilité cardiaque, vu la stimulation.",
            "Si tu es dans un état psychique fragile ou un environnement peu rassurant."
        ],
        "aftercare": [
            "Accorde-toi du repos en fin d'expérience, la stimulation pouvant retarder le sommeil.",
            "Hydrate-toi sans excès et mange léger au retour de l'appétit.",
            "Espace les prises et surveille une éventuelle fatigue ou irritabilité les jours suivants."
        ],
        "rdr_rules": [
            "Traite sa marge comme étroite : commence bas et laisse la montée se faire avant tout jugement.",
            "Reste vigilant sur l'identité réelle du produit, les substitutions étant fréquentes dans cette famille.",
            "Évite les IMAO et les autres stimulants pour ne pas surcharger le cœur.",
            "Privilégie un cadre calme et rassurant pour contenir le côté stimulant et visuel."
        ]
    },
    "2c_p": {
        "effects": [
            "Montée très lente et progressive : les effets peuvent continuer de grimper pendant deux à trois heures après la prise, longtemps après qu'on les croyait stabilisés.",
            "Visuels marqués et persistants (motifs, traînées, déformations), pensée accélérée et altération nette du sens du temps sur un plateau qui s'étire.",
            "Charge corporelle réelle : tension musculaire, mâchoires serrées, frissons et nausées, surtout pendant la longue montée.",
            "Bascule possible vers l'angoisse quand l'intensité dépasse les attentes, l'effet étant l'un des plus forts et des plus longs de la famille 2C.",
            "Descente tardive et fatigante, avec un retour au calme qui se fait attendre tard dans la nuit ou au petit matin."
        ],
        "risk_factors": [
            "La montée très lente pousse à croire que « ça ne monte pas » et à reprendre une dose : c'est la principale cause de surdosage avec cette molécule.",
            "La marge est étroite entre un effet déjà fort et un effet accablant, alors que le produit est actif à très faible quantité.",
            "La durée longue et la charge physique épuisent et favorisent l'anxiété si le cadre n'est pas stable.",
            "Sans balance de précision, l'estimation visuelle d'une si petite quantité est très peu fiable."
        ],
        "avoid_if": [
            "Vous ne disposez pas d'une journée et d'une nuit entièrement libres devant vous.",
            "Votre état psychique est fragile ou le cadre n'est pas calme et rassurant.",
            "Vous êtes tenté d'enchaîner avec d'autres psychoactifs ou de redoser pour accélérer la montée."
        ],
        "aftercare": [
            "Prévoyez un long temps de récupération et un sommeil possiblement décalé : ne planifiez rien d'exigeant le lendemain.",
            "Réhydratez-vous doucement et mangez léger une fois la descente bien engagée.",
            "Laissez passer plusieurs semaines avant un éventuel nouvel usage et surveillez une fatigue ou une anxiété qui traînerait les jours suivants."
        ],
        "rdr_rules": [
            "Règle d'or : aucune redose. Attendez au moins trois heures avant de juger de l'intensité réelle.",
            "Pesez la quantité au milligramme près avec une balance adaptée ; l'estimation à l'œil est dangereuse.",
            "Installez-vous dans un cadre calme avec une personne sobre joignable avant que la montée ne commence."
        ]
    },
    "2c_t_2": {
        "effects": [
            "Montée progressive et plateau de plusieurs heures, un peu plus court que le 2C-T-7 mais avec le même caractère soufré.",
            "Effets psychédéliques visuels associés à une composante corporelle marquée que beaucoup décrivent comme intense.",
            "Nausées, tension musculaire et inconfort physique fréquents, surtout pendant la phase de montée.",
            "L'expérience peut basculer vers l'anxiété lorsque la charge corporelle devient pesante ou le cadre instable."
        ],
        "risk_factors": [
            "Association avec un IMAO (antidépresseurs, millepertuis, harmala) : mélange potentiellement dangereux à proscrire.",
            "Charge corporelle élevée (nausées, tension) qui peut devenir éprouvante.",
            "Marge étroite entre dose plaisante et dose accablante, sur un produit actif à faible quantité.",
            "La montée lente favorise les redoses dangereuses."
        ],
        "avoid_if": [
            "Vous êtes sous IMAO ou antidépresseur, ou consommez du millepertuis ou de l'harmala.",
            "Vous êtes sensible aux nausées et à l'inconfort physique ou en mauvaise forme ce jour-là.",
            "Vous comptez le mélanger à d'autres substances ou redoser pour intensifier l'effet."
        ],
        "aftercare": [
            "Reposez-vous et laissez le corps récupérer de la charge physique de l'expérience.",
            "Hydratez-vous doucement et attendez le retour de l'appétit pour manger.",
            "Espacez largement les usages et restez attentif à tout signe physique inhabituel les jours suivants."
        ],
        "rdr_rules": [
            "Jamais avec un IMAO : la prudence est la même que pour les autres 2C-T.",
            "Privilégiez la voie orale et commencez à quantité basse pour jauger la charge corporelle.",
            "N'effectuez aucune redose avant la fin complète de la montée, avec une personne sobre à proximité."
        ]
    },
    "2c_t_7": {
        "effects": [
            "Montée lente et longue caractéristique des 2C soufrés : l'intensité peut continuer d'augmenter bien après la prise.",
            "Visuels riches et pensée profondément modifiée sur un plateau qui dure plusieurs heures.",
            "Charge corporelle nette : nausées, tension, frissons et inconfort digestif fréquents pendant la montée.",
            "Tonalité émotionnelle qui peut virer à l'angoisse ou à la confusion quand l'effet s'installe plus fort que prévu."
        ],
        "risk_factors": [
            "Association avec un IMAO (certains antidépresseurs, le millepertuis, l'harmala/ayahuasca) : ce mélange est potentiellement mortel et a déjà causé des décès.",
            "L'insufflation à forte quantité a été associée à des décès et augmente fortement le danger par rapport à la voie orale.",
            "La montée lente pousse à redoser par impatience, ce qui multiplie le risque de surdosage.",
            "La marge entre une dose forte et une dose dangereuse reste étroite."
        ],
        "avoid_if": [
            "Vous prenez un IMAO ou tout antidépresseur, ou consommez du millepertuis ou une préparation à base d'harmala : abstention absolue.",
            "Vous traversez une période psychique fragile ou un contexte non sécurisé.",
            "Vous envisagez de l'insuffler ou de l'associer à d'autres psychoactifs."
        ],
        "aftercare": [
            "Prévoyez une longue récupération et un sommeil réparateur après une durée qui peut dépasser dix heures.",
            "Réhydratez-vous progressivement et mangez léger une fois la descente bien avancée.",
            "Surveillez dans les heures et jours suivants tout signe de fièvre, de rigidité ou d'agitation inhabituelle et consultez en cas de doute."
        ],
        "rdr_rules": [
            "Jamais avec un IMAO et jamais en insufflation : ce sont les deux interdits qui ont coûté des vies avec cette molécule.",
            "Restez sur la voie orale, à quantité basse, sans aucune redose pendant la montée.",
            "Assurez la présence d'une personne sobre capable d'appeler le 15 ou le 112 en cas de signes sérotoninergiques (fièvre, rigidité, agitation)."
        ]
    },
    "2cb": {
        "effects": [
            "Souvent décrit comme doux à modéré, mêlant une stimulation légère, une chaleur corporelle et des visuels colorés sans submerger la pensée.",
            "La montée peut s'accompagner d'un pic d'inconfort physique passager (frissons, tension, parfois nausée) avant que les effets s'installent.",
            "Beaucoup rapportent une dimension sensuelle et une sensibilité accrue aux couleurs, à la musique et au toucher.",
            "Selon le contexte, l'effet penche vers la convivialité euphorique ou vers une anxiété si la stimulation devient trop forte.",
            "La durée est relativement courte pour un psychédélique, avec une descente généralement douce."
        ],
        "risk_factors": [
            "C'est une phénéthylamine à marge sensible : l'écart entre un effet léger et un effet bien plus intense peut être faible, et les poudres se dosent mal à l'œil.",
            "Des produits vendus comme « 2C-B » peuvent en réalité contenir un autre composé, parfois plus dangereux.",
            "L'association avec un IMAO est déconseillée, et le mélange avec des stimulants majore la tension corporelle.",
            "La courte durée et le côté « doux » peuvent inciter à des redoses qui transforment l'expérience en quelque chose de bien plus chargé."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un traitement psychiatrique dont l'interaction n'est pas vérifiée.",
            "Si tu as une fragilité cardiovasculaire, vu la composante stimulante.",
            "Si tu es psychiquement fragilisé ou dans un environnement stressant et peu sûr."
        ],
        "aftercare": [
            "Repose-toi en fin de soirée et laisse le sommeil revenir naturellement.",
            "Hydrate-toi raisonnablement et mange quelque chose de léger quand l'appétit revient.",
            "Espace les usages et reste attentif à une fatigue ou une baisse d'humeur les jours suivants."
        ],
        "rdr_rules": [
            "Considère sa marge comme étroite : commence prudemment et ne juge pas un produit faible avant la montée complète.",
            "Méfie-toi des substitutions : un « 2C-B » peut être tout autre chose, donc reste prudent sur l'origine.",
            "Évite l'association avec les IMAO et avec d'autres stimulants pour limiter la tension corporelle.",
            "Résiste à la tentation de redoser à cause de la durée courte, car les prises s'additionnent vite."
        ]
    },
    "3_cmc": {
        "effects": [
            "Montée stimulante avec énergie, euphorie et désinhibition, dans la lignée des cathinones proches de la méphédrone.",
            "Excitation, envie de bouger ou de parler, bien-être passager.",
            "Effet relativement court qui appelle une reconsommation.",
            "Coupe-faim, cœur accéléré, tension en hausse, mâchoires serrées et bruxisme.",
            "Descente avec fatigue, anxiété, déprime et craving."
        ],
        "risk_factors": [
            "Molécule récente et peu documentée, dont la puissance et les effets réels sont mal connus.",
            "Durée courte qui favorise les redoses compulsives et la charge cardiaque.",
            "Sniff répété qui abîme la muqueuse nasale.",
            "Chaleur et effort qui majorent l'hyperthermie."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou un terrain anxieux.",
            "Tu es seul·e et sans repère fiable sur le produit.",
            "Tu te sens déjà dans une dynamique de prises en boucle."
        ],
        "aftercare": [
            "Donne-toi une vraie nuit de sommeil pour récupérer.",
            "Réhydrate-toi et remange pour compenser coupe-faim et sudation.",
            "Anticipe une descente morose et évite de relancer."
        ],
        "rdr_rules": [
            "Sois prudent·e sur la quantité, la molécule étant récente et mal documentée.",
            "Range le produit entre les prises et fixe une limite, la durée courte favorisant la compulsion.",
            "Utilise ta propre paille et ne partage pas ton matériel.",
            "Hydrate-toi régulièrement et fais des pauses au frais."
        ]
    },
    "3_ho_pcp": {
        "effects": [
            "Dissociation de type PCP associée à une composante opioïde : détachement du réel doublé d'une chaleur et d'un apaisement sédatifs.",
            "Effet antidouleur et engourdissant marqué, avec une somnolence qui peut s'installer.",
            "Distorsions de l'espace et du temps, esprit éloigné de l'environnement.",
            "Montée pouvant être trompeuse, suivie d'un état lourd et sédatif à mesure que la composante opioïde se manifeste.",
            "Coordination dégradée et risque de s'assoupir, en plus de la perte d'équilibre."
        ],
        "risk_factors": [
            "Composante opioïde exposant à une dépression respiratoire : la respiration peut se ralentir ou s'arrêter, surtout à doses élevées.",
            "Mélange avec d'autres dépresseurs (alcool, opioïdes, benzodiazépines), qui multiplie le risque d'arrêt respiratoire.",
            "Effet sédatif favorisant l'assoupissement, avec un risque de fausse route si l'on vomit en dormant.",
            "Profil peu documenté et puissant, rendant la dose réellement active difficile à anticiper."
        ],
        "avoid_if": [
            "Tu envisages d'y associer un autre dépresseur, ce qui rendrait la dépression respiratoire bien plus probable.",
            "Tu es seul, sans personne pour surveiller ta respiration et ton niveau de conscience.",
            "Tu as une fragilité respiratoire ou des antécédents qui rendent une dépression respiratoire plus dangereuse."
        ],
        "aftercare": [
            "Reste sous surveillance jusqu'à ce que la somnolence et la sédation se dissipent complètement.",
            "Surveille la respiration et la vigilance dans les heures qui suivent, la composante opioïde pouvant prolonger la sédation.",
            "Repose-toi au calme et reviens progressivement à l'activité une fois pleinement réveillé."
        ],
        "rdr_rules": [
            "Ne combine jamais avec un autre dépresseur (alcool, opioïdes, benzodiazépines) : la composante opioïde rend le risque d'arrêt respiratoire majeur.",
            "Reste accompagné d'une personne sobre qui surveille ta respiration et sait reconnaître une dépression respiratoire (respiration lente, lèvres bleutées, impossibilité de réveiller).",
            "Mets-toi en position latérale de sécurité si tu te sens partir, pour éviter la fausse route.",
            "Connais les signes d'overdose opioïde et la conduite à tenir (appeler les secours, naloxone si disponible)."
        ]
    },
    "3_meo_pcp": {
        "effects": [
            "Dissociation de type PCP avec une composante stimulante : esprit accéléré, sensation d'énergie et de puissance plutôt que d'enfoncement.",
            "Détachement de soi et de l'environnement pouvant s'accompagner d'effets psychotomimétiques (pensées paranoïaques, perte du fil du réel).",
            "Montée par paliers tardifs et trompeuse : les effets s'installent et grimpent longtemps après la prise, par marches successives.",
            "Distorsions de l'espace et du temps, parfois agitation, désinhibition ou impression de toute-puissance.",
            "Coordination altérée avec une force et une excitation qui peuvent masquer la perte de jugement."
        ],
        "risk_factors": [
            "Paliers tardifs qui donnent l'illusion d'un sous-dosage et poussent à des redoses dangereuses avant que tout l'effet ne soit monté.",
            "Marge très étroite entre une dose recherchée et une dose qui bascule dans l'agitation, la paranoïa ou la confusion.",
            "Composante stimulante et psychotomimétique qui favorise les comportements impulsifs ou à risque.",
            "Mélange avec dépresseurs ou autres stimulants, imprévisible et susceptible d'aggraver l'agitation ou la sédation."
        ],
        "avoid_if": [
            "Tu as des antécédents de psychose, de paranoïa ou de troubles psychiques fragiles.",
            "Tu es tenté de reprendre une dose parce que « rien ne vient » après la première prise.",
            "Tu es dans un contexte tendu, stimulant ou entouré de personnes qui pourraient déclencher conflits ou agitation."
        ],
        "aftercare": [
            "Reviens au calme dans un environnement rassurant, l'agitation et les pensées intrusives pouvant persister.",
            "Repose-toi et hydrate-toi, la composante stimulante laissant souvent une fatigue marquée à la descente.",
            "Si une anxiété ou des idées paranoïaques persistent les jours suivants, parle-en et évite de réitérer."
        ],
        "rdr_rules": [
            "Attends très longtemps avant toute reprise et considère que l'effet monte encore par paliers : ne redose pas dans l'impatience.",
            "Reste dans un environnement calme et sécurisé, avec une personne sobre, pour contenir l'agitation possible.",
            "Ne mélange pas avec d'autres substances, et surtout pas avec les dépresseurs (alcool, opioïdes, benzodiazépines).",
            "Tiens-toi à distance des situations conflictuelles et des lieux dangereux tant que les effets ne sont pas totalement dissipés."
        ]
    },
    "3_mmc": {
        "effects": [
            "Montée stimulante et un peu empathogène proche de la méphédrone : énergie, euphorie, chaleur sociale et désinhibition.",
            "Envie de contact et de parole, libido parfois augmentée, bien-être passager.",
            "Effet court qui appelle vite une reconsommation.",
            "Coupe-faim, cœur accéléré, tension en hausse, mâchoires serrées et bruxisme.",
            "Descente marquée par fatigue, anxiété, déprime et craving."
        ],
        "risk_factors": [
            "Durée brève qui pousse aux redoses rapprochées et compulsives, avec accumulation cardiaque.",
            "Sniff répété qui abîme la muqueuse nasale.",
            "Chaleur d'environnement festif et effort qui majorent l'hyperthermie.",
            "Fortes doses et nuits blanches qui favorisent anxiété et paranoïa."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou un terrain anxieux.",
            "Tu es dans un lieu chaud et confiné sans pause possible.",
            "Tu te sens déjà dans une dynamique de prises en boucle."
        ],
        "aftercare": [
            "Donne-toi une vraie nuit de sommeil pour récupérer.",
            "Réhydrate-toi et remange pour compenser coupe-faim et sudation.",
            "Anticipe une descente morose et évite de relancer pour la masquer."
        ],
        "rdr_rules": [
            "Range le produit entre les prises et fixe une limite, la durée courte favorisant la compulsion.",
            "Utilise ta propre paille et alterne les narines.",
            "Hydrate-toi par petites quantités régulières et fais des pauses au frais.",
            "Espace largement les usages pour préserver sommeil et moral."
        ]
    },
    "4_aco_dmt": {
        "effects": [
            "Proche de la psilocybine : montée progressive sur une trentaine à une heure, souvent annoncée par des bâillements et une légère nausée.",
            "Effets visuels (motifs, respiration des surfaces, couleurs avivées), introspection et vagues émotionnelles pendant le plateau.",
            "Composante corporelle changeante : frissons, pesanteur ou au contraire légèreté, parfois crampes digestives au début.",
            "La descente est douce et étalée, avec une longue phase de redescente réflexive.",
            "L'humeur peut osciller entre euphorie chaleureuse et inquiétude selon le cadre et l'état de départ."
        ],
        "risk_factors": [
            "C'est une poudre : le dosage à l'œil est très incertain et de petites différences de quantité changent beaucoup l'intensité.",
            "Une poudre mal homogénéisée ou mal pesée expose à prendre bien plus que prévu sans s'en rendre compte.",
            "Un produit acheté sans analyse peut être autre chose que ce qui est annoncé.",
            "Un contexte instable ou un état émotionnel difficile favorise les vécus anxieux."
        ],
        "avoid_if": [
            "Si tu ne peux pas peser précisément et homogénéiser le produit.",
            "Si tu es dans une phase de fragilité psychique ou d'anxiété marquée.",
            "Si l'environnement est inconnu, stressant ou peu sécurisant."
        ],
        "aftercare": [
            "Prévois une fin de journée et une nuit tranquilles pour laisser l'effet se dissiper en douceur.",
            "Réhydrate-toi et mange léger quand l'appétit revient.",
            "Accorde-toi un temps de repos le lendemain, l'esprit pouvant rester sensible un moment."
        ],
        "rdr_rules": [
            "Pèse au milligramme avec une balance de précision plutôt que d'estimer à l'œil.",
            "Commence bas et patiente : l'effet met du temps à monter, ne « recharge » pas trop tôt.",
            "Fais analyser le produit quand c'est possible et garde un cadre calme avec une personne de confiance.",
            "Respecte un long intervalle entre deux expériences pour laisser la tolérance redescendre."
        ]
    },
    "4_fa": {
        "effects": [
            "La montée mêle énergie stimulante et chaleur émotionnelle légère : on se sent éveillé, sociable et un peu euphorique, dans un registre à mi-chemin entre amphétamine et empathogène.",
            "Le pic s'accompagne souvent de maux de tête, fréquemment rapportés avec cette molécule, ainsi que d'une nette charge cardiovasculaire (pouls et tension qui montent).",
            "La descente est longue, avec fatigue, baisse de moral et parfois des céphalées qui persistent après l'effet.",
            "La fenêtre entre une dose « agréable » et une dose trop forte est étroite, ce qui rend le surdosage facile et désagréable.",
            "La bascule vers l'anxiété, l'hypertension et l'inconfort cardiaque arrive vite quand la stimulation prend le dessus sur la composante chaleureuse."
        ],
        "risk_factors": [
            "Le « dose-creep » est particulièrement dangereux ici : de petites augmentations rapprochent vite du seuil d'accidents cardiovasculaires et hémorragiques signalés avec cette substance.",
            "Une tension élevée, une fragilité vasculaire ou des antécédents cardiaques exposent à des complications graves.",
            "Le cumul avec d'autres stimulants, la caféine ou l'alcool, ainsi que l'effort et la chaleur, amplifie la charge sur le cœur et les vaisseaux.",
            "Les maux de tête intenses peuvent être un signal d'alerte de poussée de tension et non un simple inconfort."
        ],
        "avoid_if": [
            "Si tu as une tension élevée, des antécédents cardiaques ou vasculaires, ou des troubles de la coagulation.",
            "Si tu es tenté d'augmenter les quantités pour « sentir plus », car le risque grimpe très vite.",
            "Si tu prends d'autres stimulants ou des traitements agissant sur le cœur, la tension ou l'humeur."
        ],
        "aftercare": [
            "Repose-toi, hydrate-toi et surveille la persistance d'un mal de tête : un mal de tête violent, une vision trouble ou une douleur thoracique justifient un avis médical.",
            "Accorde-toi plusieurs nuits de sommeil et des repas réguliers pour récupérer du coup de fatigue.",
            "Espace longuement les usages et reste attentif à ton moral dans les jours qui suivent."
        ],
        "rdr_rules": [
            "Ne cède jamais au dose-creep : garde une quantité basse et stable, car la marge de sécurité cardiovasculaire est faible.",
            "Surveille pouls, tension ressentie et maux de tête ; tout signe cardiaque ou neurologique impose l'arrêt et de demander de l'aide.",
            "Évite absolument de cumuler avec d'autres stimulants, la caféine ou l'alcool, et reste au frais et hydraté.",
            "Privilégie un environnement calme avec quelqu'un de confiance qui peut réagir si un malaise survient."
        ]
    },
    "4_ho_met": {
        "effects": [
            "Montée en 20 à 45 minutes, souvent ressentie comme plus lumineuse et moins « lourde » que celle des champignons.",
            "Plateau visuel coloré et ludique, avec euphorie, fou rire facile et amplification esthétique de l'environnement.",
            "Composante corporelle plutôt légère et énergisante, parfois quelques frissons ou tensions musculaires.",
            "Descente progressive et généralement douce, laissant une fatigue sereine.",
            "L'humeur reste souvent positive mais peut virer à l'anxiété si la dose ressentie est plus forte que prévu."
        ],
        "risk_factors": [
            "C'est une substance de recherche peu étudiée : ses effets à long terme et certaines interactions restent mal connus.",
            "En poudre, le dosage approximatif rend l'intensité difficile à anticiper.",
            "Un produit non analysé peut être confondu avec une autre molécule.",
            "Un état émotionnel fragile ou un cadre instable favorise la bascule anxieuse."
        ],
        "avoid_if": [
            "Si tu ne peux pas peser le produit avec précision.",
            "Si tu traverses une période d'anxiété ou de fragilité psychique.",
            "Si l'environnement est stressant ou si tu es sans personne de confiance."
        ],
        "aftercare": [
            "Réserve-toi une soirée tranquille et une bonne nuit pour récupérer.",
            "Hydrate-toi et mange léger une fois l'appétit revenu.",
            "Laisse-toi un temps calme le lendemain si l'esprit reste un peu sensible."
        ],
        "rdr_rules": [
            "Pèse au milligramme avec une balance de précision.",
            "Commence bas et attends la pleine montée avant toute autre prise.",
            "Privilégie un cadre rassurant avec une personne sobre de confiance.",
            "Espace les expériences pour laisser la tolérance redescendre."
        ]
    },
    "4_ho_mipt": {
        "effects": [
            "Montée en 20 à 45 minutes, avec une coloration corporelle et tactile marquée plus que purement visuelle.",
            "Plateau souvent décrit comme chaleureux et social : envie de contact, de parler, de toucher, émotions ouvertes.",
            "Composante corporelle nette : picotements, sensation de bien-être physique, parfois tension dans la mâchoire.",
            "Visuels présents mais généralement plus discrets que l'effet corporel et émotionnel.",
            "Descente douce, laissant souvent un sentiment de détente et de connexion."
        ],
        "risk_factors": [
            "Substance de recherche peu documentée : interactions et effets à long terme mal connus.",
            "Dosage en poudre imprécis, l'intensité corporelle pouvant vite devenir inconfortable.",
            "Un produit non analysé peut ne pas correspondre à ce qui est annoncé.",
            "Un contexte social mal choisi peut amplifier l'inconfort si l'effet monte fort."
        ],
        "avoid_if": [
            "Si tu ne peux pas peser précisément la dose.",
            "Si tu es dans un état émotionnel fragile ou très fatigué.",
            "Si le cadre social est tendu ou inconnu et risque de te mettre mal à l'aise."
        ],
        "aftercare": [
            "Offre-toi une fin de journée calme et une nuit de sommeil réparatrice.",
            "Hydrate-toi et mange léger quand la faim revient.",
            "Prends un moment au calme le lendemain pour laisser le corps et l'esprit se reposer."
        ],
        "rdr_rules": [
            "Pèse au milligramme avec une balance de précision.",
            "Commence bas et patiente : la composante corporelle peut surprendre.",
            "Choisis un cadre social bienveillant et une personne de confiance.",
            "Laisse passer un délai suffisant entre deux expériences."
        ]
    },
    "4_mec": {
        "effects": [
            "Montée stimulante avec énergie, euphorie modérée et désinhibition, composante empathique plus discrète que la méphédrone.",
            "Envie de bouger et de parler, excitation passagère.",
            "Effet assez court qui pousse à reconsommer.",
            "Coupe-faim, cœur accéléré, tension en hausse, mâchoires serrées et bruxisme.",
            "Descente particulièrement marquée avec fatigue, déprime, anxiété et craving."
        ],
        "risk_factors": [
            "Descente prononcée qui incite à redoser pour la repousser.",
            "Redoses compulsives rapprochées qui accumulent la charge cardiaque.",
            "Sniff répété qui abîme la muqueuse nasale.",
            "Chaleur et effort prolongé qui majorent l'hyperthermie."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou un terrain anxieux.",
            "Tu es dans un environnement chaud et confiné sans pause.",
            "Tu es déjà fatigué·e ou en train d'enchaîner les prises."
        ],
        "aftercare": [
            "Prévois une vraie nuit de sommeil et du repos.",
            "Réhydrate-toi et réalimente-toi pour compenser coupe-faim et sudation.",
            "Accueille une descente difficile sans la combler par une nouvelle prise."
        ],
        "rdr_rules": [
            "Anticipe la descente marquée et résiste à la redose qui ne fait que la reporter.",
            "Range le produit entre les prises et fixe une limite.",
            "Utilise ta propre paille et alterne les narines.",
            "Hydrate-toi régulièrement et fais des pauses au frais."
        ]
    },
    "5_apb": {
        "effects": [
            "La montée empathogène s'installe progressivement, avec ouverture émotionnelle et sociale, dans un registre proche du 6-APB.",
            "L'effet est long et la charge cardiovasculaire se prolonge sur de nombreuses heures.",
            "Au pic, on retrouve hausse du pouls et de la tension, bruxisme et montée de la température corporelle, étalés dans le temps.",
            "La durée prolongée peut faire croire à un effet trop faible et pousser à redoser trop tôt.",
            "La descente tardive complique le sommeil et laisse souvent fatigué le lendemain."
        ],
        "risk_factors": [
            "La charge cardiaque prolongée est le danger principal : le cœur reste sollicité longtemps.",
            "La montée progressive incite aux redoses prématurées qui prolongent la tension cardiovasculaire.",
            "L'hyperthermie et l'hyponatrémie (en buvant trop d'eau d'un coup) restent des risques sur toute la durée.",
            "Les associations avec IMAO et antidépresseurs sérotoninergiques exposent au syndrome sérotoninergique."
        ],
        "avoid_if": [
            "Si tu as une fragilité cardiaque ou une tension élevée.",
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN).",
            "Si tu n'as pas une longue fenêtre devant toi pour rester en sécurité et récupérer."
        ],
        "aftercare": [
            "Prévois une récupération longue, le sommeil arrivant tard et le lendemain pouvant être difficile.",
            "Réhydrate-toi avec mesure et reprends des repas réguliers.",
            "Espace très longuement les usages pour limiter la charge cumulée sur le cœur."
        ],
        "rdr_rules": [
            "Attends longuement avant toute redose : la montée progressive trompe et l'empilement est le vrai danger.",
            "Surveille ton pouls sur toute la durée et fais des pauses au frais.",
            "Hydrate-toi sans excès, par petites gorgées régulières, pour éviter coup de chaleur comme hyponatrémie.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques."
        ]
    },
    "5_meo_dmt": {
        "effects": [
            "Montée fulgurante et écrasante : en quelques secondes à fumer/vaporiser, l'effet atteint une intensité totale qui submerge la conscience.",
            "Le pic est souvent vécu comme une dissolution complète du soi, sans visuels élaborés mais avec une intensité énergétique extrême.",
            "Perte de contrôle moteur quasi totale : la personne peut se figer, tomber, vocaliser ou se contracter sans pouvoir se maîtriser.",
            "Composante corporelle massive : montée d'énergie, apnée ou respiration désordonnée, rougeurs, sensation d'être emporté.",
            "Le retour s'amorce en quelques minutes mais peut laisser un état de sidération, de confusion ou de bouleversement durable."
        ],
        "risk_factors": [
            "L'effet est si rapide et si écrasant qu'il ne laisse aucune marge pour réagir une fois lancé.",
            "Association avec un IMAO (harmala, ayahuasca) extrêmement dangereuse : risque de réactions sévères et potentiellement mortelles.",
            "La perte de contrôle moteur totale expose aux chutes, à l'inhalation de vomissures et aux blessures sans accompagnant.",
            "Un terrain cardiaque ou psychique fragile peut être gravement déstabilisé par l'intensité."
        ],
        "avoid_if": [
            "Si tu n'as pas une personne sobre et avertie pour te tenir et sécuriser ton corps pendant toute la durée.",
            "Si tu as consommé un IMAO, de l'harmala, de l'ayahuasca ou tout sérotoninergique.",
            "Si tu es debout, près d'objets durs, d'eau, ou dans tout lieu où une perte de contrôle te mettrait en danger."
        ],
        "aftercare": [
            "Reste allongé et accompagné jusqu'à ce que le contrôle du corps et les repères reviennent pleinement.",
            "Donne-toi un long temps de silence et d'immobilité : l'expérience peut laisser sidéré.",
            "Reviens sur le vécu à froid et n'hésite pas à chercher du soutien si l'intensité a été bouleversante."
        ],
        "rdr_rules": [
            "Ne jamais combiner avec un IMAO, de l'harmala ou de l'ayahuasca : cette association peut être mortelle.",
            "Toujours allongé, dans un espace dégagé et sécurisé, avec une personne sobre qui te maintient (« sitter »).",
            "Le sitter doit surveiller la respiration et libérer les voies aériennes en cas de vomissement.",
            "Considère cette substance comme parmi les plus intenses qui soient : sécurité physique et accompagnement priment sur tout."
        ]
    },
    "5_meo_mipt": {
        "effects": [
            "Montée en 30 à 60 minutes, avec une nette tonalité stimulante : éveil, énergie, envie de bouger.",
            "Plateau plus corporel et énergique que visuel, avec excitation, parfois libido accrue et pensées rapides.",
            "Composante corporelle marquée : tension musculaire, mâchoire serrée, cœur qui accélère, transpiration.",
            "Descente parfois nerveuse, avec difficulté à se poser ou à dormir.",
            "L'euphorie peut basculer vers l'agitation ou l'anxiété si la dose ressentie est trop élevée."
        ],
        "risk_factors": [
            "Molécule très sensible au dosage : une faible différence de quantité change radicalement l'intensité et l'inconfort corporel.",
            "En poudre, l'estimation à l'œil est dangereuse vu cette marge étroite.",
            "La stimulation peut fatiguer le cœur et empêcher le sommeil, surtout en cas de redose.",
            "Substance de recherche peu étudiée, aux interactions mal connues."
        ],
        "avoid_if": [
            "Si tu ne peux pas peser au milligramme près.",
            "Si tu es déjà fatigué, stressé ou en manque de sommeil.",
            "Si tu as un terrain cardiaque fragile ou une grande sensibilité aux stimulants."
        ],
        "aftercare": [
            "Laisse à ton corps le temps de redescendre avant de chercher le sommeil ; ne force pas.",
            "Hydrate-toi régulièrement et mange léger quand c'est possible.",
            "Prévois du repos le lendemain, la stimulation pouvant laisser fatigué et tendu."
        ],
        "rdr_rules": [
            "Pèse impérativement au milligramme : la fenêtre est étroite et l'à-peu-près dangereux.",
            "Commence très bas et évite toute redose, qui accentue tension et insomnie.",
            "Surveille les signes corporels (cœur, température) et rafraîchis-toi si besoin.",
            "Garde un cadre calme et une personne de confiance, surtout vu la composante stimulante."
        ]
    },
    "6_apb": {
        "effects": [
            "La montée est lente et l'ouverture émotionnelle s'installe progressivement, dans un registre empathogène doux mais très étalé dans le temps.",
            "La durée est très longue : l'effet et surtout la charge cardiovasculaire se prolongent sur de nombreuses heures.",
            "Au pic, on retrouve hausse du pouls et de la tension, bruxisme et montée de la température corporelle, mais sur une durée inhabituellement étendue.",
            "Cette longueur peut surprendre et pousser à redoser trop tôt, croyant l'effet absent, ce qui empile dangereusement les prises.",
            "La descente, très tardive, complique le sommeil et laisse souvent épuisé le lendemain."
        ],
        "risk_factors": [
            "La charge cardiaque prolongée sur de longues heures est le danger central : le cœur reste sous tension bien plus longtemps qu'avec la MDMA.",
            "La montée lente incite à redoser prématurément, ce qui prolonge encore la sollicitation cardiovasculaire.",
            "L'hyperthermie et l'hyponatrémie (en buvant trop d'eau d'un coup) restent des risques sur toute la durée.",
            "Les associations avec IMAO et antidépresseurs sérotoninergiques exposent au syndrome sérotoninergique."
        ],
        "avoid_if": [
            "Si tu as une fragilité cardiaque ou une tension élevée, vu la durée de sollicitation.",
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN).",
            "Si tu n'as pas devant toi une longue fenêtre pour rester en sécurité et récupérer ensuite."
        ],
        "aftercare": [
            "Prévois une récupération longue : le sommeil viendra tard et le lendemain peut être éprouvant.",
            "Réhydrate-toi avec mesure et reprends des repas réguliers une fois l'effet retombé.",
            "Espace très longuement les usages pour limiter la charge cumulée sur le cœur."
        ],
        "rdr_rules": [
            "Patiente longuement avant d'envisager toute redose : la montée lente trompe et le risque vient de l'empilement.",
            "Surveille étroitement ton pouls sur toute la durée et fais des pauses au frais.",
            "Hydrate-toi sans excès, par petites gorgées régulières, pour éviter coup de chaleur comme hyponatrémie.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques, et reste accompagné sur la durée."
        ]
    },
    "a_php": {
        "effects": [
            "Montée stimulante puissante : énergie, euphorie, hypervigilance et désinhibition.",
            "Excitation forte, agitation et impulsivité, sentiment de puissance.",
            "Coupe-faim et insomnie marqués, éveil prolongé.",
            "Cœur accéléré, tension haute, mâchoires serrées et bruxisme.",
            "Descente difficile avec épuisement, anxiété, déprime et craving compulsif."
        ],
        "risk_factors": [
            "Molécule très puissante active à très faible quantité, surdosage facile.",
            "Redoses compulsives en rafale qui prolongent l'éveil et la charge cardiaque.",
            "Insomnie prolongée et fortes doses favorisant paranoïa et psychose.",
            "Produit récent peu documenté, identité et pureté réelles incertaines."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque, psychiatrique ou un terrain paranoïaque.",
            "Tu es seul·e sans personne pour veiller.",
            "Tu es déjà épuisé·e ou dans une dynamique de redoses."
        ],
        "aftercare": [
            "Prévois un long temps de sommeil et de repos.",
            "Réhydrate-toi et réalimente-toi doucement.",
            "Reste au calme et entouré·e si l'anxiété ou la paranoïa persistent."
        ],
        "rdr_rules": [
            "Dose avec une extrême prudence, le produit étant actif à très faible quantité.",
            "Casse l'automatisme des redoses en rangeant le produit entre les prises.",
            "Ne partage pas ton matériel de sniff ou d'injection.",
            "Surveille cœur et psychisme et mets-toi à l'abri si la paranoïa monte."
        ]
    },
    "a_pvp": {
        "effects": [
            "Montée stimulante puissante d'énergie et d'euphorie, hypervigilance et forte désinhibition.",
            "Excitation intense, agitation, parfois sentiment de puissance et comportements impulsifs.",
            "Coupe-faim et insomnie très marqués, éveil prolongé.",
            "Charge cardiovasculaire forte (cœur emballé, tension haute), mâchoires serrées et bruxisme.",
            "Descente très difficile avec épuisement, anxiété, déprime et craving compulsif intense."
        ],
        "risk_factors": [
            "Molécule très puissante, active à très faible quantité, ce qui rend le surdosage facile.",
            "Usage compulsif et redoses en rafale qui prolongent l'éveil et épuisent l'organisme.",
            "Insomnie prolongée et fortes doses qui déclenchent paranoïa, agitation et psychose.",
            "Forte charge cardiaque et risque d'hyperthermie, aggravés par chaleur et effort."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou psychiatrique, ou un terrain paranoïaque.",
            "Tu es seul·e et sans personne pour veiller en cas de bascule.",
            "Tu es déjà épuisé·e ou engagé·e dans une série de redoses."
        ],
        "aftercare": [
            "Protège un long temps de sommeil, l'éveil pouvant durer très longtemps.",
            "Réhydrate-toi et réalimente-toi progressivement.",
            "Mets-toi au calme et entouré·e si la paranoïa ou l'anxiété persistent en descente."
        ],
        "rdr_rules": [
            "Sois extrêmement prudent·e sur la quantité, le produit étant actif à l'état de traces.",
            "Évite les redoses en rafale qui nourrissent compulsion et psychose.",
            "Ne partage pas ton matériel de sniff ou d'injection.",
            "Surveille cœur et état psychique, et mets-toi à l'abri si la paranoïa monte."
        ]
    },
    "al_lad": {
        "effects": [
            "Réputé pour des visuels nets et marqués, parfois jugés plus « propres » que le LSD, avec une charge mentale souvent décrite comme un peu plus légère.",
            "La durée est généralement plus courte que celle du LSD, ce qui ne rend pas l'expérience moins intense pour autant.",
            "La montée peut rester progressive et donner une impression de lenteur au début.",
            "Le corps est stimulé, pupilles dilatées, avec une énergie qui éloigne le sommeil.",
            "L'environnement et l'humeur décident largement du basculement entre plaisir contemplatif et inconfort anxieux."
        ],
        "risk_factors": [
            "Lysergamide pris sur buvard : la dose réelle est invisible et change d'un buvard à l'autre.",
            "Les dangers communs des lysergamides demeurent : convulsions possibles avec le lithium, effets imprévisibles avec les IMAO.",
            "La réputation « visuelle et courte » peut pousser à sous-estimer le produit et à redoser pendant la montée.",
            "Des visuels très chargés peuvent désorienter et faire monter l'anxiété si le cadre n'est pas maîtrisé."
        ],
        "avoid_if": [
            "Si tu es en période psychiquement instable, ou en cas d'antécédents personnels ou familiaux de psychose ou de bipolarité.",
            "Si tu prends du lithium, un IMAO ou un traitement psychiatrique non vérifié.",
            "Si tu n'es pas dans un lieu sûr et calme, ou si tu manques de temps devant toi."
        ],
        "aftercare": [
            "Même si l'effet est plus court, accorde-toi du repos ensuite et un sommeil de récupération.",
            "Bois de l'eau, mange simplement quand l'appétit revient, et évite les tâches exigeantes juste après.",
            "Reste attentif à ton humeur les jours suivants et cherche du soutien si nécessaire."
        ],
        "rdr_rules": [
            "Ne te fie pas à la réputation « douce et courte » : la dose d'un buvard reste inconnue, donc commence bas.",
            "Évite le lithium et les IMAO et vérifie tes traitements en cours.",
            "Patiente le temps que la montée soit complète avant toute idée de redose.",
            "Installe un cadre rassurant, car les visuels marqués se vivent bien mieux dans un environnement maîtrisé."
        ]
    },
    "alcool": {
        "effects": [
            "Désinhibition, euphorie légère et sociabilité accrue dans la phase de montée.",
            "Ivresse progressive : perte de coordination, élocution pâteuse, jugement altéré.",
            "Amnésie possible (trous noirs) lorsque l'alcoolémie monte vite ou haut.",
            "Sédation, somnolence et nausées, puis vomissements quand le corps sature.",
            "Descente difficile : maux de tête, fatigue et anxiété le lendemain."
        ],
        "risk_factors": [
            "Le coma éthylique guette quand l'alcoolémie est trop élevée : perte de conscience et risque d'étouffement par vomissements.",
            "Boire vite ou l'estomac vide accélère la montée et le risque de surdose.",
            "Mélange avec GHB, benzodiazépines ou opioïdes : addition des effets dépresseurs, danger mortel pour la respiration.",
            "Une personne ivre inconsciente peut s'étouffer avec ses propres vomissements si elle reste sur le dos."
        ],
        "avoid_if": [
            "Tu as pris un autre dépresseur (GHB, benzo, opioïde) : l'association peut être mortelle.",
            "Tu vas conduire ou utiliser une machine.",
            "Tu es seul·e et personne ne pourra réagir si ton état se dégrade."
        ],
        "aftercare": [
            "Réhydrate-toi avec de l'eau et mange si tu le peux ; le temps reste le seul vrai dégrisant.",
            "Face à une personne ivre inconsciente : mets-la en PLS sur le côté, surveille sa respiration et appelle le 15.",
            "Repose-toi et attends d'être totalement dégrisé·e avant de conduire ou de prendre des décisions importantes."
        ],
        "rdr_rules": [
            "Ne mélange jamais l'alcool avec un autre dépresseur (GHB/GBL, benzodiazépines, opioïdes).",
            "N'allonge jamais une personne ivre inconsciente sur le dos : mets-la en PLS pour éviter l'étouffement.",
            "Alterne avec de l'eau et espace les verres pour ralentir la montée.",
            "Devant des vomissements avec somnolence intense ou une personne qu'on ne réveille pas, appelle les secours."
        ]
    },
    "ald_52": {
        "effects": [
            "Souvent décrit comme un cousin du LSD au caractère un peu plus « doux » et corporel, avec des visuels présents mais une charge mentale parfois jugée plus douce.",
            "La montée peut être progressive et donner, comme les autres lysergamides, une fausse impression de faiblesse au départ.",
            "Le corps est en éveil avec dilatation des pupilles, et certains rapportent une composante plus chaleureuse et moins « électrique ».",
            "Le contexte oriente fortement l'expérience entre détente euphorique et montée d'anxiété.",
            "La descente s'étend sur plusieurs heures et le sommeil arrive tardivement."
        ],
        "risk_factors": [
            "Comme tous les lysergamides, il se prend sur buvard dont la dose réelle reste inconnue et inconstante.",
            "Le risque grave de convulsions avec le lithium et l'imprévisibilité avec les IMAO s'appliquent pleinement.",
            "La perception d'un effet « plus doux » peut inciter à en reprendre alors que la montée n'est pas terminée.",
            "Le caractère introspectif peut faire remonter du matériel émotionnel difficile si le cadre est mal choisi."
        ],
        "avoid_if": [
            "Si tu es psychiquement fragilisé, ou s'il existe des antécédents personnels ou familiaux de psychose ou de bipolarité.",
            "Si tu prends du lithium, un IMAO ou un traitement psychiatrique non vérifié.",
            "Si tu n'es pas dans un environnement sécurisant et disponible émotionnellement."
        ],
        "aftercare": [
            "Prévois du repos le lendemain, le sommeil étant souvent décalé après une longue expérience.",
            "Hydrate-toi, mange léger au retour de la faim et évite les engagements lourds le jour suivant.",
            "Note ton état d'esprit dans les jours d'après et parle de ce qui a émergé si besoin."
        ],
        "rdr_rules": [
            "Considère la dose d'un buvard comme inconnue : démarre prudemment, même si le produit a une réputation « douce ».",
            "Écarte absolument le lithium et les IMAO et passe en revue tes traitements.",
            "Attends la pleine montée avant d'envisager quoi que ce soit, pour ne pas redoser à tort.",
            "Choisis un cadre apaisant et une présence de confiance, surtout vu son côté introspectif."
        ]
    },
    "alprazolam": {
        "effects": [
            "Soulagement rapide et net de l'anxiété, avec une montée plus marquée que beaucoup d'autres benzodiazépines.",
            "Désinhibition prononcée qui peut pousser à des comportements impulsifs et à risque.",
            "Amnésie des heures suivant la prise, parfois totale.",
            "Sédation et relâchement, suivis d'une descente qui peut faire remonter l'anxiété (effet rebond).",
            "Sensation de détachement et d'indifférence émotionnelle."
        ],
        "risk_factors": [
            "Action rapide et puissante : la désinhibition et l'amnésie surviennent vite et favorisent les prises répétées.",
            "Mélange avec alcool ou opioïdes : risque élevé de dépression respiratoire et de coma.",
            "Demi-vie relativement courte qui favorise un rebond d'anxiété et l'installation rapide d'une dépendance.",
            "Comprimés vendus comme « Xanax » souvent contrefaits, contenant parfois du flualprazolam ou du clonazolam bien plus puissants."
        ],
        "avoid_if": [
            "Tu as consommé de l'alcool ou un opioïde.",
            "Tu dois conduire ou gérer une situation où ton jugement doit rester intact.",
            "Tu utilises déjà régulièrement et tu penses arrêter brutalement."
        ],
        "aftercare": [
            "Attends que l'effet et le rebond passent avant toute autre prise, et bois de l'eau.",
            "Si l'usage devient régulier, organise une réduction progressive avec un soignant plutôt qu'un arrêt sec.",
            "Note ce que tu prends pour ne pas redoser à cause de l'amnésie."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ou des opioïdes.",
            "Considère tout comprimé de rue comme potentiellement contrefait ou surdosé (molécules de synthèse très puissantes).",
            "N'arrête pas brutalement après un usage régulier : sevrage progressif accompagné pour éviter les convulsions.",
            "Évite les reprises rapprochées dictées par le rebond d'anxiété ou les trous de mémoire."
        ]
    },
    "amanite": {
        "effects": [
            "État onirique et planant, vagues de somnolence alternant avec des phases d'éveil, très différent des champignons à psilocybine.",
            "Distorsions sensorielles, modification de la perception de la taille des objets, rêveries et parfois micro-sommeils involontaires.",
            "Relâchement musculaire, secousses ou tremblements, démarche incertaine.",
            "Confusion, désorientation et délire possibles, surtout quand la quantité augmente.",
            "Nausées et inconfort digestif fréquents, montée souvent irrégulière selon la préparation et le séchage."
        ],
        "risk_factors": [
            "Danger d'identification : confondre l'amanite tue-mouches avec des amanites réellement MORTELLES (comme l'amanite phalloïde) peut être fatal, l'erreur botanique est le risque le plus grave.",
            "Aux quantités plus élevées : nausées sévères, convulsions, délire confusionnel et sédation profonde.",
            "La teneur en composés actifs varie énormément d'un spécimen et d'une préparation à l'autre, rendant la réponse imprévisible.",
            "L'association à l'alcool ou à d'autres sédatifs majore confusion et sédation."
        ],
        "avoid_if": [
            "Tu n'as pas une identification botanique certaine de l'espèce : le doute interdit toute consommation.",
            "Tu es seul·e ou dans un environnement non sécurisé, car confusion et délire peuvent survenir.",
            "Tu consommes de l'alcool ou d'autres sédatifs, qui aggravent la confusion."
        ],
        "aftercare": [
            "Reste dans un lieu calme et sûr, idéalement avec une personne sobre, jusqu'au retour complet à l'état normal.",
            "Hydrate-toi prudemment et laisse passer la somnolence en sécurité, sans conduire.",
            "Devant des convulsions, un délire marqué ou une perte de connaissance, ou au moindre doute sur l'espèce ingérée, appelle les secours sans attendre."
        ],
        "rdr_rules": [
            "N'ingère JAMAIS un spécimen sans identification botanique formelle : la confusion avec une amanite mortelle est le danger numéro un.",
            "Ne reste pas seul·e et installe-toi dans un cadre sécurisé en présence d'une personne sobre.",
            "Ne l'associe à aucun alcool ni autre sédatif.",
            "Au moindre signe grave (convulsions, délire, perte de connaissance) ou doute d'identification, contacte un centre antipoison ou les secours."
        ]
    },
    "amphetamine": {
        "effects": [
            "Montée progressive d'énergie, d'éveil et de motivation, avec euphorie modérée et envie de bouger ou de parler.",
            "Désinhibition sociale, sentiment de concentration et baisse de la sensation de fatigue sur plusieurs heures.",
            "Coupe-faim prononcé et difficulté à s'endormir tant que le produit agit.",
            "Cœur qui bat plus vite, tension qui monte, mâchoires crispées et bruxisme.",
            "Descente longue marquée par épuisement, irritabilité, déprime et craving."
        ],
        "risk_factors": [
            "Pureté très variable du speed de rue et présence fréquente d'adultérants ou de caféine qui faussent le dosage ressenti.",
            "Effet long qui pousse à réadministrer pour prolonger, avec accumulation de la charge cardiaque.",
            "Privation de sommeil et de nourriture répétée qui épuise l'organisme.",
            "Chaleur, effort physique prolongé ou combinaison avec d'autres stimulants qui favorisent l'hyperthermie."
        ],
        "avoid_if": [
            "Tu as un problème cardiaque, une tension élevée ou tu prends déjà un stimulant.",
            "Tu es en manque de sommeil important ou très anxieux·se.",
            "Tu es dans un environnement chaud et confiné sans possibilité de te rafraîchir."
        ],
        "aftercare": [
            "Accorde-toi une vraie nuit de récupération, l'effet pouvant retarder le sommeil de nombreuses heures.",
            "Réalimente-toi avec des repas complets pour compenser le coupe-faim.",
            "Anticipe une descente morose sur un ou deux jours et évite de relancer pour la masquer."
        ],
        "rdr_rules": [
            "Fixe une quantité et un horaire d'arrêt à l'avance pour éviter les redoses en cascade.",
            "Hydrate-toi régulièrement et fais des pauses au frais si tu danses ou fais un effort.",
            "Garde ton propre matériel de sniff et ne le partage pas.",
            "Laisse plusieurs jours entre les usages pour préserver sommeil et moral."
        ]
    },
    "baclofene": {
        "effects": [
            "Relâchement musculaire prononcé et sensation de détente corporelle, le muscle se dénoue.",
            "Sédation, somnolence et parfois apaisement de l'anxiété ou de l'envie de consommer.",
            "Étourdissements, faiblesse musculaire, sensation de jambes lourdes ou d'instabilité.",
            "Nausées, fatigue et troubles de la concentration possibles.",
            "Certaines personnes décrivent une légère euphorie ou un détachement, surtout en montant les quantités."
        ],
        "risk_factors": [
            "Surdosage grave et d'installation parfois rapide : il peut entraîner somnolence profonde, coma, dépression respiratoire et convulsions, avec une marge de sécurité étroite.",
            "Le cumul avec l'alcool, les opioïdes, les benzodiazépines ou d'autres sédatifs majore fortement la dépression du système nerveux.",
            "Le sevrage après usage régulier est dangereux : agitation, confusion, hallucinations, hyperthermie et convulsions sont possibles à l'arrêt brutal.",
            "L'insuffisance rénale fait s'accumuler le produit et augmente le risque de surdose."
        ],
        "avoid_if": [
            "Tu consommes de l'alcool, des opioïdes ou d'autres dépresseurs en même temps.",
            "Tu as une fonction rénale altérée, qui expose à une accumulation et à un surdosage.",
            "Tu envisages d'augmenter les quantités par toi-même, car la marge entre effet et toxicité grave est mince."
        ],
        "aftercare": [
            "Évite conduite et machines tant que persistent somnolence, faiblesse musculaire ou étourdissements.",
            "Reste dans un environnement sûr, idéalement avec quelqu'un de confiance, le temps que la sédation se dissipe.",
            "En usage régulier, n'arrête jamais brutalement : un sevrage encadré médicalement est indispensable pour éviter convulsions et confusion."
        ],
        "rdr_rules": [
            "N'augmente pas les quantités de ta propre initiative : la marge avant coma et dépression respiratoire est étroite.",
            "Ne le combine avec aucun autre dépresseur (alcool, opioïdes, benzodiazépines).",
            "Devant toute somnolence profonde, respiration lente ou difficulté à réveiller la personne, considère qu'il s'agit d'une urgence et appelle les secours.",
            "En cas d'usage installé, ne stoppe jamais d'un coup : organise une diminution progressive et accompagnée."
        ]
    },
    "bdo": {
        "effects": [
            "Le 1,4-butanediol est transformé par le corps en GHB : les effets de détente et d'ivresse sont les mêmes au final.",
            "Délai d'apparition variable et souvent plus long, ce qui rend la montée encore plus imprévisible.",
            "Désinhibition et sédation progressives qui peuvent s'intensifier alors qu'on croyait l'effet stabilisé.",
            "Endormissement profond et risque de coma une fois la conversion complète.",
            "Au réveil : amnésie partielle, nausées et sensation de gueule de bois marquée."
        ],
        "risk_factors": [
            "Délai trompeur : comme l'effet tarde, on reprend une dose et les deux montées s'additionnent dangereusement.",
            "Conversion en GHB avec la même marge minuscule entre effet et coma.",
            "La consommation d'alcool est métabolisée en priorité, ce qui peut retarder puis brutaliser l'effet du BDO.",
            "Produit chimique industriel, concentration et pureté souvent inconnues."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un autre dépresseur.",
            "Tu ne peux pas attendre patiemment et tu serais tenté·e de redoser parce que « ça ne fait rien ».",
            "Tu es seul·e, sans surveillance possible."
        ],
        "aftercare": [
            "Bois de l'eau et laisse un temps très large s'écouler, le délai d'action pouvant prolonger les effets.",
            "Si une personne sombre dans un sommeil dont on ne peut la tirer : PLS et 15 immédiatement.",
            "Ne planifie rien d'important après : la récupération et les trous de mémoire peuvent durer."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ni avec un autre dépresseur.",
            "Mesure précisément chaque dose et attends largement avant toute reprise, à cause du délai variable.",
            "Note l'heure de prise pour ne pas redoser sur une montée encore invisible.",
            "Reste entouré·e d'une personne sobre qui sait pratiquer la PLS et alerter les secours."
        ]
    },
    "benzodiazepines": {
        "effects": [
            "Apaisement de l'anxiété, relâchement musculaire et sensation de calme intérieur.",
            "Désinhibition et baisse de la prudence qui peuvent mener à des décisions à risque.",
            "Amnésie antérograde : on peut agir, parler, conduire sans en garder le moindre souvenir.",
            "Sédation, somnolence et ralentissement des réflexes quand la dose augmente.",
            "Effet de plateau prolongé, parfois avec confusion et difficultés de concentration."
        ],
        "risk_factors": [
            "Association avec alcool, opioïdes ou autres dépresseurs : risque majeur de dépression respiratoire et de coma.",
            "Dépendance qui s'installe vite, même à dose stable, avec besoin d'augmenter pour le même effet.",
            "Sevrage brutal dangereux : il peut provoquer anxiété sévère, insomnie et convulsions.",
            "Comprimés de rue souvent contrefaits ou surdosés, contenant parfois des molécules beaucoup plus puissantes."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un opioïde ou un autre sédatif.",
            "Tu prévois de conduire ou de prendre des décisions importantes (l'amnésie et la désinhibition faussent le jugement).",
            "Tu envisages d'arrêter d'un coup après un usage régulier."
        ],
        "aftercare": [
            "Laisse le produit s'éliminer avant toute autre consommation et hydrate-toi.",
            "Si tu utilises régulièrement, fais le point avec un soignant pour réduire progressivement et sans risque.",
            "Garde une trace de ce que tu prends pour ne pas redoser à cause des trous de mémoire."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool, des opioïdes ou un autre dépresseur : c'est la combinaison la plus mortelle.",
            "N'arrête jamais brutalement après un usage régulier : le sevrage doit être progressif et accompagné pour éviter les convulsions.",
            "Méfie-toi des comprimés de rue, souvent contrefaits ou bien plus dosés qu'annoncé.",
            "Évite de redoser sous l'effet de l'amnésie : note l'heure et la quantité prise."
        ]
    },
    "buprenorphine": {
        "effects": [
            "Apaisement et soulagement de la douleur avec un effet plus « plat » et stable que les agonistes complets, sans grand pic euphorique.",
            "Somnolence légère possible, mais l'effet plafonne : au-delà d'un certain point, en augmenter la quantité n'accroît plus l'effet ni la dépression respiratoire.",
            "Myosis, parfois nausées, maux de tête, sueurs et constipation, surtout en début de prise.",
            "Grâce à cet effet plafond, la buprénorphine seule est généralement plus sûre sur le plan respiratoire que les autres opioïdes.",
            "En manque : syndrome d'allure classique mais souvent plus étalé (courbatures, anxiété, insomnie, troubles digestifs) du fait de sa longue durée."
        ],
        "risk_factors": [
            "Prise trop tôt après un agoniste (héroïne, morphine, méthadone…), elle précipite un manque brutal car elle déloge l'autre opioïde de ses récepteurs.",
            "Associée aux benzodiazépines, elle devient nettement plus dangereuse sur le plan respiratoire malgré son effet plafond : ce mélange a causé des décès.",
            "L'alcool et les autres dépresseurs majorent aussi le risque respiratoire et la sédation.",
            "Sa très forte affinité fait qu'en cas de surdose mixte, la naloxone peut être moins efficace et demander des doses répétées."
        ],
        "avoid_if": [
            "Tu as pris récemment un agoniste opioïde et n'es pas déjà en début de manque : la buprénorphine peut déclencher un manque précipité très inconfortable.",
            "Tu consommes des benzodiazépines : c'est l'association la plus risquée avec la buprénorphine.",
            "Tu as bu de l'alcool ou pris d'autres sédatifs, qui s'ajoutent à son effet dépresseur."
        ],
        "aftercare": [
            "Reste accompagné, surtout si d'autres produits sont en jeu ; surveille la respiration en cas de mélange.",
            "Hydrate-toi et gère la constipation comme avec les autres opioïdes ; le mal de tête initial cède souvent avec le repos.",
            "Si un manque précipité survient, mets-toi au calme, au chaud, hydrate-toi : il est désagréable mais passe avec le temps."
        ],
        "rdr_rules": [
            "Garde de la naloxone disponible, en sachant qu'en cas de surdose impliquant la buprénorphine plusieurs doses peuvent être nécessaires.",
            "Ne consomme jamais seul, en particulier si d'autres substances entrent en jeu.",
            "Respecte un délai suffisant après un agoniste et n'envisage la buprénorphine qu'une fois le manque déjà installé, pour éviter de le précipiter.",
            "N'associe jamais de benzodiazépines, et évite alcool et autres dépresseurs."
        ]
    },
    "cafeine": {
        "effects": [
            "L'effet est un éveil rapide : vigilance accrue, sensation d'énergie et meilleure concentration, avec une légère stimulation de l'humeur.",
            "Le corps réagit par une accélération du pouls et parfois des palpitations, une diurèse augmentée et, à dose élevée, des tremblements.",
            "L'éveil peut durer plusieurs heures et perturber le sommeil si la prise est trop tardive.",
            "La bascule vers l'anxiété, la nervosité et les palpitations arrive vite quand la quantité monte.",
            "La descente s'accompagne souvent de fatigue, de baisse de concentration et parfois de maux de tête, surtout en cas d'usage régulier."
        ],
        "risk_factors": [
            "La caféine en poudre pure et les compléments très concentrés rendent le surdosage facile : une petite erreur de quantité peut correspondre à de très nombreuses tasses de café.",
            "Un surdosage provoque palpitations, agitation, vomissements et, dans les cas graves, des troubles du rythme cardiaque.",
            "Le cumul avec d'autres stimulants ou des énergisants additionne les effets sur le cœur et l'anxiété.",
            "Une fragilité cardiaque, des troubles anxieux ou des troubles du sommeil sont aggravés par des apports élevés."
        ],
        "avoid_if": [
            "Si tu manipules de la caféine en poudre sans moyen de peser précisément de très petites quantités.",
            "Si tu as une fragilité cardiaque, une tendance à l'anxiété ou des palpitations.",
            "Si tu as besoin de dormir dans les heures qui suivent."
        ],
        "aftercare": [
            "Si tu te sens trop stimulé, mets-toi au calme, hydrate-toi et laisse l'effet se dissiper.",
            "Préserve ton sommeil en évitant les apports tardifs, et anticipe un possible mal de tête de manque si tu réduis.",
            "Palpitations marquées, malaise ou vomissements après une forte quantité justifient de contacter un centre antipoison ou les secours."
        ],
        "rdr_rules": [
            "Évite la caféine en poudre pure ; sans elle, le risque de surdosage accidentel chute fortement.",
            "Ne cumule pas plusieurs sources (café, énergisants, compléments, médicaments) pour ne pas surcharger le cœur.",
            "Garde tes apports tôt dans la journée pour protéger ton sommeil.",
            "Sois attentif aux palpitations et à l'anxiété, signes qu'il faut réduire."
        ]
    },
    "cannabis": {
        "effects": [
            "Détente musculaire, sensation de bien-être, parfois fou rire et euphorie légère.",
            "Modification de la perception du temps (qui semble ralentir) et exacerbation des sens (musique, goûts, couleurs).",
            "Augmentation marquée de l'appétit (« fringale »), bouche sèche et yeux rouges.",
            "En négatif : anxiété, montée de paranoïa, tachycardie et malaise, surtout à forte dose ou chez les personnes peu habituées.",
            "En comestible (space cake, huile) : montée lente sur 1 à 2 h, effet plus fort et plus long, facile à sous-estimer."
        ],
        "risk_factors": [
            "Antécédents ou terrain psychotique, anxieux ou bipolaire : le THC peut déclencher ou aggraver les troubles.",
            "Adolescence et cerveau en développement : effets plus marqués sur la mémoire et la motivation.",
            "Association à l'alcool ou à d'autres substances : majore les malaises et la perte de repères.",
            "Usage quotidien et prolongé : installe la dépendance et le risque de syndrome d'hyperémèse cannabinoïde."
        ],
        "avoid_if": [
            "Tu prends le volant ou tu dois conduire une machine : les réflexes et l'attention sont diminués.",
            "Tu as des antécédents personnels ou familiaux de psychose ou de paranoïa marquée.",
            "Tu es enceinte ou tu allaites."
        ],
        "aftercare": [
            "En cas de malaise (pâleur, sueurs, tête qui tourne) : s'allonger, surélever les jambes et sucer un sucre lent.",
            "S'hydrater, manger légèrement et rester dans un endroit calme et rassurant jusqu'à la descente.",
            "Si des vomissements reviennent par cycles sur plusieurs jours/semaines, penser au syndrome d'hyperémèse et consulter."
        ],
        "rdr_rules": [
            "Privilégier un environnement connu et rassurant, avec une personne de confiance si tu débutes.",
            "Avec les comestibles : attendre au moins 1 à 2 h avant d'envisager de reprendre, pour éviter la surconsommation.",
            "Ne jamais prendre le volant après consommation.",
            "Espacer les usages et faire des pauses régulières pour limiter la dépendance et les effets sur la mémoire."
        ]
    },
    "cannabis_synthese": {
        "effects": [
            "Effets présentés comme « proches du cannabis » mais en réalité imprévisibles et bien plus intenses.",
            "Souvent : agitation, confusion, angoisse violente, hallucinations et perte de contact avec la réalité.",
            "Sur le plan physique : tachycardie, hypertension, sueurs, nausées et vomissements.",
            "En négatif : malaises graves, convulsions, troubles du rythme cardiaque pouvant mener au coma.",
            "Une même marque ou un même sachet peut varier énormément d'un lot à l'autre : impossible d'anticiper la dose."
        ],
        "risk_factors": [
            "Produit vendu sous forme d'herbe imprégnée ou de « buds CBD » enrichis : concentration totalement inconnue.",
            "Molécules très puissantes et très variables, parfois plusieurs centaines de fois plus actives que le THC naturel.",
            "Association à l'alcool, aux médicaments ou à d'autres substances : risque de malaise grave majoré.",
            "Terrain cardiaque, psychiatrique ou épileptique : danger accru de complications sévères."
        ],
        "avoid_if": [
            "Tu cherches un effet « comme le cannabis » : ces produits n'offrent aucune sécurité comparable.",
            "Tu as des antécédents cardiaques, épileptiques ou psychiatriques.",
            "Tu es seul(e), sans personne pouvant réagir et appeler les secours en cas de malaise."
        ],
        "aftercare": [
            "Devant agitation, convulsion, malaise ou perte de connaissance : appeler les secours (15 ou 112) sans attendre.",
            "Mettre la personne en position latérale de sécurité si elle vomit ou perd connaissance.",
            "Rester auprès d'elle, parler calmement et noter ce qui a été consommé pour informer les soignants."
        ],
        "rdr_rules": [
            "Ces cannabinoïdes de synthèse (« spice ») sont à éviter : leur dangerosité est sans commune mesure avec le cannabis.",
            "Se méfier des « fleurs CBD » ou e-liquides au rapport qualité-prix suspect, qui peuvent en contenir à l'insu de l'acheteur.",
            "Ne jamais consommer seul(e) et garder un téléphone à portée de main.",
            "En cas de doute sur un produit, ne pas le consommer : l'imprévisibilité est la règle, pas l'exception."
        ]
    },
    "carisoprodol": {
        "effects": [
            "Relâchement musculaire et détente corporelle nette.",
            "Sédation et somnolence marquées, dues en partie à sa transformation dans le corps en méprobamate, un composé sédatif de type ancien tranquillisant.",
            "Sensation d'apaisement, d'anxiolyse, parfois de légère euphorie.",
            "Étourdissements, démarche instable et troubles de la coordination.",
            "Maux de tête, nausées ou confusion possibles."
        ],
        "risk_factors": [
            "Sa conversion en méprobamate prolonge et renforce la sédation, ce qui crée un vrai potentiel de dépendance et de surdosage.",
            "Le cumul avec l'alcool, les opioïdes, les benzodiazépines ou d'autres sédatifs additionne dangereusement la dépression respiratoire.",
            "L'usage régulier installe tolérance et dépendance, avec un sevrage possible (anxiété, insomnie, tremblements, parfois convulsions).",
            "Le surdosage peut entraîner sédation profonde, dépression respiratoire et perte de connaissance."
        ],
        "avoid_if": [
            "Tu consommes de l'alcool, des opioïdes ou d'autres dépresseurs du système nerveux.",
            "Tu as des antécédents de dépendance, car le méprobamate entretient la spirale.",
            "Tu vises un usage régulier ou rapproché, schéma qui installe rapidement la dépendance."
        ],
        "aftercare": [
            "Évite conduite et machines tant que la sédation et l'instabilité persistent.",
            "Repose-toi dans un lieu sûr et hydrate-toi le temps que l'effet se dissipe.",
            "En usage installé, n'arrête pas brutalement : une diminution progressive et accompagnée limite le risque de sevrage."
        ],
        "rdr_rules": [
            "Ne le mélange à aucun autre dépresseur (alcool, opioïdes, benzodiazépines) : la sédation se cumule.",
            "Garde-le occasionnel : son métabolite sédatif favorise tolérance et dépendance en usage répété.",
            "Devant une somnolence profonde ou une respiration ralentie, traite-le comme une urgence.",
            "En cas d'usage régulier, prévois un arrêt progressif plutôt qu'un sevrage sec."
        ]
    },
    "cathinones": {
        "effects": [
            "Montée stimulante d'énergie, d'euphorie et de désinhibition, souvent courte, qui appelle vite une reconsommation.",
            "Excitation, envie de bouger ou de parler, parfois chaleur empathique selon la molécule.",
            "Coupe-faim et insomnie marqués, surtout en accumulant les prises.",
            "Cœur accéléré, tension en hausse, mâchoires serrées et bruxisme.",
            "Descente abrupte avec fatigue, anxiété, déprime et craving intense."
        ],
        "risk_factors": [
            "Durée d'effet souvent courte qui entraîne des redoses compulsives en rafale et une perte de contrôle.",
            "Produits récents mal documentés, pureté et identité réelles très incertaines.",
            "Forte charge cardiovasculaire et risque d'hyperthermie, aggravés par la chaleur et l'effort.",
            "Insomnie prolongée et fortes doses qui ouvrent la voie à la paranoïa et la psychose."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque, psychiatrique ou un terrain anxieux.",
            "Tu es seul·e, sans repère sur le produit réel ni sur ce qu'il contient.",
            "Tu es déjà épuisé·e ou en train d'enchaîner les prises."
        ],
        "aftercare": [
            "Protège ton sommeil, qui peut être repoussé longtemps après la dernière prise.",
            "Réhydrate-toi et réalimente-toi pour compenser coupe-faim et déshydratation.",
            "Accueille une descente difficile sans la combler par une nouvelle dose et reste entouré·e."
        ],
        "rdr_rules": [
            "Mets le produit hors de portée entre les prises pour casser l'automatisme des redoses.",
            "Commence très prudemment car beaucoup de cathinones sont actives à très faible quantité.",
            "Ne partage pas ton matériel de sniff ou d'injection.",
            "Hydrate-toi, reste au frais et surveille cœur et état psychique."
        ]
    },
    "cbd": {
        "effects": [
            "Non enivrant : pas d'effet « planant », pas de modification marquée de la perception ou du temps.",
            "Sensation de détente, d'apaisement, parfois légère somnolence.",
            "Effet recherché plutôt sur l'anxiété ou la tension que sur l'euphorie.",
            "Possibles effets secondaires : fatigue, somnolence, diarrhée, baisse d'appétit, bouche sèche.",
            "Le ressenti reste discret et progressif, sans « montée » au sens où on l'entend pour le THC."
        ],
        "risk_factors": [
            "Interactions médicamenteuses : le CBD inhibe des enzymes du foie et peut majorer l'effet d'anticoagulants ou d'antiépileptiques.",
            "Étiquetage souvent inexact : la teneur réelle en CBD, et parfois la présence de THC, peut différer de l'annonce.",
            "Qualité variable des produits, possibles résidus selon les fabricants.",
            "Personnes sous traitement médical : risque de modification de l'efficacité ou de la toxicité des médicaments."
        ],
        "avoid_if": [
            "Tu prends un anticoagulant, un antiépileptique ou un autre traitement à marge étroite, sans avis médical.",
            "Tu es enceinte ou tu allaites.",
            "Tu as une maladie du foie ou un suivi hépatique particulier, sans en parler à ton médecin."
        ],
        "aftercare": [
            "Si une somnolence ou une fatigue inhabituelle s'installe, éviter de conduire et se reposer.",
            "En cas de saignements inhabituels ou de modification de l'effet d'un traitement, consulter rapidement.",
            "Noter le produit utilisé et sa teneur supposée pour en parler à un professionnel de santé."
        ],
        "rdr_rules": [
            "Signaler la prise de CBD à son médecin ou pharmacien, surtout en cas de traitement au long cours.",
            "Se méfier de l'étiquetage : la composition annoncée n'est pas toujours fiable.",
            "Le CBD n'enivre pas, mais n'est pas anodin : prudence en cas d'association avec des médicaments.",
            "En cas de somnolence, ne pas conduire."
        ]
    },
    "cbc": {
        "effects": [
            "Cannabinoïde végétal mineur, peu ou pas enivrant seul, avec un ressenti souvent discret.",
            "Les effets rapportés dépendent surtout du produit complet : présence de THC, CBD, terpènes et autres cannabinoïdes.",
            "Par voie orale, la montée peut être lente comme pour les autres cannabinoïdes ingérés.",
            "Par inhalation, le ressenti arrive plus vite, mais la teneur réelle en CBC reste rarement connue.",
            "Le profil humain reste peu documenté : une absence d'effet net ne prouve pas que le produit est inactif ou bien dosé."
        ],
        "risk_factors": [
            "Données humaines limitées, en particulier pour les produits isolés ou enrichis en CBC.",
            "Étiquetage incertain : la teneur annoncée en CBC, la présence de THC et la pureté peuvent différer de l'annonce.",
            "Inhalation de fleurs, résines ou extraits : irritation respiratoire et exposition aux produits de combustion ou de chauffe.",
            "Interactions médicamenteuses possibles par prudence, surtout avec des traitements métabolisés par le foie."
        ],
        "avoid_if": [
            "Tu es sous traitement à marge étroite ou suivi médical hépatique, sans avis professionnel.",
            "Le produit n'a pas d'analyse fiable ou sa teneur réelle en cannabinoïdes est inconnue.",
            "Tu dois conduire, travailler avec des machines ou rester parfaitement vigilant."
        ],
        "aftercare": [
            "Si une somnolence ou un malaise apparaît, rester au calme et éviter la conduite.",
            "En cas de toux, gêne respiratoire ou douleur thoracique après inhalation, arrêter l'exposition et demander un avis médical si cela persiste.",
            "Noter la marque, la forme et l'analyse disponible pour identifier les produits mal étiquetés."
        ],
        "rdr_rules": [
            "Ne pas se fier au seul nom CBC : vérifier certificat d'analyse, teneur en THC et solvants résiduels.",
            "Par voie orale, attendre suffisamment longtemps avant toute reprise pour éviter d'empiler des effets retardés.",
            "Ne pas fumer ou vapoter une huile ou un extrait qui n'est pas explicitement prévu pour l'inhalation.",
            "Garder une approche prudente avec les mélanges de cannabinoïdes, même si CBC seul est peu enivrant."
        ]
    },
    "champignons": {
        "effects": [
            "Montée progressive sur 20 à 60 minutes, fréquemment précédée de nausées, de salivation et d'une sensation de lourdeur digestive.",
            "Plateau marqué par des distorsions visuelles, une amplification des émotions et des pensées, et un sentiment de connexion.",
            "Composante corporelle nette : bâillements, frissons, ventre qui travaille, jambes lourdes.",
            "Descente douce et étalée sur plusieurs heures, suivie d'une fatigue agréable.",
            "L'expérience peut basculer du ravissement à l'angoisse, surtout si la dose ressentie dépasse les attentes."
        ],
        "risk_factors": [
            "La teneur en psilocybine varie fortement d'un champignon à l'autre, même au sein d'une même récolte : la puissance réelle est imprévisible.",
            "La confusion d'espèce est un danger majeur : certaines espèces ressemblantes sont toxiques voire mortelles.",
            "Une consommation à jeun ou trop rapide accentue les nausées et l'inconfort digestif.",
            "Un cadre anxiogène ou un état émotionnel fragile augmente le risque de mauvaise expérience."
        ],
        "avoid_if": [
            "Si l'identification de l'espèce n'est pas certaine à 100 %.",
            "Si tu traverses une période de grande anxiété, de dépression sévère ou d'instabilité psychique.",
            "Si tu es dans un lieu stressant, sans personne de confiance à proximité."
        ],
        "aftercare": [
            "Hydrate-toi et attends le retour de l'appétit avant de manger quelque chose de léger.",
            "Garde la soirée calme et offre-toi une vraie nuit de récupération.",
            "Prends un temps le lendemain pour revenir sur le vécu, l'humeur restant parfois sensible."
        ],
        "rdr_rules": [
            "N'utilise que des champignons dont l'espèce est identifiée avec certitude.",
            "Garde en tête que la puissance varie : reste prudent même avec une quantité habituelle.",
            "Mets en place un cadre rassurant avec une personne sobre de confiance et un environnement connu.",
            "Patiente largement avant d'envisager de reprendre quoi que ce soit : la montée est lente."
        ]
    },
    "clonazepam": {
        "effects": [
            "Apaisement durable de l'anxiété et effet anticonvulsivant, avec une montée discrète.",
            "Désinhibition et émoussement émotionnel possibles.",
            "Amnésie des heures suivant la prise.",
            "Sédation et somnolence prolongées, du fait de sa longue durée d'action.",
            "Sensation de calme qui s'étale sur une longue période."
        ],
        "risk_factors": [
            "Longue durée d'action : risque d'accumulation et de sédation prolongée en cas de prises rapprochées.",
            "Mélange avec alcool ou opioïdes : dépression respiratoire et coma possibles.",
            "Dépendance et sevrage long, parfois difficile à cause de la durée d'élimination.",
            "Puissance notable : de petites quantités suffisent à produire des effets marqués."
        ],
        "avoid_if": [
            "Tu as consommé de l'alcool ou un opioïde.",
            "Tu en as pris récemment et il peut encore agir.",
            "Tu dois conduire ou rester pleinement vigilant·e."
        ],
        "aftercare": [
            "Anticipe une somnolence qui peut se prolonger au-delà de la journée.",
            "Bois de l'eau et évite de cumuler les prises tant que les effets persistent.",
            "Si tu utilises régulièrement, organise une diminution progressive avec un professionnel."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool, des opioïdes ou un autre dépresseur.",
            "Espace largement les prises : sa longue durée d'action favorise l'accumulation.",
            "N'arrête pas brutalement après un usage régulier : décroissance lente et accompagnée pour éviter les convulsions.",
            "Garde une trace de tes prises pour ne pas redoser sur un effet encore actif."
        ]
    },
    "clonazolam": {
        "effects": [
            "Sédation et apaisement extrêmement puissants, avec une montée qui peut être rapide.",
            "Désinhibition très marquée pouvant conduire à des actes dangereux sans en avoir conscience.",
            "Amnésie quasi systématique et souvent complète.",
            "Sédation profonde pouvant aller jusqu'à l'endormissement involontaire et la perte de contrôle.",
            "Effets prolongés qui maintiennent l'état de stupeur longtemps."
        ],
        "risk_factors": [
            "Une des benzodiazépines de synthèse les plus puissantes, active sous le milligramme : une fraction de dose suffit à assommer.",
            "Impossible à doser sans matériel de précision : une pesée « à l'œil » mène facilement à la surdose.",
            "Mélange avec alcool ou opioïdes : risque très élevé de dépression respiratoire et de coma.",
            "L'amnésie profonde fait perdre la notion de ce qu'on a déjà pris et pousse à redoser à l'aveugle."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un opioïde.",
            "Tu ne disposes pas d'un moyen fiable de mesurer une dose aussi infime.",
            "Tu es seul·e, sans surveillance possible."
        ],
        "aftercare": [
            "Reste accompagné·e longtemps : la sédation profonde peut se prolonger bien au-delà de la prise.",
            "En cas d'endormissement avec respiration lente, PLS et appel au 15 sans attendre.",
            "Après un usage régulier, n'arrête jamais seul·e : le sevrage doit être médicalement encadré."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ou des opioïdes.",
            "Sa puissance sous le milligramme rend tout dosage approximatif extrêmement dangereux : sans balance de précision, on ne peut pas évaluer.",
            "Ne redose jamais à l'aveugle sous l'effet de l'amnésie : note précisément ce que tu prends.",
            "N'arrête pas brutalement après un usage régulier : sevrage progressif accompagné pour éviter les convulsions."
        ]
    },
    "cocaine": {
        "effects": [
            "Montée rapide et brève d'énergie, d'euphorie, de confiance en soi et de désinhibition, suivie d'un pic court qui pousse à reconsommer.",
            "Sensation d'éveil intense et de vivacité mentale, parole accélérée, sentiment de toute-puissance qui s'estompe vite.",
            "Accélération du cœur, montée de tension artérielle, vasoconstriction et mâchoires serrées avec parfois grincements de dents.",
            "Coupe-faim net et besoin réduit de sommeil pendant l'effet.",
            "Descente marquée par fatigue, déprime, irritabilité, anxiété et craving qui relance la consommation en rafale."
        ],
        "risk_factors": [
            "Mélange avec l'alcool qui produit du cocaéthylène, plus toxique pour le cœur et le foie et prolongeant l'effet stimulant.",
            "Redoses rapprochées sur une soirée qui augmentent la charge cardiaque et la tension artérielle.",
            "Pureté très variable et adultérants (lévamisole, anesthésiques) impossibles à évaluer à l'œil.",
            "Antécédents cardiaques, tension élevée ou prise d'autres stimulants qui majorent le risque cardiovasculaire."
        ],
        "avoid_if": [
            "Tu as des antécédents cardiaques, une hypertension ou des douleurs thoraciques.",
            "Tu prévois de boire beaucoup d'alcool en parallèle.",
            "Tu es seul·e, épuisé·e ou dans un état de grande anxiété."
        ],
        "aftercare": [
            "Prévois plusieurs heures de repos et de sommeil pour laisser le cœur et le système nerveux récupérer.",
            "Réhydrate-toi et remange même sans faim, car le coupe-faim a creusé un déficit.",
            "Accueille la déprime de descente sans la combler par une nouvelle prise, et reste entouré·e si le moral chute."
        ],
        "rdr_rules": [
            "Espace réellement les prises et fixe-toi une limite avant de commencer, car le craving fausse le jugement.",
            "Évite de combiner avec l'alcool pour ne pas générer de cocaéthylène.",
            "Utilise ta propre paille pour ne pas partager de matériel de sniff et limiter les infections.",
            "Hydrate-toi régulièrement et surveille les signes d'alerte cardiaque (douleur thoracique, palpitations fortes)."
        ]
    },
    "codeine": {
        "effects": [
            "Effet opioïde plus doux que la morphine : légère chaleur, détente et soulagement de la douleur, avec une euphorie modérée.",
            "Somnolence possible, surtout aux quantités plus élevées, avec une tête un peu cotonneuse.",
            "Myosis, démangeaisons, nausées et constipation marquée font partie des effets courants.",
            "La respiration peut tout de même se déprimer à forte dose ou en mélange : à ne pas négliger malgré l'image « faible » de la codéine.",
            "En manque : courbatures, anxiété, sueurs, nez qui coule, troubles digestifs et insomnie."
        ],
        "risk_factors": [
            "La codéine est très souvent associée au paracétamol : monter les quantités pour l'effet opioïde expose à une intoxication hépatique grave par le paracétamol, potentiellement mortelle.",
            "Le métabolisme varie d'une personne à l'autre : certains « métaboliseurs rapides » transforment la codéine en morphine bien plus vite, avec un risque de surdose inattendu.",
            "La dépression respiratoire reste possible aux fortes quantités et en mélange avec alcool, benzodiazépines ou autres dépresseurs.",
            "Son accès relativement facile favorise un usage chronique et une dépendance qui s'installe insidieusement."
        ],
        "avoid_if": [
            "Le produit contient du paracétamol et tu songes à augmenter les quantités : le risque pour le foie devient majeur bien avant un effet opioïde fort.",
            "Tu as consommé de l'alcool (toxique pour le foie et dépresseur), des benzodiazépines ou d'autres sédatifs.",
            "Tu es seul ou tu sais/penses être métaboliseur rapide, ce qui rend l'effet imprévisible."
        ],
        "aftercare": [
            "Vérifie la composition pour ne pas cumuler du paracétamol sans le savoir ; en cas de nausées persistantes, douleurs au ventre ou fatigue inhabituelle après de grandes quantités, consulte (foie).",
            "Hydrate-toi et gère la constipation, fréquente avec la codéine.",
            "Après un manque, repose-toi, garde-toi au chaud et hydrate-toi pour récupérer."
        ],
        "rdr_rules": [
            "Repère toujours si le produit contient du paracétamol et ne monte jamais les quantités à cause de ce risque hépatique.",
            "Garde de la naloxone disponible et sache l'utiliser ; ne consomme pas seul à forte dose.",
            "N'associe ni alcool, ni benzodiazépines, ni autres dépresseurs.",
            "Méfie-toi de l'image « opioïde faible » : la variabilité du métabolisme peut transformer une quantité habituelle en surdose."
        ]
    },
    "datura": {
        "effects": [
            "DÉLIRE anticholinergique intense et dangereux : hallucinations totalement réalistes, vécues comme réelles, avec perte complète du contact avec la réalité.",
            "Confusion profonde, désorientation, incapacité à reconnaître ses proches, agitation et amnésie de l'épisode.",
            "Signes corporels marqués : pupilles très dilatées, bouche et peau sèches, cœur emballé, vision floue durable, montée de la température.",
            "Expérience généralement terrifiante, dysphorique et pouvant durer très longtemps, sans dimension agréable.",
            "Effets et durée imprévisibles, variant énormément d'une plante et d'une partie à l'autre."
        ],
        "risk_factors": [
            "Teneur en alcaloïdes (scopolamine, atropine) extrêmement variable d'une plante, d'une saison et d'une partie à l'autre : il n'existe AUCUNE quantité que l'on puisse considérer comme sûre.",
            "Risque VITAL réel : la marge entre effet et intoxication grave est imprévisible, avec troubles graves du rythme cardiaque, hyperthermie, convulsions et coma.",
            "Le délire fait perdre tout jugement : risque majeur d'accidents, de blessures et de mises en danger pendant l'épisode.",
            "L'association à d'autres anticholinergiques ou à l'alcool aggrave encore la toxicité."
        ],
        "avoid_if": [
            "Tu cherches une expérience maîtrisée : la dose ne peut pas l'être, le risque est vital.",
            "Tu as une maladie cardiaque, ou tu es seul·e et sans personne sobre à proximité.",
            "Tu prends d'autres substances anticholinergiques ou de l'alcool, qui aggravent la toxicité."
        ],
        "aftercare": [
            "Toute ingestion doit être considérée comme une urgence médicale : oriente la personne vers les secours ou un centre antipoison sans attendre.",
            "En attendant les secours, mets la personne en sécurité dans un lieu frais et calme, surveille respiration, température et conscience.",
            "Ne la laisse jamais seule pendant le délire et empêche tout accès à des objets ou situations dangereux."
        ],
        "rdr_rules": [
            "Retiens qu'il n'existe aucune dose sûre : la teneur en alcaloïdes est imprévisible et le risque est vital.",
            "Considère toute ingestion comme une urgence : contacte les secours ou un centre antipoison.",
            "Ne laisse jamais la personne seule et sécurise l'environnement pendant le délire.",
            "N'associe aucun autre anticholinergique ni alcool."
        ]
    },
    "dck": {
        "effects": [
            "Dissociation de type kétamine mais plus puissante et plus longue : détachement marqué du corps et de l'environnement.",
            "Distorsions de l'espace et du temps prononcées, sensations corporelles atténuées, esprit éloigné du réel.",
            "Montée pouvant sembler progressive, suivie d'un plateau étiré et d'une descente plus lente que la kétamine.",
            "Plongée dans un état immobilisant proche du K-hole à doses plus élevées, avec perte des repères.",
            "Coordination et équilibre fortement dégradés, sur une durée prolongée."
        ],
        "risk_factors": [
            "Puissance supérieure à la kétamine : une quantité qui paraît modeste peut produire des effets bien plus intenses.",
            "Durée allongée qui prolonge la fenêtre de risque de chute, de vomissement ou de mélange.",
            "Mélange avec dépresseurs (alcool, opioïdes, benzodiazépines), qui majore sédation et risque de fausse route.",
            "Usage répété exposant, comme les autres analogues de la kétamine, à des atteintes urinaires."
        ],
        "avoid_if": [
            "Tu raisonnes en quantités d'« habitude » sans tenir compte de la puissance supérieure de ce produit.",
            "Tu n'as pas plusieurs heures au calme dans un lieu sûr pour traverser des effets prolongés.",
            "Tu es seul ou dans un environnement où une immobilisation prolongée serait dangereuse."
        ],
        "aftercare": [
            "Prévois une récupération longue, les effets et la fatigue se prolongeant plus qu'avec la kétamine.",
            "Hydrate-toi, reste au chaud et surveille tout signe urinaire dans les jours suivants.",
            "Espace nettement les usages et reste vigilant face au risque d'usage compulsif."
        ],
        "rdr_rules": [
            "Reste assis ou allongé sur le côté pendant toute la durée, plus longue qu'avec la kétamine.",
            "Tiens compte de la puissance accrue et n'envisage aucune reprise rapide, même si la montée semble lente.",
            "Ne mélange jamais avec l'alcool, les opioïdes ou les benzodiazépines.",
            "Sois accompagné d'une personne sobre informée de la durée et de l'intensité des effets."
        ]
    },
    "delta8": {
        "effects": [
            "Effets cannabiques décrits comme plus doux et un peu moins anxiogènes que le THC classique par certains usagers.",
            "Détente, légère euphorie, modification de la perception et du temps.",
            "Ressenti variable d'une personne et d'un produit à l'autre.",
            "En négatif : anxiété, accélération du cœur, somnolence, bouche sèche, surtout à forte dose.",
            "En comestible : montée lente et retardée, effet plus fort qu'attendu, facile à sous-estimer."
        ],
        "risk_factors": [
            "Le delta-8 est le plus souvent fabriqué à partir de CBD par transformation chimique, ce qui laisse des impuretés de synthèse.",
            "Pureté et composition très variables, étiquetage souvent inexact.",
            "Contrôles de qualité quasi absents sur de nombreux produits.",
            "Terrain anxieux, cardiaque ou psychiatrique : prudence accrue."
        ],
        "avoid_if": [
            "Tu prends le volant ou dois rester pleinement vigilant(e).",
            "Tu as des antécédents de paranoïa, d'anxiété sévère ou de troubles cardiaques.",
            "Tu es enceinte ou tu allaites."
        ],
        "aftercare": [
            "En cas de malaise (pâleur, sueurs, tête qui tourne) : s'allonger, surélever les jambes, prendre un sucre lent.",
            "S'hydrater, rester au calme et attendre tranquillement la fin des effets.",
            "Conserver l'emballage et noter la quantité prise au cas où un avis médical serait utile."
        ],
        "rdr_rules": [
            "Garder à l'esprit que le delta-8 contient souvent des résidus de synthèse : la « douceur » annoncée ne signifie pas innocuité.",
            "Avec les comestibles : attendre largement avant d'envisager de reprendre.",
            "Éviter de cumuler avec l'alcool ou d'autres substances et privilégier un cadre rassurant.",
            "Ne jamais conduire après consommation."
        ]
    },
    "diazepam": {
        "effects": [
            "Détente musculaire profonde et apaisement de l'anxiété, avec une montée plutôt douce et progressive.",
            "Désinhibition et baisse de la vigilance pouvant fausser le jugement.",
            "Amnésie possible des événements suivant la prise.",
            "Sédation et somnolence qui peuvent durer longtemps, du fait de sa longue durée d'action.",
            "Sensation de calme prolongée, parfois accompagnée de lenteur d'idées."
        ],
        "risk_factors": [
            "Demi-vie très longue : le produit et ses métabolites s'accumulent au fil des prises, prolongeant la sédation des jours durant.",
            "Cette accumulation augmente le risque de surdose en cas de reprises rapprochées.",
            "Mélange avec alcool ou opioïdes : dépression respiratoire et coma possibles.",
            "Dépendance qui s'installe et sevrage long et délicat en raison de la durée d'action."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un opioïde ou un autre dépresseur.",
            "Tu en as déjà pris récemment : il peut encore être très présent dans l'organisme.",
            "Tu prévois de conduire ou d'accomplir une tâche exigeant de la vigilance."
        ],
        "aftercare": [
            "Tiens compte de l'accumulation : la somnolence peut persister le lendemain et au-delà.",
            "Hydrate-toi et évite de cumuler les prises tant que les effets précédents ne sont pas dissipés.",
            "Pour un arrêt après usage régulier, prévois une décroissance lente avec un soignant."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool, des opioïdes ou un autre dépresseur.",
            "Tiens compte de la longue durée d'action : espace largement les prises pour éviter l'accumulation.",
            "N'arrête pas brutalement après un usage régulier : sevrage très progressif pour prévenir les convulsions.",
            "Note tes prises afin de ne pas redoser sur des effets encore présents."
        ]
    },
    "diphenidine": {
        "effects": [
            "Dissociation longue et progressive : détachement du corps et de l'environnement qui s'installe puis se prolonge des heures.",
            "Distorsions de l'espace et du temps, esprit éloigné du réel, parfois confusion.",
            "Montée lente et trompeuse pouvant donner l'impression d'un sous-dosage avant que les effets ne grimpent.",
            "Plateau étiré suivi d'une descente lente, avec à doses fortes un état immobilisant.",
            "Coordination et équilibre nettement altérés sur une longue durée."
        ],
        "risk_factors": [
            "Marge étroite entre une dose recherchée et une dose qui bascule dans la confusion ou l'immobilisation.",
            "Montée lente poussant aux redoses qui s'accumulent dangereusement.",
            "Durée prolongée allongeant la fenêtre de risque de chute, de vomissement ou de mélange.",
            "Mélange avec dépresseurs (alcool, opioïdes, benzodiazépines), qui majore sédation et risque de fausse route."
        ],
        "avoid_if": [
            "Tu es tenté de redoser parce que les effets tardent à apparaître.",
            "Tu n'as pas de longues heures devant toi dans un lieu sûr et calme.",
            "Tu es seul ou dans un environnement où une perte de repères prolongée serait dangereuse."
        ],
        "aftercare": [
            "Prévois une récupération longue, effets et fatigue se prolongeant bien après le pic.",
            "Hydrate-toi et reste au chaud, la coordination revenant lentement.",
            "Note la durée réelle ressentie pour mieux résister à l'envie de redoser la prochaine fois."
        ],
        "rdr_rules": [
            "Compte tenu de la marge étroite, n'envisage aucune reprise rapide même si la montée semble lente.",
            "Reste assis ou allongé sur le côté pendant toute la durée, longue et étalée.",
            "Ne mélange jamais avec l'alcool, les opioïdes ou les benzodiazépines.",
            "Sois accompagné d'une personne sobre informée de la durée prolongée des effets."
        ]
    },
    "dipt": {
        "effects": [
            "Montée lente sur une à deux heures, souvent discrète au début, avec peu d'effets visuels.",
            "Effet signature : distorsion de l'audition : les sons, les voix et la musique paraissent décalés, plus graves ou désaccordés.",
            "Composante corporelle légère mais parfois inconfortable : nausées, maux de tête, sensation d'oreilles « bouchées ».",
            "Le mental reste relativement clair comparé à d'autres psychédéliques, l'altération étant surtout sonore.",
            "Le décalage auditif persistant peut devenir déstabilisant ou anxiogène à la longue."
        ],
        "risk_factors": [
            "La distorsion auditive prolongée peut être désagréable et perturber le rapport à l'environnement.",
            "Substance de recherche très peu étudiée, aux interactions et effets mal connus.",
            "En poudre, le dosage imprécis rend l'intensité difficile à prévoir.",
            "La durée longue expose à une fatigue et à une lassitude si le vécu est inconfortable."
        ],
        "avoid_if": [
            "Si tu as besoin de bien entendre ou de communiquer clairement (situation exigeante, responsabilités).",
            "Si tu es déjà gêné par des acouphènes ou une sensibilité auditive.",
            "Si tu traverses une période anxieuse ou si le cadre n'est pas posé."
        ],
        "aftercare": [
            "Laisse à l'audition le temps de revenir à la normale avant toute activité où bien entendre compte.",
            "Repose-toi au calme, dans un environnement sonore doux.",
            "Hydrate-toi et offre-toi une nuit tranquille, la durée longue pouvant fatiguer."
        ],
        "rdr_rules": [
            "Pèse au milligramme et commence bas, les données étant rares.",
            "Anticipe une expérience longue et surtout auditive : prévois du temps libre devant toi.",
            "Choisis un environnement sonore calme et une personne de confiance.",
            "Garde en tête que le décalage auditif est attendu, pour mieux l'accueillir sans panique."
        ]
    },
    "dmt": {
        "effects": [
            "Fumée ou vaporisée, la montée est quasi immédiate : en quelques respirations, l'environnement habituel se dissout.",
            "Le pic est extrêmement intense et très court (souvent quelques minutes), avec géométries colorées, sensation de traverser un « espace » et parfois rencontres d'entités.",
            "Composante corporelle marquée : pression dans la poitrine, vibrations, bourdonnement, le corps semble lointain ou figé.",
            "Le retour est rapide et la conscience ordinaire revient en général en une quinzaine de minutes, parfois avec un sentiment de stupeur.",
            "La bascule vers l'angoisse est possible quand l'effet arrive trop vite à pleine intensité et que la personne se sent submergée."
        ],
        "risk_factors": [
            "La fulgurance de la montée fumée laisse peu de temps pour s'ajuster, ce qui peut déclencher une panique.",
            "Pris en ayahuasca, le DMT est associé à un IMAO (harmala) : ce contexte ajoute des restrictions alimentaires et médicamenteuses strictes et un risque de syndrome sérotoninergique.",
            "Un environnement bruyant, debout ou non sécurisé expose aux chutes pendant la perte de repères.",
            "Un terrain psychique fragile (psychose, trouble dissociatif) peut être fortement déstabilisé."
        ],
        "avoid_if": [
            "Si tu es seul, debout, ou dans un lieu où tu peux tomber ou te blesser.",
            "Si tu traverses une période d'anxiété aiguë, de deuil mal vécu ou d'instabilité psychique.",
            "Si tu as pris des antidépresseurs ou tout produit augmentant la sérotonine, surtout dans le cadre ayahuasca/IMAO."
        ],
        "aftercare": [
            "Reste allongé ou assis au calme après le pic, le temps que les repères corporels reviennent complètement.",
            "Laisse-toi un long moment de silence avant de parler, de te lever ou de reprendre une activité.",
            "Note ou partage ce que tu as vécu plus tard : l'expérience est dense et mérite d'être posée à froid."
        ],
        "rdr_rules": [
            "Installe-toi toujours allongé ou bien calé avant de commencer, dans un endroit sûr.",
            "Aie une personne sobre de confiance présente, capable de te rassurer et de veiller à ta sécurité.",
            "En contexte ayahuasca, respecte scrupuleusement les contre-indications IMAO (aliments, médicaments) ; ne combine jamais avec d'autres sérotoninergiques.",
            "Choisis un cadre calme, sans écran ni bruit, pour ne pas amplifier la désorientation."
        ]
    },
    "dob": {
        "effects": [
            "Montée très lente, parfois plus de deux heures, vers un plateau qui peut s'étirer jusqu'à vingt-quatre heures.",
            "Effets psychédéliques visuels prononcés couplés à une stimulation amphétaminique persistante.",
            "Vasoconstriction marquée : extrémités froides, sensation de membres comprimés, fréquence cardiaque élevée.",
            "La durée extrême épuise et peut faire basculer la longue fin d'effet vers l'anxiété et l'insomnie."
        ],
        "risk_factors": [
            "Le produit est actif à une quantité minuscule : sans balance de précision au milligramme, le surdosage est très facile.",
            "La vasoconstriction est particulièrement marquée et peut devenir douloureuse, surtout en cas d'excès.",
            "La durée pouvant dépasser vingt-quatre heures est presque toujours sous-estimée.",
            "La montée très lente pousse à redoser, ce qui est une cause connue d'accidents."
        ],
        "avoid_if": [
            "Vous n'avez pas de balance capable de peser au milligramme près.",
            "Vous présentez des antécédents cardiovasculaires ou des troubles circulatoires.",
            "Vous n'avez pas plus d'une journée entière libre devant vous."
        ],
        "aftercare": [
            "Anticipez une récupération longue et un sommeil très retardé : ne prévoyez rien d'important le lendemain.",
            "Hydratez-vous, réchauffez vos extrémités et reprenez une alimentation légère une fois redescendu.",
            "Surveillez la circulation des mains et des pieds dans les jours suivants et consultez si une douleur ou un engourdissement persiste."
        ],
        "rdr_rules": [
            "Une balance de précision au milligramme est indispensable : c'est la mesure de sécurité numéro un pour cette molécule.",
            "N'effectuez aucune redose : la montée est très lente et la durée déjà extrême.",
            "Surveillez activement les extrémités froides ou douloureuses, signes de vasoconstriction, et consultez si elles s'aggravent."
        ]
    },
    "doc": {
        "effects": [
            "Montée lente sur deux à trois heures, suivie d'un plateau psychédélique extrêmement long, l'effet pouvant durer de douze à vingt heures.",
            "Visuels intenses et stimulation marquée, avec une énergie « speedée » typique des amphétamines psychédéliques.",
            "Vasoconstriction nette : extrémités froides, sensation de tension dans les membres, cœur qui bat plus vite et plus fort.",
            "La très longue durée use le système nerveux et fait souvent basculer la fin d'expérience vers l'épuisement et l'anxiété."
        ],
        "risk_factors": [
            "La durée de douze à vingt heures est régulièrement sous-estimée et transforme une soirée en marathon ingérable.",
            "La montée lente est un piège classique : redoser par impatience est une cause connue d'accidents.",
            "La vasoconstriction et la charge cardiovasculaire se prolongent pendant toute la durée, longue, de l'effet.",
            "Le produit est actif à très faible quantité : sans balance de précision, le surdosage est facile."
        ],
        "avoid_if": [
            "Vous ne disposez pas d'une journée entière et de la nuit suivante entièrement libres.",
            "Vous avez des antécédents cardiaques, de l'hypertension ou des troubles de la circulation.",
            "Vous êtes tenté de redoser ou de mélanger avec un stimulant, ce qui aggraverait la vasoconstriction."
        ],
        "aftercare": [
            "Prévoyez un sommeil possiblement très retardé et plusieurs heures de récupération avant toute activité exigeante.",
            "Réhydratez-vous, mangez léger et réchauffez vos extrémités si elles sont restées froides.",
            "Laissez passer plusieurs semaines avant un éventuel nouvel usage et surveillez la fatigue, l'humeur et la circulation les jours suivants."
        ],
        "rdr_rules": [
            "Ne redosez jamais : la montée peut prendre trois heures et la durée est déjà très longue.",
            "Pesez la quantité au milligramme près avec une balance adaptée, car le produit est actif à faible dose.",
            "Bloquez une journée entière libre, installez un cadre stable et surveillez les signes de vasoconstriction (extrémités froides, douleurs)."
        ]
    },
    "doi": {
        "effects": [
            "Montée lente, suivie d'un plateau d'une durée extrême : l'effet total peut atteindre seize à trente heures.",
            "Visuels psychédéliques soutenus et stimulation amphétaminique qui se prolonge très tard.",
            "Vasoconstriction et charge cardiovasculaire qui durent sur l'ensemble de l'expérience.",
            "La durée hors norme provoque souvent une insomnie prolongée et un épuisement qui pèse en fin de parcours."
        ],
        "risk_factors": [
            "La durée extrême, parfois supérieure à vingt-quatre heures, entraîne insomnie et épuisement prolongés.",
            "La vasoconstriction se maintient pendant toute cette longue durée.",
            "La montée lente favorise les redoses dangereuses.",
            "Le produit est actif à faible quantité, ce qui rend la pesée précise indispensable."
        ],
        "avoid_if": [
            "Vous ne pouvez pas vous permettre une nuit blanche suivie d'une journée de récupération.",
            "Vous avez des antécédents cardiovasculaires ou des troubles de la circulation.",
            "Vous devez assurer des responsabilités, conduire ou travailler dans les vingt-quatre à trente heures qui suivent."
        ],
        "aftercare": [
            "Anticipez une nuit blanche et organisez votre récupération sur le ou les jours suivants.",
            "Hydratez-vous, mangez léger dès que possible et favorisez le retour du sommeil dans le calme.",
            "Surveillez l'épuisement, l'anxiété et la circulation périphérique les jours suivants, et consultez en cas de gêne persistante."
        ],
        "rdr_rules": [
            "Ne redosez jamais : la durée est déjà extrême et la montée trompeusement lente.",
            "Anticipez concrètement une nuit blanche et le lendemain avant même de commencer.",
            "Une balance de précision est obligatoire, et une personne sobre joignable est vivement recommandée sur une si longue durée."
        ]
    },
    "dom": {
        "effects": [
            "Montée progressive sur une à deux heures vers un plateau psychédélique long, l'effet total durant souvent dix à seize heures.",
            "Visuels et altération de la pensée prononcés, avec une stimulation amphétaminique en arrière-plan.",
            "Charge corporelle réelle : tension, mâchoires serrées, cœur accéléré, parfois sensation de fraîcheur aux extrémités.",
            "Historiquement surnommée STP, elle a une marge étroite qui peut faire basculer vite vers l'inconfort et l'angoisse."
        ],
        "risk_factors": [
            "La marge entre une dose modérée et une dose accablante est étroite, et la molécule a causé des accidents par le passé quand elle a été vendue surdosée.",
            "Le produit est actif à faible quantité, d'où un risque de surdosage sans pesée précise.",
            "La longue durée est régulièrement sous-estimée.",
            "La montée lente incite à redoser par impatience."
        ],
        "avoid_if": [
            "Vous n'avez pas la possibilité de peser la quantité avec précision.",
            "Vous traversez une période psychique fragile ou un contexte instable.",
            "Vous n'avez pas une longue plage de temps libre et un cadre stable devant vous."
        ],
        "aftercare": [
            "Prévoyez un temps de repos étendu et un sommeil possiblement retardé après une expérience longue.",
            "Réhydratez-vous doucement et mangez léger une fois la descente bien engagée.",
            "Espacez nettement les usages et restez attentif à la fatigue et à l'humeur les jours suivants."
        ],
        "rdr_rules": [
            "Commencez très bas et pesez précisément : la marge étroite de cette molécule la rend peu indulgente.",
            "N'effectuez aucune redose avant la fin de la montée, qui peut prendre une à deux heures.",
            "Réservez une longue plage de temps et installez un cadre stable avec une personne sobre joignable."
        ]
    },
    "dph": {
        "effects": [
            "À doses banales : somnolence, bouche sèche, lourdeur ; ce n'est pas une substance récréative et l'expérience recherchée est généralement très désagréable.",
            "DÉLIRE anticholinergique aux quantités plus élevées : hallucinations réalistes indistinguables du réel (personnes, insectes, toiles d'araignée, conversations), sans recul ni conscience qu'elles sont irréelles.",
            "Confusion profonde, désorientation, agitation, angoisse et amnésie de l'épisode.",
            "Signes corporels typiques : cœur qui s'emballe, bouche et peau très sèches, peau rouge, vision trouble, rétention urinaire, montée de la température corporelle.",
            "Vécu souvent terrifiant et dysphorique, sans dimension euphorisante."
        ],
        "risk_factors": [
            "Cardiotoxicité : aux quantités élevées, troubles graves du rythme cardiaque pouvant être mortels.",
            "Hyperthermie (surchauffe du corps), convulsions et délire dangereux qui exposent à des accidents et à des blessures.",
            "Le délire fait perdre tout jugement et tout contact avec la réalité : risque de comportements dangereux pour soi.",
            "L'association à d'autres anticholinergiques ou à des sédatifs aggrave fortement la toxicité."
        ],
        "avoid_if": [
            "Tu as un trouble du rythme cardiaque ou une maladie du cœur : la cardiotoxicité est majeure.",
            "Tu es seul·e ou sans personne sobre à proximité, car le délire fait perdre le contrôle.",
            "Tu prends d'autres médicaments ou substances à effet anticholinergique, dont les effets se cumulent dangereusement."
        ],
        "aftercare": [
            "Place-toi dans un environnement frais, calme et sécurisé, accompagné·e d'une personne sobre, jusqu'à dissipation complète de la confusion.",
            "Hydrate-toi et surveille les signes de surchauffe ; rafraîchis le corps si la température monte.",
            "Devant un cœur très emballé, une fièvre élevée, des convulsions, une rétention urinaire ou un délire intense, appelle les secours : c'est une urgence."
        ],
        "rdr_rules": [
            "Considère le délire anticholinergique comme un état dangereux et non comme un trip : l'expérience est effrayante et le corps est en stress.",
            "Ne reste jamais seul·e ; la présence d'une personne sobre est essentielle.",
            "N'associe aucun autre anticholinergique ni sédatif.",
            "Au moindre signe cardiaque, d'hyperthermie ou de convulsions, traite-le comme une urgence vitale et appelle les secours."
        ]
    },
    "dpt": {
        "effects": [
            "Montée rapide et parfois abrupte, surtout fumée/vaporisée, avec une intensité qui peut surprendre.",
            "Plateau souvent décrit comme brut et déroutant : visuels chaotiques, distorsions sonores, vécu parfois sombre ou solennel.",
            "Composante corporelle notable : vibrations, pression, malaise possible au pic.",
            "Durée plus courte que les psychédéliques classiques, mais l'intensité du pic peut désorienter.",
            "La bascule vers l'angoisse est fréquente quand l'effet monte vite et déroute par son caractère inhabituel."
        ],
        "risk_factors": [
            "La montée rapide et le caractère déroutant exposent à des moments de panique.",
            "Substance de recherche peu documentée : dosage, interactions et effets restent mal connus.",
            "En poudre, l'imprécision de la quantité amplifie l'incertitude sur l'intensité.",
            "Un cadre ou un état psychique fragile rend le vécu plus difficile à traverser."
        ],
        "avoid_if": [
            "Si tu es seul ou sans personne capable de te rassurer.",
            "Si tu traverses une période anxieuse ou psychiquement instable.",
            "Si tu ne peux pas peser la dose et installer un cadre sûr."
        ],
        "aftercare": [
            "Reste au calme après le pic, le temps que la désorientation se dissipe.",
            "Donne-toi un moment de silence avant de reprendre une activité.",
            "Reviens sur le vécu plus tard et cherche du soutien si l'expérience a été éprouvante."
        ],
        "rdr_rules": [
            "Installe-toi dans un cadre calme et sécurisé avant de commencer.",
            "Pèse au milligramme et commence bas vu le manque de données.",
            "Aie une personne sobre de confiance présente pour te rassurer.",
            "Évite les stimuli intenses (bruit, écrans) qui amplifient la désorientation."
        ]
    },
    "dxm": {
        "effects": [
            "Dissociation progressive par paliers d'intensité : détachement du corps et de l'environnement qui s'accentue avec la quantité.",
            "Démarche caractéristique « en robot » : équilibre instable, gestes saccadés, coordination très perturbée.",
            "Distorsions de l'espace, du temps et de la perception, parfois nausées et vertiges marqués.",
            "Montée lente, plateau prolongé puis descente étalée, avec à fortes doses un état dissociatif profond proche du « trou ».",
            "Sensations corporelles modifiées, parfois démangeaisons, sueurs et accélération du cœur."
        ],
        "risk_factors": [
            "Sirops et comprimés associant souvent d'autres principes actifs toxiques (paracétamol, antihistaminiques, décongestionnants) dangereux à fortes doses.",
            "Risque hépatique grave lié au paracétamol et effets dangereux des antihistaminiques quand on consomme le produit pour son DXM.",
            "Montée lente et paliers poussant aux redoses qui s'accumulent.",
            "Mélange avec d'autres dépresseurs ou avec des substances sérotoninergiques, susceptible d'aggraver les effets."
        ],
        "avoid_if": [
            "Le produit est un sirop ou un comprimé combiné contenant paracétamol, antihistaminiques ou décongestionnants.",
            "Tu prends déjà un médicament agissant sur la sérotonine ou un autre dépresseur.",
            "Tu es seul ou dans un environnement où nausées, vomissements et perte de coordination seraient dangereux."
        ],
        "aftercare": [
            "Reste au calme et au chaud, la coordination et la vigilance revenant lentement.",
            "Hydrate-toi et laisse passer les nausées en position assise ou sur le côté.",
            "Surveille ton état dans les heures suivantes et consulte sans tarder en cas de signe inhabituel, surtout si le produit contenait du paracétamol."
        ],
        "rdr_rules": [
            "Vérifie impérativement la composition et écarte tout produit combiné (paracétamol, antihistaminiques, décongestionnants) qui rend l'usage toxique.",
            "Reste assis ou allongé sur le côté pendant toute la durée pour éviter chutes et fausse route en cas de vomissement.",
            "Ne mélange pas avec l'alcool, les opioïdes, les benzodiazépines ni avec des substances sérotoninergiques.",
            "Attends largement avant toute reprise, la montée par paliers étant trompeuse, et reste accompagné d'une personne sobre."
        ]
    },
    "ephedrine": {
        "effects": [
            "La stimulation est sèche et physique : énergie, vigilance, coupe-faim, avec peu d'euphorie mais un net coup de fouet.",
            "Le corps est nettement sollicité : accélération du pouls, hausse de la tension, palpitations, tremblements et bouche sèche.",
            "L'effet favorise l'effort ressenti, ce qui peut pousser à se dépenser au-delà de ses limites sans percevoir la fatigue réelle.",
            "La descente laisse souvent fatigué, anxieux et tendu, parfois avec des maux de tête.",
            "La bascule vers l'anxiété, l'agitation et l'inconfort cardiaque survient vite si la dose ou l'effort augmentent."
        ],
        "risk_factors": [
            "La charge cardiovasculaire est importante : palpitations, poussées de tension et, en cas de fragilité, risque de complications sérieuses.",
            "L'association à l'effort physique intense et à la chaleur majore l'emballement du pouls et la surchauffe.",
            "Le cumul avec caféine ou autres stimulants (mélanges « brûleurs » ou pré-entraînement) additionne dangereusement les effets cardiaques.",
            "La déshydratation pendant l'effort aggrave la tension sur le cœur."
        ],
        "avoid_if": [
            "Si tu as une fragilité cardiaque, de l'hypertension ou des palpitations.",
            "Si tu prévois un effort physique intense, surtout par temps chaud.",
            "Si tu consommes déjà de la caféine ou d'autres stimulants en quantité."
        ],
        "aftercare": [
            "Reviens au calme, hydrate-toi et laisse ton pouls redescendre avant tout nouvel effort.",
            "Surveille fatigue, anxiété ou maux de tête dans les heures qui suivent et repose-toi.",
            "Une douleur thoracique, des palpitations persistantes ou un malaise imposent de demander un avis médical."
        ],
        "rdr_rules": [
            "Ne combine pas avec caféine ou autres stimulants : la somme des effets cardiaques est le principal danger.",
            "Évite l'effort intense et la chaleur sous l'effet, et hydrate-toi régulièrement.",
            "Surveille ton pouls et arrête immédiatement en cas de palpitations marquées ou de douleur thoracique.",
            "Garde des quantités modestes et stables pour limiter la poussée de tension."
        ]
    },
    "eth_lad": {
        "effects": [
            "Décrit comme particulièrement puissant et physique, avec des visuels intenses et une charge corporelle marquée que beaucoup jugent plus forte que celle du LSD.",
            "La montée peut être lente et trompeuse, alors même que le produit est très actif à très petite quantité.",
            "La composante corporelle est nette : tension, frissons, parfois inconfort physique, en plus de la stimulation mentale.",
            "L'intensité rend le basculement vers l'anxiété plus facile si le cadre ou l'état d'esprit ne suivent pas.",
            "La descente est longue et le sommeil fortement repoussé."
        ],
        "risk_factors": [
            "C'est un lysergamide réputé puissant et actif à très faible quantité, pris sur buvard à la dose réelle inconnue : la marge d'erreur est donc mince.",
            "Le danger de convulsions avec le lithium et l'imprévisibilité avec les IMAO s'appliquent pleinement.",
            "Sa montée lente est particulièrement piégeuse : croire à un buvard faible et redoser peut conduire à une expérience écrasante.",
            "La forte charge physique majore l'inconfort et l'anxiété si l'environnement n'est pas sécurisant."
        ],
        "avoid_if": [
            "Si tu manques d'expérience avec les psychédéliques ou si tu es psychiquement fragilisé.",
            "Si tu prends du lithium, un IMAO ou un traitement psychiatrique non vérifié, ou en cas d'antécédents de psychose ou de bipolarité.",
            "Si le cadre n'est pas calme, sûr et accompagné, ou si tu n'as pas une longue plage de temps libre."
        ],
        "aftercare": [
            "Prévois une vraie journée de récupération, la charge physique et la durée pouvant laisser fatigué.",
            "Hydrate-toi, mange léger au retour de l'appétit et évite tout effort important le lendemain.",
            "Surveille ton état physique et émotionnel les jours suivants et parle de toute gêne persistante."
        ],
        "rdr_rules": [
            "Traite-le comme un lysergamide très puissant à marge étroite : commence très prudemment puisque la dose d'un buvard est incertaine.",
            "Sois particulièrement patient avant toute redose : sa montée lente est le principal piège qui mène aux surdoses.",
            "Proscris le lithium et les IMAO et contrôle tes traitements.",
            "Réserve-le à un cadre sécurisé et accompagné, car sa charge physique et son intensité demandent un environnement maîtrisé."
        ]
    },
    "ethylone": {
        "effects": [
            "La montée apporte une ouverture émotionnelle et sociale, mais avec une composante stimulante plus marquée que la chaleur empathogène de la MDMA.",
            "Souvent vendue à la place de la MDMA, cette molécule trompe sur la nature de l'effet, plus « speed » et moins chaleureux qu'attendu.",
            "Au pic, le corps est sollicité : pouls et tension en hausse, bruxisme, hausse de la température corporelle.",
            "L'effet relativement court et stimulant pousse à redoser, ce qui empile la charge cardiaque et thermique.",
            "La descente peut être marquée par fatigue, anxiété et baisse de moral après plusieurs prises."
        ],
        "risk_factors": [
            "Le fait d'être vendue pour de la MDMA crée un risque d'erreur de produit et de quantité : ne jamais présumer de ce qu'on a réellement.",
            "Le profil stimulant et court favorise les redoses et la surcharge cardiovasculaire.",
            "L'hyperthermie et l'hyponatrémie (si l'on boit trop d'eau d'un coup) restent des dangers en contexte festif et chaud.",
            "Les associations avec IMAO et antidépresseurs sérotoninergiques exposent au syndrome sérotoninergique."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN).",
            "Si tu n'as pas pu identifier ton produit et risques de le confondre avec de la MDMA.",
            "Si tu as une fragilité cardiaque ou si l'environnement est chaud sans possibilité de te rafraîchir."
        ],
        "aftercare": [
            "Repose-toi et récupère ton sommeil, la descente stimulante pouvant laisser tendu.",
            "Réhydrate-toi avec mesure et reprends des repas réguliers.",
            "Espace les usages et reste attentif à ton moral dans les jours qui suivent."
        ],
        "rdr_rules": [
            "Teste systématiquement ton produit, car il est souvent vendu pour de la MDMA et l'effet diffère.",
            "Limite les redoses du fait du profil stimulant, et fais des pauses au frais.",
            "Hydrate-toi sans excès, par petites gorgées régulières, pour éviter coup de chaleur comme hyponatrémie.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques."
        ]
    },
    "ethylphenidate": {
        "effects": [
            "La montée est rapide et intense quand la substance est insufflée, avec un fort élan de stimulation, d'euphorie et d'énergie.",
            "L'effet est court, ce qui crée une forte envie de recommencer : on entre vite dans une logique compulsive de redoses rapprochées.",
            "Le corps est mis sous tension : pouls rapide, tension qui monte, mâchoires serrées, et muqueuses qui chauffent à chaque prise insufflée.",
            "La descente est abrupte, avec un manque marqué, de l'irritabilité et une fringale de redose qui entretient le cycle.",
            "La bascule vers l'anxiété, l'agitation et les palpitations s'installe à mesure que les prises s'accumulent."
        ],
        "risk_factors": [
            "Le caractère compulsif et la courte durée poussent à des sessions de binge où s'empilent charge cardiaque et privation de sommeil.",
            "L'insufflation répétée abîme et enflamme les muqueuses nasales, avec risque de lésions et de saignements.",
            "Le partage de matériel d'insufflation expose aux infections (hépatites notamment).",
            "Le cumul avec alcool ou autres stimulants, et la déshydratation, aggravent la tension cardiovasculaire."
        ],
        "avoid_if": [
            "Si tu as des antécédents cardiaques, de l'hypertension ou une tendance à l'anxiété sévère.",
            "Si tu sais que tu as du mal à t'arrêter une fois lancé, car le profil compulsif est marqué.",
            "Si tes muqueuses nasales sont déjà irritées ou abîmées."
        ],
        "aftercare": [
            "Laisse tes voies nasales se réparer : rince-les doucement au sérum physiologique et évite toute nouvelle irritation.",
            "Récupère ton sommeil et ton alimentation après une session, qui laisse souvent épuisé et anxieux.",
            "Sois attentif à l'installation d'une habitude compulsive et cherche du soutien si le cycle se répète."
        ],
        "rdr_rules": [
            "Fixe à l'avance un nombre de prises et range le reste hors de portée, car l'envie de redoser est très forte.",
            "Utilise ton propre matériel d'insufflation, ne le partage pas, et alterne les narines en rinçant au sérum physiologique.",
            "Espace les prises et surveille ton pouls : palpitations ou douleur thoracique imposent l'arrêt.",
            "Évite de cumuler avec alcool ou autres stimulants, et hydrate-toi régulièrement."
        ]
    },
    "etizolam": {
        "effects": [
            "Apaisement rapide de l'anxiété et relâchement, proche d'une benzodiazépine puissante.",
            "Désinhibition marquée pouvant entraîner des comportements impulsifs.",
            "Amnésie des événements suivant la prise.",
            "Sédation, somnolence et baisse des réflexes quand la dose monte.",
            "Descente parfois suivie d'un rebond d'anxiété."
        ],
        "risk_factors": [
            "Souvent vendu sous forme de comprimés ou de buvards mal dosés, à la teneur très variable d'un lot à l'autre.",
            "Puissance élevée : de petites quantités produisent déjà de forts effets, d'où un risque de surdose involontaire.",
            "Mélange avec alcool ou opioïdes : dépression respiratoire et coma possibles.",
            "Dépendance rapide et risque de convulsions au sevrage brutal."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un opioïde.",
            "Tu ne connais pas la provenance ni le dosage réel du produit.",
            "Tu envisages d'arrêter brutalement après un usage régulier."
        ],
        "aftercare": [
            "Laisse l'effet et le rebond passer avant toute autre prise, et hydrate-toi.",
            "En cas d'usage régulier, prévois une réduction progressive accompagnée par un soignant.",
            "Note tes prises pour ne pas redoser à cause de l'amnésie ou du rebond."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ou des opioïdes.",
            "Considère que les comprimés et buvards sont mal dosés : la teneur réelle est imprévisible.",
            "N'arrête pas brutalement après un usage régulier : sevrage progressif pour éviter les convulsions.",
            "Évite les reprises rapprochées guidées par le rebond ou les trous de mémoire."
        ]
    },
    "eutylone": {
        "effects": [
            "Montée stimulante avec énergie, euphorie modérée et désinhibition, effet empathogène plus faible qu'attendu.",
            "Excitation et envie de bouger, mais sensation souvent décevante par rapport à la MDMA recherchée.",
            "Insomnie prononcée et coupe-faim, éveil qui se prolonge longtemps.",
            "Cœur accéléré, tension en hausse, mâchoires serrées et bruxisme.",
            "Descente avec fatigue, anxiété importante, déprime et craving."
        ],
        "risk_factors": [
            "Adultérant fréquent vendu à la place de la MDMA, ce qui expose à une prise non choisie et à un dosage inadapté.",
            "Insomnie marquée et anxiété prolongée, surtout en redosant en croyant à un produit faible.",
            "Redoses pour chercher un effet MDMA qui ne vient pas, augmentant la charge cardiaque.",
            "Identité réelle souvent ignorée sans analyse, d'où un risque mal évalué."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou un terrain anxieux.",
            "Tu n'as aucun moyen de vérifier ce que contient réellement ton produit.",
            "Tu es déjà fatigué·e ou tu enchaînes les prises en cherchant un effet."
        ],
        "aftercare": [
            "Protège ton sommeil, l'insomnie pouvant durer longtemps après la prise.",
            "Réhydrate-toi et réalimente-toi pour compenser coupe-faim et sudation.",
            "Accueille l'anxiété et la déprime de descente sans relancer la consommation."
        ],
        "rdr_rules": [
            "Fais analyser ou teste ton produit, l'eutylone étant souvent vendu pour de la MDMA.",
            "N'enchaîne pas les redoses si l'effet déçoit, car le produit peut être tout autre.",
            "Ne partage pas ton matériel de sniff.",
            "Hydrate-toi, reste au frais et protège ton sommeil pour limiter l'anxiété."
        ]
    },
    "fentanyl_nitazenes": {
        "effects": [
            "Montée très rapide et intense de chaleur et d'euphorie, avec une analgésie massive, ces molécules étant des opioïdes de synthèse ultra-puissants.",
            "Le « nod » et la sédation s'installent vite et fort ; la bascule vers l'inconscience peut être quasi immédiate.",
            "Myosis très serré, démangeaisons, nausées ; avec le fentanyl, une rigidité thoracique peut bloquer la respiration.",
            "La dépression respiratoire survient extrêmement vite et avec une marge minuscule : c'est le danger vital immédiat.",
            "En manque : syndrome opioïde intense (courbatures, sueurs, agitation, troubles digestifs), souvent d'installation rapide vu la brièveté d'action du fentanyl."
        ],
        "risk_factors": [
            "La puissance est telle que la différence entre une quantité active et une quantité mortelle est infime : une erreur invisible suffit à provoquer une surdose.",
            "Ces molécules contaminent de plus en plus héroïne, faux comprimés et autres poudres : on peut en consommer sans le savoir.",
            "La répartition dans un produit coupé est inégale (« hot spots ») : deux prises du même sachet peuvent être très différentes.",
            "Le mélange avec alcool, benzodiazépines ou autres dépresseurs rend la dépression respiratoire encore plus brutale et difficile à inverser."
        ],
        "avoid_if": [
            "Tu es seul : avec ces molécules, une surdose peut survenir en quelques secondes sans possibilité de réagir soi-même.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres dépresseurs.",
            "Tu n'as pas de naloxone sous la main ou ta tolérance a baissé après une pause."
        ],
        "aftercare": [
            "Reste sous surveillance étroite et continue, prêt à agir : la respiration peut s'arrêter très vite et le risque persiste après la première prise.",
            "Hydrate-toi en récupérant ; après une surdose inversée par la naloxone, la surveillance médicale reste indispensable car l'effet opioïde peut revenir.",
            "Après un manque, va doucement : la brièveté du fentanyl rend la reprise particulièrement risquée, mieux vaut repos et accompagnement."
        ],
        "rdr_rules": [
            "Aie toujours plusieurs doses de naloxone à portée et sache les enchaîner : ces molécules puissantes en demandent souvent plus d'une.",
            "Ne consomme jamais seul, vraiment jamais : c'est la règle vitale absolue avec le fentanyl et les nitazènes.",
            "Fractionne et teste une toute petite dose d'essai avant tout, car la marge est minuscule et la répartition inégale dans un produit.",
            "N'associe aucun autre dépresseur (alcool, benzos, sédatifs), qui rend la surdose plus brutale et plus dure à inverser."
        ]
    },
    "flualprazolam": {
        "effects": [
            "Apaisement très rapide et puissant de l'anxiété, avec une sédation qui s'installe vite.",
            "Désinhibition forte favorisant les comportements impulsifs et à risque.",
            "Amnésie souvent totale des heures suivant la prise.",
            "Sédation profonde et durée d'action longue, qui prolonge l'état de somnolence.",
            "Détachement émotionnel et ralentissement général."
        ],
        "risk_factors": [
            "Benzodiazépine de synthèse extrêmement puissante, active à des doses très faibles : la marge d'erreur est minime.",
            "Fréquemment retrouvée dans de faux comprimés de Xanax ou d'autres benzodiazépines, sans qu'on le sache.",
            "Mélange avec alcool ou opioïdes : risque très élevé de dépression respiratoire et de coma.",
            "Durée d'action longue qui prolonge la sédation et le danger plusieurs heures après la prise."
        ],
        "avoid_if": [
            "Tu as consommé de l'alcool ou un opioïde.",
            "Tu n'as aucune certitude sur le dosage réel (impossible à évaluer à l'œil).",
            "Tu es seul·e, sans personne pour surveiller ton état."
        ],
        "aftercare": [
            "Reste entouré·e : la sédation peut s'aggraver et durer longtemps.",
            "Devant une somnolence profonde avec respiration lente, mets en PLS et appelle le 15.",
            "Après usage régulier, n'arrête jamais seul·e : organise un sevrage encadré."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ou des opioïdes.",
            "Pars du principe que tout comprimé peut en contenir : sa puissance rend l'évaluation à l'œil impossible et dangereuse.",
            "N'arrête pas brutalement après un usage régulier : sevrage progressif accompagné pour éviter les convulsions.",
            "Reste avec une personne sobre capable de te surveiller et d'alerter les secours."
        ]
    },
    "gabapentine": {
        "effects": [
            "Anxiolyse et détente, sensation d'apaisement et parfois de légère euphorie sociale selon les personnes.",
            "Sédation, somnolence et relâchement musculaire, surtout en début d'usage.",
            "Atténuation de certaines douleurs nerveuses et réduction de l'agitation intérieure.",
            "Possibles étourdissements, vision trouble ou démarche un peu instable.",
            "Absorption qui plafonne quand la quantité augmente, d'où une réponse parfois irrégulière d'une fois à l'autre."
        ],
        "risk_factors": [
            "Risque respiratoire majeur en association avec les opioïdes : la gabapentine potentialise leur effet dépresseur et des surdoses mortelles sont documentées avec ce mélange.",
            "Le cumul avec l'alcool, les benzodiazépines ou d'autres sédatifs additionne la dépression du système nerveux central.",
            "Une dépendance peut s'installer, avec une montée de tolérance lors d'un usage régulier.",
            "L'arrêt brutal après usage prolongé expose à un sevrage (anxiété, insomnie, agitation, parfois convulsions)."
        ],
        "avoid_if": [
            "Tu prends ou consommes des opioïdes : l'association majore fortement le risque de dépression respiratoire fatale.",
            "Tu combines avec de l'alcool, des benzodiazépines ou d'autres dépresseurs du système nerveux.",
            "Tu as une fonction rénale altérée, car l'élimination est plus lente et les effets s'accumulent."
        ],
        "aftercare": [
            "Sur les heures qui suivent, évite de conduire ou de manipuler des machines tant que la sédation et les étourdissements persistent.",
            "Hydrate-toi et privilégie un environnement calme et sécurisé pour laisser la sédation se dissiper.",
            "Si tu en prends régulièrement, n'arrête jamais d'un coup : un sevrage progressif et accompagné réduit le risque de rebond et de convulsions."
        ],
        "rdr_rules": [
            "Ne cumule jamais les dépresseurs : pas d'opioïdes, pas d'alcool, pas de benzodiazépines en même temps, c'est le point le plus critique.",
            "Sois particulièrement vigilant·e si des opioïdes sont présents dans ton entourage de consommation, car le risque respiratoire est sous-estimé.",
            "Garde un usage espacé pour limiter tolérance et dépendance.",
            "En cas d'usage installé, prévois une diminution lente plutôt qu'un arrêt sec."
        ]
    },
    "gbl": {
        "effects": [
            "Effets très proches du GHB (détente, désinhibition, ivresse), mais l'organisme le convertit en GHB.",
            "Montée plus rapide et plus brutale que le GHB, ce qui laisse encore moins le temps de corriger une dose.",
            "Sédation lourde et endormissement soudain dès que le seuil est dépassé.",
            "Risque de coma et de dépression respiratoire identique, voire plus imprévisible.",
            "Réveil avec amnésie, nausées et désorientation."
        ],
        "risk_factors": [
            "Marge encore plus étroite que le GHB : la conversion plus rapide rend chaque dixième de millilitre décisif.",
            "Liquide industriel extrêmement concentré : une goutte de trop peut faire basculer dans le coma.",
            "Mélange avec l'alcool particulièrement dangereux, car les deux dépriment fortement la respiration.",
            "La rapidité de montée incite à croire qu'il n'y a « rien », puis tout arrive d'un coup."
        ],
        "avoid_if": [
            "Tu as consommé de l'alcool ou un autre sédatif : l'association peut entraîner un coma mortel.",
            "Tu n'as pas de matériel pour mesurer au millilitre près.",
            "Tu es seul·e ou entouré·e de personnes qui consomment aussi et ne pourront pas réagir."
        ],
        "aftercare": [
            "Hydrate-toi et accorde-toi un long temps de récupération avant d'envisager autre chose.",
            "Devant un endormissement profond impossible à réveiller : PLS immédiate et appel au 15.",
            "Évite de conduire ou de prendre toute décision importante tant que tu n'es pas totalement clair·e."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ni un autre dépresseur.",
            "Dose toujours à la seringue graduée : la concentration du GBL impose une précision absolue.",
            "Espace fortement les reprises et chronomètre : la montée rapide ne pardonne pas une dose anticipée.",
            "Garde près de toi une personne sobre formée à la PLS."
        ]
    },
    "ghb": {
        "effects": [
            "Détente euphorisante et désinhibition sociale qui rappellent l'alcool, avec une sensation de chaleur et de bien-être.",
            "Montée trompeuse : l'effet peut tarder à venir puis arriver brutalement, ce qui pousse à reprendre une dose de trop.",
            "Sédation profonde, somnolence irrésistible et perte de coordination quand la dose monte.",
            "Bascule possible vers un sommeil impossible à réveiller, voire un coma avec dépression respiratoire.",
            "Au réveil : trous de mémoire, nausées, vertiges et parfois agitation."
        ],
        "risk_factors": [
            "Marge minuscule : quelques dixièmes de millilitre séparent l'effet recherché du coma, et cette marge varie d'un jour à l'autre.",
            "Le mélange avec l'alcool ou tout autre dépresseur multiplie le risque d'arrêt respiratoire et de coma mortel.",
            "Reprendre une dose parce que « ça ne monte pas » est la principale cause de surdose.",
            "Produit souvent non dosé (concentration inconnue d'un flacon à l'autre), ce qui rend l'évaluation impossible à l'œil."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un autre sédatif (benzo, opioïde) : la combinaison peut être mortelle.",
            "Tu es seul·e, sans personne capable de te surveiller et d'appeler les secours.",
            "Tu es épuisé·e, malade, ou tu ne peux pas mesurer précisément ta dose."
        ],
        "aftercare": [
            "Reste hydraté·e et laisse passer plusieurs heures avant toute autre prise, le temps que le produit soit éliminé.",
            "Si quelqu'un s'endort et ne répond plus, mets-le en PLS et appelle le 15 sans attendre.",
            "Repose-toi vraiment : la récupération peut prendre du temps et la mémoire de la soirée peut manquer."
        ],
        "rdr_rules": [
            "Jamais avec de l'alcool ni avec un autre dépresseur, sans exception.",
            "Mesure chaque dose avec une seringue ou pipette graduée, jamais « au pif » ni à la gorgée.",
            "Espace largement les prises et note l'heure : ne reprends jamais sous prétexte que l'effet tarde.",
            "Reste accompagné·e par une personne sobre qui connaît la PLS et le numéro des secours."
        ]
    },
    "heroine": {
        "effects": [
            "Le « rush » initial est une vague de chaleur et d'euphorie intense, suivie d'un état de détente cotonneuse où la douleur et l'angoisse s'effacent.",
            "Vient ensuite le « nod » : somnolence lourde, paupières qui tombent, tête qui pique du nez entre veille et sommeil.",
            "Myosis marqué (pupilles en tête d'épingle), démangeaisons cutanées, bouche sèche, nausées et parfois vomissements, surtout les premières fois.",
            "La respiration se fait lente et superficielle : c'est le signal vital à surveiller en priorité.",
            "En manque : courbatures, frissons et sueurs alternées, nez et yeux qui coulent, crampes abdominales, diarrhées, insomnie et craving puissant."
        ],
        "risk_factors": [
            "L'héroïne de rue est très souvent coupée et peut contenir du fentanyl ou des nitazènes, ultra-puissants : une quantité habituelle peut alors devenir mortelle.",
            "La dépression respiratoire est le risque vital majeur, démultiplié en mélange avec alcool, benzodiazépines ou autres dépresseurs.",
            "Après une coupure (sevrage, prison, cure), la tolérance s'effondre : reprendre la quantité d'avant est l'une des premières causes de surdose mortelle.",
            "La concentration varie d'un lot à l'autre sans aucun repère fiable : impossible de juger la puissance à l'œil ou au goût."
        ],
        "avoid_if": [
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres sédatifs : l'addition des effets respiratoires peut être fatale.",
            "Tu es seul : en cas de surdose, personne ne pourra appeler les secours ni utiliser la naloxone.",
            "Tu reprends après une pause : ta tolérance a chuté et ton ancien repère de quantité est devenu dangereux."
        ],
        "aftercare": [
            "Reste sous le regard de quelqu'un pendant et après, surtout durant le sommeil : respiration qui gargouille, ronflement inhabituel ou lèvres bleues = secours immédiats.",
            "Hydrate-toi régulièrement et mange léger en récupérant ; soigne les points d'injection pour éviter abcès et infections.",
            "Si tu sors d'un manque, accorde-toi repos, chaleur et boissons, et ne cherche pas à compenser par une grande quantité d'un coup."
        ],
        "rdr_rules": [
            "Aie toujours de la naloxone sur toi et apprends à l'utiliser : face au fentanyl ou aux nitazènes, plusieurs doses peuvent être nécessaires.",
            "Teste systématiquement une petite dose d'essai d'un nouveau lot et attends d'en sentir l'effet : c'est la meilleure parade à une contamination par le fentanyl.",
            "Ne consomme jamais seul ; si possible, faites en sorte que l'un consomme après l'autre, jamais en même temps.",
            "N'ajoute aucun autre dépresseur (alcool, benzos, sédatifs) : ce sont ces mélanges qui causent le plus de décès."
        ]
    },
    "hexen": {
        "effects": [
            "Montée stimulante puissante et très brève : énergie, euphorie, hypervigilance et désinhibition.",
            "Excitation intense et fugace, agitation, impulsivité.",
            "Effet très court qui pousse à des redoses en rafale presque immédiates.",
            "Coupe-faim, cœur accéléré, tension haute, mâchoires serrées et bruxisme.",
            "Descente brutale avec épuisement, anxiété, déprime et craving compulsif."
        ],
        "risk_factors": [
            "Durée très courte qui entraîne des redoses en rafale et une perte de contrôle rapide.",
            "Molécule puissante où la répétition fait vite grimper la dose totale et la charge cardiaque.",
            "Insomnie et fortes doses cumulées favorisant paranoïa et psychose.",
            "Risque d'hyperthermie majoré par chaleur, effort et enchaînement des prises."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque, psychiatrique ou un terrain anxieux.",
            "Tu es seul·e et tu sens que tu vas enchaîner les prises.",
            "Tu es déjà épuisé·e ou dans un environnement chaud et confiné."
        ],
        "aftercare": [
            "Prévois un vrai temps de sommeil et de repos après les rafales.",
            "Réhydrate-toi et réalimente-toi progressivement.",
            "Reste au calme et entouré·e si l'anxiété ou la paranoïa persistent."
        ],
        "rdr_rules": [
            "Mets le produit hors de portée entre les prises, la durée très courte poussant aux rafales.",
            "Compte tes prises et fixe une limite stricte avant de commencer.",
            "Ne partage pas ton matériel de sniff ou d'injection.",
            "Hydrate-toi, reste au frais et surveille cœur et psychisme."
        ]
    },
    "hhc": {
        "effects": [
            "Effets décrits comme proches du THC : détente, légère euphorie, modification de la perception.",
            "Intensité souvent jugée un peu plus douce que le THC par certains, mais ressenti très variable selon les personnes.",
            "Modification du temps et des sensations, parfois somnolence.",
            "En négatif : anxiété, accélération du cœur, bouche sèche, vertiges, surtout à forte dose.",
            "En comestible : montée lente et retardée, effet plus fort et plus durable, facile à sous-estimer."
        ],
        "risk_factors": [
            "Statut « légal » trompeur : composition et pureté variables, contrôles quasi inexistants.",
            "Présence possible d'impuretés ou de résidus de synthèse selon les fabricants.",
            "Molécule récente, encore mal caractérisée : effets à long terme peu connus.",
            "Terrain anxieux, cardiaque ou psychiatrique : prudence accrue."
        ],
        "avoid_if": [
            "Tu prends le volant ou dois rester pleinement vigilant(e).",
            "Tu as des antécédents de paranoïa, d'anxiété sévère ou de troubles cardiaques.",
            "Tu es enceinte ou tu allaites."
        ],
        "aftercare": [
            "En cas de malaise (pâleur, sueurs, tête qui tourne) : s'allonger, surélever les jambes et prendre un sucre lent.",
            "S'hydrater, rester au calme et attendre tranquillement la fin des effets.",
            "Noter le produit et la quantité consommés au cas où un avis médical serait nécessaire."
        ],
        "rdr_rules": [
            "Considérer le HHC comme un produit mal connu : la mention « légal » ne garantit ni qualité ni innocuité.",
            "Avec les comestibles : attendre largement avant d'envisager de reprendre, la montée est trompeuse.",
            "Privilégier un cadre rassurant et éviter de cumuler avec l'alcool ou d'autres substances.",
            "Ne jamais conduire après consommation."
        ]
    },
    "hydromorphone": {
        "effects": [
            "Chaleur et euphorie marquées avec une analgésie puissante, l'hydromorphone étant un opioïde nettement plus fort que la morphine.",
            "Somnolence et « nod » prononcés peuvent suivre, avec une tête lourde et un assoupissement par vagues.",
            "Myosis serré, démangeaisons, nausées et constipation comptent parmi les effets fréquents.",
            "La respiration ralentit rapidement vu la puissance du produit : c'est le paramètre vital à surveiller de très près.",
            "En manque : courbatures, agitation, sueurs, frissons, troubles digestifs et insomnie, d'apparition assez rapide."
        ],
        "risk_factors": [
            "Sa puissance élevée réduit la marge de sécurité : une petite variation de quantité fait vite basculer vers la dépression respiratoire.",
            "Les formes à libération prolongée renferment une dose importante ; les écraser, sniffer ou injecter libère tout d'un coup, ce qui est très dangereux.",
            "Le mélange avec alcool, benzodiazépines ou autres dépresseurs aggrave fortement le risque respiratoire.",
            "La tolérance chute après une interruption : la quantité antérieure devient alors potentiellement mortelle."
        ],
        "avoid_if": [
            "Tu as pris de l'alcool, des benzodiazépines ou d'autres sédatifs : le risque respiratoire devient majeur avec un opioïde aussi puissant.",
            "Tu veux modifier une forme à libération prolongée : l'écraser ou la dissoudre supprime la protection du relargage lent.",
            "Tu es seul ou ta tolérance a baissé après une pause : aucun secours possible et repère de quantité faussé."
        ],
        "aftercare": [
            "Reste sous surveillance tant que les effets durent, en particulier pendant le sommeil ; respiration très lente ou lèvres bleues = secours immédiats.",
            "Hydrate-toi et anticipe la constipation ; mange léger une fois bien réveillé.",
            "Après un manque, privilégie repos, chaleur et boissons sans chercher à compenser par une grande quantité."
        ],
        "rdr_rules": [
            "Aie de la naloxone à portée et sache l'utiliser : la puissance de l'hydromorphone rend ce réflexe vital.",
            "Ne consomme jamais seul ; assure une présence capable d'intervenir.",
            "Ne jamais écraser, sniffer ni injecter une forme à libération prolongée.",
            "N'associe aucun autre dépresseur (alcool, benzos, sédatifs)."
        ]
    },
    "ibogaine": {
        "effects": [
            "Montée progressive vers une phase « onirique » prolongée : visions les yeux fermés, films de mémoire, introspection intense.",
            "Expérience d'une durée extrême, pouvant s'étaler sur de très nombreuses heures, suivie d'une longue phase de récupération.",
            "Composante corporelle lourde et éprouvante : ataxie (perte d'équilibre), nausées, vomissements, sensibilité à la lumière et au bruit.",
            "État souvent allongé et immobile, le corps ne suivant plus, avec une grande fatigue.",
            "Le vécu psychique peut être confrontant et émotionnellement très chargé."
        ],
        "risk_factors": [
            "Cardiotoxicité majeure : l'ibogaïne allonge l'intervalle QT et peut provoquer des troubles du rythme mortels, y compris chez des personnes sans antécédent connu.",
            "La durée extrême et l'ataxie exposent aux chutes, à la déshydratation et à l'épuisement.",
            "De nombreuses interactions médicamenteuses (notamment ce qui allonge le QT ou agit sur le cœur) aggravent le danger.",
            "Une consommation sans bilan ni surveillance cardiaque est associée à des décès rapportés."
        ],
        "avoid_if": [
            "Si aucun bilan cardiaque (ECG, ionogramme) ni surveillance médicale continue n'est possible.",
            "Si tu as un trouble cardiaque, un QT long, un déséquilibre électrolytique ou prends des médicaments agissant sur le cœur.",
            "Si tu es seul ou hors d'un cadre médicalisé capable de réagir à une urgence."
        ],
        "aftercare": [
            "Reste sous surveillance et au repos complet bien après la phase active : la récupération est longue et l'épuisement profond.",
            "Réhydrate-toi prudemment et reprends l'alimentation très progressivement.",
            "Ménage-toi plusieurs jours de récupération physique et psychique et garde un suivi médical."
        ],
        "rdr_rules": [
            "N'envisage l'ibogaïne qu'avec un bilan cardiaque préalable et une surveillance médicale continue (ECG/monitoring) : c'est non négociable.",
            "Écarte tout médicament ou substance allongeant le QT ou agissant sur le cœur.",
            "Assure une présence sobre constante, allongé et sécurisé, prête à appeler les secours immédiatement.",
            "Refuse toute prise en contexte non médicalisé : le risque vital cardiaque prime sur tout le reste."
        ]
    },
    "kava": {
        "effects": [
            "Anxiolyse douce et détente musculaire, sensation de calme sans réelle altération de la pensée.",
            "Apaisement social, sociabilité tranquille, esprit qui reste relativement clair.",
            "Légère sédation et facilitation du sommeil, surtout en fin de soirée.",
            "Engourdissement passager de la bouche et de la langue au contact de la préparation.",
            "Effet généralement subtil, sans euphorie marquée."
        ],
        "risk_factors": [
            "Hépatotoxicité : des atteintes du foie ont été rapportées, le risque augmentant avec les extraits concentrés, les parties non nobles de la plante et l'usage prolongé.",
            "L'association à l'alcool ou à d'autres substances pesant sur le foie majore ce risque hépatique.",
            "Combiné à d'autres sédatifs (alcool, benzodiazépines), l'effet de détente et la somnolence s'additionnent.",
            "Un usage quotidien et prolongé peut entraîner une sécheresse cutanée écailleuse réversible et fatiguer l'organisme."
        ],
        "avoid_if": [
            "Tu as une maladie du foie ou prends des produits hépatotoxiques (y compris certains médicaments).",
            "Tu consommes de l'alcool, qui aggrave le risque pour le foie et la sédation.",
            "Tu associes d'autres sédatifs, dont les effets de détente se cumulent."
        ],
        "aftercare": [
            "Privilégie une préparation aqueuse de racine noble plutôt que des extraits concentrés, et évite l'alcool autour de la prise pour ménager le foie.",
            "Reste attentif·ve aux signes d'atteinte hépatique (fatigue inhabituelle, urines foncées, jaunissement de la peau ou des yeux) et consulte sans tarder le cas échéant.",
            "Espace les usages et accorde des pauses au foie plutôt que d'en faire un rituel quotidien."
        ],
        "rdr_rules": [
            "Choisis de la racine noble en préparation aqueuse traditionnelle et écarte les extraits fortement concentrés, plus à risque pour le foie.",
            "Évite totalement l'alcool autour de la consommation.",
            "Ne le combine pas à d'autres sédatifs ni à des produits qui pèsent sur le foie.",
            "Garde un usage occasionnel et surveille l'apparition de signes hépatiques."
        ]
    },
    "ketamine": {
        "effects": [
            "Sentiment de détachement du corps et de l'environnement, comme si l'esprit flottait à distance de soi.",
            "Distorsions de l'espace et du temps : les distances paraissent étirées, les minutes s'allongent, les sons deviennent lointains.",
            "Montée rapide suivie d'un plateau court, avec à doses plus fortes une plongée dans le « K-hole » (immobilité, perte des repères, visions intérieures).",
            "Perte de coordination et d'équilibre marquée : jambes molles, démarche incertaine, chutes faciles dès qu'on tente de se lever.",
            "Anesthésie partielle : la douleur et les sensations corporelles sont atténuées, ce qui masque les blessures."
        ],
        "risk_factors": [
            "Mélange avec l'alcool, les opioïdes ou les benzodiazépines, qui additionne la sédation et augmente le risque de fausse route et de perte de connaissance.",
            "Usage répété et rapproché, qui expose à des atteintes de la vessie (douleurs urinaires, envies fréquentes, lésions parfois durables) et à des douleurs abdominales (« K-cramps »).",
            "Position debout ou en mouvement pendant la montée, à cause de la perte de coordination qui rend les chutes très probables.",
            "Produit de pureté inconnue ou coupé, car la dose réellement absorbée devient imprévisible."
        ],
        "avoid_if": [
            "Tu es seul, sans personne pour veiller sur toi en cas de K-hole ou de vomissement.",
            "Tu présentes des troubles cardiaques, une tension élevée ou des problèmes de vessie déjà existants.",
            "Tu traverses une période d'anxiété intense, de dépression marquée ou de fragilité psychique."
        ],
        "aftercare": [
            "Reste au calme et au chaud après la descente : la coordination et la vigilance mettent du temps à revenir complètement.",
            "Bois de l'eau régulièrement et surveille tout signe urinaire (brûlures, sang, envies pressantes) dans les jours qui suivent.",
            "Espace largement les usages et reste attentif à l'installation d'une habitude, car la kétamine peut devenir compulsive."
        ],
        "rdr_rules": [
            "Reste assis ou allongé sur le côté pendant toute la durée des effets pour éviter les chutes et la fausse route en cas de vomissement.",
            "Ne mélange jamais avec l'alcool, les opioïdes ou les benzodiazépines, qui aggravent la sédation et le risque d'arrêt respiratoire.",
            "Sois accompagné d'une personne sobre capable d'agir si tu vomis, perds connaissance ou plonges dans un K-hole.",
            "Espace fortement les prises pour protéger ta vessie et évite de redoser dans l'urgence quand les effets semblent trop faibles."
        ]
    },
    "khat": {
        "effects": [
            "La stimulation est douce et progressive en mâchant les feuilles : éveil, légèreté, envie de parler et de partager, avec une euphorie modérée.",
            "L'effet monte lentement sur la durée de la mastication et s'accompagne de bouche sèche, de pouls un peu accéléré et d'une baisse d'appétit.",
            "Un état de bien-être bavard et sociable domine, parfois suivi d'un temps plus rêveur.",
            "La descente laisse souvent fatigué, irritable et avec des difficultés à dormir, parfois une humeur basse.",
            "À usage intense ou prolongé, l'effet peut basculer vers nervosité, anxiété et insomnie."
        ],
        "risk_factors": [
            "L'usage régulier installe une dépendance et un usage quotidien difficile à interrompre.",
            "Les longues sessions de mastication sollicitent le cœur et perturbent le sommeil et l'appétit.",
            "La charge cardiovasculaire compte pour les personnes fragiles du cœur ou hypertendues.",
            "Le cumul avec d'autres stimulants ou de fortes quantités de caféine ajoute à la tension cardiaque."
        ],
        "avoid_if": [
            "Si tu as une fragilité cardiaque ou une tension élevée.",
            "Si tu es en période d'anxiété, d'insomnie ou d'humeur basse.",
            "Si tu cherches à préserver ton sommeil dans les heures qui suivent."
        ],
        "aftercare": [
            "Hydrate-toi et prends soin de ta bouche, sèche après une longue mastication.",
            "Laisse l'appétit et le sommeil revenir, et accorde-toi du repos après une session.",
            "Sois attentif à un usage qui deviendrait quotidien et cherche du soutien si tu veux lever le pied."
        ],
        "rdr_rules": [
            "Limite la durée des sessions et espace les usages pour éviter l'installation d'une habitude quotidienne.",
            "Hydrate-toi régulièrement et surveille ton pouls, surtout lors de longues mastications.",
            "Évite de cumuler avec caféine ou autres stimulants.",
            "Garde une fenêtre suffisante avant le coucher pour préserver ton sommeil."
        ]
    },
    "kratom": {
        "effects": [
            "À faible quantité, le kratom agit plutôt comme un stimulant : énergie, sociabilité, légère euphorie et baisse de la fatigue.",
            "À plus haute quantité, l'effet devient sédatif et opioïde : chaleur, apaisement, soulagement de la douleur et somnolence.",
            "Myosis, nausées (fréquentes, parfois vomissements), constipation, sueurs et bouche sèche peuvent apparaître, surtout aux quantités élevées.",
            "La dépression respiratoire est plus rare qu'avec les opioïdes classiques mais reste possible à forte dose ou en mélange.",
            "En manque : usage régulier puis arrêt entraînent un sevrage de type opioïde (courbatures, irritabilité, anxiété, insomnie, troubles digestifs)."
        ],
        "risk_factors": [
            "Le kratom crée une dépendance et un sevrage opioïde en cas d'usage régulier, souvent sous-estimés car il s'agit d'une plante.",
            "Il interagit avec de nombreux médicaments (il inhibe des enzymes du foie) et peut augmenter dangereusement l'effet d'autres substances.",
            "Associé à des opioïdes, benzodiazépines, alcool ou autres dépresseurs, il majore le risque de sédation et de dépression respiratoire.",
            "La teneur en alcaloïdes varie beaucoup d'un lot à l'autre, et les produits du commerce peuvent être contaminés ou frelatés."
        ],
        "avoid_if": [
            "Tu prends des médicaments, en particulier sérotoninergiques, ou d'autres opioïdes : les interactions du kratom sont nombreuses et imprévisibles.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres dépresseurs.",
            "Tu es seul et envisages une forte quantité à effet sédatif, sans surveillance possible."
        ],
        "aftercare": [
            "Surveille la sédation et la respiration si tu as pris une grande quantité ou mélangé ; ne reste pas seul dans ce cas.",
            "Hydrate-toi et gère nausées et constipation, fréquentes avec le kratom.",
            "Si un sevrage s'installe à l'arrêt, repos, chaleur, boissons et au besoin l'aide d'un professionnel pour le traverser."
        ],
        "rdr_rules": [
            "Garde de la naloxone disponible et sache l'utiliser : même si le risque respiratoire est moindre, il existe à forte dose et en mélange.",
            "Ne consomme jamais seul à dose sédative.",
            "Ne combine pas le kratom avec des opioïdes, des benzodiazépines, de l'alcool, d'autres dépresseurs ou des médicaments sérotoninergiques.",
            "Garde en tête le potentiel de dépendance malgré son statut « végétal » et la grande variabilité des produits."
        ]
    },
    "loperamide": {
        "effects": [
            "À dose normale, le lopéramide est un antidiarrhéique qui agit sur l'intestin et ne passe quasiment pas au cerveau : aucun effet psychoactif, c'est voulu et c'est protecteur.",
            "Les effets « opioïdes » centraux ne sont recherchés qu'à des mégadoses, ce qui est extrêmement dangereux et fortement déconseillé.",
            "À ces mégadoses peuvent apparaître somnolence et myosis, mais au prix d'un risque cardiaque majeur.",
            "Le vrai danger n'est pas respiratoire d'abord mais cardiaque : à haute dose, le lopéramide provoque des troubles du rythme potentiellement mortels.",
            "En cas d'usage chronique à forte dose, l'arrêt peut entraîner un syndrome de manque opioïde."
        ],
        "risk_factors": [
            "En mégadose, le lopéramide allonge le QT et déclenche des arythmies cardiaques graves (torsades de pointes) pouvant causer un arrêt cardiaque, parfois chez des personnes jeunes.",
            "Il est parfois détourné pour tenter de gérer un manque d'opioïdes : c'est un usage très risqué qui a entraîné des décès cardiaques.",
            "Les quantités nécessaires pour un effet central sont si élevées qu'elles dépassent largement le seuil de cardiotoxicité.",
            "Associé à d'autres médicaments allongeant le QT, le risque d'arythmie est encore majoré."
        ],
        "avoid_if": [
            "Tu penses l'utiliser pour calmer un manque d'opioïdes : c'est précisément l'usage le plus dangereux, à éviter absolument.",
            "Tu prends d'autres médicaments qui allongent le QT ou tu as un trouble du rythme cardiaque.",
            "Tu envisages des quantités au-delà de l'usage antidiarrhéique normal."
        ],
        "aftercare": [
            "En cas de mégadose, le risque est cardiaque : palpitations, malaise, perte de connaissance imposent un appel immédiat aux secours (et la naloxone n'agit pas sur le cœur).",
            "Hydrate-toi et surveille ton rythme cardiaque ; ne reste pas seul après une forte prise.",
            "Si un sevrage opioïde apparaît à l'arrêt, fais-toi accompagner plutôt que d'augmenter les doses."
        ],
        "rdr_rules": [
            "Ne te sers jamais du lopéramide pour gérer un manque d'opioïdes : à dose normale il n'agit pas sur le cerveau, et en mégadose il peut tuer par le cœur.",
            "Reste dans l'usage antidiarrhéique prévu ; n'augmente pas les quantités pour chercher un effet central.",
            "Sache que la naloxone n'inverse pas la toxicité cardiaque : en cas de malaise ou de palpitations, appelle les secours sans attendre.",
            "Ne combine pas avec d'autres médicaments connus pour allonger le QT."
        ]
    },
    "lsa": {
        "effects": [
            "L'expérience est souvent plus corporelle et sédative que visuelle : une lourdeur, un état rêveux et une envie de s'allonger plutôt que des visuels spectaculaires.",
            "Des nausées et un inconfort digestif marqués accompagnent très fréquemment la montée, liés aux graines elles-mêmes.",
            "La montée est lente et peut s'accompagner de vertiges, de lourdeur dans les membres et d'un ralentissement général.",
            "Selon le contexte, l'état glisse vers une détente contemplative ou vers un malaise diffus mêlant nausée et angoisse.",
            "La fin d'effet laisse souvent une fatigue et une sensation de tête lourde."
        ],
        "risk_factors": [
            "Les graines (rose hawaïenne, liseron) ont une teneur très variable d'un lot à l'autre, rendant l'intensité imprévisible.",
            "Les graines du commerce sont parfois enrobées de traitements chimiques toxiques destinés à empêcher leur consommation.",
            "L'effet sédatif et vasoconstricteur invite à la prudence en cas d'association avec d'autres sédatifs ou en cas de fragilité cardiovasculaire.",
            "Les nausées intenses peuvent décourager et pousser à des manipulations hasardeuses des graines pour « passer » le goût ou l'inconfort."
        ],
        "avoid_if": [
            "Si tu as des problèmes cardiovasculaires, vu la composante vasoconstrictrice rapportée.",
            "Si tu es enceinte, l'usage étant déconseillé pour ce type de produit.",
            "Si tu n'as pas un endroit calme où t'allonger et rester tranquille pendant plusieurs heures."
        ],
        "aftercare": [
            "Repose-toi après coup : la lourdeur et la fatigue peuvent persister un moment.",
            "Réhydrate-toi en douceur et attends que les nausées passent avant de manger.",
            "Laisse passer du temps avant tout nouvel essai et reste attentif à un inconfort digestif prolongé."
        ],
        "rdr_rules": [
            "Garde à l'esprit que la teneur des graines varie énormément : la même quantité ne donne jamais le même effet d'un lot à l'autre.",
            "Méfie-toi des graines vendues en jardinerie, souvent traitées chimiquement et impropres à la consommation.",
            "Installe-toi dans un lieu calme où tu peux rester allongé, car la sédation et les nausées dominent l'expérience.",
            "Évite de combiner avec d'autres sédatifs et tiens compte de la composante vasoconstrictrice si tu as une fragilité cardiaque."
        ]
    },
    "lsd": {
        "effects": [
            "La montée s'étire souvent sur 30 à 90 minutes, parfois en plateaux successifs qui donnent l'impression que « rien ne vient » et poussent à reprendre trop tôt.",
            "Au pic, la perception visuelle se charge de mouvements, de traînées et de motifs géométriques, avec une pensée associative qui part dans tous les sens.",
            "Le corps reste en éveil : pupilles dilatées, légère tension, parfois frissons ou bâillements, sans la lourdeur d'un sédatif.",
            "Le ressenti bascule très vite avec l'état d'esprit et l'environnement : un détail rassurant ramène l'euphorie, une contrariété ouvre la porte à l'angoisse.",
            "La descente est longue et la nuit de sommeil est souvent repoussée par l'excitation résiduelle."
        ],
        "risk_factors": [
            "Le contenu réel d'un buvard est invisible à l'œil : la quantité varie d'un buvard à l'autre et un produit vendu comme « LSD » peut être un autre composé bien plus dangereux.",
            "Le mélange avec le lithium expose à un risque documenté de crises convulsives et d'effets graves, et l'association avec un IMAO modifie l'expérience de façon imprévisible.",
            "La montée lente fait croire à un buvard faible et incite à en reprendre, ce qui aboutit à une expérience beaucoup trop forte une fois le tout actif.",
            "Un cadre stressant, un conflit ou un lieu inconnu transforment facilement un effet gérable en montée d'anxiété ou en bad trip."
        ],
        "avoid_if": [
            "Si tu traverses une période psychiquement fragile, un deuil, une forte angoisse, ou s'il existe des antécédents personnels ou familiaux de psychose ou de bipolarité.",
            "Si tu prends du lithium, un IMAO ou un traitement psychiatrique sans avoir vérifié l'interaction.",
            "Si tu n'es pas dans un cadre sécurisant et bienveillant, ou si tu te sens obligé de tenir un rôle social pendant les heures qui viennent."
        ],
        "aftercare": [
            "Prévois une journée calme le lendemain : le sommeil arrive tard et reste souvent léger après une expérience longue.",
            "Réhydrate-toi, mange quelque chose de simple quand l'appétit revient, et accorde-toi du repos plutôt que des décisions importantes.",
            "Surveille ton humeur les jours suivants : une fatigue émotionnelle ou un retour de pensées intrusives mérite d'en parler à quelqu'un de confiance."
        ],
        "rdr_rules": [
            "Considère que tu ne connais jamais le dosage exact d'un buvard : commence prudemment et attends largement avant d'envisager quoi que ce soit d'autre.",
            "Bannis l'association avec le lithium et avec les IMAO, et vérifie tout traitement en cours avant de consommer.",
            "Soigne le set & setting : entoure-toi de personnes de confiance, dans un lieu rassurant, avec du temps devant toi et sans obligation.",
            "Garde en tête que la tolérance monte très vite : recommencer quelques jours après donne surtout des effets atténués, pas une meilleure expérience."
        ]
    },
    "mda": {
        "effects": [
            "La montée mêle ouverture émotionnelle empathogène et une dimension psychédélique plus marquée que la MDMA : couleurs vivifiées, perceptions modifiées, parfois visuels.",
            "L'effet est plus long que celui de la MDMA, ce qui prolonge d'autant la sollicitation du corps et la charge cardiaque.",
            "Au pic, on retrouve hausse du pouls et de la tension, bruxisme, pupilles dilatées et montée de la température corporelle.",
            "La descente et le lendemain peuvent être chargés, avec fatigue, baisse de moral et anxiété, sur une durée allongée.",
            "La bascule vers l'anxiété, la confusion ou la surcharge sensorielle peut survenir, l'aspect psychédélique pouvant déstabiliser dans un mauvais contexte."
        ],
        "risk_factors": [
            "La durée plus longue prolonge la charge cardiovasculaire et le risque d'hyperthermie sur toute la session.",
            "Comme pour la MDMA, le risque d'hyponatrémie existe si l'on boit trop d'eau d'un coup pour compenser la chaleur.",
            "Les associations avec IMAO et antidépresseurs sérotoninergiques exposent au syndrome sérotoninergique.",
            "Une fragilité cardiaque, la chaleur, l'effort prolongé et le cumul avec d'autres stimulants aggravent fortement les dangers."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN).",
            "Si tu as une fragilité cardiaque ou si l'environnement est chaud et sans possibilité de te rafraîchir.",
            "Si tu n'es pas dans un état d'esprit ou un cadre serein, car la composante psychédélique peut amplifier l'inconfort."
        ],
        "aftercare": [
            "Accorde-toi une récupération d'autant plus longue que l'effet a duré : sommeil, repas et calme.",
            "Réhydrate-toi avec mesure et laisse l'esprit redescendre dans un environnement rassurant.",
            "Espace très longuement les usages (de l'ordre de trois mois) pour limiter neurotoxicité et descente difficile."
        ],
        "rdr_rules": [
            "Anticipe la durée plus longue : fais des pauses au frais et gère ton énergie sur toute la session.",
            "Hydrate-toi sans excès par petites gorgées régulières pour éviter coup de chaleur comme hyponatrémie.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques, et teste ton produit avant usage.",
            "Choisis un cadre calme et bienveillant pour absorber la dimension psychédélique, et espace les usages d'environ trois mois."
        ]
    },
    "mdea": {
        "effects": [
            "La montée apporte une ouverture émotionnelle proche de la MDMA, mais un peu plus douce et avec une euphorie souvent moins intense.",
            "L'effet reste empathogène, avec envie de contact et de partage, dans un registre plus posé.",
            "Au pic, le corps est sollicité comme avec les autres empathogènes : pouls et tension en hausse, bruxisme, montée de la température corporelle.",
            "La descente peut amener fatigue et baisse de moral les jours suivants, le temps que la sérotonine se reconstitue.",
            "La bascule vers l'anxiété ou la surchauffe peut survenir en redosant ou dans un environnement chaud."
        ],
        "risk_factors": [
            "Malgré un profil un peu plus doux, l'hyperthermie reste un danger en contexte chaud, effort prolongé et foule.",
            "Boire trop d'eau d'un coup expose à l'hyponatrémie, comme avec les autres empathogènes.",
            "Les associations avec IMAO et antidépresseurs sérotoninergiques exposent au syndrome sérotoninergique.",
            "Une fragilité cardiaque, le cumul avec d'autres stimulants et les usages rapprochés majorent la charge cardiovasculaire."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN).",
            "Si tu as une fragilité cardiaque ou si l'environnement est chaud sans possibilité de te rafraîchir.",
            "Si tu enchaînes les usages sans respecter un long espacement."
        ],
        "aftercare": [
            "Prévois plusieurs jours de récupération : sommeil, repas et douceur.",
            "Réhydrate-toi de façon mesurée et reconstitue tes apports sans forcer sur l'eau.",
            "Espace nettement les usages (de l'ordre de trois mois) pour limiter neurotoxicité et descente difficile."
        ],
        "rdr_rules": [
            "Lutte contre l'hyperthermie : pauses au frais et pas de danse ininterrompue dans un lieu surchauffé.",
            "Hydrate-toi sans excès, par petites gorgées régulières, pour éviter coup de chaleur comme hyponatrémie.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques, et teste ton produit.",
            "Espace les usages d'environ trois mois et surveille le bruxisme et tout signe de surchauffe."
        ]
    },
    "mdma": {
        "effects": [
            "La montée apporte une vague de bien-être et d'ouverture émotionnelle : élan d'empathie, envie de contact, de parler et de toucher, avec une euphorie chaleureuse.",
            "Au pic, le corps est très sollicité : pouls et tension qui montent, mâchoires serrées (bruxisme), pupilles dilatées et hausse de la température corporelle.",
            "La chaleur, la danse et la déshydratation peuvent conduire à une hyperthermie (coup de chaleur) potentiellement grave.",
            "La descente est souvent marquée, et les jours suivants peuvent amener fatigue, baisse de moral et anxiété, le temps que la sérotonine se reconstitue.",
            "La bascule vers l'anxiété, la confusion ou la surchauffe peut survenir en redosant ou dans un environnement chaud et surpeuplé."
        ],
        "risk_factors": [
            "L'hyperthermie est le danger majeur : chaleur, effort prolongé et foule augmentent fortement le risque de coup de chaleur.",
            "À l'inverse, boire trop d'eau d'un coup peut provoquer une hyponatrémie (dilution du sodium) tout aussi dangereuse, avec maux de tête, nausées et confusion.",
            "Les associations avec les IMAO et de nombreux antidépresseurs (ISRS, IRSN) peuvent déclencher un syndrome sérotoninergique potentiellement mortel.",
            "Une fragilité cardiaque, le cumul avec d'autres stimulants et les usages rapprochés majorent la charge cardiovasculaire et la neurotoxicité."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN), en raison du risque de syndrome sérotoninergique.",
            "Si tu as une fragilité cardiaque, une tension élevée, ou un environnement chaud sans possibilité de te rafraîchir.",
            "Si tu enchaînes les usages sans respecter un long espacement, ce qui aggrave neurotoxicité et descente."
        ],
        "aftercare": [
            "Prévois plusieurs jours de récupération : sommeil, repas, douceur, car la baisse de moral des jours suivants est fréquente.",
            "Réhydrate-toi de façon mesurée et reconstitue tes apports en évitant de forcer sur l'eau.",
            "Espace nettement les usages : un délai d'environ trois mois est largement recommandé pour limiter neurotoxicité et perte d'effet."
        ],
        "rdr_rules": [
            "Lutte contre l'hyperthermie : fais des pauses au frais, allège-toi et ne danse pas sans interruption dans un lieu surchauffé.",
            "Hydrate-toi sans excès, par petites gorgées régulières (de l'ordre d'un demi-litre par heure en cas d'effort), pour éviter aussi bien le coup de chaleur que l'hyponatrémie.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques ; teste ton produit et n'enchaîne pas les redoses.",
            "Espace les usages d'environ trois mois et surveille le bruxisme (chewing-gum) et tout signe de surchauffe ou de confusion."
        ]
    },
    "mdpv": {
        "effects": [
            "Montée stimulante puissante et durable : énergie, euphorie, hypervigilance et désinhibition.",
            "Excitation intense, agitation, comportements compulsifs et parfois fixations.",
            "Insomnie très prolongée et coupe-faim marqué, éveil sur de longues heures.",
            "Forte charge cardiovasculaire (cœur emballé, tension haute), mâchoires serrées et bruxisme.",
            "Descente très difficile avec épuisement profond, anxiété, déprime et craving puissant."
        ],
        "risk_factors": [
            "Molécule très puissante active à très faible quantité, surdosage facile.",
            "Effet long doublé d'un usage compulsif qui entraîne des binges et une insomnie prolongée.",
            "Fortes doses et privation de sommeil qui déclenchent paranoïa et psychose.",
            "Charge cardiaque forte et risque d'hyperthermie, aggravés par chaleur et effort."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou psychiatrique, ou un terrain paranoïaque.",
            "Tu es seul·e sans personne pour veiller en cas de bascule.",
            "Tu es déjà épuisé·e ou en train d'enchaîner les prises."
        ],
        "aftercare": [
            "Protège un temps de sommeil long, l'insomnie pouvant durer plusieurs jours.",
            "Réhydrate-toi et réalimente-toi progressivement.",
            "Mets-toi au calme et entouré·e tant que la paranoïa ou l'anxiété persistent."
        ],
        "rdr_rules": [
            "Sois extrêmement prudent·e sur la quantité, le produit agissant à l'état de traces.",
            "Évite les redoses, l'effet long et la compulsion menant facilement au binge.",
            "Ne partage pas ton matériel de sniff ou d'injection.",
            "Surveille cœur et état psychique et mets-toi à l'abri si la paranoïa monte."
        ]
    },
    "mephedrone": {
        "effects": [
            "Montée stimulante et empathogène : énergie, euphorie, chaleur sociale, désir de contact et désinhibition.",
            "Sensation de bien-être et de connexion, parole facile, libido parfois augmentée.",
            "Effet relativement court qui crée une forte envie de reprendre dès la redescente.",
            "Coupe-faim, cœur accéléré, tension en hausse, mâchoires serrées et bruxisme.",
            "Descente marquée par fatigue, déprime, anxiété et craving compulsif."
        ],
        "risk_factors": [
            "Durée brève qui pousse aux redoses rapprochées et compulsives, avec accumulation de la charge cardiaque.",
            "Sniff répété qui abîme la muqueuse nasale et favorise les saignements.",
            "Chaleur d'environnement festif et effort prolongé qui majorent l'hyperthermie.",
            "Fortes doses et nuits sans sommeil qui favorisent anxiété et bascule paranoïaque."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque ou un terrain anxieux.",
            "Tu es dans un environnement chaud et confiné sans pause possible.",
            "Tu te sens déjà dans une dynamique de prises en boucle."
        ],
        "aftercare": [
            "Donne-toi une vraie nuit de sommeil et du repos pour récupérer.",
            "Réhydrate-toi et remange pour compenser coupe-faim et sudation.",
            "Anticipe une descente morose sur un à deux jours et évite de relancer."
        ],
        "rdr_rules": [
            "Range le produit entre les prises et fixe une limite, la durée courte favorisant la compulsion.",
            "Utilise ta propre paille et alterne les narines pour ménager la muqueuse.",
            "Hydrate-toi par petites quantités régulières et fais des pauses au frais.",
            "Espace largement les usages pour préserver moral et sommeil."
        ]
    },
    "mescaline": {
        "effects": [
            "L'expérience est longue, souvent décrite comme chaleureuse et émotionnelle, avec des visuels colorés et une sensation de connexion à l'environnement.",
            "La montée s'accompagne très fréquemment de nausées et de crampes digestives marquées, surtout avec le cactus brut.",
            "La durée totale est étendue sur de nombreuses heures, ce qui demande de l'endurance physique et mentale.",
            "Selon le cadre, le vécu oscille entre euphorie contemplative et inconfort si la fatigue ou l'anxiété s'installent.",
            "La fin d'expérience laisse souvent une trace de fatigue et un besoin de récupération."
        ],
        "risk_factors": [
            "La concentration en mescaline d'un cactus varie beaucoup selon l'espèce et la préparation, rendant l'intensité difficile à anticiper.",
            "Les nausées et vomissements peuvent être éprouvants et déshydratants sur une expérience aussi longue.",
            "C'est une phénéthylamine et l'association avec un IMAO est déconseillée faute de marge de sécurité.",
            "La très longue durée majore la fatigue et le risque de bascule anxieuse si le contexte se dégrade."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un traitement psychiatrique dont l'interaction n'a pas été vérifiée.",
            "Si tu es psychiquement fragilisé ou en cas d'antécédents personnels ou familiaux de psychose ou de bipolarité.",
            "Si tu n'as pas une très longue plage de temps et un lieu confortable où passer la journée."
        ],
        "aftercare": [
            "Accorde-toi un vrai repos après une expérience aussi longue et physiquement exigeante.",
            "Réhydrate-toi soigneusement, surtout en cas de vomissements, et mange léger quand l'estomac le permet.",
            "Prévois une journée tranquille ensuite et reste attentif à une fatigue ou une humeur basse persistante."
        ],
        "rdr_rules": [
            "Tiens compte de la grande variabilité de teneur des cactus : l'intensité n'est jamais garantie à quantité égale.",
            "Anticipe les nausées et veille surtout à bien t'hydrater tout au long d'une expérience très longue.",
            "Évite l'association avec les IMAO et vérifie tout traitement en cours.",
            "Réserve-toi une journée entière dans un cadre confortable et bienveillant, vu la durée et la charge émotionnelle."
        ]
    },
    "methadone": {
        "effects": [
            "L'effet monte lentement et s'installe dans la durée : apaisement, chaleur douce et soulagement de la douleur, sans le « rush » des opioïdes rapides.",
            "Somnolence possible et impression de calme prolongé, avec parfois un « nod » discret aux quantités élevées.",
            "Myosis, sueurs abondantes (effet typique de la méthadone), bouche sèche, nausées au début et constipation marquée.",
            "La respiration peut se déprimer tardivement, plusieurs heures après la prise, car la méthadone s'accumule dans le corps.",
            "En manque : syndrome prolongé et étiré dans le temps (courbatures, sueurs, frissons, insomnie, anxiété) du fait de sa longue durée d'action."
        ],
        "risk_factors": [
            "L'effet respiratoire est différé et cumulatif : des surdoses surviennent tardivement, parfois pendant le sommeil plusieurs heures après une prise qui semblait bien tolérée.",
            "La méthadone allonge le QT et peut déclencher des troubles graves du rythme cardiaque, surtout en mélange ou aux quantités hautes.",
            "Chez une personne sans tolérance aux opioïdes, elle est particulièrement dangereuse : sa longue durée fait que les effets s'additionnent au fil des heures.",
            "Le mélange avec alcool, benzodiazépines ou autres dépresseurs majore fortement le risque respiratoire et cardiaque."
        ],
        "avoid_if": [
            "Tu n'as pas de tolérance établie aux opioïdes : la méthadone est un produit à action longue et cumulative, particulièrement risqué dans ce cas.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres sédatifs : risque respiratoire et cardiaque fortement aggravé.",
            "Tu es seul et ne pourras être surveillé pendant les heures qui suivent, durant lesquelles l'effet peut continuer de monter."
        ],
        "aftercare": [
            "Reste surveillé longtemps après la prise, y compris au coucher : le pic respiratoire peut arriver des heures plus tard, pendant le sommeil.",
            "Hydrate-toi pour compenser les sueurs abondantes et soulage la constipation par les fibres et l'eau.",
            "Après un manque, garde en tête sa lenteur : la récupération comme la réinstallation des effets s'étalent dans le temps, sans précipitation."
        ],
        "rdr_rules": [
            "Aie de la naloxone à disposition et sache t'en servir, en sachant que l'effet long de la méthadone peut nécessiter une surveillance prolongée.",
            "Ne consomme jamais seul et prévois une surveillance qui couvre les heures suivantes, pas seulement le moment de la prise.",
            "N'augmente pas en pensant que « ça ne fait rien » : l'effet monte lentement et s'accumule, l'impatience est une cause classique de surdose tardive.",
            "N'associe ni alcool, ni benzodiazépines, ni autres dépresseurs : le risque respiratoire et le risque cardiaque (QT) se cumulent."
        ]
    },
    "methamphetamine": {
        "effects": [
            "Montée d'énergie et d'euphorie très intense et durable, avec forte stimulation, hypervigilance et désinhibition.",
            "Éveil prolongé sur de nombreuses heures, parole rapide, sensation de puissance et libido souvent augmentée.",
            "Coupe-faim marqué et insomnie qui peut s'étendre sur plusieurs jours en cas d'usage répété.",
            "Charge cardiovasculaire importante (cœur emballé, tension haute), mâchoires serrées et bruxisme intense.",
            "Descente très difficile avec épuisement profond, déprime, irritabilité, paranoïa possible et craving puissant."
        ],
        "risk_factors": [
            "Pouvoir addictif élevé et installation rapide d'une dépendance avec usage compulsif.",
            "Neurotoxicité documentée et dégâts dentaires importants en cas d'usage régulier.",
            "Insomnie prolongée et binges de plusieurs jours qui font basculer vers la psychose et la paranoïa.",
            "Forte charge cardiaque et risque d'hyperthermie, majorés par la chaleur et l'effort."
        ],
        "avoid_if": [
            "Tu as des fragilités cardiaques, psychiatriques ou un terrain anxieux/paranoïaque.",
            "Tu es déjà privé·e de sommeil ou en binge depuis plusieurs heures.",
            "Tu es seul·e et sans personne pour veiller en cas de malaise ou de bascule psychique."
        ],
        "aftercare": [
            "Protège ton sommeil et accepte que la récupération prenne plusieurs jours après un usage.",
            "Réhydrate-toi, réalimente-toi et prends soin de tes dents (eau, brossage) car la bouche souffre.",
            "Sois attentif·ve au moral de descente, souvent très bas, et cherche du soutien plutôt que de reconsommer."
        ],
        "rdr_rules": [
            "Évite absolument les redoses en rafale qui prolongent l'éveil et nourrissent la paranoïa.",
            "Ne partage jamais ton matériel (pipe, paille, seringue) pour limiter les infections.",
            "Hydrate-toi et reste au frais pour réduire le risque d'hyperthermie.",
            "Surveille les signes de psychose (paranoïa, hallucinations) et mets-toi au calme entouré·e si ça monte."
        ]
    },
    "methylone": {
        "effects": [
            "La montée donne une ouverture émotionnelle et sociale proche de la MDMA mais plus discrète, avec une chaleur affective moins intense.",
            "L'effet est plus court et plus stimulant qu'empathogène, ce qui pousse souvent à redoser pour retrouver la sensation.",
            "Au pic, le corps est sollicité : pouls et tension en hausse, bruxisme, hausse de la température corporelle.",
            "La descente arrive vite et peut être marquée, avec fatigue et baisse de moral, surtout après plusieurs redoses.",
            "La bascule vers l'anxiété, l'agitation ou la surchauffe peut survenir en multipliant les prises dans un lieu chaud."
        ],
        "risk_factors": [
            "Le caractère court incite à des redoses fréquentes, qui empilent la charge cardiaque et thermique.",
            "L'hyperthermie reste un danger réel en contexte chaud, effort prolongé et foule.",
            "Boire trop d'eau d'un coup expose à l'hyponatrémie, comme avec les autres empathogènes.",
            "Les associations avec IMAO et antidépresseurs sérotoninergiques exposent au syndrome sérotoninergique."
        ],
        "avoid_if": [
            "Si tu prends un IMAO ou un antidépresseur sérotoninergique (ISRS, IRSN).",
            "Si tu as une fragilité cardiaque ou si l'environnement est chaud sans possibilité de te rafraîchir.",
            "Si tu sais que la durée courte va te pousser à enchaîner les redoses."
        ],
        "aftercare": [
            "Prévois du repos et du sommeil, la descente après redoses pouvant être pesante.",
            "Réhydrate-toi de façon mesurée et reprends des repas pour récupérer.",
            "Espace nettement les usages pour limiter la fatigue de la sérotonine et la tentation de répéter."
        ],
        "rdr_rules": [
            "Anticipe la courte durée et limite à l'avance le nombre de redoses pour ne pas surcharger cœur et température.",
            "Fais des pauses au frais et hydrate-toi sans excès, par petites gorgées régulières.",
            "N'associe jamais avec IMAO ou antidépresseurs sérotoninergiques, et teste ton produit.",
            "Surveille le bruxisme et tout signe de surchauffe, et espace les usages."
        ]
    },
    "methylphenidate": {
        "effects": [
            "Éveil et concentration accrus, énergie en hausse et baisse de la fatigue, avec euphorie plus discrète que les autres stimulants.",
            "Sentiment de focus et de motivation, parfois logorrhée et agitation à dose élevée.",
            "Coupe-faim et difficulté d'endormissement tant que le produit agit.",
            "Accélération du cœur, hausse de tension et mâchoires crispées, surtout détourné de son usage médical.",
            "Descente avec fatigue, baisse de moral, irritabilité et envie de reprendre."
        ],
        "risk_factors": [
            "Détournement de l'usage médical, écrasement ou sniff qui modifient la cinétique et augmentent fortement le risque.",
            "Redoses pour maintenir l'effet, qui accumulent la charge cardiovasculaire.",
            "Association avec d'autres stimulants ou la caféine qui majore la tension et l'agitation.",
            "Terrain cardiaque ou anxieux qui amplifie les effets indésirables."
        ],
        "avoid_if": [
            "Tu as des antécédents cardiaques, une tension élevée ou un trouble anxieux marqué.",
            "Tu consommes déjà d'autres stimulants.",
            "Tu cherches à enchaîner les nuits blanches au détriment du sommeil."
        ],
        "aftercare": [
            "Récupère par le sommeil dès que l'effet retombe et évite les écrans tardifs qui aggravent l'insomnie.",
            "Remange normalement pour compenser le coupe-faim.",
            "Anticipe une baisse de moral en descente et laisse passer sans reprendre."
        ],
        "rdr_rules": [
            "Ne modifie pas la forme du comprimé (pas d'écrasement ni de sniff) pour ne pas accélérer brutalement l'effet.",
            "Espace les prises et fixe une limite, le détournement favorisant l'usage répété.",
            "Évite de combiner avec d'autres stimulants ou de gros apports de caféine.",
            "Surveille palpitations et tension, et arrête en cas de signe cardiaque."
        ]
    },
    "modafinil": {
        "effects": [
            "L'effet principal est un éveil prolongé et net : on se sent réveillé, capable de rester concentré et de repousser la fatigue, sans euphorie marquée.",
            "La stimulation est discrète mais s'accompagne souvent de bouche sèche, de maux de tête et parfois d'une légère accélération du pouls.",
            "L'éveil dure de nombreuses heures, ce qui peut empêcher le sommeil tard dans la journée si la prise est trop tardive.",
            "Une irritabilité, de la nervosité ou de l'anxiété peuvent apparaître, surtout en cas de manque de sommeil cumulé.",
            "La « descente » se traduit surtout par la fatigue qui revient d'un coup une fois l'effet dissipé."
        ],
        "risk_factors": [
            "La longue durée d'action perturbe facilement le sommeil et peut entretenir une dette de sommeil si l'usage se répète.",
            "Le modafinil peut diminuer l'efficacité de la contraception orale : une grossesse non désirée est un risque réel sur cette période.",
            "L'éveil artificiel masque l'épuisement et pousse à se surmener au-delà des limites du corps.",
            "Des réactions cutanées sévères, bien que rares, justifient d'arrêter immédiatement devant toute éruption."
        ],
        "avoid_if": [
            "Si tu comptes sur une contraception orale comme seule protection, sans moyen complémentaire.",
            "Si tu as besoin de dormir dans les heures qui suivent ou si tu es déjà en grande dette de sommeil.",
            "Si tu as des antécédents cardiaques, une anxiété marquée ou si une éruption cutanée apparaît."
        ],
        "aftercare": [
            "Prévois de récupérer ton sommeil une fois l'éveil retombé, car la fatigue revient brutalement.",
            "Hydrate-toi et surveille un éventuel mal de tête persistant.",
            "Si tu utilises une contraception orale, ajoute une protection complémentaire pendant cette période et au-delà, et demande conseil en cas de doute."
        ],
        "rdr_rules": [
            "Si tu prends une pilule contraceptive, associe un moyen barrière car l'efficacité peut être réduite.",
            "Prends-le tôt dans la journée pour préserver ta nuit et ne pas creuser ta dette de sommeil.",
            "Respecte tes besoins de repos malgré l'éveil ressenti, et hydrate-toi.",
            "Arrête et demande un avis médical devant toute éruption cutanée ou réaction inhabituelle."
        ]
    },
    "morphine": {
        "effects": [
            "Une chaleur diffuse et un apaisement profond s'installent, avec une analgésie puissante qui détend le corps et l'esprit.",
            "La somnolence et le « nod » suivent : paupières lourdes, somnolence dans laquelle on s'assoupit par à-coups.",
            "Myosis net, démangeaisons (la morphine libère de l'histamine, d'où des picotements et rougeurs), nausées et constipation fréquentes.",
            "La respiration ralentit : c'est le paramètre vital à garder à l'œil, surtout aux quantités élevées.",
            "En manque : douleurs diffuses, agitation, sueurs, frissons, bâillements, larmoiement, troubles digestifs et insomnie."
        ],
        "risk_factors": [
            "La dépression respiratoire est le danger central, fortement aggravé par l'alcool, les benzodiazépines ou tout autre dépresseur.",
            "Les formes à libération prolongée concentrent une grande quantité dans un seul comprimé : les écraser, sniffer ou injecter libère tout d'un coup et expose à la surdose.",
            "La tolérance baisse après une interruption (hospitalisation, sevrage, cure) : la quantité d'avant peut alors être de trop.",
            "L'effet histaminique peut provoquer chute de tension et bronchospasme chez les personnes sensibles ou asthmatiques."
        ],
        "avoid_if": [
            "Tu as pris de l'alcool, des benzodiazépines ou d'autres sédatifs : le cumul des effets dépresseurs respiratoires est dangereux.",
            "Tu envisages d'écraser ou de modifier un comprimé à libération prolongée : sa structure retard est justement ce qui te protège d'une libération massive.",
            "Tu es seul ou ta tolérance a baissé après une pause : aucun secours possible et repère de quantité faussé."
        ],
        "aftercare": [
            "Reste accompagné tant que dure la sédation et surveille la respiration pendant le sommeil ; lèvres bleues ou respiration très lente = appel aux secours.",
            "Hydrate-toi et anticipe la constipation (fibres, eau) qui accompagne presque toujours la morphine.",
            "Après un manque, privilégie repos, chaleur et boissons, et laisse ton corps retrouver son équilibre sans précipiter une reprise."
        ],
        "rdr_rules": [
            "Garde de la naloxone accessible et sache l'employer : elle peut inverser une dépression respiratoire le temps des secours.",
            "Ne consomme jamais seul ; assure-toi qu'une personne peut intervenir si tu ne réponds plus.",
            "Respecte l'intégrité des formes à libération prolongée : ne jamais écraser, croquer, sniffer ni injecter.",
            "N'associe pas d'autres dépresseurs (alcool, benzos, sédatifs) à la morphine."
        ]
    },
    "mxe": {
        "effects": [
            "Détachement dissociatif comparable à la kétamine mais plus durable, avec une sensation d'éloignement du corps qui s'installe progressivement.",
            "Montée retardée et trompeuse : les effets mettent du temps à venir, ce qui peut donner l'impression fausse d'un sous-dosage.",
            "Distorsions sensorielles et euphorie, distances et temps déformés, parfois une chaleur diffuse dans le corps.",
            "Plateau long suivi d'une descente étalée, avec à doses élevées un « M-hole » immobilisant proche du K-hole.",
            "Coordination dégradée et instabilité motrice qui persistent plusieurs heures."
        ],
        "risk_factors": [
            "Montée lente qui pousse à reprendre une dose trop tôt, avec un risque de cumul brutal des effets bien plus fort qu'attendu.",
            "Durée prolongée qui augmente la fenêtre pendant laquelle une chute, un vomissement ou un mélange peuvent survenir.",
            "Mélange avec dépresseurs (alcool, opioïdes, benzodiazépines), qui majore la sédation et le risque de fausse route.",
            "Confusion fréquente avec la kétamine alors que la puissance et la durée diffèrent nettement."
        ],
        "avoid_if": [
            "Tu es impatient ou tenté de redoser rapidement faute de ressentir les effets tout de suite.",
            "Tu n'as pas plusieurs heures devant toi dans un endroit sûr et calme.",
            "Tu es seul ou dans un environnement où une perte de repères prolongée serait dangereuse."
        ],
        "aftercare": [
            "Prévois une longue période de récupération, car les effets et la fatigue se prolongent bien au-delà du pic.",
            "Hydrate-toi et reste au chaud, la vigilance et la coordination revenant lentement.",
            "Note la durée réelle ressentie pour mieux anticiper et résister à l'envie de redoser la fois suivante."
        ],
        "rdr_rules": [
            "Attends très longtemps avant d'envisager toute reprise : la montée retardée est le principal piège conduisant aux surdoses.",
            "Reste assis ou allongé sur le côté pendant toute la durée, plus longue qu'avec la kétamine.",
            "Ne combine jamais avec l'alcool, les opioïdes ou les benzodiazépines.",
            "Sois accompagné d'une personne sobre informée de la durée prolongée des effets."
        ]
    },
    "mxp": {
        "effects": [
            "Dissociation longue de type PCP : détachement progressif du corps et de la réalité qui se prolonge des heures.",
            "Montée très lente et difficile à juger, donnant facilement la fausse impression d'un sous-dosage.",
            "Distorsions de l'espace et du temps, euphorie, parfois confusion ou pensées désordonnées.",
            "Plateau prolongé suivi d'une descente lente, avec un état immobilisant à doses élevées.",
            "Coordination et équilibre fortement dégradés sur toute la durée."
        ],
        "risk_factors": [
            "Substance difficile à doser dont une faible variation change beaucoup l'intensité ressentie.",
            "Montée très lente qui pousse aux redoses précoces et au cumul brutal des effets.",
            "Durée prolongée allongeant la fenêtre de risque de chute, de vomissement ou de mélange.",
            "Mélange avec dépresseurs (alcool, opioïdes, benzodiazépines), qui majore sédation et risque de fausse route."
        ],
        "avoid_if": [
            "Tu es impatient et tenté de reprendre une dose faute d'effet immédiat.",
            "Tu n'as pas plusieurs heures au calme dans un lieu sûr devant toi.",
            "Tu es seul ou dans un environnement où une immobilisation prolongée serait dangereuse."
        ],
        "aftercare": [
            "Prévois une longue période de récupération, les effets et la fatigue se prolongeant nettement.",
            "Hydrate-toi et reste au chaud, la vigilance et la coordination revenant lentement.",
            "Note la durée réelle ressentie pour mieux anticiper et éviter les redoses la fois suivante."
        ],
        "rdr_rules": [
            "Vu la difficulté à doser et la montée très lente, n'envisage aucune reprise rapide.",
            "Reste assis ou allongé sur le côté pendant toute la durée, longue et étalée.",
            "Ne mélange jamais avec l'alcool, les opioïdes ou les benzodiazépines.",
            "Sois accompagné d'une personne sobre informée de la durée prolongée des effets."
        ]
    },
    "nbome_25b": {
        "effects": [
            "Montée rapide par voie buccale vers un effet psychédélique intense, stimulant et peu prévisible.",
            "Stimulation corporelle forte : cœur accéléré, tension, crispation des mâchoires, tremblements.",
            "Vasoconstriction sensible, avec extrémités froides et impression de membres comprimés.",
            "Humeur instable pouvant basculer rapidement vers l'angoisse, l'agitation et la confusion."
        ],
        "risk_factors": [
            "Souvent confondu avec du LSD sur buvard, alors qu'il est puissant, potentiellement toxique et à marge étroite.",
            "Risque de vasoconstriction et de convulsions, comme pour l'ensemble des NBOMe.",
            "L'écart entre dose active et dose dangereuse est faible, exposant à un surdosage rapide.",
            "L'amertume du buvard, signal d'alerte clé, passe souvent inaperçue."
        ],
        "avoid_if": [
            "Le buvard est amer au goût : ce n'est pas du LSD, il ne faut pas le consommer.",
            "Vous ne pouvez pas confirmer de façon fiable l'identité réelle du produit.",
            "Vous avez des antécédents cardiovasculaires ou de convulsions, ou prenez des stimulants."
        ],
        "aftercare": [
            "Restez dans un lieu calme et frais et surveillez l'agitation, la fièvre et l'état des extrémités.",
            "Réhydratez-vous avec prudence une fois la situation stabilisée.",
            "Consultez si une douleur thoracique, une confusion ou des troubles circulatoires persistent au-delà de la descente."
        ],
        "rdr_rules": [
            "Un buvard amer ou métallique n'est pas du LSD : ne le consommez pas, le LSD authentique est insipide.",
            "N'effectuez aucune redose : la marge étroite expose à un surdosage et à des convulsions rapides.",
            "En cas de convulsions, d'hyperthermie ou d'agitation extrême, alertez immédiatement le 15 ou le 112."
        ]
    },
    "nbome_25c": {
        "effects": [
            "Montée rapide par voie buccale vers un effet psychédélique intense et électrique, peu confortable.",
            "Forte stimulation corporelle : tachycardie, tension, mâchoires crispées, tremblements.",
            "Vasoconstriction marquée avec extrémités froides et sensation de membres serrés.",
            "Tonalité émotionnelle instable, virant facilement à l'anxiété, à l'agitation et à la confusion."
        ],
        "risk_factors": [
            "Fréquemment confondu avec du LSD sur buvard, alors que sa toxicité et sa marge étroite en font une cause connue d'accidents graves.",
            "Vasoconstriction, convulsions et hyperthermie possibles, comme pour les autres NBOMe.",
            "La dose efficace et la dose dangereuse sont proches : le surdosage est rapide.",
            "Un goût amer du buvard est un signal d'alerte trop souvent ignoré."
        ],
        "avoid_if": [
            "Le buvard a un goût amer : ce n'est pas du LSD et il ne doit pas être consommé.",
            "Vous n'avez pas de confirmation fiable de l'identité du produit.",
            "Vous avez des antécédents cardiaques ou de convulsions, ou êtes sous stimulant."
        ],
        "aftercare": [
            "Restez au calme dans un endroit frais et surveillez l'agitation, la fièvre et la circulation des extrémités.",
            "Réhydratez-vous prudemment une fois l'état stabilisé.",
            "Consultez si douleur thoracique, confusion ou extrémités froides persistent après la descente."
        ],
        "rdr_rules": [
            "Un goût amer signe l'absence de LSD : ne consommez pas un buvard amer, le LSD est insipide.",
            "N'effectuez aucune redose : la marge est étroite et le surdosage rapide.",
            "Appelez le 15 ou le 112 en cas de convulsions, d'hyperthermie ou d'agitation incontrôlable."
        ]
    },
    "nbome_25i": {
        "effects": [
            "Montée rapide et intense par voie buccale, avec des visuels électriques et une pensée très accélérée.",
            "Stimulation corporelle forte : cœur emballé, tension, mâchoires serrées, tremblements.",
            "Vasoconstriction sévère ressentie comme des extrémités froides et des membres comprimés.",
            "Bascule fréquente et brutale vers l'angoisse, l'agitation et la confusion, l'effet étant peu maniable et peu prévisible."
        ],
        "risk_factors": [
            "Il est très souvent vendu à tort comme du LSD : un buvard présenté comme « LSD » mais au goût amer ou métallique peut être du 25I-NBOMe.",
            "La marge de sécurité est faible et le surdosage survient vite, avec convulsions, hyperthermie et vasoconstriction sévère.",
            "Contrairement au LSD, il n'est pas inactif s'il est avalé de travers et reste dangereux : la dose efficace et la dose toxique sont proches.",
            "Toute redose augmente fortement le risque de convulsions et d'accident grave."
        ],
        "avoid_if": [
            "Un buvard a un goût amer ou métallique au lieu d'être insipide : ce n'est pas du LSD, il ne faut pas le consommer.",
            "Vous n'avez aucune confirmation fiable de l'identité réelle du produit.",
            "Vous avez des antécédents cardiovasculaires, de convulsions, ou prenez des stimulants."
        ],
        "aftercare": [
            "Restez dans un endroit calme et frais et surveillez la persistance de l'agitation, de la fièvre ou des extrémités froides.",
            "Réhydratez-vous prudemment une fois la situation stabilisée et privilégiez un environnement sécurisé.",
            "Consultez si une douleur thoracique, une confusion ou des troubles de la circulation se prolongent au-delà de la descente."
        ],
        "rdr_rules": [
            "Un buvard au goût amer ou métallique n'est pas du LSD : ne le consommez pas, le LSD authentique est insipide.",
            "N'effectuez aucune redose : le surdosage et les convulsions surviennent rapidement avec une marge étroite.",
            "En cas de convulsions, d'hyperthermie ou d'agitation extrême, appelez le 15 ou le 112 sans attendre."
        ]
    },
    "nep": {
        "effects": [
            "Montée stimulante puissante avec énergie, euphorie, hypervigilance et désinhibition.",
            "Excitation forte, agitation, parfois impulsivité.",
            "Coupe-faim et insomnie marqués, éveil prolongé.",
            "Cœur accéléré, tension haute, mâchoires serrées et bruxisme.",
            "Descente difficile avec épuisement, anxiété, déprime et craving compulsif."
        ],
        "risk_factors": [
            "Cathinone puissante active à faible quantité, surdosage facile.",
            "Redoses compulsives en rafale qui prolongent l'éveil et la charge cardiaque.",
            "Insomnie prolongée et fortes doses favorisant paranoïa et psychose.",
            "Charge cardiaque forte et risque d'hyperthermie, aggravés par chaleur et effort."
        ],
        "avoid_if": [
            "Tu as une fragilité cardiaque, psychiatrique ou un terrain anxieux.",
            "Tu es seul·e sans personne pour veiller.",
            "Tu es déjà épuisé·e ou en train d'enchaîner les prises."
        ],
        "aftercare": [
            "Protège un long temps de sommeil après l'usage.",
            "Réhydrate-toi et réalimente-toi progressivement.",
            "Reste au calme et entouré·e si l'anxiété ou la paranoïa persistent."
        ],
        "rdr_rules": [
            "Dose avec prudence, la molécule étant puissante à faible quantité.",
            "Évite les redoses en rafale qui nourrissent la compulsion.",
            "Ne partage pas ton matériel de sniff ou d'injection.",
            "Surveille cœur et état psychique et mets-toi à l'abri si la paranoïa monte."
        ]
    },
    "nicotine": {
        "effects": [
            "L'effet est rapide et bref : une stimulation légère, une sensation de détente et de concentration, puis un apaisement qui retombe vite.",
            "Le corps réagit par une hausse du pouls et de la tension, et les premières prises peuvent donner nausées, vertiges et maux de tête.",
            "L'apaisement ressenti est en grande partie le soulagement d'un manque qui s'installe très vite entre les prises.",
            "La redescente s'accompagne d'envie pressante, d'irritabilité et de difficulté à se concentrer, signes d'une dépendance qui s'installe rapidement.",
            "À forte exposition, l'effet bascule vers nausées, sueurs, tremblements et malaise."
        ],
        "risk_factors": [
            "La nicotine crée une dépendance très forte et rapide, qui rend l'arrêt difficile et entretient l'usage.",
            "Les e-liquides concentrés sont toxiques voire mortels en cas d'ingestion, surtout pour un enfant ou un animal.",
            "Le contact cutané prolongé avec du e-liquide peut aussi entraîner une intoxication.",
            "La charge cardiovasculaire compte pour les personnes fragiles du cœur ou hypertendues, et l'usage pendant la grossesse présente des risques pour le fœtus."
        ],
        "avoid_if": [
            "Si des enfants ou des animaux peuvent accéder aux flacons de e-liquide.",
            "Si tu es enceinte ou allaites.",
            "Si tu as une fragilité cardiaque ou une tension élevée mal contrôlée."
        ],
        "aftercare": [
            "En cas de nausées, sueurs ou vertiges, mets-toi au calme, hydrate-toi et laisse l'effet retomber.",
            "Si tu cherches à réduire, repère les moments de manque et prépare des alternatives ; un accompagnement améliore nettement les chances.",
            "En cas d'ingestion de e-liquide, surtout par un enfant, contacte immédiatement un centre antipoison ou les secours."
        ],
        "rdr_rules": [
            "Range les e-liquides hors de portée des enfants et des animaux, bien fermés et étiquetés : l'ingestion peut être mortelle.",
            "Manipule les flacons concentrés avec soin et lave-toi les mains après contact pour éviter l'absorption cutanée.",
            "Garde le numéro du centre antipoison accessible et réagis vite en cas d'ingestion accidentelle.",
            "Sois conscient du pouvoir addictif rapide et fixe-toi des repères si tu veux limiter ta consommation."
        ]
    },
    "nutmeg": {
        "effects": [
            "Onset très RETARDÉ : les effets n'apparaissent souvent qu'au bout de plusieurs heures (typiquement 3 à 6 h), ce qui pousse à tort à reprendre une dose en croyant que « rien ne se passe ».",
            "État brumeux et planant, lourdeur corporelle, sédation et impression de cotonneux plutôt qu'une vraie ivresse psychédélique.",
            "Effets anticholinergiques : bouche sèche, rougeur, cœur un peu emballé, parfois confusion et rêveries.",
            "Nausées, vomissements et inconfort digestif fréquents et marqués.",
            "Gueule de bois anticholinergique très longue : la sédation, la brume et le malaise peuvent persister une bonne partie du lendemain, voire au-delà."
        ],
        "risk_factors": [
            "L'onset très tardif est le principal piège : redoser avant que les effets n'arrivent expose à une intoxication anticholinergique nettement plus désagréable et risquée.",
            "Effets anticholinergiques inconfortables : tachycardie, agitation, confusion, voire angoisse marquée aux quantités plus élevées.",
            "Nausées et vomissements importants qui rendent l'expérience pénible et déshydratante.",
            "L'association à l'alcool ou à d'autres anticholinergiques aggrave confusion et inconfort."
        ],
        "avoid_if": [
            "Tu as tendance à redoser par impatience, car l'onset retardé rend ce réflexe particulièrement dangereux ici.",
            "Tu as un problème cardiaque, la composante anticholinergique sollicitant le cœur.",
            "Tu consommes de l'alcool ou d'autres anticholinergiques, dont les effets se cumulent."
        ],
        "aftercare": [
            "Anticipe une récupération longue : prévois du repos, de l'hydratation et rien d'important à faire le lendemain.",
            "Reste dans un lieu calme et sûr le temps que la brume et la sédation se dissipent, sans conduire.",
            "Si la confusion, la tachycardie ou le malaise deviennent intenses ou inquiétants, n'hésite pas à demander un avis médical."
        ],
        "rdr_rules": [
            "Compte tenu de l'onset très retardé, ne redose JAMAIS dans les premières heures : attends largement avant toute conclusion.",
            "Prévois une plage de temps dégagée car les effets et la gueule de bois durent longtemps.",
            "Ne l'associe ni à l'alcool ni à d'autres anticholinergiques.",
            "Hydrate-toi face aux nausées et installe-toi dans un cadre calme et sécurisé."
        ]
    },
    "o_dsmt": {
        "effects": [
            "Chaleur, bien-être et analgésie d'allure opioïde classique, l'O-DSMT étant un opioïde de synthèse actif à faible quantité.",
            "Somnolence et « nod » possibles, avec assoupissement par vagues aux quantités plus élevées.",
            "Myosis, démangeaisons, nausées et constipation comptent parmi les effets habituels.",
            "La respiration ralentit comme avec les autres opioïdes : paramètre vital à surveiller.",
            "En manque : courbatures, agitation, sueurs, frissons, insomnie et troubles digestifs."
        ],
        "risk_factors": [
            "Comme le tramadol dont il dérive, l'O-DSMT abaisse le seuil épileptogène : risque de convulsions, surtout aux quantités élevées.",
            "Il a une composante sérotoninergique : associé à des antidépresseurs (ISRS, IRSN, IMAO) ou autres sérotoninergiques, il peut provoquer un syndrome sérotoninergique.",
            "Produit de synthèse souvent vendu en poudre, son dosage précis est difficile à apprécier : marge d'erreur importante.",
            "La dépression respiratoire reste le danger majeur, aggravée par l'alcool, les benzodiazépines ou d'autres dépresseurs."
        ],
        "avoid_if": [
            "Tu prends des antidépresseurs (ISRS, IRSN, IMAO) ou d'autres sérotoninergiques : risque de syndrome sérotoninergique.",
            "Tu as un terrain épileptique ou des antécédents de convulsions.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres dépresseurs, ou tu es seul sans surveillance possible."
        ],
        "aftercare": [
            "Reste accompagné et surveille la respiration ; en cas de secousses musculaires, fièvre, agitation ou confusion, pense aux convulsions ou au syndrome sérotoninergique et consulte.",
            "Hydrate-toi et gère nausées et constipation ; mange léger en récupérant.",
            "Après un manque, privilégie repos, chaleur et boissons."
        ],
        "rdr_rules": [
            "Aie de la naloxone à disposition et sache l'utiliser face à une dépression respiratoire.",
            "Ne consomme jamais seul, d'autant que des convulsions peuvent survenir sans prévenir.",
            "Avec une poudre, teste toujours une petite dose d'essai réduite tant la marge d'erreur de dosage est grande.",
            "N'associe ni médicaments sérotoninergiques (antidépresseurs, IMAO), ni alcool, ni benzodiazépines, ni autres dépresseurs."
        ]
    },
    "o_pce": {
        "effects": [
            "Dissociation de type PCP avec une note stimulante : esprit alerte, sensation d'énergie en plus du détachement.",
            "Montée par paliers tardifs et trompeuse, les effets continuant de grimper longtemps après la prise.",
            "Distorsions de l'espace et du temps, euphorie, parfois pensées accélérées ou confuses.",
            "État dissociatif profond et immobilisant à doses élevées, avec perte des repères.",
            "Coordination altérée associée à une excitation qui peut masquer la perte de jugement."
        ],
        "risk_factors": [
            "Paliers tardifs donnant l'illusion d'un sous-dosage et poussant à des redoses qui s'accumulent dangereusement.",
            "Forte puissance et marge étroite entre une dose gérable et une dose qui bascule dans la confusion ou l'agitation.",
            "Composante stimulante favorisant l'impulsivité et les comportements à risque.",
            "Mélange avec dépresseurs ou stimulants, imprévisible et susceptible d'aggraver sédation ou agitation."
        ],
        "avoid_if": [
            "Tu es tenté de reprendre une dose parce que les effets tardent à venir.",
            "Tu as des antécédents de paranoïa, de psychose ou une fragilité psychique.",
            "Tu n'es pas dans un cadre calme et contenant, avec quelqu'un de sobre à proximité."
        ],
        "aftercare": [
            "Reviens au calme dans un lieu rassurant, l'agitation et les pensées intrusives pouvant persister.",
            "Repose-toi et hydrate-toi, la part stimulante laissant souvent une fatigue à la descente.",
            "Surveille toute anxiété ou idée paranoïaque persistante et évite d'enchaîner les usages."
        ],
        "rdr_rules": [
            "Attends très longtemps avant toute reprise : la montée par paliers tardifs est le principal piège menant aux surdoses.",
            "Reste dans un environnement calme et sécurisé, accompagné d'une personne sobre.",
            "Ne mélange pas avec d'autres substances, surtout pas les dépresseurs (alcool, opioïdes, benzodiazépines).",
            "Évite les situations conflictuelles et les lieux dangereux tant que les effets ne sont pas dissipés."
        ]
    },
    "opioides": {
        "effects": [
            "Une vague de chaleur et de bien-être enveloppant monte rapidement, souvent accompagnée d'un soulagement profond de la douleur physique et émotionnelle.",
            "La somnolence s'installe avec ce qu'on appelle le « nod » : on pique du nez, on oscille entre veille et sommeil, la tête lourde.",
            "Les pupilles se rétrécissent fortement (myosis), la peau peut démanger et des nausées ou vomissements surviennent fréquemment, surtout au début.",
            "La respiration ralentit et devient le signe vital à surveiller : c'est le premier indicateur d'un surdosage qui s'installe.",
            "En manque : douleurs musculaires et osseuses, frissons, sueurs, nez qui coule, agitation, insomnie, diarrhées et anxiété intense, sans danger vital mais très éprouvant."
        ],
        "risk_factors": [
            "La dépression respiratoire est le danger numéro un : la respiration peut s'arrêter, surtout en mélange avec alcool, benzodiazépines ou autres dépresseurs.",
            "La tolérance chute vite après une période d'abstinence (sevrage, prison, cure) : reprendre la quantité d'avant devient une cause majeure de surdose.",
            "La pureté et la composition réelles d'un produit de rue sont inconnues : contamination possible par du fentanyl ou des nitazènes, invisibles à l'œil.",
            "Consommer seul prive de tout secours possible en cas de perte de connaissance."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris des benzodiazépines, somnifères ou autres sédatifs : le cumul des effets dépresseurs peut être mortel.",
            "Tu es seul, sans personne capable d'appeler les secours ou d'utiliser la naloxone si tu perds connaissance.",
            "Tu reviens d'une période sans consommer : ta tolérance a baissé et ton repère de quantité n'est plus valable."
        ],
        "aftercare": [
            "Reste accompagné et surveillé tant que les effets durent, surtout le sommeil : un ronflement inhabituel ou des lèvres bleues imposent d'appeler les secours.",
            "Hydrate-toi et mange léger une fois bien réveillé, car nausées et constipation sont fréquentes après coup.",
            "Si tu sors d'un manque, va doucement : repos, chaleur, boissons et patience pour laisser ton corps récupérer."
        ],
        "rdr_rules": [
            "Garde de la naloxone à portée de main et apprends à t'en servir : elle inverse une surdose le temps que les secours arrivent.",
            "Ne consomme jamais seul ; conviens avec quelqu'un d'un moyen de vérifier que tu vas bien.",
            "Avec un produit nouveau ou de rue, teste toujours une petite dose d'essai réduite et attends d'en sentir les effets avant d'envisager plus.",
            "N'associe pas d'autres dépresseurs (alcool, benzos, sédatifs) : c'est le mélange qui tue le plus souvent."
        ]
    },
    "oxycodone": {
        "effects": [
            "Chaleur, euphorie et soulagement de la douleur s'installent, avec un effet souvent décrit comme « clair » et puissant.",
            "Somnolence et « nod » peuvent suivre, surtout aux quantités élevées, avec assoupissement par vagues.",
            "Myosis, démangeaisons, nausées et constipation comptent parmi les effets fréquents.",
            "La respiration ralentit : paramètre vital à surveiller, d'autant que l'oxycodone est un agoniste puissant.",
            "En manque : courbatures, agitation, sueurs, frissons, larmoiement, troubles digestifs et insomnie."
        ],
        "risk_factors": [
            "Les formes à libération prolongée (type OxyContin) contiennent une grande quantité ; les écraser, sniffer ou injecter libère tout d'un coup et provoque facilement une surdose.",
            "La dépression respiratoire est le danger central, fortement aggravé par l'alcool, les benzodiazépines ou d'autres dépresseurs.",
            "La tolérance chute après une interruption : reprendre la quantité d'avant devient dangereux.",
            "Les comprimés de rue peuvent être des contrefaçons contenant du fentanyl : un faux « oxy » peut être bien plus puissant qu'attendu."
        ],
        "avoid_if": [
            "Tu veux écraser ou modifier un comprimé à libération prolongée : sa structure retard est ce qui te protège d'une libération massive.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres sédatifs.",
            "Tu es seul ou ta tolérance a baissé après une pause ; ou tu n'es pas sûr de la provenance des comprimés (risque de contrefaçon au fentanyl)."
        ],
        "aftercare": [
            "Reste sous surveillance tant que les effets durent, en particulier au coucher ; respiration très lente ou lèvres bleues = secours immédiats.",
            "Hydrate-toi et anticipe la constipation ; mange léger en récupérant.",
            "Après un manque, privilégie repos, chaleur et boissons sans compenser par une grande quantité d'un coup."
        ],
        "rdr_rules": [
            "Aie de la naloxone à portée et sache l'utiliser, d'autant qu'un comprimé contrefait peut contenir du fentanyl.",
            "Ne consomme jamais seul.",
            "Ne jamais écraser, croquer, sniffer ni injecter une forme à libération prolongée.",
            "N'associe aucun autre dépresseur (alcool, benzos, sédatifs) et teste prudemment tout comprimé de provenance incertaine."
        ]
    },
    "pcp": {
        "effects": [
            "Dissociation intense et imprévisible : détachement du réel pouvant basculer d'un état à l'autre sans prévenir.",
            "Effet anesthésiant marqué qui supprime la perception de la douleur et masque les blessures.",
            "Agitation, désinhibition, parfois agressivité ou comportements impulsifs et dangereux pour soi et les autres.",
            "Distorsions de l'espace et du temps, sensation de force décuplée, possibles hallucinations et confusion.",
            "Coordination altérée associée à une excitation qui rend les gestes brusques et incontrôlés."
        ],
        "risk_factors": [
            "Réponse très imprévisible : la même quantité peut produire sédation, agitation ou agressivité selon les fois.",
            "Anesthésie qui masque la douleur et conduit à se blesser sans s'en rendre compte.",
            "Agitation et désinhibition exposant à des accidents, des conflits violents et des prises de risque graves.",
            "Mélange avec dépresseurs ou stimulants, qui rend les effets encore plus imprévisibles et dangereux."
        ],
        "avoid_if": [
            "Tu es dans un contexte tendu, stimulant ou conflictuel susceptible de déclencher de l'agressivité.",
            "Tu as des antécédents de psychose, d'agitation ou d'impulsivité difficile à contenir.",
            "Tu es seul ou sans entourage sobre capable de te protéger et de protéger les autres."
        ],
        "aftercare": [
            "Reviens au calme dans un environnement rassurant et peu stimulant, l'agitation pouvant persister.",
            "Repose-toi et hydrate-toi, et vérifie l'absence de blessures que l'anesthésie aurait pu masquer.",
            "Si confusion, agitation ou idées paranoïaques persistent, demande de l'aide et évite de réitérer."
        ],
        "rdr_rules": [
            "Reste dans un environnement calme, sécurisé et dégagé d'objets dangereux, accompagné de personnes sobres.",
            "Ne mélange pas avec d'autres substances, et surtout pas avec les dépresseurs (alcool, opioïdes, benzodiazépines).",
            "Évite absolument les situations conflictuelles et les lieux à risque tant que les effets durent.",
            "Mets-toi en position latérale de sécurité en cas de sédation et fais examiner toute blessure que l'anesthésie aurait masquée."
        ]
    },
    "phenibut": {
        "effects": [
            "Anxiolyse marquée, sensation de calme intérieur et de désinhibition sociale qui rappelle un peu l'alcool sans l'ivresse motrice.",
            "Sédation et amélioration de l'humeur, parfois un léger entrain ou une sociabilité accrue selon les personnes.",
            "Montée très progressive et différée : les effets s'installent lentement sur plusieurs heures, ce qui pousse dangereusement à reprendre une dose en croyant que « ça n'a pas marché ».",
            "Sommeil facilité à l'installation, mais qualité du sommeil souvent dégradée derrière.",
            "Au réveil ou à la descente : anxiété de rebond, irritabilité, difficulté à se concentrer."
        ],
        "risk_factors": [
            "La montée extrêmement lente est le piège central : redoser ou empiler les prises avant que l'effet complet n'arrive expose à un surdosage sédatif involontaire.",
            "La tolérance grimpe très vite : en quelques jours d'usage rapproché, il faut bien plus pour le même effet, ce qui installe une spirale.",
            "Le sevrage est sévère et peut être dangereux : anxiété intense, insomnie totale, tremblements, et dans les cas marqués des convulsions.",
            "Mélangé à d'autres dépresseurs (alcool, benzodiazépines, opioïdes), l'effet sédatif et respiratoire s'additionne."
        ],
        "avoid_if": [
            "Tu consommes de l'alcool, des benzodiazépines, des opioïdes ou tout autre sédatif : les effets dépresseurs se cumulent.",
            "Tu as un terrain anxieux sévère ou des antécédents de dépendance, car la spirale tolérance-sevrage s'installe vite.",
            "Tu envisages un usage quotidien ou rapproché : c'est précisément ce schéma qui crée la dépendance et le sevrage dangereux."
        ],
        "aftercare": [
            "Espace fortement les prises : laisse passer plusieurs jours, jamais en quotidien, pour ne pas installer de tolérance ni de dépendance.",
            "Si tu remarques une anxiété de rebond, une insomnie ou des tremblements à l'arrêt, n'arrête pas brutalement seul et parle-en à un professionnel : un sevrage progressif et encadré est plus sûr.",
            "Hydrate-toi, soigne ton sommeil et ton alimentation sur les jours qui suivent, le temps que l'humeur se restabilise."
        ],
        "rdr_rules": [
            "Attends largement l'effet complet avant toute idée de reprise : ne JAMAIS redoser ni empiler les prises, c'est la règle d'or du phénibut.",
            "Ne le combine avec aucun autre dépresseur du système nerveux (alcool, benzos, opioïdes, autres GABAergiques).",
            "Garde-le occasionnel et ponctuel : pas d'usage quotidien ni rapproché, pour éviter tolérance et sevrage.",
            "En cas d'usage régulier installé, ne stoppe jamais d'un coup : prévois une diminution lente, idéalement accompagnée."
        ]
    },
    "poppers": {
        "effects": [
            "L'effet est très bref et immédiat à l'inhalation : bouffée de chaleur, vertige, sensation de tête qui tourne et relâchement musculaire.",
            "La vasodilatation fait chuter la tension : on ressent un afflux de chaleur au visage, parfois des palpitations réflexes et un léger flou.",
            "La sensation retombe en quelques minutes, souvent suivie d'un mal de tête.",
            "La chute de tension peut provoquer un malaise, un vertige important ou une perte de connaissance, surtout debout ou à l'effort.",
            "Une bascule vers le malaise, les nausées ou un inconfort marqué est fréquente si l'inhalation est répétée trop vite."
        ],
        "risk_factors": [
            "Avaler du poppers est extrêmement dangereux, voire mortel : le produit est uniquement destiné à être inhalé, jamais ingéré.",
            "L'association avec les médicaments pour l'érection (sildénafil/Viagra et apparentés) peut provoquer une chute de tension catastrophique, potentiellement mortelle.",
            "Une cardiopathie ou une tension instable expose à un malaise grave du fait de la vasodilatation brutale.",
            "Le liquide est corrosif : il brûle la peau, les yeux et les muqueuses au contact, et ses vapeurs peuvent irriter."
        ],
        "avoid_if": [
            "Si tu as pris un médicament pour l'érection (Viagra ou apparenté) : l'association peut être mortelle.",
            "Si tu as une maladie cardiaque, une tension instable, une anémie (déficit en G6PD) ou un glaucome.",
            "Si tu es debout ou en mouvement au moment d'inhaler, en raison du risque de malaise et de chute."
        ],
        "aftercare": [
            "En cas de vertige ou de malaise, assieds-toi ou allonge-toi aussitôt, jambes surélevées, jusqu'au retour à la normale.",
            "Aère, hydrate-toi et laisse passer un éventuel mal de tête.",
            "En cas d'ingestion accidentelle, de malaise prolongé, de lèvres bleutées ou d'essoufflement, appelle immédiatement les secours ou un centre antipoison."
        ],
        "rdr_rules": [
            "Ne l'avale JAMAIS : l'ingestion peut être mortelle ; il ne se respire qu'au-dessus du flacon, jamais collé au nez.",
            "Ne l'associe JAMAIS avec un médicament pour l'érection (Viagra ou apparenté) ni en cas de cardiopathie.",
            "Inhale toujours assis ou allongé pour éviter la chute liée à la baisse de tension.",
            "Évite tout contact avec la peau et les yeux, garde le flacon bien fermé, loin des flammes et hors de portée des enfants."
        ]
    },
    "pregabaline": {
        "effects": [
            "Anxiolyse rapide et nette, sensation d'apaisement, de bien-être et souvent de désinhibition sociale.",
            "Légère euphorie ou sentiment de chaleur sociale chez certaines personnes, plus marqué qu'avec la gabapentine.",
            "Sédation, relâchement musculaire et somnolence.",
            "Étourdissements, vision floue, troubles de la coordination et de la mémoire à court terme possibles.",
            "Absorption plus efficace et plus régulière que la gabapentine, ce qui rend son effet plus puissant à quantité comparable."
        ],
        "risk_factors": [
            "Potentialisation marquée des opioïdes avec risque respiratoire majeur : des décès par surdose sont documentés avec cette association.",
            "Effet plus puissant que la gabapentine, donc marge plus étroite et cumul avec d'autres dépresseurs (alcool, benzos) d'autant plus risqué.",
            "Potentiel de dépendance reconnu, avec recherche de l'effet euphorisant et montée rapide de tolérance.",
            "Sevrage parfois marqué après usage régulier : anxiété, insomnie, sueurs, agitation, voire convulsions."
        ],
        "avoid_if": [
            "Tu prends ou consommes des opioïdes : c'est l'association la plus dangereuse pour la respiration.",
            "Tu y associes de l'alcool, des benzodiazépines ou d'autres sédatifs.",
            "Tu as une insuffisance rénale, qui ralentit l'élimination et fait s'accumuler les effets."
        ],
        "aftercare": [
            "Reste dans un lieu sûr et évite conduite et machines tant que sédation, troubles visuels ou de l'équilibre persistent.",
            "Hydrate-toi et accorde-toi du repos pour laisser passer la sédation.",
            "En usage régulier, ne stoppe jamais brutalement : une réduction lente et accompagnée limite fortement le risque de sevrage sévère."
        ],
        "rdr_rules": [
            "Jamais avec des opioïdes : la prégabaline aggrave leur effet respiratoire et le mélange peut être mortel.",
            "N'empile aucun autre dépresseur du système nerveux (alcool, benzodiazépines, autres gabapentinoïdes).",
            "Tiens compte de sa puissance supérieure à la gabapentine : la marge est plus étroite, redouble de prudence.",
            "Garde-la occasionnelle et, en cas d'usage installé, diminue progressivement plutôt que d'arrêter d'un coup."
        ]
    },
    "protoxyde_azote": {
        "effects": [
            "Dissociation très brève et intense : détachement soudain, sons métalliques répétés, sensation de vibration de la réalité.",
            "Montée quasi immédiate et fulgurante, plateau de quelques dizaines de secondes seulement, puis retour rapide.",
            "Distorsions de l'espace et du temps, euphorie, rires, parfois sensation de décollage ou de boucle.",
            "Vertige et perte d'équilibre brusques qui peuvent faire tomber si l'on est debout.",
            "Picotements, engourdissement et faiblesse passagère des jambes pendant l'effet."
        ],
        "risk_factors": [
            "Hypoxie : respirer le gaz en continu sans air prive le cerveau d'oxygène et peut entraîner une perte de connaissance.",
            "Engelures et brûlures par le froid au contact du gaz qui se détend (lèvres, mains, gorge) si l'on inhale directement à la source.",
            "Usage répété entraînant une carence en vitamine B12 avec atteintes neurologiques (fourmillements, troubles de l'équilibre, faiblesse des membres).",
            "Chute brutale liée au vertige si l'on est debout, surtout en enchaînant les inhalations."
        ],
        "avoid_if": [
            "Tu es debout ou en mouvement, alors que le vertige peut te faire tomber d'un coup.",
            "Tu en fais déjà un usage fréquent et ressens fourmillements, engourdissements ou troubles de l'équilibre.",
            "Tu inhales directement à la source froide (cartouche, bonbonne) sans dispositif intermédiaire, exposant aux engelures."
        ],
        "aftercare": [
            "Reste assis quelques instants après l'effet, le temps que le vertige et la faiblesse des jambes se dissipent.",
            "Espace fortement les usages et, en cas de répétition, sois attentif à ta vitamine B12 (envisager un avis médical et un apport).",
            "Surveille tout signe neurologique persistant (fourmillements, engourdissements, démarche instable) et consulte s'il apparaît."
        ],
        "rdr_rules": [
            "Respire toujours de l'air normal entre deux inhalations et ne respire jamais le gaz en circuit fermé : l'oxygène doit revenir pour éviter l'hypoxie.",
            "Reste assis pendant toute l'inhalation pour ne pas tomber au moment du vertige.",
            "N'inhale jamais directement à la source froide : utilise un ballon pour réchauffer le gaz et éviter les engelures.",
            "Espace nettement les usages et complète/contrôle ta vitamine B12 en cas d'usage répété pour protéger ton système nerveux."
        ]
    },
    "salvia": {
        "effects": [
            "Dissociation atypique très brève mais d'une intensité extrême, pouvant submerger totalement en quelques instants.",
            "Perte rapide du contact avec le réel : sensation de fusion avec les objets, de rotation, de traction ou de déformation du corps.",
            "Montée quasi immédiate et fulgurante, plateau de quelques minutes seulement, puis retour rapide mais désorienté.",
            "Hallucinations envahissantes et perte de conscience de l'environnement, avec parfois des mouvements incontrôlés.",
            "Coordination et conscience du corps complètement abolies pendant le pic, d'où un risque majeur de se lever ou de bouger sans contrôle."
        ],
        "risk_factors": [
            "Intensité extrême et imprévisible qui peut faire perdre tout contact avec la réalité et tout contrôle du corps en quelques secondes.",
            "Risque de chute, de brûlure ou de blessure si l'on est debout, près d'une source de chaleur ou d'objets dangereux pendant le pic.",
            "Mouvements incontrôlés pendant l'effet pouvant entraîner accidents ou panique.",
            "Cadre inadapté (debout, en extérieur, près d'un point d'eau ou d'une route) transformant un effet bref en danger grave."
        ],
        "avoid_if": [
            "Tu n'as personne de sobre à côté pour te maintenir assis et te protéger pendant le pic.",
            "Tu es debout, en hauteur, près d'une flamme, d'un point d'eau, d'une route ou d'objets dangereux.",
            "Tu es dans un état émotionnel fragile ou un environnement bruyant et anxiogène."
        ],
        "aftercare": [
            "Reste assis quelques minutes après le retour, le temps de te réorienter et de retrouver tes repères.",
            "Prends un moment au calme pour intégrer une expérience qui a pu être déstabilisante malgré sa brièveté.",
            "Parle de ce que tu as vécu avec la personne qui t'accompagnait si l'expérience a été marquante ou troublante."
        ],
        "rdr_rules": [
            "Reste toujours assis ou allongé pendant toute l'expérience : ne jamais se tenir debout vu la perte totale de contrôle du corps.",
            "Sois impérativement accompagné d'une personne sobre dont le rôle est de te maintenir en sécurité et de t'empêcher de te lever ou de bouger dangereusement.",
            "Choisis un endroit dégagé, sans flamme, sans objet dangereux et loin de tout point d'eau ou route.",
            "Prépare l'espace à l'avance et laisse l'effet passer sans intervenir, sa très courte durée ne justifiant aucun geste précipité."
        ]
    },
    "tapentadol": {
        "effects": [
            "Soulagement de la douleur et apaisement, avec un effet opioïde présent mais souvent décrit comme plus « propre » et moins sédatif que d'autres opioïdes.",
            "Une composante stimulante/noradrénergique peut donner un léger coup de fouet ou de l'agitation, parfois mêlée à la somnolence.",
            "Myosis, nausées, vertiges, bouche sèche et constipation font partie des effets courants.",
            "La respiration peut tout de même se déprimer, surtout aux quantités élevées ou en mélange : à surveiller.",
            "En manque : courbatures, anxiété, sueurs, troubles du sommeil, avec parfois une coloration anxieuse liée à la composante noradrénergique."
        ],
        "risk_factors": [
            "Le tapentadol agit aussi sur la sérotonine : associé à des antidépresseurs (ISRS, IRSN, IMAO) ou autres sérotoninergiques, il peut déclencher un syndrome sérotoninergique (agitation, tremblements, fièvre, confusion).",
            "Comme tout opioïde, il déprime la respiration, d'autant plus en mélange avec alcool, benzodiazépines ou sédatifs.",
            "Les formes à libération prolongée ne doivent pas être écrasées ni modifiées sous peine de libération massive.",
            "Sa double action peut abaisser le seuil épileptogène : risque accru de convulsions aux quantités élevées ou en association."
        ],
        "avoid_if": [
            "Tu prends des antidépresseurs (ISRS, IRSN, IMAO) ou d'autres substances sérotoninergiques : le risque de syndrome sérotoninergique est réel.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres dépresseurs.",
            "Tu as des antécédents de convulsions ou un terrain épileptique."
        ],
        "aftercare": [
            "Reste accompagné et surveille la respiration ; en cas d'agitation, fièvre, tremblements ou confusion, pense au syndrome sérotoninergique et consulte.",
            "Hydrate-toi et gère nausées et constipation ; le repos atténue les vertiges initiaux.",
            "Après un manque, mise sur le calme, la chaleur et les boissons pour récupérer."
        ],
        "rdr_rules": [
            "Garde de la naloxone disponible et sache t'en servir face à une dépression respiratoire.",
            "Ne consomme jamais seul.",
            "Ne combine pas avec des médicaments sérotoninergiques (antidépresseurs, IMAO) ni avec d'autres dépresseurs.",
            "Respecte l'intégrité des formes à libération prolongée : ne pas écraser ni sniffer."
        ]
    },
    "thco": {
        "effects": [
            "Effets de type cannabique annoncés comme plus puissants que le THC habituel.",
            "Montée nettement retardée, y compris en inhalation : l'effet peut mettre du temps à venir, ce qui pousse à reprendre trop tôt.",
            "Modification marquée de la perception, du temps et des sensations une fois installé.",
            "En négatif : anxiété intense, paranoïa, accélération du cœur, sédation forte si la dose est mal jugée.",
            "En comestible : montée encore plus lente et imprévisible, effet prolongé."
        ],
        "risk_factors": [
            "Caractère retardé de l'effet : risque élevé de surconsommation par impatience.",
            "Molécule de synthèse mal caractérisée, pureté et composition variables selon les lots.",
            "Vapotage de THC-O associé à des cas d'atteintes pulmonaires : danger spécifique pour les poumons.",
            "Association à d'autres substances ou terrain fragile : majore les complications."
        ],
        "avoid_if": [
            "Tu envisages de le vapoter : le risque pulmonaire est documenté et préoccupant.",
            "Tu prends le volant ou dois rester vigilant(e).",
            "Tu as des antécédents respiratoires, cardiaques ou psychiatriques."
        ],
        "aftercare": [
            "En cas de gêne respiratoire, de toux persistante ou d'essoufflement après vapotage : consulter rapidement.",
            "En cas de malaise (pâleur, sueurs, vertige) : s'allonger, surélever les jambes, prendre un sucre lent.",
            "Rester au calme, s'hydrater et attendre la fin des effets, qui peuvent être longs."
        ],
        "rdr_rules": [
            "Tenir compte de la montée retardée : ne pas reprendre parce que « ça ne fait rien », c'est le piège principal.",
            "Éviter le vapotage de THC-O en raison du risque d'atteinte pulmonaire.",
            "Produit mal connu et puissant : commencer prudemment et ne pas cumuler avec l'alcool ou d'autres substances.",
            "Ne jamais conduire après consommation."
        ]
    },
    "thcp": {
        "effects": [
            "Cannabinoïde naturellement présent à l'état de traces, réputé bien plus puissant que le THC.",
            "Effets cannabiques très marqués : détente intense, forte modification de la perception et du temps.",
            "À dose équivalente, l'intensité est beaucoup plus élevée qu'avec le THC : très facile à surdoser.",
            "En négatif : anxiété, paranoïa, tachycardie, sédation profonde et malaise quand la dose est mal jugée.",
            "En comestible : montée lente, effet prolongé et particulièrement puissant, risque élevé de surconsommation."
        ],
        "risk_factors": [
            "Puissance très supérieure au THC : la marge entre effet recherché et effet excessif est faible.",
            "Comestibles particulièrement traîtres, car la montée lente masque la force réelle du produit.",
            "Concentration souvent inconnue et étiquetage peu fiable selon les fabricants.",
            "Terrain anxieux, cardiaque ou psychiatrique : risque accru de réaction sévère."
        ],
        "avoid_if": [
            "Tu prends le volant ou dois rester vigilant(e).",
            "Tu as des antécédents de paranoïa, d'anxiété sévère ou de troubles cardiaques.",
            "Tu es enceinte ou tu allaites."
        ],
        "aftercare": [
            "En cas de malaise (pâleur, sueurs, perte de connaissance brève) : s'allonger, surélever les jambes, prendre un sucre lent.",
            "Rester dans un endroit calme et rassurant, accompagné(e) si possible, jusqu'à la descente qui peut être longue.",
            "S'hydrater, manger légèrement et attendre patiemment la fin des effets."
        ],
        "rdr_rules": [
            "Traiter le THCP comme un produit très puissant : la moindre quantité peut suffire, le surdosage est facile.",
            "Avec les comestibles : la montée lente trompe, attendre longuement avant d'envisager de reprendre.",
            "Éviter de cumuler avec l'alcool ou d'autres substances et rester dans un cadre sécurisant.",
            "Ne jamais conduire après consommation."
        ]
    },
    "tianeptine": {
        "effects": [
            "À dose thérapeutique c'est un antidépresseur, mais à forte dose la tianeptine agit comme un opioïde : chaleur, euphorie et apaisement.",
            "Aux quantités élevées peuvent apparaître somnolence et « nod » de type opioïde.",
            "Myosis, nausées, vertiges et bouche sèche peuvent accompagner les fortes prises.",
            "La respiration peut se déprimer à haute dose comme avec un opioïde : danger réel souvent sous-estimé car il s'agit d'un médicament.",
            "En manque : la dépendance s'installe vite et le sevrage ressemble à celui des opioïdes (courbatures, sueurs, anxiété, agitation, troubles digestifs), souvent intense."
        ],
        "risk_factors": [
            "Vendue dans certains pays comme complément « gas station », elle est consommée à des doses très supérieures à l'usage médical, avec un fort potentiel de dépendance.",
            "À forte dose, l'effet opioïde déprime la respiration, surtout en mélange avec alcool, benzodiazépines ou autres dépresseurs.",
            "L'escalade des quantités est rapide et le sevrage peut être sévère et difficile à gérer seul.",
            "Le statut « médicament/complément » donne une fausse impression d'innocuité qui masque le risque opioïde réel."
        ],
        "avoid_if": [
            "Tu envisages des quantités bien au-dessus de l'usage médical : c'est là que l'effet opioïde et ses dangers apparaissent.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres dépresseurs.",
            "Tu es seul, sans personne pour réagir en cas de problème respiratoire."
        ],
        "aftercare": [
            "Reste accompagné si tu as pris une forte dose et surveille la respiration comme pour un opioïde.",
            "Hydrate-toi et mange léger ; en cas de sevrage installé, le soutien d'un professionnel aide beaucoup à le traverser.",
            "Pour récupérer d'un manque, repos, chaleur et boissons, sans honte à demander de l'aide médicale tant le sevrage peut être rude."
        ],
        "rdr_rules": [
            "Garde de la naloxone disponible : à forte dose, la tianeptine se comporte comme un opioïde et une surdose peut répondre à la naloxone.",
            "Ne consomme jamais seul à forte dose.",
            "N'associe ni alcool, ni benzodiazépines, ni autres dépresseurs.",
            "Méfie-toi de l'étiquette « complément » : le risque de dépendance et de surdose opioïde est bien réel."
        ]
    },
    "tramadol": {
        "effects": [
            "Effet mixte : soulagement de la douleur et apaisement opioïde, parfois teinté d'un léger effet stimulant ou « antidépresseur » au début.",
            "Somnolence possible, mais aussi de l'agitation ou de l'insomnie chez certains, du fait de sa composante sérotoninergique et noradrénergique.",
            "Myosis, nausées, vertiges, sueurs et bouche sèche comptent parmi les effets fréquents.",
            "La respiration peut se déprimer aux quantités élevées ou en mélange : à surveiller malgré son image d'opioïde « léger ».",
            "En manque : syndrome opioïde classique (courbatures, anxiété, sueurs, insomnie) souvent doublé de symptômes atypiques (sensations électriques, anxiété marquée)."
        ],
        "risk_factors": [
            "Le tramadol abaisse nettement le seuil épileptogène : des convulsions peuvent survenir, y compris à des quantités modérées et sans antécédent, surtout en cas d'escalade.",
            "Il agit sur la sérotonine : associé à des antidépresseurs (ISRS, IRSN, IMAO) ou autres sérotoninergiques, il peut déclencher un syndrome sérotoninergique grave.",
            "Le risque de convulsions et le risque sérotoninergique se cumulent et augmentent fortement avec la quantité.",
            "La dépression respiratoire reste possible, aggravée par l'alcool, les benzodiazépines ou d'autres dépresseurs."
        ],
        "avoid_if": [
            "Tu prends des antidépresseurs (ISRS, IRSN, IMAO) ou d'autres sérotoninergiques : le risque de syndrome sérotoninergique est réel.",
            "Tu as un terrain épileptique ou des antécédents de convulsions.",
            "Tu as consommé de l'alcool, des benzodiazépines ou d'autres dépresseurs, ou tu es seul sans surveillance possible."
        ],
        "aftercare": [
            "Reste accompagné et surveille la respiration ; en cas de secousses musculaires, fièvre, agitation, tremblements ou confusion, pense aux convulsions ou au syndrome sérotoninergique et consulte sans attendre.",
            "Hydrate-toi et gère nausées et vertiges ; mange léger en récupérant.",
            "Après un manque, privilégie repos, chaleur et boissons, en sachant que le sevrage du tramadol peut être atypique et inconfortable."
        ],
        "rdr_rules": [
            "Aie de la naloxone à disposition et sache l'utiliser, en gardant en tête qu'elle n'arrête pas les convulsions.",
            "Ne consomme jamais seul, d'autant que des convulsions peuvent survenir brutalement.",
            "N'associe pas de médicaments sérotoninergiques (antidépresseurs, IMAO) et évite d'escalader les quantités, ce qui multiplie le risque de convulsions.",
            "N'ajoute ni alcool, ni benzodiazépines, ni autres dépresseurs."
        ]
    },
    "zolpidem": {
        "effects": [
            "Endormissement rapide et sensation de lourdeur agréable, l'effet recherché étant le sommeil.",
            "À forte dose ou si on lutte contre le sommeil : effets dissociatifs, hallucinations et perceptions déformées.",
            "Amnésie marquée : les minutes qui suivent la prise peuvent ne laisser aucun souvenir.",
            "Comportements automatiques (parasomnies) : marcher, manger, envoyer des messages ou agir sans en garder conscience.",
            "Désinhibition et confusion qui peuvent conduire à des actes qu'on n'aurait pas faits éveillé·e."
        ],
        "risk_factors": [
            "Rester éveillé·e après la prise favorise les parasomnies et les comportements automatiques à risque.",
            "L'association avec l'alcool ou un autre dépresseur accentue l'amnésie et déprime la respiration.",
            "Dépendance possible et insomnie de rebond marquée à l'arrêt.",
            "L'amnésie peut faire oublier qu'on a déjà pris le comprimé et pousser à en reprendre."
        ],
        "avoid_if": [
            "Tu as bu de l'alcool ou pris un autre sédatif.",
            "Tu ne comptes pas te coucher immédiatement après la prise.",
            "Tu es seul·e dans un environnement où un comportement automatique pourrait te mettre en danger."
        ],
        "aftercare": [
            "Couche-toi tout de suite et fais en sorte que ton environnement soit sûr (porte, escaliers, fenêtres).",
            "Le lendemain, attends d'être pleinement réveillé·e avant de conduire : la vigilance reste altérée.",
            "Si des trous de mémoire ou des comportements nocturnes reviennent, parle-en à un soignant."
        ],
        "rdr_rules": [
            "Prends-le seulement au moment de te coucher et reste allongé·e pour éviter les parasomnies.",
            "Jamais avec de l'alcool ni un autre dépresseur.",
            "N'arrête pas brutalement après un usage prolongé : un sevrage progressif accompagné évite le rebond sévère.",
            "Tiens le médicament hors de portée d'un nouveau geste automatique pour ne pas redoser sans t'en souvenir."
        ]
    },
    "zopiclone": {
        "effects": [
            "Endormissement rapide et relâchement musculaire, l'usage visant le sommeil.",
            "Goût métallique ou amer caractéristique dans la bouche.",
            "Amnésie de la période suivant la prise, surtout si on ne s'endort pas tout de suite.",
            "Comportements automatiques possibles (parasomnies) comme pour le zolpidem : agir sans souvenir.",
            "Somnolence et ralentissement qui peuvent se prolonger jusqu'au lendemain."
        ],
        "risk_factors": [
            "Lutter contre le sommeil ouvre la porte aux parasomnies et aux gestes à risque.",
            "Le mélange avec l'alcool ou un autre dépresseur renforce sédation, amnésie et dépression respiratoire.",
            "Dépendance et insomnie de rebond à l'arrêt après un usage régulier.",
            "Somnolence résiduelle au réveil qui altère la conduite et la concentration."
        ],
        "avoid_if": [
            "Tu as consommé de l'alcool ou un autre sédatif.",
            "Tu ne vas pas te coucher dans la foulée.",
            "Tu es seul·e dans un lieu où un comportement automatique pourrait être dangereux."
        ],
        "aftercare": [
            "Va te coucher immédiatement et sécurise ton environnement pour la nuit.",
            "Reporte la conduite au lendemain tant que la somnolence n'a pas totalement disparu.",
            "En cas de rebond d'insomnie ou de comportements nocturnes, demande conseil à un professionnel."
        ],
        "rdr_rules": [
            "À prendre uniquement au coucher, puis rester allongé·e.",
            "Jamais avec de l'alcool ni un autre dépresseur.",
            "Évite l'arrêt brutal après un usage prolongé : préfère une diminution progressive accompagnée.",
            "Range le médicament pour ne pas en reprendre sous l'effet de l'amnésie."
        ]
    }
};

    window.SEUIL_DETAIL = DETAIL;

    if (typeof SUBSTANCE_DB !== "undefined") {
        Object.keys(DETAIL).forEach(function (id) {
            var sub = SUBSTANCE_DB[id];
            if (!sub) return;
            var d = DETAIL[id];
            if (d.effects) sub.effects = d.effects;
            if (d.risk_factors) sub.risk_factors = d.risk_factors;
            if (d.avoid_if) sub.avoid_if = d.avoid_if;
            if (d.aftercare) sub.aftercare = d.aftercare;
            if (d.rdr_rules) sub.rdr_rules = d.rdr_rules;
        });
    }
})();
