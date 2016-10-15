/**
 * Created by marlon on 14/10/16.
 */
/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {

};

// set Game function prototype
BasicGame.Game.prototype = {

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
        this.load.image('space', 'static/webpage/assets/Backgrounds/purple.png');
        this.load.image('bullet', 'static/webpage/assets/Lasers/laserBlue01.png');
        this.load.image('ship', 'static/webpage/assets/Ships/playerShip1_blue.png');
    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        //  We need arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A spacey background
        this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

        //  Our ships bullets
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        this.bullets.createMultiple(40, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        this.sprite = this.add.sprite(300, 300, 'ship');
        this.sprite.anchor.set(0.5);

        //  and its physics settings
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(100);
        this.sprite.body.maxVelocity.set(200);

        //  Game input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    },

    update: function(){
        if (this.cursors.up.isDown)
        {
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 200, this.sprite.body.acceleration);
        }
        else
        {
            this.sprite.body.acceleration.set(0);
        }

        if (this.cursors.left.isDown)
        {
            this.sprite.body.angularVelocity = -300;
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.body.angularVelocity = 300;
        }
        else
        {
            this.sprite.body.angularVelocity = 0;
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.fireBullet();
        }

        this.screenWrap(this.sprite);

        this.bullets.forEachExists(this.screenWrap, this);
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the
        // game resizes. A resize could happen if for example swapping
        // orientation on a device or resizing the browser window. Note that
        // this callback is only really useful if you use a ScaleMode of RESIZE
        // and place it inside your main game state.

    },

    fireBullet: function () {

        if (this.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
                this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
                this.bullet.lifespan = 2000;
                this.bullet.rotation = this.sprite.rotation;
                this.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
                this.bulletTime = this.time.now + 50;
            }
        }
    },

    screenWrap: function(sprite) {

        if (sprite.x < 0)
        {
            sprite.x = this.game.width;
        }
        else if (sprite.x >  this.game.width)
        {
            sprite.x = 0;
        }
        if (sprite.y < 0)
        {
            sprite.y = this.game.height;
        }
        else if (sprite.y > this.game.height)
        {
            sprite.y = 0;
        }

    }

};