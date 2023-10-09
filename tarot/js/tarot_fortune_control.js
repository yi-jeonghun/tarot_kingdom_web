$('document').ready(function(){
	window._tarot_fortune_control = new TarotFortuneControl().Init();
});

function TarotFortuneControl(){
	var self = this;

	this.Init = function(){
		window._tarot_main.LoadFortuneList(function(){
			self.DISP_FortuneList();
		});
		self.InitHandle();
		return this;
	};

	this.InitHandle = function(){
	};

	this.DISP_FortuneList = function(){
		var h = '';
		for(var i=0 ; i<window._tarot_main._fortune_list.length ; i++){
			var key = window._tarot_main._fortune_list[i].key;
			var name = window._tarot_main._fortune_list[i].name;
			var on_click = `window._tarot_fortune_control.ChooseFortune('${key}')`;
			h += `
			<div class="btn btn-light" onCLick="${on_click}">${name}</div>
			`;
		}
		$('#id_div_fortune_list').html(h);
	};

	this.ChooseFortune = function(fortune_key){
		if(window._tarot_main.FortuneHasSubQuestion(fortune_key)){
			window._tarot_main.SetSelectedFortuneKey(fortune_key);
			window._tarot_main.OpenMenu('tarot_question', 1);
		}else{
			window._tarot_main.SelectFortune(fortune_key);
			window._tarot_main.OpenMenu('tarot_card', 1);
		}
	};
}