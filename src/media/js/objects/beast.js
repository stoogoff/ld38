
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var Interval = require("../utils/interval");

	var trackingPlanet = new Interval(10000);

	var Beast = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, "beasty");

		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 0.5);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;

		this.data = {};
		this.data.target = null;
		this.data.slow = 15;
		this.data.fast = 500;

		this.health = 10;

		this.animations.add("run");
		this.animations.play("run", 5, true);

		this.height = this.width = 80;
	};

	inherits(Beast, Phaser.Sprite);

	// beast will go for nearest planet
	// if no planet within its range it goes for the sun

	Beast.prototype.moveTowards = function(planets, sun) {
		if(this.data.target && this.data.target.alive) {
			if(!trackingPlanet.next(this.game.time.elapsed)) {
				return this.data.target;
			}
		}

		trackingPlanet.reset();

		this.data.target = null;


		var closest = planets.map(function(m) {
			return {
				sprite: m,
				d: Phaser.Point.distance(m, this)
			};
		}.bind(this)).sort(function(a, b) {
			return a.d == b.d ? 0 : (a.d < b.d ? -1 : 1)
		});

		this.data.target = closest[0].sprite;

		return this.data.target;
	};

	Beast.prototype.hit = function() {
		this.damage(1);

		return this.health <= 0;
	};

	return Beast;
});