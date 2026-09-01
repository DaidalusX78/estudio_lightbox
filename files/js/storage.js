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

    async saveCurrent() {
        const active = LayerManager.getActive();
        if (!active || (!active.blob && !active.dataUrl)) {
            alert(LocaleEngine.currentLang === 'es' ? 'No hay ninguna imagen cargada en la pantalla.' : 'No active image loaded on canvas to save.');
            return;
        }

        let blobToSave = active.blob;
        if (!blobToSave && active.dataUrl) {
            try {
                const res = await fetch(active.dataUrl);
                blobToSave = await res.blob();
            } catch (e) {
                blobToSave = null;
            }
        }

        const saveData = {
            blob: blobToSave,
            dataUrl: active.dataUrl,
            name: active.name || 'Saved Drawing',
            timestamp: Date.now()
        };

        const doSave = (db) => {
            const tx = db.transaction([this.STORE_NAME], 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            store.add(saveData);
            tx.oncomplete = () => {
                if (navigator.vibrate) navigator.vibrate(30);
                alert(LocaleEngine.i18n[LocaleEngine.currentLang].msg_saved_collection);
            };
        };

        if (this.db) {
            doSave(this.db);
        } else {
            const req = indexedDB.open(this.DB_NAME, 3);
            req.onsuccess = (e) => {
                this.db = e.target.result;
                doSave(this.db);
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
