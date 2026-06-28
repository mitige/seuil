/* Seuil - ai.js : pont IA local (claude/codex) + repli copier-coller + prompts de réduction des risques. */
(function () {
  "use strict";
  const AI_MAINTENANCE = true;
  const AI_MAINTENANCE_MESSAGE = "Assistant IA en maintenance temporaire.";
  const AI = { bridge: false, clis: { claude: false, codex: false }, token: null, provider: null, ready: false };

  async function detectBridge() {
    if (AI_MAINTENANCE) {
      AI.bridge = false;
      AI.clis = { claude: false, codex: false };
      AI.token = null;
      AI.provider = null;
      AI.ready = true;
      return false;
    }
    try {
      const res = await fetch("/api/ai/status", { headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error();
      const d = await res.json();
      AI.bridge = !!d.bridge; AI.clis = d.clis || {}; AI.token = d.token || null;
    } catch (_) { AI.bridge = false; }
    const saved = (typeof appState !== "undefined" && appState.aiSettings && appState.aiSettings.provider) || null;
    AI.provider = (saved && AI.clis[saved]) ? saved
      : (AI.clis.claude ? "claude" : (AI.clis.codex ? "codex" : null));
    AI.ready = true;
    return AI.bridge;
  }

  async function callBridge(prompt) {
    if (AI_MAINTENANCE) throw new Error(AI_MAINTENANCE_MESSAGE);
    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-RDR-Bridge-Token": AI.token || "" },
      body: JSON.stringify({ provider: AI.provider, prompt })
    });
    const d = await res.json();
    if (!d.ok) throw new Error(d.error || "Échec de l'analyse IA.");
    return d.output;
  }

  const PREAMBLE =
    "Tu es un assistant spécialisé en réduction des risques liés aux substances psychoactives. " +
    "Réponds en français, factuel, non-jugeant, orienté sécurité et concret (puces). Tu n'encourages pas la consommation : " +
    "tu aides à en réduire les risques. Tu ne remplaces pas un avis médical ; en cas d'urgence, appeler le 15 / 112.";

  function promptSessionAnalysis(session, subInfo) {
    const L = [PREAMBLE, "", "## Session de consommation en cours",
      `Substance : ${subInfo ? subInfo.name : session.substanceName} (${subInfo ? subInfo.category : "?"})`,
      `Voie : ${session.route} · Set & setting : ${session.setSetting}`,
      `Dose initiale : ${session.initialDose} ${session.unit} · Cumulée : ${session.cumulativeDose} ${session.unit}`,
      "Journal :"];
    (session.logs || []).forEach(l => L.push(`- ${new Date(l.time).toLocaleTimeString("fr-FR")} · ${l.type} · ${l.note || (l.dose + " " + session.unit)}`));
    if (subInfo && subInfo.rdr_rules) L.push("", "Règles de réduction des risques connues : " + subInfo.rdr_rules.join(" | "));
    L.push("", "Analyse : phase actuelle de la courbe, risques à surveiller maintenant, prudence du redosage, conseils pour la suite et la récupération.");
    return L.join("\n");
  }

  function promptPreSession(p, subInfo, recent) {
    const L = [PREAMBLE, "", "## Contrôle de risque AVANT une prise",
      `Substance : ${subInfo ? subInfo.name : p.name}`,
      `Dose prévue : ${p.dose} ${p.unit} · Voie : ${p.route} · Set & setting : ${p.setSetting}`];
    if (subInfo && subInfo.dosages) L.push(`Paliers : seuil ${subInfo.dosages.threshold}, léger ${subInfo.dosages.light}, commun ${subInfo.dosages.common}, fort ${subInfo.dosages.strong}, intense ${subInfo.dosages.heavy}`);
    if (recent && recent.length) L.push("Historique récent : " + recent.map(r => `${r.name} (${new Date(r.startTime).toLocaleDateString("fr-FR")})`).join(", "));
    if (subInfo && subInfo.rdr_rules) L.push("Règles de réduction des risques : " + subInfo.rdr_rules.join(" | "));
    L.push("", "Évalue le risque (dose vs paliers, voie, set/setting, fréquence/tolérance), liste les précautions prioritaires, et dis si réduire/renoncer serait plus sûr.");
    return L.join("\n");
  }

  function promptAssistant(q) {
    return [PREAMBLE, "", "## Question de réduction des risques", q, "", "Réponds de façon pratique."].join("\n");
  }

  function promptInteraction(s1, s2, known) {
    const L = [PREAMBLE, "", "## Décryptage d'un mélange de substances",
      `Substance A : ${s1 ? s1.name : "?"} (${s1 ? s1.category : "?"})`,
      `Substance B : ${s2 ? s2.name : "?"} (${s2 ? s2.category : "?"})`];
    if (known) L.push(`Donnée d'interaction connue : ${known.category} - ${known.note || ""}`);
    [["A", s1], ["B", s2]].forEach(([tag, s]) => {
      if (s && s.rdr_rules) L.push(`Règles de réduction des risques ${tag} : ${s.rdr_rules.slice(0, 3).join(" | ")}`);
    });
    L.push("", "Explique les risques de ce mélange (mécanismes, dangers spécifiques, signaux d'alerte) et les mesures de réduction des risques. Si l'association est dangereuse ou mortelle, dis-le clairement.");
    return L.join("\n");
  }

  function summarizeHistory(sessions) {
    const byName = {};
    sessions.forEach(s => { const n = s.substanceName || "?"; byName[n] = (byName[n] || 0) + 1; });
    const lines = sessions.slice(0, 25).map(s => `- ${new Date(s.startTime).toLocaleString("fr-FR")} · ${s.substanceName} · ${s.cumulativeDose} ${s.unit}`);
    const counts = Object.entries(byName).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ×${c}`).join(", ");
    return { counts, lines };
  }

  function promptTrends(sessions) {
    if (!sessions || !sessions.length) return null;
    const { counts, lines } = summarizeHistory(sessions);
    return [PREAMBLE, "", "## Analyse de tendances de consommation",
      `Total de sessions : ${sessions.length}. Répartition : ${counts}.`,
      "Sessions (récentes d'abord) :", ...lines, "",
      "Analyse : fréquence, espacement, signes d'escalade de doses, signaux de tolérance ou de perte de contrôle. Propose des repères concrets de réduction des risques (espacement, pauses, limites)."].join("\n");
  }

  function promptDebrief(session) {
    if (!session) return null;
    const L = [PREAMBLE, "", "## Débrief d'une session terminée",
      `Substance : ${session.substanceName} · Dose cumulée : ${session.cumulativeDose} ${session.unit} · Voie : ${session.route}`,
      `Début : ${new Date(session.startTime).toLocaleString("fr-FR")}` + (session.endTime ? ` · Fin : ${new Date(session.endTime).toLocaleString("fr-FR")}` : ""),
      "Journal :"];
    (session.logs || []).forEach(l => L.push(`- ${new Date(l.time).toLocaleTimeString("fr-FR")} · ${l.type} · ${l.note || (l.dose + " " + session.unit)}`));
    L.push("", "Fais un débrief bienveillant : ce qui s'est bien passé côté sécurité, les points de vigilance, et 2-3 pistes concrètes pour réduire les risques la prochaine fois (récupération, espacement, hydratation, set & setting).");
    return L.join("\n");
  }

  function promptComparison(subs) {
    if (!subs || subs.length < 2) return null;
    const L = [PREAMBLE, "", "## Comparaison de substances",
      "Substances comparées : " + subs.map(s => s.name).join(", "), ""];
    subs.forEach(s => {
      L.push(`### ${s.name} (${s.category})`);
      if (s.durations) L.push(`Durées : montée ${s.durations.onset}, plateau ${s.durations.peak}, total ${s.durations.total}`);
      if (s.dosages) L.push(`Paliers : commun ${s.dosages.common}, fort ${s.dosages.strong}`);
    });
    L.push("", "Compare montée/plateau/durée et profils de risque. Souligne les différences pertinentes pour la réduction des risques (durée d'immobilisation, fenêtres de redosage, cumul de fatigue), sans jamais conseiller de mélange.");
    return L.join("\n");
  }

  window.RDR_AI = { state: AI, detectBridge, callBridge, promptSessionAnalysis, promptPreSession, promptAssistant, promptInteraction, promptTrends, promptDebrief, promptComparison };
})();

/* ---- UI IA : modale, déclencheurs, réglages, consentement ---- */
(function () {
  "use strict";
  const AI_MAINTENANCE = true;
  const AI_MAINTENANCE_MESSAGE = "Assistant IA en maintenance temporaire.";
  const AI = window.RDR_AI;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const aiText = key => (typeof window.t === "function" ? window.t(key) : key);

  function aiEnabled() { return !!(typeof appState !== "undefined" && appState.aiSettings && appState.aiSettings.enabled); }
  function saveAiSettings() { if (typeof saveLocalData === "function") saveLocalData(); }

  function renderMd(t) {
    return esc(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/^\s*[-*]\s+(.*)$/gm, "• $1").replace(/\n/g, "<br>");
  }

  let currentPrompt = "";
  function openModal(title, sub, prompt) {
    currentPrompt = prompt;
    $("ai-title").textContent = title;
    $("ai-sub").textContent = sub;
    $("ai-prompt").value = prompt;
    $("ai-result").style.display = "none"; $("ai-result").innerHTML = "";
    const prov = AI.state.provider;
    $("ai-provider-row").innerHTML = AI.state.bridge
      ? `Pont local actif · fournisseur : <strong>${esc(prov || "aucun CLI détecté")}</strong>`
      : "Pont local indisponible - copiez le prompt dans votre Claude Code / Codex / claude.ai.";
    const actions = $("ai-actions"); actions.innerHTML = "";
    if (AI.state.bridge && prov) {
      const run = document.createElement("button");
      run.className = "btn btn-primary"; run.textContent = "Lancer l'analyse";
      run.onclick = async () => {
        run.disabled = true; run.textContent = "Analyse en cours…";
        const r = $("ai-result"); r.style.display = "block"; r.innerHTML = '<span style="color:var(--color-text-muted)">…</span>';
        try { r.innerHTML = renderMd(await AI.callBridge(prompt)); }
        catch (e) { r.innerHTML = '<span style="color:#fca5a5">' + esc(e.message) + "</span>"; }
        run.disabled = false; run.textContent = "Relancer";
      };
      actions.appendChild(run);
    }
    $("ai-modal").classList.add("open");
  }

  async function withConsent(fn) {
    if (AI_MAINTENANCE) { alert(aiText(AI_MAINTENANCE_MESSAGE)); return; }
    if (!aiEnabled()) { alert("Activez d'abord l'assistant IA dans Paramètres."); return; }
    if (!appState.aiSettings.consented) {
      if (!confirm("Analyse IA : les données concernées seront envoyées à votre fournisseur IA via votre CLI local - elles quittent l'appareil. Le reste de l'app demeure local. Continuer ?")) return;
      appState.aiSettings.consented = true; saveAiSettings();
    }
    if (!AI.state.ready) await AI.detectBridge();
    fn();
  }

  function recentSessions(n) {
    return (appState.sessions || []).slice(0, n).map(s => ({ name: s.substanceName, startTime: s.startTime }));
  }

  function wire() {
    if (!$("ai-modal")) return;
    if (AI_MAINTENANCE) {
      disableAiUi();
      return;
    }
    $("ai-close").onclick = () => $("ai-modal").classList.remove("open");
    $("ai-modal").onclick = e => { if (e.target.id === "ai-modal") $("ai-modal").classList.remove("open"); };
    $("ai-copy").onclick = () => {
      if (navigator.clipboard) navigator.clipboard.writeText(currentPrompt);
      $("ai-copy").textContent = "Copié"; setTimeout(() => $("ai-copy").textContent = "Copier le prompt", 1500);
    };

    const btnS = $("btn-ai-session");
    if (btnS) btnS.onclick = () => withConsent(() => {
      const s = appState.activeSession; if (!s) return alert("Aucune session active.");
      const sub = getMergedSubstanceDb()[s.substanceKey];
      openModal("Analyse de la session", "Analyse de la courbe et des risques en cours.", AI.promptSessionAnalysis(s, sub));
    });

    const btnP = $("btn-ai-presession");
    if (btnP) btnP.onclick = () => withConsent(() => {
      const key = $("substance-select").value;
      const sub = getMergedSubstanceDb()[key];
      const p = { name: sub ? sub.name : (($("input-custom-substance") || {}).value || "?"),
        dose: ($("input-dosage") || {}).value || "?", unit: ($("unit-display") || {}).value || "mg",
        route: ($("route-select") || {}).value, setSetting: ($("input-set-setting") || {}).value };
      openModal("Contrôle de risque pré-session", "Évaluation avant de démarrer.", AI.promptPreSession(p, sub, recentSessions(5)));
    });

    const btnA = $("btn-ai-assistant");
    if (btnA) btnA.onclick = () => withConsent(() => {
      const q = window.prompt("Votre question de réduction des risques :");
      if (q) openModal("Assistant", "Question libre.", AI.promptAssistant(q));
    });

    const enable = $("ai-enable"), detail = $("ai-settings-detail");
    if (enable) {
      if (!appState.aiSettings) appState.aiSettings = { enabled: false, provider: null, consented: false };
      enable.checked = aiEnabled(); if (detail) detail.style.display = enable.checked ? "block" : "none";
      enable.onchange = () => { appState.aiSettings.enabled = enable.checked; if (detail) detail.style.display = enable.checked ? "block" : "none"; saveAiSettings(); if (enable.checked && !AI.state.ready) AI.detectBridge(); };
      const provSel = $("ai-provider-select");
      if (provSel) {
        provSel.value = appState.aiSettings.provider || AI.state.provider || "claude";
        provSel.onchange = () => { appState.aiSettings.provider = provSel.value; AI.state.provider = provSel.value; saveAiSettings(); };
      }
      const test = $("ai-test");
      if (test) test.onclick = async () => {
        await AI.detectBridge();
        $("ai-status-text").textContent = AI.state.bridge
          ? `Pont OK · CLI : ${Object.keys(AI.state.clis).filter(k => AI.state.clis[k]).join(", ") || "aucun"}`
          : "Pont indisponible (lancez l'app via run.bat / serve.py).";
      };
    }

    const btnI = $("btn-ai-interaction");
    if (btnI) btnI.onclick = () => withConsent(() => {
      const db = getMergedSubstanceDb();
      const k1 = ($("inter-select-1") || {}).value, k2 = ($("inter-select-2") || {}).value;
      if (!k1 || !k2) return alert("Sélectionnez deux substances dans le calculateur d'interactions.");
      let known = null;
      try { known = (typeof INTERACTION_MATRIX !== "undefined") && ((INTERACTION_MATRIX[k1] && INTERACTION_MATRIX[k1][k2]) || (INTERACTION_MATRIX[k2] && INTERACTION_MATRIX[k2][k1])) || null; } catch (_) {}
      openModal("Décryptage d'interaction", "Analyse d'un mélange.", AI.promptInteraction(db[k1], db[k2], known));
    });

    const btnC = $("btn-ai-comparison");
    if (btnC) btnC.onclick = () => withConsent(() => {
      const sel = (typeof window.getCompareSelection === "function") ? window.getCompareSelection() : [];
      if (sel.length < 2) return alert("Ajoutez au moins deux substances au comparateur.");
      const db = getMergedSubstanceDb();
      openModal("Comparaison de substances", "Lecture comparée des courbes.", AI.promptComparison(sel.map(k => db[k]).filter(Boolean)));
    });

    const btnT = $("btn-ai-trends");
    if (btnT) btnT.onclick = () => withConsent(() => {
      const p = AI.promptTrends(appState.sessions || []);
      if (!p) return alert("Aucune session enregistrée à analyser.");
      openModal("Analyse de tendances", "Lecture de votre historique.", p);
    });

    const btnD = $("btn-ai-debrief");
    if (btnD) btnD.onclick = () => withConsent(() => {
      const last = (appState.sessions || [])[0];
      const p = AI.promptDebrief(last);
      if (!p) return alert("Aucune session terminée à débriefer.");
      openModal("Débrief de session", "Dernière session terminée.", p);
    });
  }

  function disableAiUi() {
    AI.bridge = false;
    AI.clis = { claude: false, codex: false };
    AI.token = null;
    AI.provider = null;
    AI.ready = true;

    ["btn-ai-session", "btn-ai-presession", "btn-ai-comparison", "btn-ai-interaction", "btn-ai-trends", "btn-ai-debrief", "btn-ai-assistant", "ai-test"]
      .forEach(id => {
        const btn = $(id);
        if (!btn) return;
        btn.disabled = true;
        btn.title = aiText(AI_MAINTENANCE_MESSAGE);
        btn.style.cursor = "not-allowed";
        btn.style.opacity = "0.55";
      });

    const enable = $("ai-enable");
    if (enable) {
      enable.checked = false;
      enable.disabled = true;
      enable.title = aiText(AI_MAINTENANCE_MESSAGE);
      enable.style.cursor = "not-allowed";
      if (typeof appState !== "undefined" && appState.aiSettings) {
        appState.aiSettings.enabled = false;
      }
    }
    const provider = $("ai-provider-select");
    if (provider) provider.disabled = true;
    const detail = $("ai-settings-detail");
    if (detail) detail.style.display = "block";
    const status = $("ai-status-text");
    if (status) status.textContent = aiText(AI_MAINTENANCE_MESSAGE);
  }

  // Détection paresseuse : on ne sonde le pont que si l'IA est activée (sinon : aucune requête, console propre en statique).
  document.addEventListener("DOMContentLoaded", async () => { wire(); if (aiEnabled()) await AI.detectBridge(); });
})();
