
define(function(require) {
	var constants = require("../utils/constants");
	var inherits = require("../utils/inherits");

	var CENTRE = constants.SCREEN_WIDTH / 2;
	
	var Menu = function(title, messages) {
		this.title = title;
		this.messages = messages;

		Phaser.State.call(this);
	};

	inherits(Menu, Phaser.State);

	Menu.prototype.create = function() {
		if(!this.game.musicPlaying) {
			this.game.music = this.game.add.audio("theme", 1, true);
			this.game.music.play("", 0, 1, true);
			this.game.musicPlaying = true;
		}

		this.game.stage.backgroundColor = "black";
		this.game.add.image(0, 0, "background");
		
		this.titleText = this.game.add.text(CENTRE, 110, this.title, constants.STYLES.TITLE);
		this.titleText.anchor.setTo(0.5, 0);

		this.infoText = this.game.add.text(CENTRE, 220, this.messages.join("\n\n"), constants.STYLES.BODY);
		this.infoText.anchor.setTo(0.5, 0);
		this.infoText.wordWrap = true;
		this.infoText.wordWrapWidth = 600;
	};
	
	Menu.prototype.update = function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start("play");
		}
	};

	var Start = function() {
		Menu.call(this, "Small Worlds", [
			"The World Eater has entred your solar system and it... Is... HUNGRY!",
			"Up Arrow: Thrust",
			"Left and Right Arrow: Rotate",
			"Spacebar: Fire!",
			"Click anywhere to start"
		]);
	};

	inherits(Start, Menu);

	var GameOver = function() {
		Menu.call(this, "Game Over!", ["", "Click anywhere to play again"]);
	};

	inherits(GameOver, Menu);

	GameOver.prototype.init = function(message) {
		this.messages[0] = message;
	};

	return {
		Start: Start,
		GameOver: GameOver
	};
});