function Card(ctx, x, y, w, h, card_id){
	var self = this;
	this._img = null;
	this._ctx = ctx;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this._card_id = card_id;
	this._moving = false;
	this._tx = 0;//target X
	this._ty = 0;//target Y
	this._delay = 0;
	this._speed = 0.3;
	this._angle = 0;
	this._target_angle = 0;
	this._target_width = w;
	this._target_height = h;
	this._rotating = false;
	this._is_focused = false;
	this._direction = 'right';
	this._card_img = null;
	this._show_card = false;

	this.Init = function(){
		self._card_img = new Image();
		self._card_img.src = `./img/${self._card_id}.jpg`;
	};

	this.MoveTo = function(x, y, delay){
		self._tx = x;
		self._ty = y;
		self._delay = delay;
		self._moving = true;
	};

	this.RotateTo = function(angle){
		self._direction = 'right';
		self._target_angle = angle;
		if(self._target_angle > 360){
			self._target_angle -= 360;
		}
		if(self._target_angle < 0){
			self._target_angle += 360;
		}
		self._moving = true;
	};

	this.Rotate = function(degree){
		if(degree > 0){
			self._direction = 'right';
		}else{
			self._direction = 'left';
		}

		self._target_angle += degree;
		if(self._target_angle > 360){
			self._target_angle -= 360;
		}
		if(self._target_angle < 0){
			self._target_angle += 360;
		}
		self._moving = true;
	};

	this.SetImg = function(img){
		self._img = img;
	};

	this.GetTilt = function(){
		var tilt = 0;
		if(self._angle > 180){
			tilt = 180 - self._angle;
		}else{
			tilt = self._angle;
		}
		return tilt;
	};

	this.Focus = function(){
		if(self._is_focused == false){
			self._is_focusing = true;
			self._is_defocusing = false;
			self._is_focused = true;
		}
	};

	this.Defocus = function(){
		if(self._is_focused){
			self._is_focusing = false;
			self._is_defocusing = true;
			self._is_focused = false;
		}
	};

	this._is_focusing = false;
	this._is_defocusing = false;
	this._focusing_value = 0;
	this.Draw = function(){
		self._ctx.save();
		self._ctx.translate(self.x, self.y);

		var angle = self._angle * Math.PI / 180;
		self._ctx.rotate(angle);

		var nx = self.w/-2;
		var ny = self.h * -1;
		ny = ny - 20;

		if(self._is_focusing){
			self._focusing_value = self._focusing_value + 3;
			if(self._focusing_value > 30){
				self._focusing_value = 30;
				self._is_focusing = false;
			}
		}
		if(self._is_defocusing){
			self._focusing_value = self._focusing_value - 3;
			if(self._focusing_value < 0){
				self._focusing_value = 0;
				self._is_defocusing = false;
			}
		}
		ny = ny - self._focusing_value;

		if(self._show_card){
			self._ctx.drawImage(
				self._card_img,
				nx, ny, self.w, self.h
			);
		}else{
			self._ctx.drawImage(
				self._img.img, 
				nx, ny, self.w, self.h
			);
		}

		self._ctx.rotate(-angle);
		self._ctx.translate(-self.x, -self.y);
		self._ctx.restore();
	};

	this.Update = function(delta){
		if(self._moving){
			if(self._delay > 0){
				self._delay -= delta;
				if(self._delay > 0){
					return;
				}
			}

			// console.debug('moving ');
			var x_complete = false;
			var y_complete = false;
			var angle_complete = false;
			var w_complete = false;
			var h_complete = false;

			//MOVE X
			var x_interpolation = Math.abs((self._tx - self.x) * self._speed);
			{
				if(self._tx > self.x){
					self.x = self.x + x_interpolation;
				}else{
					self.x = self.x - x_interpolation;
				}
				var gap = Math.abs(self._tx - self.x);
				if(gap < 0.1){
					self.x = self._tx;
					x_complete = true;
				}
			}

			//MOVE Y
			var y_interpolation = Math.abs((self._ty - self.y) * self._speed);
			{
				if(self._ty > self.y){
					self.y = self.y + y_interpolation;
				}else{
					self.y = self.y - y_interpolation;
				}
				var gap = Math.abs(self._ty - self.y);
				if(gap < 0.1){
					self.y = self._ty;
					y_complete = true;
				}
			}

			//Change Width
			if(self._target_width != self.w){
				self.w = self.w + 9;
				if(self.w > self._target_width){
					self.w > self._target_width;
				}
			}else{
				w_complete = true;
			}

			//Change Height
			if(self._target_height != self.h){
				self.h = self.h + 16;
				if(self.h > self._target_height){
					self.h > self._target_height;
				}
			}else{
				h_complete = true;
			}
			
			//CHANGE angle
			if(self._target_angle != self._angle){
				if(self._direction == 'right'){
					self._angle = self._angle + 10;
					if(self._angle > self._target_angle){
						self._angle = self._target_angle;
					}	
				}else{
					self._angle = self._angle - 10;
					if(self._angle < self._target_angle){
						self._angle = self._target_angle;
					}
				}
				if(self._angle > 360){
					self._angle -= 360;
				}
				if(self._angle < 0){
					self._angle += 360;
				}
			}

			// console.debug('target ' + self._target_angle + ' ' + self._angle);

			if(self._angle == self._target_angle){
				angle_complete = true;
			}

			//COMPLETE
			if(x_complete && y_complete && angle_complete && w_complete && h_complete){
				self._moving = false;
			}
		}
	};

	this.ShowCard = function(){
		self._show_card = true;
		self._tx = 200;
		self._ty = 400;
		self._target_width = self._target_width * 2;
		self._target_height = self._target_height * 2;
		self._target_angle = 0;
		self._moving = true;
	};
}