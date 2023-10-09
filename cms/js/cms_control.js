$('document').ready(function(){
	window._cms = new CMSControl().Init();
});

function CMSControl(){
	var self = this;
	this._fortune_list = [];
	this._fortune_sub_question_list = [];
	this._tarot_card_list = [];
	this._selected_fortune_idx = null;
	this._selected_sub_question_index = null;
	this._tarot_read_list = [];

	this.Init = function(){
		self.InitHandle();
		self.Load();
		return this;
	};

	this.Load = function(){
		GET('/cms_api/get_base_data', function(res){
			if(res.ok){
				self._fortune_list = res.fortune_list;
				self._fortune_sub_question_list = res.fortune_sub_question_list;
				self._tarot_card_list = res.tarot_card_list;
				self.DISP_FortuneList();
			}
		});
	};

	this.InitHandle = function(){
		$('#id_btn_fortune_add').on('click', self.AddFortune);
		$('#id_btn_fortune_add_save').on('click', self.AddFortuneSave);
		$('#id_btn_fortune_edit_save').on('click', self.EditFortuneSave);
		$('#id_btn_save_tarot_read').on('click', self.SaveTarotRead);
		$('#id_btn_sub_question_save').on('click', self.SaveSubQuestion);
	};

	this.DISP_FortuneList = function(){
		var h = ``;

		for(var i=0 ; i<self._fortune_list.length ; i++){
			var fortune = self._fortune_list[i];
			var on_click = `window._cms.ChooseFortune(${i})`;
			var on_edit = `window._cms.EditFortune(${i})`;
			h += `<tr>
				<td>
					<span onClick="${on_click}" style="cursor:pointer">${fortune.key}</span>
				</td>
				<td onClick="${on_click}">
				<span onClick="${on_click}" style="cursor:pointer">${fortune.name}</span>
				</td>
				<td>
					<i onClick="${on_edit}" style="cursor:pointer" class="fas fa-edit"></i>
			`;
			
			if(fortune.has_sub_question){
				h += `<i onClick="window._cms.OpenSubQuestionModal('${fortune.key}', 'add')" style="cursor:pointer" class="fas fa-plus"></i>`;
			}
			
			h += `
				</td>
			</tr>`;

			for(var s=0 ; s<self._fortune_sub_question_list.length ; s++){
				if(self._fortune_sub_question_list[s].parent_fortune_key == fortune.key){
					h += `
					<tr>
						<td> > ${self._fortune_sub_question_list[s].index+1}</td>
						<td>
							<span onClick="window._cms.ChooseFortuneQuestion(${i}, ${self._fortune_sub_question_list[s].index})" style="cursor:pointer">${self._fortune_sub_question_list[s].question}</span>
						</td>
						<td><i onClick="window._cms.OpenSubQuestionModal('${fortune.key}', 'edit', ${s})" style="cursor:pointer" class="fas fa-edit"></i></td>
					</tr>
					`;
				}
			}

		}
		$('#id_div_fortune_list').html(h);
	};

	this._sub_question_mode = '';
	this._sub_question_parent_fortune_key = '';
	this._sub_question_index = '';
	this.OpenSubQuestionModal = function(fortune_key, mode, index){
		self._sub_question_mode = mode;
		self._sub_question_parent_fortune_key = fortune_key;
		self._sub_question_index = index;
		
		if(mode == 'add'){
			$('#id_text_sub_question').val('');
		}else{
			for(var i=0 ; i<self._fortune_sub_question_list.length ; i++){
				if(self._fortune_sub_question_list[i].parent_fortune_key == fortune_key){
					if(self._fortune_sub_question_list[i].index == index){
						$('#id_text_sub_question').val(self._fortune_sub_question_list[i].question);
					}						
				}
			}
		}

		$('#id_modal_sub_question').modal('show');
	};

	this.SaveSubQuestion = function(){
		var sub_question = $('#id_text_sub_question').val();
		if(sub_question == ''){
			alert('sub question empty');
			return;
		}

		if(self._sub_question_mode == 'add'){
			var count = 0;
			for(var i=0 ; i<self._fortune_sub_question_list.length ; i++){
				if(self._fortune_sub_question_list[i].parent_fortune_key == self._sub_question_parent_fortune_key){
					count++;
				}
			}
			self._fortune_sub_question_list.push({
				parent_fortune_key:self._sub_question_parent_fortune_key,
				index: count,
				question: sub_question
			});
		}else{
			for(var i=0 ; i<self._fortune_sub_question_list.length ; i++){
				if(self._fortune_sub_question_list[i].parent_fortune_key == self._sub_question_parent_fortune_key){
					if(self._fortune_sub_question_list[i].index == self._sub_question_index){
						self._fortune_sub_question_list[i].question = sub_question;
					}
				}
			}
		}

		$('#id_modal_sub_question').modal('hide');
		POST('/cms_api/save_sub_question_list', self._fortune_sub_question_list, function(res){
			if(res.ok){
				self.DISP_FortuneList();
			}else{
				alert(res.err);
			}
		});
	};

	this.AddFortune = function(){
		$('#id_btn_fortune_add_save').show();
		$('#id_btn_fortune_edit_save').hide();

		$("#id_text_fortune_key").removeAttr("readonly"); 
		$('#id_text_fortune_key').val('');
		$('#id_text_fortune_name').val('');
		$("input:checkbox[id='id_checkbox_fortune_has_sub_question']").prop("checked", false);

		$('#id_modal_fortund_edit').modal('show');
	};

	this.AddFortuneSave = function(){
		var key = $('#id_text_fortune_key').val();
		var name = $('#id_text_fortune_name').val();
		var has_sub_question = $("input:checkbox[id='id_checkbox_fortune_has_sub_question']").is(":checked");
		if(key == '' || name == ''){
			alert('key / name');
			return;
		}
		self._fortune_list.push({
			key: key,
			name: name,
			has_sub_question
		});

		POST('/cms_api/save_fortune_list', self._fortune_list, function(res){
			$('#id_modal_fortund_edit').modal('hide');
			self.DISP_FortuneList();
		});
	};

	this.EditFortune = function(idx){
		$('#id_btn_fortune_add_save').hide();
		$('#id_btn_fortune_edit_save').show();

		$("#id_text_fortune_key").attr("readonly",true); 
		$('#id_text_fortune_key').val(self._fortune_list[idx].key);
		$('#id_text_fortune_name').val(self._fortune_list[idx].name);

		if(self._fortune_list[idx].has_sub_question){
			$("input:checkbox[id='id_checkbox_fortune_has_sub_question']").prop("checked", true);
		}else{
			$("input:checkbox[id='id_checkbox_fortune_has_sub_question']").prop("checked", false);
		}

		$('#id_modal_fortund_edit').modal('show');
	};

	this.EditFortuneSave = function(){
		var key = $('#id_text_fortune_key').val();
		var name = $('#id_text_fortune_name').val();
		var has_sub_question = $("input:checkbox[id='id_checkbox_fortune_has_sub_question']").is(":checked");
		if(key == '' || name == ''){
			alert('key / name');
			return;
		}

		for(var i=0 ; i<self._fortune_list.length ; i++){
			if(self._fortune_list[i].key == key){
				self._fortune_list[i].name = name;
				self._fortune_list[i].has_sub_question = has_sub_question;
				break;
			}
		}

		POST('/cms_api/save_fortune_list', self._fortune_list, function(res){
			$('#id_modal_fortund_edit').modal('hide');
			self.DISP_FortuneList();
		});
	};

	this._width = 300 / 3;
	this._height = 532 / 3;
	this.ChooseFortune = function(idx){
		self._selected_fortune_idx = idx;
		self._selected_sub_question_index = null;
		var fortune_key = self._fortune_list[idx].key;

		self.DISP_RarotCardList(fortune_key);
	};

	this.ChooseFortuneQuestion = function(fortune_index, sub_question_index){
		self._selected_fortune_idx = fortune_index;
		self._selected_sub_question_index = sub_question_index;
		var fortune_key = self._fortune_list[fortune_index].key + '-' + sub_question_index;

		self.DISP_RarotCardList(fortune_key);
	};

	this.DISP_RarotCardList = function(fortune_key){
		var h = ``;
		for(var i=0 ; i<self._tarot_card_list.length ; i++){
			var tarot_card_key = self._tarot_card_list[i];
			var on_click = `window._cms.ChooseTarotCard(${i})`;
			h += `<div class="container-fluid border-bottom">
				<div class="row">
					<div class="col-2 border-right">
						<span class="px-1">${i+1}</span>
						<img onClick="${on_click}" src="../tarot/img/${tarot_card_key}.jpg" style="cursor:pointer; width:${self._width}; height:${self._height}"></div>
					<div class="col-10" id="id_text_tarot_read-${tarot_card_key}"></div>			
				</div>
			</div>`;
		}
		$('#id_div_tarot_card_list').html(h);

		self._tarot_read_list = [];
		POST('/cms_api/get_tarot_read_list', {fortune_key:fortune_key}, function(res){
			if(res.ok){
				self._tarot_read_list = res.tarot_read_list;
				for(var i=0 ; i<self._tarot_read_list.length ; i++){
					var tarot = self._tarot_read_list[i];
					$(`#id_text_tarot_read-${tarot.key}`).html(tarot.read);
				}
			}
		})
	};

	this.ChooseTarotCard = function(idx){
		console.debug('idx ' + idx);
		self._selected_tarot_card_idx = idx;

		console.debug('_selected_sub_question_index ' + self._selected_sub_question_index);
		var fortune_name = '';
		if(self._selected_sub_question_index == null){
			fortune_name = self._fortune_list[self._selected_fortune_idx].name;
		}else{
			var fortune_key = self._fortune_list[self._selected_fortune_idx].key;
			for(var i=0 ; i<self._fortune_sub_question_list.length ; i++){
				if(self._fortune_sub_question_list[i].parent_fortune_key == fortune_key){
					if(self._fortune_sub_question_list[i].index == self._selected_sub_question_index){
						fortune_name = self._fortune_sub_question_list[i].question;
					}
				}
			}
		}

		$('#id_modal_fortune_title').html(fortune_name);

		var width = 300 / 3;
		var height = 532 / 3;
		var tarot_card_key = self._tarot_card_list[idx];
		$('#id_img_selected_tarot').html(`<img src="../tarot/img/${tarot_card_key}.jpg" style="cursor:pointer; width:${width}; height:${height}">`);;

		$('#id_textarea_tarot_read').val('');
		for(var i=0 ; i<self._tarot_read_list.length ; i++){
			if(self._tarot_read_list[i].key == tarot_card_key){
				$('#id_textarea_tarot_read').val(self._tarot_read_list[i].read);
			}
		}
		$('#id_modal_tarot_edit').modal('show');
	}

	this.SaveTarotRead = function(){
		var fortune_key = self._fortune_list[self._selected_fortune_idx].key;
		if(self._selected_sub_question_index != null){
			fortune_key += '-' + self._selected_sub_question_index;
		}
		var tarot_card_key = self._tarot_card_list[self._selected_tarot_card_idx];
		var tarot_read = $('#id_textarea_tarot_read').val();

		var found = false;
		for(var i=0 ; i<self._tarot_read_list.length ; i++){
			if(self._tarot_read_list[i].key == tarot_card_key){
				self._tarot_read_list[i].read = tarot_read;
				found = true;
			}
		}
		if(found == false){
			self._tarot_read_list.push({
				key:tarot_card_key,
				read:tarot_read
			});
		}
		console.debug('read list ' + JSON.stringify(self._tarot_read_list));

		var data = {
			fortune_key: fortune_key,
			tarot_read_list: self._tarot_read_list
		};
		POST('/cms_api/save_fortune_tarot_read', data, function(res){
			$('#id_modal_tarot_edit').modal('hide');
			$(`#id_text_tarot_read-${tarot_card_key}`).html(tarot_read);
		});
	};
}