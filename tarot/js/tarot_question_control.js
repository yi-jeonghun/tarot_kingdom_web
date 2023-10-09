$('document').ready(function(){
	window._tarot_question_control = new TarotQuestionControl().Init();
});

function TarotQuestionControl(){
	var self = this;
	this._fortune_sub_question_list = [];

	this.Init = function(){
		self.LoadSubQueationList();
		return this;
	};

	this.LoadSubQueationList = function(){
		var fortune_key = window._tarot_main.GetSelectedFortuneKey();
		self._fortune_sub_question_list = window._tarot_main.GetFortuneSubQuestionList(fortune_key);
		self.DISP_QuestionList();
	};

	this.ChooseQuestion = function(question_index){
		console.debug('question_index ' + question_index);
		window._tarot_main.SelectFortuneSubQuestion(question_index);
		window._tarot_main.OpenMenu('tarot_card', 1);
	};

	this.DISP_QuestionList = function(){
		var h = '';

		for(var i=0 ; i<self._fortune_sub_question_list.length ; i++){
			var index = self._fortune_sub_question_list[i].index;
			var question = self._fortune_sub_question_list[i].question;
			var on_click = `window._tarot_question_control.ChooseQuestion(${index})`;
			h += `
			<div class="col-12">
			<div class="btn btn-light" onClick="${on_click}">${question}</div>
			</div>
			`;
		}
		
		$('#id_div_tarot_question_list').html(h);
	};
}