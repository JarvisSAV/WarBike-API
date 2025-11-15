// ✅ serviceWorkerRegistration.js (adaptado para Next.js)

/**
 * Registra un Service Worker (solo en el cliente y en producción)
 * Inspirado en el modelo de Create React App, pero compatible con Next.js App Router.
 */

export function register(config) {
  // 🚫 Evita ejecutar en el servidor (Next.js SSR)
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  // Verifica si estamos en localhost
  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      window.location.hostname === "[::1]" ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  // Solo registrar en producción y si el navegador soporta service workers
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL || "", window.location.href);

    // Evita registrar si el service worker está en un dominio distinto
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL || ""}/service-worker.js`;

      if (isLocalhost) {
        // Verifica si existe un SW válido en localhost
        checkValidServiceWorker(swUrl, config);

        // Información útil en consola
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "Esta aplicación web está siendo servida por un service worker (modo cache-first)."
          );
        });
      } else {
        // Registro normal en producción
        registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * Registra un Service Worker válido
 */
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log(
                "Nuevo contenido disponible. Se aplicará al cerrar todas las pestañas abiertas. (https://bit.ly/CRA-PWA)"
              );

              if (config?.onUpdate) config.onUpdate(registration);
            } else {
              console.log("Contenido cacheado para uso sin conexión.");

              if (config?.onSuccess) config.onSuccess(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error durante el registro del service worker:", error);
    });
}

/**
 * Verifica si el Service Worker es válido
 */
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { "Service-Worker": "script" } })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType && contentType.indexOf("javascript") === -1)
      ) {
        // No se encontró el service worker, recarga la página
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // El service worker es válido
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("Sin conexión a internet. La app está en modo offline.");
    });
}

/**
 * Desregistra el Service Worker (opcional)
 */
export function unregister() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
    })
    .catch((error) => {
      console.error("Error al desregistrar el service worker:", error);
    });
}
