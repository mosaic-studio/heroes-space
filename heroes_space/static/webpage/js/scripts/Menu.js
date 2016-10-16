/**
 * Created by Marlon on 16/10/2016.
 */
/* jshint browser:true */
// create BasicGame Class

// create scripts function in BasicGame
BasicGame.Menu = function (game) {

};

var titlescreen;

// set scripts function prototype
BasicGame.Menu.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        this.createButton(this.game, "Modo Campanha", this.game.world.centerX, this.game.world.centerY + 32, 300, 50, function () {
           this.state.start('Prologue');
        });
        this.createButton(this.game, "Multiplayer", this.game.world.centerX, this.game.world.centerY + 100, 300, 50, function () {
           // this.state.start('Multiplayer');
            console.log('Multiplayer');
        });
        titlescreen = this.add.sprite(this.game.world.centerX, this.game.world.centerY - 192, 'titlescreen');
        titlescreen.anchor.setTo(0.5, 0.5);

    },

    update: function(){

    },

    createButton: function (game, string, x, y, w, h, callback) {
        var button1 = game.add.button(x, y, 'button', callback, this, 2, 1, 0);
        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {
            font: '14px Arial',
            fill: '#000',
            align: 'center'
        });
        txt.anchor.setTo(0.5, 0.5);
    }

};