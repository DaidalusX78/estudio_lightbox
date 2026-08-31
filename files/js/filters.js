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
        const canvas = document.getElementById('ruler-canvas');
        const overlay = document.getElementById('ruler-overlay');
        if (!canvas || !overlay) return;

        if (!this.isRuler) {
            overlay.style.display = 'none';
            return;
        }
        overlay.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#38bdf8";
        ctx.strokeStyle = "#38bdf8";
        ctx.font = "10px sans-serif";

        const mmStep = 96 / 25.4;
        let pos = 0;
        let count = 0;
        while (pos < canvas.width) {
            const isCm = count % 10 === 0;
            const h = isCm ? 18 : (count % 5 === 0 ? 12 : 6);
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, h);
            ctx.stroke();
            if (isCm && count > 0) ctx.fillText(`${count / 10}`, pos + 2, 24);
            pos += mmStep;
            count++;
        }
    }
};
