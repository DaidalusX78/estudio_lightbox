// ==========================================
// INITIALIZATION & UI BINDINGS
// ==========================================

// Screen Wake Lock API (keeps screen on while tracing)
let wakeLock = null;
async function initWakeLock() {
    if ('wakeLock' in navigator) {
        try { wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { }
    }
}

// Modal helper to open card details
function openCardModal(cardKey) {
    const cardDetailModal = document.getElementById('card-detail-modal');
    const data = LocaleEngine.i18n[LocaleEngine.currentLang]?.cards?.[cardKey];
    if (!data || !cardDetailModal) return;
    document.getElementById('card-modal-title').innerText = data.title;
    document.getElementById('card-modal-what').innerText = data.what;
    document.getElementById('card-modal-example').innerText = data.example;
    cardDetailModal.style.display = 'flex';
}

// Video Player Modal helpers
function openVideoModal() {
    const modal = document.getElementById('video-player-modal');
    const video = document.getElementById('intro-video');
    if (!modal || !video) return;
    modal.style.display = 'flex';
    video.currentTime = 0;
    video.play().catch(e => {});
}

function closeVideoModal() {
    const modal = document.getElementById('video-player-modal');
    const video = document.getElementById('intro-video');
    if (!modal) return;
    if (video) {
        video.pause();
    }
    modal.style.display = 'none';
}

// Clipboard Paste
async function pasteFromClipboard() {
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
                const blob = await item.getType(imageType);
                LayerManager.addLayerFromBlob(blob, `Pasted ${LayerManager.nextLayerNum}`);
                return;
            }
        }
        alert(LocaleEngine.currentLang === 'es' ? "No se encontró ninguna imagen en el portapapeles." : "No image found on clipboard.");
    } catch (err) {
        alert(LocaleEngine.currentLang === 'es' ? "Por favor concede permiso de portapapeles o usa Ctrl+V." : "Please grant clipboard permission or use Ctrl+V.");
    }
}

// Main App Lifecycle Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core Engines
    StorageModule.init();
    CameraEngine.init();
    LayerManager.init();
    GestureEngine.init();
    FilterEngine.init();
    initWakeLock();

    // 2. DOM Elements Cache
    const guideDrawerModal = document.getElementById('guide-drawer-modal');
    const cardDetailModal = document.getElementById('card-detail-modal');
    const collectionModal = document.getElementById('collection-modal');
    const brightnessPopup = document.getElementById('brightness-popup');
    const tintPopup = document.getElementById('tint-popup');
    const gridCustomizerPopup = document.getElementById('grid-customizer-popup');
    const keystonePopup = document.getElementById('keystone-popup');
    const overflowDrawer = document.getElementById('overflow-drawer');
    const fileInput = document.getElementById('file-input');
    const toolbar = document.getElementById('toolbar');
    const lockShield = document.getElementById('lock-shield');
    const unlockPill = document.getElementById('unlock-pill');
    const unlockProgress = document.getElementById('unlock-progress');
    const fullscreenIcon = document.getElementById('fullscreen-icon');

    // 3. Restore Previous Session Layers
    LayerManager.restoreSession();

    // 4. Undo Button
    document.getElementById('btn-undo')?.addEventListener('click', () => {
        LayerManager.undo();
    });

    // Central Mutual Exclusion Helper for Modals & Drawers
    const syncToolbarPopupActiveStates = () => {
        document.getElementById('btn-help')?.classList.toggle('active', guideDrawerModal?.style.display === 'flex');
        document.getElementById('btn-open-collection')?.classList.toggle('active', collectionModal?.style.display === 'flex');
        document.getElementById('btn-brightness-toggle')?.classList.toggle('active', brightnessPopup?.style.display === 'flex');
        document.getElementById('btn-grid')?.classList.toggle('active', FilterEngine.isGrid || gridCustomizerPopup?.style.display === 'flex');
        document.getElementById('btn-overflow')?.classList.toggle('active', overflowDrawer?.style.display === 'flex');
        document.getElementById('btn-keystone-toggle')?.classList.toggle('active', keystonePopup?.style.display === 'flex');
        document.getElementById('btn-tint-toggle')?.classList.toggle('active', tintPopup?.style.display === 'flex');
        document.getElementById('btn-ruler')?.classList.toggle('active', !!FilterEngine.isRuler);
    };

    const closeAllPopupsAndDrawers = (except = null) => {
        if (guideDrawerModal && except !== guideDrawerModal) guideDrawerModal.style.display = 'none';
        if (collectionModal && except !== collectionModal) collectionModal.style.display = 'none';
        if (overflowDrawer && except !== overflowDrawer) overflowDrawer.style.display = 'none';
        if (brightnessPopup && except !== brightnessPopup) brightnessPopup.style.display = 'none';
        if (tintPopup && except !== tintPopup) tintPopup.style.display = 'none';
        if (gridCustomizerPopup && except !== gridCustomizerPopup) gridCustomizerPopup.style.display = 'none';
        if (keystonePopup && except !== keystonePopup) keystonePopup.style.display = 'none';
        const cardDetail = document.getElementById('card-detail-modal');
        if (cardDetail && except !== cardDetail) cardDetail.style.display = 'none';
        syncToolbarPopupActiveStates();
    };

    // 5. Studio Guide & Modals
    document.getElementById('btn-close-card-modal')?.addEventListener('click', () => {
        if (cardDetailModal) cardDetailModal.style.display = 'none';
    });

    document.getElementById('btn-close-guide')?.addEventListener('click', () => {
        if (guideDrawerModal) guideDrawerModal.style.display = 'none';
        syncToolbarPopupActiveStates();
    });

    document.getElementById('btn-help')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (guideDrawerModal) {
            const isCurrentlyOpen = guideDrawerModal.style.display === 'flex';
            closeAllPopupsAndDrawers(guideDrawerModal);
            guideDrawerModal.style.display = isCurrentlyOpen ? 'none' : 'flex';
            syncToolbarPopupActiveStates();
        }
    });

    // 6. Paste & File Import
    document.getElementById('btn-paste')?.addEventListener('click', pasteFromClipboard);

    window.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                LayerManager.addLayerFromBlob(item.getAsFile(), `Pasted ${LayerManager.nextLayerNum}`);
                break;
            }
        }
    });

    document.getElementById('btn-import')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach(f => {
                LayerManager.addLayerFromBlob(f, f.name.replace(/\.[^/.]+$/, ""));
            });
        }
    });

    // Drag & Drop
    const dragOverlay = document.getElementById('drag-overlay');
    window.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dragOverlay) dragOverlay.style.display = 'block';
    });
    window.addEventListener('dragleave', (e) => {
        if (e.clientX <= 0 || e.clientY <= 0) {
            if (dragOverlay) dragOverlay.style.display = 'none';
        }
    });
    window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragOverlay) dragOverlay.style.display = 'none';
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(f => {
                LayerManager.addLayerFromBlob(f, f.name.replace(/\.[^/.]+$/, ""));
            });
        }
    });

    // 7. Collection Modal (IndexedDB)
    document.getElementById('btn-save-collection')?.addEventListener('click', () => StorageModule.saveCurrent());
    document.getElementById('btn-drawer-save')?.addEventListener('click', () => StorageModule.saveCurrent());

    document.getElementById('btn-open-collection')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const grid = document.getElementById('library-grid');
        if (!grid || !collectionModal) return;
        const isCurrentlyOpen = collectionModal.style.display === 'flex';
        closeAllPopupsAndDrawers(collectionModal);
        if (isCurrentlyOpen) {
            collectionModal.style.display = 'none';
            syncToolbarPopupActiveStates();
            return;
        }
        grid.innerHTML = '';
        StorageModule.loadAll((items) => {
            if (!items || items.length === 0) {
                grid.innerHTML = `<div class="empty-library-notice">${LocaleEngine.i18n[LocaleEngine.currentLang].msg_empty_collection}</div>`;
                return;
            }
            items.reverse().forEach(item => {
                const div = document.createElement('div');
                div.className = 'library-item';
                const imgSrc = item.blob ? URL.createObjectURL(item.blob) : (item.dataUrl || '');
                div.innerHTML = `<img src="${imgSrc}" alt="Reference" /><button class="library-item-del" title="Delete">✕</button>`;
                div.querySelector('img').onclick = () => {
                    if (item.blob) {
                        LayerManager.addLayerFromBlob(item.blob, item.name || 'Saved Item');
                    } else if (item.dataUrl) {
                        LayerManager.createLayer(null, item.dataUrl, item.name || 'Saved Item', null, true);
                    }
                    collectionModal.style.display = 'none';
                    syncToolbarPopupActiveStates();
                };
                div.querySelector('.library-item-del').onclick = (ev) => {
                    ev.stopPropagation();
                    StorageModule.deleteItem(item.id, () => document.getElementById('btn-open-collection')?.click());
                };
                grid.appendChild(div);
            });
        });
        collectionModal.style.display = 'flex';
        syncToolbarPopupActiveStates();
    });
    document.getElementById('btn-close-collection')?.addEventListener('click', () => {
        if (collectionModal) collectionModal.style.display = 'none';
        syncToolbarPopupActiveStates();
    });

    const flashActionGlow = (...elements) => {
        elements.forEach(elem => {
            if (!elem) return;
            elem.classList.add('action-tap-glow');
            setTimeout(() => elem.classList.remove('action-tap-glow'), 220);
        });
    };

    // 8. Grid Controls
    document.getElementById('btn-grid')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!FilterEngine.isGrid) {
            FilterEngine.isGrid = true;
            FilterEngine.renderGrid();
            closeAllPopupsAndDrawers(gridCustomizerPopup);
            if (gridCustomizerPopup) gridCustomizerPopup.style.display = 'flex';
        } else {
            if (gridCustomizerPopup && gridCustomizerPopup.style.display === 'flex') {
                gridCustomizerPopup.style.display = 'none';
            } else {
                closeAllPopupsAndDrawers(gridCustomizerPopup);
                if (gridCustomizerPopup) gridCustomizerPopup.style.display = 'flex';
            }
        }
        syncToolbarPopupActiveStates();
    });

    document.getElementById('btn-close-grid')?.addEventListener('click', (e) => {
        e.stopPropagation();
        FilterEngine.isGrid = false;
        FilterEngine.renderGrid();
        if (gridCustomizerPopup) gridCustomizerPopup.style.display = 'none';
        syncToolbarPopupActiveStates();
    });

    document.getElementById('grid-size-slider')?.addEventListener('input', (e) => {
        FilterEngine.gridSpacing = parseInt(e.target.value);
        const valElem = document.getElementById('grid-size-val');
        if (valElem) valElem.innerText = `${FilterEngine.gridSpacing}px`;
        FilterEngine.renderGrid();
    });

    document.getElementById('grid-width-slider')?.addEventListener('input', (e) => {
        FilterEngine.gridLineWidth = parseFloat(e.target.value) / 10;
        const valElem = document.getElementById('grid-width-val');
        if (valElem) valElem.innerText = `${FilterEngine.gridLineWidth.toFixed(1)}px`;
        FilterEngine.renderGrid();
    });

    // 9. Invert, Contrast, Reset
    const triggerInvertToggle = () => {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('invert');
        active.isInverted = !active.isInverted;
        document.body.classList.toggle('dark-mode', active.isInverted);
        document.getElementById('btn-invert')?.classList.toggle('active', !!active.isInverted);
        document.getElementById('btn-drawer-invert')?.classList.toggle('active', !!active.isInverted);
        FilterEngine.update();
        LayerManager.saveSession();
    };

    const triggerContrastToggle = () => {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('contrast');
        active.isContrast = !active.isContrast;
        document.getElementById('btn-contrast')?.classList.toggle('active', !!active.isContrast);
        document.getElementById('btn-drawer-contrast')?.classList.toggle('active', !!active.isContrast);
        FilterEngine.update();
        LayerManager.saveSession();
    };

    document.getElementById('btn-invert')?.addEventListener('click', triggerInvertToggle);
    document.getElementById('btn-drawer-invert')?.addEventListener('click', triggerInvertToggle);
    document.getElementById('btn-contrast')?.addEventListener('click', triggerContrastToggle);
    document.getElementById('btn-drawer-contrast')?.addEventListener('click', triggerContrastToggle);

    document.getElementById('btn-reset')?.addEventListener('click', () => {
        GestureEngine.reset();
    });

    // 10. Overflow Drawer Tools
    document.getElementById('btn-overflow')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (overflowDrawer) {
            const isCurrentlyOpen = overflowDrawer.style.display === 'flex';
            closeAllPopupsAndDrawers(overflowDrawer);
            overflowDrawer.style.display = isCurrentlyOpen ? 'none' : 'flex';
            syncToolbarPopupActiveStates();
        }
    });

    const triggerRotate90 = () => {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('rotate_90');
        active.rotation = (Math.round(active.rotation / 90) * 90) + 90;
        if (navigator.vibrate) navigator.vibrate(25);
        LayerManager.renderLayer(active);
        LayerManager.saveSession();
    };

    const triggerFlipX = () => {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('flip_x');
        active.flipX = (active.flipX || 1) * -1;
        if (navigator.vibrate) navigator.vibrate(25);
        LayerManager.renderLayer(active);
        LayerManager.saveSession();
    };

    const triggerFlipY = () => {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('flip_y');
        active.flipY = (active.flipY || 1) * -1;
        if (navigator.vibrate) navigator.vibrate(25);
        LayerManager.renderLayer(active);
        LayerManager.saveSession();
    };

    document.getElementById('btn-rotate-90')?.addEventListener('click', triggerRotate90);
    document.getElementById('btn-toolbar-rotate')?.addEventListener('click', triggerRotate90);
    document.getElementById('btn-flip-x')?.addEventListener('click', triggerFlipX);
    document.getElementById('btn-toolbar-flip-x')?.addEventListener('click', triggerFlipX);
    document.getElementById('btn-flip-y')?.addEventListener('click', triggerFlipY);
    document.getElementById('btn-toolbar-flip-y')?.addEventListener('click', triggerFlipY);

    document.getElementById('btn-keystone-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (keystonePopup) {
            const isCurrentlyOpen = keystonePopup.style.display === 'flex';
            closeAllPopupsAndDrawers(keystonePopup);
            keystonePopup.style.display = isCurrentlyOpen ? 'none' : 'flex';
            syncToolbarPopupActiveStates();
        }
    });

    document.getElementById('skew-x-slider')?.addEventListener('input', (e) => {
        const active = LayerManager.getActive();
        if (!active) return;
        active.skewX = parseInt(e.target.value);
        const valElem = document.getElementById('skew-x-val');
        if (valElem) valElem.innerText = `${active.skewX}°`;
        GestureEngine.requestRender();
        LayerManager.saveSession();
    });

    document.getElementById('skew-y-slider')?.addEventListener('input', (e) => {
        const active = LayerManager.getActive();
        if (!active) return;
        active.skewY = parseInt(e.target.value);
        const valElem = document.getElementById('skew-y-val');
        if (valElem) valElem.innerText = `${active.skewY}°`;
        GestureEngine.requestRender();
        LayerManager.saveSession();
    });

    const triggerStencilToggle = () => {
        const active = LayerManager.getActive();
        if (!active) return;
        LayerManager.recordHistory('stencil');
        active.isStencil = !active.isStencil;
        document.getElementById('btn-stencil')?.classList.toggle('active', !!active.isStencil);
        if (navigator.vibrate) navigator.vibrate(25);
        LayerManager.renderLayer(active);
        LayerManager.saveSession();
    };

    document.getElementById('btn-stencil')?.addEventListener('click', triggerStencilToggle);
    document.getElementById('btn-drawer-stencil')?.addEventListener('click', triggerStencilToggle);

    document.getElementById('btn-ruler')?.addEventListener('click', (e) => {
        e.stopPropagation();
        FilterEngine.isRuler = !FilterEngine.isRuler;
        FilterEngine.renderRuler();
        syncToolbarPopupActiveStates();
    });

    // Drawer action duplicates (accessible when hidden from compact mobile bar)
    document.getElementById('btn-drawer-camera')?.addEventListener('click', () => {
        document.getElementById('btn-camera')?.click();
    });

    document.getElementById('btn-drawer-fullscreen')?.addEventListener('click', () => {
        document.getElementById('btn-fullscreen')?.click();
    });

    document.getElementById('btn-drawer-reset')?.addEventListener('click', () => {
        document.getElementById('btn-reset')?.click();
    });

    // 11. Brightness & Tint Popups
    document.getElementById('btn-brightness-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (brightnessPopup) {
            const isCurrentlyOpen = brightnessPopup.style.display === 'flex';
            closeAllPopupsAndDrawers(brightnessPopup);
            brightnessPopup.style.display = isCurrentlyOpen ? 'none' : 'flex';
            syncToolbarPopupActiveStates();
        }
    });

    const updateBrightness = (val, fromInput = false) => {
        const active = LayerManager.getActive();
        if (!active) return;
        let num = parseInt(val, 10);
        if (isNaN(num)) num = 100;
        num = Math.max(10, Math.min(200, num));
        active.brightness = num;

        const slider = document.getElementById('brightness-slider');
        const input = document.getElementById('brightness-input');
        const valElem = document.getElementById('brightness-val');

        if (slider && fromInput) slider.value = num;
        if (input && !fromInput) input.value = num;
        if (valElem) valElem.innerText = `${num}%`;

        FilterEngine.update();
        LayerManager.saveSession();
    };

    document.getElementById('brightness-slider')?.addEventListener('input', (e) => {
        updateBrightness(e.target.value, false);
    });

    document.getElementById('brightness-input')?.addEventListener('input', (e) => {
        updateBrightness(e.target.value, true);
    });

    document.getElementById('brightness-input')?.addEventListener('change', (e) => {
        const active = LayerManager.getActive();
        if (active && e.target) {
            e.target.value = active.brightness;
        }
    });

    document.getElementById('btn-tint-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tintPopup) {
            const isCurrentlyOpen = tintPopup.style.display === 'flex';
            closeAllPopupsAndDrawers(tintPopup);
            tintPopup.style.display = isCurrentlyOpen ? 'none' : 'flex';
            syncToolbarPopupActiveStates();
        }
    });

    document.getElementById('tint-slider')?.addEventListener('input', (e) => {
        FilterEngine.tintVal = parseInt(e.target.value);
        const valElem = document.getElementById('tint-val');
        if (valElem) valElem.innerText = `${FilterEngine.tintVal}%`;
        FilterEngine.update();
    });

    // 12. Fullscreen API
    const expandIconPath = "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z";
    const collapseIconPath = "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z";

    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen().catch(() => { });
        }
    });

    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = !!document.fullscreenElement;
        if (fullscreenIcon) {
            fullscreenIcon.innerHTML = `<path d="${isFullscreen ? collapseIconPath : expandIconPath}"/>`;
        }
        document.getElementById('btn-fullscreen')?.classList.toggle('active', isFullscreen);
    });

    // 13. Touch Lock Mode with Haptics
    document.getElementById('btn-lock')?.addEventListener('click', () => {
        GestureEngine.isLocked = true;
        if (lockShield) lockShield.style.display = 'block';
        if (toolbar) toolbar.classList.add('toolbar-locked');
        const layerSelectorBar = document.getElementById('layer-selector-bar');
        if (layerSelectorBar) layerSelectorBar.style.display = 'none';
        if (CameraEngine.shutterBtn) CameraEngine.shutterBtn.style.display = 'none';
        if (brightnessPopup) brightnessPopup.style.display = 'none';
        if (tintPopup) tintPopup.style.display = 'none';
        if (gridCustomizerPopup) gridCustomizerPopup.style.display = 'none';
        if (keystonePopup) keystonePopup.style.display = 'none';
        if (overflowDrawer) overflowDrawer.style.display = 'none';
        syncToolbarPopupActiveStates();
        if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    });

    let holdTimer = null;
    unlockPill?.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        unlockPill.classList.add('holding');
        if (unlockProgress) {
            unlockProgress.style.opacity = '1';
            unlockProgress.style.transform = 'scaleX(1)';
            unlockProgress.style.transition = 'transform 1s linear, opacity 0.15s ease';
        }
        holdTimer = setTimeout(() => {
            GestureEngine.isLocked = false;
            unlockPill.classList.remove('holding');
            if (lockShield) lockShield.style.display = 'none';
            if (toolbar) toolbar.classList.remove('toolbar-locked');
            LayerManager.updateUI();
            if (CameraEngine.isActive && CameraEngine.shutterBtn) {
                CameraEngine.shutterBtn.style.display = 'flex';
            }
            if (unlockProgress) {
                unlockProgress.style.transition = 'none';
                unlockProgress.style.opacity = '0';
                unlockProgress.style.transform = 'scaleX(0)';
            }
            if (navigator.vibrate) navigator.vibrate(60);
        }, 1000);
    });

    const cancelHold = () => {
        clearTimeout(holdTimer);
        unlockPill?.classList.remove('holding');
        if (unlockProgress) {
            unlockProgress.style.transition = 'none';
            unlockProgress.style.opacity = '0';
            unlockProgress.style.transform = 'scaleX(0)';
        }
    };
    unlockPill?.addEventListener('pointerup', cancelHold);
    unlockPill?.addEventListener('pointerleave', cancelHold);
    unlockPill?.addEventListener('pointercancel', cancelHold);

    // 14. Click-Outside Popups Dismissal
    document.addEventListener('click', (e) => {
        let changed = false;
        if (guideDrawerModal && guideDrawerModal.style.display === 'flex' && e.target === guideDrawerModal) {
            guideDrawerModal.style.display = 'none';
            changed = true;
        }
        if (brightnessPopup && !brightnessPopup.contains(e.target) && e.target.id !== 'btn-brightness-toggle') {
            if (brightnessPopup.style.display === 'flex') {
                brightnessPopup.style.display = 'none';
                changed = true;
            }
        }
        if (tintPopup && !tintPopup.contains(e.target) && e.target.id !== 'btn-tint-toggle') {
            if (tintPopup.style.display === 'flex') {
                tintPopup.style.display = 'none';
                changed = true;
            }
        }
        if (gridCustomizerPopup && !gridCustomizerPopup.contains(e.target) && e.target.id !== 'btn-grid') {
            if (gridCustomizerPopup.style.display === 'flex') {
                gridCustomizerPopup.style.display = 'none';
                changed = true;
            }
        }
        if (keystonePopup && !keystonePopup.contains(e.target) && e.target.id !== 'btn-keystone-toggle') {
            if (keystonePopup.style.display === 'flex') {
                keystonePopup.style.display = 'none';
                changed = true;
            }
        }
        if (overflowDrawer && !overflowDrawer.contains(e.target) && e.target.id !== 'btn-overflow') {
            if (overflowDrawer.style.display === 'flex') {
                overflowDrawer.style.display = 'none';
                changed = true;
            }
        }
        if (changed) {
            syncToolbarPopupActiveStates();
        }
    });

    // 15. Visibility change wake lock
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') initWakeLock();
    });
});
