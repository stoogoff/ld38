
define(function(require) {
	var inherits = require("../utils/inherits");

	var Ship = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, "ship");

		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.set(0.5);
		this.body.drag.set(70);
		this.body.maxVelocity.set(200);
		this.body.collideWorldBounds = true;

		this.weapon = game.add.weapon(30, "bullet");
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 600;
		this.weapon.fireRate = 500;

		this.weapon.trackSprite(this, 0, 0, true);
	};

	inherits(Ship, Phaser.Sprite);

	Ship.prototype.fire = function() {
		return this.weapon.fire();
	};

	Ship.prototype.hit = function() {
		this.damage(1);

		return this.health <= 0;
	};

	return Ship;
});