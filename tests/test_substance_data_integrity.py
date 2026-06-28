"""Vérifications de cohérence des fiches substances utilisées par la timeline."""

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_audit():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("db.js", "utf8") + "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;", ctx);
vm.runInContext(fs.readFileSync("substances-data.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("psychonaut-data.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("index-substances.js", "utf8"), ctx);

const db = ctx.SUBSTANCE_DB;
const requiredDose = ["unit", "threshold", "light", "common", "strong", "heavy"];
const requiredDur = ["onset", "comeup", "peak", "offset", "total"];
const problems = [];

function routeKeysFor(sub) {
  const routes = new Set();
  const durations = sub.durations || {};
  if (durations && !durations.onset) {
    for (const route of Object.keys(durations)) routes.add(route);
  }
  if (sub.dosages_by_route) {
    for (const route of Object.keys(sub.dosages_by_route)) routes.add(route);
  }
  if (sub.bioavailability_by_route) {
    for (const route of Object.keys(sub.bioavailability_by_route)) routes.add(route);
  }
  return Array.from(routes);
}

function hasImpossibleZeroDose(value) {
  if (typeof value !== "string") return false;
  return /\b0(?:\.0+)?\s+\S+\s*\+$/.test(value) || /-\s*0(?:\.0+)?\s+\S+$/.test(value);
}

for (const [key, sub] of Object.entries(db)) {
  for (const field of requiredDose) {
    if (!sub.dosages || sub.dosages[field] === undefined || sub.dosages[field] === "") {
      problems.push(`${key}: missing dosage ${field}`);
    } else if (hasImpossibleZeroDose(sub.dosages[field])) {
      problems.push(`${key}: impossible zero dosage ${field}`);
    }
  }
  if (sub.dosages_by_route) {
    for (const [route, dosages] of Object.entries(sub.dosages_by_route)) {
      for (const field of requiredDose) {
        if (!dosages || dosages[field] === undefined || dosages[field] === "") {
          problems.push(`${key}/${route}: missing route dosage ${field}`);
        } else if (hasImpossibleZeroDose(dosages[field])) {
          problems.push(`${key}/${route}: impossible zero route dosage ${field}`);
        }
      }
    }
  }

  for (const group of ["durations", "durations_seconds"]) {
    if (!sub[group]) problems.push(`${key}: missing ${group}`);
  }

  const text = sub.durations || {};
  const seconds = sub.durations_seconds || {};
  const textMap = !!text && !text.onset;
  const secondsMap = !!seconds && !seconds.onset;
  if (textMap !== secondsMap) {
    problems.push(`${key}: duration route-map mismatch`);
  }

  const entries = secondsMap
    ? Object.entries(seconds)
    : [["default", seconds]];
  for (const [route, durations] of entries) {
    for (const field of requiredDur) {
      const value = durations[field];
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        problems.push(`${key}/${route}: invalid duration ${field}`);
      }
    }
    if (durations.total <= 0) problems.push(`${key}/${route}: total duration <= 0`);
  }

  if (textMap && secondsMap) {
    const textKeys = Object.keys(text).sort().join("|");
    const secondsKeys = Object.keys(seconds).sort().join("|");
    if (textKeys !== secondsKeys) {
      problems.push(`${key}: route keys mismatch ${textKeys} != ${secondsKeys}`);
    }
  }
  if (sub.dosages_by_route && secondsMap) {
    for (const route of Object.keys(sub.dosages_by_route)) {
      if (!seconds[route]) {
        problems.push(`${key}: route dosage without route timeline ${route}`);
      }
    }
  }

  if (sub.bioavailability_by_route) {
    for (const [route, value] of Object.entries(sub.bioavailability_by_route)) {
      if (!routeKeysFor(sub).includes(route)) {
        problems.push(`${key}: bioavailability without modeled route ${route}`);
      }
      const text = typeof value === "string" ? value : (value && value.value);
      if (!text || typeof text !== "string") {
        problems.push(`${key}/${route}: invalid bioavailability value`);
      }
    }
  }
}

for (const route of ["Insufflé", "Rectal"]) {
  if (!db.cocaine.durations[route]) problems.push(`cocaine missing text route ${route}`);
  if (!db.cocaine.durations_seconds[route]) problems.push(`cocaine missing seconds route ${route}`);
}

process.stdout.write(JSON.stringify({ total: Object.keys(db).length, problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    return json.loads(result.stdout)


def test_all_substance_dosage_and_timeline_fields_are_well_formed():
    audit = load_audit()

    assert audit["total"] >= 100
    assert audit["problems"] == []


def test_psychonaut_overrides_are_applied_and_category_cards_are_non_quantitative():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const file of ["db.js", "substances-data.js", "psychonaut-data.js", "index-substances.js"]) {
  vm.runInContext(
    fs.readFileSync(file, "utf8") + (file === "db.js" ? "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;" : ""),
    ctx,
    { filename: file }
  );
}
const db = ctx.SUBSTANCE_DB;
const problems = [];
for (const key of ["mdma", "methylphenidate", "oxycodone"]) {
  if (db[key].data_source !== "PsychonautWiki API") problems.push(`${key}: missing PsychonautWiki source`);
  if (!db[key].psychonaut_url || !db[key].psychonaut_url.includes("psychonautwiki.org/wiki/")) {
    problems.push(`${key}: missing PsychonautWiki URL`);
  }
}
for (const key of ["opioides", "benzodiazepines", "cathinones", "cannabis_synthese", "fentanyl_nitazenes"]) {
  if (!db[key].omit_quantitative_tables) problems.push(`${key}: quantitative tables not hidden`);
}
if (db.heroine.dosages_by_route.Intraveineux.common !== "5 - 8 mg") {
  problems.push(`heroine IV common dose should come from PsychonautWiki, got ${db.heroine.dosages_by_route.Intraveineux.common}`);
}
if (db.ibogaine) {
  problems.push("ibogaine should be removed from the public substance directory");
}
if (db.salvia.data_source !== "PsychonautWiki API") {
  problems.push("salvia should use PsychonautWiki-sourced route data");
}
if (!db.salvia.psychonaut_url || !db.salvia.psychonaut_url.includes("Salvinorin%20A")) {
  problems.push(`salvia should link to the Salvinorin A PsychonautWiki page, got ${db.salvia.psychonaut_url}`);
}
process.stdout.write(JSON.stringify({ problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["problems"] == []


def test_known_bioavailability_values_are_present_for_supported_routes():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("db.js", "utf8") + "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;", ctx);
const db = ctx.SUBSTANCE_DB;
const checks = [
  ["cocaine", "Oral"],
  ["cocaine", "Insufflé"],
  ["cocaine", "Inhalé"],
  ["cocaine", "Intraveineux"],
  ["cocaine", "Rectal"],
  ["ketamine", "Oral"],
  ["ketamine", "Insufflé"],
  ["dmt", "Intraveineux"]
];
const missing = checks.filter(([key, route]) => {
  const value = db[key] && db[key].bioavailability_by_route && db[key].bioavailability_by_route[route];
  return !value || !String(typeof value === "string" ? value : value.value).includes("%");
});
process.stdout.write(JSON.stringify({ missing }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["missing"] == []


def test_cocaine_rectal_bioavailability_is_estimated_not_unquantified():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("db.js", "utf8") + "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;", ctx);
const value = ctx.SUBSTANCE_DB.cocaine.bioavailability_by_route.Rectal;
process.stdout.write(JSON.stringify({ value }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["value"] == "60 - 80 % (est.)"


def test_pvp_search_does_not_show_alpha_php_as_duplicate_alpha_pvp():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const file of ["db.js", "substances-data.js", "psychonaut-data.js", "index-substances.js", "substances-detail.js"]) {
  vm.runInContext(
    fs.readFileSync(file, "utf8") + (file === "db.js" ? "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;" : ""),
    ctx,
    { filename: file }
  );
}
const db = ctx.SUBSTANCE_DB;
function guideSearchHits(query) {
  const filter = query.toLowerCase();
  return Object.entries(db)
    .filter(([key, sub]) => [
      sub.name,
      sub.category,
      sub.description,
      sub.profile,
      ...(sub.aliases || []),
      ...(sub.forms || [])
    ].filter(Boolean).join(" ").toLowerCase().includes(filter))
    .map(([key, sub]) => ({ key, name: sub.name }));
}
const hits = guideSearchHits("pvp");
const problems = [];
if (!hits.some((item) => item.key === "a_pvp")) problems.push("a_pvp missing from pvp search");
if (hits.some((item) => item.key === "a_php")) problems.push(`a_php should not match pvp search: ${JSON.stringify(hits)}`);
process.stdout.write(JSON.stringify({ hits, problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["problems"] == []


def test_non_explicit_bioavailability_estimates_are_substance_specific_not_route_generic():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("db.js", "utf8") + "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;", ctx);
vm.runInContext(fs.readFileSync("route-model.js", "utf8"), ctx);
const db = ctx.SUBSTANCE_DB;
const model = ctx.SEUIL_ROA_MODEL;
const expectations = [
  ["mdma", "Oral", "65 - 85 % (est.)"],
  ["lsd", "Oral", "70 - 90 % (est.)"],
  ["alcool", "Oral", "80 - 100 % (est.)"],
  ["cafeine", "Oral", "95 - 100 % (est.)"]
];
const problems = [];
const oralValues = new Set();
for (const [key, route, expected] of expectations) {
  const bio = model.getBioavailabilityForRoute(db[key], route);
  const value = bio && bio.value;
  oralValues.add(value);
  if (value !== expected) problems.push(`${key}/${route}: expected ${expected}, got ${value}`);
  if (!bio || bio.source === "estimation_route_generique") {
    problems.push(`${key}/${route}: still uses generic route fallback`);
  }
}
if (oralValues.size !== expectations.length) {
  problems.push(`oral estimates are not substance-specific: ${Array.from(oralValues).join(" | ")}`);
}
process.stdout.write(JSON.stringify({ problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["problems"] == []


def test_alcohol_dosing_uses_pure_alcohol_grams_not_glasses():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("db.js", "utf8") + "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;", ctx);
vm.runInContext(fs.readFileSync("i18n.js", "utf8"), ctx);
const alcohol = ctx.SUBSTANCE_DB.alcool;
const dict = ctx.window.SeuilI18n.phrases.en;
const problems = [];
if (!alcohol) problems.push("missing alcool card");
if (alcohol && alcohol.dosages.unit !== "g d’alcool pur") problems.push(`unit=${alcohol.dosages.unit}`);
if (alcohol && /verre/i.test(alcohol.dosages.unit)) problems.push("unit still uses glasses");
for (const field of ["threshold", "light", "common", "strong", "heavy"]) {
  if (!String(alcohol.dosages[field]).includes("g")) problems.push(`${field} is not in grams`);
}
for (const phrase of [
  "g d’alcool pur",
  "100 % (par définition)",
  "Fixer une limite avant de commencer et noter les grammes d’alcool pur limite l’escalade liée à la désinhibition.",
  "Repères en grammes d’alcool pur : un verre standard français correspond environ à 10 g, mais le volume servi, le degré d’alcool, la vitesse de consommation, fatigue et mélanges modifient fortement le risque."
]) {
  if (!dict[phrase]) problems.push(`missing translation: ${phrase}`);
}
process.stdout.write(JSON.stringify({ problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["problems"] == []


def test_route_model_exposes_only_practical_routes_with_complete_rows():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("db.js", "utf8") + "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;", ctx);
vm.runInContext(fs.readFileSync("substances-data.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("psychonaut-data.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("index-substances.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("substances-detail.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("route-model.js", "utf8"), ctx);
const db = ctx.SUBSTANCE_DB;
const model = ctx.SEUIL_ROA_MODEL;
const requiredDose = ["unit", "threshold", "light", "common", "strong", "heavy"];
const requiredDur = ["onset", "comeup", "peak", "offset", "total"];
const problems = [];

function hasNumericDose(dosages) {
  return requiredDose.some((field) => /\d/.test(String(dosages && dosages[field] || "")));
}

function percentMid(text) {
  const nums = String(text || "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/g);
  if (!nums || !nums.length) return null;
  const values = nums.map(Number).filter((n) => Number.isFinite(n) && n >= 0 && n <= 100);
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length / 100;
}

function bioMidFor(sub, route) {
  const bio = model.getBioavailabilityForRoute(sub, route);
  const parsed = percentMid(bio && bio.value);
  return parsed === null ? 0.45 : parsed;
}

function doseMid(dosage, field) {
  const nums = String(dosage && dosage[field] || "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/g);
  if (!nums || !nums.length) return null;
  const values = nums.map(Number).filter(Number.isFinite);
  if (!values.length) return null;
  if (values.length === 1) return values[0];
  return (values[0] + values[1]) / 2;
}

function assertDoseAtOrBelow(subKey, highRoute, lowRoute, fields, tolerance) {
  const sub = db[subKey];
  const high = model.getDosageForRoute(sub, highRoute);
  const low = model.getDosageForRoute(sub, lowRoute);
  for (const field of fields) {
    const highValue = doseMid(high, field);
    const lowValue = doseMid(low, field);
    if (highValue === null || lowValue === null) continue;
    if (highValue > lowValue * (tolerance || 1.05)) {
      problems.push(`${subKey}/${highRoute}: ${field} ${high[field]} should not exceed ${lowRoute} ${low[field]}`);
    }
  }
}

if (!model) problems.push("missing SEUIL_ROA_MODEL");
for (const route of ["Oral", "Insufflé", "Inhalé", "Rectal", "Intraveineux", "Intramusculaire"]) {
  if (!model.ROUTE_ORDER.includes(route)) problems.push(`missing route ${route}`);
}

for (const [key, sub] of Object.entries(db)) {
  const routes = model.getRoutesForSubstance(sub);
  if (!Array.isArray(routes) || routes.length === 0) problems.push(`${key}: no exposed routes`);
  for (const route of routes) {
    if (!model.ROUTE_ORDER.includes(route)) problems.push(`${key}: unknown route ${route}`);

    const bio = model.getBioavailabilityForRoute(sub, route);
    const bioText = bio && (typeof bio === "string" ? bio : bio.value);
    if (!bioText || (!String(bioText).includes("%") && !/non quantifi|non applicable/i.test(String(bioText)))) {
      problems.push(`${key}/${route}: missing bioavailability value`);
    }

    const dosage = model.getDosageForRoute(sub, route);
    for (const field of requiredDose) {
      if (!dosage || dosage[field] === undefined || dosage[field] === "") problems.push(`${key}/${route}: missing dosage ${field}`);
    }

    const durations = model.getDurationsForRoute(sub, route);
    for (const field of requiredDur) {
      const value = durations && durations[field];
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        problems.push(`${key}/${route}: invalid duration ${field}`);
      }
    }
  }
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const mdmaRoutes = model.getRoutesForSubstance(db.mdma);
for (const route of ["Oral", "Insufflé", "Rectal", "Intraveineux", "Intramusculaire"]) {
  if (!mdmaRoutes.includes(route)) problems.push(`mdma should keep practical route ${route}`);
}
for (const route of ["Sublingual", "Buccal", "Subcutané"]) {
  if (mdmaRoutes.includes(route)) problems.push(`mdma should not expose marginal route ${route}`);
}
if (!same(model.getRoutesForSubstance(db.alcool), ["Oral"])) problems.push(`alcool routes: ${model.getRoutesForSubstance(db.alcool).join(",")}`);
if (!same(model.getRoutesForSubstance(db.poppers), ["Inhalé"])) problems.push(`poppers routes: ${model.getRoutesForSubstance(db.poppers).join(",")}`);
if (!same(model.getRoutesForSubstance(db.protoxyde_azote), ["Inhalé"])) problems.push(`protoxyde routes: ${model.getRoutesForSubstance(db.protoxyde_azote).join(",")}`);
const cannabisRoutes = model.getRoutesForSubstance(db.cannabis);
if (!same(cannabisRoutes, ["Oral", "Inhalé"])) problems.push(`cannabis routes: ${cannabisRoutes.join(",")}`);
const cbcRoutes = model.getRoutesForSubstance(db.cbc);
if (!db.cbc) problems.push("cbc should be present in the public substance directory");
if (db.cbc && db.cbc.name !== "CBC") problems.push(`cbc name: ${db.cbc.name}`);
if (db.cbc && db.cbc.class !== "cannabinoid") problems.push(`cbc class: ${db.cbc.class}`);
if (db.cbc && !(db.cbc.aliases || []).includes("cannabichromene")) {
  problems.push("cbc should include cannabichromene alias");
}
if (!same(cbcRoutes, ["Oral", "Inhalé"])) problems.push(`cbc routes: ${cbcRoutes.join(",")}`);
for (const route of ["Oral", "Inhalé"]) {
  const dosage = model.getDosageForRoute(db.cbc, route);
  if (!dosage || dosage.unit !== "mg (est.)") problems.push(`cbc/${route}: dosage should use estimated mg ranges`);
  const bio = model.getBioavailabilityForRoute(db.cbc, route);
  const bioValue = String(bio && (bio.value || bio) || "");
  if (route === "Oral" && !bioValue.includes("6 - 20 %")) problems.push(`cbc/${route}: should use oral cannabinoid bioavailability estimate`);
  if (route === "Inhalé" && !bioValue.includes("10 - 35 %")) problems.push(`cbc/${route}: should use inhaled cannabinoid bioavailability estimate`);
  const durations = model.getDurationsForRoute(db.cbc, route);
  if (!durations || durations._sourceRoute !== route) problems.push(`cbc/${route}: should use explicit timeline`);
}
const cbcOralDose = model.getDosageForRoute(db.cbc, "Oral");
if (cbcOralDose.common !== "10 - 25 mg") problems.push(`cbc oral common dose: ${cbcOralDose.common}`);
const cbcInhaledDose = model.getDosageForRoute(db.cbc, "Inhalé");
if (cbcInhaledDose.common !== "3 - 10 mg") problems.push(`cbc inhaled common dose: ${cbcInhaledDose.common}`);
const cbcOralDurations = model.getDurationsForRoute(db.cbc, "Oral");
if (cbcOralDurations.onset !== 5400 || cbcOralDurations.total !== 28800) {
  problems.push(`cbc oral timeline should reflect slower oral cannabinoid PK: ${JSON.stringify(cbcOralDurations)}`);
}
const cbcInhaledDurations = model.getDurationsForRoute(db.cbc, "Inhalé");
if (cbcInhaledDurations.onset !== 300 || cbcInhaledDurations.total !== 10800) {
  problems.push(`cbc inhaled timeline should reflect faster inhaled cannabinoid PK: ${JSON.stringify(cbcInhaledDurations)}`);
}
for (const route of ["Insufflé", "Rectal", "Intraveineux", "Intramusculaire"]) {
  if (cbcRoutes.includes(route)) problems.push(`cbc should not expose ${route}: ${cbcRoutes.join(",")}`);
  if (model.getBioavailabilityForRoute(db.cbc, route)) problems.push(`cbc/${route}: hidden route should not expose bioavailability`);
  if (model.getDurationsForRoute(db.cbc, route)) problems.push(`cbc/${route}: hidden route should not expose timeline`);
}
const restrictedPsychedelicKeys = [
  "nbome_25i", "nbome_25c", "nbome_25b",
  "lsd", "1p_lsd", "1cp_lsd", "lsa", "eth_lad", "al_lad", "ald_52",
  "champignons"
];
const removedPsychedelicRoutes = ["Insufflé", "Rectal", "Intraveineux", "Intramusculaire"];
for (const key of restrictedPsychedelicKeys) {
  const routes = model.getRoutesForSubstance(db[key]);
  for (const route of removedPsychedelicRoutes) {
    if (routes.includes(route)) problems.push(`${key} should not expose ${route}: ${routes.join(",")}`);
    const hiddenBio = model.getBioavailabilityForRoute(db[key], route);
    if (hiddenBio) problems.push(`${key}/${route}: hidden route should not expose bioavailability`);
    const hiddenDurations = model.getDurationsForRoute(db[key], route);
    if (hiddenDurations) problems.push(`${key}/${route}: hidden route should not expose timeline`);
  }
}
const salviaRoutes = model.getRoutesForSubstance(db.salvia);
if (!same(salviaRoutes, ["Inhalé"])) problems.push(`salvia routes: ${salviaRoutes.join(",")}`);
if (model.getBioavailabilityForRoute(db.salvia, "Sublingual")) {
  problems.push("salvia/Sublingual: hidden route should not expose bioavailability");
}
if (model.getDurationsForRoute(db.salvia, "Sublingual")) {
  problems.push("salvia/Sublingual: hidden route should not expose timeline");
}
const psychonautOnlyRoutes = {
  salvia: ["Inhalé"],
  dmt: ["Inhalé", "Intraveineux"],
  nicotine: ["Oral", "Buccal", "Inhalé"]
};
for (const [key, expectedRoutes] of Object.entries(psychonautOnlyRoutes)) {
  const routes = model.getRoutesForSubstance(db[key]);
  if (!same(routes, expectedRoutes)) problems.push(`${key} PsychonautWiki-only routes: ${routes.join(",")}`);
  for (const route of routes) {
    const bio = model.getBioavailabilityForRoute(db[key], route);
    if (!bio) problems.push(`${key}/${route}: missing PsychonautWiki bioavailability value`);
    if (bio && bio.source === "estimation_substance_profile") {
      problems.push(`${key}/${route}: should not use estimated bioavailability when PsychonautWiki route is explicit`);
    }
    const durations = model.getDurationsForRoute(db[key], route);
    if (!durations || durations._estimated || durations._sourceRoute !== route) {
      problems.push(`${key}/${route}: should use explicit PsychonautWiki timeline`);
    }
  }
}
const removedLowInterestRouteKeys = [
  "ghb", "dxm", "codeine", "tramadol", "clonazepam", "diazepam", "pregabaline", "gabapentine",
  "zopiclone", "phenibut", "alprazolam", "flualprazolam", "clonazolam", "etizolam", "ephedrine",
  "carisoprodol", "tianeptine", "modafinil", "baclofene", "cafeine", "dph", "datura", "zolpidem",
  "mescaline", "loperamide", "kava", "amanite"
];
const removedLowInterestRoutes = ["Insufflé", "Rectal", "Intraveineux", "Intramusculaire"];
for (const key of removedLowInterestRouteKeys) {
  if (!db[key]) {
    problems.push(`${key}: missing requested substance`);
    continue;
  }
  const routes = model.getRoutesForSubstance(db[key]);
  for (const route of removedLowInterestRoutes) {
    if (routes.includes(route)) problems.push(`${key} should not expose ${route}: ${routes.join(",")}`);
    if (model.getBioavailabilityForRoute(db[key], route)) {
      problems.push(`${key}/${route}: hidden route should not expose bioavailability`);
    }
    if (model.getDurationsForRoute(db[key], route)) {
      problems.push(`${key}/${route}: hidden route should not expose timeline`);
    }
  }
}
const caffeineRoutes = model.getRoutesForSubstance(db.cafeine);
if (!same(caffeineRoutes, ["Oral"])) problems.push(`cafeine routes: ${caffeineRoutes.join(",")}`);
if (model.getBioavailabilityForRoute(db.cafeine, "Inhalé")) {
  problems.push("cafeine/Inhalé: hidden route should not expose bioavailability");
}
if (model.getDurationsForRoute(db.cafeine, "Inhalé")) {
  problems.push("cafeine/Inhalé: hidden route should not expose timeline");
}
const alprazolamRoutes = model.getRoutesForSubstance(db.alprazolam);
if (!same(alprazolamRoutes, ["Oral"])) problems.push(`alprazolam routes: ${alprazolamRoutes.join(",")}`);
if (model.getBioavailabilityForRoute(db.alprazolam, "Inhalé")) {
  problems.push("alprazolam/Inhalé: hidden route should not expose bioavailability");
}
if (model.getDurationsForRoute(db.alprazolam, "Inhalé")) {
  problems.push("alprazolam/Inhalé: hidden route should not expose timeline");
}
const kratomRoutes = model.getRoutesForSubstance(db.kratom);
if (!same(kratomRoutes, ["Oral"])) problems.push(`kratom routes: ${kratomRoutes.join(",")}`);
for (const route of ["Sublingual", "Buccal", "Insufflé", "Inhalé", "Rectal", "Intraveineux", "Intramusculaire", "Subcutané"]) {
  if (model.getBioavailabilityForRoute(db.kratom, route)) {
    problems.push(`kratom/${route}: hidden route should not expose bioavailability`);
  }
  if (model.getDurationsForRoute(db.kratom, route)) {
    problems.push(`kratom/${route}: hidden route should not expose timeline`);
  }
}
if (db.ibogaine) problems.push("ibogaine should be absent from loaded substances");
for (const key of ["gbl", "bdo"]) {
  const routes = model.getRoutesForSubstance(db[key]);
  if (!same(routes, ["Oral"])) problems.push(`${key} liquid-only routes: ${routes.join(",")}`);
  for (const route of removedPsychedelicRoutes) {
    const hiddenBio = model.getBioavailabilityForRoute(db[key], route);
    if (hiddenBio) problems.push(`${key}/${route}: hidden liquid route should not expose bioavailability`);
    const hiddenDurations = model.getDurationsForRoute(db[key], route);
    if (hiddenDurations) problems.push(`${key}/${route}: hidden liquid route should not expose timeline`);
  }
}
const liquidOnly = {
  name: "Liquide de test",
  category: "Dépresseur",
  class: "depressant",
  description: "Substance disponible uniquement en liquide à mesurer précisément.",
  forms: ["liquide (à mesurer précisément)"],
  dosages: { unit: "ml", threshold: "0,1 ml", light: "0,2 ml", common: "0,3 ml", strong: "0,4 ml", heavy: "0,5 ml +" },
  durations_seconds: { onset: 600, comeup: 900, peak: 1800, offset: 3600, total: 7200 }
};
if (!same(model.getRoutesForSubstance(liquidOnly), ["Oral"])) {
  problems.push(`generic liquid-only routes: ${model.getRoutesForSubstance(liquidOnly).join(",")}`);
}
for (const key of ["methylphenidate", "oxycodone", "morphine"]) {
  const routes = model.getRoutesForSubstance(db[key]);
  for (const route of ["Oral", "Insufflé", "Rectal", "Intraveineux", "Intramusculaire"]) {
    if (!routes.includes(route)) problems.push(`${key} should keep practical route ${route}`);
  }
}
const mphRectalDose = model.getDosageForRoute(db.methylphenidate, "Rectal");
if (mphRectalDose._sourceRoute !== "Insufflé") {
  problems.push(`methylphenidate rectal dose should derive from insufflated Psychonaut data, got ${mphRectalDose._sourceRoute}`);
}
if (mphRectalDose.heavy !== "60 mg +") {
  problems.push(`methylphenidate rectal heavy should stay aligned with similar-bioavailability insufflated dose, got ${mphRectalDose.heavy}`);
}
const mphRectalDurations = model.getDurationsForRoute(db.methylphenidate, "Rectal");
if (mphRectalDurations._sourceRoute !== "Insufflé") {
  problems.push(`methylphenidate rectal timeline should derive from closest explicit route, got ${mphRectalDurations._sourceRoute}`);
}
for (const route of ["Rectal", "Intraveineux", "Intramusculaire"]) {
  assertDoseAtOrBelow("mephedrone", route, "Insufflé", ["common", "strong", "heavy"], 1.05);
}
for (const [key, sub] of Object.entries(db)) {
  const explicit = sub.dosages_by_route || {};
  const explicitRoutes = Object.keys(explicit)
    .map((route) => model.normalizeRoute(route))
    .filter((route) => route !== "Autre" && hasNumericDose(explicit[route]));
  if (explicitRoutes.length < 2) continue;
  const primary = model.inferPrimaryRoute(sub);
  for (const targetRoute of model.getRoutesForSubstance(sub)) {
    if (explicitRoutes.includes(targetRoute)) continue;
    const targetMid = bioMidFor(sub, targetRoute);
    const ranked = explicitRoutes
      .map((route) => ({ route, distance: Math.abs(bioMidFor(sub, route) - targetMid) }))
      .sort((a, b) => a.distance - b.distance);
    const best = ranked[0];
    const primaryMatch = ranked.find((item) => item.route === primary);
    const primaryDistance = primaryMatch ? primaryMatch.distance : Number.POSITIVE_INFINITY;
    if (best && best.route !== primary && best.distance + 0.05 < primaryDistance) {
      const estimated = model.getDosageForRoute(sub, targetRoute);
      if (estimated._sourceRoute === primary) {
        problems.push(`${key}/${targetRoute}: should avoid primary dose source ${primary} when ${best.route} is closer`);
      }
    }
    const estimated = model.getDosageForRoute(sub, targetRoute);
    if (!estimated._estimated) continue;
    const lowerExplicitRoutes = explicitRoutes.filter((route) => bioMidFor(sub, route) <= bioMidFor(sub, targetRoute) + 0.05);
    for (const sourceRoute of lowerExplicitRoutes) {
      const sourceDose = model.getDosageForRoute(sub, sourceRoute);
      for (const field of ["common", "strong", "heavy"]) {
        const estimatedValue = doseMid(estimated, field);
        const sourceValue = doseMid(sourceDose, field);
        if (estimatedValue === null || sourceValue === null) continue;
        if (estimatedValue > sourceValue * 1.2) {
          problems.push(`${key}/${targetRoute}: estimated ${field} ${estimated[field]} exceeds lower/equal-bio explicit ${sourceRoute} ${sourceDose[field]}`);
        }
      }
    }
  }
}
const morphineBio = model.getBioavailabilityForRoute(db.morphine, "Oral");
if (morphineBio && morphineBio.profile !== "opioid") problems.push(`morphine profile should stay opioid, got ${morphineBio.profile}`);
const lisdexamfetamine = {
  name: "Lisdexamfétamine",
  category: "Stimulant",
  class: "stimulant",
  description: "Prodrogue orale de la dextroamphétamine.",
  forms: ["gélule"],
  dosages: { unit: "mg", threshold: "10 mg", light: "20 mg", common: "30 - 50 mg", strong: "60 mg", heavy: "70 mg +" },
  durations_seconds: { onset: 3600, comeup: 3600, peak: 21600, offset: 21600, total: 43200 }
};
if (!same(model.getRoutesForSubstance(lisdexamfetamine), ["Oral"])) {
  problems.push(`lisdexamfetamine routes: ${model.getRoutesForSubstance(lisdexamfetamine).join(",")}`);
}

process.stdout.write(JSON.stringify({ total: Object.keys(db).length, routes: model && model.ROUTE_ORDER, problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    audit = json.loads(result.stdout)
    assert audit["total"] >= 121
    assert audit["problems"] == []


def test_release_profiles_and_metabolism_are_visible_and_safety_bounded():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const file of ["db.js", "substances-data.js", "psychonaut-data.js", "index-substances.js"]) {
  vm.runInContext(
    fs.readFileSync(file, "utf8") + (file === "db.js" ? "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;" : ""),
    ctx,
    { filename: file }
  );
}
const db = ctx.SUBSTANCE_DB;
const problems = [];
const releaseKeys = ["methylphenidate", "tramadol", "morphine", "hydromorphone", "oxycodone", "tapentadol"];
const prescriptionOnly = "Prescription uniquement - ne pas convertir LI vers LP";
for (const [key, sub] of Object.entries(db)) {
  if (!sub.metabolism && sub.omit_quantitative_tables !== true) {
    problems.push(`${key}: missing metabolism text or fallback`);
  }
}
for (const key of releaseKeys) {
  const sub = db[key];
  if (!sub) {
    problems.push(`${key}: missing substance`);
    continue;
  }
  if (!Array.isArray(sub.release_profiles) || sub.release_profiles.length < 2) {
    problems.push(`${key}: missing immediate/extended release profiles`);
    continue;
  }
  const er = sub.release_profiles.find((profile) => /prolongée|prolongee/i.test(profile.name || ""));
  if (!er) {
    problems.push(`${key}: missing extended-release profile`);
    continue;
  }
  if (!er.bioavailability || !er.timeline || !er.dosage || !er.warning) {
    problems.push(`${key}: incomplete extended-release profile`);
  }
  if (!Object.values(er.dosage || {}).every((value) => String(value).includes("Prescription uniquement"))) {
    problems.push(`${key}: extended-release dosage should stay prescription-only`);
  }
  if (!String(er.dosage.common || "").includes(prescriptionOnly)) {
    problems.push(`${key}: extended-release common dosage should block LI to LP conversion`);
  }
  if (!String(er.warning || "").includes("Ne pas écraser, couper, mâcher, dissoudre ou injecter une forme LP.")) {
    problems.push(`${key}: missing explicit crush/chew/dissolve/inject warning`);
  }
}
process.stdout.write(JSON.stringify({ problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["problems"] == []


def test_all_visible_substance_information_has_english_translation():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = {};
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync("db.js", "utf8") +
    "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;" +
    "globalThis.INTERACTION_MATRIX = INTERACTION_MATRIX;" +
    "globalThis.INTERACTION_CATEGORIES = INTERACTION_CATEGORIES;",
  ctx,
  { filename: "db.js" }
);
for (const file of ["substances-data.js", "psychonaut-data.js", "index-substances.js", "substances-detail.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
}
for (const file of ["i18n.js", "i18n-detail.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
}

const db = ctx.SUBSTANCE_DB;
const dict = ctx.SeuilI18n.phrases.en;
const textFields = new Set([
  "name", "category", "description", "profile", "legal_status", "dosage_warning",
  "source", "note", "value", "range", "unit", "threshold", "light", "common",
  "strong", "heavy", "onset", "comeup", "peak", "offset", "total"
]);
const arrayFields = new Set([
  "aliases", "forms", "effects", "risk_factors", "avoid_if", "warning_signs",
  "aftercare", "rdr_rules"
]);
const technical = new Set([
  "mg", "µg", "g", "ml", "A", "B", "C", "verre", "poudre", "huile", "vape",
  "sirop", "gélule", "feuilles", "fleurs", "résine", "cartouche", "patch",
  "cristaux", "liquide", "capsules", "blotter"
]);

function needsTranslation(value) {
  if (typeof value !== "string") return false;
  const text = value.trim();
  if (!text || text.length < 3 || technical.has(text)) return false;
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return false;
  if (/^[a-z0-9_-]+$/i.test(text) && text.length < 24 && !/[À-ÿœŒ]/.test(text)) return false;
  if (/^[0-9.,<>+~≈% /µa-zA-Z()–-]+$/.test(text) && /\d/.test(text) && !/[À-ÿœŒ]/.test(text)) return false;
  if (/^[A-Z0-9αΔ\-()/ .]+$/.test(text) && !/[À-ÿœŒ]/.test(text)) return false;
  if (!/[À-ÿœŒ]/.test(text) && !/\b(le|la|les|des|du|de|d'|une|un|avec|sans|effet|effets|risque|risques|prise|prises|dose|doses|redose|montée|descente|durée|forme|formes|voie|voies|produit|produits|mélange|mélanges|somnolence|respiration|conduite|éviter|attention|possible|possibles|fréquent|fréquente|poudre|buvard|graines|alcool|opioïdes?|dépresseurs?|stimulants?)\b/i.test(text)) {
    return false;
  }
  return true;
}

const strings = [];
function collect(path, value) {
  if (typeof value === "string") {
    if (needsTranslation(value)) strings.push([path, value.trim()]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collect(`${path}[${idx}]`, item));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (typeof nested === "string" && textFields.has(key)) {
      collect(`${path}.${key}`, nested);
    } else if (arrayFields.has(key)) {
      collect(`${path}.${key}`, nested);
    } else if (nested && typeof nested === "object" && [
      "dosages", "dosages_by_route", "durations", "bioavailability_by_route"
    ].includes(key)) {
      collect(`${path}.${key}`, nested);
    }
  }
}

for (const [key, sub] of Object.entries(db)) collect(`SUBSTANCE_DB.${key}`, sub);
for (const [key, inter] of Object.entries(ctx.INTERACTION_MATRIX || {})) {
  collect(`INTERACTION_MATRIX.${key}.note`, inter.note);
}
for (const [key, category] of Object.entries(ctx.INTERACTION_CATEGORIES || {})) {
  collect(`INTERACTION_CATEGORIES.${key}.name`, category.name);
  collect(`INTERACTION_CATEGORIES.${key}.description`, category.description);
}

const missing = [];
const seen = new Set();
for (const [path, value] of strings) {
  if (seen.has(value)) continue;
  seen.add(value);
  if (!Object.prototype.hasOwnProperty.call(dict, value) || dict[value] === value) {
    missing.push({ path, value });
  }
}

process.stdout.write(JSON.stringify({
  totalSubstances: Object.keys(db).length,
  checked: seen.size,
  missing: missing.slice(0, 80),
  missingCount: missing.length
}));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    audit = json.loads(result.stdout)

    assert audit["totalSubstances"] >= 120
    assert audit["missing"] == []


def test_all_warning_signs_render_as_english_in_english_mode():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = { console };
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);

vm.runInContext(
  fs.readFileSync("db.js", "utf8") +
    "\n;globalThis.SUBSTANCE_DB = SUBSTANCE_DB;" +
    "globalThis.INTERACTION_MATRIX = INTERACTION_MATRIX;" +
    "globalThis.INTERACTION_CATEGORIES = INTERACTION_CATEGORIES;",
  ctx,
  { filename: "db.js" }
);
for (const file of ["substances-data.js", "psychonaut-data.js", "index-substances.js", "substances-detail.js", "i18n.js", "i18n-detail.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
}

const dict = ctx.SeuilI18n.phrases.en;
const sources = {
  SUBSTANCE_DB: ctx.SUBSTANCE_DB,
  SEUIL_RICH: ctx.SEUIL_RICH,
  SEUIL_DETAIL: ctx.SEUIL_DETAIL
};
const warnings = [];

function addWarning(path, value) {
  if (typeof value !== "string") return;
  const text = value.trim();
  if (!text || text === "-") return;
  warnings.push({ path, value: text });
}

function collectWarningSigns(path, value) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value.warning_signs)) {
    value.warning_signs.forEach((item, idx) => addWarning(`${path}.warning_signs[${idx}]`, item));
  }
  for (const [key, nested] of Object.entries(value)) {
    if (nested && typeof nested === "object") collectWarningSigns(`${path}.${key}`, nested);
  }
}

function collectAppWarningSigns() {
  const source = fs.readFileSync("app.js", "utf8");
  const arrayRe = /warning_signs\s*:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = arrayRe.exec(source))) {
    const stringRe = /"((?:[^"\\]|\\.)*)"/g;
    let str;
    while ((str = stringRe.exec(match[1]))) {
      addWarning(`app.js.warning_signs[${warnings.length}]`, JSON.parse(`"${str[1]}"`));
    }
  }
}

function looksFrench(text) {
  return /[À-ÿœŒ«»]/.test(text) ||
    /\b(angoisse|douleur|thoracique|malaise|vomissements|respiration|somnolence|convulsions|fièvre|lèvres|bleutées|perte de connaissance|tachycardie|sueurs|chutes|sevrage|réveiller|cœur|délire|agitation|incontrôlable|persistante|sévère|sèche|rouge|urinaire|déshydratation)\b/i.test(text);
}

for (const [name, obj] of Object.entries(sources)) collectWarningSigns(name, obj);
collectAppWarningSigns();

const seen = new Map();
for (const item of warnings) {
  if (!seen.has(item.value)) seen.set(item.value, item.path);
}

const missing = [];
const unchangedFrench = [];
for (const [value, path] of seen) {
  const hasTranslation = Object.prototype.hasOwnProperty.call(dict, value);
  const translated = hasTranslation ? dict[value] : value;
  if (!hasTranslation) missing.push({ path, value });
  if (translated === value && looksFrench(value)) unchangedFrench.push({ path, value });
}

process.stdout.write(JSON.stringify({
  warningItems: warnings.length,
  uniqueWarningItems: seen.size,
  sourceCounts: Object.fromEntries(
    Object.entries(sources).map(([name, obj]) => [name, obj && typeof obj === "object" ? Object.keys(obj).length : 0])
  ),
  missing: missing.slice(0, 80),
  unchangedFrench: unchangedFrench.slice(0, 80)
}));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    audit = json.loads(result.stdout)

    assert audit["sourceCounts"]["SUBSTANCE_DB"] >= 120
    assert audit["sourceCounts"]["SEUIL_RICH"] >= 89
    assert audit["sourceCounts"]["SEUIL_DETAIL"] >= 120
    assert audit["warningItems"] >= 521
    assert audit["uniqueWarningItems"] >= 220
    assert audit["missing"] == []
    assert audit["unchangedFrench"] == []
