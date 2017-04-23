
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");

	var Beast = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, "beast");

		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 0.5);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;

		this.data = {};
		this.data.range = 250;
		this.data.target = null;
		this.data.slow = 15;
		this.data.fast = 60;

		this.health = 10;
	};

	inherits(Beast, Phaser.Sprite);

	// beast will go for nearest planet
	// if no planet within its range it goes for the sun

	Beast.prototype.moveTowards = function(planets, sun) {
		var closest = planets.map(function(m) {
			return {
				x: m.x,
				y: m.y,
				d: Phaser.Point.distance(m, this)
			};
		}.bind(this)).filter(function(f) {
			return f.d <= this.data.range;
		}.bind(this)).sort(function(a, b) {
			return a.d == b.d ? 0 : (a.d < b.d ? 1: -1)
		});

		if(closest.length) {
			this.data.target = closest[0];
		}

		return null;
	};

	Beast.prototype.hit = function() {
		this.damage(1);

		return this.health <= 0;
	};

	return Beast;
});