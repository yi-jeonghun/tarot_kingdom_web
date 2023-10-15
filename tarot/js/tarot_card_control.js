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
	SPREAD_WAIT:   'spread_wait',
	ROTATE_WAIT:   'rotate_wait'
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
	this._screen_touched = false;
	this._focused_index = -1;
	this._selected_card_index = -1;

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
			e.preventDefault();
			e.stopPropagation();
			self._screen_touched = true;
			$('#id_debug').html('mouse down');
		});
		self._canvas.addEventListener("mouseup", (e) => {
			e.preventDefault();
			e.stopPropagation();
			self._screen_touched = false;
			$('#id_debug').html('mouse up');
		});
		var prev_x = -100;
		var prev_y = -100;
		self._canvas.addEventListener("mousemove", (e) => {
			e.preventDefault();
			e.stopPropagation();

			$('#id_debug').html('mouse move');

			var x = e.offsetX;
			var y = e.offsetY;
			if(self._screen_touched){
				if(prev_x != -100 && prev_y != -100){
					var diff_x = x - prev_x;
					var diff_y = y - prev_y;
					if(diff_y > 0){
						if(diff_y > 5){
							diff_y = 5;
						}
						self.Rotate(diff_y);
					}
					if(diff_y < 0){
						if(diff_y < -5){
							diff_y = -5;
						}
						self.Rotate(diff_y);
					}
				}
				prev_x = x;
				prev_y = y;
			}
		});
	};

	this.Rotate = function(degree){
		for(var i=0 ; i<self._card_list.length ; i++){
			self._card_list[i].Rotate(degree);
		}
		self._step = STEP.ROTATE_WAIT;
	};

	this.Focus = function(){
		var min_tilt = 180;
		var focusing_index = -1;
		for(var i=0 ; i<self._card_list.length ; i++){
			var card = self._card_list[i];
			var tilt = card.GetTilt();
			if(tilt < min_tilt){
				min_tilt = tilt;
				focusing_index = i;
			}
		}

		for(var i=0 ; i<self._card_list.length ; i++){
			var card = self._card_list[i];
			if(i == focusing_index){
				card.Focus();
				self._focused_index = i;
			}else{
				card.Defocus();
			}
		}
	};

	this.InitCanvas = function(){
		self._canvas = document.getElementById('id_canvas');
		self._canvas.width = self._canvas_width;
		self._canvas.height = self._canvas_height;
		self._ctx = self._canvas.getContext('2d');
	};

	this.InitCardList = function(){
		var tmp_card_list = [];
		for(var i=0 ; i<window._tarot_main._tarot_card_list.length ; i++){
			tmp_card_list.push(window._tarot_main._tarot_card_list[i]);
		};
		tmp_card_list.sort(() => Math.random() - 0.5);

		var x = self._top_card_pos.x;
		var y = self._top_card_pos.y;
		for(var i=0 ; i<self._card_count ; i++){
			var card_id = tmp_card_list[i];
			var card = new Card(self._ctx, x, y, self._card_size.w, self._card_size.h, card_id);
			card.Init();
			self._card_list.push(card);
			// console.debug('card id ' + card_id);
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

	this.SelectCard = function(){
		if(self._focused_index != -1){
			self._card_list[self._focused_index].ShowCard();
			self._selected_card_index = self._focused_index;
			self._step = STEP.SHOW_CARD_WAIT;
		}
	};

	this.GoToResult = function(){
		console.debug('goto result ');
		window._tarot_main._tarot_card_key = self._card_list[self._focused_index]._card_id;
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
				// window.requestAnimationFrame(self.Update);
				break;
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
			case STEP.ROTATE_WAIT:
				self.Focus();
				if(self.StillMoving() == false){
					console.debug('STEP.IDLE ');
					self._step = STEP.IDLE;
				}
				break;
			case STEP.SHOW_CARD_WAIT:
				if(self.StillMoving() == false){
					console.debug('STEP.IDLE ');
					self._step = STEP.IDLE;
					self.GoToResult();
				}
				break;
		}

		self.Clear();
		for(var i=0 ; i<self._card_list.length ; i++){
			self._card_list[i].Update(self._delta);
		}
		self.DrawCardList();

		if(self._selected_card_index != -1){
			self._card_list[self._selected_card_index].Draw();
		}

		window.requestAnimationFrame(self.Update);
	};

	this.Clear = function(){
		self._ctx.clearRect(0, 0, self._canvas_width, self._canvas_height);
	};

	this.GetRandom = function(){
		var r = Math.floor(Math.random() * self._card_count);

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