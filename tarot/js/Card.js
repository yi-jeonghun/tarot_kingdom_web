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
	this._rotating = false;

	this.MoveTo = function(x, y, delay){
		self._tx = x;
		self._ty = y;
		self._delay = delay;
		self._moving = true;
	};

	this.RotateTo = function(angle){
		self._target_angle = angle;
		self._moving = true;
	};

	this.SetImg = function(img){
		self._img = img;
	};

	this.Draw = function(){
		self._ctx.save();
		self._ctx.translate(self.x, self.y);

		var angle = self._angle * Math.PI / 180;
		self._ctx.rotate(angle);

		var nx = self.w/-2; 0;//self.x;// - (self.w/2);
		var ny = self.h * -1;//self.y;// - self.h;
		ny = ny - 20;

		self._ctx.drawImage(
			self._img.img, 
			nx, ny, self.w, self.h
		);

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

			//CHANGE angle
			if(self._target_angle != self._angle){
				self._angle = self._angle + 10;
				if(self._angle > self._target_angle){
					self._angle = self._target_angle;
				}
			}
			if(self._angle == self._target_angle){
				angle_complete = true;
			}

			//COMPLETE
			if(x_complete && y_complete && angle_complete){
				self._moving = false;
			}
		}
	};
}