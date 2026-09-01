// ==========================================
// MODULE 2: PERSISTENT STORAGE & MY COLLECTION
// ==========================================
const StorageModule = {
    db: null,
    DB_NAME: 'eStudioLightboxDB',
    STORE_NAME: 'collection',

    init() {
        try {
            const request = indexedDB.open(this.DB_NAME, 4);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
            };
            request.onerror = (err) => {
                console.warn('IndexedDB init error, fallback ready:', err);
            };
        } catch (e) {
            console.warn('IndexedDB not supported or blocked:', e);
        }
    },

    isSaving: false,

    async saveCurrent() {
        if (this.isSaving) return;
        const active = LayerManager.getActive();
        if (!active) {
            if (typeof showToast === 'function') {
                showToast(LocaleEngine.currentLang === 'es' ? 'No hay ninguna imagen activa para guardar.' : 'No active image loaded on canvas to save.');
            }
            return;
        }

        this.isSaving = true;

        // Ensure we extract a reliable, permanent Base64 Data URL
        let dataUrl = active.dataUrl;
        if (!dataUrl || dataUrl.startsWith('blob:')) {
            try {
                if (active.blob) {
                    dataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(active.blob);
                    });
                } else if (active.imgElem && (active.imgElem.naturalWidth || active.imgElem.width)) {
                    const offCanvas = document.createElement('canvas');
                    offCanvas.width = active.imgElem.naturalWidth || active.imgElem.width || 800;
                    offCanvas.height = active.imgElem.naturalHeight || active.imgElem.height || 600;
                    const ctx = offCanvas.getContext('2d');
                    ctx.drawImage(active.imgElem, 0, 0);
                    dataUrl = offCanvas.toDataURL('image/png');
                }
            } catch (e) {
                console.warn('Could not extract image dataUrl:', e);
            }
        }

        if (!dataUrl) {
            this.isSaving = false;
            if (typeof showToast === 'function') {
                showToast(LocaleEngine.currentLang === 'es' ? 'No se pudo guardar la imagen seleccionada.' : 'Could not save the selected image.');
            }
            return;
        }

        const saveData = {
            dataUrl: dataUrl,
            name: active.name || 'Saved Drawing',
            timestamp: Date.now(),
            state: {
                scale: active.scale || 1,
                translateX: active.translateX || 0,
                translateY: active.translateY || 0,
                rotation: active.rotation || 0,
                flipX: active.flipX || 1,
                flipY: active.flipY || 1,
                skewX: active.skewX || 0,
                skewY: active.skewY || 0,
                brightness: active.brightness || 100,
                isInverted: active.isInverted || false,
                isContrast: active.isContrast || false,
                isStencil: active.isStencil || false,
                stencilDensity: active.stencilDensity || 55
            }
        };

        const doSave = (db) => {
            try {
                const tx = db.transaction([this.STORE_NAME], 'readwrite');
                const store = tx.objectStore(this.STORE_NAME);
                const req = store.add(saveData);
                req.onsuccess = () => {
                    this.isSaving = false;
                    if (navigator.vibrate) navigator.vibrate(30);
                    if (typeof showToast === 'function') {
                        showToast(LocaleEngine.i18n[LocaleEngine.currentLang]?.msg_saved_collection || 'Saved to My Collection!');
                    }
                };
                req.onerror = (err) => {
                    this.isSaving = false;
                    console.error('Save error:', err);
                    this.saveFallback(saveData);
                };
            } catch (e) {
                this.isSaving = false;
                console.error('Transaction error:', e);
                this.saveFallback(saveData);
            }
        };

        if (this.db) {
            doSave(this.db);
        } else {
            try {
                const req = indexedDB.open(this.DB_NAME, 4);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                        db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    }
                };
                req.onsuccess = (e) => {
                    this.db = e.target.result;
                    doSave(this.db);
                };
                req.onerror = () => {
                    this.isSaving = false;
                    this.saveFallback(saveData);
                };
            } catch (e) {
                this.isSaving = false;
                this.saveFallback(saveData);
            }
        }
    },

    saveFallback(saveData) {
        try {
            const raw = localStorage.getItem('eStudio_collection_fallback') || '[]';
            const list = JSON.parse(raw);
            saveData.id = Date.now();
            list.push(saveData);
            localStorage.setItem('eStudio_collection_fallback', JSON.stringify(list));
            if (navigator.vibrate) navigator.vibrate(30);
            if (typeof showToast === 'function') {
                showToast(LocaleEngine.i18n[LocaleEngine.currentLang]?.msg_saved_collection || 'Saved to My Collection!');
            }
        } catch (e) {
            if (typeof showToast === 'function') {
                showToast(LocaleEngine.currentLang === 'es' ? 'Error al guardar en la colección.' : 'Error saving to collection.');
            }
        }
    },

    loadAll(callback) {
        const doLoad = (db) => {
            try {
                const tx = db.transaction([this.STORE_NAME], 'readonly');
                const store = tx.objectStore(this.STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => {
                    const dbItems = req.result || [];
                    const fallbackRaw = localStorage.getItem('eStudio_collection_fallback') || '[]';
                    try {
                        const fallbackItems = JSON.parse(fallbackRaw);
                        callback([...dbItems, ...fallbackItems]);
                    } catch (e) {
                        callback(dbItems);
                    }
                };
                req.onerror = () => {
                    this.loadFallback(callback);
                };
            } catch (e) {
                this.loadFallback(callback);
            }
        };

        if (this.db) {
            doLoad(this.db);
        } else {
            try {
                const req = indexedDB.open(this.DB_NAME, 4);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                        db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    }
                };
                req.onsuccess = (e) => {
                    this.db = e.target.result;
                    doLoad(this.db);
                };
                req.onerror = () => {
                    this.loadFallback(callback);
                };
            } catch (e) {
                this.loadFallback(callback);
            }
        }
    },

    loadFallback(callback) {
        try {
            const raw = localStorage.getItem('eStudio_collection_fallback') || '[]';
            callback(JSON.parse(raw));
        } catch (e) {
            callback([]);
        }
    },

    deleteItem(id, callback) {
        // Try fallback deletion
        try {
            const raw = localStorage.getItem('eStudio_collection_fallback') || '[]';
            const list = JSON.parse(raw);
            const filtered = list.filter(item => item.id !== id);
            localStorage.setItem('eStudio_collection_fallback', JSON.stringify(filtered));
        } catch (e) { }

        if (this.db) {
            try {
                const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
                const store = tx.objectStore(this.STORE_NAME);
                store.delete(id);
                tx.oncomplete = () => callback();
                tx.onerror = () => callback();
            } catch (e) {
                callback();
            }
        } else {
            callback();
        }
    }
};
