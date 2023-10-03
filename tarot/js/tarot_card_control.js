$('document').ready(function(){
	window._tarot_card_control = new TarotCardControl().Init();
});

function TarotCardControl(){
	var self = this;
	this.Init = function(){
		self.InitHandle();
		self.DISP_CardList();

		$('#id_label_fortune').html(window._tarot_main.GetSelectedFortuneName());
		return this;
	};

	this.InitHandle = function(){
	};

	this.DISP_CardList = function(){
		var width = 300 / 3;
		var height = 532 / 3;
		var h = '';
		for(var i=0 ; i<window._tarot_main._tarot_card_list.length ; i++){
			var tarot_card_key = window._tarot_main._tarot_card_list[i];
			var on_click = `window._tarot_card_control.ChooseCard('${tarot_card_key}')`;
			h += `<img class="border" onClick="${on_click}" style="width:${width}px;height:${height}px; cursor:pointer" src='./img/tarot_back.jpg'>`;
		}
		$('#id_div_card_list').html(h);
	};

	this.ChooseCard = function(tarot_card_key){
		window._tarot_main._tarot_card_key = tarot_card_key;
		window._tarot_main.OpenMenu('tarot_result', 1);
	};
}