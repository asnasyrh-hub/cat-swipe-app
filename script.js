const App = {
    cats: [], currentIndex: 0, likedCats: [], dislikedCats: [],
    startX: 0, currentX: 0, isDragging: false, rafId: null,

    init() {
        // generate 10 random cats
        for (let i = 1; i <= 10; i++) this.cats.push(`https://cataas.com/cat?random=${i}`);
        this.cacheDOM(); this.bindEvents();
    },

    cacheDOM() {
        this.startScreen = document.getElementById("start-screen");
        this.startBtn = document.getElementById("start-btn");
        this.app = document.getElementById("app");
        this.card = document.getElementById("card");
        this.image = document.getElementById("cat-image");
        this.overlay = document.getElementById("overlay");
        this.progress = document.getElementById("progress");
        this.reviewScreen = document.getElementById("review-screen");
        this.likedContainer = document.getElementById("liked-cats");
        this.dislikedContainer = document.getElementById("disliked-cats");
        this.restartBtn = document.getElementById("restart-btn");
    },

    bindEvents() {
        this.startBtn.addEventListener("click", () => this.startApp());
        this.restartBtn.addEventListener("click", () => this.restartApp());
        this.card.addEventListener("pointerdown", (e) => this.dragStart(e));
        this.card.addEventListener("pointermove", (e) => this.dragMove(e));
        this.card.addEventListener("pointerup", () => this.dragEnd());
        this.card.addEventListener("pointercancel", () => this.dragEnd());
    },

    startApp() {
        this.startScreen.classList.add("hidden");
        this.app.classList.remove("hidden");
        this.showCat();
    },

    showCat() {
        if (this.currentIndex < this.cats.length) {
            this.image.src = this.cats[this.currentIndex];
            this.progress.innerText = `Kitty ${this.currentIndex + 1} of ${this.cats.length}`;
            this.overlay.style.display = "none";
            this.card.style.transform = ""; this.card.style.opacity = 1;
        } else this.showReview();
    },

    dragStart(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.card.style.transition = "none";
    },

    dragMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX - this.startX;
        const max = window.innerWidth * 0.7;
        if (this.currentX > max) this.currentX = max;
        if (this.currentX < -max) this.currentX = -max;
        this.showOverlay();
    },

    showOverlay() {
        this.rafId = requestAnimationFrame(() => {
            this.card.style.transform = `translateX(${this.currentX}px) rotate(${this.currentX * 0.04}deg)`;

            if (this.currentX > 50) {
                this.overlay.innerText = "Yaaas! 😻";
                this.overlay.className = "overlay like";
                this.overlay.style.display = "block";
                this.card.style.borderColor = "#00c853";
            }
            else if (this.currentX < -50) {
                this.overlay.innerText = "Nahh! 🙀";
                this.overlay.className = "overlay dislike";
                this.overlay.style.display = "block";
                this.card.style.borderColor = "#ff1744";
            }
            else {
                this.overlay.style.display = "none";
                this.card.style.borderColor = "transparent";
            }
        });
    },

    dragEnd() {
        cancelAnimationFrame(this.rafId);
        this.isDragging = false;
        this.card.style.transition = "transform 0.5s ease, opacity 0.5s ease, border 0.3s ease";

        const threshold = 120;
        if (this.currentX > threshold) {
            this.animateCard('right');
            this.likedCats.push(this.cats[this.currentIndex]);
        }
        else if (this.currentX < -threshold) {
            this.animateCard('left');
            this.dislikedCats.push(this.cats[this.currentIndex]);
        }
        else {
            this.card.style.transform = "";
            this.overlay.style.display = "none";
            this.card.style.borderColor = "transparent";
        }
        this.currentX = 0;
    },

    animateCard(dir) {
        const offX = dir === 'right' ? window.innerWidth * 0.8 : -window.innerWidth * 0.8;
        this.card.style.transform = `translateX(${offX}px) rotate(${dir === 'right' ? 25 : -25}deg)`;
        this.card.style.opacity = 0;
        this.overlay.style.opacity = 0;

        setTimeout(() => {
            this.currentIndex++;
            this.card.style.transition = "none";
            this.card.style.transform = "";
            this.card.style.opacity = 1;
            this.overlay.style.display = "none";
            this.showCat();
        }, 300);
    },

    showReview() {
        this.app.classList.add("hidden");
        this.reviewScreen.classList.remove("hidden");
        this.likedContainer.innerHTML = "";
        this.likedCats.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            this.likedContainer.appendChild(img);
        });
        this.dislikedContainer.innerHTML = "";
        this.dislikedCats.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            this.dislikedContainer.appendChild(img);
        });
    },

    restartApp() {
        this.currentIndex = 0; this.likedCats = []; this.dislikedCats = [];
        this.reviewScreen.classList.add("hidden");
        this.startScreen.classList.remove("hidden");
    }
};

App.init();