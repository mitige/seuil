/*
 * Seuil - route-model.js
 * Modele centralise des voies d'administration (ROA).
 *
 * Les valeurs explicites des fiches restent prioritaires. Les voies affichees
 * sont limitees aux voies documentees ou plausibles pour la forme du produit :
 * on evite de publier des timelines et biodisponibilites artificielles pour des
 * voies qui ne servent pas en pratique.
 */
(function (global) {
    "use strict";

    const ROUTE_LABELS = {
        "Oral": "Orale (avaler)",
        "Sublingual": "Sublinguale",
        "Buccal": "Buccale",
        "Insufflé": "Insufflée (sniff)",
        "Inhalé": "Inhalée / fumée / vaporisée",
        "Rectal": "Rectale (plug)",
        "Intraveineux": "Intraveineuse (IV)",
        "Intramusculaire": "Intramusculaire (IM)",
        "Subcutané": "Sous-cutanée (SC)",
        "Autre": "Autre / non précisée"
    };

    const ROUTE_ORDER = [
        "Oral",
        "Sublingual",
        "Buccal",
        "Insufflé",
        "Inhalé",
        "Rectal",
        "Intraveineux",
        "Intramusculaire",
        "Subcutané",
        "Autre"
    ];

    const PRACTICAL_CORE_ROUTES = ["Oral", "Insufflé", "Rectal", "Intraveineux", "Intramusculaire"];
    const LOW_INTEREST_REMOVED_ROUTES = ["Insufflé", "Rectal", "Intraveineux", "Intramusculaire"];
    const ORALISH_ALLOWED_ROUTES = ["Oral", "Sublingual", "Buccal", "Inhalé"];
    const ORALISH_ONLY_SUBSTANCE_IDS = [
        "ghb", "dxm", "codeine", "tramadol", "clonazepam", "diazepam", "pregabaline", "gabapentine",
        "zopiclone", "phenibut", "alprazolam", "flualprazolam", "clonazolam", "etizolam", "ephedrine",
        "carisoprodol", "tianeptine", "modafinil", "baclofene", "cafeine", "dph", "datura", "zolpidem",
        "mescaline", "loperamide", "kava", "amanite"
    ];
    const PSYCHONAUT_ONLY_ROUTES_BY_ID = {
        salvia: ["Inhalé"],
        dmt: ["Inhalé", "Intraveineux"],
        nicotine: ["Oral", "Buccal", "Inhalé"]
    };

    const PROFILE_ROUTE_LIMITS = {
        alcohol: ["Oral"],
        nitrous: ["Inhalé"],
        poppers: ["Inhalé"],
        cannabis: ["Oral", "Inhalé"],
        synthetic_cannabinoid: ["Oral", "Inhalé"]
    };

    const ROUTE_PROFILES = {
        "Oral": {
            bioavailability: "20 - 70 % (est.)",
            bioMid: 0.45,
            timing: { onset: 1, comeup: 1, peak: 1, offset: 1, total: 1 }
        },
        "Sublingual": {
            bioavailability: "30 - 80 % (est.)",
            bioMid: 0.55,
            timing: { onset: 0.65, comeup: 0.75, peak: 0.9, offset: 0.95, total: 0.9 }
        },
        "Buccal": {
            bioavailability: "30 - 75 % (est.)",
            bioMid: 0.52,
            timing: { onset: 0.7, comeup: 0.8, peak: 0.95, offset: 0.95, total: 0.9 }
        },
        "Insufflé": {
            bioavailability: "25 - 80 % (est.)",
            bioMid: 0.55,
            timing: { onset: 0.25, comeup: 0.35, peak: 0.65, offset: 0.8, total: 0.75 }
        },
        "Inhalé": {
            bioavailability: "10 - 70 % (est.)",
            bioMid: 0.6,
            timing: { onset: 0.04, comeup: 0.08, peak: 0.35, offset: 0.45, total: 0.45 }
        },
        "Rectal": {
            bioavailability: "30 - 80 % (est.)",
            bioMid: 0.55,
            timing: { onset: 0.45, comeup: 0.55, peak: 0.85, offset: 0.9, total: 0.85 }
        },
        "Intraveineux": {
            bioavailability: "100 %",
            bioMid: 1,
            timing: { onset: 0.015, comeup: 0.04, peak: 0.3, offset: 0.45, total: 0.45 }
        },
        "Intramusculaire": {
            bioavailability: "60 - 100 % (est.)",
            bioMid: 0.85,
            timing: { onset: 0.25, comeup: 0.35, peak: 0.8, offset: 0.9, total: 0.85 }
        },
        "Subcutané": {
            bioavailability: "60 - 100 % (est.)",
            bioMid: 0.75,
            timing: { onset: 0.35, comeup: 0.45, peak: 0.9, offset: 1, total: 0.95 }
        },
        "Autre": {
            bioavailability: "0 - 100 % (voie non précisée)",
            bioMid: 0.45,
            timing: { onset: 1, comeup: 1, peak: 1, offset: 1, total: 1 }
        }
    };

    function bioProfile(overrides) {
        return Object.assign({
            "Oral": "40 - 75 % (est.)",
            "Sublingual": "45 - 80 % (est.)",
            "Buccal": "40 - 75 % (est.)",
            "Insufflé": "35 - 75 % (est.)",
            "Inhalé": "25 - 70 % (est.)",
            "Rectal": "45 - 80 % (est.)",
            "Intraveineux": "100 %",
            "Intramusculaire": "65 - 95 % (est.)",
            "Subcutané": "60 - 90 % (est.)",
            "Autre": "0 - 100 % (voie non précisée)"
        }, overrides || {});
    }

    const BIO_ESTIMATE_PROFILES = {
        "lysergamide": bioProfile({
            "Oral": "70 - 90 % (est.)",
            "Sublingual": "75 - 95 % (est.)",
            "Buccal": "75 - 95 % (est.)",
            "Insufflé": "50 - 80 % (est.)",
            "Inhalé": "20 - 50 % (est.)",
            "Rectal": "70 - 90 % (est.)"
        }),
        "phenethylamine_psychedelic": bioProfile({
            "Oral": "55 - 80 % (est.)",
            "Sublingual": "55 - 85 % (est.)",
            "Buccal": "50 - 80 % (est.)",
            "Insufflé": "45 - 75 % (est.)",
            "Inhalé": "30 - 65 % (est.)",
            "Rectal": "55 - 85 % (est.)"
        }),
        "tryptamine_oral": bioProfile({
            "Oral": "35 - 65 % (est.)",
            "Sublingual": "45 - 75 % (est.)",
            "Buccal": "40 - 70 % (est.)",
            "Insufflé": "40 - 70 % (est.)",
            "Inhalé": "25 - 60 % (est.)",
            "Rectal": "45 - 75 % (est.)"
        }),
        "mdxx": bioProfile({
            "Oral": "65 - 85 % (est.)",
            "Sublingual": "65 - 90 % (est.)",
            "Buccal": "60 - 85 % (est.)",
            "Insufflé": "55 - 75 % (est.)",
            "Inhalé": "35 - 65 % (est.)",
            "Rectal": "65 - 90 % (est.)"
        }),
        "cathinone": bioProfile({
            "Oral": "55 - 80 % (est.)",
            "Sublingual": "60 - 85 % (est.)",
            "Buccal": "55 - 80 % (est.)",
            "Insufflé": "50 - 80 % (est.)",
            "Inhalé": "35 - 70 % (est.)",
            "Rectal": "60 - 85 % (est.)"
        }),
        "amphetamine": bioProfile({
            "Oral": "70 - 90 % (est.)",
            "Sublingual": "70 - 90 % (est.)",
            "Buccal": "65 - 90 % (est.)",
            "Insufflé": "75 - 95 % (est.)",
            "Inhalé": "50 - 80 % (est.)",
            "Rectal": "75 - 95 % (est.)"
        }),
        "methamphetamine": bioProfile({
            "Oral": "60 - 80 % (est.)",
            "Sublingual": "65 - 85 % (est.)",
            "Buccal": "60 - 85 % (est.)",
            "Insufflé": "60 - 90 % (est.)",
            "Inhalé": "70 - 90 % (est.)",
            "Rectal": "70 - 95 % (est.)"
        }),
        "methylphenidate": bioProfile({
            "Oral": "20 - 40 % (est.)",
            "Sublingual": "25 - 45 % (est.)",
            "Buccal": "25 - 45 % (est.)",
            "Insufflé": "50 - 80 % (est.)",
            "Inhalé": "35 - 65 % (est.)",
            "Rectal": "35 - 65 % (est.)"
        }),
        "modafinil": bioProfile({
            "Oral": "60 - 80 % (est.)",
            "Sublingual": "60 - 85 % (est.)",
            "Buccal": "55 - 80 % (est.)",
            "Insufflé": "40 - 70 % (est.)",
            "Inhalé": "25 - 55 % (est.)",
            "Rectal": "55 - 80 % (est.)"
        }),
        "dxm": bioProfile({
            "Oral": "10 - 35 % (est.)",
            "Sublingual": "15 - 40 % (est.)",
            "Buccal": "15 - 40 % (est.)",
            "Insufflé": "20 - 55 % (est.)",
            "Inhalé": "15 - 45 % (est.)",
            "Rectal": "25 - 55 % (est.)"
        }),
        "kratom": bioProfile({
            "Oral": "30 - 60 % (est.)",
            "Sublingual": "35 - 65 % (est.)",
            "Buccal": "35 - 65 % (est.)",
            "Insufflé": "15 - 45 % (est.)",
            "Inhalé": "10 - 35 % (est.)",
            "Rectal": "30 - 60 % (est.)"
        }),
        "codeine": bioProfile({
            "Oral": "40 - 60 % (est.)",
            "Sublingual": "45 - 65 % (est.)",
            "Buccal": "40 - 65 % (est.)",
            "Insufflé": "35 - 65 % (est.)",
            "Inhalé": "25 - 55 % (est.)",
            "Rectal": "50 - 75 % (est.)"
        }),
        "cannabis": bioProfile({
            "Oral": "4 - 20 % (est.)",
            "Sublingual": "10 - 35 % (est.)",
            "Buccal": "10 - 35 % (est.)",
            "Insufflé": "5 - 20 % (est.)",
            "Inhalé": "10 - 35 % (est.)",
            "Rectal": "5 - 20 % (est.)",
            "Intramusculaire": "0 % (non applicable)",
            "Subcutané": "0 % (non applicable)"
        }),
        "synthetic_cannabinoid": bioProfile({
            "Oral": "10 - 40 % (est.)",
            "Sublingual": "15 - 45 % (est.)",
            "Buccal": "15 - 45 % (est.)",
            "Insufflé": "10 - 35 % (est.)",
            "Inhalé": "20 - 60 % (est.)",
            "Rectal": "10 - 40 % (est.)",
            "Intramusculaire": "0 % (non applicable)",
            "Subcutané": "0 % (non applicable)"
        }),
        "alcohol": bioProfile({
            "Oral": "80 - 100 % (est.)",
            "Sublingual": "35 - 70 % (est.)",
            "Buccal": "35 - 70 % (est.)",
            "Insufflé": "0 % (non applicable)",
            "Inhalé": "40 - 80 % (est.; dangereux)",
            "Rectal": "80 - 100 % (est.; dangereux)",
            "Intraveineux": "100 % (voie médicale uniquement)",
            "Intramusculaire": "0 % (non applicable)",
            "Subcutané": "0 % (non applicable)"
        }),
        "benzodiazepine": bioProfile({
            "Oral": "70 - 95 % (est.)",
            "Sublingual": "65 - 95 % (est.)",
            "Buccal": "60 - 90 % (est.)",
            "Insufflé": "40 - 75 % (est.)",
            "Inhalé": "25 - 60 % (est.)",
            "Rectal": "60 - 90 % (est.)"
        }),
        "opioid": bioProfile({
            "Oral": "20 - 60 % (est.)",
            "Sublingual": "30 - 70 % (est.)",
            "Buccal": "30 - 70 % (est.)",
            "Insufflé": "35 - 80 % (est.)",
            "Inhalé": "30 - 80 % (est.)",
            "Rectal": "50 - 80 % (est.)"
        }),
        "fentanyl": bioProfile({
            "Oral": "30 - 50 % (est.)",
            "Sublingual": "50 - 70 % (est.)",
            "Buccal": "50 - 70 % (est.)",
            "Insufflé": "60 - 90 % (est.)",
            "Inhalé": "60 - 90 % (est.)",
            "Rectal": "50 - 80 % (est.)"
        }),
        "tramadol": bioProfile({
            "Oral": "65 - 75 % (est.)",
            "Sublingual": "65 - 80 % (est.)",
            "Buccal": "60 - 80 % (est.)",
            "Insufflé": "45 - 75 % (est.)",
            "Inhalé": "30 - 60 % (est.)",
            "Rectal": "60 - 85 % (est.)"
        }),
        "ghb": bioProfile({
            "Oral": "25 - 60 % (est.)",
            "Sublingual": "30 - 65 % (est.)",
            "Buccal": "30 - 65 % (est.)",
            "Insufflé": "0 % (non applicable)",
            "Inhalé": "0 % (non applicable)",
            "Rectal": "30 - 70 % (est.)",
            "Intramusculaire": "0 % (non applicable)",
            "Subcutané": "0 % (non applicable)"
        }),
        "nitrous": bioProfile({
            "Oral": "0 % (non applicable)",
            "Sublingual": "0 % (non applicable)",
            "Buccal": "0 % (non applicable)",
            "Insufflé": "0 % (non applicable)",
            "Inhalé": "80 - 100 % (est.)",
            "Rectal": "0 % (non applicable)",
            "Intraveineux": "0 % (non applicable)",
            "Intramusculaire": "0 % (non applicable)",
            "Subcutané": "0 % (non applicable)"
        }),
        "poppers": bioProfile({
            "Oral": "0 % (non applicable / dangereux)",
            "Sublingual": "0 % (non applicable / dangereux)",
            "Buccal": "0 % (non applicable / dangereux)",
            "Insufflé": "0 % (non applicable)",
            "Inhalé": "60 - 90 % (est.)",
            "Rectal": "0 % (non applicable / dangereux)",
            "Intraveineux": "0 % (non applicable / dangereux)",
            "Intramusculaire": "0 % (non applicable)",
            "Subcutané": "0 % (non applicable)"
        }),
        "caffeine": bioProfile({
            "Oral": "95 - 100 % (est.)",
            "Sublingual": "80 - 100 % (est.)",
            "Buccal": "80 - 100 % (est.)",
            "Insufflé": "60 - 90 % (est.)",
            "Inhalé": "40 - 80 % (est.)",
            "Rectal": "80 - 100 % (est.)"
        }),
        "generic_psychedelic": bioProfile({
            "Oral": "45 - 75 % (est.)",
            "Sublingual": "50 - 80 % (est.)",
            "Buccal": "45 - 80 % (est.)",
            "Insufflé": "40 - 75 % (est.)",
            "Inhalé": "25 - 65 % (est.)",
            "Rectal": "50 - 80 % (est.)"
        }),
        "generic_stimulant": bioProfile({
            "Oral": "55 - 85 % (est.)",
            "Sublingual": "60 - 90 % (est.)",
            "Buccal": "55 - 85 % (est.)",
            "Insufflé": "55 - 85 % (est.)",
            "Inhalé": "40 - 80 % (est.)",
            "Rectal": "60 - 90 % (est.)"
        }),
        "generic_depressant": bioProfile({
            "Oral": "35 - 75 % (est.)",
            "Sublingual": "45 - 80 % (est.)",
            "Buccal": "40 - 80 % (est.)",
            "Insufflé": "35 - 75 % (est.)",
            "Inhalé": "25 - 70 % (est.)",
            "Rectal": "45 - 80 % (est.)"
        }),
        "generic_dissociative": bioProfile({
            "Oral": "20 - 55 % (est.)",
            "Sublingual": "30 - 65 % (est.)",
            "Buccal": "30 - 65 % (est.)",
            "Insufflé": "40 - 75 % (est.)",
            "Inhalé": "35 - 80 % (est.)",
            "Rectal": "45 - 80 % (est.)"
        }),
        "generic_other": bioProfile({})
    };

    const REQUIRED_DOSE_FIELDS = ["unit", "threshold", "light", "common", "strong", "heavy"];
    const REQUIRED_DURATION_FIELDS = ["onset", "comeup", "peak", "offset", "total"];

    function isObject(value) {
        return value && typeof value === "object" && !Array.isArray(value);
    }

    function isRouteMap(map) {
        return isObject(map) && !Object.prototype.hasOwnProperty.call(map, "onset");
    }

    function normalizeRoute(route) {
        if (ROUTE_LABELS[route]) return route;
        const raw = String(route || "").toLowerCase();
        if (raw.includes("oral") || raw.includes("avaler")) return "Oral";
        if (raw.includes("subling")) return "Sublingual";
        if (raw.includes("bucc")) return "Buccal";
        if (raw.includes("insuff") || raw.includes("sniff") || raw.includes("nasal")) return "Insufflé";
        if (raw.includes("inhal") || raw.includes("fum") || raw.includes("vapor")) return "Inhalé";
        if (raw.includes("rect") || raw.includes("plug") || raw.includes("boof")) return "Rectal";
        if (raw.includes("intrave") || raw === "iv" || raw.includes("(iv")) return "Intraveineux";
        if (raw.includes("intramus") || raw === "im" || raw.includes("(im")) return "Intramusculaire";
        if (raw.includes("subcut") || raw.includes("sous-cutan") || raw === "sc") return "Subcutané";
        return "Autre";
    }

    function foldText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function collectRouteText(sub) {
        const parts = [];
        if (!sub) return "";
        ["name", "category", "description", "profile"].forEach((field) => {
            if (sub[field]) parts.push(String(sub[field]));
        });
        if (Array.isArray(sub.forms)) parts.push(sub.forms.join(" "));
        const durations = sub.durations;
        if (isRouteMap(durations) && durations.default) {
            REQUIRED_DURATION_FIELDS.forEach((field) => {
                if (durations.default[field]) parts.push(String(durations.default[field]));
            });
        }
        return parts.join(" ").toLowerCase();
    }

    function collectIdentityText(sub) {
        const parts = [];
        if (!sub) return "";
        ["name", "category"].forEach((field) => {
            if (sub[field]) parts.push(String(sub[field]));
        });
        if (Array.isArray(sub.aliases)) parts.push(sub.aliases.join(" "));
        if (Array.isArray(sub.forms)) parts.push(sub.forms.join(" "));
        return parts.join(" ");
    }

    function collectFormsText(sub) {
        return foldText(Array.isArray(sub && sub.forms) ? sub.forms.join(" ") : "");
    }

    function getSubstanceId(sub) {
        return foldText(sub && sub.id).replace(/-/g, "_");
    }

    function matchesSubstanceId(sub, ids) {
        const id = getSubstanceId(sub);
        if (id && ids.includes(id)) return true;
        const name = foldText(sub && sub.name);
        const identity = foldText(collectIdentityText(sub));
        return ids.some((candidate) => {
            if (candidate === "dmt") return /^dmt\b/.test(name) || /\bdimethyltryptamine\b/.test(identity);
            if (candidate === "salvia") return /\bsalvia\b|\bsalvinorine\b/.test(identity);
            if (candidate === "nicotine") return /\bnicotine\b|\btabac\b/.test(identity);
            return false;
        });
    }

    function formLooksLiquidOnly(form) {
        const text = foldText(form);
        return /\b(liquide|solution buvable|sirop)\b/.test(text)
            && !/\b(e-liquide|vape|vapor|inhal|fum|cigarette|sachets?|gommes?|comprime|gelule|capsule|poudre|cristaux|cristal|ampoule|inject)\b/.test(text);
    }

    function hasOnlyLiquidOralForms(sub) {
        if (!sub || !Array.isArray(sub.forms) || !sub.forms.length) return false;
        return sub.forms.every(formLooksLiquidOnly);
    }

    function getRestrictedPsychedelicRouteLimit(sub) {
        const identity = foldText(collectIdentityText(sub));
        const text = foldText(collectRouteText(sub));
        if (identity.includes("nbome") || text.includes("nbome")) return ["Oral", "Sublingual", "Buccal"];
        if (
            /\b(lsd|1p-lsd|1cp-lsd|ald-52|1a-lsd|al-lad|eth-lad|lsa|ergine|lysergamide)\b/.test(identity)
            || /\b(1p-lsd|1cp-lsd|ald-52|1a-lsd|al-lad|eth-lad)\b/.test(text)
        ) {
            return ["Oral", "Sublingual", "Buccal"];
        }
        if (identity.includes("psilocybine") || identity.includes("psilocybin mushrooms")) return ["Oral"];
        return null;
    }

    function getPsychonautOnlyRouteLimit(sub) {
        const id = getSubstanceId(sub);
        if (id && PSYCHONAUT_ONLY_ROUTES_BY_ID[id]) return PSYCHONAUT_ONLY_ROUTES_BY_ID[id];
        if (matchesSubstanceId(sub, ["salvia"])) return PSYCHONAUT_ONLY_ROUTES_BY_ID.salvia;
        if (matchesSubstanceId(sub, ["dmt"])) return PSYCHONAUT_ONLY_ROUTES_BY_ID.dmt;
        if (matchesSubstanceId(sub, ["nicotine"])) return PSYCHONAUT_ONLY_ROUTES_BY_ID.nicotine;
        return null;
    }

    function getOralishRouteLimit(sub) {
        if (matchesSubstanceId(sub, ["alprazolam", "cafeine", "kratom"])) return ["Oral"];
        if (matchesSubstanceId(sub, ORALISH_ONLY_SUBSTANCE_IDS)) return ORALISH_ALLOWED_ROUTES;
        return null;
    }

    function inferPrimaryRoute(sub) {
        if (!sub) return "Oral";
        if (sub.primary_route) return normalizeRoute(sub.primary_route);
        const identity = foldText(collectIdentityText(sub));
        if (identity.includes("salvia")) return "Inhalé";
        const text = collectRouteText(sub);
        if (text.includes("(oral") || text.includes("voie orale") || text.includes("avaler")) return "Oral";
        if (text.includes("(insuff") || text.includes("voie nasale") || text.includes("sniff")) return "Insufflé";
        if (text.includes("(inhal") || text.includes("vaporis") || text.includes("fum") || text.includes("protoxyde") || text.includes("poppers")) return "Inhalé";
        if (text.includes("(rect") || text.includes("plug") || text.includes("boof")) return "Rectal";
        if (text.includes("(iv") || text.includes("intraveine")) return "Intraveineux";
        if (text.includes("(im") || text.includes("intramus")) return "Intramusculaire";
        if (isRouteMap(sub.durations_seconds)) {
            const routes = Object.keys(sub.durations_seconds).filter((route) => route !== "default");
            if (routes.length === 1) return normalizeRoute(routes[0]);
            if (routes.includes("Oral")) return "Oral";
            if (routes.includes("Inhalé")) return "Inhalé";
            if (routes.length) return normalizeRoute(routes[0]);
        }
        return "Oral";
    }

    function inferBioEstimateProfile(sub) {
        const text = foldText(collectRouteText(sub));
        const identity = foldText(collectIdentityText(sub));
        if (/\b(alcool|ethanol|boisson alcoolisee)\b/.test(identity)) return "alcohol";
        if (identity.includes("cafeine")) return "caffeine";
        if (identity.includes("protoxyde")) return "nitrous";
        if (identity.includes("poppers") || identity.includes("nitrites d'alkyle")) return "poppers";
        if (identity.includes("fentanyl") || identity.includes("nitazene")) return "fentanyl";
        if (identity.includes("tramadol")) return "tramadol";
        if (identity.includes("ghb") || identity.includes("gbl")) return "ghb";
        if (identity.includes("codeine")) return "codeine";
        if (identity.includes("kratom")) return "kratom";
        if (identity.includes("dextromethorphane") || identity.includes("dxm")) return "dxm";
        if (identity.includes("opioide") || identity.includes("opiac")) return "opioid";
        if (identity.includes("benzodiazepine")) return "benzodiazepine";
        if (text.includes("cannabinoides de synthese")) return "synthetic_cannabinoid";
        if (text.includes("cannabis")) return "cannabis";
        if (text.includes("methamphetamine")) return "methamphetamine";
        if (text.includes("amphetamine")) return "amphetamine";
        if (text.includes("methylphenidate")) return "methylphenidate";
        if (text.includes("modafinil")) return "modafinil";
        if (text.includes("mephedrone") || text.includes("cathinone") || text.includes("3-mmc") || text.includes("4-mmc")) return "cathinone";
        if (text.includes("mdma") || /\bmda\b/.test(text)) return "mdxx";
        if (text.includes("lsd") || text.includes("lysergamide")) return "lysergamide";
        if (text.includes("2c-b") || text.includes("2c-i") || text.includes("2c-e") || text.includes("mescaline") || text.includes("phenethylamine")) return "phenethylamine_psychedelic";
        if (text.includes("4-aco-dmt") || text.includes("psilocybine") || text.includes("champignons")) return "tryptamine_oral";
        if (text.includes("tryptamine")) return "tryptamine_oral";

        const cls = foldText(sub && sub.class);
        if (cls.includes("psychedelic")) return "generic_psychedelic";
        if (cls.includes("stimulant") || cls.includes("empathogen")) return "generic_stimulant";
        if (cls.includes("depressant")) return "generic_depressant";
        if (cls.includes("dissociative")) return "generic_dissociative";
        if (cls.includes("cannabinoid")) return "cannabis";
        return "generic_other";
    }

    function sortRoutes(routes, fallback = ["Oral"]) {
        const unique = Array.from(new Set((routes || []).map(normalizeRoute).filter((route) => ROUTE_LABELS[route])));
        unique.sort((a, b) => ROUTE_ORDER.indexOf(a) - ROUTE_ORDER.indexOf(b));
        return unique.length ? unique : fallback.slice();
    }

    function collectExplicitRoutes(sub) {
        const routes = [];
        if (!sub) return routes;
        if (sub.primary_route) routes.push(sub.primary_route);
        ["dosages_by_route", "bioavailability_by_route"].forEach((field) => {
            if (isObject(sub[field])) Object.keys(sub[field]).forEach((route) => routes.push(route));
        });
        ["durations", "durations_seconds"].forEach((field) => {
            if (isRouteMap(sub[field])) {
                Object.keys(sub[field]).filter((route) => route !== "default").forEach((route) => routes.push(route));
            }
        });
        return sortRoutes(routes, []);
    }

    function hasFlexibleRouteForm(sub) {
        const forms = collectFormsText(sub);
        return /\b(poudre|cristaux|cristal|liquide|solution|ampoule|resine|extrait|distillat|freebase|base)\b/.test(forms);
    }

    function hasInhaledForm(sub) {
        const forms = collectFormsText(sub);
        return /\b(vape|vapor|inhal|fum|fleurs?|resine|cartouche|e-liquide|gaz|bonbonne|poppers)\b/.test(forms);
    }

    function hasStrictOralForm(sub) {
        const forms = collectFormsText(sub);
        if (!forms) return false;
        if (hasFlexibleRouteForm(sub) || hasInhaledForm(sub)) return false;
        return /\b(graines?|champignons?|racine|noix|boisson|cactus|feuilles? fraiches?)\b/.test(forms);
    }

    function getRoutesForSubstance(sub) {
        if (!sub) return ["Oral"];
        const text = foldText(collectRouteText(sub));
        const profileName = inferBioEstimateProfile(sub);
        const primaryRoute = inferPrimaryRoute(sub);
        const explicitRoutes = collectExplicitRoutes(sub);

        if (/lisdexamfetamine|lisdexamphetamine|vyvanse|elvanse/.test(text)) {
            return ["Oral"];
        }

        if (PROFILE_ROUTE_LIMITS[profileName]) {
            const allowedRoutes = PROFILE_ROUTE_LIMITS[profileName];
            return sortRoutes(explicitRoutes.filter((route) => allowedRoutes.includes(route)).concat(allowedRoutes));
        }

        const psychonautOnlyRouteLimit = getPsychonautOnlyRouteLimit(sub);
        if (psychonautOnlyRouteLimit) {
            const routes = explicitRoutes.concat(primaryRoute)
                .map(normalizeRoute)
                .filter((route) => psychonautOnlyRouteLimit.includes(route));
            return sortRoutes(routes, [psychonautOnlyRouteLimit[0]]);
        }

        const psychedelicRouteLimit = getRestrictedPsychedelicRouteLimit(sub);
        if (psychedelicRouteLimit) {
            const routes = explicitRoutes.concat(primaryRoute)
                .map(normalizeRoute)
                .filter((route) => psychedelicRouteLimit.includes(route));
            return sortRoutes(routes, [psychedelicRouteLimit[0]]);
        }

        const oralishRouteLimit = getOralishRouteLimit(sub);
        if (oralishRouteLimit) {
            const routes = explicitRoutes.concat(primaryRoute)
                .map(normalizeRoute)
                .filter((route) => oralishRouteLimit.includes(route));
            return sortRoutes(routes, ["Oral"]);
        }

        if (hasOnlyLiquidOralForms(sub)) {
            return ["Oral"];
        }

        if (hasStrictOralForm(sub)) {
            return sortRoutes(explicitRoutes.concat("Oral"));
        }

        const routes = explicitRoutes.concat(PRACTICAL_CORE_ROUTES);
        if (primaryRoute && primaryRoute !== "Autre") routes.push(primaryRoute);
        if (hasInhaledForm(sub) || primaryRoute === "Inhalé") routes.push("Inhalé");
        return sortRoutes(routes);
    }

    function isHiddenRouteRequest(sub, route) {
        if (!sub || !route || route === "default") return false;
        const safeRoute = normalizeRoute(route);
        if (safeRoute === "Autre") return true;
        return !getRoutesForSubstance(sub).includes(safeRoute);
    }

    function parsePercentMid(text) {
        const nums = String(text || "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/g);
        if (!nums || !nums.length) return null;
        const values = nums.map(Number).filter((n) => Number.isFinite(n));
        if (!values.length) return null;
        const pctValues = values.filter((n) => n >= 0 && n <= 100);
        const source = pctValues.length ? pctValues : values;
        return source.reduce((a, b) => a + b, 0) / source.length / 100;
    }

    function parsePercentRange(text) {
        const nums = String(text || "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/g);
        if (!nums || !nums.length) return null;
        const values = nums
            .map(Number)
            .filter((n) => Number.isFinite(n) && n >= 0 && n <= 100)
            .map((n) => n / 100);
        if (!values.length) return null;
        const min = Math.min.apply(null, values);
        const max = Math.max.apply(null, values);
        return { min, max, mid: (min + max) / 2 };
    }

    function getBioavailabilityForRoute(sub, route) {
        if (isHiddenRouteRequest(sub, route)) return null;
        const safeRoute = normalizeRoute(route || inferPrimaryRoute(sub));
        const explicit = sub && sub.bioavailability_by_route && sub.bioavailability_by_route[safeRoute];
        if (explicit) {
            const value = typeof explicit === "string" ? explicit : (explicit.value || explicit.range || "");
            if (String(value).trim()) {
                return {
                    value: value,
                    estimated: !!(explicit && explicit.estimated),
                    source: explicit.source || "fiche",
                    profile: inferBioEstimateProfile(sub)
                };
            }
        }
        const profileName = inferBioEstimateProfile(sub);
        const estimateProfile = BIO_ESTIMATE_PROFILES[profileName] || BIO_ESTIMATE_PROFILES.generic_other;
        const value = estimateProfile[safeRoute] || estimateProfile.Autre || ROUTE_PROFILES[safeRoute].bioavailability;
        return {
            value: value,
            estimated: true,
            source: "estimation_substance_profile",
            profile: profileName
        };
    }

    function getBioMid(sub, route) {
        const safeRoute = normalizeRoute(route);
        const bio = getBioavailabilityForRoute(sub, safeRoute);
        const parsed = parsePercentMid(bio && bio.value);
        if (parsed !== null) return Math.max(0.01, Math.min(1, parsed));
        return (ROUTE_PROFILES[safeRoute] || ROUTE_PROFILES.Autre).bioMid;
    }

    function getBioRange(sub, route) {
        const safeRoute = normalizeRoute(route);
        const bio = getBioavailabilityForRoute(sub, safeRoute);
        const parsed = parsePercentRange(bio && bio.value);
        if (parsed) {
            return {
                min: Math.max(0.01, Math.min(1, parsed.min)),
                max: Math.max(0.01, Math.min(1, parsed.max)),
                mid: Math.max(0.01, Math.min(1, parsed.mid))
            };
        }
        const mid = (ROUTE_PROFILES[safeRoute] || ROUTE_PROFILES.Autre).bioMid;
        return { min: mid, max: mid, mid };
    }

    function bioRangeOverlap(a, b) {
        return Math.max(0, Math.min(a.max, b.max) - Math.max(a.min, b.min));
    }

    function bioSimilarityScore(sub, sourceRoute, targetRoute) {
        const source = getBioRange(sub, sourceRoute);
        const target = getBioRange(sub, targetRoute);
        const overlap = bioRangeOverlap(source, target);
        const midDistance = Math.abs(source.mid - target.mid);
        return midDistance - overlap * 0.25;
    }

    function routeTimingDistance(sourceRoute, targetRoute) {
        const source = ROUTE_PROFILES[normalizeRoute(sourceRoute)] || ROUTE_PROFILES.Autre;
        const target = ROUTE_PROFILES[normalizeRoute(targetRoute)] || ROUTE_PROFILES.Autre;
        return REQUIRED_DURATION_FIELDS.reduce((sum, field) => (
            sum + Math.abs((source.timing[field] || 1) - (target.timing[field] || 1))
        ), 0);
    }

    function cloneDosage(dosages, estimated, sourceRoute) {
        const out = {};
        REQUIRED_DOSE_FIELDS.forEach((field) => {
            out[field] = dosages && dosages[field] !== undefined ? dosages[field] : "Non renseigné";
        });
        out.unit = dosages && dosages.unit !== undefined ? dosages.unit : "unité";
        out._estimated = !!estimated;
        out._sourceRoute = sourceRoute || null;
        return out;
    }

    function hasNumericDose(dosages) {
        return REQUIRED_DOSE_FIELDS.some((field) => /\d/.test(String(dosages && dosages[field] || "")));
    }

    function getExplicitDosageSources(sub, targetRoute) {
        const explicit = sub && sub.dosages_by_route;
        const candidates = [];
        const safeTargetRoute = normalizeRoute(targetRoute);
        if (isObject(explicit)) {
            Object.keys(explicit).forEach((route) => {
                const safeRoute = normalizeRoute(route);
                if (safeRoute === "Autre" || safeRoute === safeTargetRoute) return;
                if (hasNumericDose(explicit[route])) {
                    candidates.push({ route: safeRoute, dosages: explicit[route] });
                }
            });
        }
        if (!candidates.length && sub && hasNumericDose(sub.dosages)) {
            candidates.push({ route: inferPrimaryRoute(sub), dosages: sub.dosages });
        }
        return candidates;
    }

    function pickBestExplicitDosageSource(sub, targetRoute) {
        const candidates = getExplicitDosageSources(sub, targetRoute);
        if (!candidates.length) return null;
        const primaryRoute = inferPrimaryRoute(sub);
        candidates.sort((a, b) => {
            const score = bioSimilarityScore(sub, a.route, targetRoute) - bioSimilarityScore(sub, b.route, targetRoute);
            if (Math.abs(score) > 0.0001) return score;
            if (a.route === primaryRoute && b.route !== primaryRoute) return -1;
            if (b.route === primaryRoute && a.route !== primaryRoute) return 1;
            return ROUTE_ORDER.indexOf(a.route) - ROUTE_ORDER.indexOf(b.route);
        });
        return candidates[0];
    }

    function doseMidValue(dosages, field) {
        const nums = String(dosages && dosages[field] || "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/g);
        if (!nums || !nums.length) return null;
        const values = nums.map(Number).filter((value) => Number.isFinite(value));
        if (!values.length) return null;
        if (values.length === 1) return values[0];
        return (values[0] + values[1]) / 2;
    }

    function dosageScaleFactor(sub, sourceRoute, targetRoute) {
        const sourceBioRange = getBioRange(sub, sourceRoute);
        const targetBioRange = getBioRange(sub, targetRoute);
        const overlapsSimilarBio = bioRangeOverlap(sourceBioRange, targetBioRange) > 0
            && Math.abs(sourceBioRange.mid - targetBioRange.mid) <= 0.2;
        if (overlapsSimilarBio) return 1;
        return Math.max(0.05, Math.min(4, sourceBioRange.mid / getBioMid(sub, targetRoute)));
    }

    function estimateDosageFromSource(sub, targetRoute, source) {
        const base = source && source.dosages;
        const sourceRoute = source && source.route;
        const out = cloneDosage(base || {}, true, sourceRoute);
        if (!base || !hasNumericDose(base)) return out;
        const factor = dosageScaleFactor(sub, sourceRoute, targetRoute);
        REQUIRED_DOSE_FIELDS.forEach((field) => {
            out[field] = scaleDoseText(base[field], factor, base.unit);
        });
        return out;
    }

    function sameDoseUnit(a, b) {
        return String(a && a.unit || "").trim().toLowerCase() === String(b && b.unit || "").trim().toLowerCase();
    }

    function applyConservativeDoseCaps(sub, targetRoute, estimated, sources) {
        const targetBioMid = getBioRange(sub, targetRoute).mid;
        sources.forEach((source) => {
            if (!sameDoseUnit(estimated, source.dosages)) return;
            if (getBioRange(sub, source.route).mid > targetBioMid + 0.05) return;
            const cap = estimateDosageFromSource(sub, targetRoute, source);
            REQUIRED_DOSE_FIELDS.forEach((field) => {
                const currentValue = doseMidValue(estimated, field);
                const capValue = doseMidValue(cap, field);
                if (capValue === null) return;
                if (currentValue === null || currentValue > capValue) {
                    estimated[field] = cap[field];
                }
            });
        });
        return estimated;
    }

    function formatScaledNumber(value, unit) {
        if (!Number.isFinite(value) || value <= 0) return "0";
        const normalizedUnit = String(unit || "").toLowerCase();
        let step = 1;
        if (normalizedUnit.includes("µg")) step = value < 20 ? 1 : 5;
        else if (normalizedUnit.includes("mg")) step = value < 1 ? 0.1 : (value < 20 ? 0.5 : (value < 100 ? 1 : 5));
        else if (normalizedUnit.includes("g")) step = value < 1 ? 0.05 : 0.1;
        else if (normalizedUnit.includes("ml")) step = value < 1 ? 0.05 : 0.1;
        else step = value < 10 ? 0.5 : 1;
        const rounded = Math.max(step, Math.round(value / step) * step);
        if (step < 1) return String(Number(rounded.toFixed(2))).replace(".", ",");
        return String(Math.round(rounded));
    }

    function scaleDoseText(text, factor, unit) {
        const raw = String(text || "");
        if (!/\d/.test(raw)) return raw;
        return raw.replace(/\d+(?:[,.]\d+)?/g, (match) => {
            const value = Number(match.replace(",", "."));
            return formatScaledNumber(value * factor, unit);
        });
    }

    function estimateDosageFromRoute(sub, targetRoute) {
        const primaryRoute = inferPrimaryRoute(sub);
        const sources = getExplicitDosageSources(sub, targetRoute);
        if (!sources.length) return cloneDosage(sub && sub.dosages, true, primaryRoute);
        const source = pickBestExplicitDosageSource(sub, targetRoute) || sources[0];
        const estimated = estimateDosageFromSource(sub, targetRoute, source);
        return applyConservativeDoseCaps(sub, targetRoute, estimated, sources);
    }

    function getDosageForRoute(sub, route) {
        if (isHiddenRouteRequest(sub, route)) return null;
        const safeRoute = normalizeRoute(route || inferPrimaryRoute(sub));
        if (!sub) return cloneDosage({}, true, null);
        if (sub.dosages_by_route && sub.dosages_by_route[safeRoute]) {
            return cloneDosage(sub.dosages_by_route[safeRoute], false, safeRoute);
        }
        const primaryRoute = inferPrimaryRoute(sub);
        if (safeRoute === primaryRoute || safeRoute === "Autre") {
            return cloneDosage(sub.dosages, false, primaryRoute);
        }
        return estimateDosageFromRoute(sub, safeRoute);
    }

    function normalizeDurations(durations) {
        const out = {};
        REQUIRED_DURATION_FIELDS.forEach((field) => {
            const value = Number(durations && durations[field]);
            out[field] = Number.isFinite(value) && value > 0 ? value : 1;
        });
        return out;
    }

    function explicitDurationsForRoute(sub, route) {
        if (!sub || !sub.durations_seconds) return null;
        const safeRoute = normalizeRoute(route);
        const durations = sub.durations_seconds;
        if (isRouteMap(durations)) {
            return durations[safeRoute] ? normalizeDurations(durations[safeRoute]) : null;
        }
        return safeRoute === inferPrimaryRoute(sub) ? normalizeDurations(durations) : null;
    }

    function pickBestExplicitDurationSource(sub, targetRoute) {
        if (!sub || !isRouteMap(sub.durations_seconds)) return null;
        const primaryRoute = inferPrimaryRoute(sub);
        const candidates = Object.keys(sub.durations_seconds)
            .filter((route) => route !== "default")
            .map((route) => ({ route: normalizeRoute(route), durations: sub.durations_seconds[route] }))
            .filter((candidate) => candidate.route !== normalizeRoute(targetRoute) && candidate.route !== "Autre" && candidate.durations);
        if (!candidates.length) return null;
        candidates.sort((a, b) => {
            const score = routeTimingDistance(a.route, targetRoute) - routeTimingDistance(b.route, targetRoute);
            if (Math.abs(score) > 0.0001) return score;
            if (a.route === primaryRoute && b.route !== primaryRoute) return -1;
            if (b.route === primaryRoute && a.route !== primaryRoute) return 1;
            return ROUTE_ORDER.indexOf(a.route) - ROUTE_ORDER.indexOf(b.route);
        });
        return candidates[0];
    }

    function getBaseDurations(sub, targetRoute) {
        if (!sub || !sub.durations_seconds) {
            return { durations: normalizeDurations({ onset: 1800, comeup: 1800, peak: 7200, offset: 7200, total: 12600 }), route: "Oral" };
        }
        const primaryRoute = inferPrimaryRoute(sub);
        const durations = sub.durations_seconds;
        if (isRouteMap(durations)) {
            const source = pickBestExplicitDurationSource(sub, targetRoute || primaryRoute);
            const sourceRoute = (source && source.route) || primaryRoute;
            const base = (source && source.durations) || durations[primaryRoute] || durations.default || durations[Object.keys(durations)[0]];
            return { durations: normalizeDurations(base), route: sourceRoute };
        }
        return { durations: normalizeDurations(durations), route: primaryRoute };
    }

    function scaleDuration(value, factor, minSeconds) {
        const scaled = Math.round(Number(value || 1) * factor);
        return Math.max(minSeconds || 1, scaled);
    }

    function estimateDurationsForRoute(sub, route) {
        const safeRoute = normalizeRoute(route || inferPrimaryRoute(sub));
        const base = getBaseDurations(sub, safeRoute);
        const sourceProfile = ROUTE_PROFILES[base.route] || ROUTE_PROFILES.Oral;
        const targetProfile = ROUTE_PROFILES[safeRoute] || ROUTE_PROFILES.Autre;
        const out = {};
        REQUIRED_DURATION_FIELDS.forEach((field) => {
            const sourceFactor = sourceProfile.timing[field] || 1;
            const targetFactor = targetProfile.timing[field] || 1;
            const ratio = targetFactor / sourceFactor;
            const min = (safeRoute === "Intraveineux" || safeRoute === "Inhalé") && field === "onset" ? 1 : 5;
            out[field] = scaleDuration(base.durations[field], ratio, min);
        });
        const phaseEnd = out.onset + out.comeup + out.peak + out.offset;
        out.total = Math.max(out.total, phaseEnd);
        out._estimated = true;
        out._sourceRoute = base.route;
        return out;
    }

    function getDurationsForRoute(sub, route) {
        if (isHiddenRouteRequest(sub, route)) return null;
        const safeRoute = normalizeRoute(route || inferPrimaryRoute(sub));
        const explicit = explicitDurationsForRoute(sub, safeRoute);
        if (explicit) {
            explicit._estimated = false;
            explicit._sourceRoute = safeRoute;
            return explicit;
        }
        return estimateDurationsForRoute(sub, safeRoute);
    }

    function getRelativeExposureFactor(sub, route) {
        if (isHiddenRouteRequest(sub, route)) return 0;
        const primaryRoute = inferPrimaryRoute(sub);
        const sourceBio = getBioMid(sub, primaryRoute);
        const targetBio = getBioMid(sub, normalizeRoute(route || primaryRoute));
        return Math.max(0.05, Math.min(5, targetBio / sourceBio));
    }

    const api = {
        ROUTE_LABELS,
        ROUTE_ORDER,
        ROUTE_PROFILES,
        getRoutesForSubstance,
        inferPrimaryRoute,
        getBioavailabilityForRoute,
        getDosageForRoute,
        getDurationsForRoute,
        getRelativeExposureFactor,
        normalizeRoute
    };

    global.SEUIL_ROA_MODEL = api;
    if (global.window) global.window.SEUIL_ROA_MODEL = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
