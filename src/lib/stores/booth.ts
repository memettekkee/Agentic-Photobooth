import { writable, derived } from 'svelte/store';

export type AppStep = 'landing' | 'booth' | 'template' | 'preview';

export interface BoothState {
    step: AppStep;
    photos: string[]; // base64 data URLs, max 3
    selectedTemplate: string | null;
}

const initialState: BoothState = {
    step: 'landing',
    photos: [],
    selectedTemplate: null,
};

function createBoothStore() {
    const { subscribe, set, update } = writable<BoothState>(initialState);

    return {
        subscribe,
        addPhoto: (dataUrl: string) =>
            update((state) => ({
                ...state,
                photos: [...state.photos, dataUrl].slice(0, 3),
            })),
        setTemplate: (id: string) =>
            update((state) => ({ ...state, selectedTemplate: id })),
        setStep: (step: AppStep) =>
            update((state) => ({ ...state, step })),
        reset: () => set(initialState),
        clearPhotos: () =>
            update((state) => ({ ...state, photos: [], selectedTemplate: null })),
    };
}

export const booth = createBoothStore();

/** Derived: how many photos have been taken so far */
export const photoCount = derived(booth, ($b) => $b.photos.length);

/** Derived: whether all 3 photos are captured */
export const allPhotosTaken = derived(booth, ($b) => $b.photos.length >= 3);
