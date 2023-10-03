$('document').ready(function(){
	window._tarot_result_control = new TarotResultControl().Init();
});

function TarotResultControl(){
	var self = this;
	this.Init = function(){
		self.InitHandle();
		self.DISP_Result();
		return this;
	};

	this.InitHandle = function(){
		$('#id_btn_restart').on('click', self.BTN_Restart);
	};

	this.DISP_Result = function(){
		//show tarot image
		{
			var file_name = `${window._tarot_main._tarot_card_key}.jpg`;
			var img = `<img src="./img/${file_name}">`;
			$('#id_div_choosed_tarot_card').html(img);	
		}

		//show tarot result
		{
			var read = window._tarot_main.GetTarotRead();
			$('#id_div_result').html(read);
		}
	};

	this.BTN_Restart = function(){
		window._tarot_main.OpenMenu('tarot_fortune');
	};
}