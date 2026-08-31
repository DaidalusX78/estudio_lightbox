// ==========================================
// MODULE 2: PERSISTENT STORAGE & STARTER PACK
// ==========================================
const StorageModule = {
    db: null,
    DB_NAME: 'eStudioLightboxDB',
    STORE_NAME: 'collection',

    init() {
        const request = indexedDB.open(this.DB_NAME, 2);
        request.onupgradeneeded = (e) => {
            this.db = e.target.result;
            if (!this.db.objectStoreNames.contains(this.STORE_NAME)) {
                this.db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = (e) => {
            this.db = e.target.result;
            this.injectStarterPackIfEmpty();
        };
    },

    injectStarterPackIfEmpty() {
        this.loadAll((items) => {
            if (items.length === 0) {
                const starterSVGs = [
                    { name: 'Botanical Leaf', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M100 20 C40 60 40 140 100 180 C160 140 160 60 100 20 Z M100 20 L100 180 M100 60 L60 80 M100 100 L140 120 M100 140 L60 150" fill="none" stroke="#000" stroke-width="4"/></svg>' },
                    { name: 'Anatomy Proportions', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><ellipse cx="100" cy="90" rx="55" ry="70" fill="none" stroke="#000" stroke-width="3"/><line x1="100" y1="20" x2="100" y2="160" stroke="#000" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="45" y1="90" x2="155" y2="90" stroke="#000" stroke-width="2"/><line x1="60" y1="120" x2="140" y2="120" stroke="#000" stroke-width="2"/></svg>' },
                    { name: 'Mandala Geometric', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="75" fill="none" stroke="#000" stroke-width="3"/><circle cx="100" cy="100" r="45" fill="none" stroke="#000" stroke-width="2"/><polygon points="100,25 175,100 100,175 25,100" fill="none" stroke="#000" stroke-width="2"/><polygon points="100,45 155,100 100,155 45,100" fill="none" stroke="#000" stroke-width="1.5"/></svg>' },
                    { name: 'Calligraphy Slant Guide', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><line x1="10" y1="40" x2="190" y2="40" stroke="#000" stroke-width="2"/><line x1="10" y1="80" x2="190" y2="80" stroke="#000" stroke-width="1.5" stroke-dasharray="2 2"/><line x1="10" y1="120" x2="190" y2="120" stroke="#000" stroke-width="2"/><line x1="10" y1="160" x2="190" y2="160" stroke="#000" stroke-width="2"/><line x1="40" y1="180" x2="80" y2="20" stroke="#888" stroke-width="1.5"/><line x1="90" y1="180" x2="130" y2="20" stroke="#888" stroke-width="1.5"/><line x1="140" y1="180" x2="180" y2="20" stroke="#888" stroke-width="1.5"/></svg>' }
                ];

                const tx = this.db.transaction([this.STORE_NAME], 'readwrite');
                const store = tx.objectStore(this.STORE_NAME);
                starterSVGs.forEach(s => {
                    const blob = new Blob([s.svg], { type: 'image/svg+xml' });
                    store.add({ blob, timestamp: Date.now() });
                });
            }
        });
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
