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
        if (!active || !active.blob) {
            alert(LocaleEngine.currentLang === 'es' ? 'No hay ninguna imagen cargada en la pantalla.' : 'No active image loaded on canvas to save.');
            return;
        }

        const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        store.add({
            blob: active.blob,
            timestamp: Date.now()
        });
        tx.oncomplete = () => {
            if (navigator.vibrate) navigator.vibrate(30);
            alert(LocaleEngine.i18n[LocaleEngine.currentLang].msg_saved_collection);
        };
    },

    loadAll(callback) {
        if (!this.db) return;
        const tx = this.db.transaction([this.STORE_NAME], 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => callback(req.result || []);
    },

    deleteItem(id, callback) {
        const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => callback();
    }
};
