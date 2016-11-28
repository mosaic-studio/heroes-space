/**
 * Created by marlon on 26/11/16.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.Ranking = function (game) {

};

// set scripts function prototype
BasicGame.Ranking.prototype = {

    init: function () {

    },

    preload: function () {

    },

    create: function () {
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;
        this.loadInterface();
        this.createButton(this.game, "Voltar", this.game.world.centerX, this.game.world.height - 50, 300, 50, function () {
            this.state.start('Menu');
        });
    },

    loadInterface: function () {
        this.title = this.game.add.text(this.game.world.centerX, 50, 'Ranking',
            { font: '84px Arial', fill: '#fff' });
        this.title.anchor.setTo(0.5, 0.5);
        this.carregarRanking();
    },

    carregarRanking: function () {
        var me = this;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                me.ranking = JSON.parse(this.responseText);
                var space = 100;
                for (var i=0; i < me.ranking.data.length; i++){
                    me.game.add.text(200, space, me.ranking["data"][i]["nome"], { font: '20px Arial', fill: '#fff' });
                    me.game.add.text(me.game.width-200, space, me.ranking["data"][i]["pontuacao"], { font: '20px Arial',
                        fill: '#fff' });
                    space += 20;
                }
            }
        };
        request.open('GET', '/api/ranking/', true);
        request.send(null);
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
    },

    update: function(){

    }

};