(() => {
    "use strict";
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    const sliderInit = (perPage, slider, items, sliderLine, nextButton, prevButton, currentSlide, allSlides, maxWidth, autoPlay, bullets) => {
        let width;
        let current = perPage;
        width = slider.offsetWidth;
        let timerId = 0;
        if (autoPlay) window.addEventListener("resize", (() => {
            init();
        }));
        function init() {
            sliderLine.style.width = width / perPage * items.length + "px";
            items.forEach((item => {
                if (item.length > 1) item.forEach((i => {
                    i.style.width = width + "px";
                    i.style.height = "auto";
                })); else {
                    item.style.width = width + "px";
                    item.style.height = "auto";
                }
            }));
            currentSlide ? currentSlide.innerText = perPage : "";
            allSlides ? allSlides.innerText = items.length : "";
            if (bullets) {
                bullets.innerHTML = "";
                items.map((item => {
                    bullets.innerHTML = bullets.innerHTML + '<div class="bullet"></div>';
                }));
                bullets.childNodes[current - 1].classList.add("bullet-active");
            }
            if (autoPlay) {
                clearInterval(timerId);
                autoplay();
                rollSlider();
            } else rollSlider();
        }
        if (maxWidth) {
            if (width <= maxWidth) init();
        } else init();
        nextButton.addEventListener("click", (function() {
            nextSlide();
        }));
        function nextSlide() {
            current += perPage;
            currentSlide ? currentSlide.innerText = current : "";
            if (current > items.length) {
                current = perPage;
                currentSlide ? currentSlide.innerText = current : "";
            }
            if (bullets) {
                bullets.childNodes.forEach((bullet => {
                    bullet.classList.remove("bullet-active");
                }));
                bullets.childNodes[current - 1].classList.add("bullet-active");
            }
            rollSlider();
        }
        prevButton.addEventListener("click", (function() {
            clearInterval(timerId);
            if (current / perPage * items.length < items.length + 1) {
                current = items.length;
                currentSlide ? currentSlide.innerText = current : "";
            } else {
                current -= perPage;
                currentSlide ? currentSlide.innerText = current : "";
            }
            if (bullets) {
                bullets.childNodes.forEach((bullet => {
                    bullet.classList.remove("bullet-active");
                }));
                bullets.childNodes[current - 1].classList.add("bullet-active");
            }
            rollSlider();
        }));
        function rollSlider() {
            sliderLine.style.transform = "translate(-" + (current - perPage) / perPage * width + "px)";
        }
        function autoplay() {
            timerId = setInterval((() => {
                nextSlide();
            }), 4e3);
        }
    };
    const sliderRemove = (sliderLine, items) => {
        sliderLine.removeAttribute("style");
        items.forEach((item => {
            if (item.length > 1) item.forEach((i => {
                i.removeAttribute("style");
            })); else item.removeAttribute("style");
        }));
    };
    const stagesSliderInit = () => {
        const slider = document.querySelector(".stages__slider");
        const items = document.querySelectorAll(".stages__item");
        const groupItems = [ [ items[0], items[1] ], items[2], [ items[3], items[4] ], items[5], items[6] ];
        const sliderLine = document.querySelector(".stages__items");
        const nextButton = document.querySelector(".stages__slider-next");
        const prevButton = document.querySelector(".stages__slider-prev");
        const bullets = document.querySelector(".stages__slider-bullets");
        const maxWidth = 767.98;
        sliderInit(1, slider, groupItems, sliderLine, nextButton, prevButton, null, null, maxWidth, false, bullets);
    };
    const stagesSlider = document.querySelector(".stages__slider");
    const sliderLine = document.querySelector(".stages__items");
    const items = document.querySelectorAll(".stages__item");
    const stagesSliderWidth = stagesSlider.offsetWidth;
    if (stagesSliderWidth < 767.98) stagesSliderInit(); else sliderRemove(sliderLine, items);
    window.addEventListener("resize", (() => {
        const stagesSlider = document.querySelector(".stages__slider");
        const width = stagesSlider.offsetWidth;
        if (width < 767.98) stagesSliderInit(); else sliderRemove(sliderLine, items);
    }));
    const participantsSliderInit = perPage => {
        const slider = document.querySelector(".participants__slider");
        const items = document.querySelectorAll(".participants__item");
        const sliderLine = document.querySelector(".participants__items");
        const currentSlide = document.querySelector(".participants__slider-current");
        const allSlides = document.querySelector(".participants__slider-all");
        const nextButton = document.querySelector(".participants__slider-next");
        const prevButton = document.querySelector(".participants__slider-prev");
        sliderInit(perPage, slider, items, sliderLine, nextButton, prevButton, currentSlide, allSlides, null, true, null);
    };
    const slider = document.querySelector(".participants__slider");
    const width = slider.offsetWidth;
    if (width < 800 && width >= 600) participantsSliderInit(2); else if (width < 600) participantsSliderInit(1); else participantsSliderInit(3);
    window.addEventListener("resize", (() => {
        const slider = document.querySelector(".participants__slider");
        const width = slider.offsetWidth;
        if (width < 800 && width >= 600) participantsSliderInit(2); else if (width < 600) participantsSliderInit(1); else participantsSliderInit(3);
    }));
})();