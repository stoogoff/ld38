
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");

	var Status = function(game, x, y, width, height, owner, stat, colour) {
		Phaser.TileSprite.call(this, game, x, y, width, height, "background-texture");

		game.add.existing(this);

		colour = colour || "rgba(255, 0, 0, 0.7)";

		this.owner = owner;
		this.stat = stat;
		this.maxValue = this.owner[this.stat];
		this.rectangle = new Phaser.Rectangle(x, y, width, height);
		this.fixedToCamera = true;

		var fill = game.add.bitmapData(width, height);

		fill.context.fillStyle = colour;
		fill.context.beginPath();
		fill.context.rect(0, 0, width, height);
		fill.context.fill();
		

		var outline = game.add.bitmapData(width, height);

		outline.context.beginPath();
		outline.context.rect(0, 0, width, height);
		outline.context.strokeStyle = "#222";
		outline.context.lineWidth = 3;
		outline.context.stroke();

		this.bar = game.add.sprite(x, y, fill);
		this.bar.fixedToCamera = true;

		this.border = game.add.sprite(x, y, outline);
		this.border.fixedToCamera = true;
	};

	inherits(Status, Phaser.TileSprite);

	Status.prototype.update = function() {
		var value = this.owner[this.stat] / this.maxValue;

		if(value < 0) {
			value = 0;
		}

		this.game.add.tween(this.bar.scale).to({ x: value }, 100).start();
	};

	return Status;
});