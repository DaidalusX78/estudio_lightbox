// ==========================================
// MODULE 6: LIVE CAMERA ENGINE
// ==========================================
const CameraEngine = {
    isActive: false,
    mediaStream: null,
    feedElem: null,
    shutterBtn: null,
    scale: 1,
    translateX: 0,
    translateY: 0,

    init() {
        this.feedElem = document.getElementById('camera-feed');
        this.shutterBtn = document.getElementById('btn-camera-shutter');
        const btnCamera = document.getElementById('btn-camera');
        if (btnCamera) {
            btnCamera.addEventListener('click', () => this.toggle());
        }
        if (this.shutterBtn) {
            this.shutterBtn.addEventListener('click', () => this.takePhoto());
        }
    },

    async toggle() {
        this.isActive = !this.isActive;
        const btnCamera = document.getElementById('btn-camera');
        const welcomeSlate = document.getElementById('welcome-slate');

        if (this.isActive) {
            const getUserMedia = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
                ? (c) => navigator.mediaDevices.getUserMedia(c)
                : (navigator.getUserMedia
                    ? (c) => new Promise((res, rej) => navigator.getUserMedia.call(navigator, c, res, rej))
                    : (navigator.webkitGetUserMedia
                        ? (c) => new Promise((res, rej) => navigator.webkitGetUserMedia.call(navigator, c, res, rej))
                        : null));

            if (!getUserMedia) {
                const isHttpLan = location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
                if (isHttpLan) {
                    alert(LocaleEngine.currentLang === 'es'
                        ? 'Los navegadores web exigen HTTPS o la app instalada (APK/PWA) para encender la cámara en red Wi-Fi.'
                        : 'Web browsers require HTTPS, localhost, or the installed APK/PWA to enable the camera over local Wi-Fi.');
                } else {
                    alert(LocaleEngine.currentLang === 'es' ? 'La cámara no es compatible en este navegador.' : 'Camera API is not supported on this browser.');
                }
                this.isActive = false;
                if (btnCamera) btnCamera.classList.remove('active');
                return;
            }
            try {
                try {
                    this.mediaStream = await getUserMedia({
                        video: { facingMode: { ideal: "environment" } },
                        audio: false
                    });
                } catch (envErr) {
                    this.mediaStream = await getUserMedia({
                        video: true,
                        audio: false
                    });
                }
                if (this.feedElem) {
                    this.feedElem.srcObject = this.mediaStream;
                    this.feedElem.style.display = 'block';
                    this.scale = 1;
                    this.translateX = 0;
                    this.translateY = 0;
                    this.renderTransform();
                    await this.feedElem.play().catch(() => { });
                }
                if (btnCamera) btnCamera.classList.add('active');
                if (this.shutterBtn) this.shutterBtn.style.display = 'flex';
                if (welcomeSlate) welcomeSlate.style.display = 'none';
            } catch (err) {
                console.error('Camera error:', err);
                alert(LocaleEngine.currentLang === 'es' ? 'No se pudo acceder a la cámara. Revisa los permisos del navegador.' : 'Unable to access camera. Please verify camera permissions in your browser settings.');
                this.isActive = false;
                if (btnCamera) btnCamera.classList.remove('active');
                if (this.feedElem) this.feedElem.style.display = 'none';
                if (this.shutterBtn) this.shutterBtn.style.display = 'none';
                if (LayerManager.layers.length === 0 && welcomeSlate) {
                    welcomeSlate.style.display = 'flex';
                }
            }
        } else {
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(t => t.stop());
                this.mediaStream = null;
            }
            if (this.feedElem) {
                this.feedElem.srcObject = null;
                this.feedElem.style.display = 'none';
                this.scale = 1;
                this.translateX = 0;
                this.translateY = 0;
                this.renderTransform();
            }
            if (btnCamera) btnCamera.classList.remove('active');
            if (this.shutterBtn) this.shutterBtn.style.display = 'none';
            if (LayerManager.layers.length === 0 && welcomeSlate) {
                welcomeSlate.style.display = 'flex';
            }
        }
    },

    renderTransform() {
        if (this.feedElem) {
            this.feedElem.style.transform = `translate3d(${this.translateX}px, ${this.translateY}px, 0) scale(${this.scale})`;
        }
    },

    takePhoto() {
        if (!this.isActive || !this.feedElem) return;
        const video = this.feedElem;
        if (!video.videoWidth || !video.videoHeight) return;

        // Shutter flash effect
        const flash = document.getElementById('camera-flash');
        if (flash) {
            flash.style.opacity = '0.85';
            setTimeout(() => { flash.style.opacity = '0'; }, 120);
        }
        if (navigator.vibrate) navigator.vibrate([30, 40]);

        // Render high-res frame to canvas with current zoom/pan
        const canvas = document.createElement('canvas');
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        canvas.width = vw;
        canvas.height = vh;
        const ctx = canvas.getContext('2d');

        ctx.save();
        if (this.scale !== 1 || this.translateX !== 0 || this.translateY !== 0) {
            const sx = vw / window.innerWidth;
            const sy = vh / window.innerHeight;
            ctx.translate(vw / 2 + this.translateX * sx, vh / 2 + this.translateY * sy);
            ctx.scale(this.scale, this.scale);
            ctx.drawImage(video, -vw / 2, -vh / 2, vw, vh);
        } else {
            ctx.drawImage(video, 0, 0, vw, vh);
        }
        ctx.restore();

        canvas.toBlob((blob) => {
            if (blob) {
                const photoName = `Photo ${LayerManager.nextLayerNum}`;
                LayerManager.addLayerFromBlob(blob, photoName);
            }
        }, 'image/jpeg', 0.95);
    }
};
