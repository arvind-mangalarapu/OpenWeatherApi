import { writable } from 'svelte/store';

interface ImageData {
	src: string;
	width: number;
	height: number;
	top: number;
	left: number;
	duration: number;
}

const createImageStore = () => {
	const { subscribe, set } = writable<ImageData[]>([]);

	return {
		subscribe,
		generateImages: (icons: string[]) => {
			const images: ImageData[] = [];
			for (let i = 0; i < 20; i++) {
				images.push({
					src: icons[i % icons.length],
					width: Math.random() * 50 + 20,
					height: Math.random() * 50 + 20,
					top: Math.random() * 100,
					left: Math.random() * 100,
					duration: Math.random() * 10 + 5
				});
			}
			set(images);
		}
	};
};

export const imageStore = createImageStore();
