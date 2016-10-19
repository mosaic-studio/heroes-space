/**
 * Created by marlon on 14/10/16.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.Level01 = function (game) {

};

// set scripts function prototype
BasicGame.Level01.prototype = {

    init: function () {
        this.bulletTime = 0;
        this.bulletSpeed = 10;
        this.lives = 3;
        this.maxHealthShip = this.actualHealthShip = 100;
        this.actualPoints = 0;
        this.gun = new Phaser.Point();
    },

    preload: function () {

    },

    createMeteors: function () {
        //  Meteors
        this.meteors = this.add.group();
        this.meteors.enableBody = true;
        this.meteors.physicsBodyType = Phaser.Physics.P2JS;
        for(var i = 0; i < 50; i++){
            var m = this.meteors.create(this.world.randomX, this.world.randomY, 'meteor_big4');
            m.body.setCircle(60);
            m.body.setCollisionGroup(this.meteorCollisionGroup);
            m.body.collides([this.meteorCollisionGroup, this.playerCollisionGroup]);
            m.body.collides( this.bulletsCollisionGroup);
        }
    },

    createShip: function () {
        //  Our player ship
        this.ship = this.add.sprite(99, 75, 'ship');
        this.ship.smoothed = true;
        this.game.physics.p2.enable(this.ship, false);
        this.ship.body.setRectangle(80, 50);
        this.ship.body.setCollisionGroup(this.playerCollisionGroup);
        this.ship.body.collides(this.meteorCollisionGroup, this.shipHitMeteor, this);
        this.game.camera.follow(this.ship);
    },


    createBullets: function () {
        //  Our ships bullets
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.P2JS;

        //  All 50 of them
        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);


        this.bullets.forEach(function(bullet){
            bullet.body.setRectangle(50, 5);
            bullet.body.fixedRotation = true;
            bullet.body.setCollisionGroup(this.bulletsCollisionGroup);
            bullet.body.collides(this.meteorCollisionGroup, this.hit, this);
        }, this, false);

    },

    hit: function(bullet, meteor){
        meteor.sprite.kill();
    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;
        //  We need arcade physics
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.defaultRestitution = 0.8;

        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.meteorCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.bulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();

        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.game.physics.p2.updateBoundsCollisionGroup();

        this.game.world.setBounds(0, 0, 4000, 4000);

        //  A spacey background
        this.space = this.add.tileSprite(0, 0, 800, 800, 'space');
        this.space.fixedToCamera = true;

        this.createMeteors();

        this.createShip();

        this.createBullets();

        //  scripts input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.loadUI();

    },

    update: function(){
        // this.game.physics.arcade.collide(this.ship, this.meteors);

        if (this.cursors.up.isDown)
        {
            this.ship.body.thrust(400);
        }
        else if (this.cursors.down.isDown)
        {
            this.ship.body.reverse(400);
        }

        if (this.cursors.left.isDown)
        {
            this.ship.body.rotateLeft(100);
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.body.rotateRight(100);
        }
        else
        {
            this.ship.body.setZeroRotation();
        }

        if (!this.game.camera.atLimit.x)
        {
            this.space.tilePosition.x -= (this.ship.body.velocity.x * this.game.time.physicsElapsed);
        }

        if (!this.game.camera.atLimit.y)
        {
            this.space.tilePosition.y -= (this.ship.body.velocity.y * this.game.time.physicsElapsed);
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.fireBullet();
        }

        // this.screenWrap(this.ship);

        //this.bullets.forEachExists(this);
    },


    shipHitMeteor: function (ship, meteor) {
        this.actualHealthShip =- 1;
        this.myHealthBar.setPercent(this.actualHealthShip);
        //body2.removeFromWorld();
    },

    fireBullet: function () {

        if (this.time.now > this.bulletTime)
        {
            var nextBullet = this.bullets.getFirstExists(false);

            if (nextBullet)
            {
                this.gun.setTo(0, this.ship.height*-1);
                this.gun.rotate(1, 2, this.ship.rotation);
                nextBullet.reset(this.ship.body.x + this.gun.x, this.ship.body.y + this.gun.y);
                nextBullet.rotation = this.ship.rotation;
                // nextBullet.body.velocity.x = Math.cos(nextBullet.rotation) * this.bulletSpeed + this.ship.body.velocity.x;
                // nextBullet.body.velocity.y = Math.sin(nextBullet.rotation) * this.bulletSpeed + this.ship.body.velocity.y;
                nextBullet.body.velocity.x = this.gun.x * this.bulletSpeed;
                nextBullet.body.velocity.y = this.gun.y * this.bulletSpeed;
                nextBullet.lifespan = 2000;
                this.bulletTime = this.time.now + 50;
            }
        }
    },

    loadUI: function () {
        var barConfig = {width: 150, height: 25, x: 160, y: 22};
        this.myHealthBar = new HealthBar(this.game, barConfig);
        this.myHealthBar.setFixedToCamera(true);
        var miniship = this.add.sprite(10, 10, "miniship");
        miniship.fixedToCamera = true;
        this.txtLives = this.add.text(60, 25, "x"+this.lives, {
            font: "20px Arial",
            fill: "#fff"
        });
        this.txtLives.anchor.setTo(0.5);
        this.txtLives.fixedToCamera = true;
        this.txtPoints = this.add.text(this.game.width - 100, 25, ""+this.actualPoints, {
            font: "20px Arial",
            fill: "#fff"
        });
        this.txtPoints.anchor.setTo(0.5);
        this.txtPoints.fixedToCamera = true;
    },

    render: function() {

    }

};