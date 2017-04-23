
define(function(require) {
	// imports
	var Planet = require("../objects/planet");
	var Ship = require("../objects/ship");
	var Beast = require("../objects/beast");
	var Status = require("../objects/status");
	var constants = require("../utils/constants");

	// private local vars
	var planets = [];
	var bullets = [];
	var sun, beast, player, cursors, fireButton, playerHealth, beastHealth;
	var centre = constants.GAME_SIZE / 2;
	var destroyed = 0;

	var GamePlay = function() {
		Phaser.State.call(this);
	};

	GamePlay.prototype.create = function() {
		this.game.world.setBounds(0, 0, constants.GAME_SIZE, constants.GAME_SIZE);

		sun = new Planet(this.game, centre, centre, 2, null, 20);

		planets.push(new Planet(this.game, centre + 200, centre, 0.3));
		planets.push(new Planet(this.game, centre + 400, centre, 0.7, 0.0009, 1));

		beast = new Beast(this.game, centre, centre - 600);
		player = new Ship(this.game, centre, centre - 200);
	
		playerHealth = new Status(this, 10, 10, 150, 15, player, "health");
		beastHealth = new Status(this, constants.SCREEN_WIDTH - 160, 10, 150, 15, beast, "health");

		cursors = this.game.input.keyboard.createCursorKeys();
		fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	};

	GamePlay.prototype.toggleAudio = function() {
		/*if(this.game.music.isPlaying) {
			this.muteText.text = "Music: Off";
			this.game.music.stop();
		}
		else {
			this.muteText.text = "Music: On";
			this.game.music.play();
		}*/
	};

	GamePlay.prototype.collidePlanet = function(beast, planet) {
		console.log("hit planet")
		// TODO timeout on planet hit so it doesn't activate every frame

		if(planet.hit()) {
			// TODO add explosion
			
			if(++destroyed >= planets.length + 1) {
				alert("PLANETS EATEN")
			}

		}
	};

	GamePlay.prototype.collidePlayer = function(beast, player) {
		console.log("hit player")

		if(player.hit()) {
			alert("SHIP DESTROYED")
		}
	};

	GamePlay.prototype.collideBullet = function(beast, bullet) {
		console.log("hit beast")

		bullet.destroy();

		if(beast.hit()) {
			alert("BEAST DESTROYED")
		}
	}

	GamePlay.prototype.update = function(game) {
		/*player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.body.angularVelocity = 0;

		if(cursors.left.isDown) {
			player.body.angularVelocity = -200;
		}
		else if(cursors.right.isDown) {
			player.body.angularVelocity = 200;
		}

		if(cursors.up.isDown) {
			player.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(player.angle, 300));
		}*/


		// planet orbits
		planets.forEach(function(p) {
			p.orbit(sun);
		}.bind(this));

		// beast movement
		var target = beast.moveTowards(planets);
		var speed = beast.data.fast;

		if(!target) {
			target = sun;
			speed = beast.data.slow;
		}

		this.game.physics.arcade.accelerateToObject(beast, target, speed, 100, 100);

		// player controls
		if(cursors.up.isDown) {
			game.physics.arcade.accelerationFromRotation(player.rotation, 300, player.body.acceleration);
		}
		else {
			player.body.acceleration.set(0);
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

		// TODO collision between ship and planet - ship should be damaged
		// TODO collision between ship and beast - ship should be damaged

		var bullets = [];

		player.weapon.forEach(function(b) {
			bullets.push(b);
		});

		this.game.physics.arcade.collide(beast, bullets, this.collideBullet);
		this.game.physics.arcade.collide(beast, planets, this.collidePlanet);
		this.game.physics.arcade.collide(beast, sun, this.collidePlanet);
		this.game.physics.arcade.collide(beast, player, this.collidePlayer);
	};

	GamePlay.prototype.render = function() {
		//this.grid.render();
		//this.target.render();
		//this.sequence.render();
		//this.overlay.render();
		/*this.game.debug.spriteInfo(sun, 32, 32)
		this.game.debug.text("sun.x = " + sun.x + "; sun.y = " + sun.y, 32, 128)

		planets.forEach(function(p) {
			this.game.debug.spriteInfo(p, 32, 160)
			this.game.debug.text("p.x = " + p.x, 32, 250);
			this.game.debug.text("p.y = " + p.y, 32, 270);
		}.bind(this));*/

		var circle = new Phaser.Circle(beast.x, beast.y, beast.data.range * 2);

		this.game.debug.geom(circle, 'rgba(255,0,0,0.3)');
	};

	return GamePlay;
});
