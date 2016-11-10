/**
 * Created by Marlon on 16/10/2016.
 */
/* jshint browser:true */

// create scripts function in BasicGame
BasicGame.Prologue = function (game) {

};

var text;
var index = 0;
var line = '';

var content = [
    "   ",
    "No ano de 3050",
    "O planeta Terra já não\nera mais o mesmo",
    " ",
    "Os recursos naturais\nestavam no limite",
    " ",
    "Com os recursos que ainda\nrestavam",
    "E com a tecnologia avançada",
    "A humanidade procurava\ndesesperadamente um novo lar",
    "  ",
    "Diversos pilotos foram enviados\npelo universo",
    "  ",
    "Em busca planetas habitáveis,\nmas acabou encontrando...",
    "  ",
    "um inimigo",
    "......."
];

// set scripts function prototype
BasicGame.Prologue.prototype = {

    init: function () {

        this.distance = 300;
        this.speed = 6;
        this.max = 500;

        this.xx = [];
        this.yy = [];
        this.zz = [];
    },

    preload: function () {

    },

    create: function () {
        //  This will run in Canvas mode, so let's gain a little speed and display
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;

        this.canvas = this.add.bitmapData(800, 600);
        this.canvas.addToWorld();

        for (var i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * 800) - 400;
            this.yy[i] = Math.floor(Math.random() * 600) - 300;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;
        }

        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        text = this.add.text(32, 380, '', { font: "27pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2 });
        this.nextLine();
    },

    update: function(){
        this.canvas.clear();
        for (var i = 0; i < this.max; i++)
        {
            var perspective = this.distance / (this.distance - this.zz[i]);
            var x = this.world.centerX + this.xx[i] * perspective;
            var y = this.world.centerY + this.yy[i] * perspective;

            this.zz[i] += this.speed;

            if (this.zz[i] > 300)
            {
                this.zz[i] -= 600;
            }

            //  Swap this for a standard drawImage call
            this.canvas.draw('star', x, y);
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            var request = new XMLHttpRequest();
            request.open('POST', '/api/registrar_fase01/', true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();
            this.state.start('Level01')
        }
    },

    updateLine: function() {

        if (line.length < content[index].length)
        {
            line = content[index].substr(0, line.length + 1);
            // text.text = line;
            text.setText(line);
        }
        else
        {
            //  Wait 2 seconds then start a new line
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLine, this);
        }

    },

    nextLine: function() {

        index++;

        if (index < content.length) {
            line = '';
            this.game.time.events.repeat(80, content[index].length + 1, this.updateLine, this);
        }else{
            var request = new XMLHttpRequest();
            request.open('POST', '/api/registrar_fase01/', true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();
            this.state.start('Level01');
        }
    }

};