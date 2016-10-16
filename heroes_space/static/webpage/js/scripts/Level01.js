/**
 * Created by marlon on 14/10/16.
 */
/* jshint browser:true */
// create BasicGame Class

// create scripts function in BasicGame
BasicGame.Level01 = function (game) {

};

// set scripts function prototype
BasicGame.Level01.prototype = {

    init: function () {
        this.bulletTime = 0;
    },

    preload: function () {

    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        //  We need arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.world.setBounds(0, 0, 1920, 1200);

        //  A spacey background
        this.add.sprite(0, 0, 'space');

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
        this.game.camera.follow(this.sprite);

        //  and its physics settings
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(100);
        this.sprite.body.maxVelocity.set(200);

        //  scripts input
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

        // this.screenWrap(this.sprite);

        // this.bullets.forEachExists(this.screenWrap, this);
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