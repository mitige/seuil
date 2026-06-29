/* Seuil - assistant IA sobre, via API serveur OpenRouter. */
(function () {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const PROMPT_LIMIT = 2900;
    const RESPONSE_STYLE_GUIDE = [
        "Answer with enough detail to be genuinely useful: aim for 5 to 8 short paragraphs or bullet groups.",
        "Use a calm educational structure: quick reading, context interpretation, what the data suggests, practical next steps, and limits.",
        "Include one measured vigilance section for warning signs or when to seek help.",
        "Do not let emergency or danger language dominate the answer unless the supplied context clearly indicates immediate danger.",
        "Avoid repeating generic disclaimers; make the explanation specific to the session, trend, curve, or combination."
    ].join("\n");

    function aiText(key, vars) {
        if (typeof window.t === "function") return window.t(key, vars);
        let text = String(key || "");
        if (vars && typeof vars === "object") {
            Object.keys(vars).forEach((name) => {
                text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
            });
        }
        return text;
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function clampText(text, max) {
        const value = String(text || "");
        return value.length > max ? `${value.slice(0, max - 40)}\n[contexte tronque]` : value;
    }

    function currentLanguageName() {
        const lang = window.SeuilI18n && typeof SeuilI18n.getLanguage === "function" ? SeuilI18n.getLanguage() : "fr";
        return lang === "en" ? "English" : "French";
    }

    function getSnapshot() {
        if (typeof window.getSeuilAiSnapshot === "function") return window.getSeuilAiSnapshot();
        return { activeSession: null, sessions: [], compareSelection: [], language: "fr" };
    }

    function getSubstanceSummary(key) {
        if (typeof window.getSeuilSubstanceSummary === "function") return window.getSeuilSubstanceSummary(key);
        return null;
    }

    function formatDose(session) {
        if (!session) return "-";
        const dose = session.cumulativeDose == null ? session.initialDose : session.cumulativeDose;
        return `${dose == null ? "unknown" : dose} ${session.unit || ""}`.trim();
    }

    function formatDateTime(value) {
        if (!value) return "-";
        try { return new Date(value).toLocaleString(); } catch (_) { return "-"; }
    }

    function formatLogLines(session, maxLines) {
        const logs = (session && session.logs) || [];
        return logs.slice(-maxLines).map((log) => {
            const dose = log.doseLabel || (log.inputAmount != null ? `${log.inputAmount} ${log.inputUnit || ""}` : "");
            const note = log.note ? ` - ${log.note}` : "";
            return `- ${formatDateTime(log.time)} | ${log.type || "log"} ${dose}${log.route ? ` | ${log.route}` : ""}${note}`;
        }).join("\n") || "- none";
    }

    function promptHeader(title) {
        return [
            "You are Seuil's discreet harm-reduction assistant.",
            `Answer in ${currentLanguageName()}.`,
            "Be explanatory, practical, nonjudgmental, and clear about uncertainty.",
            "Never present psychoactive use as safe. Do not optimize intoxication.",
            "Do not give injection instructions, synthesis, sourcing, trafficking, or evasion advice.",
            RESPONSE_STYLE_GUIDE,
            "",
            `Task: ${title}`
        ].join("\n");
    }

    function contextualReturnInstruction(kind) {
        const shared = "Return a complete but sober analysis with concrete, user-facing explanations. Keep the tone calm. Include only one short vigilance/help section unless the context itself is clearly urgent.";
        const byKind = {
            "active-session": "Cover phase/timing, dose context, route-specific notes, what the log suggests, redose caution, what to observe now, and a short recovery/next-step plan.",
            "pre-session": "Cover what is known from the entered plan, dose/route/timeline context, recent-history relevance, what to verify before starting, and safer alternatives such as delaying, lowering uncertainty, or not continuing.",
            "comparison": "Explain curve differences in onset, peak, total duration, overlap, fatigue burden, and why the curves are educational estimates rather than compatibility advice.",
            "interaction": "Explain the likely interaction pattern, why the pairing can be unpredictable, what would make it more concerning, and practical non-technical ways to reduce uncertainty without instructing use.",
            "trends": "Explain spacing, repetition, dose/unit patterns, route patterns, context patterns, possible tolerance/escalation signals, and 3 to 5 realistic adjustments for the next weeks.",
            "debrief": "Explain what the session log suggests, what went well, what could be improved, recovery priorities, and one or two safeguards for the next comparable situation."
        };
        return `${shared} ${byKind[kind] || ""}`;
    }

    function substanceBlock(summary, route) {
        if (!summary) return "- substance card unavailable";
        const routeData = route && summary.routeSummaries ? summary.routeSummaries[route] : null;
        const dosage = routeData && routeData.dosage ? routeData.dosage : null;
        const durations = routeData && routeData.durations ? routeData.durations : null;
        const risk = (summary.risk_factors || []).slice(0, 3).join(" | ");
        const avoid = (summary.avoid_if || []).slice(0, 2).join(" | ");
        const rules = (summary.rdr_rules || []).slice(0, 3).join(" | ");
        return [
            `${summary.name} (${summary.category || "unknown"})`,
            `route: ${route || "unknown"}`,
            dosage ? `dosage markers: threshold ${dosage.threshold}; light ${dosage.light}; common ${dosage.common}; strong ${dosage.strong}; heavy ${dosage.heavy}; unit ${dosage.unit}` : "",
            durations ? `timeline seconds: onset ${durations.onset}; comeup ${durations.comeup}; peak ${durations.peak}; offset ${durations.offset}; total ${durations.total}` : "",
            routeData ? `bioavailability: ${routeData.bioavailability}` : "",
            summary.metabolism ? `metabolism: ${summary.metabolism}` : "",
            risk ? `risk factors: ${risk}` : "",
            avoid ? `avoid if: ${avoid}` : "",
            rules ? `harm-reduction rules: ${rules}` : ""
        ].filter(Boolean).join("\n");
    }

    function buildPrompt(title, sections) {
        return clampText([promptHeader(title), ...sections].join("\n\n"), PROMPT_LIMIT);
    }

    function promptSessionAnalysis() {
        const snapshot = getSnapshot();
        const session = snapshot.activeSession;
        if (!session) return null;
        const summary = getSubstanceSummary(session.substanceKey);
        return buildPrompt("Analyze the active session and highlight immediate safety priorities.", [
            "Active session:",
            `substance: ${session.substanceName}; route: ${session.route}; dose cumulative: ${formatDose(session)}; set/setting: ${session.setSetting || "-"}`,
            `started: ${formatDateTime(session.startTime)}`,
            (session.extraSubstances || []).length ? `additional tracked substances: ${session.extraSubstances.map((s) => `${s.name} ${s.cumulativeDose || "?"} ${s.unit || ""} via ${s.route || "?"}`).join("; ")}` : "additional tracked substances: none",
            "Recent log:",
            formatLogLines(session, 8),
            "Reference card:",
            substanceBlock(summary, session.route),
            `Return: ${contextualReturnInstruction("active-session")}`
        ]);
    }

    function promptPreSession() {
        const subKey = $("substance-select") ? $("substance-select").value : "";
        const customName = $("input-custom-substance") ? $("input-custom-substance").value.trim() : "";
        const summary = getSubstanceSummary(subKey);
        const dose = $("input-dosage") ? $("input-dosage").value : "";
        const unit = $("unit-select") ? $("unit-select").value : "";
        const route = $("route-select") ? $("route-select").value : "";
        const setSetting = $("input-set-setting") ? $("input-set-setting").value : "";
        const notes = $("input-session-notes") ? $("input-session-notes").value.trim() : "";
        if ((!subKey && !customName) || !dose) return null;
        const sessions = getSnapshot().sessions || [];
        const recent = sessions.slice(0, 5).map((s) => `${formatDateTime(s.startTime)}: ${s.substanceName} ${formatDose(s)} via ${s.route}`).join("\n") || "- none";
        return buildPrompt("Review the planned session before it starts.", [
            "Planned input:",
            `substance: ${summary ? summary.name : (customName || subKey || "not selected")}`,
            `dose entered: ${dose || "not entered"} ${unit || ""}; route: ${route || "not selected"}; set/setting: ${setSetting || "-"}`,
            notes ? `context notes: ${notes}` : "context notes: none",
            "Recent sessions:",
            recent,
            "Reference card:",
            substanceBlock(summary, route),
            `Return: ${contextualReturnInstruction("pre-session")}`
        ]);
    }

    function promptComparison() {
        const snapshot = getSnapshot();
        const keys = snapshot.compareSelection || [];
        if (keys.length < 2) return null;
        const cards = keys.map((key) => {
            const summary = getSubstanceSummary(key);
            const route = summary && summary.routes ? summary.routes[0] : "";
            return substanceBlock(summary, route);
        }).join("\n\n---\n\n");
        return buildPrompt("Compare selected effect curves for educational harm-reduction context.", [
            "Selected cards:",
            cards,
            `Return: ${contextualReturnInstruction("comparison")}`
        ]);
    }

    function promptInteraction() {
        const key1 = $("inter-select-1") ? $("inter-select-1").value : "";
        const key2 = $("inter-select-2") ? $("inter-select-2").value : "";
        if (!key1 || !key2) return null;
        const s1 = getSubstanceSummary(key1);
        const s2 = getSubstanceSummary(key2);
        const title = $("inter-result-title") ? $("inter-result-title").textContent.trim() : "";
        const note = $("inter-result-note") ? $("inter-result-note").textContent.trim() : "";
        return buildPrompt("Explain the selected combination soberly.", [
            "Combination:",
            substanceBlock(s1, s1 && s1.routes ? s1.routes[0] : ""),
            substanceBlock(s2, s2 && s2.routes ? s2.routes[0] : ""),
            "Seuil interaction result:",
            `${title || "not calculated"} - ${note || "no displayed note"}`,
            `Return: ${contextualReturnInstruction("interaction")}`
        ]);
    }

    function promptTrends() {
        const sessions = (getSnapshot().sessions || []).slice(0, 20);
        if (!sessions.length) return null;
        const lines = sessions.map((s) => `- ${formatDateTime(s.startTime)} | ${s.substanceName} | ${formatDose(s)} | ${s.route} | ${s.setSetting || "-"}`).join("\n");
        return buildPrompt("Read recent tracking trends and highlight harm-reduction signals.", [
            `Closed sessions reviewed: ${sessions.length}`,
            lines,
            `Return: ${contextualReturnInstruction("trends")}`
        ]);
    }

    function promptDebrief() {
        const session = (getSnapshot().sessions || [])[0];
        if (!session) return null;
        const summary = getSubstanceSummary(session.substanceKey);
        return buildPrompt("Debrief the most recent closed session.", [
            "Closed session:",
            `substance: ${session.substanceName}; route: ${session.route}; cumulative dose: ${formatDose(session)}; set/setting: ${session.setSetting || "-"}`,
            `started: ${formatDateTime(session.startTime)}; ended: ${formatDateTime(session.endTime)}`,
            "Log:",
            formatLogLines(session, 10),
            "Reference card:",
            substanceBlock(summary, session.route),
            `Return: ${contextualReturnInstruction("debrief")}`
        ]);
    }

    async function callAi(prompt) {
        const response = await fetch("/api/ai/analyze", {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Seuil-Csrf": "1"
            },
            body: JSON.stringify({ prompt })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
            throw new Error(payload.error || "Assistant indisponible.");
        }
        return payload.output || "";
    }

    function setStatus(text, tone) {
        const status = $("ai-assistant-status");
        if (!status) return;
        status.textContent = text ? aiText(text) : "";
        status.style.color = tone === "error" ? "#fca5a5" : "";
    }

    function setLoading(loading) {
        const button = $("ai-assistant-submit");
        const input = $("ai-assistant-input");
        if (button) {
            button.disabled = loading;
            button.textContent = aiText(loading ? "Réponse en cours..." : "Demander à l’assistant");
        }
        if (input) input.disabled = loading;
    }

    function renderMarkdownLite(text) {
        return escapeHtml(text)
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }

    function showResult(text) {
        const result = $("ai-assistant-result");
        if (!result) return;
        result.hidden = false;
        result.innerHTML = renderMarkdownLite(text);
    }

    function openContextPanel(title, subtitle, body, loading) {
        const panel = $("ai-context-panel");
        const titleEl = $("ai-context-title");
        const subtitleEl = $("ai-context-subtitle");
        const result = $("ai-context-result");
        if (!panel || !result) return;
        if (titleEl) titleEl.textContent = aiText(title || "Résultat IA");
        if (subtitleEl) subtitleEl.textContent = aiText(subtitle || "Analyse générée à partir des informations visibles dans votre coffre déverrouillé.");
        result.innerHTML = renderMarkdownLite(body || "");
        panel.hidden = false;
        panel.classList.toggle("is-loading", !!loading);
        if (!loading) panel.focus?.();
    }

    function closeContextPanel() {
        const panel = $("ai-context-panel");
        if (panel) panel.hidden = true;
    }

    async function runContextualAnalysis(title, subtitle, promptFactory, missingMessage) {
        const prompt = typeof promptFactory === "function" ? promptFactory() : "";
        if (!prompt) {
            openContextPanel(title, subtitle, aiText(missingMessage || "Pas assez d'informations à analyser."), false);
            return;
        }
        openContextPanel(title, subtitle, aiText("Réponse en cours..."), true);
        try {
            const output = await callAi(prompt);
            openContextPanel(title, subtitle, output || aiText("Réponse IA vide."), false);
        } catch (err) {
            openContextPanel(title, subtitle, err && err.message ? err.message : aiText("Assistant indisponible."), false);
        }
    }

    async function refreshStatus() {
        try {
            const response = await fetch("/api/ai/status", {
                credentials: "same-origin",
                cache: "no-store",
                headers: { "Accept": "application/json" }
            });
            const payload = await response.json().catch(() => ({}));
            if (response.ok && payload.configured) {
                setStatus("Assistant disponible.");
                return true;
            }
        } catch (_) {
            // Statut informatif uniquement.
        }
        setStatus("Assistant indisponible.", "error");
        return false;
    }

    async function submitQuestion(event) {
        event.preventDefault();
        const input = $("ai-assistant-input");
        const question = input ? input.value.trim() : "";
        if (question.length < 4) {
            setStatus("Question trop courte.", "error");
            return;
        }

        const prompt = buildPrompt("Answer a free harm-reduction question.", [
            "User question:",
            question
        ]);

        setLoading(true);
        setStatus("Réponse en cours...");
        try {
            const output = await callAi(prompt);
            showResult(output || "");
            setStatus("Réponse générée.");
        } catch (err) {
            setStatus(err && err.message ? err.message : "Assistant indisponible.", "error");
        } finally {
            setLoading(false);
        }
    }

    function bindContextButton(id, title, subtitle, promptFactory, missingMessage) {
        const button = $(id);
        if (!button) return;
        button.addEventListener("click", () => runContextualAnalysis(title, subtitle, promptFactory, missingMessage));
    }

    document.addEventListener("DOMContentLoaded", () => {
        const form = $("ai-assistant-form");
        if (form) form.addEventListener("submit", submitQuestion);
        const close = $("ai-context-close");
        if (close) close.addEventListener("click", closeContextPanel);

        bindContextButton("btn-ai-presession", "Avant de démarrer", "Lecture prudente des informations saisies.", promptPreSession, "Renseignez au moins une substance et une dose avant de demander une lecture IA.");
        bindContextButton("btn-ai-session", "Analyser la session", "Synthèse de la session active et des signaux à surveiller.", promptSessionAnalysis, "Aucune session active à analyser.");
        bindContextButton("btn-ai-comparison", "Lire les courbes", "Comparaison pédagogique des courbes sélectionnées.", promptComparison, "Sélectionnez au moins deux substances dans le comparateur.");
        bindContextButton("btn-ai-interaction", "Lire le mélange", "Explication prudente du résultat d'interaction.", promptInteraction, "Sélectionnez deux substances dans l'analyseur de mélanges.");
        bindContextButton("btn-ai-trends", "Lire les tendances", "Lecture synthétique des sessions clôturées récentes.", promptTrends, "Pas encore assez de sessions clôturées à analyser.");
        bindContextButton("btn-ai-debrief", "Débrief dernière session", "Retour court sur la dernière session clôturée.", promptDebrief, "Aucune session clôturée à débriefer.");

        refreshStatus();
    });

    window.SeuilAI = {
        aiText,
        refreshStatus,
        callAi,
        promptSessionAnalysis,
        promptPreSession,
        promptComparison,
        promptInteraction,
        promptTrends,
        promptDebrief
    };
})();
