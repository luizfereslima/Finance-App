import { watch } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
import { toast } from "vue-sonner";

const UPDATE_TOAST_ID = "pwa-update";
const OFFLINE_READY_TOAST_ID = "pwa-offline-ready";
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

function scheduleUpdateChecks(
  swUrl: string,
  registration: ServiceWorkerRegistration | undefined,
): void {
  if (!registration) {
    return;
  }

  window.setInterval(async () => {
    if (registration.installing || !navigator.onLine) {
      return;
    }

    try {
      // Só pede uma nova versão se o servidor estiver acessível.
      const response = await fetch(swUrl, {
        cache: "no-store",
        headers: { "cache-control": "no-cache" },
      });

      if (response.status === 200) {
        await registration.update();
      }
    } catch {
      // Sem conexão: tenta de novo no próximo intervalo.
    }
  }, UPDATE_CHECK_INTERVAL_MS);
}

export function useUpdatePromptController() {
  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onRegisteredSW: scheduleUpdateChecks,
    onRegisterError: (error) => {
      console.error("Falha ao registrar o service worker.", error);
    },
  });

  let isUpdating = false;

  async function update(): Promise<void> {
    if (isUpdating) {
      return;
    }

    isUpdating = true;
    toast.loading("Atualizando o aplicativo...");

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => window.location.reload(),
      { once: true },
    );

    // Envia SKIP_WAITING para ativar a versão em espera.
    await updateServiceWorker(true);
  }

  function dismissUpdate(): void {
    needRefresh.value = false;
  }

  function dismissOfflineReady(): void {
    offlineReady.value = false;
  }

  watch(
    needRefresh,
    (hasUpdate) => {
      if (!hasUpdate) {
        if (!isUpdating) {
          toast.dismiss(UPDATE_TOAST_ID);
        }
        return;
      }

      toast.info("Nova versão disponível", {
        id: UPDATE_TOAST_ID,
        description: "Atualize para usar a versão mais recente do Meu Bolso.",
        duration: Infinity,
        action: {
          label: "Atualizar",
          onClick: () => void update(),
        },
        cancel: {
          label: "Depois",
          onClick: dismissUpdate,
        },
      });
    },
    { immediate: true },
  );

  watch(
    offlineReady,
    (isReady) => {
      if (!isReady) {
        toast.dismiss(OFFLINE_READY_TOAST_ID);
        return;
      }

      toast.success("Aplicativo pronto para uso offline", {
        id: OFFLINE_READY_TOAST_ID,
        description: "O Meu Bolso continua abrindo mesmo sem internet.",
        onDismiss: dismissOfflineReady,
        onAutoClose: dismissOfflineReady,
      });
    },
    { immediate: true },
  );

  return {
    needRefresh,
    offlineReady,
    update,
    dismissUpdate,
    dismissOfflineReady,
  };
}
