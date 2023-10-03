$('document').ready(function(){
	window._cms = new CMSControl().Init();
});

function CMSControl(){
	var self = this;
	this._fortune_list = [];
	this._tarot_card_list = [];
	this._selected_fortune_idx = null;
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
				self._tarot_card_list = res.tarot_card_list;
				self.DISP_FortuneList();
			}
		});
	};

	this.InitHandle = function(){
		$('#id_btn_save_tarot_read').on('click', self.SaveTarotRead);
	};

	this.DISP_FortuneList = function(){
		var h = ``;

		for(var i=0 ; i<self._fortune_list.length ; i++){
			var fortune = self._fortune_list[i];
			var on_click = `window._cms.ChooseFortune(${i})`;
			h += `<div><button onClick="${on_click}" type="button" class="btn btn-light">${fortune.name}</button></div>`;
		}
		$('#id_div_fortune_list').html(h);
	};

	this.ChooseFortune = function(idx){
		self._selected_fortune_idx = idx;
		var fortune_key = self._fortune_list[idx].key;

		var width = 300 / 3;
		var height = 532 / 3;

		var h = ``;
		for(var i=0 ; i<self._tarot_card_list.length ; i++){
			var tarot_card_key = self._tarot_card_list[i];
			var on_click = `window._cms.ChooseTarotCard(${i})`;
			h += `<div class="border">
			<span>${i+1}</span>
			<span><img onClick="${on_click}" src="../tarot/img/${tarot_card_key}.jpg" style="cursor:pointer; width:${width}; height:${height}"></span>
			<span id="id_text_tarot_read-${tarot_card_key}"></span>
			</div>`;
		}
		$('#id_div_tarot_card_list').html(h);

		POST('/cms_api/get_tarot_read_list', {fortune_key:fortune_key}, function(res){
			console.debug('res ' + JSON.stringify(res));
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
		self._selected_tarot_card_idx = idx;
		var fortune_name = self._fortune_list[self._selected_fortune_idx].name;
		$('#id_label_modal_fortune').html(fortune_name);

		var width = 300 / 3;
		var height = 532 / 3;
		var tarot_card_key = self._tarot_card_list[idx];
		$('#id_img_selected_tarot').html(`<img src="../tarot/img/${tarot_card_key}.jpg" style="cursor:pointer; width:${width}; height:${height}">`);;

		for(var i=0 ; i<self._tarot_read_list.length ; i++){
			if(self._tarot_read_list[i].key == tarot_card_key){
				$('#id_textarea_tarot_read').val(self._tarot_read_list[i].read);
			}
		}
		$('#id_modal_tarot_edit').modal('show');
	}

	this.SaveTarotRead = function(){
		var fortune_key = self._fortune_list[self._selected_fortune_idx].key;
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