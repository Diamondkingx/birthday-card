const card = document.querySelector('.card');
function fadeInElements(parent, delayBetween = 300, extra = []) {
    [...parent.childNodes, ...extra].forEach((node, index) => {
        setTimeout(() => {
            node.classList?.remove?.('faded');
        }, index * delayBetween);
    })
}
card.addEventListener('click', function () {
    const el = this;

    el.classList.add('anticipate');

    setTimeout(() => {
        el.classList.remove('anticipate');
        el.classList.toggle('flip-larger');

        setTimeout(() => {
            el.classList.toggle('shake');
            fadeInElements(document.querySelector('#birthday-card'), 300);
            setTimeout(() => {
                document.querySelector('.card-glint').classList.remove('faded');
            }, 1500)
        }, 1000);
    }, 150);
});


function shakeScreen() {
    document.body.classList.add('screen-shake');
    setTimeout(() => {
        document.body.classList.remove('screen-shake');
    }, 1000);
}
addEventListener("mousedown", () => { });

document.querySelectorAll('.emoji').forEach(el => {
    const code = el.dataset.emoji;

    const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/lottie.json`
    })
});


class AnimatedEmoji {
    static CONFIG = {
        MIN_VY: 0.4,
        MAX_VY: 0.8,
        DRIFT_X: 1,
        ACCELERATION: 1.033,
        WAVE_FREQ: 0.05,
        MAX_HEIGHT_RATIO: 1.15,
        MIN_SCALE: 0.7
    };

    constructor(parent, src, removeAfter = 5000) {
        this.parent = parent;
        this.src = src;
        this.removeAfter = removeAfter;
        this.creationTime = Date.now();
        this.shouldRemove = false;
        this.animationDone = false

        this.el = document.createElement("img");
        this.el.src = src;
        this.el.className = "animated-emoji";

        this.parent.appendChild(this.el);

        this.animate = this.animate.bind(this);

        this.updateParentBox();
        this.reset();
        requestAnimationFrame(this.animate);
    }

    updateParentBox() {
        this.parentBox = this.parent.getBoundingClientRect();
    }

    setPos(x, y) {
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
    }

    reset() {
        if (this.shouldRemove) {
            this.destroy();
            return;
        }

        this.updateParentBox();

        this.x = Math.random() * this.parentBox.width;
        this.y = this.parentBox.height * (1 + Math.random() * 0.1);

        this.vy = -(AnimatedEmoji.CONFIG.MIN_VY +
            Math.random() * (AnimatedEmoji.CONFIG.MAX_VY - AnimatedEmoji.CONFIG.MIN_VY));
        this.vx = (Math.random() - 0.5) * AnimatedEmoji.CONFIG.DRIFT_X;

        this.life = 0;
        this.maxLife = this.parentBox.height * AnimatedEmoji.CONFIG.MAX_HEIGHT_RATIO;

        this.el.style.opacity = 0;
        this.el.style.scale = 0;
    }

    updateMotion() {
        this.life += Math.abs(this.vy);
        this.y += this.vy;

        this.x +=
            Math.sin(this.life * AnimatedEmoji.CONFIG.WAVE_FREQ) +
            this.vx;

        this.vy *= AnimatedEmoji.CONFIG.ACCELERATION;
    }

    updateAppearance() {
        const ratio = Math.min(
            1,
            Math.max(0, (this.parentBox.height - this.y) / this.parentBox.height)
        );

        this.el.style.opacity = 1 - ratio;
        this.el.style.scale = Math.max(
            AnimatedEmoji.CONFIG.MIN_SCALE,
            ratio * 2
        );

        this.setPos(this.x, this.y);
    }

    checkLifecycle() {

        if (Date.now() - this.creationTime > this.removeAfter) {
            this.shouldRemove = true;
        }

        if (this.life > this.maxLife) {
            this.reset();
        }

    }

    destroy() {
        this.el.remove();
    }

    animate() {
        this.updateParentBox();
        this.updateMotion();
        this.updateAppearance();

        this.checkLifecycle();
        requestAnimationFrame(this.animate);
    }
}

function doEmojiSmoke() {
    const container = document.querySelector(".card");
    const emojis = ["/heart eyes.gif", "/laughing.gif", "/heart.gif", "/rose.gif", "/joy.gif"];
    let i = 0
    setInterval(() => {
        if (i < 20) {
            new AnimatedEmoji(container, emojis[Math.floor(Math.random() * emojis.length)]);
            i++
        }
    }, 500);
}

function changeFrontFaceToMsg() {
    const frontFace = document.querySelector('.face.front');
    frontFace.innerHTML = `
    <div id="birthday-message">
      <header class="dialog-header">
                        <div class="dialog-icon">
                            <i class="fa-solid fa-face-smile"></i>
                        </div>
                        <div class="dialog-title">
                            <h2 class="heading">Congratulations!</h2>
                            <p class="sub-heading">Have a wonderful birthday!</p>
                        </div>
      </header>
    <p class="message part-1">I hope today brings lots of laughter, warmth, and a few fun surprises that make you smile.</p>
    <p class="message part-2">May the year ahead be full of good health, little wins, big dreams, and moments that remind you how loved you are. Today is all about you — enjoy every moment.</p>
    <span class="signature">
    Designed and Coded by <i>Jalaj Patel</i>
    </span>
    </div>`;
}

function fadeInWords(el, stagger = 80) {
    const words = el.textContent.split(" ");
    el.textContent = "";

    words.forEach((word, i) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.className = "word";

        el.appendChild(span);

        setTimeout(() => {
            span.style.opacity = 1;
        }, i * stagger);
    });
}

function flipCard360() {
    const card = document.querySelector('.card');
    card.classList.add('flip-medium-complete');
}

document.querySelector("#celebrate").addEventListener("click", function () {
    flipCard360();
    changeFrontFaceToMsg();
    requestAnimationFrame(() => {
        fadeInElements(document.querySelector('#birthday-message'), 300);
        // fadeInWords(document.querySelector('#birthday-message p'), 200);
    });
    // doEmojiSmoke();
}); 