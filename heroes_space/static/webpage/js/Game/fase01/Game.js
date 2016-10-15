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
        // set up input max pointers
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
        this.scale.refresh();

    },

    preload: function () {
        this.load.image('space', 'assets/skies/deep-space.jpg');
        this.load.image('bullet', 'assets/games/asteroids/bullets.png');
        this.load.image('ship', 'assets/games/asteroids/ship.png');
    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.renderer.clearBeforeRender = false;
        this.renderer.roundPixels = true;

        //  We need arcade physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //  A spacey background
        this.add.tileSprite(0, 0, this.width, this.height, 'space');

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
        this.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(100);
        this.sprite.body.maxVelocity.set(200);

        //  Game input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.bulletTime = 0;

    },

    update: function(){
        if (this.cursors.up.isDown)
        {
            this.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
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

        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
                bullet.lifespan = 2000;
                bullet.rotation = sprite.rotation;
                game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
                bulletTime = game.time.now + 50;
            }
        }

    },

    screenWrap: function(sprite) {

        if (sprite.x < 0)
        {
            sprite.x = game.width;
        }
        else if (sprite.x > game.width)
        {
            sprite.x = 0;
        }

        if (sprite.y < 0)
        {
            sprite.y = game.height;
        }
        else if (sprite.y > game.height)
        {
            sprite.y = 0;
        }

    },

};