/**
 * Created by marlon on 26/11/16.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.EscolherHeroi = function (game) {

};

// set scripts function prototype
BasicGame.EscolherHeroi.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        this.createButton(this.game, "Hybrid", 100, this.game.world.centerY, 99, 75, function () {
            this.criarHeroi("Hybrid");
        });
        this.createButton(this.game, "Faster", this.game.world.centerX, this.game.world.centerY, 99, 75, function () {
            this.criarHeroi("Faster");
        });

        this.createButton(this.game, "Tank", 700, this.game.world.centerY, 99, 75, function () {
            this.criarHeroi("Tank");
        });

        this.createButton2(this.game, "Voltar", this.game.world.centerX, this.game.world.height - 50, 300, 50, function () {
            this.state.start('Menu');
        });

    },

    update: function(){

    },

    criarHeroi: function (nome_classe) {
        var request = new XMLHttpRequest();
        var params = "classe="+nome_classe;
        request.open('POST', '/api/criar_heroi/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(params);
        var me = this;

        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                me.ship_data = myArr;
                me.startPrologue(myArr);
            }
        };
    },

    startPrologue: function (heroi) {
        var request = new XMLHttpRequest();
        self.heroi = heroi;
        var params = "heroi="+heroi.heroi;
        request.open('POST', '/api/iniciar_nova_campanha/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(params);
        var me = this;
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                me.state.start('Prologue');
            }
        };
    },

    createButton: function (game, string, x, y, w, h, callback) {
        var button1 = game.add.button(x, y, string, callback, this, 2, 1, 0);
        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y + 50, string, {
            font: '14px Arial',
            fill: '#FFF',
            align: 'center'
        });
        txt.anchor.setTo(0.5, 0.5);
    },

    createButton2: function (game, string, x, y, w, h, callback) {
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