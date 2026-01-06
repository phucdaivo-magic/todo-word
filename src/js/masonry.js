document.addEventListener("DOMContentLoaded", () => {
	masonry();
});

const masonry = () => {
	const $masonry = document.querySelector(".masonry");
	const $masonryItems = document.querySelectorAll(".masonry-item");
	const masonryBoundingClientRect = $masonry.getBoundingClientRect();

	const { push, get } = useMasonry();

	Array.from($masonryItems)
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
		.forEach((item, index) => {
			item.then((item) => {
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
				item.style.setProperty("opacity", `1`);

				const itemRect = item.getBoundingClientRect();

				const width = itemRect.width;
				const height = itemRect.height;

				push({ top, left, width, height, item }, itemMasonry.index);
			}, index * 1);
		});
};

const useMasonry = () => {
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

		console.log(items);
	};

	const get = () => {
		if (items.length === 0) {
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			};
		} else if (items.length < 3) {
			return [...items].pop();
		} else {
			const topLast = items.reduce(
				(acc, cur, index) => {
					console.log(cur, acc);

					if (cur.top + cur.height <= acc.top + acc.height) {
						return { ...cur, index };
					}

					return acc;
				},
				{ ...items[0], index: 0 }
			);

			console.log(topLast);

			return {
				...topLast,
			};
		}
	};

	return { push, get };
};

new EventSource("/esbuild").addEventListener("change", () => location.reload());
