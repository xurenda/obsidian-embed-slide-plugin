import { MarkdownPostProcessorContext, Plugin } from "obsidian";

export default class MyPlugin extends Plugin {
	async onload() {
		this.app.workspace.onLayoutReady(() => {
			this.registerMarkdownPostProcessor(markdownPostProcessor);
		});
	}

	onunload() {}
}

const markdownPostProcessor = (
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext
) => {
	// @ts-ignore
	for (const p of el.querySelectorAll("p")) {
		if (
			p.textContent?.startsWith("<<<") &&
			p.textContent?.endsWith(">>>")
		) {
			window.setTimeout(() => {
				const imgs = p?.querySelectorAll("img, svg");
				if (imgs && imgs.length > 0) {
					p.parentElement.replaceChild(buildHtml(imgs), p);
				}
			}, 200);
		}
	}
};

const buildHtml = (imgs: NodeListOf<HTMLElement>) => {
	const wrapper = document.createElement("div");
	wrapper.className = "embed-slide-wrapper";
	wrapper.dataset.total = imgs.length + "";
	wrapper.dataset.cur = "0";
	const content = document.createElement("div");
	content.className = "embed-slide-content";
	// @ts-ignore
	for (const img of imgs) {
		img.classList.add("embed-slide-img");
		content.appendChild(img);
	}
	const controller = document.createElement("div");
	controller.className = "embed-slide-controller";
	controller.innerHTML = `<svg
	class="embed-slide-controller-prev"
	height="24"
	viewBox="0 0 24 24"
	width="24"
	xmlns="http://www.w3.org/2000/svg"
	onclick="var wrapper = event.target?.closest('.embed-slide-wrapper');if(wrapper){var total = Number(wrapper.dataset.total);var cur = Number(wrapper.dataset.cur);var imgs = wrapper.querySelectorAll('.embed-slide-img');imgs[cur].dataset.hidden = 'true';cur = (cur - 1 + total) % total;wrapper.dataset.cur = cur;imgs[cur].dataset.hidden = 'false';wrapper.querySelector('.embed-slide-controller-num').innerText = cur + 1 + ' / ' + total;}"
>
	<path
		d="m18 18-8.5-6 8.5-6zm-10-12v12h-2v-12z"
		fill="currentColor"
	></path>
</svg>
<span class="embed-slide-controller-num">1 / ${imgs.length}</span>
<svg
	class="embed-slide-controller-next"
	height="24"
	viewBox="0 0 24 24"
	width="24"
	xmlns="http://www.w3.org/2000/svg"
	onclick="var wrapper = event.target?.closest('.embed-slide-wrapper');if(wrapper){var total = Number(wrapper.dataset.total);var cur = Number(wrapper.dataset.cur);var imgs = wrapper.querySelectorAll('.embed-slide-img');imgs[cur].dataset.hidden = 'true';cur = (cur + 1 + total) % total;wrapper.dataset.cur = cur;imgs[cur].dataset.hidden = 'false';wrapper.querySelector('.embed-slide-controller-num').innerText = cur + 1 + ' / ' + total;}"
>
	<path
		d="m6 18 8.5-6-8.5-6zm10-12v12h2v-12z"
		fill="currentColor"
	></path>
</svg>`;
	wrapper.appendChild(content);
	wrapper.appendChild(controller);
	return wrapper;
};
