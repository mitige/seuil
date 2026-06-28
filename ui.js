/**
 * Seuil - ui.js
 * Système d'interface partagé : toasts, boîtes de dialogue (confirmation,
 * saisie, information) et utilitaires de formatage.
 *
 * Remplace les alert/confirm/prompt natifs par des composants cohérents avec
 * la direction visuelle (sombre, sobre, accent indigo unique). Tout le texte
 * est injecté via textContent - aucun risque XSS.
 */

(function () {
    "use strict";

    // ============================================================
    // Toasts
    // ============================================================
    let toastStack = null;

    function ensureToastStack() {
        if (toastStack && document.body.contains(toastStack)) return toastStack;
        toastStack = document.createElement("div");
        toastStack.className = "toast-stack";
        toastStack.setAttribute("aria-live", "polite");
        document.body.appendChild(toastStack);
        return toastStack;
    }

    const TOAST_ICONS = {
        success: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"></path></svg>',
        error: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        info: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    function toast(message, options) {
        const opts = Object.assign({ type: "info", duration: 4200 }, options || {});
        const stack = ensureToastStack();
        const el = document.createElement("div");
        el.className = `toast toast-${opts.type}`;
        const icon = document.createElement("span");
        icon.className = "toast-icon";
        icon.innerHTML = TOAST_ICONS[opts.type] || TOAST_ICONS.info;
        const text = document.createElement("span");
        text.className = "toast-text";
        text.textContent = String(message || "");
        el.appendChild(icon);
        el.appendChild(text);
        stack.appendChild(el);
        // Limite la pile à 4 toasts
        while (stack.children.length > 4) stack.removeChild(stack.firstChild);
        requestAnimationFrame(() => el.classList.add("visible"));
        const remove = () => {
            el.classList.remove("visible");
            setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
        };
        el.addEventListener("click", remove);
        if (opts.duration > 0) setTimeout(remove, opts.duration);
        return el;
    }

    // ============================================================
    // Boîtes de dialogue
    // ============================================================
    let activeDialog = null;

    function buildDialog({ title, message, body, actions, tone }) {
        closeActiveDialog(undefined, true);

        const overlay = document.createElement("div");
        overlay.className = "ui-dialog-overlay";
        const dialog = document.createElement("div");
        dialog.className = "ui-dialog" + (tone === "danger" ? " ui-dialog-danger" : "");
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");

        if (title) {
            const h = document.createElement("h2");
            h.className = "ui-dialog-title";
            h.textContent = uiText(title);
            dialog.appendChild(h);
        }
        if (message) {
            const p = document.createElement("p");
            p.className = "ui-dialog-message";
            p.textContent = uiText(message);
            dialog.appendChild(p);
        }
        if (body) dialog.appendChild(body);

        const row = document.createElement("div");
        row.className = "ui-dialog-actions";
        actions.forEach((action) => row.appendChild(action));
        dialog.appendChild(row);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add("open"));

        const previousFocus = document.activeElement;
        activeDialog = { overlay, previousFocus, onKey: null };
        return { overlay, dialog };
    }

    function closeActiveDialog(result, immediate) {
        if (!activeDialog) return;
        const { overlay, previousFocus, onKey } = activeDialog;
        activeDialog = null;
        if (onKey) document.removeEventListener("keydown", onKey, true);
        overlay.classList.remove("open");
        const removeNode = () => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
        if (immediate) removeNode(); else setTimeout(removeNode, 200);
        if (previousFocus && typeof previousFocus.focus === "function") {
            try { previousFocus.focus(); } catch (_) {}
        }
        return result;
    }

    function makeButton(label, variant) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `btn ${variant || "btn-secondary"}`;
        btn.textContent = uiText(label);
        return btn;
    }

    /**
     * Confirmation : résout true (confirmer) ou false (annuler / échap).
     * options: { title, message, confirmLabel, cancelLabel, danger }
     */
    function confirmDialog(options) {
        const opts = Object.assign({
            title: "Confirmer",
            message: "",
            confirmLabel: "Confirmer",
            cancelLabel: "Annuler",
            danger: false
        }, options || {});
        return new Promise((resolve) => {
            const cancel = makeButton(opts.cancelLabel, "btn-secondary");
            const ok = makeButton(opts.confirmLabel, opts.danger ? "btn-danger" : "btn-primary");
            const { overlay } = buildDialog({
                title: opts.title,
                message: opts.message,
                actions: [cancel, ok],
                tone: opts.danger ? "danger" : "default"
            });
            const done = (value) => { closeActiveDialog(); resolve(value); };
            cancel.addEventListener("click", () => done(false));
            ok.addEventListener("click", () => done(true));
            overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) done(false); });
            const onKey = (e) => {
                if (e.key === "Escape") { e.preventDefault(); done(false); }
                if (e.key === "Enter") { e.preventDefault(); done(true); }
            };
            activeDialog.onKey = onKey;
            document.addEventListener("keydown", onKey, true);
            setTimeout(() => ok.focus(), 60);
        });
    }

    /**
     * Saisie : résout la valeur saisie (string) ou null si annulé.
     * options: { title, message, label, value, placeholder, multiline, confirmLabel, required }
     */
    function promptDialog(options) {
        const opts = Object.assign({
            title: "Saisie",
            message: "",
            label: "",
            value: "",
            placeholder: "",
            multiline: false,
            required: false,
            confirmLabel: "Valider",
            cancelLabel: "Annuler"
        }, options || {});
        return new Promise((resolve) => {
            const body = document.createElement("div");
            body.className = "ui-dialog-body";
            if (opts.label) {
                const label = document.createElement("label");
                label.className = "form-label";
                label.textContent = uiText(opts.label);
                body.appendChild(label);
            }
            const input = document.createElement(opts.multiline ? "textarea" : "input");
            input.className = "form-control";
            if (opts.multiline) input.rows = 4; else input.type = "text";
            input.value = opts.value != null ? String(opts.value) : "";
            input.placeholder = uiText(opts.placeholder);
            body.appendChild(input);

            const cancel = makeButton(opts.cancelLabel, "btn-secondary");
            const ok = makeButton(opts.confirmLabel, "btn-primary");
            const { overlay } = buildDialog({
                title: opts.title,
                message: opts.message,
                body,
                actions: [cancel, ok]
            });
            const done = (value) => { closeActiveDialog(); resolve(value); };
            const submit = () => {
                const value = input.value;
                if (opts.required && !value.trim()) { input.focus(); return; }
                done(value);
            };
            cancel.addEventListener("click", () => done(null));
            ok.addEventListener("click", submit);
            overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) done(null); });
            const onKey = (e) => {
                if (e.key === "Escape") { e.preventDefault(); done(null); }
                if (e.key === "Enter" && !opts.multiline) { e.preventDefault(); submit(); }
            };
            activeDialog.onKey = onKey;
            document.addEventListener("keydown", onKey, true);
            setTimeout(() => input.focus(), 60);
        });
    }

    /**
     * Information : résout après fermeture.
     * options: { title, message, detail (texte monospace copiable), confirmLabel }
     */
    function alertDialog(options) {
        const opts = Object.assign({
            title: "Information",
            message: "",
            detail: "",
            confirmLabel: "Fermer"
        }, options || {});
        return new Promise((resolve) => {
            let body = null;
            if (opts.detail) {
                body = document.createElement("div");
                body.className = "ui-dialog-body";
                const pre = document.createElement("div");
                pre.className = "ui-dialog-detail mono";
                pre.textContent = opts.detail;
                body.appendChild(pre);
                const copy = makeButton("Copier", "btn-secondary btn-sm");
                copy.addEventListener("click", async () => {
                    try {
                        await navigator.clipboard.writeText(opts.detail);
                        copy.textContent = uiText("Copié ✓");
                        setTimeout(() => { copy.textContent = uiText("Copier"); }, 1600);
                    } catch (_) { /* presse-papiers indisponible */ }
                });
                body.appendChild(copy);
            }
            const ok = makeButton(opts.confirmLabel, "btn-primary");
            const { overlay } = buildDialog({
                title: opts.title,
                message: opts.message,
                body,
                actions: [ok]
            });
            const done = () => { closeActiveDialog(); resolve(); };
            ok.addEventListener("click", done);
            overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) done(); });
            const onKey = (e) => {
                if (e.key === "Escape" || e.key === "Enter") { e.preventDefault(); done(); }
            };
            activeDialog.onKey = onKey;
            document.addEventListener("keydown", onKey, true);
            setTimeout(() => ok.focus(), 60);
        });
    }

    // ============================================================
    // Utilitaires de formatage
    // ============================================================
    function uiLang() {
        const api = window.SeuilI18n;
        if (api && typeof api.getLanguage === "function") return api.getLanguage();
        return document.documentElement && document.documentElement.lang === "en" ? "en" : "fr";
    }

    function uiLocale() {
        const lang = uiLang();
        if (lang !== "en") return "fr-FR";
        const navLang = navigator.language || "";
        return /^en\b/i.test(navLang) ? navLang : "en-GB";
    }

    function uiText(key, vars) {
        const translator = typeof window.t === "function" ? window.t : null;
        if (translator) return translator(key, vars);
        let text = String(key || "");
        if (vars && typeof vars === "object") {
            Object.keys(vars).forEach((name) => {
                text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
            });
        }
        return text;
    }

    function formatBytes(bytes) {
        const n = Number(bytes) || 0;
        const lang = uiLang();
        if (n < 1024) return lang === "en" ? `${n} B` : `${n} o`;
        if (n < 1024 * 1024) return lang === "en" ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024).toFixed(1)} Ko`;
        return lang === "en" ? `${(n / (1024 * 1024)).toFixed(1)} MB` : `${(n / (1024 * 1024)).toFixed(1)} Mo`;
    }

    function timeAgo(tsSeconds) {
        if (!tsSeconds) return "-";
        const diff = Date.now() / 1000 - tsSeconds;
        const lang = uiLang();
        if (diff < 0) return lang === "en" ? "just now" : "à l'instant";
        const min = Math.floor(diff / 60);
        if (min < 1) return lang === "en" ? "just now" : "à l'instant";
        if (min < 60) return lang === "en" ? `${min} min ago` : `il y a ${min} min`;
        const h = Math.floor(min / 60);
        if (h < 24) return lang === "en" ? `${h} h ago` : `il y a ${h} h`;
        const d = Math.floor(h / 24);
        if (d < 30) return lang === "en" ? `${d} d ago` : `il y a ${d} j`;
        const mo = Math.floor(d / 30);
        if (mo < 12) return lang === "en" ? `${mo} mo ago` : `il y a ${mo} mois`;
        return new Date(tsSeconds * 1000).toLocaleDateString(uiLocale());
    }

    function formatDate(tsSeconds) {
        if (!tsSeconds) return "-";
        const d = new Date(tsSeconds * 1000);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleDateString(uiLocale(), { day: "2-digit", month: "short", year: "numeric" });
    }

    function formatDateTime(tsSeconds) {
        if (!tsSeconds) return "-";
        const d = new Date(tsSeconds * 1000);
        if (Number.isNaN(d.getTime())) return "-";
        const locale = uiLocale();
        return d.toLocaleDateString(locale, { day: "2-digit", month: "short" }) +
            " " + d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    }

    function formatDuration(seconds) {
        const s = Math.max(0, Math.floor(Number(seconds) || 0));
        const lang = uiLang();
        if (s < 60) return `${s} s`;
        if (s < 3600) return `${Math.floor(s / 60)} min`;
        if (s < 86400) return `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min`;
        return lang === "en"
            ? `${Math.floor(s / 86400)} d ${Math.floor((s % 86400) / 3600)} h`
            : `${Math.floor(s / 86400)} j ${Math.floor((s % 86400) / 3600)} h`;
    }

    // ============================================================
    // Export public
    // ============================================================
    window.SeuilUI = {
        toast,
        confirm: confirmDialog,
        prompt: promptDialog,
        alert: alertDialog,
        formatBytes,
        timeAgo,
        formatDate,
        formatDateTime,
        formatDuration
    };
})();
