/**
 * Seuil - boot.js
 * Récupération de démarrage : tourne avant tout autre script.
 * Objectif : guérir l'installation si un ancien service worker / cache
 * empêche le chargement de auth.js ou des nouvelles versions des assets.
 * (Fichier externe : la CSP `script-src 'self'` interdit les scripts inline.)
 */
(function () {
    try {
        var fallbackShown = false;
        var recoveryStarted = false;

        function translateBootScreen() {
            try {
                var label = document.querySelector('#boot-screen [data-i18n]');
                if (!label || !window.t) return;
                label.textContent = window.t(label.getAttribute('data-i18n') || label.textContent || '');
            } catch (_) {}
        }
        function revealAuthFallback() {
            if (fallbackShown) return;
            if (!document.body || !document.body.classList || !document.body.classList.contains("auth-booting")) return;
            fallbackShown = true;
            document.body.classList.remove("auth-booting");
            document.body.classList.add("auth-locked");
            var auth = document.getElementById("auth-screen");
            if (auth) auth.classList.remove("hidden");
        }
        function authFormIsBound() {
            var formEl = document.getElementById('login-form');
            return !!(formEl && formEl.__seuilBound === true);
        }
        function shouldAttemptCacheRecovery() {
            if (recoveryStarted) return false;
            if (document.readyState !== 'complete') return false;
            return !window.SeuilAuth || !authFormIsBound();
        }
        function shouldForceCacheRecovery() {
            try {
                return new URL(window.location.href).searchParams.has('_seuil_reset_cache');
            } catch (_) {
                return false;
            }
        }
        function recoveryAlreadyDone() {
            try {
                if (new URL(window.location.href).searchParams.has('_seuil_fresh')) return true;
            } catch (_) {}
            try {
                if (sessionStorage.getItem('seuil_recovery_done') === '1') return true;
                sessionStorage.setItem('seuil_recovery_done', '1');
                return false;
            } catch (_) {
                return false;
            }
        }
        function runCacheRecovery(force) {
            if (!force && !shouldAttemptCacheRecovery()) return;
            recoveryStarted = true;
            if (!force) revealAuthFallback();
            if (!force && recoveryAlreadyDone()) return;
            var p = Promise.resolve();
            if ('serviceWorker' in navigator) {
                p = navigator.serviceWorker.getRegistrations().then(function (regs) {
                    return Promise.all(regs.map(function (r) { return r.unregister(); }));
                }).catch(function () {});
            }
            p.then(function () {
                if (typeof caches !== 'undefined' && caches.keys) {
                    return caches.keys().then(function (keys) {
                        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
                    }).catch(function () {});
                }
            }).then(function () {
                var u = new URL(window.location.href);
                u.searchParams.delete('_seuil_reset_cache');
                u.searchParams.set('_seuil_fresh', Date.now().toString(36));
                window.location.replace(u.toString());
            });
        }
        function runCacheRecoveryIfNeeded() {
            runCacheRecovery(false);
        }

        translateBootScreen();

        if (shouldForceCacheRecovery()) {
            runCacheRecovery(true);
            return;
        }

        window.addEventListener("error", function () {
            setTimeout(revealAuthFallback, 0);
        });
        window.addEventListener("unhandledrejection", function () {
            setTimeout(revealAuthFallback, 0);
        });

        if ('serviceWorker' in navigator) {
            // Quand un nouveau SW demande explicitement un reload (post-update)
            navigator.serviceWorker.addEventListener('message', function (e) {
                if (e && e.data && e.data.type === 'SEUIL_RELOAD') {
                    window.location.reload();
                }
            });
        }
        // Filet de sécurité : si après 4 s l'écran d'auth n'est pas câblé
        // on affiche au moins l'auth. La purge cache/SW attend que la page soit
        // complètement chargée pour ne pas relancer en boucle les navigateurs lents.
        setTimeout(function () {
            var stillBooting = !!(document.body && document.body.classList && document.body.classList.contains('auth-booting'));
            var formEl = document.getElementById('login-form');
            var bound = formEl && formEl.__seuilBound === true;
            if (stillBooting) revealAuthFallback();
            if (!window.SeuilAuth || !bound) {
                setTimeout(runCacheRecoveryIfNeeded, 12000);
            }
        }, 4000);
    } catch (_) { /* on ne casse jamais le boot pour ça */ }
})();
