/**
 * Created by marlon on 26/11/16.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.SalaDeEspera = function (game) {

};

// set scripts function prototype
BasicGame.SalaDeEspera.prototype = {

    init: function (nome, id_sala) {
        this.nome = nome;
        this.id_sala = id_sala;
    },

    preload: function () {

    },

    sairSala: function () {
        var request = new XMLHttpRequest();
        var params = "id_sala="+this.id_sala;
        var me = this;
        request.open('POST', '/api/sair_sala/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(params);
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    var sair_sala = JSON.parse(this.responseText);
                    if(sair_sala["success"]){
                        me.state.start("EscolherSalaMultiplayer");
                    }else{
                        alert("Erro ao sair da sala");
                        me.state.start("EscolherSalaMultiplayer");
                    }
                }catch (SyntaxError){
                    alert("Você foi banido!");
                    window.location.href = "/";
                }
            }
        };
    },

    carregarSala: function () {
        var request = new XMLHttpRequest();
        var params = "id_sala="+this.id_sala;
        var me = this;
        request.open('POST', '/api/entrar_sala/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(params);
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try{
                    me.sala = JSON.parse(this.responseText);
                    if(me.sala["success"]){
                        var space = 100;
                        for (var i=0; i < me.sala.sala.jogadores.length; i++){
                            var txt = me.sala.sala.jogadores[i]["nome"];
                            var txtUsuario = me.game.add.text(me.game.world.centerX, space, txt,
                                { font: '25px Arial', fill: '#fff' });
                            txtUsuario.anchor.setTo(0.5, 0.5);
                            space += 65;
                        }
                    }else{
                        alert("Erro ao acessar a sala");
                        me.state.start("EscolherSalaMultiplayer");
                    }
                }catch (SyntaxError){
                    alert("Você foi banido!");
                    window.location.href = "/";
                }
            }
        };
    },
    create: function () {
        this.title = this.game.add.text(this.game.world.centerX, 30, this.nome,
            { font: '60px Arial', fill: '#fff' });
        this.title.anchor.setTo(0.5, 0.5);
        var titleUsuario = this.game.add.text(this.game.world.centerX, 70, "Jogadores",
            { font: '30px Arial', fill: '#fff' });
        titleUsuario.anchor.setTo(0.5, 0.5);
        this.createButton(this.game, "Começar Partida", 170, this.game.world.height - 50, 300, 50, function () {
            if(this.sala.sala.jogadores.length > 1){
                alert("Iniciando partida");
            }else {
                alert("É necessário pelo menos duas pessoas para iniciar a partida");
            }
        });
        this.createButton(this.game, "Sair", this.game.world.width - 170, this.game.world.height - 50, 300, 50, function () {
            this.sairSala();
        });
        this.carregarSala();
    },

    update: function(){

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