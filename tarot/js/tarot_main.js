$('document').ready(function(){
	window._tarot_main = new TarotMain().Init();
});

function TarotMain(){
	var self = this;

	this._tarot_card_list = [];
	this._fortune_list = [];
	this._tarot_read_list = [];

	this._fortune_key = null;
	this._question = null;
	this._tarot_card_key = null;

	this.Init = function(){
		self.LoadTarotCardList();
		self.InitHandle();
		self.OpenMenu('tarot_fortune', 1);
		self.InitMessageHandler();
		self.InitPullToRequest();
		return this;
	};

	this.InitHandle = function(){
	};

	this.InitMessageHandler = function(){
		window.addEventListener("message", (event) => {
			// console.log('evnet ' + event);
			var message = event.data;
			if(message.head == 'undefined'){
				return;
			}else if(message.head == 'MANGO'){
				if(message.command == 'ChangeMenu'){
					// console.log('message.menu ' + message.menu);
					self.OpenMenu(message.menu);
				}else if(message.command == 'FindLikeMusic'){
					for(var i=0 ; i<message.music_list.length ; i++){
						var m = message.music_list[i];
						// console.log(m.title);
						if(m.is_multiple){
							m.is_like = window._like_control.FindMusicMulti(m.music_uid);
						}else{
							m.is_like = window._like_control.FindMusicSingle(m.music_uid);
						}
					}
					var message = {
						head: 'MANGO',
						command: 'FindLikeMusicResponse',
						music_list: message.music_list
					};
					parent.postMessage(message, "*");
				}else if(message.command == 'ClickLikeMusic'){
					window._like_control.OnClickLikeMusic(message.music);
				}else if(message.command == 'GetAppVersionResponse'){
					$('#id_label_app_version').html(message.app_version);
				}
			}
		}, false);
	};

	this.GetTarotRead = function(){
		for(var i=0 ; i<self._tarot_read_list.length ; i++){
			if(self._tarot_read_list[i].key == self._tarot_card_key){
				return self._tarot_read_list[i].read;
			}
		}
		return '';
	};

	this.LoadTarotCardList = function(){
		GET(`/cms/db/tarot_card_list.json`, function(res){
			self._tarot_card_list = res;
		});
	};

	this.SelectFortune = function(fortune_key){
		self._fortune_key = fortune_key;
		self.LoadTarotReadList();
	};

	this.LoadTarotReadList = function(){
		GET(`/cms/db/tarot_read_${self._fortune_key}.json`, function(res){
			self._tarot_read_list = res;
		});
	};

	this.LoadFortuneList = function(cb){
		GET('/cms/db/fortune_list.json', function(res){
			self._fortune_list = res;
			if(cb){
				cb();
			}
		});
	};

	this.GetSelectedFortuneName = function(){
		for(var i=0 ; i<self._fortune_list.length ; i++){
			if(self._fortune_list[i].key == self._fortune_key){
				return self._fortune_list[i].name;
			}
		}
		return '';
	};

	//-------------------------------------------------------------
	this._menu_loaded_tarot_fortune = false;
	this._menu_loaded_tarot_question = false;
	this._menu_loaded_tarot_card = false;
	this._menu_loaded_tarot_result = false;
	
	this.OpenMenu = function(menu, reload){
		console.log('menu ' + menu);
		$('#id_menu_tarot_fortune').hide();
		$('#id_menu_tarot_question').hide();
		$('#id_menu_tarot_card').hide();
		$('#id_menu_tarot_result').hide();

		switch(menu){
			case 'tarot_fortune':
				$('#id_menu_tarot_fortune').show();
				if(self._menu_loaded_tarot_fortune == false | reload){
					$('#id_menu_tarot_fortune').html('');
					$('#id_menu_tarot_fortune').load(`./tarot_fortune.html`);
					self._menu_loaded_tarot_fortune = true;
				}
				break;
			case 'tarot_question':
				$('#id_menu_tarot_question').show();
				if(self._menu_loaded_tarot_question == false | reload){
					$('#id_menu_tarot_question').html('');
					$('#id_menu_tarot_question').load(`./tarot_question.html`);
					self._menu_loaded_tarot_question = true;
				}
				break;
			case 'tarot_card':
				$('#id_menu_tarot_card').show();
				if(self._menu_loaded_tarot_card == false | reload){
					$('#id_menu_tarot_card').html('');
					$('#id_menu_tarot_card').load(`./tarot_card.html`);
					self._menu_loaded_tarot_card = true;
				}
				break;
			case 'tarot_result':
				$('#id_menu_tarot_result').show();
				if(self._menu_loaded_tarot_result == false | reload){
					$('#id_menu_tarot_result').html('');
					$('#id_menu_tarot_result').load(`./tarot_result.html`);
					self._menu_loaded_tarot_result = true;
				}
				break;
		}
	};

	this.InitPullToRequest = function(div_name, menu){
		// console.log('init pull refresh ' + div_name + ' ' + menu);
		return;

		PullToRefresh.init({
			mainElement: '#id_menu_home',
			triggerElement: '#id_menu_home',
			onRefresh: function () {
				self.OpenMenu('home', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

		PullToRefresh.init({
			mainElement: '#id_menu_multi',
			triggerElement: '#id_menu_multi',
			onRefresh: function () {
				self.OpenMenu('multi', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

		PullToRefresh.init({
			mainElement: '#id_menu_single',
			triggerElement: '#id_menu_single',
			onRefresh: function () {
				self.OpenMenu('single', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});
		
		PullToRefresh.init({
			mainElement: '#id_menu_artist',
			triggerElement: '#id_menu_artist',
			onRefresh: function () {
				self.OpenMenu('artist', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

		PullToRefresh.init({
			mainElement: '#id_menu_my',
			triggerElement: '#id_menu_my',
			onRefresh: function () {
				self.OpenMenu('my', true);
			},
			shouldPullToRefresh: function(){
				return !this.mainElement.scrollTop;
			}
		});

	};
}