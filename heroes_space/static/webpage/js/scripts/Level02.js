/**
 * Created by Marlon on 20/10/2016.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.Level02 = function (game) {

};


livingEnemies = [];
bulletTimeEnemy = 0;

// set scripts function prototype
BasicGame.Level02.prototype = {

    init: function () {
        this.bulletTime = 0;
        this.bulletSpeed = 30;
        this.lives = 3;
        this.maxHealthShip = this.actualHealthShip = 100;
        this.actualPoints = 0;
        this.gun = new Phaser.Point();
        this.level_id = 3;
    },

    preload: function () {

    },

    createEnemies: function () {
        //  Meteors
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.P2JS;
        for(var i = 0; i < 50; i++){
            var m = this.enemies.create(this.world.randomX, this.world.randomY, 'enemy1');
            m.body.setRectangle(80, 50);
            m.body.setCollisionGroup(this.enemyCollisionGroup);
            m.body.collides([this.enemyCollisionGroup, this.playerCollisionGroup]);
            m.body.collides(this.bulletsCollisionGroup);
        }

        this.enemy_explosions = this.game.add.group();
        this.enemy_explosions.createMultiple(50, 'kaboom');
        this.enemy_explosions.forEach(this.createEnemyExplosions, this);
    },

    createShip: function () {
        //  Our player ship
        this.ship = this.game.add.sprite(99, 75, 'ship');
        this.ship.smoothed = true;
        this.game.physics.p2.enable(this.ship, false);
        this.ship.body.setRectangle(80, 50);
        this.ship.body.setCollisionGroup(this.playerCollisionGroup);
        this.ship.body.collides(this.enemyCollisionGroup, this.shipHitEnemy, this);
        // this.ship.body.collides(this.enemyBulletsCollisionGroup);
        this.game.camera.follow(this.ship);

        this.explosion = this.game.add.group();
        this.explosion.createMultiple(50, 'kaboom');
        this.explosion.forEach(this.createExplosion, this);
    },


    createBullets: function () {
        //  Our ships bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.P2JS;

        //  All 50 of them
        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('outOfCameraBoundsKill', true);

        this.bullets.forEach(function(bullet){
            bullet.body.setRectangle(50, 5);
            bullet.body.checkWorldBounds = true;
            bullet.body.outOfBoundsKill = true;
            bullet.body.collideWorldBounds = false;
            bullet.body.fixedRotation = true;
            bullet.body.setCollisionGroup(this.bulletsCollisionGroup);
            bullet.body.collides(this.enemyCollisionGroup, this.hitEnemy, this);
        }, this, false);
    },

    createEnemyBullets: function () {
        this.enemyBullets = this.game.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.P2JS;

        this.enemyBullets.createMultiple(50, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 0.5);
        this.enemyBullets.setAll('checkWorldBounds', true);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('outOfCameraBoundsKill', true);

        this.bullets.forEach(function(bullet){
            bullet.body.setRectangle(50, 5);
            bullet.body.checkWorldBounds = true;
            bullet.body.outOfBoundsKill = true;
            bullet.body.collideWorldBounds = false;
            bullet.body.fixedRotation = true;
            bullet.body.setCollisionGroup(this.enemyBulletsCollisionGroup);
            bullet.body.collides(this.playerCollisionGroup, this.hitPlayer, this);
        }, this, false);

    },

    createExplosion: function (ship) {
        ship.anchor.x = 0.5;
        ship.anchor.y = 0.5;
        ship.animations.add('kaboom')
    },

    createEnemyExplosions: function (meteor) {
        meteor.anchor.x = 0.5;
        meteor.anchor.y = 0.5;
        meteor.animations.add('kaboom');
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
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.bulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyBulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();

        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.game.physics.p2.updateBoundsCollisionGroup();

        this.game.world.setBounds(0, 0, 4000, 4000);

        //  A spacey background
        this.space = this.game.add.tileSprite(0, 0, 800, 800, 'space');
        this.space.fixedToCamera = true;

        this.createEnemies();

        this.createShip();

        this.createBullets();
        // this.createEnemyBullets();

        //  scripts input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.loadUI();
    },

    update: function(){
        this.enemies.forEachAlive(this.moveEnemies,this);
        if (this.ship.alive) {
            if (this.cursors.up.isDown) {
                this.ship.body.thrust(400);
            }
            else if (this.cursors.down.isDown) {
                this.ship.body.reverse(400);
            }

            if (this.cursors.left.isDown) {
                this.ship.body.rotateLeft(100);
            }
            else if (this.cursors.right.isDown) {
                this.ship.body.rotateRight(100);
            }
            else {
                this.ship.body.setZeroRotation();
            }
            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.fireBullet();
            }

            this.checkWin();

            /* if (this.game.time.now > bulletTimeEnemy)
            {
                this.enemyFireBullet();
            }*/
        }

        if (!this.game.camera.atLimit.x)
        {
            this.space.tilePosition.x -= (this.ship.body.velocity.x * this.game.time.physicsElapsed);
        }

        if (!this.game.camera.atLimit.y)
        {
            this.space.tilePosition.y -= (this.ship.body.velocity.y * this.game.time.physicsElapsed);
        }

    },

    checkWin: function () {
        if(this.enemies.countLiving() === 0){
            this.stateText.text=" You Win";
            this.stateText.visible = true;
        }
    },



    moveEnemies: function (enemy) {
        this.accelerateToObject(enemy,this.ship,this.game.rnd.integerInRange(30, 100));
    },

    accelerateToObject: function(obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + this.game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
        obj1.body.force.y = Math.sin(angle) * speed;
    },

    hitEnemy: function(bullet, enemy){
        enemy.ship.kill();
        bullet.ship.kill();
        var explosion = this.enemy_explosions.getFirstExists(false);
        explosion.reset(enemy.x, enemy.y);
        explosion.play('kaboom', 30, false, true);
        this.actualPoints += 1;
    },

    hitPlayer: function(bullet, ship){
        bullet.ship.kill();
        this.checkHealth(ship, 10);
        // var explosion = this.enemy_explosions.getFirstExists(false);
        // explosion.reset(ship.x, ship.y);
        // explosion.play('kaboom', 30, false, true);
        // this.actualPoints += 1;
    },


    checkHealth: function (ship, damage) {
        this.actualHealthShip -= damage;
        this.myHealthBar.setPercent(this.actualHealthShip);
        this.ship.body.setZeroVelocity();
        if (this.actualHealthShip === 0) {
            this.lives -= 1;
            this.ship.kill();
            var explosion = this.explosion.getFirstExists(false);
            explosion.reset(ship.x, ship.y);
            explosion.play('kaboom', 30, false, true);
            if (this.lives <= 0) {
                this.enemies.callAll('kill');
                this.stateText.text = " GAME OVER \n Pressione R";
                this.stateText.visible = true;

                //the "click to restart" handler
                var key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
                key2.onDown.addOnce(this.restart, this);
                // this.game.input.onTap.addOnce(this.restart, this);
            } else {
                this.ship.revive();
                this.actualHealthShip = this.maxHealthShip;
                this.myHealthBar.setPercent(this.actualHealthShip);
            }
        }
    },

    shipHitEnemy: function (ship, enemy) {
        enemy.ship.kill();
        var mExplosion = this.enemy_explosions.getFirstExists(false);
        mExplosion.reset(enemy.x, enemy.y);
        mExplosion.play('kaboom', 30, false, true);
        this.actualPoints += 1;
        this.checkHealth(ship, 25);
        // body2.removeFromWorld();
    },

    enemyFireBullet: function () {
        var nextBullet = this.enemyBullets.getFirstExists(false);
        this.enemies.forEachAlive(function (enemy) {
            livingEnemies.push(enemy)
        });
        if(nextBullet && livingEnemies.length > 0){
            var random = this.game.rnd.integerInRange(0, livingEnemies.length-1);
            var enemy = livingEnemies[random];
            var gun = new Phaser.Point();
            gun.setTo(0, (enemy.height-40)*-1);
            gun.rotate(1, 2, enemy.rotation);
            nextBullet.reset(enemy.body.x + gun.x, enemy.body.y + gun.y);
            nextBullet.rotation = enemy.rotation;

            nextBullet.body.velocity.x = gun.x * this.bulletSpeed + enemy.body.velocity.x;
            nextBullet.body.velocity.y = gun.y * this.bulletSpeed + enemy.body.velocity.y;
            nextBullet.lifespan = 500;
            bulletTimeEnemy = this.game.time.now + 1000;
        }

    },

    fireBullet: function () {
        if (this.time.now > this.bulletTime)
        {
            var nextBullet = this.bullets.getFirstExists(false);
            if (nextBullet)
            {
                this.gun.setTo(0, (this.ship.height-40)*-1);
                this.gun.rotate(1, 2, this.ship.rotation);
                nextBullet.reset(this.ship.body.x + this.gun.x, this.ship.body.y + this.gun.y);
                nextBullet.rotation = this.ship.rotation;

                nextBullet.body.velocity.x = this.gun.x * this.bulletSpeed + this.ship.body.velocity.x;
                nextBullet.body.velocity.y = this.gun.y * this.bulletSpeed + this.ship.body.velocity.y;
                nextBullet.lifespan = 1000;
                this.bulletTime = this.time.now + 50;
            }
        }
    },

    loadUI: function () {
        var barConfig = {width: 150, height: 25, x: 160, y: 22};
        this.myHealthBar = new HealthBar(this.game, barConfig);
        this.myHealthBar.setFixedToCamera(true);
        var miniship = this.game.add.sprite(10, 10, "miniship");
        miniship.fixedToCamera = true;
        this.txtLives = this.game.add.text(60, 25, "x"+this.lives, {
            font: "20px Arial",
            fill: "#fff"
        });
        this.txtLives.anchor.setTo(0.5);
        this.txtLives.fixedToCamera = true;
        this.txtPoints = this.game.add.text(this.game.width - 100, 25, ""+this.actualPoints, {
            font: "20px Arial",
            fill: "#fff"
        });

        this.txtPoints.anchor.setTo(0.5);
        this.txtPoints.fixedToCamera = true;

        this.txtEnemyRemaining = this.game.add.text(this.game.width - 300, 25,
            "Inimigos restantes: "+this.enemies.countLiving(), {
            font: "20px Arial",
            fill: "#fff"
        });

        this.txtEnemyRemaining.anchor.setTo(0.5);
        this.txtEnemyRemaining.fixedToCamera = true;

        //  Text
        this.stateText = this.game.add.text(this.game.width/2, this.game.height/2,' ',
            { font: '84px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.fixedToCamera = true;
        this.stateText.visible = false;

    },

    render: function() {
        this.txtPoints.setText(""+this.actualPoints);
        this.txtEnemyRemaining.setText("Inimigos restantes: "+this.enemies.countLiving());
        this.txtLives.setText("x"+this.lives);
    },

    restart: function () {
        this.enemies.removeAll();
        this.createEnemies();
        this.bullets.removeAll();
        this.createEnemyBullets();
        this.ship.revive();
        this.actualPoints = 0;
        this.lives = 3;
        this.bullets.removeAll();
        this.createBullets();
        this.actualHealthShip = this.maxHealthShip;
        this.myHealthBar.setPercent(this.actualHealthShip);
        this.stateText.visible = false;
    }

};