/**
 * Created by Marlon on 16/10/2016.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.Template = function (game) {

};

// set scripts function prototype
BasicGame.Template.prototype = {

    init: function () {
        /*// set up input max pointers
         this.input.maxPointers = 1;
         // set up stage disable visibility change
         this.stage.disableVisibilityChange = true;
         // Set up the scaling method used by the ScaleManager
         // Valid values for scaleMode are:
         // * EXACT_FIT
         // * NO_SCALE
         // * SHOW_ALL
         // * RESIZE
         // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
         this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         // If you wish to align your game in the middle of the page then you can
         // set this value to true. It will place a re-calculated margin-left
         // pixel value onto the canvas element which is updated on orientation /
         // resizing events. It doesn't care about any other DOM element that may
         // be on the page, it literally just sets the margin.
         this.scale.pageAlignHorizontally = true;
         this.scale.pageAlignVertically = true;
         // Force the orientation in landscape or portrait.
         // * Set first to true to force landscape.
         // * Set second to true to force portrait.
         this.scale.forceOrientation(false, true);
         // Sets the callback that will be called when the window resize event
         // occurs, or if set the parent container changes dimensions. Use this
         // to handle responsive game layout options. Note that the callback will
         // only be called if the ScaleManager.scaleMode is set to RESIZE.
         this.scale.setResizeCallback(this.gameResized, this);
         // Set screen size automatically based on the scaleMode. This is only
         // needed if ScaleMode is not set to RESIZE.
         this.scale.updateLayout(true);
         // Re-calculate scale mode and update screen size. This only applies if
         // ScaleMode is not set to RESIZE.
         this.scale.refresh();*/
        this.bulletTime = 0;
    },

    preload: function () {
        this.load.image('space', 'static/webpage/assets/Backgrounds/remember-me.jpg');
        this.load.image('bullet', 'static/webpage/assets/Lasers/laserBlue01.png');
        this.load.image('ship', 'static/webpage/assets/Ships/playerShip1_blue.png');
    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        //  We need arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

    },

    update: function(){

    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the
        // game resizes. A resize could happen if for example swapping
        // orientation on a device or resizing the browser window. Note that
        // this callback is only really useful if you use a ScaleMode of RESIZE
        // and place it inside your main game state.

    }

};