
"use strict";

define(function(require) {
	var constants = require("./utils/constants");
	var menus = require("./screens/menus");

	// Phaser is going to be global
	var game = new Phaser.Game(constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT, Phaser.CANVAS, "game");

	// Game States
	game.state.add("preload", require("./screens/preload"));
	game.state.add("start", menus.Start);
	game.state.add("gameover", menus.GameOver);
	game.state.add("play", require("./screens/game-play"));

	game.state.start("preload");
});