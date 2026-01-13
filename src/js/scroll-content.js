new EventSource("/esbuild").addEventListener("change", () => location.reload());

document.addEventListener("DOMContentLoaded", () => {
	const horizontalScrollings = document.querySelectorAll(
		"[data-component='HorizontalScrolling']"
	);
	horizontalScrollings.forEach((horizontalScrolling) => {
		new HorizontalScrolling(horizontalScrolling);
	});
});

const CONFIG = {
	INTERSECTING: {
		threshold: 0.5,
	},
	WIDTH_SCROLL_CONTENT_OFFSET: 56 / 2,
	CSS: {
		TRANSITION: "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
		SCROLL_LEFT_PROPERTY: "--scroll-content-after-left",
	},
};

class HorizontalScrolling {
	constructor(element) {
		this.$element = element;
		this.$imageWrapper = this.$element.querySelector(".image-wrapper");
		this.$scrollContent = this.$element.querySelector(".scroll-content");

		this.isDragging = false;
		this.scrollLeft = 0;
		this.maxScrollLeft = this.getMaxScrollLeft();
		this.runAnimation = this.runAnimation();

		this.runAnimation.init();

		this.shouldRegisterEvents(() => {
			this.initStyles();
			this.onIntersecting();
		});
	}

	getMaxScrollLeft() {
		return (
			this.$imageWrapper.offsetWidth -
			this.$scrollContent.clientWidth +
			CONFIG.WIDTH_SCROLL_CONTENT_OFFSET
		);
	}

	initStyles() {
		this.$scrollContent.style.setProperty("overflow", "hidden");
		this.$scrollContent.style.setProperty("cursor", "move");
	}

	runAnimation() {
		const init = () =>
			new Promise((resolve) => {
				const leftStart = this.$imageWrapper.getBoundingClientRect().width - 60;
				this.$imageWrapper.style.setProperty(
					"transform",
					`translateX(${-leftStart}px)`
				);
				this.$scrollContent.style.setProperty(
					CONFIG.CSS.SCROLL_LEFT_PROPERTY,
					`${-leftStart}px`
				);

				resolve();
			});

		const start = () =>
			new Promise((resolve) => {
				setTimeout(() => {
					this.$imageWrapper.style.setProperty(
						"transition",
						CONFIG.CSS.TRANSITION
					);
					this.$scrollContent.style.setProperty(
						"transition",
						CONFIG.CSS.TRANSITION
					);

					this.$imageWrapper.style.setProperty(
						"transform",
						`translateX(${0}px)`
					);
					this.$scrollContent.style.setProperty(
						CONFIG.CSS.SCROLL_LEFT_PROPERTY,
						0
					);
				}, 500);

				setTimeout(() => {
					this.$imageWrapper.style.removeProperty("transition");
					this.$scrollContent.style.removeProperty("transition");
					resolve();
				}, 500 + 1200);
			});

		return { init, start };
	}

	shouldRegisterEvents(callback) {
		if (this.maxScrollLeft > 0) {
			callback();
		}
	}

	registerEvents() {
		this.registerMouseEventListeners();
		this.registerTouchEventListeners();
	}

	onIntersecting() {
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.runAnimation.start().then(() => this.registerEvents());
					observer.unobserve(this.$element);
				}
			});
		}, CONFIG.INTERSECTING);
		observer.observe(this.$element);
	}

	registerMouseEventListeners() {
		const onMouseDown = (e) => {
			e.preventDefault();
			this.startX = e.clientX;
			this.isDragging = true;
		};

		const onMouseMove = (e) => {
			if (this.isDragging) {
				this.endX = e.clientX;
				this.distance = this.endX - this.startX;
				this.updateView();
			}
		};

		const onMouseup = (e) => {
			e.preventDefault();
			this.endX = e.clientX;
			this.scrollLeft = Math.max(
				Math.min(this.scrollLeft + this.distance, 0),
				-this.maxScrollLeft
			);
			this.distance = 0;
			this.updateView();
			this.isDragging = false;
		};
		this.$element.addEventListener("mousedown", onMouseDown);
		this.$element.addEventListener("mousemove", onMouseMove);
		this.$element.addEventListener("mouseup", onMouseup);
		this.$element.addEventListener("mouseleave", onMouseup);
	}


	registerTouchEventListeners() {
		const onTouchstart = (e) => {
			e.preventDefault();
			this.startX = e.touches[0].clientX;
			this.isDragging = true;
		};

		const onTouchmove = (e) => {
			if (this.isDragging) {
				this.endX = e.touches[0].clientX;
				this.distance = this.endX - this.startX;
				this.updateView();
			}
		};

		const onTouchend = (e) => {
			e.preventDefault();
			this.endX = e.changedTouches[0].clientX;
			this.deltaX = this.endX - this.startX;
			this.startX = null;
			this.scrollLeft = Math.max(
				Math.min(this.scrollLeft + this.distance, 0),
				-this.maxScrollLeft
			);
			this.distance = 0;
			this.updateView();
			this.isDragging = false;
		};

		this.$element.addEventListener("touchstart", onTouchstart);
		this.$element.addEventListener("touchmove", onTouchmove);
		this.$element.addEventListener("touchend", onTouchend);
	}

	updateView() {
		let scrollLeft = this.scrollLeft + this.distance;
		scrollLeft = Math.min(scrollLeft, 0);
		scrollLeft = Math.max(scrollLeft, -this.maxScrollLeft);
		this.$imageWrapper.style.setProperty(
			"transform",
			`translateX(${scrollLeft}px)`
		);
		this.$scrollContent.style.setProperty(
			"--scroll-content-after-left",
			`${scrollLeft}px`
		);
	}
}
