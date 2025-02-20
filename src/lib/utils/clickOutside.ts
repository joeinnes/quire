export function clickOutside(node: Node, handler: (event: Event) => void) {
	// the node has been mounted in the DOM

	window.addEventListener('click', handleClick);

	function handleClick(e: Event) {
		if (!node.contains(e?.target as Node)) {
			handler(e);
		}
	}

	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick);
		}
	};
}
