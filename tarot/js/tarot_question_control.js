$('document').ready(function(){
	window._tarot_question_control = new TarotQuestionControl().Init();
});

function TarotQuestionControl(){
	var self = this;
	this.Init = function(){
		self.DISP_QuestionList();
		self.InitHandle();
		return this;
	};

	this.InitHandle = function(){
	};

	this.ChooseQuestion = function(question){
		window._tarot_main._question = question;
		window._tarot_main.OpenMenu('tarot_card');
	};

	this.DISP_QuestionList = function(){
		var h = '';

		for(var i=0 ; i<10 ; i++){
			h += `
			<div class="col-12">
			<div class="btn btn-light" id="id_btn_love" onCLick="window._tarot_question_control.ChooseQuestion(${i})">질문 ${i}</div>
			</div>
			`;
		}
		
		$('#id_div_tarot_question_list').html(h);
	};
}