/**
 * Seuil - app.js
 * Logique principale de l'application (SPA, journal de session, inventaire, statistiques SVG, chiffrement WebCrypto, sauvegardes).
 */

// --- ÉTAT GLOBAL DE L'APPLICATION ---
const QUALITATIVE_DOSE_UNITS = ["ligne", "joint", "verre", "comprimé", "goutte", "bouffée", "prise"];
const QUALITATIVE_DOSE_UNIT_ALIASES = {
    "ligne": "ligne",
    "line": "ligne",
    "joint": "joint",
    "verre": "verre",
    "glass": "verre",
    "comprime": "comprimé",
    "comprimé": "comprimé",
    "pill": "comprimé",
    "tablet": "comprimé",
    "goutte": "goutte",
    "drop": "goutte",
    "bouffee": "bouffée",
    "bouffée": "bouffée",
    "puff": "bouffée",
    "prise": "prise",
    "dose": "prise"
};

let appState = createDefaultAppState();
let lastRedoseTargetKey = null;

function createDefaultAppState() {
    return {
        sessions: [],
        activeSession: null,
        stash: {}, // format: { substanceKey: { qty: X, form: Y } }
        customSubstances: {}, // substances personnalisées permanentes
        security: {
            enabled: false,
            passwordHash: ""
        },
        aiSettings: {
            enabled: false,
            provider: null,
            consented: false
        },
        doseUnitSettings: {
            qualitativeUnits: [...QUALITATIVE_DOSE_UNITS]
        }
    };
}

function normalizeAppState(state) {
    const base = createDefaultAppState();
    const incoming = state && typeof state === "object" ? state : {};
    return {
        ...base,
        ...incoming,
        sessions: Array.isArray(incoming.sessions) ? incoming.sessions : [],
        activeSession: incoming.activeSession || null,
        stash: incoming.stash && typeof incoming.stash === "object" ? incoming.stash : {},
        customSubstances: incoming.customSubstances && typeof incoming.customSubstances === "object" ? incoming.customSubstances : {},
        security: { ...base.security, ...(incoming.security || {}) },
        aiSettings: { ...base.aiSettings, ...(incoming.aiSettings || {}) },
        doseUnitSettings: normalizeDoseUnitSettings(incoming.doseUnitSettings)
    };
}

function getMergedSubstanceDb() {
    return { ...SUBSTANCE_DB, ...(appState.customSubstances || {}) };
}

function getSortedSubstanceKeys(db) {
    return Object.keys(db || {}).sort((a, b) => (
        displaySubstanceName((db[a] || {}).name)
            .localeCompare(displaySubstanceName((db[b] || {}).name), undefined, { sensitivity: "base" })
    ));
}

function tx(key, vars) {
    const translator = (typeof window !== "undefined" && typeof window.t === "function") ? window.t : null;
    if (translator) return translator(key, vars);
    let text = String(key || "");
    if (vars && typeof vars === "object") {
        Object.keys(vars).forEach((name) => {
            text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
        });
    }
    return text;
}

function displaySubstanceName(name) {
    return tx(name || "");
}

const SUBSTANCE_DETAIL_ASSET_URLS = [
    "substances-detail.js?v=3",
    "i18n-detail.js?v=5"
];
let substanceDetailAssetsPromise = null;

function loadScriptAsset(src) {
    return new Promise((resolve, reject) => {
        const selector = `script[data-seuil-asset="${src}"], script[src="${src}"]`;
        const existing = document.querySelector(selector);
        if (existing) {
            if (existing.dataset.seuilLoaded === "1") resolve();
            else existing.addEventListener("load", () => resolve(), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.dataset.seuilAsset = src;
        script.onload = () => {
            script.dataset.seuilLoaded = "1";
            resolve();
        };
        script.onerror = () => reject(new Error(`Asset impossible à charger : ${src}`));
        (document.head || document.body || document.documentElement).appendChild(script);
    });
}

async function loadSubstanceDetailAssets() {
    if (!substanceDetailAssetsPromise) {
        substanceDetailAssetsPromise = (async () => {
            for (const src of SUBSTANCE_DETAIL_ASSET_URLS) {
                await loadScriptAsset(src);
            }
        })().catch((err) => {
            substanceDetailAssetsPromise = null;
            throw err;
        });
    }
    return substanceDetailAssetsPromise;
}

function scheduleSubstanceDetailWarmup() {
    const warmup = () => {
        loadSubstanceDetailAssets()
            .then(() => applyI18nToAppSurfaces())
            .catch((err) => console.info("Détails substances non initialisés :", err));
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(warmup, { timeout: 8000 });
    } else {
        setTimeout(warmup, 3500);
    }
}

const ROA_MODEL = window.SEUIL_ROA_MODEL || {};
const ROUTE_LABELS = ROA_MODEL.ROUTE_LABELS || {
    "Oral": "Orale (avaler)",
    "Sublingual": "Sublinguale",
    "Buccal": "Buccale",
    "Insufflé": "Insufflée (sniff)",
    "Inhalé": "Inhalée / Fumée / Vaporisée",
    "Rectal": "Rectale (Plug)",
    "Intraveineux": "Intraveineuse (IV)",
    "Intramusculaire": "Intramusculaire (IM)",
    "Subcutané": "Sous-cutanée (SC)",
    "Autre": "Autre"
};

function getRoutesForSubstance(sub) {
    if (ROA_MODEL.getRoutesForSubstance) return ROA_MODEL.getRoutesForSubstance(sub);
    return Object.keys(ROUTE_LABELS);
}

function getAvailableRoutesForSubstanceKey(subKey) {
    const mergedDb = getMergedSubstanceDb();
    const sub = mergedDb[subKey];
    return getRoutesForSubstance(sub);
}

function populateRouteSelect(select, routes, preferredRoute) {
    if (!select) return;
    const current = preferredRoute || select.value;
    const safeRoutes = (routes && routes.length ? routes : Object.keys(ROUTE_LABELS))
        .filter(route => ROUTE_LABELS[route]);
    select.innerHTML = safeRoutes
        .map(route => `<option value="${route}">${tx(ROUTE_LABELS[route])}</option>`)
        .join("");
    if (!selectValueIfAvailable(select, current)) {
        selectValueIfAvailable(select, safeRoutes[0]);
    }
}

function selectValueIfAvailable(select, value) {
    if (!select || !value) return false;
    const exists = Array.from(select.options || []).some(option => option.value === value);
    if (!exists) return false;
    select.value = value;
    return true;
}

function translatedEmptyOption(label) {
    return `<option value="">${escapeHtml(tx(label))}</option>`;
}

function getLastDoseRoute(logs, fallbackRoute) {
    const doseLogs = Array.isArray(logs) ? logs : [];
    for (let i = doseLogs.length - 1; i >= 0; i--) {
        const log = doseLogs[i];
        if ((log.type === "dose" || log.type === "redose") && log.route) {
            return log.route;
        }
    }
    return fallbackRoute || "Oral";
}

function getRouteForTarget(targetKey) {
    const session = appState.activeSession;
    if (!session) return "Oral";
    if (!targetKey || targetKey === session.substanceKey) {
        return getLastDoseRoute(session.logs, session.route || "Oral");
    }
    const targetExtra = (session.extraSubstances || []).find(x => x.key === targetKey);
    if (!targetExtra) return getLastDoseRoute(session.logs, session.route || "Oral");
    return getLastDoseRoute(targetExtra.logs, targetExtra.route || session.route || "Oral");
}

function syncRedoseRouteToTarget() {
    const targetSelect = document.getElementById("redose-target");
    const routeSelect = document.getElementById("input-redose-route");
    if (!targetSelect || !routeSelect) return;
    populateRouteSelect(
        routeSelect,
        getAvailableRoutesForSubstanceKey(targetSelect.value),
        getRouteForTarget(targetSelect.value)
    );
}

function syncRedoseUnitToTarget() {
    const targetSelect = document.getElementById("redose-target");
    if (!targetSelect) return;
    populateDoseUnitSelect(document.getElementById("input-redose-unit"), getReferenceUnitForSubstanceKey(targetSelect.value));
}

function syncAddSubRouteToSelected() {
    const subSelect = document.getElementById("add-sub-select");
    const routeSelect = document.getElementById("add-sub-route");
    if (!routeSelect) return;
    populateRouteSelect(
        routeSelect,
        getAvailableRoutesForSubstanceKey(subSelect ? subSelect.value : null),
        "Oral"
    );
}

function syncAddSubUnitToSelected() {
    const subSelect = document.getElementById("add-sub-select");
    if (!subSelect) return;
    populateDoseUnitSelect(document.getElementById("add-sub-unit"), getReferenceUnitForSubstanceKey(subSelect.value));
}

function setRouteSelectPlaceholder(select, label) {
    if (!select) return;
    select.innerHTML = `<option value="">${escapeHtml(tx(label))}</option>`;
    select.value = "";
    select.disabled = true;
}

function syncStartSessionRouteToSelected() {
    const subSelect = document.getElementById("substance-select");
    const routeSelect = document.getElementById("route-select");
    if (!subSelect || !routeSelect) return;
    const value = subSelect.value;
    if (!value) {
        setRouteSelectPlaceholder(routeSelect, "Sélectionnez une substance");
        return;
    }
    routeSelect.disabled = false;
    if (value === "custom") {
        populateRouteSelect(routeSelect, Object.keys(ROUTE_LABELS), routeSelect.value || "Oral");
        return;
    }
    populateRouteSelect(routeSelect, getAvailableRoutesForSubstanceKey(value), routeSelect.value);
}

function parseDosageRange(str) {
    if (!str) return null;
    const matches = str.match(/([0-9.]+)/g);
    if (!matches) return null;
    return matches.map(Number);
}

// Formate une Date pour <input type="datetime-local"> (heure locale, avec secondes)
function toLocalDatetimeLocal(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getDosageForRoute(sub, route) {
    if (!sub) return null;
    if (ROA_MODEL.getDosageForRoute) return ROA_MODEL.getDosageForRoute(sub, route);
    if (sub.dosages_by_route && route) return sub.dosages_by_route[route] || null;
    return sub.dosages || null;
}

function getDurationsForRoute(sub, route) {
    if (ROA_MODEL.getDurationsForRoute) return ROA_MODEL.getDurationsForRoute(sub, route);
    if (!sub || !sub.durations_seconds) return null;
    const durations = sub.durations_seconds;
    if (durations[route]) return durations[route];
    return durations.default || durations;
}

function getRouteExposureFactor(sub, route) {
    if (ROA_MODEL.getRelativeExposureFactor) return ROA_MODEL.getRelativeExposureFactor(sub, route);
    return 1;
}

const MASS_DOSE_FACTORS_TO_MG = {
    "µg": 0.001,
    "mg": 1,
    "g": 1000
};

function normalizeDoseUnit(unit) {
    const raw = String(unit || "mg").trim();
    const normalized = raw.toLowerCase().replace(/μ/g, "µ");
    if (/\b(µg|ug|mcg)\b/.test(normalized)) return "µg";
    if (/\bmg\b/.test(normalized)) return "mg";
    if (/^g\b|\bg\b/.test(normalized)) return "g";
    if (/\bml\b/.test(normalized)) return "ml";
    return raw || "mg";
}

function qualitativeDoseUnitAliasKey(unit) {
    return String(unit || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "");
}

function canonicalizeQualitativeDoseUnit(unit) {
    const normalized = normalizeDoseUnit(unit);
    const key = qualitativeDoseUnitAliasKey(normalized);
    return QUALITATIVE_DOSE_UNIT_ALIASES[key] || normalized;
}

function formatQualitativeDoseUnitForSettings(unit) {
    return tx(canonicalizeQualitativeDoseUnit(unit));
}

function sanitizeQualitativeDoseUnits(units) {
    const parts = Array.isArray(units)
        ? units
        : String(units || "").split(/[,\n;]+/);
    const seen = new Set();
    const cleaned = [];
    parts.forEach((unit) => {
        const label = String(unit || "")
            .replace(/[<>]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 32);
        if (!label) return;
        const normalized = canonicalizeQualitativeDoseUnit(label);
        if (Object.prototype.hasOwnProperty.call(MASS_DOSE_FACTORS_TO_MG, normalized) || normalized === "ml") return;
        const key = normalized.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        cleaned.push(normalized);
    });
    return cleaned.slice(0, 16);
}

function normalizeDoseUnitSettings(settings) {
    const configured = sanitizeQualitativeDoseUnits(settings && settings.qualitativeUnits);
    return {
        qualitativeUnits: configured.length ? configured : [...QUALITATIVE_DOSE_UNITS]
    };
}

function getQualitativeDoseUnits() {
    const configured = sanitizeQualitativeDoseUnits(appState && appState.doseUnitSettings && appState.doseUnitSettings.qualitativeUnits);
    return configured.length ? configured : [...QUALITATIVE_DOSE_UNITS];
}

function isQualitativeDoseUnit(unit) {
    return getQualitativeDoseUnits().includes(normalizeDoseUnit(unit));
}

function getCompatibleDoseUnits(referenceUnit) {
    const unit = normalizeDoseUnit(referenceUnit);
    if (Object.prototype.hasOwnProperty.call(MASS_DOSE_FACTORS_TO_MG, unit)) {
        return ["µg", "mg", "g", ...getQualitativeDoseUnits()];
    }
    if (unit === "ml") return ["ml", ...getQualitativeDoseUnits()];
    return [String(referenceUnit || "mg"), ...getQualitativeDoseUnits()];
}

function convertDoseToReferenceUnit(amount, fromUnit, referenceUnit) {
    const value = Number(amount);
    if (!Number.isFinite(value)) return value;
    const source = normalizeDoseUnit(fromUnit);
    if (isQualitativeDoseUnit(source)) return null;
    const target = normalizeDoseUnit(referenceUnit);
    const sourceFactor = MASS_DOSE_FACTORS_TO_MG[source];
    const targetFactor = MASS_DOSE_FACTORS_TO_MG[target];
    if (sourceFactor && targetFactor) {
        return parseFloat(((value * sourceFactor) / targetFactor).toFixed(6));
    }
    if (source === target) return value;
    return isQualitativeDoseUnit(source) ? null : value;
}

function formatInputDoseLabel(amount, unit) {
    const value = Number(amount);
    const safeAmount = Number.isFinite(value) ? parseFloat(value.toFixed(6)) : amount;
    return `${safeAmount} ${tx(normalizeDoseUnit(unit))}`.trim();
}

function getNumericDoseValue(log) {
    const numeric = Number(log && log.dose);
    return Number.isFinite(numeric) ? numeric : 0;
}

function getCurveDoseValue(log) {
    const numeric = getNumericDoseValue(log);
    if (numeric > 0) return numeric;
    const curveDose = Number(log && log.curveDose);
    return Number.isFinite(curveDose) && curveDose > 0 ? curveDose : 0;
}

function formatDoseQuantity(log, unit) {
    if (log && log.doseLabel) return log.doseLabel;
    const numeric = getNumericDoseValue(log);
    if (numeric > 0 || (log && log.dose === 0)) return `${numeric} ${unit}`.trim();
    return tx("Non quantifié");
}

function collectQualitativeDoseParts(logs) {
    const totals = {};
    getDoseLogs(logs).forEach((log) => {
        if (!log || (!isQualitativeDoseUnit(log.inputUnit) && log.dose !== null)) return;
        const amount = Number(log.inputAmount);
        if (!Number.isFinite(amount)) return;
        const unit = normalizeDoseUnit(log.inputUnit);
        totals[unit] = (totals[unit] || 0) + amount;
    });
    return Object.keys(totals).map(unit => `${parseFloat(totals[unit].toFixed(6))} ${tx(unit)}`);
}

function formatCumulativeDoseDisplay(logs, unit) {
    const numericTotal = sumDoseLogs(logs);
    const qualitativeParts = collectQualitativeDoseParts(logs);
    const parts = [];
    if (numericTotal > 0) parts.push(`${numericTotal} ${unit}`.trim());
    parts.push(...qualitativeParts);
    return parts.length ? parts.join(" + ") : tx("Non quantifié");
}

function populateDoseUnitSelect(select, referenceUnit, preferredUnit) {
    if (!select) return;
    const units = getCompatibleDoseUnits(referenceUnit);
    const preferred = units.includes(preferredUnit) ? preferredUnit : normalizeDoseUnit(referenceUnit);
    select.innerHTML = units
        .map(unit => `<option value="${unit}">${escapeHtml(tx(unit))}</option>`)
        .join("");
    select.value = units.includes(preferred) ? preferred : units[0];
    select.disabled = units.length <= 1;
}

function getReferenceUnitForSubstanceKey(subKey) {
    if (!subKey || subKey === "custom") return "mg";
    const sub = getMergedSubstanceDb()[subKey];
    return (sub && sub.dosages && sub.dosages.unit) || "mg";
}

function getDosageLevel(subKey, dose, route) {
    if (!subKey || isNaN(dose) || dose <= 0) return { text: "", class: "" };
    const mergedDb = getMergedSubstanceDb();
    const sub = mergedDb[subKey];
    const dosages = getDosageForRoute(sub, route);
    if (!sub || !dosages) return { text: "Palier non défini", class: "int-unknown" };

    let threshold = 0, light = 0, common = 0, strong = 0, heavy = 0;

    if (sub.isCustom) {
        threshold = dosages.threshold;
        light = dosages.light;
        common = dosages.common;
        strong = dosages.strong;
        heavy = dosages.heavy;
    } else {
        const parseMin = (str) => {
            if (!str) return null;
            const normalized = String(str).replace(/,/g, ".");
            const matches = normalized.match(/([0-9.]+)/g);
            return matches ? parseFloat(matches[0]) : null;
        };
        threshold = parseMin(dosages.threshold);
        light = parseMin(dosages.light);
        common = parseMin(dosages.common);
        strong = parseMin(dosages.strong);
        heavy = parseMin(dosages.heavy);
    }

    if ([threshold, light, common, strong, heavy].some(v => v === null || !Number.isFinite(v))) {
        return { text: "Palier non défini", class: "int-unknown" };
    }

    if (dose < threshold) {
        return { text: "Sous-seuil / seuil", class: "int-low-risk" };
    } else if (dose < light) {
        return { text: "Seuil léger", class: "int-low-risk" };
    } else if (dose < common) {
        return { text: "Dose légère", class: "int-decrease" };
    } else if (dose < strong) {
        return { text: "Dose usuelle", class: "int-synergy" };
    } else if (dose < heavy) {
        return { text: "Dose élevée", class: "int-caution" };
    } else {
        return { text: "Dose très élevée", class: "int-unsafe" };
    }
}

function updateDosageBadge() {
    const subKey = document.getElementById("substance-select").value;
    const inputDose = parseFloat(document.getElementById("input-dosage").value);
    const route = document.getElementById("route-select").value;
    const badge = document.getElementById("dosage-level-badge");
    const doseUnit = document.getElementById("unit-select").value;
    const dose = convertDoseToReferenceUnit(inputDose, doseUnit, getReferenceUnitForSubstanceKey(subKey));
    
    if (!subKey || isNaN(inputDose) || subKey === "custom" || dose === null) {
        badge.textContent = "";
        badge.className = "";
        return;
    }
    
    const level = getDosageLevel(subKey, dose, route);
    badge.textContent = `(${tx(level.text)})`;
    badge.className = `substance-badge ${level.class}`;
}

function updateRedoseBadge() {
    if (!appState.activeSession) return;
    const targetSelect = document.getElementById("redose-target");
    const subKey = targetSelect && targetSelect.value ? targetSelect.value : appState.activeSession.substanceKey;
    const inputAmount = parseFloat(document.getElementById("input-redose-amount").value);
    const routeSelect = document.getElementById("input-redose-route");
    const route = routeSelect && routeSelect.value ? routeSelect.value : getRouteForTarget(subKey);
    const badge = document.getElementById("redose-level-badge");
    const amountUnit = document.getElementById("input-redose-unit").value;
    const amount = convertDoseToReferenceUnit(inputAmount, amountUnit, getReferenceUnitForSubstanceKey(subKey));
    
    if (!subKey || isNaN(inputAmount) || subKey === "custom" || amount === null) {
        badge.textContent = "";
        badge.className = "";
        return;
    }
    
    const level = getDosageLevel(subKey, amount, route);
    badge.textContent = `(${tx(level.text)})`;
    badge.className = `substance-badge ${level.class}`;
}

let activeTimerInterval = null;
let autoCloseInProgress = false;
let effectCurveProbe = { active: false, pct: null };
let currentPassword = ""; // Conservé en mémoire pour ré-encrypter lors des sauvegardes

// --- CONSTANTES ---
const STORAGE_KEY = "journal_rdr_data";
const ACTIVE_TAB_STORAGE_KEY = "seuil_active_tab";
const ENCRYPTED_PREFIX = "ENCRYPTED:";
const VAULT_TIMEOUT_MS = 12000;

// --- INITIALISATION ---
let appInitialized = false;

async function initApp() {
    if (appInitialized) return;
    appInitialized = true;

    // 1. Charger les données du coffre courant
    await loadLocalData();

    // 2. Initialiser les sélecteurs de substances
    populateSubstanceSelects();

    // 3. Configurer les onglets
    setupTabs();

    // 4. Initialiser la base substances (Guide & Interactions)
    initGuideAndInteractions();

    // 4b. Comparateur multi-courbes
    setupComparator();

    // 5. Enregistrer les événements de formulaires et de boutons
    setupEventHandlers();

    // 5b. Câbler l'interface du panneau d'administration (rendue à la demande)
    if (window.SeuilAuth && SeuilAuth.isAdmin()) {
        SeuilAuth.bindAdminUI();
        SeuilAuth.renderAdminPanel();
    }

    // 5c. Carte « Mon compte » (mot de passe, code de récupération, sessions)
    if (window.SeuilAuth) {
        SeuilAuth.bindAccountUI();
    }

    bindLanguageSettings();
    bindDoseUnitSettings();

    // 6. Si une session active existait, relancer le timer
    renderDashboard();
    if (appState.activeSession) {
        resumeActiveSession();
    }

    // 7. Rendre les stash et statistiques
    renderStash();
    renderStats();

    applyI18nToAppSurfaces();
    scheduleSubstanceDetailWarmup();
}

function applyI18nToAppSurfaces() {
    if (!window.SeuilI18n || typeof SeuilI18n.apply !== "function") return;
    SeuilI18n.apply(document.querySelector(".app-container"));
    SeuilI18n.apply(document.getElementById("admin-create-modal"));
    SeuilI18n.apply(document.getElementById("recovery-kit-modal"));
    SeuilI18n.apply(document.getElementById("pwgate-modal"));
    SeuilI18n.apply(document.getElementById("substance-modal"));
    SeuilI18n.apply(document.getElementById("ai-context-panel"));
}
window.applySeuilI18n = applyI18nToAppSurfaces;

function copySessionForAi(session) {
    if (!session || typeof session !== "object") return null;
    const copy = {
        substanceKey: session.substanceKey || "",
        substanceName: displaySubstanceName(session.substanceName || ""),
        initialDose: session.initialDose,
        cumulativeDose: session.cumulativeDose,
        unit: session.unit || "",
        route: session.route || "",
        setSetting: session.setSetting || "",
        startTime: session.startTime || null,
        endTime: session.endTime || null,
        extraSubstances: (session.extraSubstances || []).map((sub) => ({
            key: sub.key || "",
            name: displaySubstanceName(sub.name || ""),
            cumulativeDose: sub.cumulativeDose,
            unit: sub.unit || "",
            route: sub.route || "",
            logs: (sub.logs || []).slice(-12).map(copyLogForAi)
        })),
        logs: (session.logs || []).slice(-16).map(copyLogForAi)
    };
    return copy;
}

function copyLogForAi(log) {
    return {
        time: log && log.time ? log.time : null,
        type: log && log.type ? log.type : "",
        dose: log ? log.dose : null,
        inputAmount: log ? log.inputAmount : null,
        inputUnit: log && log.inputUnit ? log.inputUnit : "",
        doseLabel: log && log.doseLabel ? log.doseLabel : "",
        route: log && log.route ? log.route : "",
        note: log && log.note ? log.note : ""
    };
}

function getSeuilSubstanceSummary(key) {
    const db = getMergedSubstanceDb();
    const sub = key && db[key] ? db[key] : null;
    if (!sub) return null;
    const routes = getRoutesForSubstance(sub);
    const routeSummaries = {};
    routes.forEach((route) => {
        const dosage = ROA_MODEL.getDosageForRoute ? ROA_MODEL.getDosageForRoute(sub, route) : sub.dosages;
        const durations = getDurationsForRoute(sub, route);
        const bioavailability = getBioavailabilityForRoute(sub, route);
        routeSummaries[route] = {
            dosage,
            durations,
            bioavailability: formatBioavailabilityValue(bioavailability)
        };
    });
    return {
        key,
        name: displaySubstanceName(sub.name || key),
        category: tx(sub.category || ""),
        class: sub.class || "",
        forms: sub.forms || [],
        profile: tx(sub.profile || sub.description || ""),
        risk_factors: sub.risk_factors || [],
        avoid_if: sub.avoid_if || [],
        warning_signs: sub.warning_signs || [],
        rdr_rules: sub.rdr_rules || [],
        metabolism: sub.metabolism || "",
        routes,
        routeSummaries
    };
}

window.getSeuilAiSnapshot = function getSeuilAiSnapshot() {
    return {
        activeSession: copySessionForAi(appState.activeSession),
        sessions: (appState.sessions || []).slice(0, 30).map(copySessionForAi),
        compareSelection: typeof window.getCompareSelection === "function" ? window.getCompareSelection() : [],
        language: window.SeuilI18n && typeof SeuilI18n.getLanguage === "function" ? SeuilI18n.getLanguage() : "fr"
    };
};
window.getSeuilSubstanceSummary = getSeuilSubstanceSummary;

function bindLanguageSettings() {
    const select = document.getElementById("language-select");
    const status = document.getElementById("language-status");
    if (!select || !window.SeuilI18n) return;

    const getPreference = () => (
        typeof SeuilI18n.getLanguagePreference === "function"
            ? SeuilI18n.getLanguagePreference()
            : SeuilI18n.getLanguage()
    ) || "auto";
    const renderStatus = () => {
        if (!status) return;
        const lang = SeuilI18n.getLanguage && SeuilI18n.getLanguage() === "en" ? tx("anglais") : tx("français");
        status.textContent = tx("Langue actuelle : {lang}", { lang });
    };

    select.value = getPreference();
    renderStatus();
    if (select.__seuilBound) return;
    select.__seuilBound = true;
    select.addEventListener("change", () => {
        if (typeof SeuilI18n.setLanguagePreference === "function") {
            SeuilI18n.setLanguagePreference(select.value, { persist: true });
        } else if (typeof SeuilI18n.setLanguage === "function") {
            SeuilI18n.setLanguage(select.value, { persist: true });
        }
        applyI18nToAppSurfaces();
        renderDoseUnitSettings();
        refreshDoseUnitSelects();
        select.value = getPreference();
        renderStatus();
        if (window.SeuilUI) SeuilUI.toast(tx("Langue mise à jour."), { type: "success" });
    });
}

function renderDoseUnitSettings() {
    const input = document.getElementById("dose-unit-list-input");
    if (!input) return;
    input.value = getQualitativeDoseUnits().map(formatQualitativeDoseUnitForSettings).join(", ");
}

function setDoseUnitSettingsStatus(message, type) {
    const status = document.getElementById("dose-unit-settings-status");
    if (!status) return;
    status.textContent = message ? tx(message) : "";
    status.style.color = type === "error" ? "#ef4444" : "var(--color-text-muted)";
}

function refreshDoseUnitSelects() {
    const mainSubstance = document.getElementById("substance-select");
    const mainUnit = document.getElementById("unit-select");
    if (mainUnit) {
        populateDoseUnitSelect(mainUnit, getReferenceUnitForSubstanceKey(mainSubstance && mainSubstance.value), mainUnit.value);
    }

    const addSubstance = document.getElementById("add-sub-select");
    const addSubUnit = document.getElementById("add-sub-unit");
    if (addSubUnit) {
        populateDoseUnitSelect(addSubUnit, getReferenceUnitForSubstanceKey(addSubstance && addSubstance.value), addSubUnit.value);
    }

    const redoseTarget = document.getElementById("redose-target");
    const redoseUnit = document.getElementById("input-redose-unit");
    if (redoseUnit) {
        populateDoseUnitSelect(redoseUnit, getReferenceUnitForSubstanceKey(redoseTarget && redoseTarget.value), redoseUnit.value);
    }

    updateDosageBadge();
    updateRedoseBadge();
}

async function saveDoseUnitSettings(event) {
    if (event) event.preventDefault();
    const input = document.getElementById("dose-unit-list-input");
    const units = sanitizeQualitativeDoseUnits(input && input.value);
    if (!units.length) {
        setDoseUnitSettingsStatus("Ajoutez au moins une unité qualitative.", "error");
        return;
    }
    appState.doseUnitSettings = { qualitativeUnits: units };
    await saveLocalData();
    renderDoseUnitSettings();
    refreshDoseUnitSelects();
    setDoseUnitSettingsStatus("Unités de saisie mises à jour.");
}

async function resetDoseUnitSettings() {
    appState.doseUnitSettings = { qualitativeUnits: [...QUALITATIVE_DOSE_UNITS] };
    await saveLocalData();
    renderDoseUnitSettings();
    refreshDoseUnitSelects();
    setDoseUnitSettingsStatus("Unités de saisie réinitialisées.");
}

function bindDoseUnitSettings() {
    renderDoseUnitSettings();
    const form = document.getElementById("dose-unit-settings-form");
    const reset = document.getElementById("dose-unit-reset");
    if (form && !form.__seuilBound) {
        form.__seuilBound = true;
        document.getElementById("dose-unit-settings-form").addEventListener("submit", saveDoseUnitSettings);
    }
    if (reset && !reset.__seuilBound) {
        reset.__seuilBound = true;
        document.getElementById("dose-unit-reset").addEventListener("click", resetDoseUnitSettings);
    }
}

function refreshDynamicViewsOnReturn() {
    if (!appInitialized) return;

    renderDashboard();
    renderStats();
    if (appState.activeSession) {
        resumeActiveSession();
    }
}

window.addEventListener("pageshow", refreshDynamicViewsOnReturn);
window.addEventListener("focus", refreshDynamicViewsOnReturn);
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        refreshDynamicViewsOnReturn();
    }
});

// Exposé pour auth.js - appelé après une connexion réussie depuis l'écran d'authentification.
window.onAuthSuccess = initApp;

// Affiche une bannière d'erreur sur l'écran d'authentification (utile quand bindAuthUI casse).
function showBootError(message) {
    try {
        const slots = ["login-error", "signup-error"];
        slots.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = message;
                el.classList.add("visible");
            }
        });
        // S'assure que l'écran d'auth est visible même si tout le reste a foiré.
        document.body.classList.remove("auth-booting");
        document.body.classList.add("auth-locked");
        const auth = document.getElementById("auth-screen");
        if (auth) auth.classList.remove("hidden");
    } catch (_) { /* dernier recours : log uniquement */ }
    console.error("[Seuil] boot error:", message);
}

document.addEventListener("DOMContentLoaded", async () => {
    // 0. Service Worker enregistré le plus tôt possible (avant même l'auth) pour que les
    //    mises à jour de cache se propagent depuis l'écran de connexion.
    registerServiceWorker();

    if (!window.SeuilAuth) {
        // Repli : si auth.js n'a pas été chargé (cache obsolète), continuer en mode mono-coffre.
        try { await initApp(); } catch (e) { console.error(e); showBootError("Erreur de chargement (auth.js manquant). Rechargez la page (Ctrl+Maj+R)."); }
        return;
    }

    try {
        SeuilAuth.bindAuthUI();
    } catch (err) {
        console.error("[Seuil] bindAuthUI() a échoué :", err);
        showBootError("Écran de connexion indisponible. Rechargez la page (Ctrl+Maj+R).");
        return;
    }

    let result;
    try {
        result = await SeuilAuth.boot();
        // Rafraîchit l'état de l'écran d'auth avec les paramètres serveur
        // récupérés pendant boot(), sans rebinder les écouteurs.
        SeuilAuth.bindAuthUI();
    } catch (err) {
        console.error("[Seuil] SeuilAuth.boot() a échoué :", err);
        showBootError(err && err.message ? `Initialisation impossible : ${err.message}` : "Initialisation impossible. Rechargez la page (Ctrl+Maj+R).");
        try { SeuilAuth.showAuthScreen(); } catch (_) {}
        return;
    }

    if (result.authenticated && !result.locked) {
        SeuilAuth.renderSidebarUser();
        try {
            await initApp();
            SeuilAuth.applyRoleClasses();
        } catch (err) {
            console.error("[Seuil] initApp() a échoué :", err);
            showBootError("Chargement du tableau de bord impossible.");
        }
    } else if (result.authenticated && result.locked) {
        // Session serveur valide mais clé de coffre absente dans cet onglet :
        // l'utilisateur déverrouille avec son mot de passe (aucun aller-retour réseau).
        SeuilAuth.showAuthScreen("locked");
    } else {
        SeuilAuth.showAuthScreen();
    }
});


function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    function isAuthSurfaceVisible() {
        return !!(document.body && document.body.classList && (
            document.body.classList.contains("auth-locked") ||
            document.body.classList.contains("auth-booting")
        ));
    }
    // Rechargement automatique quand un nouveau service worker prend le contrôle.
    // Évite que l'utilisateur reste bloqué sur d'anciens assets après une mise à jour
    // (ex. : nouvelle version de auth.js ou app.js).
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloading) return;
        if (isAuthSurfaceVisible()) return;
        reloading = true;
        window.location.reload();
    });
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js?v=2.3.119")
            .then((reg) => {
                // Tenter d'attraper une mise à jour en cours
                if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
                reg.addEventListener("updatefound", () => {
                    const newSW = reg.installing;
                    if (!newSW) return;
                    newSW.addEventListener("statechange", () => {
                        if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                            // Nouvelle version installée pendant qu'un SW contrôlait déjà la page
                            newSW.postMessage({ type: "SKIP_WAITING" });
                        }
                    });
                });
            })
            .catch((err) => {
                console.info("Service worker non initialisé :", err);
            });
    });
}

// --- CHIFFREMENT & SECURITE (WebCrypto API) ---

// Dérivée de clé PBKDF2 + Chiffrement AES-GCM
async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// Convertit un ArrayBuffer en chaîne Hexadécimale
function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Convertit une chaîne Hexadécimale en ArrayBuffer
function hexToBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes.buffer;
}

// Chiffre une chaîne de texte
async function encryptText(text, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const key = await deriveKey(password, salt);
    
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );
    
    // Format de stockage: salt(32hex) + iv(24hex) + ciphertext(hex)
    return ENCRYPTED_PREFIX + 
           bufferToHex(salt) + ":" + 
           bufferToHex(iv) + ":" + 
           bufferToHex(ciphertext);
}

// Déchiffre une chaîne chiffrée
async function decryptText(encryptedText, password) {
    if (!encryptedText.startsWith(ENCRYPTED_PREFIX)) return encryptedText;
    
    const parts = encryptedText.substring(ENCRYPTED_PREFIX.length).split(":");
    if (parts.length !== 3) throw new Error("Format chiffré invalide");
    
    const salt = hexToBuffer(parts[0]);
    const iv = hexToBuffer(parts[1]);
    const ciphertext = hexToBuffer(parts[2]);
    
    const key = await deriveKey(password, new Uint8Array(salt));
    
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        key,
        ciphertext
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}

// Hache un mot de passe (pour vérification rapide)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return bufferToHex(hashBuffer);
}

// --- COFFRE SERVEUR (session authentifiée, clé de compte zéro-connaissance) ---

let syncErrorNotified = false;

function requireDataKey() {
    const key = window.SeuilAuth ? SeuilAuth.getDataKey() : null;
    if (!key) throw new Error("Clé de coffre indisponible. Reconnectez-vous.");
    return key;
}

function normalizeVaultNetworkError(err) {
    const message = String((err && err.message) || "");
    if (/NetworkError|Failed to fetch|Load failed|Network request failed/i.test(message)) {
        const normalized = new Error("Connexion au serveur impossible. Réessayez dans quelques secondes.");
        normalized.code = "network";
        return normalized;
    }
    return err;
}

async function vaultRequest(method, body) {
    const headers = { "Accept": "application/json", "X-Seuil-Csrf": "1" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const fetchOptions = {
        method,
        headers,
        credentials: "same-origin",
        cache: "no-store",
        body: body !== undefined ? JSON.stringify(body) : undefined
    };
    if (controller) fetchOptions.signal = controller.signal;

    let timer = null;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
            if (controller) controller.abort();
            reject(vaultTimeoutError());
        }, VAULT_TIMEOUT_MS);
    });

    let res;
    try {
        res = await Promise.race([fetch("/api/vault", fetchOptions), timeout]);
    } catch (err) {
        if (err && err.name === "AbortError") throw vaultTimeoutError();
        throw normalizeVaultNetworkError(err);
    } finally {
        if (timer) clearTimeout(timer);
    }
    if (res.status === 401) {
        if (window.SeuilAuth) SeuilAuth.handleSessionExpired();
        throw new Error("Session expirée.");
    }
    let data = null;
    try { data = await res.json(); } catch (_) { /* réponse vide */ }
    if (!res.ok) throw new Error((data && data.error) || `Erreur serveur (${res.status}).`);
    return data || {};
}

async function fetchServerState() {
    const data = await vaultRequest("GET");
    return data.blob || null;
}

async function putServerState(encryptedBlob) {
    await vaultRequest("PUT", { blob: encryptedBlob });
}

async function deleteServerState() {
    await vaultRequest("DELETE", {});
}

async function loadStateFromEncryptedBlob(blob, secret) {
    const decrypted = await decryptText(blob, secret);
    appState = normalizeAppState(JSON.parse(decrypted));
}

function vaultTimeoutError() {
    const err = new Error("Le coffre serveur met trop de temps à répondre. Rechargez la page.");
    err.code = "timeout";
    return err;
}

// Charger et décoder les données
async function loadLocalData() {
    // Très anciennes données locales (stockage pré-comptes) : migrées dans le
    // coffre serveur du compte au premier chargement, puis purgées.
    const legacyRawData = localStorage.getItem(STORAGE_KEY);

    try {
        const secret = requireDataKey();
        const serverBlob = await fetchServerState();

        if (serverBlob) {
            await loadStateFromEncryptedBlob(serverBlob, secret);
            localStorage.removeItem(STORAGE_KEY);
            document.getElementById("lock-screen").classList.add("hidden");
            return;
        }

        if (legacyRawData) {
            await loadLegacyLocalData(legacyRawData);
            await saveLocalData();
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        appState = createDefaultAppState();
        await saveLocalData();
    } catch (err) {
        console.error("Erreur de chargement du coffre serveur:", err);
        appState = createDefaultAppState();
        if (window.SeuilUI) {
            SeuilUI.toast(tx("Le coffre serveur est indisponible : les modifications ne seront pas sauvegardées."), { type: "error", duration: 8000 });
        }
    }
}

async function loadLegacyLocalData(rawData) {
    if (!rawData) {
        appState = createDefaultAppState();
        return;
    }

    if (rawData.startsWith(ENCRYPTED_PREFIX)) {
        document.getElementById("lock-screen").classList.remove("hidden");
        return new Promise((resolve) => {
            const btnUnlock = document.getElementById("btn-unlock");
            const inputPass = document.getElementById("lock-password");
            const errorText = document.getElementById("lock-error");

            async function attemptUnlock() {
                const pass = inputPass.value;
                try {
                    const decrypted = await decryptText(rawData, pass);
                    appState = normalizeAppState(JSON.parse(decrypted));
                    currentPassword = pass;
                    document.getElementById("lock-screen").classList.add("hidden");
                    btnUnlock.removeEventListener("click", attemptUnlock);
                    inputPass.removeEventListener("keypress", handleKey);
                    resolve();
                } catch (e) {
                    console.error(e);
                    errorText.style.display = "block";
                    inputPass.value = "";
                }
            }

            function handleKey(e) {
                if (e.key === "Enter") attemptUnlock();
            }

            btnUnlock.addEventListener("click", attemptUnlock);
            inputPass.addEventListener("keypress", handleKey);
        });
    }

    appState = normalizeAppState(JSON.parse(rawData));
    document.getElementById("lock-screen").classList.add("hidden");
}

// Sauvegarder l'état courant
async function saveLocalData() {
    try {
        const secret = requireDataKey();
        const serialized = JSON.stringify(normalizeAppState(appState));
        const encrypted = await encryptText(serialized, secret);
        await putServerState(encrypted);
        localStorage.removeItem(STORAGE_KEY);
        syncErrorNotified = false;
    } catch (err) {
        console.error("Erreur lors de la sauvegarde serveur :", err);
        if (!syncErrorNotified && window.SeuilUI) {
            syncErrorNotified = true;
            SeuilUI.toast(tx("Sauvegarde impossible : {message}", { message: tx(err.message || "serveur injoignable.") }), { type: "error", duration: 6000 });
        }
    }
}

// --- ONGLET ROUTING & TAB NAVIGATION ---
function setupTabs() {
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    function activateTab(targetTab, opts = {}) {
        if (!targetTab || !document.getElementById(targetTab) || !canOpenTab(targetTab)) return;

        navItems.forEach(i => i.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));

        const navItem = Array.from(navItems).find(item => item.getAttribute("data-tab") === targetTab);
        if (navItem) navItem.classList.add("active");
        const targetPane = document.getElementById(targetTab);
        if (targetPane) targetPane.classList.add("active");

        if (opts.persist !== false) rememberActiveTab(targetTab);

        // Si on change d'onglet, on rafraîchit les éléments dynamiques
        if (targetTab === "tab-stash") renderStash();
        if (targetTab === "tab-stats") renderStats();
        if (targetTab === "tab-journal") renderDashboard();
        if (targetTab === "tab-guide") renderCompare(); // largeur correcte à l'ouverture
        if (targetTab === "tab-admin" && window.SeuilAuth) SeuilAuth.renderAdminPanel();
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            activateTab(item.getAttribute("data-tab"));
        });
    });

    restoreActiveTab(activateTab);
}

function rememberActiveTab(tabId) {
    try {
        sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tabId);
    } catch (_) {}
}

function getRememberedActiveTab() {
    try {
        return sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || "";
    } catch (_) {
        return "";
    }
}

function canOpenTab(tabId) {
    return tabId !== "tab-admin" || (window.SeuilAuth && SeuilAuth.isAdmin());
}

function restoreActiveTab(activateTab) {
    const remembered = getRememberedActiveTab();
    if (remembered && document.getElementById(remembered) && canOpenTab(remembered)) {
        activateTab(remembered, { persist: false });
    }
}

// --- INITIALISATION DES DONNÉES DE SUBSTANCES ---
function populateSubstanceSelects() {
    const subSelect = document.getElementById("substance-select");
    const stashSelect = document.getElementById("stash-substance-select");
    const currentSubstance = subSelect.value;
    const currentStash = stashSelect.value;
    
    // Vider les options sauf la première
    subSelect.innerHTML = translatedEmptyOption("Sélectionnez...");
    stashSelect.innerHTML = translatedEmptyOption("Sélectionnez...");

    // Ajouter les substances (standards + personnalisées)
    const mergedDb = getMergedSubstanceDb();
    getSortedSubstanceKeys(mergedDb).forEach((key) => {
        const sub = mergedDb[key];
        
        const opt1 = document.createElement("option");
        opt1.value = key;
        opt1.textContent = displaySubstanceName(sub.name);
        subSelect.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = key;
        opt2.textContent = displaySubstanceName(sub.name);
        stashSelect.appendChild(opt2);
    });

    // Option personnalisée pour le journal
    const customOpt = document.createElement("option");
    customOpt.value = "custom";
    customOpt.textContent = tx("[Autre substance non listée]");
    subSelect.appendChild(customOpt);

    selectValueIfAvailable(subSelect, currentSubstance);
    selectValueIfAvailable(stashSelect, currentStash);
    syncStartSessionRouteToSelected();
}

// --- JOURNAL DE SESSION ---

function renderDashboard() {
    const setupDiv = document.getElementById("session-setup");
    const activeDiv = document.getElementById("active-session");
    
    if (appState.activeSession) {
        setupDiv.style.display = "none";
        activeDiv.style.display = "block";
        
        // Remplir les données de la session active
        const session = appState.activeSession;
        const mergedDb = getMergedSubstanceDb();
        const subInfo = mergedDb[session.substanceKey];
        
        const titleEl = document.getElementById("active-substance-title");
        const badgeEl = document.getElementById("active-substance-badge");
        const doseEl = document.getElementById("active-cumulative-dose");
        const startTimeEl = document.getElementById("active-start-time");
        
        titleEl.textContent = displaySubstanceName(session.substanceName);
        doseEl.textContent = formatCumulativeDoseDisplay(session.logs, session.unit);
        
        // Formater heure de départ
        const startDate = new Date(session.startTime);
        if (startTimeEl) startTimeEl.textContent = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Gérer le badge de classe
        if (subInfo) {
            badgeEl.textContent = tx(subInfo.category);
            badgeEl.className = `substance-badge badge-${subInfo.class}`;
        } else {
            badgeEl.textContent = tx("Fiche personnalisée");
            badgeEl.className = `substance-badge badge-other`;
        }

        renderLiveLogFeed();
        renderActiveSubstances();
    } else {
        setupDiv.style.display = "block";
        activeDiv.style.display = "none";
        effectCurveProbe = { active: false, pct: null };
        renderLiveLogFeed();
        renderActiveSubstances();
    }

    renderHistory();
}

// Gère le changement d'unité dynamique selon la substance sélectionnée
document.getElementById("substance-select").addEventListener("change", (e) => {
    const val = e.target.value;
    const customInput = document.getElementById("input-custom-substance");
    const routeSelect = document.getElementById("route-select");
    let unit = "mg";

    if (val === "custom") {
        customInput.disabled = false;
        customInput.required = true;
    } else if (val) {
        customInput.disabled = true;
        customInput.value = "";
        customInput.required = false;
        const mergedDb = getMergedSubstanceDb();
        unit = mergedDb[val].dosages.unit;
    } else {
        customInput.disabled = true;
    }
    populateDoseUnitSelect(document.getElementById("unit-select"), unit);
    syncStartSessionRouteToSelected();
    updateDosageBadge();
});

document.getElementById("stash-substance-select").addEventListener("change", (e) => {
    const val = e.target.value;
    const unitInput = document.getElementById("stash-unit-display");
    const mergedDb = getMergedSubstanceDb();
    if (val && mergedDb[val]) {
        unitInput.value = mergedDb[val].dosages.unit;
    }
});

// Lancement de la session
document.getElementById("form-start-session").addEventListener("submit", async (e) => {
    e.preventDefault();

    const subKey = document.getElementById("substance-select").value;
    const customName = document.getElementById("input-custom-substance").value.trim();
    const inputDosage = parseFloat(document.getElementById("input-dosage").value);
    const doseUnit = document.getElementById("unit-select").value;
    const route = document.getElementById("route-select").value;
    const setSetting = document.getElementById("input-set-setting").value;
    const notes = document.getElementById("input-session-notes").value.trim();
    const deductStash = document.getElementById("check-deduct-stash").checked;

    let subName = "";
    let unit = "mg";

    const mergedDb = getMergedSubstanceDb();
    if (subKey === "custom") {
        subName = customName || "Substance non renseignée";
        unit = "mg";
    } else {
        subName = mergedDb[subKey].name;
        unit = mergedDb[subKey].dosages.unit;
    }
    const dosage = convertDoseToReferenceUnit(inputDosage, doseUnit, unit);
    const inputDoseLabel = formatInputDoseLabel(inputDosage, doseUnit);
    const curveDose = dosage === null ? inputDosage : dosage;

    let startTime = Date.now();
    const timeType = document.getElementById("input-time-type").value;
    if (timeType === "past") {
        const pastTimeVal = document.getElementById("input-past-time").value;
        if (pastTimeVal) {
            // datetime-local (YYYY-MM-DDTHH:MM:SS) interprété en heure locale
            const calculatedDate = new Date(pastTimeVal);
            if (!isNaN(calculatedDate.getTime())) {
                // On ne peut pas avoir pris une substance dans le futur : on borne à maintenant
                startTime = Math.min(calculatedDate.getTime(), Date.now());
            }
        }
    }

    // Créer la session active
    effectCurveProbe = { active: false, pct: null };
    appState.activeSession = {
        substanceKey: subKey,
        substanceName: subName,
        initialDose: dosage,
        cumulativeDose: dosage,
        unit: unit,
        route: route,
        setSetting: setSetting,
        startTime: startTime,
        endTime: null,
        extraSubstances: [],
        logs: [
            {
                time: startTime,
                type: "dose",
                dose: dosage,
                curveDose,
                inputAmount: inputDosage,
                inputUnit: doseUnit,
                doseLabel: inputDoseLabel,
                route: route,
                note: `Dose initiale consignée : ${inputDoseLabel}, voie ${route.toLowerCase()}. État mental / environnement : ${setSetting}. ${notes ? 'Contexte : ' + notes : ''}`
            }
        ]
    };

    // Déduire du stash si nécessaire
    if (deductStash && subKey !== "custom" && dosage !== null) {
        deductFromStash(subKey, dosage);
    }

    await saveLocalData();
    
    // Réinitialiser le formulaire
    document.getElementById("form-start-session").reset();
    document.getElementById("input-custom-substance").disabled = true;
    document.getElementById("group-past-time").style.display = "none";
    document.getElementById("dosage-level-badge").textContent = "";
    document.getElementById("dosage-level-badge").className = "";

    // Lancer le timer
    resumeActiveSession();
    renderDashboard();
});

// Relancer ou lancer le timer interval
function resumeActiveSession() {
    if (appState.activeSession && !Array.isArray(appState.activeSession.extraSubstances)) {
        appState.activeSession.extraSubstances = []; // rétro-compat des anciennes sessions
    }
    if (activeTimerInterval) clearInterval(activeTimerInterval);
    
    updateActiveTimerDisplay();
    activeTimerInterval = setInterval(updateActiveTimerDisplay, 1000);
}

// Mise à jour de l’affichage du minuteur de session active (toutes les secondes)
async function updateActiveTimerDisplay() {
    if (!appState.activeSession) {
        if (activeTimerInterval) clearInterval(activeTimerInterval);
        return;
    }

    if (await autoCloseSessionIfEffectsEnded()) return;
    if (!appState.activeSession) return;

    const startTime = appState.activeSession.startTime;
    const elapsedMs = Date.now() - startTime;
    
    const hours = Math.floor(elapsedMs / 3600000).toString().padStart(2, "0");
    const minutes = Math.floor((elapsedMs % 3600000) / 60000).toString().padStart(2, "0");
    const seconds = Math.floor((elapsedMs % 60000) / 1000).toString().padStart(2, "0");

    document.getElementById("active-timer").textContent = `${hours}:${minutes}:${seconds}`;

    // Mettre à jour la timeline et l'estimation de phase
    updateTimelinePhases();
    updateActiveSubstanceIntensityLabels();
}

// Modélisation pharmacocinétique simplifiée (Bateman à compartiment unique)
function getDoseCurveValue(doseVal, route, elapsedSeconds, subInfo) {
    if (elapsedSeconds < 0 || !subInfo) return 0;
    const durations = getDurationsForRoute(subInfo, route);
    const modeledDose = doseVal * getRouteExposureFactor(subInfo, route);
    
    // Valeurs par défaut si non définies (ex: substance custom basique)
    const tOnset = durations ? durations.onset : 1800;          // 30 min
    const tComeup = durations ? durations.comeup : 1800;        // 30 min
    const tPeak = durations ? durations.peak : 7200;            // 2 h
    const tOffset = durations ? durations.offset : 7200;        // 2 h

    const tPeakStart = tOnset + tComeup;
    const tPeakEnd = tPeakStart + tPeak;
    const tDescentEnd = tPeakEnd + tOffset;

    if (elapsedSeconds < tOnset) {
        // Phase 1 : Début de montée (quadratique)
        const ratio = elapsedSeconds / tOnset;
        return modeledDose * 0.1 * ratio * ratio;
    } else if (elapsedSeconds < tPeakStart) {
        // Phase 2 : Montée rapide (sinusoïdale de 10% à 100%)
        const ratio = (elapsedSeconds - tOnset) / tComeup;
        return modeledDose * (0.1 + 0.9 * Math.sin(ratio * Math.PI / 2));
    } else if (elapsedSeconds < tPeakEnd) {
        // Phase 3 : Plein plateau
        return modeledDose;
    } else if (elapsedSeconds < tDescentEnd) {
        // Phase 4 : Descente (de 100% à 15%)
        const ratio = (elapsedSeconds - tPeakEnd) / tOffset;
        return modeledDose * (1.0 - 0.85 * Math.sin(ratio * Math.PI / 2));
    } else {
        // Phase 5 : Afterglow (décroissance exponentielle)
        const dt = elapsedSeconds - tDescentEnd;
        const lambda = Math.max(tOffset, 3600); // Taux d'élimination
        return modeledDose * 0.15 * Math.exp(-dt / lambda);
    }
}

function getDurationCurveEndSeconds(durations) {
    if (!durations) return 0;
    const phaseEnd = Number(durations.onset || 0)
        + Number(durations.comeup || 0)
        + Number(durations.peak || 0)
        + Number(durations.offset || 0);
    return Math.max(Number(durations.total || 0), phaseEnd);
}

function getSessionSubstancesForEffects(session) {
    if (!session) return [];
    const db = getMergedSubstanceDb();
    const substances = [{
        key: session.substanceKey,
        route: session.route,
        logs: session.logs,
        subInfo: db[session.substanceKey]
    }];
    (session.extraSubstances || []).forEach((ex) => {
        substances.push({
            key: ex.key,
            route: ex.route,
            logs: ex.logs,
            subInfo: db[ex.key]
        });
    });
    return substances;
}

function getSessionEffectEndInfo(session) {
    const fallbackStart = Number(session && session.startTime) || Date.now();
    let latestEnd = fallbackStart;
    let hasDose = false;
    let allKnown = true;

    getSessionSubstancesForEffects(session).forEach((sub) => {
        getDoseLogs(sub.logs).forEach((log) => {
            hasDose = true;
            if (!sub.subInfo || !sub.subInfo.durations_seconds) {
                allKnown = false;
                return;
            }
            const route = log.route || sub.route || (session && session.route) || "Oral";
            const durations = getDurationsForRoute(sub.subInfo, route);
            const durationSeconds = getDurationCurveEndSeconds(durations);
            const logTime = Number(log.time) || fallbackStart;
            if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
                allKnown = false;
                return;
            }
            latestEnd = Math.max(latestEnd, logTime + durationSeconds * 1000);
        });
    });

    return {
        known: hasDose && allKnown,
        hasDose,
        endTime: latestEnd
    };
}

async function closeActiveSession(notes, options = {}) {
    if (!appState.activeSession) return false;
    const session = appState.activeSession;
    session.logs = Array.isArray(session.logs) ? session.logs : [];
    const requestedEndTime = Number(options.endTime);
    session.endTime = Number.isFinite(requestedEndTime) && requestedEndTime > 0 ? requestedEndTime : Date.now();
    const finalNotes = notes || tx("Aucun commentaire ajouté.");
    session.logs.push({
        time: session.endTime,
        type: "end",
        note: tx("Session clôturée. Bilan : {notes}", { notes: finalNotes })
    });

    appState.sessions.unshift(session);
    appState.activeSession = null;
    effectCurveProbe = { active: false, pct: null };

    if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
        activeTimerInterval = null;
    }

    await saveLocalData();
    renderDashboard();
    renderStats();
    return true;
}

async function autoCloseSessionIfEffectsEnded() {
    if (autoCloseInProgress || !appState.activeSession) return false;
    const effectEnd = getSessionEffectEndInfo(appState.activeSession);
    if (!effectEnd.known || !effectEnd.endTime || Date.now() < effectEnd.endTime) return false;

    autoCloseInProgress = true;
    try {
        return await closeActiveSession(tx("Clôture automatique : fin estimée des effets atteinte."), {
            endTime: effectEnd.endTime
        });
    } finally {
        autoCloseInProgress = false;
    }
}

// Calcule la concentration totale cumulée à un instant absolu T
function getCumulativeConcentration(session, absoluteTime, subInfo) {
    let total = 0;
    const doseLogs = session.logs.filter(l => l.type === "dose" || l.type === "redose");
    doseLogs.forEach(log => {
        const elapsedSeconds = (absoluteTime - log.time) / 1000;
        total += getDoseCurveValue(getCurveDoseValue(log), log.route || session.route, elapsedSeconds, subInfo);
    });
    return total;
}

// Renvoie toutes les substances suivies de la session active : primaire + extras, avec infos d'affichage.
function getActiveSubstances() {
    const session = appState.activeSession;
    if (!session) return [];
    const db = getMergedSubstanceDb();
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#6E8BFF";
    const list = [{
        key: session.substanceKey, name: session.substanceName, unit: session.unit,
        route: session.route,
        logs: session.logs, subInfo: db[session.substanceKey], color: primaryColor, primary: true
    }];
    (session.extraSubstances || []).forEach((ex, extraIndex) => {
        list.push({
            key: ex.key, name: ex.name, unit: ex.unit, route: ex.route, logs: ex.logs,
            subInfo: db[ex.key],
            color: (typeof getClassColorCompare === "function" ? getClassColorCompare((db[ex.key] || {}).class) : "#8A94A8"),
            primary: false,
            extraIndex
        });
    });
    return list;
}

function getSubstanceIntensityEstimate(substance, absoluteTime) {
    if (!substance || !substance.subInfo || !substance.subInfo.durations_seconds) {
        return { known: false, percent: null };
    }
    const logs = getDoseLogs(substance.logs);
    if (!logs.length) return { known: false, percent: null };

    const fallbackTime = Number(absoluteTime) || Date.now();
    const startTime = getEarliestDoseTime(logs, fallbackTime);
    let endTime = startTime;
    let known = true;

    logs.forEach((log) => {
        const route = log.route || substance.route || "Oral";
        const durations = getDurationsForRoute(substance.subInfo, route);
        const durationSeconds = getDurationCurveEndSeconds(durations);
        const logTime = Number(log.time) || startTime;
        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
            known = false;
            return;
        }
        endTime = Math.max(endTime, logTime + durationSeconds * 1000);
    });

    if (!known || endTime <= startTime) return { known: false, percent: null };

    const sampleStart = Math.min(startTime, fallbackTime);
    const sampleEnd = Math.max(endTime, fallbackTime) + 5400 * 1000;
    const sampleCount = 64;
    let maxConcentration = 0;
    for (let i = 0; i < sampleCount; i++) {
        const t = sampleStart + ((sampleEnd - sampleStart) * i) / (sampleCount - 1);
        const concentration = getCumulativeConcentration(
            { logs, route: substance.route || "Oral" },
            t,
            substance.subInfo
        );
        if (concentration > maxConcentration) maxConcentration = concentration;
    }

    const currentConcentration = getCumulativeConcentration(
        { logs, route: substance.route || "Oral" },
        fallbackTime,
        substance.subInfo
    );
    const percent = maxConcentration > 0
        ? Math.round(Math.max(0, Math.min(100, (currentConcentration / maxConcentration) * 100)))
        : 0;
    return { known: true, percent };
}

function formatSubstanceIntensityEstimate(substance, absoluteTime) {
    const estimate = getSubstanceIntensityEstimate(substance, absoluteTime);
    return estimate.known
        ? `${tx("Intensité estimée")} ${estimate.percent}%`
        : tx("Intensité indisponible");
}

function getActiveSubstanceIntensityRows(absoluteTime) {
    return getActiveSubstances().map((substance) => ({
        name: displaySubstanceName(substance.name),
        color: substance.color,
        estimate: getSubstanceIntensityEstimate(substance, absoluteTime)
    }));
}

function updateActiveSubstanceIntensityLabels(absoluteTime = Date.now()) {
    const labels = document.querySelectorAll(".active-sub-intensity");
    if (!labels.length) return;
    const substances = getActiveSubstances();
    labels.forEach((label, index) => {
        const substance = substances[index];
        if (!substance) return;
        label.textContent = formatSubstanceIntensityEstimate(substance, absoluteTime);
    });
}

function isDoseLog(log) {
    return !!log && (log.type === "dose" || log.type === "redose");
}

function getDoseLogs(logs) {
    return (Array.isArray(logs) ? logs : []).filter(isDoseLog);
}

function getFirstDoseLogIndex(logs) {
    return (Array.isArray(logs) ? logs : []).findIndex(isDoseLog);
}

function sumDoseLogs(logs) {
    return parseFloat(getDoseLogs(logs).reduce((total, log) => total + getNumericDoseValue(log), 0).toFixed(2));
}

function getEarliestDoseTime(logs, fallbackTime) {
    const times = getDoseLogs(logs)
        .map(log => Number(log.time))
        .filter(time => Number.isFinite(time));
    return times.length ? Math.min(...times) : fallbackTime;
}

function recalculateActiveSessionDoseFields() {
    const session = appState.activeSession;
    if (!session) return;
    session.logs = Array.isArray(session.logs) ? session.logs : [];
    session.extraSubstances = Array.isArray(session.extraSubstances) ? session.extraSubstances : [];

    const primaryDoseLogs = getDoseLogs(session.logs);
    session.cumulativeDose = sumDoseLogs(session.logs);
    const firstDose = primaryDoseLogs[0];
    if (firstDose) {
        session.initialDose = getNumericDoseValue(firstDose);
        session.route = firstDose.route || session.route || "Oral";
        session.startTime = getEarliestDoseTime(session.logs, session.startTime || Date.now());
    }
}

function renderAfterActiveSessionMutation() {
    if (appState.activeSession) {
        recalculateActiveSessionDoseFields();
    }
    renderDashboard();
    if (appState.activeSession) {
        updateActiveTimerDisplay();
        updateRedoseBadge();
    }
}

function clampEffectCurvePct(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(1, numeric));
}

function formatEffectCurveElapsed(ms) {
    const totalMinutes = Math.max(0, Math.round(Number(ms || 0) / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `T+${hours} h ${String(minutes).padStart(2, "0")} min`;
    return `T+${minutes} min`;
}

function setEffectCurveProbePct(pct) {
    effectCurveProbe.pct = clampEffectCurvePct(pct);
    updateTimelinePhases();
}

function setEffectCurveProbeFromClientX(container, clientX, chartStartTime, chartEndTime, paddingLeft, paddingRight) {
    if (!container || chartEndTime <= chartStartTime) return;
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth || 1;
    const graphWidth = Math.max(1, width - paddingLeft - paddingRight);
    const pct = (clientX - rect.left - paddingLeft) / graphWidth;
    setEffectCurveProbePct(pct);
}

function bindEffectCurveProbe(container, chartStartTime, chartEndTime, paddingLeft, paddingRight) {
    if (!container) return;

    container.onpointerdown = (event) => {
        effectCurveProbe.active = true;
        container.setPointerCapture?.(event.pointerId);
    };

    container.onpointermove = (event) => {
        if (!effectCurveProbe.active) return;
        setEffectCurveProbeFromClientX(container, event.clientX, chartStartTime, chartEndTime, paddingLeft, paddingRight);
    };

    const stopDrag = (event) => {
        effectCurveProbe.active = false;
        effectCurveProbe.pct = null;
        if (event && event.pointerId !== undefined) container.releasePointerCapture?.(event.pointerId);
        updateTimelinePhases();
    };

    container.onpointerup = stopDrag;
    container.onpointercancel = stopDrag;
    container.onpointerleave = (event) => {
        if (effectCurveProbe.active && event.buttons) return;
        stopDrag(event);
    };

    container.onkeydown = (event) => {
        const current = effectCurveProbe.pct === null ? Number(container.dataset.probePct || 0) : effectCurveProbe.pct;
        const step = event.shiftKey ? 0.1 : 0.025;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            setEffectCurveProbePct(current - step);
        } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            setEffectCurveProbePct(current + step);
        } else if (event.key === "Home") {
            event.preventDefault();
            setEffectCurveProbePct(0);
        } else if (event.key === "End") {
            event.preventDefault();
            setEffectCurveProbePct(1);
        } else if (event.key === "Escape") {
            event.preventDefault();
            effectCurveProbe.pct = null;
            updateTimelinePhases();
        }
    };
}

// Calculer et dessiner la timeline dynamique sous forme de courbe 2D
function updateTimelinePhases() {
    const session = appState.activeSession;
    if (!session) return;

    const mergedDb = getMergedSubstanceDb();
    const subInfo = mergedDb[session.substanceKey];
    
    const container = document.getElementById("active-curve-container");
    const phaseNameText = document.getElementById("active-phase-name");
    const endTimeText = document.getElementById("active-end-time");

    if (!container) return;

    if (!subInfo || !subInfo.durations_seconds) {
        // Substance personnalisée sans durées, afficher message par défaut
        container.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding-top: 45px; font-size: 13px;">${escapeHtml(tx("Courbe estimative indisponible pour cette fiche personnalisée : renseignez des durées fiables pour obtenir un repère."))}</p>`;
        if (phaseNameText) phaseNameText.textContent = tx("Phase : non renseignée");
        if (endTimeText) endTimeText.textContent = tx("Indéterminée");
        renderLiveSafety(false);
        return;
    }

    // 1. Calculer les temps limites du graphique (X-axis)
    const doseLogs = session.logs.filter(l => l.type === "dose" || l.type === "redose");
    const latestDose = doseLogs[doseLogs.length - 1]; // Prise la plus récente
    
    const effectEnd = getSessionEffectEndInfo(session);
    let maxExpectedEnd = effectEnd.hasDose ? effectEnd.endTime : session.startTime;
    doseLogs.forEach(log => {
        const route = log.route || session.route || "default";
        const durations = getDurationsForRoute(subInfo, route);
        const expectedEnd = log.time + (getDurationCurveEndSeconds(durations) * 1000);
        if (expectedEnd > maxExpectedEnd) {
            maxExpectedEnd = expectedEnd;
        }
    });

    // On s'assure d'inclure au moins le temps présent
    const nowTime = Date.now();
    const chartStartTime = session.startTime;
    // On ajoute 1h30 de marge après la fin estimée pour observer le déclin
    const chartEndTime = Math.max(maxExpectedEnd, nowTime) + (5400 * 1000); 

    // 2. Échantillonner la courbe de concentration cumulée
    const numPoints = 80;
    const timeStep = (chartEndTime - chartStartTime) / (numPoints - 1);
    const points = [];
    let maxConcentration = 1;

    for (let i = 0; i < numPoints; i++) {
        const t = chartStartTime + (i * timeStep);
        const conc = getCumulativeConcentration(session, t, subInfo);
        points.push({ time: t, conc: conc });
        if (conc > maxConcentration) {
            maxConcentration = conc;
        }
    }

    // 3. Calculer les coordonnées de dessin SVG
    const width = container.clientWidth || 500;
    const height = 120;
    const paddingLeft = 10;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 15;
    const effectCurveAxisLabelFontSize = 12;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    // Construire le chemin SVG (path)
    let pathData = "";
    points.forEach((pt, idx) => {
        const x = paddingLeft + (idx / (numPoints - 1)) * graphWidth;
        const y = paddingTop + graphHeight - (pt.conc / maxConcentration) * graphHeight;
        if (idx === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });

    // Coordonnées du curseur "Maintenant"
    const pctNow = Math.min(Math.max((nowTime - chartStartTime) / (chartEndTime - chartStartTime), 0), 1);
    const nowX = paddingLeft + pctNow * graphWidth;
    const nowConc = getCumulativeConcentration(session, nowTime, subInfo);
    const nowY = paddingTop + graphHeight - (nowConc / maxConcentration) * graphHeight;

    const probeHasReadout = effectCurveProbe.pct !== null;
    const probePct = probeHasReadout ? clampEffectCurvePct(effectCurveProbe.pct) : pctNow;
    const probeTime = chartStartTime + probePct * (chartEndTime - chartStartTime);
    const probeConc = getCumulativeConcentration(session, probeTime, subInfo);
    const probeX = paddingLeft + probePct * graphWidth;
    const probeY = paddingTop + graphHeight - (probeConc / maxConcentration) * graphHeight;
    const probeClock = new Date(probeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const probeElapsed = formatEffectCurveElapsed(probeTime - session.startTime);
    const probeIntensityRows = getActiveSubstanceIntensityRows(probeTime);
    const primaryProbeEstimate = probeIntensityRows[0] && probeIntensityRows[0].estimate;
    const probeIntensity = primaryProbeEstimate && primaryProbeEstimate.known
        ? primaryProbeEstimate.percent
        : Math.round(Math.max(0, Math.min(100, (probeConc / maxConcentration) * 100)));
    const readoutLeft = Math.min(Math.max(probeX, 78), Math.max(78, width - 78));
    const readoutTop = Math.min(Math.max(probeY - 44, 4), Math.max(4, height - 52));
    const probeSubstanceRowsHtml = probeIntensityRows.length > 1 ? `
        <div class="effect-curve-readout-substances">
            ${probeIntensityRows.map(row => `
                <span class="effect-curve-readout-substance">
                    <i style="background:${escapeHtml(row.color)}"></i>
                    ${escapeHtml(row.name)} · ${escapeHtml(row.estimate.known ? `${row.estimate.percent}%` : tx("Intensité indisponible"))}
                </span>
            `).join("")}
        </div>
    ` : "";
    const probeAriaIntensities = probeIntensityRows.length > 1
        ? probeIntensityRows.map(row => `${row.name} ${row.estimate.known ? `${row.estimate.percent}%` : tx("Intensité indisponible")}`).join(", ")
        : `${tx("Intensité estimée")} ${probeIntensity}%`;
    const probeAria = `${tx("Temps exploré")} ${probeClock}, ${probeElapsed}, ${probeAriaIntensities}`;
    const readoutHeight = probeIntensityRows.length > 1
        ? Math.min(108, 52 + probeIntensityRows.length * 18)
        : 52;
    const probeReadoutHtml = probeHasReadout ? `
        <div id="effect-curve-readout" class="effect-curve-readout" style="left: ${readoutLeft}px; top: ${Math.min(readoutTop, Math.max(4, height - readoutHeight - 4))}px;">
            <span class="effect-curve-readout-time">${escapeHtml(probeClock)}</span>
            <span class="effect-curve-readout-elapsed">${escapeHtml(probeElapsed)}</span>
            <span class="effect-curve-readout-intensity">${escapeHtml(tx("Intensité estimée"))} ${probeIntensity}%</span>
            ${probeSubstanceRowsHtml}
        </div>
    ` : "";

    // Déterminer les heures de début et de fin
    const startStr = new Date(chartStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = new Date(chartEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalEndExpectedStr = new Date(maxExpectedEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Courbes des substances additionnelles (normalisées à leur propre max, couleur par classe)
    let extraPaths = "";
    (session.extraSubstances || []).forEach(ex => {
        const exInfo = mergedDb[ex.key];
        if (!exInfo || !exInfo.durations_seconds) return;
        const exColor = (typeof getClassColorCompare === "function") ? getClassColorCompare(exInfo.class) : "#8A94A8";
        let exMax = 1;
        const exVals = [];
        for (let i = 0; i < numPoints; i++) {
            const t = chartStartTime + (i * timeStep);
            const c = getCumulativeConcentration({ logs: ex.logs }, t, exInfo);
            exVals.push(c); if (c > exMax) exMax = c;
        }
        let d = "";
        exVals.forEach((c, idx) => {
            const x = paddingLeft + (idx / (numPoints - 1)) * graphWidth;
            const y = paddingTop + graphHeight - (c / exMax) * graphHeight;
            d += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
        });
        extraPaths += `<path d="${d}" fill="none" stroke="${exColor}" stroke-width="2" opacity="0.85" />`;
    });

    // Dessiner le SVG
    let svgHtml = `
        <svg class="chart-svg" width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
            <!-- Dégradé néon sous la courbe -->
            <defs>
                <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0"/>
                </linearGradient>
            </defs>

            <rect class="effect-curve-hit-zone" x="0" y="0" width="${width}" height="${height}" rx="12" />

            <!-- Ligne de base -->
            <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" />

            ${extraPaths}

            <!-- Remplissage sous la courbe -->
            <path d="${pathData} L ${width - paddingRight} ${height - paddingBottom} L ${paddingLeft} ${height - paddingBottom} Z" fill="url(#curve-gradient)" />

            <!-- Ligne de la courbe principale -->
            <path d="${pathData}" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 1px 5px var(--color-primary-glow));" />

            <!-- Ligne verticale "Maintenant" -->
            <line x1="${nowX}" y1="${paddingTop}" x2="${nowX}" y2="${height - paddingBottom}" stroke="rgba(255, 255, 255, 0.18)" stroke-dasharray="3 3" />

            <!-- Curseur statique "Maintenant" -->
            <circle cx="${nowX}" cy="${nowY}" r="8" fill="var(--color-primary)" opacity="0.18" />
            <circle cx="${nowX}" cy="${nowY}" r="4" fill="#ffffff" stroke="var(--color-primary)" stroke-width="2" />

            <line class="effect-curve-probe-line" x1="${probeX}" y1="${paddingTop}" x2="${probeX}" y2="${height - paddingBottom}" />
            <g id="effect-curve-probe" class="effect-curve-probe" transform="translate(${probeX} ${probeY})">
                <circle r="12" class="effect-curve-probe-halo" />
                <circle r="5.5" class="effect-curve-probe-dot" />
                <circle r="2" class="effect-curve-probe-core" />
            </g>

            <!-- Textes des heures limites -->
            <text x="${paddingLeft}" y="${height - 2}" fill="var(--color-text-muted)" font-size="${effectCurveAxisLabelFontSize}" text-anchor="start">${startStr}</text>
            <text x="${width - paddingRight}" y="${height - 2}" fill="var(--color-text-muted)" font-size="${effectCurveAxisLabelFontSize}" text-anchor="end">${endStr}</text>
        </svg>
        ${probeReadoutHtml}
    `;

    container.innerHTML = svgHtml;
    container.dataset.probePct = String(probePct);
    container.setAttribute("role", "slider");
    container.setAttribute("tabindex", "0");
    container.setAttribute("aria-label", tx("Explorer la courbe des effets"));
    container.setAttribute("aria-valuemin", "0");
    container.setAttribute("aria-valuemax", "100");
    container.setAttribute("aria-valuenow", String(Math.round(probePct * 100)));
    container.setAttribute("aria-valuetext", probeAria);
    bindEffectCurveProbe(container, chartStartTime, chartEndTime, paddingLeft, paddingRight);
    if (endTimeText) endTimeText.textContent = finalEndExpectedStr;

    // 4. Calculer la phase de manière objective basée sur la forme de la courbe pharmacocinétique cumulée
    let maxPastConc = nowConc;
    let maxFutureConc = nowConc;

    points.forEach(pt => {
        if (pt.time <= nowTime) {
            if (pt.conc > maxPastConc) maxPastConc = pt.conc;
        } else {
            if (pt.conc > maxFutureConc) maxFutureConc = pt.conc;
        }
    });

    // Détecter si la courbe globale est en phase ascendante (montée de plus de 5% dans le futur)
    const isRising = maxFutureConc > nowConc * 1.05; 

    if (isRising) {
        if (nowConc < 0.15 * maxFutureConc) {
            if (phaseNameText) phaseNameText.textContent = tx("Statut : montée en cours");
        } else if (nowConc < 0.90 * maxFutureConc) {
            if (phaseNameText) phaseNameText.textContent = tx("Statut : montée avancée");
        } else {
            if (phaseNameText) phaseNameText.textContent = tx("Statut : plateau probable");
        }
    } else {
        if (nowConc >= 0.85 * maxPastConc) {
            if (phaseNameText) phaseNameText.textContent = tx("Statut : plateau probable");
        } else if (nowConc >= 0.15 * maxPastConc) {
            if (phaseNameText) phaseNameText.textContent = tx("Statut : descente progressive");
        } else {
            if (phaseNameText) phaseNameText.textContent = tx("Statut : effets résiduels");
        }
    }

    // Le statut de redosage et les conseils sont gérés par le compagnon de sécurité.
    renderLiveSafety(isRising);
}

// ============================================================
// COMPAGNON DE SÉCURITÉ EN DIRECT (verrou de redose + conseils contextuels)
// ============================================================

// Conseils ciblés par grande famille (rédaction Seuil, non prescriptifs).
const SAFETY_TIPS = {
    stimulant: [
        "Hydrate-toi par petites gorgées et fais des pauses au calme.",
        "Surveille ton cœur : si ça s'emballe ou serre dans la poitrine, stop.",
        "Chewing-gum pour les mâchoires ; évite d'enchaîner les redoses."
    ],
    empathogen: [
        "Bois ~250-500 ml d'eau par heure si tu danses - pas plus (risque d'hyponatrémie).",
        "Rafraîchis-toi régulièrement : la surchauffe est le danger principal.",
        "Une seule redose, réduite, et espace-la : la dose cumulée monte vite."
    ],
    psychedelic: [
        "Si l'angoisse monte : change d'environnement, respire lentement, assieds-toi.",
        "Le pic finit toujours par passer - tu ne peux pas « rester coincé ».",
        "Reste dans un lieu sûr, avec une personne de confiance à proximité."
    ],
    dissociative: [
        "Reste assis ou allongé : risque de chute et de perte de coordination.",
        "Loin de l'eau, des escaliers et des hauteurs.",
        "Ne mélange pas avec l'alcool ou les opioïdes (respiration)."
    ],
    depressant: [
        "Ne mélange pas avec l'alcool ni d'autres dépresseurs : risque respiratoire.",
        "Garde une personne sobre à proximité capable d'appeler les secours.",
        "Attends l'effet complet avant tout ajout : les surdoses viennent du cumul."
    ],
    cannabinoid: [
        "Si malaise : assieds-toi/allonge-toi, sucre lent, respire - ça passe.",
        "En comestible, attends au moins 2 h avant d'en reprendre.",
        "Évite d'associer à l'alcool (malaises, vomissements)."
    ],
    other: [
        "Produit peu prévisible : reste dans un lieu sûr et accompagné.",
        "N'enchaîne pas les prises ; attends le retour complet à la normale.",
        "Garde une personne sobre à proximité."
    ]
};

function getSafetyTips(cls) {
    return SAFETY_TIPS[cls] || SAFETY_TIPS.other;
}

// Calcule l'état du verrou de redose à partir de la pharmacocinétique de la dernière prise.
function computeRedoseLock(session, subInfo) {
    const doseLogs = (session.logs || []).filter(l => l.type === "dose" || l.type === "redose");
    const latest = doseLogs[doseLogs.length - 1];
    if (!subInfo || !subInfo.durations_seconds || !latest) {
        return { known: false };
    }
    const route = latest.route || session.route || "default";
    const d = getDurationsForRoute(subInfo, route);
    if (!d) {
        return { known: false };
    }
    const monteeMs = ((d.onset || 0) + (d.comeup || 0)) * 1000;
    const startMs = latest.time;
    const unlockMs = startMs + monteeMs;
    const now = Date.now();
    const remainingMs = unlockMs - now;
    const progress = monteeMs > 0 ? Math.max(0, Math.min(1, (now - startMs) / monteeMs)) : 1;
    return { known: true, locked: remainingMs > 0, remainingMs, progress };
}

function formatCountdown(ms) {
    const totalSec = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h} h ${String(m).padStart(2, "0")} min`;
    if (m > 0) return `${m} min ${String(s).padStart(2, "0")} s`;
    return `${s} s`;
}

function renderLiveSafety(isRisingHint) {
    const session = appState.activeSession;
    const statusEl = document.getElementById("redose-status");
    const tipsEl = document.getElementById("safety-tips");
    if (!session || !statusEl || !tipsEl) return;

    const db = getMergedSubstanceDb();
    const subInfo = db[session.substanceKey];
    const lock = computeRedoseLock(session, subInfo);
    const mainEl = statusEl.querySelector(".redose-status-main");
    const barEl = statusEl.querySelector(".redose-progress span");

    if (!lock.known) {
        statusEl.className = "redose-status neutral";
        if (mainEl) mainEl.innerHTML = `<strong>${escapeHtml(tx("Redose"))}</strong> - ${escapeHtml(tx("courbe indisponible pour cette fiche. Par prudence, attends que les effets soient clairement stabilisés et tiens compte de la dose cumulée."))}`;
        if (barEl) barEl.style.width = "0%";
    } else if (lock.locked || isRisingHint) {
        statusEl.className = "redose-status locked";
        const countdown = lock.locked ? formatCountdown(lock.remainingMs) : tx("quelques minutes");
        if (mainEl) mainEl.innerHTML = `<strong>${escapeHtml(tx("Redose déconseillée"))}</strong> - ${escapeHtml(tx("la montée n'est pas terminée."))} ${escapeHtml(tx("Fenêtre plus sûre dans environ"))} <strong class="mono">${escapeHtml(countdown)}</strong>. ${escapeHtml(tx("Redoser maintenant rend la dose cumulée difficile à maîtriser."))}`;
        if (barEl) barEl.style.width = `${Math.round((lock.progress || 0) * 100)}%`;
    } else {
        statusEl.className = "redose-status open";
        if (mainEl) mainEl.innerHTML = `<strong>${escapeHtml(tx("Montée stabilisée"))}</strong> - ${escapeHtml(tx("si tu redoses, commence bas et tiens compte de la dose cumulée"))} (<span class="mono">${escapeHtml(String(session.cumulativeDose))} ${escapeHtml(session.unit)}</span>).`;
        if (barEl) barEl.style.width = "100%";
    }

    const tips = getSafetyTips(subInfo ? subInfo.class : "other");
    tipsEl.innerHTML = tips.map(t => `<li>${escapeHtml(tx(t))}</li>`).join("");
}

// Ajouter une note en direct durant la session
document.getElementById("btn-add-live-note").addEventListener("click", async () => {
    const noteInput = document.getElementById("input-live-note");
    const text = noteInput.value.trim();
    if (!text || !appState.activeSession) return;

    appState.activeSession.logs.push({
        time: Date.now(),
        type: "note",
        note: text
    });

    await saveLocalData();
    noteInput.value = "";
    renderLiveLogFeed();
});

// Enregistrer une redose durant la session
document.getElementById("form-redose").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amountInput = document.getElementById("input-redose-amount");
    const inputAmount = parseFloat(amountInput.value);
    
    if (!inputAmount || !appState.activeSession) return;

    const session = appState.activeSession;

    // Substance cible du redose (primaire ou additionnelle)
    const targetSel = document.getElementById("redose-target");
    const targetKey = targetSel && targetSel.value ? targetSel.value : session.substanceKey;
    const isPrimary = (targetKey === session.substanceKey);
    const targetExtra = isPrimary ? null : (session.extraSubstances || []).find(x => x.key === targetKey);
    const targetLogs = isPrimary ? session.logs : (targetExtra ? targetExtra.logs : session.logs);
    const targetUnit = isPrimary ? session.unit : (targetExtra ? targetExtra.unit : session.unit);
    const targetName = isPrimary ? session.substanceName : (targetExtra ? targetExtra.name : session.substanceName);
    const amountUnit = document.getElementById("input-redose-unit").value;
    const amount = convertDoseToReferenceUnit(inputAmount, amountUnit, targetUnit);
    const amountLabel = formatInputDoseLabel(inputAmount, amountUnit);
    const curveDose = amount === null ? inputAmount : amount;
    if (isPrimary && amount !== null) session.cumulativeDose += amount;

    let redoseTime = Date.now();
    const rtType = document.getElementById("input-redose-time-type");
    if (rtType && rtType.value === "past") {
        const rtVal = document.getElementById("input-redose-time").value;
        if (rtVal) {
            const d = new Date(rtVal);
            if (!isNaN(d.getTime())) {
                // borné : après le début de la session et jamais dans le futur
                redoseTime = Math.min(Math.max(d.getTime(), session.startTime), Date.now());
            }
        }
    }
    const routeSelect = document.getElementById("input-redose-route");
    const redoseRoute = routeSelect && routeSelect.value ? routeSelect.value : getRouteForTarget(targetKey);
    const targetCumul = targetLogs.filter(l => l.type === "dose" || l.type === "redose").reduce((a, l) => a + getNumericDoseValue(l), 0) + (amount || 0);

    targetLogs.push({
        time: redoseTime,
        type: "redose",
        dose: amount,
        curveDose,
        inputAmount: inputAmount,
        inputUnit: amountUnit,
        doseLabel: amountLabel,
        route: redoseRoute,
        substanceName: isPrimary ? undefined : targetName,
        note: `Dose supplémentaire (${targetName}) : ${amountLabel}, voie ${redoseRoute.toLowerCase()}. Dose cumulée ${targetName} : ${targetCumul} ${targetUnit}.`
    });

    // Déduire du stash si nécessaire
    const deductStash = document.getElementById("check-deduct-stash").checked;
    if (deductStash && targetKey !== "custom" && amount !== null) {
        deductFromStash(targetKey, amount);
    }

    await saveLocalData();
    amountInput.value = "";

    const rtTypeReset = document.getElementById("input-redose-time-type");
    if (rtTypeReset) rtTypeReset.value = "now";
    const rtGroupReset = document.getElementById("group-redose-time");
    if (rtGroupReset) rtGroupReset.style.display = "none";
    const rtInputReset = document.getElementById("input-redose-time");
    if (rtInputReset) rtInputReset.value = "";
    
    document.getElementById("redose-level-badge").textContent = "";
    document.getElementById("redose-level-badge").className = "";

    // Mettre à jour l'affichage
    document.getElementById("active-cumulative-dose").textContent = formatCumulativeDoseDisplay(session.logs, session.unit);
    renderLiveLogFeed();
    renderActiveSubstances();
    updateTimelinePhases();
});

// Clôturer la session active
document.getElementById("btn-end-session").addEventListener("click", async () => {
    if (!appState.activeSession) return;

    const notes = await SeuilUI.prompt({
        title: tx("Clore la session"),
        message: tx("Un bilan honnête rend l'historique réellement utile pour repérer vos habitudes."),
        label: tx("Bilan de fin de session"),
        placeholder: tx("Descente, état physique et mental, sommeil prévu, signaux d'alerte, décision à retenir…"),
        multiline: true,
        confirmLabel: tx("Clore et enregistrer")
    });
    if (notes === null) return; // annulation : la session continue

    await closeActiveSession(notes);
});

// Rendre le feed des logs en direct de la session active
function renderActiveSubstances() {
    if (!appState.activeSession) {
        const el = document.getElementById("active-substances-list");
        if (el) el.innerHTML = "";
        const rt = document.getElementById("redose-target");
        if (rt) rt.innerHTML = "";
        lastRedoseTargetKey = null;
        return;
    }
    const subs = getActiveSubstances();
    const el = document.getElementById("active-substances-list");
    if (el) {
        el.innerHTML = "";
        subs.forEach((s) => {
            const row = document.createElement("div");
            row.className = "active-sub-row";

            const dot = document.createElement("span");
            dot.className = "active-sub-dot";
            dot.style.background = s.color;

            const name = document.createElement("strong");
            name.className = "active-sub-name";
            name.textContent = displaySubstanceName(s.name);

            const cumul = document.createElement("span");
            cumul.className = "active-sub-cumul mono";
            cumul.textContent = formatCumulativeDoseDisplay(s.logs, s.unit);

            const intensity = document.createElement("span");
            intensity.className = "active-sub-intensity";
            intensity.textContent = formatSubstanceIntensityEstimate(s, Date.now());

            const actions = document.createElement("div");
            actions.className = "active-sub-actions";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "active-sub-action";
            editBtn.textContent = tx("Modifier");
            editBtn.addEventListener("click", () => editFirstDoseForSubstance(s));

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "active-sub-action active-sub-action-danger";
            removeBtn.textContent = tx("Retirer");
            removeBtn.addEventListener("click", () => removeActiveSubstance(s));

            actions.appendChild(editBtn);
            actions.appendChild(removeBtn);
            row.appendChild(dot);
            row.appendChild(name);
            row.appendChild(intensity);
            row.appendChild(cumul);
            row.appendChild(actions);
            el.appendChild(row);
        });
    }
    // Peupler le sélecteur de cible du redose (en préservant la sélection)
    const rt = document.getElementById("redose-target");
    if (rt) {
        const prev = rt.value;
        rt.innerHTML = subs.map(s => `<option value="${s.key}">${escapeHtml(displaySubstanceName(s.name))}</option>`).join("");
        if (prev && subs.some(s => s.key === prev)) rt.value = prev;
        if (rt.value !== lastRedoseTargetKey) {
            lastRedoseTargetKey = rt.value;
            syncRedoseRouteToTarget();
            syncRedoseUnitToTarget();
        }
    }
}

function renderLiveLogFeed() {
    const feed = document.getElementById("live-log-feed");
    const emptyMsg = document.getElementById("live-log-empty");
    if (!feed || !emptyMsg) return;
    const session = appState.activeSession;

    // Fusionner les logs de toutes les substances suivies (primaire + additionnelles)
    const subs = getActiveSubstances();
    const multi = subs.length > 1;
    const entries = [];
    subs.forEach(s => (s.logs || []).forEach((log, idx) => entries.push({ log, idx, sub: s })));

    if (!session || !entries.length) {
        feed.innerHTML = "";
        feed.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    feed.style.display = "flex";
    emptyMsg.style.display = "none";
    feed.innerHTML = "";

    entries.sort((a, b) => b.log.time - a.log.time); // plus récent en haut

    entries.forEach(({ log, idx, sub }) => {
        const item = document.createElement("div");
        item.className = "log-item";
        if (log.type === "redose") item.classList.add("redose");

        const timeStr = new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        let title = tx("Note");
        if (log.type === "dose") title = tx("Dose initiale");
        if (log.type === "redose") title = tx("Dose supplémentaire");
        if (log.type === "end") title = tx("Session clôturée");
        const isDose = (log.type === "dose" || log.type === "redose");
        const tag = (multi && isDose) ? ` · ${escapeHtml(displaySubstanceName(sub.name))}` : "";

        const header = document.createElement("div");
        header.className = "log-item-header";
        header.innerHTML = `<strong>${escapeHtml(title)}${tag}</strong><span>${escapeHtml(timeStr)}</span>`;
        const body = document.createElement("div");
        body.textContent = formatLogDisplayText(log, sub, session);
        item.appendChild(header);
        item.appendChild(body);

        if (isDose) {
            const actions = document.createElement("div");
            actions.className = "log-actions";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "log-action-btn";
            editBtn.textContent = tx("Modifier la dose");
            editBtn.addEventListener("click", () => editDose(sub, idx));

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "log-action-btn log-action-danger";
            deleteBtn.textContent = tx("Supprimer la dose");
            deleteBtn.addEventListener("click", () => deleteDoseLog(sub, idx));

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            item.appendChild(actions);
        }
        feed.appendChild(item);
    });
}

// Modifier la quantité d'une dose/redose : recalcule cumul, flux et courbe estimative.
async function editDose(sub, logIndex) {
    const log = sub.logs[logIndex];
    if (!isDoseLog(log)) return;
    const editUnit = log.inputUnit || sub.unit;
    const input = await SeuilUI.prompt({
        title: tx("Modifier la dose"),
        label: tx("Nouvelle quantité ({unit})", { unit: tx(editUnit) }),
        value: log.inputAmount || log.dose,
        confirmLabel: tx("Enregistrer")
    });
    if (input === null) return;
    const val = parseFloat(input);
    if (isNaN(val) || val < 0) { SeuilUI.toast(tx("Quantité invalide."), { type: "error" }); return; }
    const convertedDose = convertDoseToReferenceUnit(val, editUnit, sub.unit);
    if (convertedDose !== null) log.dose = convertedDose;
    else log.dose = null;
    log.curveDose = convertedDose === null ? val : convertedDose;
    log.inputAmount = val;
    log.inputUnit = editUnit;
    log.doseLabel = formatInputDoseLabel(val, editUnit);
    log.note = `Dose ${log.type === "dose" ? "initiale" : "supplémentaire"} (modifiée) : ${log.doseLabel}` + (log.route ? `, voie ${String(log.route).toLowerCase()}` : "") + ".";
    recalculateActiveSessionDoseFields();
    await saveLocalData();
    renderAfterActiveSessionMutation();
}

function editFirstDoseForSubstance(sub) {
    const firstDoseIndex = getFirstDoseLogIndex(sub && sub.logs);
    if (firstDoseIndex === -1) return;
    editDose(sub, firstDoseIndex);
}

async function deleteDoseLog(sub, logIndex) {
    const log = sub && sub.logs ? sub.logs[logIndex] : null;
    if (!isDoseLog(log)) return;

    if (getDoseLogs(sub.logs).length <= 1) {
        await removeActiveSubstance(sub);
        return;
    }

    const ok = await SeuilUI.confirm({
        title: tx("Supprimer la dose"),
        message: tx("Cette dose sera retirée de la chronologie et des courbes."),
        confirmLabel: tx("Supprimer"),
        danger: true
    });
    if (!ok) return;

    sub.logs.splice(logIndex, 1);
    recalculateActiveSessionDoseFields();
    await saveLocalData();
    renderAfterActiveSessionMutation();
}

async function removeActiveSubstance(sub) {
    const session = appState.activeSession;
    if (!session || !sub) return;

    const extras = Array.isArray(session.extraSubstances) ? session.extraSubstances : [];
    const name = displaySubstanceName(sub.name);
    let title = tx("Retirer du suivi");
    let message = tx("Cette substance et ses doses seront retirées du suivi en cours.");

    if (sub.primary && extras.length > 0) {
        title = tx("Retirer la substance principale");
        message = tx("La substance principale sera retirée. La prochaine substance suivie deviendra principale.");
    } else if (sub.primary) {
        title = tx("Retirer la dernière substance ?");
        message = tx("Cette action annulera le suivi en cours sans l'ajouter à l'historique.");
    }

    const ok = await SeuilUI.confirm({
        title,
        message: tx("{name} : {message}", { name, message }),
        confirmLabel: tx("Retirer"),
        danger: true
    });
    if (!ok) return;

    if (sub.primary) {
        if (extras.length > 0) {
            const next = extras.shift();
            session.substanceKey = next.key;
            session.substanceName = next.name;
            session.unit = next.unit;
            session.route = next.route || getLastDoseRoute(next.logs, session.route || "Oral");
            session.logs = Array.isArray(next.logs) ? next.logs : [];
            session.extraSubstances = extras;
            recalculateActiveSessionDoseFields();
        } else {
            appState.activeSession = null;
            if (activeTimerInterval) {
                clearInterval(activeTimerInterval);
                activeTimerInterval = null;
            }
        }
    } else {
        const extraIndex = extras.findIndex(ex => ex.key === sub.key);
        if (extraIndex !== -1) extras.splice(extraIndex, 1);
        session.extraSubstances = extras;
    }

    if (lastRedoseTargetKey === sub.key) lastRedoseTargetKey = null;
    await saveLocalData();
    renderAfterActiveSessionMutation();
}

// Rendre l'historique complet
function renderHistory() {
    const list = document.getElementById("history-list");
    const emptyMsg = document.getElementById("history-empty");
    const searchVal = document.getElementById("input-history-search").value.toLowerCase();

    // Filtrer par recherche
    const filtered = appState.sessions.filter(s => {
        return [s.substanceName, displaySubstanceName(s.substanceName)].join(" ").toLowerCase().includes(searchVal);
    });

    if (filtered.length === 0) {
        list.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    list.style.display = "flex";
    emptyMsg.style.display = "none";
    list.innerHTML = "";

    filtered.forEach((session) => {
        const item = document.createElement("div");
        item.className = "card history-item";
        const sessionIndex = appState.sessions.indexOf(session);
        
        const startDate = new Date(session.startTime);
        const dateStr = startDate.toLocaleDateString();
        const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let durationStr = tx("En cours");
        if (session.endTime) {
            const diffMs = session.endTime - session.startTime;
            const diffH = Math.floor(diffMs / 3600000);
            const diffM = Math.floor((diffMs % 3600000) / 60000);
            durationStr = `${diffH}h ${diffM}min`;
        }

        // Récupérer les notes sous forme condensée
        const historyPrimarySub = {
            name: displaySubstanceName(session.substanceName),
            unit: session.unit,
            route: session.route,
            primary: true
        };
        const notesArray = (session.logs || []).map(l => {
            const t = new Date(l.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `<li><strong>${escapeHtml(t)} :</strong> ${escapeHtml(formatLogDisplayText(l, historyPrimarySub, session))}</li>`;
        }).join("");

        item.innerHTML = `
            <div class="history-summary">
                <div>
                    <h3 style="font-size: 16px;">${escapeHtml(displaySubstanceName(session.substanceName))}${(session.extraSubstances && session.extraSubstances.length) ? ` <span style="font-size:12px;color:var(--color-text-muted);font-weight:500;">${escapeHtml(tx("+ {count} substance(s)", { count: session.extraSubstances.length }))}</span>` : ""}</h3>
                    <div class="history-meta">
                        <span>${escapeHtml(dateStr)} ${escapeHtml(tx("à"))} ${escapeHtml(timeStr)}</span>
                        <span>${escapeHtml(tx("Dose cumulée :"))} <strong>${escapeHtml(session.cumulativeDose)} ${escapeHtml(session.unit)}</strong></span>
                        <span>${escapeHtml(tx("Durée :"))} ${escapeHtml(durationStr)}</span>
                    </div>
                </div>
                <div class="history-toggle" style="font-size: 12px; color: var(--color-primary);">
                    ${escapeHtml(tx("Voir le détail"))}
                </div>
            </div>
            <div class="history-details">
                <p style="font-size:13px; color: var(--color-text-muted); margin-bottom: 8px;">
                    <strong>${escapeHtml(tx("Voie d'administration :"))}</strong> ${escapeHtml(session.route)} |
                    <strong>${escapeHtml(tx("État mental / environnement :"))}</strong> ${escapeHtml(session.setSetting)}
                </p>
                <ul style="padding-left: 16px; font-size:13px; color: var(--color-text-muted); display:flex; flex-direction:column; gap:4px;">
                    ${notesArray}
                </ul>
                <button class="btn btn-danger btn-sm" style="margin-top: 14px;" data-delete-session data-session-index="${sessionIndex}">${escapeHtml(tx("Supprimer cette session"))}</button>
            </div>
        `;

        // Toggle déplier
        item.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return; // Éviter de déplier en cliquant sur Supprimer
            item.classList.toggle("open");
            const toggleText = item.querySelector(".history-toggle");
            toggleText.textContent = item.classList.contains("open") ? tx("Masquer le détail") : tx("Voir le détail");
        });

        list.appendChild(item);
    });
}

// Supprimer une session de l'historique
async function deleteHistorySession(index) {
    if (!Number.isInteger(index) || index < 0 || index >= appState.sessions.length) return;
    const ok = await SeuilUI.confirm({
        title: tx("Supprimer la session"),
        message: tx("Cette session sera définitivement retirée de votre historique chiffré."),
        confirmLabel: tx("Supprimer"),
        danger: true
    });
    if (!ok) return;
    appState.sessions.splice(index, 1);
    await saveLocalData();
    renderDashboard();
    renderStats();
}

document.getElementById("input-history-search").addEventListener("input", renderHistory);
document.getElementById("history-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete-session]");
    if (!btn) return;
    e.stopPropagation();
    const index = Number.parseInt(btn.getAttribute("data-session-index"), 10);
    deleteHistorySession(index);
});

// --- INVENTAIRE PERSONNEL ---

function renderStash() {
    const list = document.getElementById("stash-list-container");
    const emptyMsg = document.getElementById("stash-empty");
    const container = document.getElementById("stash-list-container");

    // Vider
    container.innerHTML = "";
    
    const keys = Object.keys(appState.stash);

    if (keys.length === 0) {
        list.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    list.style.display = "flex";
    emptyMsg.style.display = "none";

    const mergedDb = getMergedSubstanceDb();
    keys.forEach(key => {
        const itemData = appState.stash[key];
        const subInfo = mergedDb[key];
        if (!subInfo) return; // Substance invalide

        const item = document.createElement("div");
        item.className = "stash-item";

        // Détection de stock bas (arbitraire: < 2 doses communes moyennes)
        let isLow = false;
        try {
            const commonRange = String(subInfo.dosages.common).split("-");
            const minCommon = parseFloat(commonRange[0]);
            if (Number.isFinite(minCommon) && itemData.qty < (minCommon * 2)) isLow = true;
        } catch (e) {}

        item.innerHTML = `
            <div class="stash-name-section">
                <strong style="font-size: 16px;">${escapeHtml(displaySubstanceName(subInfo.name))}</strong>
                <span class="substance-badge badge-${safeCssClass(subInfo.class)}">${escapeHtml(tx(subInfo.category))}</span>
            </div>
            <div style="font-size: 13px; color: var(--color-text-muted);">
                ${escapeHtml(tx("Forme :"))} <strong>${escapeHtml(tx(itemData.form))}</strong>
            </div>
            <div class="stash-qty-controls">
                <button class="qty-btn" data-adjust-stash data-stash-key="${escapeHtml(key)}" data-stash-dir="-1" aria-label="${escapeHtml(tx("Soustraire une quantité de {name}", { name: displaySubstanceName(subInfo.name) }))}">-</button>
                <div class="qty-val" id="qty-val-${escapeHtml(key)}">${escapeHtml(itemData.qty)} ${escapeHtml(subInfo.dosages.unit)}</div>
                <button class="qty-btn" data-adjust-stash data-stash-key="${escapeHtml(key)}" data-stash-dir="1" aria-label="${escapeHtml(tx("Ajouter une quantité de {name}", { name: displaySubstanceName(subInfo.name) }))}">+</button>
            </div>
            <div class="stash-actions">
                ${isLow ? `<span class="stash-status stash-status-low">${escapeHtml(tx("Quantité faible"))}</span>` : `<span class="stash-status stash-status-ok">${escapeHtml(tx("Suivi à jour"))}</span>`}
                <button class="btn btn-danger btn-sm stash-delete-btn" data-delete-stash data-stash-key="${escapeHtml(key)}" aria-label="${escapeHtml(tx("Supprimer {name} de l'inventaire", { name: displaySubstanceName(subInfo.name) }))}">${escapeHtml(tx("Supprimer"))}</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Ajouter une quantité au stash
document.getElementById("form-add-stash").addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = document.getElementById("stash-substance-select").value;
    const qty = parseFloat(document.getElementById("input-stash-qty").value);
    const form = document.getElementById("input-stash-form").value;

    if (!key || isNaN(qty)) return;

    if (!appState.stash[key]) {
        appState.stash[key] = { qty: 0, form: form };
    }
    
    appState.stash[key].qty = parseFloat((appState.stash[key].qty + qty).toFixed(2));
    appState.stash[key].form = form; // Met à jour le format

    await saveLocalData();
    document.getElementById("form-add-stash").reset();
    renderStash();
});

// Ajuster rapidement le stash (+/-)
async function adjustStashQty(key, dir) {
    if (!appState.stash[key]) return;
    
    const mergedDb = getMergedSubstanceDb();
    const subInfo = mergedDb[key];
    if (!subInfo) return;

    // Définir un incrément raisonnable selon la substance
    let inc = 10; // mg par défaut
    if (subInfo.dosages.unit.includes("alcool")) inc = 10;
    else if (subInfo.dosages.unit.includes("g")) inc = 0.5;
    if (subInfo.dosages.unit.includes("µg")) inc = 25;
    if (subInfo.dosages.unit.includes("ml")) inc = 0.5;

    let newQty = appState.stash[key].qty + (dir * inc);
    if (newQty < 0) newQty = 0;
    
    appState.stash[key].qty = parseFloat(newQty.toFixed(2));

    // Si à zéro, on laisse l'entrée de stash mais vide
    await saveLocalData();
    renderStash();
}

async function deleteStashEntry(key) {
    if (!appState.stash[key]) return;

    const mergedDb = getMergedSubstanceDb();
    const subInfo = mergedDb[key];
    const name = displaySubstanceName(subInfo ? subInfo.name : key);
    const ok = await SeuilUI.confirm({
        title: tx("Supprimer de l'inventaire"),
        message: tx("Cette entrée ({name}) sera retirée de votre inventaire chiffré.", { name }),
        confirmLabel: tx("Supprimer"),
        danger: true
    });
    if (!ok) return;

    delete appState.stash[key];
    await saveLocalData();
    renderStash();
}

document.getElementById("stash-list-container").addEventListener("click", (e) => {
    const deleteBtn = e.target.closest("[data-delete-stash]");
    if (deleteBtn) {
        const key = deleteBtn.getAttribute("data-stash-key");
        deleteStashEntry(key);
        return;
    }

    const btn = e.target.closest("[data-adjust-stash]");
    if (!btn) return;
    const key = btn.getAttribute("data-stash-key");
    const dir = Number.parseInt(btn.getAttribute("data-stash-dir"), 10);
    adjustStashQty(key, dir);
});

// Soustraire du stash automatiquement lors d'une consommation
function deductFromStash(substanceKey, amount) {
    if (appState.stash[substanceKey]) {
        let newQty = appState.stash[substanceKey].qty - amount;
        if (newQty < 0) newQty = 0;
        appState.stash[substanceKey].qty = parseFloat(newQty.toFixed(2));
    }
}

// --- BASE SUBSTANCES (GUIDE & INTERACTIONS) ---

function initGuideAndInteractions() {
    const guideList = document.getElementById("guide-substances-list");
    const searchInput = document.getElementById("input-guide-search");
    const select1 = document.getElementById("inter-select-1");
    const select2 = document.getElementById("inter-select-2");

    // Remplir les sélecteurs de l'interaction checker
    select1.innerHTML = translatedEmptyOption("Sélectionnez...");
    select2.innerHTML = translatedEmptyOption("Sélectionnez...");

    const mergedDb = getMergedSubstanceDb();
    for (const key of getSortedSubstanceKeys(mergedDb)) {
        const sub = mergedDb[key];
        const opt1 = document.createElement("option");
        opt1.value = key;
        opt1.textContent = displaySubstanceName(sub.name);
        select1.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = key;
        opt2.textContent = displaySubstanceName(sub.name);
        select2.appendChild(opt2);
    }

    // Rendre les cartes de guide substances : toutes les fiches, filtrées par la recherche.
    function renderGuideCards() {
        const filter = searchInput.value.trim().toLowerCase();
        guideList.innerHTML = "";

        const mergedDb = getMergedSubstanceDb();
        let shown = 0;
        for (const key of getSortedSubstanceKeys(mergedDb)) {
            const sub = mergedDb[key];
            const searchBlob = [
                sub.name,
                displaySubstanceName(sub.name),
                sub.category,
                sub.description,
                sub.profile,
                ...(sub.aliases || []),
                ...(sub.forms || [])
            ].filter(Boolean).join(" ").toLowerCase();

            if (!searchBlob.includes(filter)) continue;
            shown++;

            const card = document.createElement("div");
            card.className = "substance-card";
            const aliasText = (sub.aliases && sub.aliases.length) ? sub.aliases.slice(0, 4).map(item => tx(item)).join(" · ") : tx("Fiche pédagogique");
            const focusText = sub.profile || sub.description;
            card.innerHTML = `
                <div class="substance-card-head">
                    <strong>${escapeHtml(displaySubstanceName(sub.name))}</strong>
                    <span class="substance-badge badge-${safeCssClass(sub.class)}">${escapeHtml(tx(sub.category))}</span>
                </div>
                <p class="substance-card-aliases">${escapeHtml(aliasText)}</p>
                <p class="substance-card-text">${escapeHtml(tx(focusText))}</p>
            `;
            card.addEventListener("click", () => openSubstanceModal(key));
            guideList.appendChild(card);
        }

        let note = document.getElementById("guide-index-note");
        if (!note) {
            note = document.createElement("p");
            note.id = "guide-index-note";
            note.className = "microcopy";
            note.style.margin = "0 0 14px";
            guideList.parentNode.insertBefore(note, guideList);
        }
        const total = Object.keys(mergedDb).length;
        note.textContent = filter
            ? (shown ? tx("{shown} résultat(s) sur {total} fiches.", { shown, total }) : tx("Aucun résultat."))
            : tx("{total} fiches. Les paliers sont des repères de réduction des risques, jamais des recommandations.", { total });
    }

    searchInput.addEventListener("input", renderGuideCards);
    renderGuideCards();
}

// Helpers d'affichage sûrs pour les fiches substances enrichies
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

function safeCssClass(value) {
    const normalized = String(value ?? "other").toLowerCase().replace(/[^a-z0-9_-]/g, "");
    return normalized || "other";
}

function renderCompactList(items) {
    if (!items || !items.length) return "";
    return items.map(item => `<span>${escapeHtml(tx(item))}</span>`).join("");
}

function formatDoseLogNote(log, sub, session) {
    const unit = sub && sub.unit ? sub.unit : (session && session.unit) || "";
    const name = sub && sub.name ? displaySubstanceName(sub.name) : displaySubstanceName((session && session.substanceName) || "substance");
    const route = log.route || (sub && sub.route) || (session && session.route) || "";
    const quantity = formatDoseQuantity(log, unit);
    const routeText = route ? tx(", voie {route}", { route: tx(String(route)).toLowerCase() }) : "";
    if (log.type === "dose") {
        return tx("Dose initiale consignée : {quantity}{route}.", { quantity, route: routeText });
    }
    return tx("Dose supplémentaire ({name}) : {quantity}{route}.", { name, quantity, route: routeText });
}

function formatEndLogNote(note) {
    const text = String(note || "");
    const prefixes = [
        "Session clôturée. Bilan : ",
        "Session closed. Debrief: "
    ];
    const prefix = prefixes.find(item => text.startsWith(item));
    const rawNotes = prefix ? text.slice(prefix.length) : text;
    const notes = rawNotes === "Aucun commentaire ajouté." || rawNotes === "No comment added."
        ? tx("Aucun commentaire ajouté.")
        : rawNotes;
    return tx("Session clôturée. Bilan : {notes}", { notes });
}

function formatLogDisplayText(log, sub, session) {
    if (log && (log.type === "dose" || log.type === "redose") && log.dose !== undefined) {
        return formatDoseLogNote(log, sub, session);
    }
    if (log.type === "end") return formatEndLogNote(log.note);
    return (log && log.note) || "";
}

function renderSubstanceSection(title, items, variant = "") {
    if (!items || !items.length) return "";
    return `
        <section class="substance-detail-section ${variant}">
            <h3 class="guide-section-title">${escapeHtml(tx(title))}</h3>
            <ul class="substance-quality-list">
                ${items.map(item => `<li>${escapeHtml(tx(item))}</li>`).join("")}
            </ul>
        </section>
    `;
}

function renderSubstanceMeta(sub) {
    const rows = [];
    if (sub.aliases && sub.aliases.length) rows.push({ label: "Alias", value: sub.aliases.slice(0, 8).map(item => tx(item)).join(", ") });
    if (sub.forms && sub.forms.length) rows.push({ label: "Formes observées", value: sub.forms.map(item => tx(item)).join(", ") });
    if (sub.legal_status) rows.push({ label: "Statut / cadre", value: sub.legal_status });
    rows.push({ label: "Métabolisme", value: getSubstanceMetabolism(sub) });

    return rows.map(row => `
        <div class="substance-meta-item">
            <span>${escapeHtml(tx(row.label))}</span>
            <strong>${escapeHtml(tx(row.value))}</strong>
        </div>
    `).join("");
}

function getSubstanceMetabolism(sub) {
    return (sub && sub.metabolism)
        ? sub.metabolism
        : "Métabolisme spécifique non documenté dans cette fiche. Vérifier les sources médicales ou pharmaceutiques, surtout en cas de traitement, maladie hépatique ou maladie rénale.";
}

function renderSingleDosageRows(dosages, unitSuffix = "") {
    return `
        <tr><td class="dosage-level">${escapeHtml(tx("Seuil de dose"))}</td><td>${escapeHtml(tx(dosages.threshold))}${unitSuffix}</td></tr>
        <tr><td class="dosage-level">${escapeHtml(tx("Léger"))}</td><td>${escapeHtml(tx(dosages.light))}${unitSuffix}</td></tr>
        <tr><td class="dosage-level">${escapeHtml(tx("Commun"))}</td><td>${escapeHtml(tx(dosages.common))}${unitSuffix}</td></tr>
        <tr><td class="dosage-level">${escapeHtml(tx("Fort"))}</td><td>${escapeHtml(tx(dosages.strong))}${unitSuffix}</td></tr>
        <tr><td class="dosage-level">${escapeHtml(tx("Intense"))}</td><td>${escapeHtml(tx(dosages.heavy))}${unitSuffix}</td></tr>
    `;
}

function renderDosageRows(sub) {
    const unitSuffix = sub.isCustom ? ` ${escapeHtml(tx(sub.dosages.unit))}` : "";
    return getRenderableSubstanceRouteKeys(sub).map((route) => {
        const dosages = getDosageForRoute(sub, route);
        const estimated = dosages && dosages._estimated ? ` · ${tx("estimation")}` : "";
        return `
            <tr><td colspan="2" class="route-row">${escapeHtml(tx("Voie :"))} ${escapeHtml(tx(route))}${escapeHtml(estimated)}</td></tr>
            ${renderSingleDosageRows(dosages, unitSuffix)}
        `;
    }).join("");
}

function getSubstanceRouteKeys(sub) {
    return getRoutesForSubstance(sub);
}

function getRenderableSubstanceRouteKeys(sub) {
    return getSubstanceRouteKeys(sub).filter((route) => route && route !== "Autre");
}

function getBioavailabilityForRoute(sub, route) {
    if (!sub) return null;
    if (ROA_MODEL.getBioavailabilityForRoute) return ROA_MODEL.getBioavailabilityForRoute(sub, route);
    if (sub.bioavailability_by_route && route && sub.bioavailability_by_route[route]) return sub.bioavailability_by_route[route];
    if ((route === "default" || !route) && sub.bioavailability) return sub.bioavailability;
    return null;
}

function formatBioavailabilityValue(value) {
    if (!value) return "Non documentée dans la base";
    if (typeof value === "string") return value;
    const text = value.value || value.range || "";
    const note = value.note ? ` (${value.note})` : "";
    return text ? `${text}${note}` : "Non documentée dans la base";
}

function renderBioavailabilityRows(sub) {
    return getRenderableSubstanceRouteKeys(sub).map((route) => {
        const valueObj = getBioavailabilityForRoute(sub, route);
        const value = tx(formatBioavailabilityValue(valueObj));
        const estimated = valueObj && valueObj.estimated ? ` · ${tx("estimation")}` : "";
        return `
            <tr>
                <td class="dosage-level">${escapeHtml(tx(route))}${escapeHtml(estimated)}</td>
                <td>${escapeHtml(value)}</td>
            </tr>
        `;
    }).join("");
}

function renderReleaseProfileDosageRows(dosage) {
    if (!dosage) return "";
    const fields = [
        ["Seuil de dose", "threshold"],
        ["Léger", "light"],
        ["Commun", "common"],
        ["Fort", "strong"],
        ["Intense", "heavy"]
    ];
    return fields
        .filter(([, key]) => dosage[key])
        .map(([label, key]) => `<tr><td class="dosage-level">${escapeHtml(tx(label))}</td><td>${escapeHtml(tx(dosage[key]))}</td></tr>`)
        .join("");
}

function renderReleaseProfileTimelineRows(timeline) {
    if (!timeline) return "";
    const fields = [
        ["Début", "onset"],
        ["Montée", "comeup"],
        ["Plateau / pic", "peak"],
        ["Descente", "offset"],
        ["Durée totale", "total"]
    ];
    return fields
        .filter(([, key]) => timeline[key])
        .map(([label, key]) => `<tr><td class="dosage-level">${escapeHtml(tx(label))}</td><td>${escapeHtml(tx(timeline[key]))}</td></tr>`)
        .join("");
}

function renderReleaseProfileCards(sub) {
    const profiles = Array.isArray(sub && sub.release_profiles) ? sub.release_profiles : [];
    if (!profiles.length) return "";
    return profiles.map((profile) => {
        const route = profile.route ? `<span>${escapeHtml(tx(profile.route))}</span>` : "";
        const note = profile.note ? `<p class="microcopy">${escapeHtml(tx(profile.note))}</p>` : "";
        const warning = profile.warning ? `<p class="release-profile-warning">${escapeHtml(tx(profile.warning))}</p>` : "";
        return `
            <article class="release-profile-card">
                <div class="release-profile-head">
                    <strong>${escapeHtml(tx(profile.name || ""))}</strong>
                    ${route}
                </div>
                ${note}
                <div class="release-profile-grid">
                    <div class="release-profile-cell">
                        <h4>${escapeHtml(tx("Bio-disponibilité"))}</h4>
                        <p>${escapeHtml(tx(profile.bioavailability || "Non documentée dans la base"))}</p>
                    </div>
                    <div class="release-profile-cell">
                        <h4>${escapeHtml(tx("Chronologie estimative"))}</h4>
                        <table class="dosage-table"><tbody>${renderReleaseProfileTimelineRows(profile.timeline)}</tbody></table>
                    </div>
                    <div class="release-profile-cell">
                        <h4>${escapeHtml(tx("Paliers indicatifs"))}</h4>
                        <table class="dosage-table"><tbody>${renderReleaseProfileDosageRows(profile.dosage)}</tbody></table>
                    </div>
                </div>
                ${warning}
            </article>
        `;
    }).join("");
}

function formatDurationSeconds(seconds) {
    const value = Math.max(1, Math.round(Number(seconds || 0)));
    if (value < 60) return `${value} sec`;
    const minutes = Math.round(value / 60);
    if (minutes < 90) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!rest) return `${hours} h`;
    return `${hours} h ${String(rest).padStart(2, "0")} min`;
}

function getExplicitDurationText(sub, route, field) {
    if (!sub || !sub.durations) return "";
    const durations = sub.durations;
    if (durations.onset) {
        const primaryRoute = ROA_MODEL.inferPrimaryRoute ? ROA_MODEL.inferPrimaryRoute(sub) : "Oral";
        return route === primaryRoute ? String(durations[field] || "") : "";
    }
    return durations[route] && durations[route][field] ? String(durations[route][field]) : "";
}

function formatDurationCell(sub, route, field, durations) {
    const explicitText = getExplicitDurationText(sub, route, field);
    if (explicitText && !(durations && durations._estimated)) return explicitText;
    return `≈ ${formatDurationSeconds(durations && durations[field])}`;
}

function renderDurationRows(sub) {
    return getRenderableSubstanceRouteKeys(sub).map((route) => {
        const durations = getDurationsForRoute(sub, route);
        const estimated = durations && durations._estimated ? ` · ${tx("estimation")}` : "";
        return `
            <tr><td colspan="2" class="route-row">${escapeHtml(tx("Voie :"))} ${escapeHtml(tx(route))}${escapeHtml(estimated)}</td></tr>
            <tr><td class="dosage-level">${escapeHtml(tx("Début"))}</td><td>${escapeHtml(tx(formatDurationCell(sub, route, "onset", durations)))}</td></tr>
            <tr><td class="dosage-level">${escapeHtml(tx("Montée"))}</td><td>${escapeHtml(tx(formatDurationCell(sub, route, "comeup", durations)))}</td></tr>
            <tr><td class="dosage-level">${escapeHtml(tx("Plateau / pic"))}</td><td>${escapeHtml(tx(formatDurationCell(sub, route, "peak", durations)))}</td></tr>
            <tr><td class="dosage-level">${escapeHtml(tx("Descente"))}</td><td>${escapeHtml(tx(formatDurationCell(sub, route, "offset", durations)))}</td></tr>
            <tr><td class="dosage-level">${escapeHtml(tx("Durée totale"))}</td><td><strong>${escapeHtml(tx(formatDurationCell(sub, route, "total", durations)))}</strong></td></tr>
        `;
    }).join("");
}

// Ouvrir la modal détaillée d'une substance
async function openSubstanceModal(key) {
    try {
        await loadSubstanceDetailAssets();
        applyI18nToAppSurfaces();
    } catch (err) {
        console.info("Détails substances non initialisés :", err);
        if (window.SeuilUI) {
            SeuilUI.toast(tx("Fiche détaillée partielle : contenus longs indisponibles."), { type: "info" });
        }
    }

    const mergedDb = getMergedSubstanceDb();
    const sub = mergedDb[key];
    if (!sub) return;

    document.getElementById("modal-sub-title").textContent = displaySubstanceName(sub.name);
    document.getElementById("modal-sub-badge").textContent = tx(sub.category);
    document.getElementById("modal-sub-badge").className = `substance-badge badge-${safeCssClass(sub.class)}`;
    document.getElementById("modal-sub-description").textContent = tx(sub.description);

    const metaEl = document.getElementById("modal-sub-meta");
    const metaHtml = renderSubstanceMeta(sub);
    metaEl.innerHTML = metaHtml;
    metaEl.style.display = metaHtml ? "grid" : "none";

    const profileEl = document.getElementById("modal-sub-profile");
    if (sub.profile) {
        profileEl.textContent = tx(sub.profile);
        profileEl.style.display = "block";
    } else {
        profileEl.textContent = "";
        profileEl.style.display = "none";
    }
    
    const hideQuantitativeTables = !!sub.omit_quantitative_tables;
    const quantitativeGrid = document.getElementById("modal-sub-quantitative-grid");
    const bioavailabilitySection = document.getElementById("modal-sub-bioavailability-section");
    if (quantitativeGrid) quantitativeGrid.style.display = hideQuantitativeTables ? "none" : "";
    if (bioavailabilitySection) bioavailabilitySection.style.display = hideQuantitativeTables ? "none" : "";

    // Remplir tableau dosages
    const dosagesTable = document.getElementById("modal-sub-dosages-table");
    dosagesTable.innerHTML = hideQuantitativeTables ? "" : renderDosageRows(sub);

    const dosageInfoEl = document.getElementById("modal-sub-dosage-unit-info");
    if (hideQuantitativeTables) {
        dosageInfoEl.textContent = "";
    } else if (sub.dosage_warning) {
        dosageInfoEl.textContent = `* ${tx(sub.dosage_warning)}`;
    } else {
        dosageInfoEl.innerHTML = `* ${escapeHtml(tx("Repères en"))} <strong>${escapeHtml(sub.dosages.unit)}</strong> : ${escapeHtml(tx("pureté, tolérance, voie, médicaments et contexte peuvent modifier fortement les effets. Ce ne sont pas des recommandations."))}`;
    }

    // Remplir tableau durées
    const durationsTable = document.getElementById("modal-sub-durations-table");
    durationsTable.innerHTML = hideQuantitativeTables ? "" : renderDurationRows(sub);

    const bioavailabilityTable = document.getElementById("modal-sub-bioavailability-table");
    if (bioavailabilityTable) {
        bioavailabilityTable.innerHTML = hideQuantitativeTables ? "" : renderBioavailabilityRows(sub);
    }

    const releaseSection = document.getElementById("modal-sub-release-section");
    const releaseProfilesEl = document.getElementById("modal-sub-release-profiles");
    const releaseProfilesHtml = hideQuantitativeTables ? "" : renderReleaseProfileCards(sub);
    if (releaseProfilesEl) releaseProfilesEl.innerHTML = releaseProfilesHtml;
    if (releaseSection) releaseSection.style.display = releaseProfilesHtml ? "block" : "none";

    const expandedEl = document.getElementById("modal-sub-expanded-sections");
    expandedEl.innerHTML = [
        renderSubstanceSection("Effets possibles à surveiller", sub.effects),
        renderSubstanceSection("Facteurs qui augmentent le risque", sub.risk_factors),
        renderSubstanceSection("Contextes à éviter / vigilance", sub.avoid_if),
        renderSubstanceSection("Signaux d’alerte", sub.warning_signs, "alert-section"),
        renderSubstanceSection("Récupération & suivi après coup", sub.aftercare)
    ].join("");

    // Remplir la liste des règles de réduction des risques
    const rulesList = document.getElementById("modal-sub-rules-list");
    rulesList.innerHTML = "";
    (sub.rdr_rules || []).forEach(rule => {
        const li = document.createElement("li");
        li.textContent = tx(rule);
        rulesList.appendChild(li);
    });

    document.getElementById("substance-modal").classList.add("open");
}

// Fermer la modal
document.getElementById("btn-close-modal").addEventListener("click", () => {
    document.getElementById("substance-modal").classList.remove("open");
});

window.addEventListener("click", (e) => {
    const modal = document.getElementById("substance-modal");
    if (e.target === modal) modal.classList.remove("open");
});

// Événement d'interaction checker
function calculateInteraction() {
    const sub1 = document.getElementById("inter-select-1").value;
    const sub2 = document.getElementById("inter-select-2").value;
    const resultCard = document.getElementById("interaction-result");
    const titleEl = document.getElementById("inter-result-title");
    const noteEl = document.getElementById("inter-result-note");

    if (!sub1 || !sub2) {
        resultCard.classList.remove("visible");
        return;
    }

    if (sub1 === sub2) {
        resultCard.className = "result-card visible int-low-risk";
        titleEl.textContent = tx("Même substance");
        noteEl.textContent = tx("Vous avez sélectionné deux fois le même produit. Il ne s’agit pas d’un mélange, mais la dose cumulée augmente bien l’intensité, les effets indésirables et le risque de surdosage.");
        return;
    }

    // Récupérer la clé triée
    const key = [sub1, sub2].sort().join("-");
    const interData = INTERACTION_MATRIX[key];

    if (!interData) {
        const cat = INTERACTION_CATEGORIES["unknown"];
        resultCard.className = `result-card visible ${cat.class}`;
        titleEl.textContent = tx(cat.name);
        noteEl.textContent = tx("Aucune interaction suffisamment documentée dans cette base. En réduction des risques, l’absence de donnée ne veut pas dire absence de danger : évitez le mélange ou considérez-le comme potentiellement risqué.");
        return;
    }

    const cat = INTERACTION_CATEGORIES[interData.category];
    resultCard.className = `result-card visible ${cat.class}`;
    titleEl.textContent = tx(cat.name);
    noteEl.innerHTML = `<strong>${escapeHtml(tx("Détails :"))}</strong> ${escapeHtml(tx(interData.note))}<br><br><span style="font-size: 12px; opacity:0.8;">${escapeHtml(tx(cat.description))}</span>`;
}

document.getElementById("inter-select-1").addEventListener("change", calculateInteraction);
document.getElementById("inter-select-2").addEventListener("change", calculateInteraction);

// --- ANALYSE ET REGLES AUTOMATIQUES ---

// Cartes d'aperçu : total, substances distinctes, jours depuis la dernière, espacement moyen.
function renderStatsOverview() {
    const sessions = (appState.sessions || []).filter(s => s && s.startTime);
    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    setText("stat-total-sessions", sessions.length);
    setText("stat-distinct-subs", new Set(sessions.map(s => s.substanceKey || s.substanceName)).size);

    if (!sessions.length) {
        setText("stat-days-since", "-");
        setText("stat-avg-gap", "-");
        return;
    }

    const times = sessions.map(s => s.startTime).sort((a, b) => b - a);
    const daysSince = Math.floor((Date.now() - times[0]) / 86400000);
    setText("stat-days-since", daysSince <= 0 ? tx("auj.") : tx("{days} j", { days: daysSince }));

    if (times.length < 2) {
        setText("stat-avg-gap", "-");
        return;
    }
    let totalGap = 0;
    for (let i = 0; i < times.length - 1; i++) totalGap += times[i] - times[i + 1];
    const avgDays = totalGap / (times.length - 1) / 86400000;
    setText("stat-avg-gap", avgDays >= 1 ? `${avgDays.toFixed(1)} j` : `${Math.round(avgDays * 24)} h`);
}

function renderStats() {
    renderStatsOverview();
    const rulesList = document.getElementById("rules-status-list");
    rulesList.innerHTML = "";

    const history = appState.sessions;

    // RÈGLE 1 : MDMA (3 mois / 6 semaines)
    const mdmaSessions = history.filter(s => s.substanceKey === "mdma");
    let mdmaRuleOk = "ok";
    let mdmaRuleText = tx("Aucune prise récente de MDMA enregistrée. Les espacements longs restent le repère le plus protecteur.");
    
    if (mdmaSessions.length > 0) {
        const lastMdma = mdmaSessions[0];
        const daysSince = Math.floor((Date.now() - lastMdma.startTime) / 86400000);
        
        if (daysSince < 42) {
            mdmaRuleOk = "danger";
            mdmaRuleText = tx("Dernière prise il y a seulement {days} jours. Espacement très court : la récupération émotionnelle et physique peut être incomplète. Pause fortement recommandée.", { days: daysSince });
        } else if (daysSince < 90) {
            mdmaRuleOk = "warning";
            mdmaRuleText = tx("Dernière prise il y a {days} jours. L’espacement s’améliore, mais viser une pause plus longue réduit les descentes difficiles et l’usage compulsif.", { days: daysSince });
        } else {
            mdmaRuleOk = "ok";
            mdmaRuleText = tx("Dernière prise il y a {days} jours. Espacement long respecté : c’est un signal positif pour la récupération et la prise de recul.", { days: daysSince });
        }
    }
    addRuleBadge(rulesList, tx("Espacement MDMA"), mdmaRuleText, mdmaRuleOk);

    // RÈGLE 2 : PSYCHÉDÉLIQUES (Tolérance de 14 jours)
    const mergedDb = getMergedSubstanceDb();
    const psychSessions = history.filter(s => {
        const info = mergedDb[s.substanceKey];
        return info && info.category === "Psychédélique";
    });
    let psychRuleOk = "ok";
    let psychRuleText = tx("Pas de prise récente de psychédéliques enregistrée. Aucun signal de tolérance rapprochée dans l’historique.");
    
    if (psychSessions.length > 0) {
        const lastPsych = psychSessions[0];
        const daysSince = Math.floor((Date.now() - lastPsych.startTime) / 86400000);
        
        if (daysSince < 14) {
            psychRuleOk = "warning";
            psychRuleText = tx("Dernière prise de psychédélique ({substance}) il y a {days} jours. Tolérance et fatigue psychologique peuvent encore être présentes : laissez du temps avant toute nouvelle expérience.", { substance: displaySubstanceName(lastPsych.substanceName), days: daysSince });
        } else {
            psychRuleOk = "ok";
            psychRuleText = tx("Dernière prise il y a {days} jours. L’espacement de tolérance est respecté, mais l’état mental et le contexte restent déterminants.", { days: daysSince });
        }
    }
    addRuleBadge(rulesList, tx("Tolérance Psychédélique (14j)"), psychRuleText, psychRuleOk);

    // RÈGLE 3 : FRÉQUENCE STIMULANTS (Dépendance)
    const stimSessions = history.filter(s => {
        const info = mergedDb[s.substanceKey];
        return info && info.category === "Stimulant";
    });
    let stimRuleOk = "ok";
    let stimRuleText = tx("Aucun signal de fréquence élevée de stimulants sur les 7 derniers jours.");

    if (stimSessions.length > 0) {
        const oneWeekAgo = Date.now() - (7 * 86400000);
        const stimsLastWeek = stimSessions.filter(s => s.startTime > oneWeekAgo);
        
        if (stimsLastWeek.length >= 3) {
            stimRuleOk = "danger";
            stimRuleText = tx("Stimulants enregistrés {count} fois en 7 jours. Fréquence élevée : risque d’accoutumance, dette de sommeil, anxiété et surcharge cardiovasculaire.", { count: stimsLastWeek.length });
        } else if (stimsLastWeek.length >= 1) {
            stimRuleOk = "warning";
            stimRuleText = tx("Stimulants enregistrés cette semaine ({count} fois). Surveillez la ritualisation, le sommeil, l’appétit et l’envie de redoser.", { count: stimsLastWeek.length });
        }
    }
    addRuleBadge(rulesList, tx("Usage Stimulants (7 derniers jours)"), stimRuleText, stimRuleOk);

    // RÈGLE 4 : HISTORIQUE DE MELANGES DANGEREUX
    let mixRuleOk = "ok";
    let mixRuleText = tx("Aucune interaction classée dangereuse ou mortelle n’a été repérée dans les sessions rapprochées de l’historique.");
    
    let dangerousMixesCount = 0;
    history.forEach(session => {
        // Idéalement, si la session contenait plusieurs substances (en redose ou autre)
        // Pour simplifier, nous détectons si l'historique montre des consommations de substances incompatibles à moins de 12 heures d'intervalle.
        // Ce script scanne les sessions consécutives à moins de 12 heures
    });
    
    for (let i = 0; i < history.length - 1; i++) {
        const s1 = history[i];
        const s2 = history[i+1];
        const diffHours = Math.abs(s1.startTime - s2.startTime) / 3600000;
        
        if (diffHours < 12 && s1.substanceKey !== s2.substanceKey) {
            const key = [s1.substanceKey, s2.substanceKey].sort().join("-");
            const inter = INTERACTION_MATRIX[key];
            if (inter && (inter.category === "deadly" || inter.category === "dangerous")) {
                dangerousMixesCount++;
            }
        }
    }
    
    if (dangerousMixesCount > 0) {
        mixRuleOk = "danger";
        mixRuleText = tx("Attention : l’historique indique {count} association(s) très à risque à moins de 12 h d’intervalle. Revoyez la base interactions et prévoyez une pause.", { count: dangerousMixesCount });
    }
    addRuleBadge(rulesList, tx("Mélanges rapprochés dans l’historique"), mixRuleText, mixRuleOk);

    // DESSINER LES GRAPHIQUES SVG
    drawCharts();
}

function addRuleBadge(container, title, text, status) {
    const item = document.createElement("div");
    item.className = "rule-badge";
    
    let statusClass = "status-ok";
    let statusIcon = "OK";
    if (status === "warning") {
        statusClass = "status-warning";
        statusIcon = "!";
    } else if (status === "danger") {
        statusClass = "status-danger";
        statusIcon = "×";
    }

    item.innerHTML = `
        <div class="rule-status ${safeCssClass(statusClass)}">${escapeHtml(statusIcon)}</div>
        <div class="rule-info">
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    container.appendChild(item);
}

// --- DESSIN DES GRAPHIQUES SVG AUTONOMES ---

function drawCharts() {
    drawFrequencyChart();
    drawSubstancesChart();
}

// 1. Graphique de fréquence (Intakes par jour sur les 30 derniers jours)
function drawFrequencyChart() {
    const container = document.getElementById("chart-frequency-container");
    container.innerHTML = "";
    
    const history = appState.sessions;
    const now = Date.now();
    const oneDayMs = 86400000;
    
    // Initialiser les 30 derniers jours à 0
    const counts = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now - (i * oneDayMs));
        const key = d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
        counts[key] = 0;
    }
    
    // Compter
    history.forEach(s => {
        const d = new Date(s.startTime);
        const key = d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
        if (counts[key] !== undefined) {
            counts[key]++;
        }
    });

    const keys = Object.keys(counts);
    const maxVal = Math.max(...Object.values(counts), 1); // Éviter max=0

    // Dessiner en SVG
    const width = container.clientWidth || 500;
    const height = 200;
    const paddingLeft = 30;
    const paddingBottom = 25;
    const paddingTop = 15;
    const paddingRight = 15;
    
    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;
    
    const barWidth = (graphWidth / keys.length) * 0.7;
    const barSpacing = (graphWidth / keys.length) * 0.3;

    let svgContent = `<svg class="chart-svg" width="${width}" height="${height}">`;
    
    // Lignes de grille horizontales
    const gridLines = Math.min(maxVal, 4);
    for (let i = 0; i <= gridLines; i++) {
        const val = Math.round((maxVal / gridLines) * i);
        const y = paddingTop + graphHeight - ((val / maxVal) * graphHeight);
        
        svgContent += `
            <line class="chart-grid" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" />
            <text class="chart-text-y" x="${paddingLeft - 8}" y="${y + 4}">${val}</text>
        `;
    }

    // Axes
    svgContent += `
        <line class="chart-axis" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" />
        <line class="chart-axis" x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" />
    `;

    // Barres
    keys.forEach((key, index) => {
        const val = counts[key];
        const x = paddingLeft + (index * (barWidth + barSpacing)) + (barSpacing / 2);
        const barHeight = (val / maxVal) * graphHeight;
        const y = height - paddingBottom - barHeight;
        
        // N'afficher le label d'axe que tous les 5 jours pour ne pas surcharger
        const showLabel = index % 5 === 0 || index === keys.length - 1;
        const labelText = showLabel ? `<text class="chart-text" x="${x + barWidth/2}" y="${height - paddingBottom + 16}">${key}</text>` : "";

        svgContent += `
            <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" />
            ${labelText}
        `;
    });

    svgContent += `</svg>`;
    container.innerHTML = svgContent;
}

// 2. Répartition des substances les plus utilisées (Compte de sessions par substance)
function drawSubstancesChart() {
    const container = document.getElementById("chart-substances-container");
    container.innerHTML = "";
    
    const history = appState.sessions;
    const counts = {};
    
    history.forEach(s => {
        const name = displaySubstanceName(s.substanceName);
        counts[name] = (counts[name] || 0) + 1;
    });

    const items = Object.keys(counts).map(name => {
        return { name: name, count: counts[name] };
    }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5

    if (items.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding-top: 80px;">${escapeHtml(tx("Pas encore assez de sessions clôturées pour afficher cette tendance."))}</p>`;
        return;
    }

    const maxVal = Math.max(...items.map(i => i.count), 1);
    
    const width = container.clientWidth || 500;
    const height = 200;
    
    const paddingLeft = 100; // Plus large pour les noms de substances
    const paddingRight = 30;
    const paddingTop = 15;
    const paddingBottom = 15;
    
    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;
    
    const barHeight = (graphHeight / items.length) * 0.6;
    const barSpacing = (graphHeight / items.length) * 0.4;

    let svgContent = `<svg class="chart-svg" width="${width}" height="${height}">`;

    // Axe Y
    svgContent += `
        <line class="chart-axis" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" />
    `;

    items.forEach((item, index) => {
        const y = paddingTop + (index * (barHeight + barSpacing)) + (barSpacing / 2);
        const barWidth = (item.count / maxVal) * graphWidth;

        svgContent += `
            <text class="chart-text-y" x="${paddingLeft - 10}" y="${y + barHeight/2 + 4}" style="text-anchor: end; font-size: 11px; font-weight: 500;">
                ${escapeHtml(item.name)}
            </text>
            <rect class="chart-bar" x="${paddingLeft}" y="${y}" width="${barWidth}" height="${barHeight}" style="fill: var(--color-secondary);" />
            <text class="chart-text" x="${paddingLeft + barWidth + 15}" y="${y + barHeight/2 + 4}" style="fill: #ffffff; font-weight: 600;">
                ${item.count}
            </text>
        `;
    });

    svgContent += `</svg>`;
    container.innerHTML = svgContent;
}

// --- CONFIGURATION / GESTION DES EVENEMENTS DES PARAMÈTRES ---

function setupEventHandlers() {
    // 0. Poly-conso : ajout d'une substance au suivi
    const btnAddSub = document.getElementById("btn-add-substance");
    if (btnAddSub) {
        btnAddSub.addEventListener("click", () => {
            const form = document.getElementById("form-add-substance");
            const sel = document.getElementById("add-sub-select");
            const db = getMergedSubstanceDb();
            const used = new Set([appState.activeSession ? appState.activeSession.substanceKey : null, ...((appState.activeSession && appState.activeSession.extraSubstances) || []).map(e => e.key)]);
            sel.innerHTML = getSortedSubstanceKeys(db).filter(k => db[k].durations_seconds && !used.has(k))
                .map(k => `<option value="${k}">${escapeHtml(displaySubstanceName(db[k].name))}</option>`).join("");
            syncAddSubRouteToSelected();
            syncAddSubUnitToSelected();
            form.style.display = (form.style.display === "none" || !form.style.display) ? "grid" : "none";
        });
    }
    const redoseTarget = document.getElementById("redose-target");
    if (redoseTarget) {
        redoseTarget.addEventListener("change", () => {
            lastRedoseTargetKey = redoseTarget.value;
            syncRedoseRouteToTarget();
            syncRedoseUnitToTarget();
            updateRedoseBadge();
        });
    }
    const addSubSelect = document.getElementById("add-sub-select");
    if (addSubSelect) {
        addSubSelect.addEventListener("change", () => {
            syncAddSubRouteToSelected();
            syncAddSubUnitToSelected();
        });
    }
    const formAddSub = document.getElementById("form-add-substance");
    if (formAddSub) {
        formAddSub.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!appState.activeSession) return;
            const db = getMergedSubstanceDb();
            const key = document.getElementById("add-sub-select").value;
            const inputDose = parseFloat(document.getElementById("add-sub-dose").value);
            const doseUnit = document.getElementById("add-sub-unit").value;
            const addSubRoute = document.getElementById("add-sub-route");
            const route = addSubRoute && addSubRoute.value ? addSubRoute.value : "Oral";
            if (!key || !inputDose || !db[key]) return;
            const dose = convertDoseToReferenceUnit(inputDose, doseUnit, db[key].dosages.unit);
            const doseLabel = formatInputDoseLabel(inputDose, doseUnit);
            const curveDose = dose === null ? inputDose : dose;
            let doseTime = Date.now();
            const addSubTimeType = document.getElementById("add-sub-time-type");
            if (addSubTimeType && addSubTimeType.value === "past") {
                const addSubTimeValue = document.getElementById("add-sub-time").value;
                if (addSubTimeValue) {
                    const parsedTime = new Date(addSubTimeValue);
                    if (!isNaN(parsedTime.getTime())) {
                        doseTime = Math.min(Math.max(parsedTime.getTime(), appState.activeSession.startTime), Date.now());
                    }
                }
            }
            appState.activeSession.extraSubstances.push({
                key, name: db[key].name, class: db[key].class, unit: db[key].dosages.unit,
                route,
                logs: [{ time: doseTime, type: "dose", dose, curveDose, inputAmount: inputDose, inputUnit: doseUnit, doseLabel: doseLabel, route, note: `Substance ajoutée au suivi : ${doseLabel} de ${db[key].name}, voie ${route.toLowerCase()}.` }]
            });
            const deductStash = document.getElementById("check-deduct-stash").checked;
            if (deductStash && key !== "custom" && dose !== null) {
                deductFromStash(key, dose);
            }
            await saveLocalData();
            formAddSub.reset();
            formAddSub.style.display = "none";
            const addSubTimeGroup = document.getElementById("group-add-sub-time");
            if (addSubTimeGroup) addSubTimeGroup.style.display = "none";
            renderActiveSubstances();
            renderLiveLogFeed();
            updateTimelinePhases();
        });
    }

    // 1. Verrouillage local hérité : supprimé - la session serveur, le coffre
    //    chiffré et l'écran de déverrouillage par onglet couvrent ce besoin.

    // 3. Exporter données
    document.getElementById("btn-export-data").addEventListener("click", () => {
        const dataStr = JSON.stringify(normalizeAppState(appState), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `seuil-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        SeuilUI.toast(tx("Sauvegarde JSON exportée. Conservez-la en lieu sûr : elle n'est pas chiffrée."), { type: "info", duration: 6000 });
    });

    // 4. Importer données
    const importInput = document.getElementById("input-import-file");
    const importStatus = document.getElementById("import-status-text");

    importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const parsed = JSON.parse(event.target.result);

                // Petite validation de structure
                if (parsed.sessions === undefined || parsed.stash === undefined) {
                    throw new Error("Structure de fichier JSON invalide");
                }

                const ok = await SeuilUI.confirm({
                    title: tx("Importer la sauvegarde"),
                    message: tx("Le contenu actuel de votre coffre sera remplacé par cette sauvegarde."),
                    confirmLabel: tx("Importer"),
                    danger: true
                });
                if (!ok) { importInput.value = ""; return; }

                appState = normalizeAppState(parsed);
                // Le verrouillage local hérité n'existe plus : on neutralise le drapeau.
                appState.security = { enabled: false, passwordHash: "" };
                await saveLocalData();

                importStatus.textContent = tx("Sauvegarde importée avec succès.");
                SeuilUI.toast(tx("Sauvegarde importée."), { type: "success" });
                setTimeout(() => { window.location.reload(); }, 900);
            } catch (err) {
                SeuilUI.toast(tx("Import impossible : le fichier semble corrompu ou ne correspond pas au format attendu."), { type: "error", duration: 6000 });
                console.error(err);
            }
        };
        reader.readAsText(file);
    });

    // 5. Suppression complète du compte et du coffre
    document.getElementById("btn-factory-reset").addEventListener("click", async () => {
        const ok = await SeuilUI.confirm({
            title: "Supprimer le compte",
            message: "Le compte, le coffre chiffré, l'historique, l'inventaire et les sessions ouvertes seront définitivement supprimés. Exportez une sauvegarde avant si nécessaire.",
            confirmLabel: "Supprimer mon compte",
            danger: true
        });
        if (!ok) return;
        const sure = await SeuilUI.confirm({
            title: "Confirmation finale",
            message: "Dernière vérification : supprimer définitivement votre compte et votre coffre chiffré ?",
            confirmLabel: "Oui, supprimer tout",
            danger: true
        });
        if (!sure) return;
        try {
            if (!window.SeuilAuth || typeof SeuilAuth.deleteCurrentAccount !== "function") {
                throw new Error("Suppression de compte indisponible.");
            }
            await SeuilAuth.deleteCurrentAccount();
            appState = createDefaultAppState();
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        } catch (err) {
            SeuilUI.toast(err.message || "Suppression impossible.", { type: "error", duration: 7000 });
        }
    });

    // 6. Basculer l'affichage de l'heure d'ingestion passée
    document.getElementById("input-time-type").addEventListener("change", (e) => {
        const pastGroup = document.getElementById("group-past-time");
        if (e.target.value === "past") {
            pastGroup.style.display = "block";
            const localDateTime = toLocalDatetimeLocal(new Date());
            const pastInput = document.getElementById("input-past-time");
            pastInput.value = localDateTime;
            pastInput.max = localDateTime;
        } else {
            pastGroup.style.display = "none";
        }
    });

    // 6b. Basculer l'affichage de la date/heure précise du redose
    document.getElementById("input-redose-time-type").addEventListener("change", (e) => {
        const grp = document.getElementById("group-redose-time");
        if (e.target.value === "past") {
            grp.style.display = "block";
            const localDateTime = toLocalDatetimeLocal(new Date());
            const inp = document.getElementById("input-redose-time");
            inp.value = localDateTime;
            inp.max = localDateTime;
            if (appState.activeSession && appState.activeSession.startTime) {
                inp.min = toLocalDatetimeLocal(new Date(appState.activeSession.startTime));
            }
        } else {
            grp.style.display = "none";
        }
    });

    const addSubTimeType = document.getElementById("add-sub-time-type");
    if (addSubTimeType) {
        addSubTimeType.addEventListener("change", (e) => {
            const grp = document.getElementById("group-add-sub-time");
            if (!grp) return;
            if (e.target.value === "past") {
                grp.style.display = "block";
                const localDateTime = toLocalDatetimeLocal(new Date());
                const inp = document.getElementById("add-sub-time");
                inp.value = localDateTime;
                inp.max = localDateTime;
                if (appState.activeSession && appState.activeSession.startTime) {
                    inp.min = toLocalDatetimeLocal(new Date(appState.activeSession.startTime));
                }
            } else {
                grp.style.display = "none";
            }
        });
    }

    // 7. Écouteurs pour les indicateurs de dosage dynamique
    document.getElementById("input-dosage").addEventListener("input", updateDosageBadge);
    document.getElementById("route-select").addEventListener("change", updateDosageBadge);
    document.getElementById("unit-select").addEventListener("change", updateDosageBadge);
    document.getElementById("input-redose-amount").addEventListener("input", updateRedoseBadge);
    document.getElementById("input-redose-route").addEventListener("change", updateRedoseBadge);
    document.getElementById("input-redose-unit").addEventListener("change", updateRedoseBadge);

    // 8. Enregistrement d'une substance personnalisée permanente
    document.getElementById("form-create-custom-sub").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("custom-db-name").value.trim();
        const category = document.getElementById("custom-db-cat").value;
        const unit = document.getElementById("custom-db-unit").value.trim();
        
        const threshold = parseFloat(document.getElementById("custom-db-dose-threshold").value);
        const light = parseFloat(document.getElementById("custom-db-dose-light").value);
        const common = parseFloat(document.getElementById("custom-db-dose-common").value);
        const strong = parseFloat(document.getElementById("custom-db-dose-strong").value);
        const heavy = parseFloat(document.getElementById("custom-db-dose-heavy").value);
        
        const onset = parseInt(document.getElementById("custom-db-dur-onset").value);
        const comeup = parseInt(document.getElementById("custom-db-dur-comeup").value);
        const peak = parseInt(document.getElementById("custom-db-dur-peak").value);
        const offset = parseInt(document.getElementById("custom-db-dur-offset").value);
        const total = parseInt(document.getElementById("custom-db-dur-total").value);
        
        const rule1 = document.getElementById("custom-db-rule-1").value.trim();
        const rule2 = document.getElementById("custom-db-rule-2").value.trim();
        
        const statusEl = document.getElementById("custom-db-status");
        const numericValues = [threshold, light, common, strong, heavy, onset, comeup, peak, offset, total];
        if (!name || !unit || numericValues.some(v => !Number.isFinite(v) || v <= 0)) {
            statusEl.textContent = tx("Complétez tous les champs avec des valeurs positives avant d’enregistrer la fiche locale.");
            statusEl.style.color = "#ef4444";
            return;
        }
        if (!(threshold <= light && light <= common && common <= strong && strong <= heavy)) {
            statusEl.textContent = tx("Les paliers doivent rester cohérents : seuil ≤ léger ≤ commun ≤ fort ≤ intense.");
            statusEl.style.color = "#ef4444";
            return;
        }
        
        const keyBase = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
        const key = keyBase || `custom_${Date.now()}`;
        
        if (!appState.customSubstances) {
            appState.customSubstances = {};
        }
        
        const catLabels = {
            "stimulant": "Stimulant",
            "psychedelic": "Psychédélique",
            "depressant": "Dépresseur",
            "dissociative": "Dissociatif",
            "cannabinoid": "Cannabinoïde",
            "empathogen": "Empathogène",
            "other": "Autre"
        };
        
        appState.customSubstances[key] = {
            name: name,
            category: catLabels[category] || "Autre",
            class: category,
            isCustom: true,
            description: `Fiche personnalisée locale. Vérifiez vos informations : elles ne sont pas validées par une source externe.`,
            dosages: {
                unit: unit,
                threshold: threshold,
                light: light,
                common: common,
                strong: strong,
                heavy: heavy
            },
            durations: {
                onset: `${onset} min`,
                comeup: `${comeup} min`,
                peak: `${peak} min`,
                offset: `${offset} min`,
                total: `${total} min`
            },
            durations_seconds: {
                onset: onset * 60,
                comeup: comeup * 60,
                peak: peak * 60,
                offset: offset * 60,
                total: total * 60
            },
            profile: "Fiche créée localement : utilisez-la comme aide-mémoire personnel, pas comme validation de sécurité. Les informations saisies ne sont pas vérifiées par une source externe.",
            effects: ["Effets à compléter dans vos notes de session : intensité, temporalité, anxiété, somnolence, stimulation, effets corporels."],
            risk_factors: ["Produit non identifié, pureté inconnue, mélange, traitement médical, manque de sommeil, contexte émotionnel fragile."],
            avoid_if: ["Évitez tout mélange ou redose tant que les effets et la durée ne sont pas clairement documentés."],
            warning_signs: ["Douleur thoracique, respiration anormale, convulsion, perte de connaissance, confusion sévère ou détresse psychologique : appelez le 15/112."],
            aftercare: ["Notez l’heure, la quantité, les effets et la récupération ; cherchez une source fiable ou une analyse de produit si possible."],
            dosage_warning: "Paliers saisis manuellement et non vérifiés : ne pas les considérer comme des recommandations.",
            rdr_rules: [rule1, rule2]
        };
        
        await saveLocalData();
        
        statusEl.textContent = tx("La fiche locale « {name} » a été enregistrée.", { name });
        statusEl.style.color = "var(--color-int-low-risk)";
        
        document.getElementById("form-create-custom-sub").reset();
        
        populateSubstanceSelects();
        initGuideAndInteractions();
        
        setTimeout(() => {
            statusEl.textContent = "";
        }, 3000);
    });
}

// ===== Comparateur multi-courbes (Base & Formations) =====
let compareSelection = [];

function getClassColorCompare(cls) {
    const map = { stimulant: "--color-stimulant", depressant: "--color-depressant",
        psychedelic: "--color-psychedelic", dissociative: "--color-dissociative",
        cannabinoid: "--color-cannabinoid", empathogen: "--color-empathogen", other: "--color-other" };
    const v = getComputedStyle(document.documentElement).getPropertyValue(map[cls] || "--color-primary").trim();
    return v || "#6E8BFF";
}

function populateCompareSelect() {
    const sel = document.getElementById("compare-select");
    if (!sel) return;
    const db = getMergedSubstanceDb();
    // Seulement les substances avec données de durée réelles (courbe pertinente) - exclut l'index condensé.
    const keys = getSortedSubstanceKeys(db).filter(k => db[k] && db[k].durations_seconds);
    sel.innerHTML = translatedEmptyOption("Sélectionnez…") +
        keys.map(k => `<option value="${k}">${escapeHtml(displaySubstanceName(db[k].name))}</option>`).join("");
}

function renderCompare() {
    const chart = document.getElementById("compare-chart");
    const legend = document.getElementById("compare-legend");
    const chips = document.getElementById("compare-chips");
    const empty = document.getElementById("compare-empty");
    if (!chart) return;
    const db = getMergedSubstanceDb();
    compareSelection = compareSelection.filter(k => db[k] && db[k].durations_seconds);
    chips.innerHTML = compareSelection.map(k =>
        `<span class="compare-chip" style="--chip:${getClassColorCompare(db[k].class)}"><i></i>${escapeHtml(displaySubstanceName(db[k].name))}<button data-remove="${k}" aria-label="${escapeHtml(tx("Retirer {name}", { name: displaySubstanceName(db[k].name) }))}">&times;</button></span>`).join("");
    if (!compareSelection.length) {
        // Vide : on replie le graphique, sinon il occupe de la place à vide.
        chart.innerHTML = "";
        chart.style.display = "none";
        legend.innerHTML = "";
        empty.style.display = "block";
        return;
    }
    chart.style.display = "";
    empty.style.display = "none";

    // Largeur réelle du conteneur → tracé net (pas d'étirement) ; repli si onglet masqué.
    const W = Math.max(320, Math.round(chart.clientWidth) || 640);
    const H = 220, PADL = 6, PADR = 10, PADT = 14, PADB = 26;

    const series = compareSelection.map(k => {
        const sub = db[k];
        const primaryRoute = ROA_MODEL.inferPrimaryRoute ? ROA_MODEL.inferPrimaryRoute(sub) : "Oral";
        const d = getDurationsForRoute(sub, primaryRoute);
        const total = (d.onset + d.comeup + d.peak + d.offset) || 14400;
        return { sub, route: primaryRoute, color: getClassColorCompare(sub.class), total };
    });
    const dataMax = series.reduce((m, s) => Math.max(m, s.total), 0);

    // Échelle de temps « ronde » : le dernier repère tombe pile au bord droit,
    // quelle que soit la durée (de quelques minutes à plus de 24 h).
    const hoursNeeded = dataMax / 3600;
    const step = hoursNeeded <= 1 ? 0.25 : hoursNeeded <= 3 ? 0.5 : hoursNeeded <= 6 ? 1
        : hoursNeeded <= 14 ? 2 : hoursNeeded <= 28 ? 4 : 6;
    const topHours = Math.max(step, Math.ceil((hoursNeeded * 1.02) / step) * step);
    const maxT = topHours * 3600;

    const x = t => PADL + (t / maxT) * (W - PADL - PADR);
    const y = v => (H - PADB) - Math.max(0, Math.min(1, v)) * (H - PADB - PADT);
    const N = 140;

    let defs = "", areas = "", lines = "";
    series.forEach((s, idx) => {
        const gid = `cmpgrad${idx}`;
        defs += `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${s.color}" stop-opacity="0.20"/><stop offset="100%" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`;
        let path = "";
        for (let i = 0; i <= N; i++) {
            const t = (i / N) * maxT;
            const px = x(t).toFixed(1), py = y(getDoseCurveValue(1, s.route, t, s.sub)).toFixed(1);
            path += (i === 0 ? `M${px} ${py}` : ` L${px} ${py}`);
        }
        areas += `<path d="${path} L${x(maxT).toFixed(1)} ${(H - PADB).toFixed(1)} L${x(0).toFixed(1)} ${(H - PADB).toFixed(1)} Z" fill="url(#${gid})"/>`;
        lines += `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 4px ${s.color}55)"/>`;
    });

    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach(g => { grid += `<line class="chart-grid" x1="${PADL}" y1="${y(g).toFixed(1)}" x2="${(W - PADR).toFixed(1)}" y2="${y(g).toFixed(1)}"/>`; });
    grid += `<line class="chart-axis" x1="${PADL}" y1="${(H - PADB).toFixed(1)}" x2="${(W - PADR).toFixed(1)}" y2="${(H - PADB).toFixed(1)}"/>`;

    let ticks = "";
    for (let h = 0; h <= topHours + 1e-6; h += step) {
        const label = step < 1 ? (h === 0 ? "0" : `${Math.round(h * 60)}min`) : `${h}h`;
        const anchor = h === 0 ? "start" : (Math.abs(h - topHours) < 1e-6 ? "end" : "middle");
        ticks += `<text class="chart-text" x="${x(h * 3600).toFixed(1)}" y="${H - 8}" style="text-anchor:${anchor}">${label}</text>`;
    }

    chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" class="chart-svg" preserveAspectRatio="xMidYMid meet"><defs>${defs}</defs>${grid}${areas}${lines}${ticks}</svg>`;
    legend.innerHTML = series.map(s => `<span class="compare-leg"><i style="background:${s.color}"></i>${escapeHtml(displaySubstanceName(s.sub.name))} <span class="compare-leg-dur">${escapeHtml(s.sub.durations.total)}</span></span>`).join("");
}

function setupComparator() {
    const sel = document.getElementById("compare-select");
    if (!sel) return;
    populateCompareSelect();
    sel.addEventListener("change", e => {
        const k = e.target.value;
        if (k && !compareSelection.includes(k) && compareSelection.length < 5) compareSelection.push(k);
        e.target.value = "";
        renderCompare();
    });
    document.getElementById("compare-chips").addEventListener("click", e => {
        const k = e.target.getAttribute("data-remove");
        if (k) { compareSelection = compareSelection.filter(x => x !== k); renderCompare(); }
    });
    renderCompare();
}

// Re-tracer le comparateur quand la fenêtre change de taille (largeur réelle).
let compareResizeTimer = null;
window.addEventListener("resize", () => {
    if (!compareSelection.length) return;
    clearTimeout(compareResizeTimer);
    compareResizeTimer = setTimeout(renderCompare, 180);
});

// Accès lecture seule pour la couche IA (fonction de comparaison)
window.getCompareSelection = () => compareSelection.slice();
