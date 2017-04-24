
define(function(require) {
	var Interval = require("../utils/interval");

	var Hittable = function(owner, hitTime) {
		this.interval = null;
		this.owner = owner;
		this.hitTime = hitTime;
	};

	Hittable.prototype.hit = function() {
		var hit = false;

		if(this.interval == null) {
			hit = true;
			this.interval = new Interval(this.hitTime);
		}
		else if(this.interval.next(this.owner.game.time.elapsed)) {
			hit = true;
		}

		if(hit) {
			this.owner.damage(1);
		}

		return this.owner.health <= 0;
	};

	return Hittable;
});