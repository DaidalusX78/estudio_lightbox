// ==========================================
// MODULE 2: PERSISTENT STORAGE & MY COLLECTION
// ==========================================
const StorageModule = {
    db: null,
    DB_NAME: 'eStudioLightboxDB',
    STORE_NAME: 'collection',

    init() {
        const request = indexedDB.open(this.DB_NAME, 3);
        request.onupgradeneeded = (e) => {
            this.db = e.target.result;
            if (this.db.objectStoreNames.contains(this.STORE_NAME)) {
                this.db.deleteObjectStore(this.STORE_NAME);
            }
            this.db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = (e) => {
            this.db = e.target.result;
        };
    },

    isSaving: false,

    async saveCurrent() {
        if (this.isSaving) return;
        const active = LayerManager.getActive();
        if (!active || (!active.dataUrl && !active.blob)) {
            alert(LocaleEngine.currentLang === 'es' ? 'No hay ninguna imagen cargada en la pantalla.' : 'No active image loaded on canvas to save.');
            return;
        }

        this.isSaving = true;

        const saveData = {
            dataUrl: active.dataUrl,
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
                    alert(LocaleEngine.i18n[LocaleEngine.currentLang].msg_saved_collection);
                };
                req.onerror = (err) => {
                    this.isSaving = false;
                    console.error('Save error:', err);
                    alert(LocaleEngine.currentLang === 'es' ? 'Error al guardar en la colección.' : 'Error saving to collection.');
                };
            } catch (e) {
                this.isSaving = false;
                console.error('Transaction error:', e);
                alert(LocaleEngine.currentLang === 'es' ? 'Error al guardar en la colección.' : 'Error saving to collection.');
            }
        };

        if (this.db) {
            doSave(this.db);
        } else {
            const req = indexedDB.open(this.DB_NAME, 3);
            req.onsuccess = (e) => {
                this.db = e.target.result;
                doSave(this.db);
            };
            req.onerror = () => {
                this.isSaving = false;
                alert(LocaleEngine.currentLang === 'es' ? 'Error al guardar en la colección.' : 'Error saving to collection.');
            };
        }
    },

    loadAll(callback) {
        const doLoad = (db) => {
            const tx = db.transaction([this.STORE_NAME], 'readonly');
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => callback(req.result || []);
        };

        if (this.db) {
            doLoad(this.db);
        } else {
            const req = indexedDB.open(this.DB_NAME, 3);
            req.onsuccess = (e) => {
                this.db = e.target.result;
                doLoad(this.db);
            };
        }
    },

    deleteItem(id, callback) {
        const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => callback();
    }
};
