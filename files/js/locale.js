// ==========================================
// MODULE 1: LOCALIZATION & BILINGUAL STRINGS
// ==========================================
const LocaleEngine = {
    currentLang: 'en',
    i18n: {
        en: {
            guide_title: "eStudio Lightbox Guide",
            slate_byline: "Tap ? for access to the studio guide",
            lbl_luminance: "Luminance",
            lbl_tint: "Warm Tint",
            lbl_stencil_density: "Outline Density",
            lbl_grid_size: "Grid Spacing",
            lbl_grid_width: "Line Weight",
            lbl_grid_color: "Color Preset",
            lbl_skew_x: "Tilt Horizontal",
            lbl_skew_y: "Tilt Vertical",
            drawer_language: "Language / Idioma",
            drawer_transforms: "Transforms & Canvas",
            btn_rot_90: "Rotate 90°",
            btn_mask: "Paper Mask",
            btn_flip_h: "Flip Horiz",
            btn_flip_v: "Flip Vert",
            btn_keystone: "Keystone",
            btn_stencil: "Stenciler",
            btn_ruler: "1:1 Ruler",
            btn_tint: "Warm Tint",
            btn_invert: "Invert",
            btn_contrast: "Contrast",
            btn_save: "Bookmark",
            btn_reset: "Reset",
            btn_lock_text: "Lock",
            txt_unlock_hold: "Hold 1s to Unlock",
            btn_got_it: "Got it",
            btn_close: "Close",
            modal_what_title: "How It Works",
            modal_example_title: "Example / When To Use",
            collection_title: "My Collection",
            msg_saved_collection: "Saved to My Collection!",
            msg_empty_collection: "No saved images in your collection yet. Tap the bookmark icon on the toolbar to save the current drawing.",

            c_paste_t: "Paste", c_paste_d: "From clipboard",
            c_collection_t: "My Collection", c_collection_d: "Saved library",
            c_camera_t: "Live Camera", c_camera_d: "Trace real world",
            c_import_t: "Import File", c_import_d: "Open photo / SVG",
            c_grid_t: "Custom Grid", c_grid_d: "Scale & line rules",
            c_mask_t: "Paper Mask", c_mask_d: "A4 / A5 / Letter",
            c_stencil_t: "Stenciler", c_stencil_d: "Turn into lines",
            c_lock_t: "Touch Lock", c_lock_d: "Freeze to trace",

            cards: {
                paste: {
                    title: "Paste from Clipboard",
                    what: "Grabs any picture you copied from a website or chat and loads it instantly without saving files to your phone.",
                    example: "Copy an image from Pinterest or Google, open eStudio, and tap Paste to start tracing immediately."
                },
                collection: {
                    title: "My Collection (Offline Library)",
                    what: "Stores your favourite sketches and drawings right inside your device browser memory for quick access anytime, completely offline.",
                    example: "Save your go-to anatomy templates, coloring sheets, or starter outlines so you can reopen them with a single tap."
                },
                camera: {
                    title: "Live Camera Feed",
                    what: "Turns your phone or tablet camera on so you can see through your screen like a clear pane of glass.",
                    example: "Place a real leaf, toy, or printed sketch under your tablet to trace its shape onto paper."
                },
                import: {
                    title: "Import from Storage (Images & SVGs)",
                    what: "Opens your device gallery so you can choose your personal photos, downloaded pictures, or scalable vector SVG art. Supports multiple images simultaneously!",
                    example: "Trace multiple reference layers or a crisp SVG vector line drawing without any pixelation."
                },
                grid: {
                    title: "Customizable Overlay Grid",
                    what: "Renders an adjustable drafting grid over your canvas where you can adjust box spacing, line thickness, and color.",
                    example: "Use a subtle 20px cyan grid for small lettering, or a bold 80px grid for scaling large portraits."
                },
                mask: {
                    title: "Standard Paper Margin Mask",
                    what: "Draws an on-screen aspect boundary for standard physical paper sizes (A4, A5, US Letter, and Square).",
                    example: "Frame your sketch within the A4 boundary so your drawing never accidentally runs off your physical paper sheet."
                },
                stencil: {
                    title: "Stenciler / Outline Density",
                    what: "Automatically detects edges in regular photographs and turns them into clean line art with adjustable density.",
                    example: "Turn a realistic photo into a line-art coloring sheet and adjust the density slider to isolate outlines."
                },
                lock: {
                    title: "Touch Lock (Trace Mode)",
                    what: "Freezes the screen completely so you can lay real paper on the glass and draw without moving the picture.",
                    example: "Lock the screen, lay your drawing paper on top, and sketch freely. Long-press for 1 second to unlock."
                }
            }
        },
        es: {
            guide_title: "Guía eStudio Lightbox",
            slate_byline: "Toca ? para acceso a la guía de estudio",
            lbl_luminance: "Luminancia",
            lbl_tint: "Luz Cálida",
            lbl_stencil_density: "Densidad de Línea",
            lbl_grid_size: "Espaciado de Cuadrícula",
            lbl_grid_width: "Grosor de Línea",
            lbl_grid_color: "Color de Cuadrícula",
            lbl_skew_x: "Inclinación Horizontal",
            lbl_skew_y: "Inclinación Vertical",
            drawer_language: "Idioma / Language",
            drawer_transforms: "Transformaciones y Lienzo",
            btn_rot_90: "Rotar 90°",
            btn_mask: "Marco Papel",
            btn_flip_h: "Voltear H",
            btn_flip_v: "Voltear V",
            btn_keystone: "Perspectiva",
            btn_stencil: "Plantilla",
            btn_ruler: "Regla 1:1",
            btn_tint: "Luz Cálida",
            btn_invert: "Invertir",
            btn_contrast: "Contraste",
            btn_save: "Guardar",
            btn_reset: "Reiniciar",
            btn_lock_text: "Bloquear",
            txt_unlock_hold: "Mantén 1s para desbloquear",
            btn_got_it: "Entendido",
            btn_close: "Cerrar",
            modal_what_title: "Cómo Funciona",
            modal_example_title: "Ejemplo / Cuándo Usarlo",
            collection_title: "Mi Colección",
            msg_saved_collection: "¡Guardado en Mi Colección!",
            msg_empty_collection: "Aún no tienes dibujos guardados. Pulsa el icono de marcador en la barra para guardar el dibujo actual.",

            c_paste_t: "Pegar", c_paste_d: "Portapapeles",
            c_collection_t: "Mi Colección", c_collection_d: "Librería guardada",
            c_camera_t: "Cámara", c_camera_d: "Mundo real",
            c_import_t: "Abrir Foto / SVG", c_import_d: "Desde galería",
            c_grid_t: "Cuadrícula Pro", c_grid_d: "Ajustar escala",
            c_mask_t: "Marco Papel", c_mask_d: "A4 / A5 / Carta",
            c_stencil_t: "Plantilla", c_stencil_d: "Convertir a líneas",
            c_lock_t: "Bloquear", c_lock_d: "Fijar para calcar",

            cards: {
                paste: {
                    title: "Pegar desde Portapapeles",
                    what: "Carga al instante cualquier foto que hayas copiado de internet o de un chat, sin necesidad de guardarla en tu móvil.",
                    example: "Copia un dibujo en Pinterest o Google, abre eStudio y pulsa Pegar para empezar a calcar al momento."
                },
                collection: {
                    title: "Mi Colección (Librería Local)",
                    what: "Guarda tus dibujos y plantillas favoritos en la memoria de tu dispositivo para abrirlos siempre que quieras, totalmente sin conexión.",
                    example: "Guarda plantillas de anatomía, láminas de colorear para Elisa o tus diseños favoritos para abrirlos con un solo toque."
                },
                camera: {
                    title: "Cámara en Vivo",
                    what: "Enciende la cámara de tu dispositivo para ver a través de la pantalla como si fuera un cristal transparente.",
                    example: "Coloca una hoja natural, una figura o un dibujo debajo de la tablet para calcar su silueta sobre papel."
                },
                import: {
                    title: "Abrir desde la Galería (Imágenes y SVGs)",
                    what: "Abre los archivos de tu móvil o tablet para que puedas elegir fotos normales o dibujos vectoriales SVG escalables. ¡Permite múltiples capas al mismo tiempo!",
                    example: "Calca un retrato familiar o un trazado vectorial SVG sin que pierda nitidez al hacer zoom."
                },
                grid: {
                    title: "Cuadrícula Personalizable",
                    what: "Genera una cuadrícula de dibujo ajustable donde puedes cambiar la separación de las cajas, el grosor de línea y el color.",
                    example: "Usa una cuadrícula fina de 20px para caligrafía o una de 80px para ampliar retratos a escala."
                },
                mask: {
                    title: "Marco de Proporción de Papel",
                    what: "Dibuja un marco en pantalla correspondiente a los formatos físicos estándar (A4, A5, Carta y Cuadrado).",
                    example: "Encuadra tu dibujo en el marco A4 para asegurarte de que encaja perfectamente en tu folio físico."
                },
                stencil: {
                    title: "Creador de Plantillas (Líneas y Densidad)",
                    what: "Busca los bordes de una foto normal y la convierte en un dibujo de líneas con densidad ajustable.",
                    example: "Convierte una foto en un dibujo de líneas y ajusta el regulador de densidad para aislar los contornos."
                },
                lock: {
                    title: "Bloqueo Táctil (Modo Calcar)",
                    what: "Congela la pantalla para que puedas apoyar el papel y tu mano encima sin que la foto se mueva por accidente.",
                    example: "Bloquea la pantalla, coloca tu folio encima y calca con lápiz. Mantén pulsado 1 segundo para desbloquear."
                }
            }
        }
    },
    setLanguage(lang) {
        this.currentLang = lang;
        const btnEn = document.getElementById('btn-lang-en');
        const btnEs = document.getElementById('btn-lang-es');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
        if (btnEs) btnEs.classList.toggle('active', lang === 'es');

        const guideSuffix = lang === 'es' ? 'Guía' : 'Guide';
        const guideTitle = document.getElementById('txt-guide-title');
        if (guideTitle) {
            guideTitle.innerHTML = `
                <span class="brand-title-wrap" style="font-size:20px;">
                    <span class="brand-studio"><span class="brand-e">e</span>Studio</span>
                    <span class="brand-lightbox">Lightbox</span>
                </span>
                <span style="font-weight:400;color:#38bdf8;margin-left:6px;">${guideSuffix}</span>
            `;
        }

        const slateByline = document.getElementById('txt-slate-byline');
        if (slateByline) {
            slateByline.innerHTML = `
                <span>${lang === 'es' ? 'Toca' : 'Tap'}</span>
                <span class="byline-icon">?</span>
                <span>${lang === 'es' ? 'para acceso a la guía de estudio' : 'for access to the studio guide'}</span>
            `;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.i18n[lang] && this.i18n[lang][key]) el.innerText = this.i18n[lang][key];
        });
    }
};
