function SendMessage_AddMusic(music){
	var message = {
		head: 'MANGO',
		command: 'AddMusic',
		music: music
	};
	parent.postMessage(message, "*");
}

function SendMessage_ListenAll(music_list){
	var message = {
		head: 'MANGO',
		command: 'ListenAll',
		music_list: music_list
	};
	parent.postMessage(message, "*");
}

function SendMessage_GetAppVersion(){
	var message = {
		head: 'MANGO',
		command: 'GetAppVersion'
	};
	parent.postMessage(message, "*");
};

function EscapeHtml(unsafe){
	return unsafe
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
}
