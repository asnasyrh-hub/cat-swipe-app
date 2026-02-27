const App = {
    cats: [],
    currentIndex: 0,
    likedCats: [],
    dislikedCats: [],
    startX: 0,
    isDragging: false,

    init() {
        this.generateCats();
        this.cacheDOM();
        this.bindEvents();
    },

    generateCats() {
        for (let i = 1; i <= 10; i++) {
            this.cats.push(`https://cataas.com/cat?random=${i}`);
        }
    },

    cacheDOM() {
        this.startScreen = document.getElementById("start-screen");
        this.startBtn = document.getElementById("start-btn");
        this.app = document.getElementById("app");
        this.cardTop = document.getElementById("card-top");
        this.imgTop = document.getElementById("img-top");
        this.overlayTop = document.getElementById("overlay-top");
        this.progress = document.getElementById("progress");
        this.reviewScreen = document.getElementById("review-screen");
        this.restartBtn = document.getElementById("restart-btn");
        this.likedContainer = document.getElementById("liked-cats");
        this.dislikedContainer = document.getElementById("disliked-cats");
    },

    bindEvents() {
        this.startBtn.addEventListener("click", () => this.startApp());
        this.restartBtn.addEventListener("click", () => this.restartApp());

        this.cardTop.addEventListener("pointerdown", (e) => this.onPointerDown(e));
        this.cardTop.addEventListener("pointermove", (e) => this.onPointerMove(e));
        this.cardTop.addEventListener("pointerup", (e) => this.onPointerUp(e));
        this.cardTop.addEventListener("pointerleave", (e) => this.onPointerUp(e));
    },

    startApp() {
        this.startScreen.classList.add("hidden");
        this.app.classList.remove("hidden");
        this.showNextCat();
    },

    showNextCat() {
        if (this.currentIndex >= this.cats.length) {
            this.showReview();
            return;
        }

        this.imgTop.src = this.cats[this.currentIndex];
        this.cardTop.style.opacity = "1";
        this.cardTop.style.transform = "translateX(0) rotate(0)";
        this.cardTop.style.borderColor = "transparent";
        this.overlayTop.style.display = "none";

        this.progress.innerText = `Cat ${this.currentIndex + 1} of ${this.cats.length}`;
    },

    onPointerDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.cardTop.style.transition = "none";
    },

    onPointerMove(e) {
        if (!this.isDragging) return;
        const moveX = e.clientX - this.startX;
        this.cardTop.style.transform = `translateX(${moveX}px) rotate(${moveX / 15}deg)`;

        if (moveX > 0) this.cardTop.style.borderColor = "limegreen";
        else if (moveX < 0) this.cardTop.style.borderColor = "red";
        else this.cardTop.style.borderColor = "transparent";
    },

    onPointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        const diff = e.clientX - this.startX;
        const trigger = 80;

        this.cardTop.style.transition = "transform 0.8s ease, opacity 0.8s ease, border 0.3s ease";

        if (diff > trigger) {
            this.swipe("right");
            this.likedCats.push(this.cats[this.currentIndex]);
        } else if (diff < -trigger) {
            this.swipe("left");
            this.dislikedCats.push(this.cats[this.currentIndex]);
        } else {
            this.cardTop.style.transform = "translateX(0) rotate(0)";
            this.cardTop.style.borderColor = "transparent";
        }
    },

    swipe(direction) {
        const offScreen = direction === "right" ? window.innerWidth : -window.innerWidth;

        this.overlayTop.style.display = "block";
        this.overlayTop.innerText = direction === "right" ? "Yass 😻" : "Nahh 😿";
        this.overlayTop.className = direction === "right" ? "overlay like" : "overlay dislike";

        this.cardTop.style.transition = "transform 1.2s ease, opacity 1.2s ease, border 0.3s ease"; 
        this.cardTop.style.transform = `translateX(${offScreen}px) rotate(${direction === "right" ? 30 : -30}deg)`;
        this.cardTop.style.opacity = "0";

        setTimeout(() => {
            this.currentIndex++;
            this.showNextCat();
        }, 1200); // match new slower duration
    },

    showReview() {
        this.app.classList.add("hidden");
        this.reviewScreen.classList.remove("hidden");

        this.likedContainer.innerHTML = "";
        this.dislikedContainer.innerHTML = "";

        this.likedCats.forEach((url) => {
            const img = document.createElement("img");
            img.src = url;
            this.likedContainer.appendChild(img);
        });

        this.dislikedCats.forEach((url) => {
            const img = document.createElement("img");
            img.src = url;
            this.dislikedContainer.appendChild(img);
        });
    },

    restartApp() {
        this.currentIndex = 0;
        this.likedCats = [];
        this.dislikedCats = [];

        this.reviewScreen.classList.add("hidden");
        this.startScreen.classList.remove("hidden");
    }
};

App.init();