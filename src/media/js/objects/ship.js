
define(function(require) {
	var inherits = require("../utils/inherits");
	var Hittable = require("./hittable");

	var Ship = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, "ship");

		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.health = 10;
		this.anchor.set(0.5);
		this.body.drag.set(70);
		this.body.maxVelocity.set(200);
		this.body.collideWorldBounds = true;

		this.weapon = game.add.weapon(30, "bullet");
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 600;
		this.weapon.fireRate = 500;

		this.weapon.trackSprite(this, 0, 0, true);

		this.sfx = {
			thrust: this.game.add.audio("thrust"),
			shoot: this.game.add.audio("shoot")
		};

		this.sfx.thrust.volume = 0.2;
		this.sfx.shoot.volume = 0.2;

		//this.hittable = new Hittable(this, 1000);
	};

	inherits(Ship, Phaser.Sprite);

	Ship.prototype.thrust = function() {
		this.frame = 1;
		this.sfx.thrust.play();
	};

	Ship.prototype.stop = function() {
		this.frame = 0;
	};

	Ship.prototype.fire = function() {
		this.sfx.shoot.play();
		return this.weapon.fire();
	};

	Ship.prototype.hit = function() {
		//return this.hittable.hit();
		this.damage(1);

		return this.health <= 0;
	};

	return Ship;
});