/**
 * Created by Marlon on 16/10/2016.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.Preloader = function (game) {

};

// set scripts function prototype
BasicGame.Preloader.prototype = {

    init: function () {

    },

    preload: function () {
        this.load.image('space', 'static/webpage/assets/Backgrounds/darkPurple.png');
        this.load.image('bullet', 'static/webpage/assets/Lasers/laserBlue01.png');
        this.load.image('ship', 'static/webpage/assets/Ships/playerShip1_blue.png');
        this.load.image('button', 'static/webpage/assets/UI/buttonBlue.png');
        this.load.image('star', 'static/webpage/assets/Backgrounds/star2.png');
        this.load.image('miniship', 'static/webpage/assets/UI/playerLife1_blue.png');
        this.load.image('meteor_big4', 'static/webpage/assets/Meteors/meteorBrown_big4.png');
        this.load.spritesheet('ss_laser_blue_explosion',
            'static/webpage/assets/Animations/laser_blue_explosion.png', 48, 46);
        this.load.spritesheet('kaboom', 'static/webpage/assets/Animations/explode.png', 128, 128);
    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        //  We need arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

    },

    update: function(){
        this.state.start('Menu');
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the
        // game resizes. A resize could happen if for example swapping
        // orientation on a device or resizing the browser window. Note that
        // this callback is only really useful if you use a ScaleMode of RESIZE
        // and place it inside your main game state.

    }

};