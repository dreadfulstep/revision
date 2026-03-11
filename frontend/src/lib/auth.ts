export type DiscordUser = {
  id: string;
  username: string;
  avatar?: string | null;
  banner?: string | null;
  public_flags: number;
  flags: number;
  global_name: string | null;
  email?: string | null;
};

export function openAuthPopup(): Promise<DiscordUser> {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      "discord-auth",
      "width=500,height=800,scrollbars=yes",
    );

    if (!popup) {
      reject(new Error("Popup blocked"));
      return;
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;
      if (event.data?.type !== "AUTH_SUCCESS") return;

      cleanup();
      resolve(event.data.user);
    }

    // handle user closing popup without authing
    const interval = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("Popup closed"));
      }
    }, 500);

    function cleanup() {
      clearInterval(interval);
      window.removeEventListener("message", onMessage);
    }

    window.addEventListener("message", onMessage);
  });
}
