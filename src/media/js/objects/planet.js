
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var helpers = require("../utils/helpers");
	var Hittable = require("./hittable");

	var frames = makeFrames();

	function makeFrames() {
		return helpers.shuffle(helpers.range(12));
	}

	function nextFrame() {
		if(frames.length == 0) {
			frames = makeFrames();
		}

		var item = frames.pop();

		return item;
	}

	var Planet = function(game, x, y, health, key) {
		if(!key) {
			key = "planet";
		}

		Phaser.Sprite.call(this, game, x, y, key);

		if(key == "planet") {
			this.frame = nextFrame();

			// randomly scale
			var scale = Math.random() + 0.5;

			this.width = 32 * scale;
			this.height = 32 * scale;
		}
		else {
			this.height = this.width = 128;
		}

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 0.5);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;
		this.body.friction.x = 0;

		this.health = health || helpers.random(1, 3);

		this.data = {};

		this.data.radius = x;
		this.data.velocity = Math.random() * 0.001;
		this.data.rotation = (Math.random() - 1) * 0.01;

		if(this.data.velocity == 0) {
			this.data.velocity = 0.001;
		}

		if(this.data.rotation == 0) {
			this.data.rotation = 0.1;
		}

		this.hittable = new Hittable(this, 300);
	};

	inherits(Planet, Phaser.Sprite);

	Planet.prototype.orbit = function(body) {
		if(!this.alive) {
			return;
		}

		var radius = this.data.radius - body.x;
		var period = this.game.time.now * this.data.velocity;

		this.x = body.x + Math.cos(period) * radius;
		this.y = body.y + Math.sin(period) * radius;

		this.rotation += this.data.rotation;
	};

	Planet.prototype.hit = function() {
		return this.hittable.hit();
	}

	return Planet;
});