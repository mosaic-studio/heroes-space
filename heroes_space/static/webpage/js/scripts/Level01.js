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
        this.bulletSpeed = 30;
        this.lives = 3;
        this.maxHealthShip = this.actualHealthShip = 100;
        this.actualPoints = 0;
        this.gun = new Phaser.Point();
        this.level_id = 2;
        this.base_velocity = 100;
        this.base_damage = 25;
        this.base_lifespan_shoot = 300;
    },

    preload: function () {

    },

    createMeteors: function () {
        //  Meteors
        this.meteors = this.game.add.group();
        this.meteors.enableBody = true;
        this.meteors.physicsBodyType = Phaser.Physics.P2JS;
        for(var i = 0; i < 50; i++){
            var m = this.meteors.create(this.world.randomX, this.world.randomY, 'meteor_big4');
            m.body.setCircle(60);
            m.body.setCollisionGroup(this.meteorCollisionGroup);
            m.body.collides([this.meteorCollisionGroup, this.playerCollisionGroup]);
            m.body.collides( this.bulletsCollisionGroup);
        }

        this.meteor_explosions = this.game.add.group();
        this.meteor_explosions.createMultiple(50, 'kaboom');
        this.meteor_explosions.forEach(this.createMeteorExplosions, this);
    },

    createShip: function () {
        //  Our player ship
        this.ship_data = this.game.state.states["EscolherHeroi"].ship_data;
        this.maxHealthShip = this.actualHealthShip = this.ship_data.vida;
        this.ship = this.game.add.sprite(99, 75, this.ship_data.classe);
        this.ship.smoothed = true;
        this.game.physics.p2.enable(this.ship, false);
        this.ship.body.setRectangle(80, 50);
        this.ship.body.setCollisionGroup(this.playerCollisionGroup);
        this.ship.body.collides(this.meteorCollisionGroup, this.shipHitMeteor, this);
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
            bullet.body.collides(this.meteorCollisionGroup, this.hit, this);
        }, this, false);
    },

    createExplosion: function (ship) {
        ship.anchor.x = 0.5;
        ship.anchor.y = 0.5;
        ship.animations.add('kaboom')
    },

    createMeteorExplosions: function (meteor) {
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
        this.meteorCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.bulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();

        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.game.physics.p2.updateBoundsCollisionGroup();

        this.game.world.setBounds(0, 0, 4000, 4000);

        //  A spacey background
        this.space = this.game.add.tileSprite(0, 0, 800, 800, 'space');
        this.space.fixedToCamera = true;

        this.createMeteors();

        this.createShip();

        this.createBullets();

        //  scripts input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.loadUI();
    },

    nextLevel: function () {
        var request = new XMLHttpRequest();
        var params = "heroi="+this.game.state.states["EscolherHeroi"].ship_data.heroi;
        request.open('POST', '/api/registrar_fase02/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(params);
        this.registrarPontuacao();
    },

    registrarPontuacao: function () {
        var request = new XMLHttpRequest();
        var heroi = this.game.state.states["EscolherHeroi"].ship_data.heroi;
        var params = "heroi="+heroi+"&missao="+this.level_id+"&pontos="+this.actualPoints;
        request.open('POST', '/api/registrar_pontuacao/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(params);
        this.state.start('Level02');
    },

    checkWin: function () {
        if(this.meteors.countLiving() === 0){
            this.stateText.text=" You Win \n Press C";
            this.stateText.visible = true;
            //the "click to restart" handler
            var key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            key2.onDown.addOnce(this.nextLevel, this);
        }
    },

    update: function(){
        if (this.ship.alive) {
            if (this.cursors.up.isDown) {
                this.ship.body.thrust(this.base_velocity * this.ship_data.agilidade);
            }
            else if (this.cursors.down.isDown) {
                this.ship.body.reverse(this.base_velocity * this.ship_data.agilidade);
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
            if(this.input.keyboard.isDown(Phaser.Keyboard.J)){
                this.nextLevel();
            }
            this.checkWin();
        }

        if (!this.game.camera.atLimit.x)
        {
            this.space.tilePosition.x -= (this.ship.body.velocity.x * this.game.time.physicsElapsed);
        }

        if (!this.game.camera.atLimit.y)
        {
            this.space.tilePosition.y -= (this.ship.body.velocity.y * this.game.time.physicsElapsed);
        }

        // this.screenWrap(this.ship);

        // this.bullets.forEachExists(this);
    },


    hit: function(bullet, meteor){
        meteor.ship.kill();
        bullet.ship.kill();
        var explosion = this.meteor_explosions.getFirstExists(false);
        explosion.reset(meteor.x, meteor.y);
        explosion.play('kaboom', 30, false, true);
        this.actualPoints += 1;
    },


    shipHitMeteor: function (ship, meteor) {
        meteor.ship.kill();
        var mExplosion = this.meteor_explosions.getFirstExists(false);
        mExplosion.reset(meteor.x, meteor.y);
        mExplosion.play('kaboom', 30, false, true);
        this.actualPoints -= 1;
        this.actualHealthShip = this.actualHealthShip - this.base_damage/this.ship_data.resistencia;
        var porcentagem = (this.actualHealthShip/this.maxHealthShip)*100;
        this.myHealthBar.setPercent(porcentagem);
        this.ship.body.setZeroVelocity();
        if(this.actualHealthShip <= 0){
            this.lives -= 1;
            this.ship.kill();
            var explosion = this.explosion.getFirstExists(false);
            explosion.reset(ship.x, ship.y);
            explosion.play('kaboom', 30, false, true);
            if(this.lives <= 0){
                this.meteors.callAll('kill');
                this.stateText.text=" GAME OVER \n Pressione R";
                this.stateText.visible = true;

                //the "click to restart" handler
                var key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
                key2.onDown.addOnce(this.restart, this);
                // this.game.input.onTap.addOnce(this.restart, this);
            }else{
                this.ship.revive();
                this.actualHealthShip = this.maxHealthShip;
                this.myHealthBar.setPercent(this.actualHealthShip);
            }
        }
        // body2.removeFromWorld();
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
                nextBullet.lifespan = this.base_lifespan_shoot * this.ship_data.poder_ataque;
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

        //  Text
        this.stateText = this.game.add.text(this.game.width/2, this.game.height/2,' ',
            { font: '84px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.fixedToCamera = true;
        this.stateText.visible = false;

    },

    render: function() {
        this.txtPoints.setText(""+this.actualPoints);
        this.txtLives.setText("x"+this.lives);
    },

    restart: function () {
        this.meteors.removeAll();
        this.createMeteors();
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