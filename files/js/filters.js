// ==========================================
// MODULE 5: FILTERS & GRID ENGINE
// ==========================================
const FilterEngine = {
    tintVal: 0,
    gridSpacing: 40,
    gridLineWidth: 1.0,
    gridColor: '#38bdf8',
    isGrid: false,
    isRuler: false,

    init() {
        window.addEventListener('resize', () => {
            if (this.isGrid) this.renderGrid();
            if (this.isRuler) this.renderRuler();
        });
    },

    update() {
        const active = LayerManager.getActive();
        if (active) LayerManager.renderLayer(active);

        const dimOverlay = document.getElementById('dim-overlay');
        const tintOverlay = document.getElementById('tint-overlay');

        if (active && active.brightness < 100) {
            if (dimOverlay) dimOverlay.style.opacity = (1 - (active.brightness / 100)) * 0.85;
        } else {
            if (dimOverlay) dimOverlay.style.opacity = 0;
        }

        if (tintOverlay) tintOverlay.style.opacity = this.tintVal / 100;
    },

    setGridColor(color, dotElem) {
        this.gridColor = color;
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        if (dotElem) dotElem.classList.add('active');
        if (this.isGrid) this.renderGrid();
    },

    renderGrid() {
        const canvas = document.getElementById('grid-canvas');
        if (!canvas) return;
        if (!this.isGrid) {
            canvas.style.display = 'none';
            return;
        }
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = this.gridLineWidth;
        ctx.globalAlpha = 0.35;

        ctx.beginPath();
        const step = this.gridSpacing;
        for (let x = 0; x <= canvas.width; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
    },

    renderRuler() {
        const overlay = document.getElementById('ruler-overlay');
        const xCanvas = document.getElementById('ruler-x-canvas');
        const yCanvas = document.getElementById('ruler-y-canvas');
        if (!overlay || !xCanvas || !yCanvas) return;

        if (!this.isRuler) {
            overlay.style.display = 'none';
            return;
        }
        overlay.style.display = 'block';

        const mmStep = 96 / 25.4; // 96 DPI CSS standard to mm

        // 1. Render Top X-Axis Ruler
        xCanvas.width = Math.max(10, window.innerWidth - 28);
        xCanvas.height = 28;
        const xCtx = xCanvas.getContext('2d');
        xCtx.clearRect(0, 0, xCanvas.width, xCanvas.height);
        xCtx.fillStyle = "#38bdf8";
        xCtx.strokeStyle = "#38bdf8";
        xCtx.font = "9px sans-serif";

        let xPos = 0;
        let xCount = 0;
        while (xPos < xCanvas.width) {
            const isCm = xCount % 10 === 0;
            const h = isCm ? 15 : (xCount % 5 === 0 ? 9 : 5);
            xCtx.beginPath();
            xCtx.moveTo(xPos, 0);
            xCtx.lineTo(xPos, h);
            xCtx.stroke();
            if (isCm && xCount > 0) xCtx.fillText(`${xCount / 10}`, xPos + 2, 23);
            xPos += mmStep;
            xCount++;
        }

        // 2. Render Left Y-Axis Ruler
        yCanvas.width = 28;
        yCanvas.height = Math.max(10, window.innerHeight - 28);
        const yCtx = yCanvas.getContext('2d');
        yCtx.clearRect(0, 0, yCanvas.width, yCanvas.height);
        yCtx.fillStyle = "#38bdf8";
        yCtx.strokeStyle = "#38bdf8";
        yCtx.font = "9px sans-serif";

        let yPos = 0;
        let yCount = 0;
        while (yPos < yCanvas.height) {
            const isCm = yCount % 10 === 0;
            const w = isCm ? 15 : (yCount % 5 === 0 ? 9 : 5);
            yCtx.beginPath();
            yCtx.moveTo(0, yPos);
            yCtx.lineTo(w, yPos);
            yCtx.stroke();
            if (isCm && yCount > 0) yCtx.fillText(`${yCount / 10}`, 5, yPos + 10);
            yPos += mmStep;
            yCount++;
        }
    }
};
