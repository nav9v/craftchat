import { writable } from "svelte/store";

export const darkMode = writable(false);


function localStorageStore({ storageKey, initialValue = "" }) {
  const init = localStorage.getItem(storageKey) || initialValue;

  const { subscribe, update, set } = writable(init);

  subscribe((state) => {
    if (state) localStorage.setItem(storageKey, state);
  });

  return {
    subscribe,
    update,
    set,
  };
}

export function toggleDarkMode() {
  darkMode.update(value => !value);
}

export const nav = localStorageStore({
  storageKey: "chat_nav",
  initialValue: "settings",
});

export const chatTopic = localStorageStore({
  storageKey: "chat_topic",
  initialValue: "general",
});

export const user = localStorageStore({ storageKey: "chat_user" });
