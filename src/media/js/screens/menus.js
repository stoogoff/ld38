
define(function(require) {
	var constants = require("../utils/constants");
	var inherits = require("../utils/inherits");
	
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
		this.game.add.image(0, 0, "menu");
		
		this.titleText = this.game.add.text(this.game.world.centerX, 110, this.title, constants.STYLES.TITLE);
		this.titleText.anchor.setTo(0.5, 0);

		this.infoText = this.game.add.text(this.game.world.centerX, 220, this.messages.join("\n\n"), constants.STYLES.BODY);
		this.infoText.anchor.setTo(0.5, 0);
		this.infoText.wordWrap = true;
		this.infoText.wordWrapWidth = 400;
	};
	
	Menu.prototype.update = function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start("play");
		}
	};

	var Start = function() {
		Menu.call(this, "Small World Defender", ["Message...", "Click anywhere to start"]);
	};

	inherits(Start, Menu);

	var GameOver = function() {
		Menu.call(this, "Game Over!", ["You finished all the levels currently available.", "Your score: $", "Click anywhere to play again"]);
	};

	inherits(GameOver, Menu);

	GameOver.prototype.init = function(par) {
		this.messages[1] = this.messages[1].replace("$", par);
	};

	return {
		Start: Start,
		GameOver: GameOver
	};
});