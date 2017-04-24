
define(function(require) {
	var constants = require("./constants");

	return {
		clamp: function(num, min, max) {
			if(num < min) {
				return min;
			}

			if(num > max) {
				return max;
			}

			return num;
		},

		range: function(length) {
			var range = [];

			for(var i = 0; i < length; ++i) {
				range.push(i);
			}

			return range;
		},

		random: function(min, max) {
			if (max == null) {
				max = min;
				min = 0;
			}
			return min + Math.floor(Math.random() * (max - min + 1));
		},

		shuffle: function(obj) {
			var length = obj.length;
			var shuffled = Array(length);

			for(var index = 0, rand; index < length; index++) {
				rand = this.random(0, index);
				if (rand !== index) shuffled[index] = shuffled[rand];
				shuffled[rand] = obj[index];
			}

			return shuffled;
		},

		guid: function() {
			function S4() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			}

			return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
		},

		// get a random point on the game world
		getRandomPoint: function(game, point, offset) {
			if(point) {
				return {
					x: game.math.clamp(game.rnd.integerInRange(point.x - offset, point.x + offset), 0, constants.GAME_WIDTH),
					y: game.math.clamp(game.rnd.integerInRange(point.y - offset, point.y + offset), 0, constants.GAME_HEIGHT)
				};
			}

			var offsetWidth = constants.WORLD_WIDTH / 8;
			var offsetHeight = constants.WORLD_HEIGHT / 8;

			return {
				x: game.rnd.integerInRange(offsetWidth, constants.WORLD_WIDTH - offsetWidth),
				y: game.rnd.integerInRange(offsetHeight, constants.WORLD_HEIGHT - offsetHeight),
			};
		},

		createSolid: function(game, width, height, colour) {
			var fill = game.add.bitmapData(width, height);

			fill.context.fillStyle = colour;
			fill.context.beginPath();
			fill.context.rect(0, 0, width, height);
			fill.context.fill();

			return fill;
		},

		createOutline: function(game, width, height, colour, stroke) {
			var outline = game.add.bitmapData(width, height);

			outline.context.beginPath();
			outline.context.rect(0, 0, width, height);
			outline.context.strokeStyle = colour;
			outline.context.lineWidth = stroke;
			outline.context.stroke();

			return outline;
		}
	};
});