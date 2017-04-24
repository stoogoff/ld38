
define(function(require) {
	// imports
	var Planet = require("../objects/planet");
	var Ship = require("../objects/ship");
	var Beast = require("../objects/beast");
	var Status = require("../objects/status");
	var constants = require("../utils/constants");
	var helpers = require("../utils/helpers");
	var Interval = require("../utils/interval");

	// private local vars
	var planets = [];
	var bullets = [];
	var sun, beast, player, cursors, fireButton, playerHealth, beastHealth, hud;
	var CENTRE = constants.GAME_SIZE / 2;
	var muteButtonPressed = true;
	var suppressThrustersTime = new Interval(500);
	var suppressingThrusters = false;
	var totalPlanets = 0;

	var GamePlay = function() {
		Phaser.State.call(this);
	};

	GamePlay.prototype.create = function() {
		this.game.stage.backgroundColor = "black";
		this.game.stage.background = this.game.add.image(0, 0, "background");

		this.game.world.setBounds(0, 0, constants.GAME_SIZE, constants.GAME_SIZE);

		// destroy any existing planets
		planets.forEach(function(p) {
			if(p) {
				p.destroy();
			}
		});

		planets = [];

		beast = new Beast(this.game, 0, CENTRE);
		sun = new Planet(this.game, CENTRE, CENTRE, 20, "sun");

		var total = helpers.random(4, 6);
		var x = CENTRE + 150;

		for(var i = 0; i < total; ++i) {
			x += helpers.random(50, 100) * i;
			x = helpers.clamp(x, CENTRE, constants.GAME_SIZE);

			planets.push(new Planet(this.game, x, CENTRE));
		}

		totalPlanets = planets.length;

		player = new Ship(this.game, CENTRE, CENTRE - 200);
	
		playerHealth = new Status(this, 10, 10, 150, 15, player, "health", "green", "Player");
		beastHealth = new Status(this, constants.SCREEN_WIDTH - 160, 10, 150, 15, beast, "health", "red", "World Eater");

		cursors = this.game.input.keyboard.createCursorKeys();
		fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

		hud = this.game.add.text(constants.SCREEN_WIDTH / 2, 40, planets.length + " planets to save", constants.STYLES.HUD);
		hud.fixedToCamera = true;
		hud.anchor.set(0.5, 0.5);
	};

	GamePlay.prototype.toggleAudio = function() {
		if(muteButtonPressed) {
			return;
		}

		if(this.game.music.isPlaying) {
			this.game.music.pause();
		}
		else {
			this.game.music.resume();
		}
	};

	GamePlay.prototype.collidePlanet = function(beast, planet) {
		beast.body.acceleration.set(0);

		if(planet.hit()) {
			// TODO add explosion
			planets = planets.filter(function(p) {
				return p.alive;
			});

			hud.text = planets.length + " planets to save";

			if(planets.length == 0) {
				this.game.state.start("gameover", true, false, "The World Eater has feasted well upon the " + totalPlanets + " of your star system. It is off to find food elsewhere.");
			}

		}
	};

	GamePlay.prototype.collidePlayer = function(player, obj) {
		if(player.hit()) {
			this.game.state.start("gameover", true, false, "The World Eater has destroyed the last defender and is now free to feast upon your star system.");
		}
		
		var rotation = Phaser.Point.angle(player, obj);

		this.game.physics.arcade.accelerationFromRotation(rotation, 500, player.body.acceleration);

		suppressThrustersTime.reset();
		suppressingThrusters = true;
	};

	GamePlay.prototype.collideBullet = function(beast, bullet) {
		bullet.destroy();

		if(beast.hit()) {
			this.game.state.start("gameover", true, false, "Well done! You have defeated the World Eater and saved " + (planets.length == totalPlanets ? " all " : "") + planets.length + " planets in your star system.");
		}
	}

	GamePlay.prototype.update = function(game) {
		// toggle audio
		if(this.game.input.keyboard.isDown(Phaser.KeyCode.M)) {
			this.toggleAudio();

			muteButtonPressed = true;
		}
		else {
			muteButtonPressed = false;
		}

		// planet orbits
		planets.forEach(function(p) {
			p.orbit(sun);
		}.bind(this));

		sun.rotation += sun.data.rotation;

		// beast movement
		target = beast.moveTowards(planets);

		this.game.physics.arcade.accelerateToObject(beast, target, beast.data.fast, beast.data.fast, beast.data.fast);

		// player controls
		if(!suppressingThrusters) {
			if(cursors.up.isDown) {
				game.physics.arcade.accelerationFromRotation(player.rotation, 300, player.body.acceleration);
				player.thrust();
			}
			else {
				player.body.acceleration.set(0);
				player.stop();
			}
		}

		if(cursors.left.isDown) {
			player.body.angularVelocity = -300;
		}
		else if(cursors.right.isDown) {
			player.body.angularVelocity = 300;
		}
		else {
			player.body.angularVelocity = 0;
		}

		if(fireButton.isDown) {
			player.fire();
		}

		if(suppressThrustersTime.next(this.game.time.elapsed)) {
			suppressingThrusters = false;
		}

		var bullets = [];

		player.weapon.forEach(function(b) {
			bullets.push(b);
		});

		this.game.physics.arcade.collide(beast, bullets, this.collideBullet.bind(this));
		this.game.physics.arcade.collide(beast, planets, this.collidePlanet.bind(this));
		this.game.physics.arcade.collide(player, beast, this.collidePlayer.bind(this));
		this.game.physics.arcade.collide(player, planets, this.collidePlayer.bind(this));

		// bullets and planets collide but only to destroy the bullet
		this.game.physics.arcade.collide(bullets, planets.concat(sun), function(bullet, obj) {
			bullet.destroy();
		});
	};

	GamePlay.prototype.render = function() {
		//this.grid.render();
		//this.target.render();
		//this.sequence.render();
		//this.overlay.render();
		//this.game.debug.spriteInfo(sun, 32, 32)
		if(target) {
			this.game.debug.text("target.x = " + target.x, 32, 100);
			this.game.debug.text("target.y = " + target.y, 32, 120);
			this.game.debug.text("target.health = " + target.health, 32, 140);
			this.game.debug.text("target.alive = " + target.alive, 32, 160);
		}
	};

	return GamePlay;
});
