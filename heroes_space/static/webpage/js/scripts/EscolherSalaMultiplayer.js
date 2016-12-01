/**
 * Created by marlon on 26/11/16.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.EscolherSalaMultiplayer = function (game) {

};

// set scripts function prototype
BasicGame.EscolherSalaMultiplayer.prototype = {

    init: function () {
        // this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
        // this.game.kineticScrolling.configure({
        //    horizontalScroll:true,
        //    verticalScroll: true
        // });
    },

    preload: function () {

    },

    create: function () {
        /*
         //Starts the plugin
         this.game.kineticScrolling.start();

         this.rectangles = [];

         var initY = 50;

         for (var i = 0; i < 26; i++) {
         this.rectangles.push(this.createRectangle(100, initY, 400, 100));
         this.index = this.game.add.text(150, initY + 150, i + 1,
         { font: 'bold 50px Arial', align: "center", fill: "#fff" });
         this.index.anchor.set(0.5);
         initY += 120;
         }
         this.game.world.setBounds(0, 0, this.game.width, 320 * this.rectangles.length);*/
        this.title = this.game.add.text(this.game.world.centerX, 30, 'Salas Multiplayer',
            { font: '60px Arial', fill: '#fff' });
        this.title.anchor.setTo(0.5, 0.5);
        this.createButton(this.game, "Voltar", this.game.world.centerX, this.game.world.height - 50, 300, 50, function () {
            this.state.start('Menu');
        });
        this.resgatarSalas();
    },

    update: function(){

    },

    resgatarSalas: function () {
        var request = new XMLHttpRequest();
        request.open('GET', '/api/listar_salas/', true);
        request.send(null);
        var me = this;

        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try{
                    me.salas = JSON.parse(this.responseText);
                    var space = 100;
                    for (var i=0; i < me.salas.data.length; i++){
                        var txt = me.salas["data"][i]["nome"]+" - "+me.salas["data"][i]["qtd"]+"/"+me.salas["data"][i]["qtd_max"];
                        me.createButton(me.game, txt,
                            me.game.world.centerX, space, 300, 50,
                            (function(idx){
                                return function(){
                                    me.abrirSala(me.salas["data"][idx]);}
                            })(i)
                        );
                        space += 65;
                    }
                }catch (SyntaxError){
                    alert("Você foi banido!");
                    window.location.href = "/";
                }
            }
        };
    },

    abrirSala: function (sala) {
        var txt = sala["nome"]+" - "+sala["qtd"]+"/"+sala["qtd_max"];
        if(sala["qtd"] < sala["qtd_max"]){
            this.state.start('SalaDeEspera', true, false, sala["nome"], sala["id"]);
        }
        console.log("Sala " + txt);
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
    }

};