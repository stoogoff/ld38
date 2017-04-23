
define(function(require) {
	var Rect = require("../objects/rect");
	var constants = require("../utils/constants");
	var helpers = require("../utils/helpers");

	var PAD = 100;

	function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var lines = text.split("\n");

		for (var i = 0; i < lines.length; i++) {
			var words = lines[i].split(' ');
			var line = '';

			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					context.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
				}
				else {
					line = testLine;
				}
			}

			context.fillText(line, x, y);
			y += lineHeight;
		}

		return y;
	};

	var Overlay = function(game, onHide) {
		this.game = game;
		this.bounds = new Rect(PAD, PAD, constants.SCREEN_WIDTH - PAD * 2, constants.SCREEN_HEIGHT - PAD * 2, constants.OVERLAY_COLOUR);
		this.visible = false;
		this.text = "";

		this.onHide = onHide || function() {};
	};

	Overlay.prototype.hide = function() {
		this.visible = false;
		this.onHide();
	};

	Overlay.prototype.show = function(moves, levelPar) {
		this.visible = true;

		var text = "";

		if(moves == levelPar) {
			text = "Well done!\n\nYou completed that level with a perfect score!";
		}
		else if(moves > levelPar) {
			text = "Not bad!\n\nYou completed that level in " + moves + " moves, but it can be done in " + levelPar + ".";
		}
		else {
			text = "Whoa!\n\nYou completed that level in less moves than I thought possible. Well done.";
		}

		this.text = text;
	};

	Overlay.prototype.render = function() {
		if(!this.visible) {
			return;
		}

		var context = this.game.context;

		context.globalAlpha = 0.8;
		context.fillStyle = constants.OVERLAY_COLOUR;
		context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		context.globalAlpha = 1;

		context.font = constants.STYLES.HUD.font;
		context.fillStyle = constants.STYLES.HUD.fill;
		var y = wrapText(context, this.text, PAD * 2, PAD * 2, 360, 30);

		context.font = constants.STYLES.BODY.font;
		context.fillText("Click or tap anywhere to continue.", PAD * 2, y + 40);
	};

	return Overlay;
});