
define(function(require) {
	var Preload = function() {
		Phaser.State.call(this);
	};

	Preload.prototype.preload = function() {
		//var bg = ["background", "menu", "mute"];
		var bg = ["bullet", "ship", "planet", "beast", "background-texture"];

		bg.forEach(function(key) {
			this.load.image(key, "media/img/" + key + ".png");

		}.bind(this));

		/*this.load.spritesheet("retry", "media/img/retry.png", 180, 40);
		this.load.audio("theme", ["media/audio/music.mp3", "media/audio/music.ogg"]);

		var sfx = ["activate", "badlink", "completelevel", "deactivate", "goodlink"];

		sfx.forEach(function(key) {
			this.load.audio(key, ["media/audio/" + key + ".wav"]);
		}.bind(this));*/
	};

	Preload.prototype.create = function() {
		//this.game.state.start("start");
		this.game.state.start("play");
	};

	return Preload;
});