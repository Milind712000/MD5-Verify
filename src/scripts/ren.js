const { ipcRenderer } = require('electron');

const fileBox = document.querySelector('.fileBox');
const fileInput = document.querySelector('input[type=file]');

const successMsg = document.querySelector('.msg.green');
const failureMsg = document.querySelector('.msg.red');
const nofile__msg = document.querySelector('.nofile__msg');
const file__msg = document.querySelector('.file__msg');
const drag__msg = document.querySelector('.drag__msg');
const file__name = document.querySelector('.file__name');
const calc_md5 = document.querySelector('#calc-md5');
const source_md5 = document.querySelector('#source-md5');

let droppedFiles;

ipcRenderer.on('checksum', (event, checksum) => {
	calc_md5.value = checksum;
	hashChange();
})

function hashChange() {
	if(!fileInput.value) {
		displayMsg('filefile');
		calc_md5.classList.remove('lred');
		calc_md5.classList.remove('lgreen');
		return;
	}
	const source_checksum = source_md5.value;
	const calc_checksum = calc_md5.value;

	if(source_checksum === calc_checksum){
		displayResult('pass');
		calc_md5.classList.add('lgreen');
		calc_md5.classList.remove('lred');
	} else {
		displayResult('fail');
		calc_md5.classList.remove('lgreen');
		calc_md5.classList.add('lred');
	}
}


function displayMsg(result = "nope") {
	if(result === 'drag'){
		drag__msg.classList.remove("nope__css");
		file__msg.classList.add("nope__css");
		nofile__msg.classList.add("nope__css");
	}else if(result === 'file'){
		file__msg.classList.remove("nope__css");
		drag__msg.classList.add("nope__css");
		nofile__msg.classList.add("nope__css");
	}else{
		nofile__msg.classList.remove("nope__css");
		drag__msg.classList.add("nope__css");
		file__msg.classList.add("nope__css");
	}
}

function displayResult(result = "nope") {
	if(result === 'pass'){
		successMsg.classList.remove("nope__css");
		failureMsg.classList.add("nope__css");
	}else if(result === 'fail'){
		successMsg.classList.add("nope__css");
		failureMsg.classList.remove("nope__css");
	}else{
		successMsg.classList.add("nope__css");
		failureMsg.classList.add("nope__css");
	}
}

fileBox.addEventListener('dragover', (e) => {
	e.preventDefault();
	displayMsg('drag');
});

fileBox.addEventListener('dragleave', () => {
	if(droppedFiles) displayMsg('file');
	else displayMsg('none');
});

fileBox.addEventListener('drop', (e) => {
	e.preventDefault();
	fileInput.files = e.dataTransfer.files;
	fileInput.onchange();
});

fileInput.onchange = function() {
	if(!fileInput.value) {
		displayMsg('filefile');
		return;
	}
	const filePath = fileInput.files[0].path;
	file__name.innerHTML = fileInput.files[0].name;
	ipcRenderer.send('filePath', filePath);
	displayMsg('file');
}

source_md5.onchange = hashChange;
source_md5.onkeyup = hashChange;

displayResult();
displayMsg();