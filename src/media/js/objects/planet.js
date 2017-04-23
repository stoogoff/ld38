
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");

	var Planet = function(game, x, y, scale, velocity, health) {
		Phaser.Sprite.call(this, game, x, y, "planet");

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 0.5);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;
		this.body.friction.x = 0;

		this.health = health || 10;

		if(scale) {
			this.width = 128 * scale;
			this.height = 128 * scale;
		}

		this.data = {};

		this.data.radius = x;
		this.data.velocity = velocity || 0.001;

	};

	inherits(Planet, Phaser.Sprite);

	Planet.prototype.orbit = function(body) {
		var radius = this.data.radius - body.x;
		var period = this.game.time.now * this.data.velocity;

		this.x = body.x + Math.cos(period) * radius;
		this.y = body.y + Math.sin(period) * radius;
	};

	Planet.prototype.hit = function() {
		this.damage(1);

		return this.health <= 0;
	}

	return Planet;
});