// ==========================================
// MODULE 1: LOCALIZATION & BILINGUAL STRINGS
// ==========================================
const LocaleEngine = {
    currentLang: 'en',
    i18n: {
        en: {
            guide_title: "eStudio Lightbox Guide",
            guide_eyebrow: "Studio Guide",
            lbl_luminance: "Luminance",
            lbl_tint: "Warm Light Tint",
            lbl_stencil_density: "Outline Density",
            lbl_grid_size: "Grid Spacing",
            lbl_grid_width: "Line Weight",
            lbl_grid_color: "Color Preset",
            lbl_skew_x: "Tilt Horizontal",
            lbl_skew_y: "Tilt Vertical",
            drawer_language: "Language / Idioma",
            drawer_transforms: "Transforms & Canvas",
            btn_rot_90: "Rotate 90°",
            btn_flip_h: "Flip Horiz",
            btn_flip_v: "Flip Vert",
            btn_keystone: "Keystone",
            btn_stencil: "Stenciler",
            btn_ruler: "1:1 Ruler",
            btn_tint: "Warm Tint",
            btn_invert: "Invert",
            btn_contrast: "Contrast",
            btn_camera: "Camera Feed",
            btn_fullscreen: "Full Screen",
            btn_save: "Save to Collection",
            btn_reset: "Reset",
            btn_lock_text: "Lock",
            txt_unlock_hold: "Hold 1s to Unlock",
            btn_got_it: "Got it",
            btn_close: "Close",
            modal_what_title: "How It Works",
            modal_example_title: "Example / When To Use",
            collection_title: "My Collection",
            msg_saved_collection: "Saved to My Collection!",
            msg_empty_collection: "No saved images in your collection yet. Tap the save icon on the toolbar to save the current drawing.",

            sec_tracing: "Tracing & Canvas",
            sec_lighting: "Lighting & Contrast",
            sec_geometry: "Geometry & Alignment",
            sec_media: "Media & Storage",

            c_lock_t: "Touch Lock", c_lock_d: "Freeze to trace",
            c_stencil_t: "Stenciler", c_stencil_d: "Turn into lines",
            c_ruler_t: "1:1 Ruler", c_ruler_d: "True screen scale",
            c_camera_t: "Live Camera", c_camera_d: "Trace real world",

            c_brightness_t: "Luminance", c_brightness_d: "Slider & number",
            c_tint_t: "Warm Light", c_tint_d: "Eye comfort tone",
            c_invert_t: "Invert Colors", c_invert_d: "Negative mode",
            c_contrast_t: "Contrast Boost", c_contrast_d: "Crisp outlines",

            c_keystone_t: "Keystone", c_keystone_d: "Perspective tilt",
            c_rotate_t: "Rotate & Flip", c_rotate_d: "90° & mirror",
            c_grid_t: "Custom Grid", c_grid_d: "Scale & line rules",

            c_paste_t: "Paste", c_paste_d: "From clipboard",
            c_import_t: "Import File", c_import_d: "Open photo / SVG",
            c_collection_t: "My Collection", c_collection_d: "Saved library",
            c_save_t: "Save Drawing", c_save_d: "Bookmark canvas",
            c_layers_t: "Multi-Layers", c_layers_d: "Combine images",

            cards: {
                lock: {
                    title: "Touch Lock (Trace Mode)",
                    what: "Freezes the screen completely so you can lay real paper on the glass and draw without moving the picture.",
                    example: "Lock the screen, lay your drawing paper on top, and sketch freely. Long-press for 1 second to unlock."
                },
                stencil: {
                    title: "Stenciler / Outline Density",
                    what: "Automatically detects edges in regular photographs and turns them into clean line art with adjustable density.",
                    example: "Turn a realistic photo into a line-art coloring sheet and adjust the density slider to isolate outlines."
                },
                ruler: {
                    title: "1:1 Physical Screen Ruler",
                    what: "Displays true physical metric (mm/cm) and imperial (inches) calibrated rulers directly along the canvas edges.",
                    example: "Verify exact physical dimensions of your drawing before putting pencil to paper."
                },
                camera: {
                    title: "Live Camera Feed",
                    what: "Turns your phone or tablet camera on so you can see through your screen like a clear pane of glass.",
                    example: "Place a real leaf, toy, or printed sketch under your tablet to trace its shape onto paper."
                },
                brightness: {
                    title: "Luminance & Direct Input",
                    what: "Adjusts back-light brightness from 10% up to 200% using either the fluid slider or by typing an exact percentage number.",
                    example: "Dim down for night tracing or boost to 200% for thick watercolor paper."
                },
                tint: {
                    title: "Warm Light Tint",
                    what: "Shifts the background backlight to a soothing warm amber hue to reduce blue-light eye strain during extended tracing sessions.",
                    example: "Enable warm light when drawing in low-light environments or late evenings."
                },
                invert: {
                    title: "Invert Colors (Negative Mode)",
                    what: "Flips all light and dark pixels instantly, transforming dark backgrounds into bright white lines and vice versa.",
                    example: "Make dark photos easy to trace onto dark or light paper without wasting heavy ink."
                },
                contrast: {
                    title: "Contrast Boost",
                    what: "Deepens dark tones while brightening highlights to make faint sketch outlines pop vigorously.",
                    example: "Enhance faint pencil sketches or low-contrast photos so line borders are unmistakable."
                },
                keystone: {
                    title: "Keystone Perspective Correction",
                    what: "Adjusts horizontal and vertical tilt angles to correct perspective distortion from angled photos.",
                    example: "Snap a photo of artwork at an angle, then use Keystone sliders to square it back flat."
                },
                rotate: {
                    title: "Rotate 90° & Mirror Flip",
                    what: "Quickly turns your image 90 degrees clockwise or mirrors it horizontally/vertically with a single tap.",
                    example: "Check anatomy symmetry by flipping horizontally or adapt portrait references to landscape sheets."
                },
                grid: {
                    title: "Customizable Overlay Grid",
                    what: "Renders an adjustable drafting grid over your canvas where you can adjust box spacing, line thickness, and color.",
                    example: "Use a subtle 20px cyan grid for small lettering, or a bold 80px grid for scaling large portraits."
                },
                paste: {
                    title: "Paste from Clipboard",
                    what: "Grabs any picture you copied from a website or chat and loads it instantly without saving files to your phone.",
                    example: "Copy an image from Pinterest or Google, open eStudio, and tap Paste to start tracing immediately."
                },
                import: {
                    title: "Import from Storage (Images & SVGs)",
                    what: "Opens your device gallery so you can choose your personal photos, downloaded pictures, or scalable vector SVG art. Supports multiple images simultaneously!",
                    example: "Trace multiple reference layers or a crisp SVG vector line drawing without any pixelation."
                },
                collection: {
                    title: "My Collection (Offline Library)",
                    what: "Stores your favourite sketches and drawings right inside your device browser memory for quick access anytime, completely offline.",
                    example: "Reopen your saved templates, coloring sheets, or starter outlines with a single tap."
                },
                save: {
                    title: "Save to Collection (Bookmark)",
                    what: "Instantly bookmarks your current canvas configuration into your device offline library.",
                    example: "Save your work-in-progress layout so you can resume tracing tomorrow without re-importing."
                },
                layers: {
                    title: "Multi-Layer System",
                    what: "Manage multiple reference images on screen with independent floating layer chips, opacity, and positioning.",
                    example: "Combine a background landscape with a character outline on separate movable layers."
                }
            }
        },
        es: {
            guide_title: "Guía eStudio Lightbox",
            guide_eyebrow: "Guía de Estudio",
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
            btn_flip_h: "Voltear H",
            btn_flip_v: "Voltear V",
            btn_keystone: "Perspectiva",
            btn_stencil: "Plantilla",
            btn_ruler: "Regla 1:1",
            btn_tint: "Luz Cálida",
            btn_invert: "Invertir",
            btn_contrast: "Contraste",
            btn_camera: "Cámara",
            btn_fullscreen: "Pantalla completa",
            btn_save: "Guardar en Colección",
            btn_reset: "Reiniciar",
            btn_lock_text: "Bloquear",
            txt_unlock_hold: "Mantén 1s para desbloquear",
            btn_got_it: "Entendido",
            btn_close: "Cerrar",
            modal_what_title: "Cómo Funciona",
            modal_example_title: "Ejemplo / Cuándo Usarlo",
            collection_title: "Mi Colección",
            msg_saved_collection: "¡Guardado en Mi Colección!",
            msg_empty_collection: "Aún no tienes dibujos guardados. Pulsa el icono de guardar en la barra para guardar el dibujo actual.",

            sec_tracing: "Calco y Lienzo",
            sec_lighting: "Luz y Contraste",
            sec_geometry: "Geometría y Ajustes",
            sec_media: "Archivos y Colección",

            c_lock_t: "Bloqueo Táctil", c_lock_d: "Fijar para calcar",
            c_stencil_t: "Plantillas", c_stencil_d: "Convertir a líneas",
            c_ruler_t: "Regla 1:1", c_ruler_d: "Escala real en pantalla",
            c_camera_t: "Cámara en Vivo", c_camera_d: "Mundo real",

            c_brightness_t: "Luminancia", c_brightness_d: "Deslizador y número",
            c_tint_t: "Luz Cálida", c_tint_d: "Descanso visual",
            c_invert_t: "Invertir Colores", c_invert_d: "Modo negativo",
            c_contrast_t: "Contraste", c_contrast_d: "Realzar bordes",

            c_keystone_t: "Perspectiva", c_keystone_d: "Ajuste trapezoidal",
            c_rotate_t: "Rotar y Voltear", c_rotate_d: "90° y efecto espejo",
            c_grid_t: "Cuadrícula Pro", c_grid_d: "Ajustar escala",

            c_paste_t: "Pegar", c_paste_d: "Portapapeles",
            c_import_t: "Abrir Foto / SVG", c_import_d: "Desde galería",
            c_collection_t: "Mi Colección", c_collection_d: "Librería guardada",
            c_save_t: "Guardar Dibujo", c_save_d: "Marcador local",
            c_layers_t: "Multicapa", c_layers_d: "Combinar imágenes",

            cards: {
                lock: {
                    title: "Bloqueo Táctil (Modo Calcar)",
                    what: "Congela la pantalla para que puedas apoyar el papel y tu mano encima sin que la foto se mueva por accidente.",
                    example: "Bloquea la pantalla, coloca tu folio encima y calca con lápiz. Mantén pulsado 1 segundo para desbloquear."
                },
                stencil: {
                    title: "Creador de Plantillas (Líneas y Densidad)",
                    what: "Busca los bordes de una foto normal y la convierte en un dibujo de líneas con densidad ajustable.",
                    example: "Convierte una foto en un dibujo de líneas y ajusta el regulador de densidad para aislar los contornos."
                },
                ruler: {
                    title: "Regla Física Calibrada 1:1",
                    what: "Muestra reglas métricas (mm/cm) e imperiales (pulgadas) calibradas a escala real en los bordes de la pantalla.",
                    example: "Mide y comprueba el tamaño exacto de tu dibujo antes de empezar a trazar sobre el papel."
                },
                camera: {
                    title: "Cámara en Vivo",
                    what: "Enciende la cámara de tu dispositivo para ver a través de la pantalla como si fuera un cristal transparente.",
                    example: "Coloca una hoja natural, una figura o un dibujo debajo de la tablet para calcar su silueta sobre papel."
                },
                brightness: {
                    title: "Luminancia y Ajuste Numérico",
                    what: "Ajusta la intensidad del brillo desde el 10% hasta el 200% mediante el deslizador táctil o escribiendo el número exacto.",
                    example: "Atenúa el brillo en la oscuridad o auméntalo al 200% para traslucir papel de acuarela grueso."
                },
                tint: {
                    title: "Luz Cálida Antifatiga",
                    what: "Aplica un tono ámbar cálido a la pantalla para reducir la luz azul y proteger la vista en sesiones prolongadas.",
                    example: "Activa la luz cálida cuando dibujes por la noche o con poca iluminación ambiental."
                },
                invert: {
                    title: "Invertir Colores (Modo Negativo)",
                    what: "Invierte todos los tonos claros y oscuros al instante, transformando fondos oscuros en líneas blancas y viceversa.",
                    example: "Facilita el calco de fotografías oscuras sin gastar tinta ni forzar la vista."
                },
                contrast: {
                    title: "Realce de Contraste",
                    what: "Intensifica los tonos oscuros y resalta los blancos para que los trazos tenues se distingan con total claridad.",
                    example: "Mejora bocetos a lápiz suaves o imágenes con poco contraste para calcar líneas perfectas."
                },
                keystone: {
                    title: "Corrección de Perspectiva (Keystone)",
                    what: "Modifica la inclinación horizontal y vertical para enderezar fotos tomadas en ángulo.",
                    example: "Corrige una foto tomada ladeada de un cuadro y ponla perfectamente plana y recta."
                },
                rotate: {
                    title: "Rotar 90° y Volteo Espejo",
                    what: "Gira la imagen 90 grados o refléjala horizontal/verticalmente con un solo toque.",
                    example: "Comprueba la simetría de un retrato reflejándolo o adapta fotos verticales a folios apaisados."
                },
                grid: {
                    title: "Cuadrícula Personalizable",
                    what: "Genera una cuadrícula de dibujo ajustable donde puedes cambiar la separación de las cajas, el grosor de línea y el color.",
                    example: "Usa una cuadrícula fina de 20px para caligrafía o una de 80px para ampliar retratos a escala."
                },
                paste: {
                    title: "Pegar desde Portapapeles",
                    what: "Carga al instante cualquier foto que hayas copiado de internet o de un chat, sin necesidad de guardarla en tu móvil.",
                    example: "Copia un dibujo en Pinterest o Google, abre eStudio y pulsa Pegar para empezar a calcar al momento."
                },
                import: {
                    title: "Abrir desde la Galería (Fotos y SVGs)",
                    what: "Abre los archivos de tu móvil o tablet para que puedas elegir fotos normales o dibujos vectoriales SVG escalables. ¡Permite múltiples capas al mismo tiempo!",
                    example: "Calca un retrato familiar o un trazado vectorial SVG sin que pierda nitidez al hacer zoom."
                },
                collection: {
                    title: "Mi Colección (Librería Local)",
                    what: "Guarda tus dibujos y plantillas favoritos en la memoria de tu dispositivo para abrirlos siempre que quieras, totalmente sin conexión.",
                    example: "Guarda plantillas de anatomía, láminas de colorear para Elisa o tus diseños favoritos para abrirlos con un solo toque."
                },
                save: {
                    title: "Guardar en Colección (Marcador)",
                    what: "Guarda al instante la imagen actual y su configuración en la memoria local de tu dispositivo.",
                    example: "Guarda tu proyecto a medio terminar para continuar calcando mañana sin tener que volver a abrir el archivo."
                },
                layers: {
                    title: "Sistema Multicapa",
                    what: "Gestiona múltiples imágenes en pantalla con selectores flotantes, control de opacidad y posición independiente.",
                    example: "Combina un fondo de paisaje con una figura en capas separadas para componer una escena única."
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

        const guideTitle = document.getElementById('txt-guide-title');
        if (guideTitle) {
            guideTitle.innerHTML = `
                <span class="brand-title-wrap" style="font-size:20px;">
                    <span class="brand-studio"><span class="brand-e">e</span>Studio</span>
                    <span class="brand-lightbox">Lightbox</span>
                </span>
                <span class="version-tag">v0.22</span>
            `;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.i18n[lang] && this.i18n[lang][key]) el.innerText = this.i18n[lang][key];
        });
    }
};
