// ==========================================
// MODULE 4: GESTURE & TRANSFORM ENGINE
// ==========================================
const GestureEngine = {
    isLocked: false,
    activePointers: new Map(),
    initialDistance: null,
    initialAngle: null,
    startScale: 1,
    startRotation: 0,
    lastPanX: 0,
    lastPanY: 0,
    rAFScheduled: false,
    hasMoved: false,
    targetMode: 'layer', // 'layer' or 'camera'

    init() {
        const viewport = document.getElementById('viewport');
        if (!viewport) return;

        viewport.addEventListener('pointerdown', (e) => {
            if (this.isLocked) return;
            this.activePointers.set(e.pointerId, e);

            const active = LayerManager.getActive();
            const isLayerTarget = e.target && e.target.closest && e.target.closest('.canvas-layer');

            if (typeof CameraEngine !== 'undefined' && CameraEngine.isActive && (!active || !isLayerTarget)) {
                this.targetMode = 'camera';
            } else {
                this.targetMode = 'layer';
            }

            this.hasMoved = false;
            if (this.activePointers.size === 1) {
                this.lastPanX = e.clientX;
                this.lastPanY = e.clientY;
            } else if (this.activePointers.size === 2) {
                const [p1, p2] = Array.from(this.activePointers.values());
                this.initialDistance = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
                this.initialAngle = Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX) * (180 / Math.PI);
                if (this.targetMode === 'camera' && typeof CameraEngine !== 'undefined') {
                    this.startScale = CameraEngine.scale;
                } else if (active) {
                    this.startScale = active.scale;
                    this.startRotation = active.rotation;
                }
            }
        });

        viewport.addEventListener('pointermove', (e) => {
            if (this.isLocked || !this.activePointers.has(e.pointerId)) return;
            this.activePointers.set(e.pointerId, e);

            if (this.targetMode === 'camera' && typeof CameraEngine !== 'undefined' && CameraEngine.isActive) {
                if (this.activePointers.size === 1) {
                    CameraEngine.translateX += (e.clientX - this.lastPanX);
                    CameraEngine.translateY += (e.clientY - this.lastPanY);
                    this.lastPanX = e.clientX;
                    this.lastPanY = e.clientY;
                    CameraEngine.renderTransform();
                } else if (this.activePointers.size === 2) {
                    const [p1, p2] = Array.from(this.activePointers.values());
                    const curDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
                    if (this.initialDistance && curDist) {
                        CameraEngine.scale = Math.min(Math.max(this.startScale * (curDist / this.initialDistance), 1.0), 8.0);
                        CameraEngine.renderTransform();
                    }
                }
                return;
            }

            const active = LayerManager.getActive();
            if (!active) return;

            if (!this.hasMoved) {
                LayerManager.recordHistory('transform_start');
                this.hasMoved = true;
            }

            if (this.activePointers.size === 1) {
                active.translateX += e.clientX - this.lastPanX;
                active.translateY += e.clientY - this.lastPanY;
                this.lastPanX = e.clientX;
                this.lastPanY = e.clientY;
                this.requestRender();
            } else if (this.activePointers.size === 2) {
                const [p1, p2] = Array.from(this.activePointers.values());
                const curDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
                const curAngle = Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX) * (180 / Math.PI);

                if (this.initialDistance && curDist) {
                    active.scale = Math.min(Math.max(this.startScale * (curDist / this.initialDistance), 0.15), 12);
                }
                if (this.initialAngle !== null && curAngle !== null) {
                    active.rotation = this.startRotation + (curAngle - this.initialAngle);
                }
                this.requestRender();
            }
        });

        const endPointer = (e) => {
            this.activePointers.delete(e.pointerId);
            if (this.activePointers.size === 1) {
                const rem = Array.from(this.activePointers.values())[0];
                this.lastPanX = rem.clientX;
                this.lastPanY = rem.clientY;
            } else if (this.activePointers.size === 0) {
                this.initialDistance = null;
                this.initialAngle = null;
                if (this.targetMode === 'layer') {
                    LayerManager.saveSession();
                }
            }
        };

        viewport.addEventListener('pointerup', endPointer);
        viewport.addEventListener('pointercancel', endPointer);

        viewport.addEventListener('wheel', (e) => {
            if (this.isLocked) return;
            e.preventDefault();

            const active = LayerManager.getActive();
            if (typeof CameraEngine !== 'undefined' && CameraEngine.isActive && !active) {
                const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
                CameraEngine.scale = Math.min(Math.max(CameraEngine.scale * zoomFactor, 1.0), 8.0);
                CameraEngine.renderTransform();
                return;
            }

            if (!active) return;
            LayerManager.recordHistory('wheel_zoom');
            if (e.shiftKey) {
                active.translateX -= e.deltaY;
                active.translateY -= e.deltaX;
            } else {
                const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
                active.scale = Math.min(Math.max(active.scale * zoomFactor, 0.15), 12);
            }
            this.requestRender();
            LayerManager.saveSession();
        }, { passive: false });

        let lastTap = 0;
        viewport.addEventListener('click', (e) => {
            if (this.isLocked) return;
            if (e.target.closest('#btn-camera-shutter') || e.target.closest('#toolbar') || e.target.closest('#layer-selector-bar')) return;
            const now = Date.now();
            if (now - lastTap < 300) this.toggleQuickFit();
            lastTap = now;
        });
    },

    rotateStep90() {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('rotate_90');
        active.rotation = (Math.round(active.rotation / 90) * 90) + 90;
        if (navigator.vibrate) navigator.vibrate(25);
        this.requestRender();
        LayerManager.saveSession();
    },

    requestRender() {
        if (!this.rAFScheduled) {
            this.rAFScheduled = true;
            window.requestAnimationFrame(() => {
                const active = LayerManager.getActive();
                if (active) LayerManager.renderLayer(active);
                this.rAFScheduled = false;
            });
        }
    },

    reset() {
        if (typeof CameraEngine !== 'undefined' && CameraEngine.isActive) {
            CameraEngine.scale = 1;
            CameraEngine.translateX = 0;
            CameraEngine.translateY = 0;
            CameraEngine.renderTransform();
        }
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('reset_transform');
        active.scale = 1;
        active.translateX = 0;
        active.translateY = 0;
        active.rotation = 0;
        active.flipX = 1;
        active.flipY = 1;
        active.skewX = 0;
        active.skewY = 0;
        const skXSlider = document.getElementById('skew-x-slider');
        const skYSlider = document.getElementById('skew-y-slider');
        const skXVal = document.getElementById('skew-x-val');
        const skYVal = document.getElementById('skew-y-val');
        if (skXSlider) skXSlider.value = 0;
        if (skYSlider) skYSlider.value = 0;
        if (skXVal) skXVal.innerText = "0°";
        if (skYVal) skYVal.innerText = "0°";
        this.requestRender();
        LayerManager.saveSession();
    },

    toggleQuickFit() {
        if (typeof CameraEngine !== 'undefined' && CameraEngine.isActive && !LayerManager.getActive()) {
            CameraEngine.scale = (CameraEngine.scale === 1 ? 2.0 : 1.0);
            if (CameraEngine.scale === 1) {
                CameraEngine.translateX = 0;
                CameraEngine.translateY = 0;
            }
            CameraEngine.renderTransform();
            if (navigator.vibrate) navigator.vibrate(15);
            return;
        }
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('quick_fit');
        active.scale = active.scale === 1 ? 2.2 : 1.0;
        if (active.scale === 1.0) {
            active.translateX = 0;
            active.translateY = 0;
        }
        if (navigator.vibrate) navigator.vibrate(15);
        this.requestRender();
        LayerManager.saveSession();
    }
};
