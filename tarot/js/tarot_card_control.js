$('document').ready(function(){
	window._tarot_card_control = new TarotCardControl().Init();
});

var STEP = {
	IDLE:          'IDLE',
	SHUFFLE1:      'shuffle1',
	SHUFFLE1_WAIT: 'shuffle1_wait',
	SHUFFLE2:      'shuffle2',
	SHUFFLE2_WAIT: 'shuffle2_wait',
	SHUFFLE3:      'shuffle3',
	SHUFFLE3_WAIT: 'shuffle3_wait',
	SPREAD:        'spread',
	SPREAD_WAIT:   'spread_wait'
};

function TarotCardControl(){
	var self = this;
	this._canvas = null;
	this._canvas_width = 300;
	this._canvas_height = 500;
	this._ctx = null;
	this._card_count = 78;
	this._card_size = {w:90, h:160};
	this._card_img = {
		img: null,
		nw:0,
		nh:0,
		dw:0,
		dh:0
	};
	this._card_list = [];
	this._card_list_1 = [];
	this._card_list_2 = [];
	this._thick = 0.3;
	this._top_card_pos = {x:130, y:220};
	this._bottom_card_pos = {x:0, y:0};
	this._delay_incresement = 5;//5 milli seonds

	this.Init = function(){
		self.InitCanvas();
		self.InitCardList();
		self.InitHandle();

		self.LoadImage(function(){
			self.DrawCardList();
			self.Update();
		});

		$('#id_label_fortune').html(window._tarot_main.GetSelectedFortuneName());
		return this;
	};

	this.InitHandle = function(){
		self._canvas.addEventListener("mousedown", (e) => {
			var x = e.offsetX;
			var y = e.offsetY;
			// isDrawing = true;
			console.debug('mouse down x ' + x + ' y ' + y);
		});
		self._canvas.addEventListener("mouseup", (e) => {
			var x = e.offsetX;
			var y = e.offsetY;
			// isDrawing = true;
			console.debug('mouse up x ' + x + ' y ' + y);
		});
		$('#id_canvas').on('mousemove', function(e){
			e.preventDefault();
			e.stopPropagation();
			var x = e.offsetX;
			var y = e.offsetY;
			// isDrawing = true;
			console.debug('mouse move x ' + x + ' y ' + y);
		});
		// self._canvas.addEventListener("mousemove", (e) => {
		// 	e.preventDefault();
		// 	e.stopPropagation();
		// 	var x = e.offsetX;
		// 	var y = e.offsetY;
		// 	// isDrawing = true;
		// 	console.debug('mouse move x ' + x + ' y ' + y);
		// });
	};

	this.InitCanvas = function(){
		self._canvas = document.getElementById('id_canvas');
		self._canvas.width = self._canvas_width;
		self._canvas.height = self._canvas_height;
		self._ctx = self._canvas.getContext('2d');
	};

	this.InitCardList = function(){
		var x = self._top_card_pos.x;
		var y = self._top_card_pos.y;
		for(var i=0 ; i<self._card_count ; i++){
			var card_id = 'card-'+i;
			var card = new Card(self._ctx, x, y, self._card_size.w, self._card_size.h, card_id);
			self._card_list.push(card);
			// console.debug('x ' + x + ' y ' + y);
			x = x + self._thick;
			y = y + self._thick;
		}
		self._bottom_card_pos.x = x;
		self._bottom_card_pos.y = y;
	};

	this.LoadImage = function(cb){
		self._card_img.img = new Image();
		self._card_img.img.src = './img/tarot_back.jpg';
		self._card_img.img.onload = function(){
			self._card_img.nw = this.naturalWidth;
			self._card_img.nh = this.naturalHeight;
			self._card_img.dw = 90;
			self._card_img.dh = 160;
			for(var i=0 ; i<self._card_list.length ; i++){
				self._card_list[i].SetImg(self._card_img);
			}
			cb();
		}
	};

	this.DrawCardList = function(){
		for(var i=self._card_list.length-1 ; i>=0 ; i--){
			var card = self._card_list[i];
			card.Draw();
		}
	};

	this.DrawCard = function(card){
		// self._ctx.save();

		// if(self._step == STEP.SPREAD_WAIT){
		// 	var translate_x = self._card_img.dw * 2;
		// 	var translate_y = self._card_img.dh * 2;

		// 	self._ctx.translate(-translate_x, -translate_y);
		// 	self._ctx.rotate(card._angle * Math.PI / 180);
	
		// 	self._ctx.drawImage(self._card_img.img, 
		// 		0, 0, self._card_img.nw, self._card_img.nh, 
		// 		card.x, card.y, self._card_img.dw, self._card_img.dh);

		// 	self._ctx.translate(translate_x, translate_y);

		// }else{
			self._ctx.drawImage(self._card_img.img, 
				0, 0, self._card_img.nw, self._card_img.nh, 
				card.x, card.y, self._card_img.dw, self._card_img.dh);	
		// }

		// self._ctx.restore();	
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

	this._delta = 0;
	this._tick = 0;
	this._step = STEP.IDLE;
	this.Update = function () {
		{
			var now = Date.now();
			self._delta = now - self._tick;
			self._tick = now;
		}

		switch(self._step){
			case STEP.IDLE:
				window.requestAnimationFrame(self.Update);
				return;
			case STEP.SHUFFLE1:
				self.Shuffle1();
				break;
			case STEP.SHUFFLE1_WAIT:
				if(self.StillMoving() == false){
					self._step = STEP.SHUFFLE2;
				}
				break;
			case STEP.SHUFFLE2:
				self.Shuffle2();
				break;
			case STEP.SHUFFLE2_WAIT:
				if(self.StillMoving() == false){
					self._step = STEP.SHUFFLE3;
				}
				break;
			case STEP.SHUFFLE3:
				self.Shuffle3();
				break;
			case STEP.SHUFFLE3_WAIT:
				if(self.StillMoving() == false){
					self._step = STEP.IDLE;
				}
				break;
			case STEP.SPREAD:
				console.debug('STEP.SPREAD ');
				self.Spread();
				break;
			case STEP.SPREAD_WAIT:
				console.debug('STEP.SPREAD_WAIT ');
				if(self.StillMoving() == false){
					console.debug('STEP.IDLE ');
					self._step = STEP.IDLE;
				}
				break;
		}

		self.Clear();
		for(var i=0 ; i<self._card_list.length ; i++){
			self._card_list[i].Update(self._delta);
		}
		self.DrawCardList();

		window.requestAnimationFrame(self.Update);
	};

	this.Clear = function(){
		self._ctx.clearRect(0, 0, self._canvas_width, self._canvas_height);
	};

	this.GetRandom = function(){
		var r = Math.floor(Math.random() * 78);

		if(r < 20){
			r += 10;
		}

		if(r > 58){
			r -= 10;
		}

		return r;
	};

	this.StartShuffle = function(){
		if(self._step != STEP.IDLE){
			return;
		}
		self._step = STEP.SHUFFLE1;
	};

	this.Shuffle1 = function(){
		var r = self.GetRandom();

		self._card_list_1 = [];
		self._card_list_2 = [];
		for(var i=0 ; i<self._card_list.length ; i++){
			if(i < r){
				self._card_list_1.push(self._card_list[i]);
			}else{
				self._card_list_2.push(self._card_list[i]);
			}
		}

		var delay = 0;
		for(var i=self._card_list_2.length-1 ; i>=0 ; i--){
			var card = self._card_list_2[i];
			card.MoveTo(card.x + 50, card.y + 200, delay);
			delay += self._delay_incresement;
		}
		self._step = STEP.SHUFFLE1_WAIT;
	};

	this.Shuffle2 = function(){
		var delay = 0;
		var x = self._bottom_card_pos.x;
		var y = self._bottom_card_pos.y;
		for(var i=self._card_list_1.length-1 ; i>=0 ; i--){
			var card = self._card_list_1[i];
			card.MoveTo(x, y, delay);
			x -= self._thick;
			y -= self._thick;
			delay += self._delay_incresement;
		}

		var delay = 0;
		for(var i=self._card_list_2.length-1 ; i>=0 ; i--){
			var card = self._card_list_2[i];
			card.MoveTo(card.x+100, card.y - 200, delay);
			delay += self._delay_incresement;
		}
		self._step = STEP.SHUFFLE2_WAIT;
	};

	this.Shuffle3 = function(){
		var delay = 0;
		var x = self._top_card_pos.x;
		var y = self._top_card_pos.y;
		for(var i=0 ; i<self._card_list_2.length ; i++){
			var card = self._card_list_2[i];
			card.MoveTo(x, y, delay);
			x += self._thick;
			y += self._thick;
			delay += self._delay_incresement;
		}

		self._card_list = [];
		for(var i=0 ; i<self._card_list_2.length ; i++){
			self._card_list.push(self._card_list_2[i]);
		}
		for(var i=0 ; i<self._card_list_1.length ; i++){
			self._card_list.push(self._card_list_1[i]);
		}

		self._step = STEP.SHUFFLE3_WAIT;
	};

	this.StillMoving = function(){
		for(var i=0 ; i<self._card_list.length ; i++){
			if(self._card_list[i]._moving){
				return true;
			}
		}
		return false;
	};

	this.StartSpread = function(){
		self._step = STEP.SPREAD;
	};

	this.Spread = function(){
		var angle_step = 360/79;
		var angle = 0;
		for(var i=0 ; i<self._card_list.length ; i++){
			angle = 360 - (angle_step * i);
			self._card_list[i].MoveTo(self._top_card_pos.x, self._top_card_pos.y, 0);
			self._card_list[i].RotateTo(angle);
		}
		self._step = STEP.SPREAD_WAIT;
	};
}