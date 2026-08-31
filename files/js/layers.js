// ==========================================
// MODULE 3: MULTI-IMAGE & LAYER MANAGER WITH UNDO
// ==========================================
const LayerManager = {
    layers: [],
    activeId: null,
    nextLayerNum: 1,
    historyStack: [],
    maxHistory: 30,

    init() {
        this.updateUI();
    },

    recordHistory(actionDescription = 'change') {
        const snapshot = {
            layers: this.layers.map(l => ({
                id: l.id,
                name: l.name,
                dataUrl: l.dataUrl,
                blob: l.blob,
                scale: l.scale,
                translateX: l.translateX,
                translateY: l.translateY,
                rotation: l.rotation,
                flipX: l.flipX,
                flipY: l.flipY,
                skewX: l.skewX,
                skewY: l.skewY,
                brightness: l.brightness,
                isInverted: l.isInverted,
                isContrast: l.isContrast,
                isStencil: l.isStencil,
                stencilDensity: l.stencilDensity
            })),
            activeId: this.activeId
        };

        this.historyStack.push(snapshot);
        if (this.historyStack.length > this.maxHistory) {
            this.historyStack.shift();
        }
        this.updateUndoButton();
    },

    undo() {
        if (this.historyStack.length === 0) return;
        const prev = this.historyStack.pop();

        // Clear DOM
        const container = document.getElementById('image-container');
        if (container) container.innerHTML = '';
        this.layers = [];

        if (prev.layers.length > 0) {
            prev.layers.forEach(item => {
                this.createLayer(item.blob, item.dataUrl, item.name, item, false);
            });
            this.setActive(prev.activeId || this.layers[0].id);
        } else {
            this.activeId = null;
        }

        this.updateUI();
        this.saveSession();
        if (navigator.vibrate) navigator.vibrate(25);
    },

    updateUndoButton() {
        const btnUndo = document.getElementById('btn-undo');
        if (!btnUndo) return;
        if (this.layers.length > 0) {
            btnUndo.style.display = 'flex';
            btnUndo.style.opacity = this.historyStack.length > 0 ? '1' : '0.4';
        } else {
            btnUndo.style.display = 'none';
        }
    },

    addLayerFromBlob(blob, name = null, stateProps = null, record = true) {
        if (record) this.recordHistory('add_layer');

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            this.createLayer(blob, dataUrl, name, stateProps, true);
        };
        reader.readAsDataURL(blob);
    },

    createLayer(blob, dataUrl, name = null, stateProps = null, makeActive = true) {
        const id = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const layerName = name || `Image ${this.nextLayerNum++}`;
        const container = document.getElementById('image-container');

        const layerDiv = document.createElement('div');
        layerDiv.className = 'canvas-layer';
        layerDiv.id = id;

        const img = document.createElement('img');
        img.src = dataUrl;
        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';

        layerDiv.appendChild(img);
        layerDiv.appendChild(canvas);
        if (container) container.appendChild(layerDiv);

        const layerObj = {
            id,
            name: layerName,
            blob,
            dataUrl,
            element: layerDiv,
            imgElem: img,
            canvasElem: canvas,
            scale: stateProps?.scale ?? 1,
            translateX: stateProps?.translateX ?? 0,
            translateY: stateProps?.translateY ?? 0,
            rotation: stateProps?.rotation ?? 0,
            flipX: stateProps?.flipX ?? 1,
            flipY: stateProps?.flipY ?? 1,
            skewX: stateProps?.skewX ?? 0,
            skewY: stateProps?.skewY ?? 0,
            brightness: stateProps?.brightness ?? 100,
            isInverted: stateProps?.isInverted ?? false,
            isContrast: stateProps?.isContrast ?? false,
            isStencil: stateProps?.isStencil ?? false,
            stencilDensity: stateProps?.stencilDensity ?? 55,
            rawImage: new Image()
        };

        layerObj.rawImage.crossOrigin = "anonymous";
        layerObj.rawImage.src = dataUrl;

        layerDiv.addEventListener('pointerdown', (e) => {
            if (GestureEngine.isLocked) return;
            this.setActive(id);
        });

        this.layers.push(layerObj);

        if (makeActive) {
            this.setActive(id);
        }

        this.renderLayer(layerObj);
        this.updateUI();
        this.saveSession();
    },

    deleteLayer(id) {
        this.recordHistory('delete_layer');
        const idx = this.layers.findIndex(l => l.id === id);
        if (idx !== -1) {
            const [removed] = this.layers.splice(idx, 1);
            if (removed.element) removed.element.remove();

            if (this.activeId === id) {
                if (this.layers.length > 0) {
                    this.setActive(this.layers[Math.max(0, idx - 1)].id);
                } else {
                    this.activeId = null;
                }
            }
        }
        this.updateUI();
        this.saveSession();
    },

    getActive() {
        return this.layers.find(l => l.id === this.activeId) || this.layers[0] || null;
    },

    setActive(id) {
        this.activeId = id;
        this.layers.forEach(l => {
            if (l.element) {
                l.element.classList.toggle('active-layer', l.id === id);
            }
        });
        this.syncActiveControls();
        this.updateUI();
    },

    syncActiveControls() {
        const active = this.getActive();
        if (!active) return;
        const bSlider = document.getElementById('brightness-slider');
        const bInput = document.getElementById('brightness-input');
        const bVal = document.getElementById('brightness-val');
        if (bSlider) bSlider.value = active.brightness;
        if (bInput) bInput.value = active.brightness;
        if (bVal) bVal.innerText = `${active.brightness}%`;

        const sSlider = document.getElementById('stencil-slider');
        const sVal = document.getElementById('stencil-val');
        if (sSlider) sSlider.value = active.stencilDensity;
        if (sVal) sVal.innerText = `${active.stencilDensity}`;

        const skXSlider = document.getElementById('skew-x-slider');
        const skXVal = document.getElementById('skew-x-val');
        if (skXSlider) skXSlider.value = active.skewX;
        if (skXVal) skXVal.innerText = `${active.skewX}°`;

        const skYSlider = document.getElementById('skew-y-slider');
        const skYVal = document.getElementById('skew-y-val');
        if (skYSlider) skYSlider.value = active.skewY;
        if (skYVal) skYVal.innerText = `${active.skewY}°`;

        const btnInvert = document.getElementById('btn-invert');
        if (btnInvert) btnInvert.classList.toggle('active', active.isInverted);
        const btnContrast = document.getElementById('btn-contrast');
        if (btnContrast) btnContrast.classList.toggle('active', active.isContrast);

        const dInvert = document.getElementById('btn-drawer-invert');
        if (dInvert) dInvert.classList.toggle('active', active.isInverted);
        const dContrast = document.getElementById('btn-drawer-contrast');
        if (dContrast) dContrast.classList.toggle('active', active.isContrast);

        const btnStencil = document.getElementById('btn-stencil');
        if (btnStencil) btnStencil.classList.toggle('active', active.isStencil);
        const btnFlipX = document.getElementById('btn-flip-x');
        if (btnFlipX) btnFlipX.classList.toggle('active', active.flipX === -1);
        const btnFlipY = document.getElementById('btn-flip-y');
        if (btnFlipY) btnFlipY.classList.toggle('active', active.flipY === -1);
    },

    renderLayer(layer) {
        if (!layer || !layer.element) return;
        layer.element.style.transform = `translate3d(${layer.translateX}px, ${layer.translateY}px, 0) rotate(${layer.rotation}deg) scale(${layer.scale * layer.flipX}, ${layer.scale * layer.flipY}) rotateX(${layer.skewY}deg) rotateY(${layer.skewX}deg)`;

        let filterString = `brightness(${Math.min(layer.brightness, 100)}%) `;
        if (layer.brightness > 100) {
            filterString += `brightness(${layer.brightness}%) saturate(${100 + (layer.brightness - 100) * 0.4}%) `;
        }
        if (layer.isInverted) filterString += `invert(100%) `;
        if (layer.isContrast) filterString += `contrast(220%) `;

        layer.imgElem.style.filter = filterString;
        layer.canvasElem.style.filter = filterString;

        if (layer.isStencil) {
            layer.canvasElem.style.display = 'block';
            layer.imgElem.style.display = 'none';
            this.applySobel(layer);
        } else {
            layer.canvasElem.style.display = 'none';
            layer.imgElem.style.display = 'block';
        }
    },

    applySobel(layer) {
        if (!layer.rawImage.src || !layer.rawImage.width) return;
        const canvas = layer.canvasElem;
        const ctx = canvas.getContext('2d');
        const w = Math.min(layer.rawImage.width, 1200);
        const h = (layer.rawImage.height / layer.rawImage.width) * w;
        canvas.width = w;
        canvas.height = h;

        try {
            ctx.drawImage(layer.rawImage, 0, 0, w, h);
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;
            const gray = new Float32Array(w * h);

            for (let i = 0; i < data.length; i += 4) {
                gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            }

            const output = ctx.createImageData(w, h);
            const outData = output.data;
            const threshold = layer.stencilDensity;

            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const idx = y * w + x;
                    const gx =
                        -1 * gray[(y - 1) * w + (x - 1)] + 1 * gray[(y - 1) * w + (x + 1)] +
                        -2 * gray[y * w + (x - 1)] + 2 * gray[y * w + (x + 1)] +
                        -1 * gray[(y + 1) * w + (x - 1)] + 1 * gray[(y + 1) * w + (x + 1)];

                    const gy =
                        -1 * gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - 1 * gray[(y - 1) * w + (x + 1)] +
                        1 * gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + 1 * gray[(y + 1) * w + (x + 1)];

                    let mag = Math.hypot(gx, gy);
                    mag = mag > threshold ? 0 : 255;

                    const oIdx = idx * 4;
                    outData[oIdx] = mag;
                    outData[oIdx + 1] = mag;
                    outData[oIdx + 2] = mag;
                    outData[oIdx + 3] = 255;
                }
            }
            ctx.putImageData(output, 0, 0);
        } catch (corsErr) {
            layer.imgElem.style.filter = "grayscale(100%) contrast(350%) invert(100%)";
            layer.imgElem.style.display = 'block';
            layer.canvasElem.style.display = 'none';
        }
    },

    updateUI() {
        const welcomeSlate = document.getElementById('welcome-slate');
        const selectorBar = document.getElementById('layer-selector-bar');

        if (this.layers.length === 0) {
            if (typeof CameraEngine !== 'undefined' && !CameraEngine.isActive) {
                if (welcomeSlate) welcomeSlate.style.display = 'flex';
            }
            if (selectorBar) selectorBar.style.display = 'none';
        } else {
            if (welcomeSlate) welcomeSlate.style.display = 'none';
            if (selectorBar) {
                selectorBar.style.display = 'flex';
                selectorBar.innerHTML = '';

                this.layers.forEach((layer, idx) => {
                    const chip = document.createElement('div');
                    chip.className = `layer-chip ${layer.id === this.activeId ? 'active' : ''}`;
                    const rawName = layer.name || `Img ${idx + 1}`;
                    const displayName = rawName.length > 10 ? rawName.slice(0, 10) + '…' : rawName;
                    chip.title = rawName;
                    chip.innerHTML = `
                        <img src="${layer.dataUrl}" alt="" />
                        <span>${displayName}</span>
                        <button class="layer-chip-del" title="Delete image">✕</button>
                    `;

                    chip.onclick = (e) => {
                        this.setActive(layer.id);
                    };

                    chip.querySelector('.layer-chip-del').onclick = (e) => {
                        e.stopPropagation();
                        this.deleteLayer(layer.id);
                    };

                    selectorBar.appendChild(chip);
                });
            }
        }
        this.updateUndoButton();
    },

    saveSession() {
        try {
            const sessionData = this.layers.map(l => ({
                name: l.name,
                dataUrl: l.dataUrl,
                scale: l.scale,
                translateX: l.translateX,
                translateY: l.translateY,
                rotation: l.rotation,
                flipX: l.flipX,
                flipY: l.flipY,
                skewX: l.skewX,
                skewY: l.skewY,
                brightness: l.brightness,
                isInverted: l.isInverted,
                isContrast: l.isContrast,
                isStencil: l.isStencil,
                stencilDensity: l.stencilDensity
            }));
            localStorage.setItem('eStudio_session_layers', JSON.stringify(sessionData));
        } catch (e) { }
    },

    restoreSession() {
        try {
            const raw = localStorage.getItem('eStudio_session_layers');
            if (raw) {
                const sessionLayers = JSON.parse(raw);
                if (Array.isArray(sessionLayers) && sessionLayers.length > 0) {
                    sessionLayers.forEach(item => {
                        fetch(item.dataUrl)
                            .then(res => res.blob())
                            .then(blob => {
                                this.createLayer(blob, item.dataUrl, item.name, item, false);
                            })
                            .catch(() => { });
                    });
                }
            }
        } catch (e) { }
    }
};
