function element(selector) {
    return document.querySelector(selector)
}

function elements(selector) {
    return document.querySelectorAll(selector)
}

function createElement(type, attributes = {}, properties = {}, creationOptions = {}) {
    const element = document.createElement(type, creationOptions)

    for (let attribute in attributes)
        element.setAttribute(attribute, attributes[attribute])

    for (let [property, value] of Object.entries(properties))
        element[property] = value

    element.appendTo = function (parent) {
        let parentElement

        if (typeof parent == "string")
            parentElement = element(parent)
        else if (parent instanceof HTMLElement)
            parentElement = parent
        else throw new TypeError("Unknown parent type.")

        if (!parentElement) throw new ReferenceError("Undefined Parent.")

        parentElement.append(this)
        return this
    }

    return element
}

const card = element('.card');
const birthdayCard = element('#birthday-card');
const cardGlint = element('.card-glint');
const cardFront = element('.face.front');
const cardBack = element('.face.back');
const emojiGrid = element('.emoji-grid');

function fadeInElements(parent, delayBetween = 300, extra = []) {
    [...parent.childNodes, ...extra].forEach((node, index) => {
        setTimeout(() => node.classList?.remove?.('faded'), index * delayBetween);
    })
}

function shakeScreen() {
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 1000);
}

const emojis = ["heart eyes.gif", "laughing.gif", "heart.gif", "rose.gif", "joy.gif"];
function emojiSmoke(parent, count = 20) {
    let i = 0
    const interval = setInterval(() => {
        if (i < count) {
            new AnimatedEmoji(parent, emojis[Math.floor(Math.random() * emojis.length)]);
            i++
        }
        else clearInterval(interval);
    }, 200);
}

function fadeInWords(element, stagger = 80, delay = 2000) {
    const words = element.textContent.split(" ");
    element.textContent = "";

    words.forEach((word, i) => {
        const span = createElement("span", {}, { className: "word", textContent: word + " " });
        element.appendChild(span);
        setTimeout(() => span.style.opacity = 1, delay + i * stagger);
    });
}


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

        this.el = createElement("img", {}, { src, className: "animated-emoji" });

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


card.querySelector("#continue").addEventListener('click', function () {
    setTimeout(() => {
        card.classList.add('anticipate');
        setTimeout(() => {
            card.classList.remove('anticipate');
            card.classList.add('flip-larger');
            setTimeout(() => {
                fadeInElements(birthdayCard, 300);
                setTimeout(() => {
                    cardGlint.classList.remove('faded');
                }, 1500)
            }, 1000);
        }, 150);
    }, 200);
});


// init lottie emojis
elements('.emoji').forEach(el => {
    const code = el.dataset.emoji;

    lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/lottie.json`
    })
});


function changeFrontFaceToMsg() {
    const frontFace = element('.face.front');
    frontFace.innerHTML = `
    <div id="birthday-message">
      <header class="dialog-header faded" style="transition: opacity .5s ease-in-out">
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
    <span class="signature faded">
    Designed and Coded by <i>Jalaj Patel</i>
    </span>
    </div>`;
}


function flipCard360() {
    card.classList.add('flip-medium-complete');
}

var doneOnce = false
document.querySelector("#celebrate").addEventListener("click", function () {
    if (doneOnce) return
    card.classList.add("shake")
    canvas.classList.add("shown");
    navigator.vibrate(200)
    setTimeout(() => {
        burst(innerWidth / 2, innerHeight / 2)
        shakeScreen()
        emojiSmoke(document.querySelector(".card"), 22);
    }, 200)

    setTimeout(() => {
        flipCard360();
        changeFrontFaceToMsg();
        requestAnimationFrame(() => {
            fadeInElements(document.querySelector('#birthday-message'), 1000);
            fadeInWords(document.querySelector('.message.part-1'), 200);
            fadeInWords(document.querySelector('.message.part-2'), 200, 7000);
            setTimeout(() => {
                element('.signature').classList.add('visible');
            }, 15000);
        });
    }, 5000);
    doneOnce = true
    // doEmojiSmoke();
}); 


