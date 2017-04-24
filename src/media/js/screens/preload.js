
define(function(require) {
	var Preload = function() {
		Phaser.State.call(this);
	};

	Preload.prototype.preload = function() {
		//var bg = ["background", "menu", "mute"];
		var bg = ["background", "bullet", "sun", "background-texture", "radar"];

		bg.forEach(function(key) {
			this.load.image(key, "media/img/" + key + ".png");

		}.bind(this));

		this.load.spritesheet("beasty", "media/img/beasty.png", 60, 60, 8);
		this.load.spritesheet("ship", "media/img/ship.png", 32, 20);
		this.load.spritesheet("planet", "media/img/planets.png", 32, 32);


		this.load.audio("theme", ["media/audio/small-worlds.mp3", "media/audio/small-worlds.ogg"]);
	
		var sfx = ["chomp", "shoot", "thrust"];

		sfx.forEach(function(key) {
			this.load.audio(key, ["media/audio/" + key + ".wav"]);
		}.bind(this));
	};

	Preload.prototype.create = function() {
		this.game.state.start("start");
	};

	return Preload;
});