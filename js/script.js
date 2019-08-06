const storage_key = 'config';
const default_config = {
	configuration_mode: true,
	approved_stages: [],
	banned_stages: [],
	preset: 'custom'
};
var config = JSON.parse(localStorage.getItem(storage_key));


function init() {
	console.log(config);
	const stages_data = fetchJson('/stages.json');
	stages_data.then((response) => setupStages(response));
	setupScroll();
	setupServiceWorker();

	const config_event = (event) => {
		removeStages();
		toggleConfig();
		stages_data.then((response) => setupStages(response));
	};
	document.getElementById('save_button').addEventListener('click', config_event);
	document.getElementById('config_button').addEventListener('click', config_event);
}

function setupStages(stages_data) {
	stages_data.sort((a, b) => a.label.localeCompare(b.label));

	if (config === null) config = default_config;
	if (config.configuration_mode) {
		createStages(stages_data);
		setupStageEvents(stages_data);
	} else {
		setupApprovedStages(config.approved_stages);
	}
}

function setupApprovedStages(stages) {
	stages.sort((a, b) => a.label.localeCompare(b.label));
	removeStages();
	createStages(stages);
	setupStageEvents(stages);
	setupPullToRefresh();
}

function setupStageEvents(stages_data) {
	let stages = document.getElementById('stages').children;
	
	Array.from(stages).forEach(function(stage) {
		stage.addEventListener('click', (event) => {
			let id = Number(stage.getAttribute('stage-id'));

			if (config.configuration_mode) {
				approveStage(stage, getStage(stages_data, id));
			} else {
				banStage(stage, getStage(stages_data, id))
			}
		});
	 });
}

function createStages(stages) {
	let stages_container = document.getElementById('stages');
	let fragment = document.createDocumentFragment();

	stages.forEach((stage) => {
		let card = parseHTML(`<div class="stage-card" stage-id="${stage.id}"><div class="stage"></div><p>${stage.label}</p></div>`);
		card.firstChild.setAttribute('style', `background-image: url("${stage.image_url}");`);
		if (isApprovedStage(stage) && config.configuration_mode) card.classList.add('approved-stage');
		fragment.appendChild(card);
	});

	stages_container.appendChild(fragment);
}

function getStage(stages, id) {
	return stages.filter((item) => item.id === id)[0];
}

function removeStages() {
	removeChildren(document.getElementById('stages'));
}

function approveStage(stage, data) {
	if (isApprovedStage(data)) {
		config.approved_stages = config.approved_stages.filter((item) => item.id !== data.id);
	} else {
		config.approved_stages.push(data);
	}
	stage.classList.toggle('approved-stage');

	localStorage.setItem(storage_key, JSON.stringify(config));
}

function banStage(stage, data) {
	config.banned_stages.push(data);
	stage.classList.toggle('banned-stage');
}

function isApprovedStage(stage) {
	let approved = config.approved_stages.filter((approved) => approved.id === stage.id);

	return approved.length !== 0;
}

function toggleConfig(enabled = (config.configuration_mode = !config.configuration_mode)) {
	document.getElementById('body').classList.toggle('config', enabled);
}




// Helper functions --------------------------------------
const parseHTML = (string) => {
    let html = new DOMParser().parseFromString(string , 'text/html');
    return html.body.firstChild;
};

const fetchJson = async (json) => {
	let response = await fetch(json);
	return await response.json();
};

const removeChildren = (parent) => {
    let last;
    while (last = parent.lastChild) parent.removeChild(last);
};

// The debounce function receives our function as a parameter
const debounce = (fn) => {
	// This holds the requestAnimationFrame reference, so we can cancel it if we wish
	let frame;

	// The debounce function returns a new function that can receive a variable number of arguments
	return (...params) => {
		// If the frame variable has been defined, clear it now, and queue for next frame
		if (frame) { 
			cancelAnimationFrame(frame);
		}

		// Queue our function call for the next frame
		frame = requestAnimationFrame(() => {		
			// Call our function and pass any params we received
			fn(...params);
		});
	} 
};
  
// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = () => {
	document.documentElement.dataset.scroll = window.scrollY;
}

function setupScroll() {
	// Listen for new scroll events, here we debounce our `storeScroll` function
	document.addEventListener('scroll', debounce(storeScroll), { passive: true });
	storeScroll(); 	// Update scroll position for first time
}

function setupPullToRefresh() {
	PullToRefresh.init({
		mainElement: '#ptr',
		instructionsRefreshing: 'Resetting Bans',
		instructionsReleaseToRefresh: '&#8635; Release to Reset Bans',
		instructionsPullToRefresh: ' ',
		iconArrow: ' ',
		iconRefreshing: ' ',
		distThreshold: 20,
		distMax: 40,
		distReload: 40,
		onRefresh() {
			window.location.reload();
			
		}
	});
	
	let header = document.getElementById('header').classList;

	document.addEventListener('touchstart', () => drag = false);
	document.addEventListener('touchmove', () => header.add('dragged'));
	document.addEventListener('touchend', () => header.remove('dragged'));
	TouchEmulator();
}

function setupServiceWorker() {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/js/service-worker.js').then((reg) => {
				console.log('Service worker registered.', reg);
			});
		});
	}
}

document.addEventListener('DOMContentLoaded', (event) => init());
