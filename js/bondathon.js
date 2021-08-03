class BondLoadingAnimation extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        
        const style = document.createElement("style");
        shadow.appendChild(style);
        
        this._container = shadow;
        this._previousTimestamp = 0;
        this._mover = null;
        this._boxWidth = 0;
        this._t = 0.0;
        this._lastFaderAt = 0;
        this._requiredElapsed = 1000 / 30;
        this._dotFrequencyMillis = 700;
        this._moverSpeedPixelsPerSec = 200;
    }
    
    updateStyle(elem) {
        this._dotFrequencyMillis = parseInt(elem.getAttribute("dotFrequencyMillis") || 700, 10);
        this._moverSpeedPixelsPerSec = parseInt(elem.getAttribute("moverSpeedPixelsPerSec") || 200, 10);
        const width = elem.getAttribute("boxWidth") || '100%';
        const moverHeightInPixels = parseInt(elem.getAttribute("moverHeightInPixels") || 50, 10);
        this._moverWidth = moverHeightInPixels;
        const circleWidth = `${moverHeightInPixels}px`;
        const circleColor = elem.getAttribute("color") || 'white';
        
        const shadow = elem.shadowRoot;
        shadow.querySelector("style").textContent = /*css*/`
        :host {
            width: ${width};
            height: ${circleWidth};
            background-color: transparent;
            overflow: hidden;
            position: relative;
        }
        
        .circle {
            width: ${circleWidth};
            height: ${circleWidth};
            border-radius: 50%;
            background-color: ${circleColor};
            position: absolute;
        }
        
        @keyframes bla-bond {
            2% {
                opacity: 1;
            }
            85% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
        
        .fader {
            opacity: 0.25;
            animation: bla-bond 0.75s linear forwards;
        }
        `;
        
        this.observeResize();
        this.resize();
    }
    
    resize(w) {
        this._boxWidth = w || this.getBoundingClientRect().width;
    }
    
    observeResize() {
        const ro = new ResizeObserver(entries => {
            const first = entries[0];
            if (first) {
                const cr = first.contentRect;
                this.resize(cr.width);
            }
        });
        ro.observe(this);
    }
    
    connectedCallback() {
        this.updateStyle(this);
        this.createMover();
        this.animate();
    }
    
    createMover() {
        const extant = this._mover;
        if (extant) {
            extant.remove();
        }
        
        const div = document.createElement("div");
        div.id = "mover";
        div.className = "circle";
        this._container.appendChild(div);
        this._mover = div;
    }
    
    animate() {
        window.requestAnimationFrame(this.step.bind(this));
    }
    
    step(timestamp) {
        this.animate();
        
        const mover = this._mover;
        const elapsed = timestamp - this._previousTimestamp;
        
        if (elapsed > this._requiredElapsed) {
            this._previousTimestamp = timestamp;
            const tw = this._moverWidth / this._boxWidth;
            
            const moverSpeed = this._moverSpeedPixelsPerSec / this._boxWidth;
            let t = this._t;
            t += moverSpeed * (elapsed / 1000.0);
            
            if (t > 1.0) {
                t = -tw;
            }
            
            const xPos = t * this._boxWidth;
            mover.style.transform = `translateX(${xPos}px)`;
            this._t = t;
            
            const timeSinceLastFader = timestamp - this._lastFaderAt;
            const twp = tw * 1.0;
            const shouldCreateFader = (t > twp) & (t < 1.0 - twp);
            
            if (timeSinceLastFader > this._dotFrequencyMillis && shouldCreateFader) {
                this._lastFaderAt = timestamp;
                this.createDotAt(t);
            }
        }
    }
    
    createDotAt(t) {
        const div = document.createElement("div");
        div.className = "circle fader";
        const xPos = t * this._boxWidth;
        div.style.transform = `translateX(${xPos}px)`;
        this._container.appendChild(div);
        setTimeout(function() { div.remove(); }, 1000);
    }
}

window.customElements.define("bond-loading-animation", BondLoadingAnimation);

// 
const btnTemplate = document.createElement('template');

btnTemplate.innerHTML = /*html*/`
<style>
.wrapper {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: scale(4);
    position: relative;
}

#svg-button {
    transform: rotate(90deg) scaleX(0.9);
}

#svg-button polygon {
    fill: #1FC81C;
}

#svg-button-border {
    transform: scaleX(1.25) scaleY(1.125) rotate(90deg);
    position: absolute;
    stroke: #6BE4F0;
}

.wrapper:active {
    top: 1px;
}

.wrapper:hover #svg-button polygon {
    fill: #6BE4F0;
}

.wrapper:active #svg-button polygon {
    fill: #1FC81C;
}

.wrapper:hover #svg-button-border {
    transform: scaleX(1.1) scaleY(0.99) rotate(90deg);
}

svg {
    vector-effect: non-scaling-stroke;
    shape-rendering: geometricPrecision;
    stroke-dashoffset: 24px;
    stroke-dasharray: 12px;
    animation: stroke 2s linear infinite;
}

@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}

.btn-title {
    font-family: vt323, courier;
    color: #1F2806;
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
    position: absolute;
    z-index: 1000;
    margin: 0;
    padding: 0;
    line-height: 1rem;
}
</style>

<a href="#" class="wrapper" id="the-button">
<svg id="svg-button-border" height="102" width="102" >
<polygon
    points="50 3,100 28,100 75, 50 100,3 75,3 25" 
 
    stroke-width="2"
    fill="none" />
</svg>

<p class="btn-title">
RANDOMIZE MOVIE
</p>

<svg id="svg-button" height="102" width="102">
<polygon
    points="50 3,100 28,100 75, 50 100,3 75,3 25" 
    stroke-width="0" 
/>
</svg>

</a>
`;

class BondRandomButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const templateContent = btnTemplate.content;
        shadow.appendChild(templateContent.cloneNode(true));
    }
}

window.customElements.define("bond-random-button", BondRandomButton);
