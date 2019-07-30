'use strict';

document.addEventListener('DOMContentLoaded', (event) => {
	console.log('Load');
	let stages = document.getElementById('stages').children;
	
	for (let child of stages) {
		child.addEventListener('click', (event) => {
			let childClasses = child.classList;

			child.classList.toggle('banned-stage');
		});
	}
});