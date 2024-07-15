import { writable } from 'svelte/store';

interface ToastWithoutIdI {
	type: 'info' | 'success' | 'error';
	message: string;
	dismissible?: boolean;
	timeout?: number;
}

export interface ToastI extends ToastWithoutIdI {
	id: number;
}

export const toasts = writable<ToastI[]>([]);

export const addToast = (toast: ToastWithoutIdI) => {
	// Create a unique ID so we can easily find/remove it
	// if it is dismissible/has a timeout.
	const id = Math.floor(Math.random() * 10000);

	// Setup some sensible defaults for a toast.
	const defaults = {
		id,
		type: 'info',
		dismissible: true,
		timeout: 3000
	};

	// Push the toast to the top of the list of toasts
	toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

	// If toast is dismissible, dismiss it after "timeout" amount of time.
	if (toast.timeout) {
		setTimeout(() => dismissToast(id), toast.timeout);
	}
};

export const dismissToast = (id: number) => {
	if (!id) return;
	toasts.update((all) => all.filter((t) => t.id !== id));
};
