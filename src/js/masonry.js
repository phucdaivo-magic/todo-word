document.addEventListener("DOMContentLoaded", () => {
	masonry();
	window.addEventListener('resize', masonry, {
		passive: false
	})
});

const masonry = () => {
	const $masonry = document.querySelector(".masonry");
	const $masonryItems = document.querySelectorAll(".masonry-item");

	$masonryItems.forEach(item => item.style = '')

	const col = Math.round($masonry.offsetWidth / $masonryItems[0].offsetWidth);

	const { push, get } = useMasonry(col);

	const onIntersecting = () => {
		const options = {
			root: null,
			threshold: 0.1,
		};

		const callback = (entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {


					entry.target.style.setProperty('opacity', 1)
				} else {
					entry.target.style.setProperty('opacity', 0)
					console.log(entry);
				}
			});
		};
		const observer = new IntersectionObserver(callback, options);
		Array.from($masonryItems).forEach((item) => {
			observer.observe(item);
		});
	}


	Promise.all(Array.from($masonryItems)
		.map((item) => {
			return new Promise((resolve) => {
				const img = item.querySelector("img");
				if (img.complete) {
					resolve(item);
				} else {
					img.onload = () => resolve(item);
				}
			});
		})
		.map(async (item, index) => {
			return item.then((item) => {
				const itemMasonry = get();
				const left =
					itemMasonry.index || itemMasonry.index === 0
						? itemMasonry.left
						: itemMasonry.left + itemMasonry.width;

				const top =
					itemMasonry.index || itemMasonry.index === 0
						? itemMasonry.top + itemMasonry.height
						: itemMasonry.top;

				item.style.setProperty("position", "absolute");
				item.style.setProperty("top", `${top}px`);
				item.style.setProperty("left", `${left}px`);
				item.style.setProperty("z-index", `${index + 1}`);
				item.style.setProperty("opacity", 1);

				const itemRect = item.getBoundingClientRect();

				const width = itemRect.width;
				const height = itemRect.height;

				push({ top, left, width, height, item }, itemMasonry.index);
				return item;
			});
		})).then(() => {
			onIntersecting();
		})
};

const useMasonry = (col) => {
	let items = [];
	const push = (item, index) => {
		if (index || index === 0) {
			items = items.map((_item, _index) => {
				if (_index === index) {
					return item;
				}
				return _item;
			});
		} else {
			items.push(item);
		}

	};

	const get = () => {
		if (items.length === 0) {
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			};
		} else if (items.length < col) {
			return [...items].pop();
		} else {
			const topLast = items.reduce(
				(acc, cur, index) => {

					if (cur.top + cur.height <= acc.top + acc.height) {
						return { ...cur, index };
					}

					return acc;
				},
				{ ...items[0], index: 0 }
			);


			return {
				...topLast,
			};
		}
	};

	return { push, get };
};

new EventSource("/esbuild").addEventListener("change", () => location.reload());
