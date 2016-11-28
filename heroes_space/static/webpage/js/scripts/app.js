/**
 * Created by marlon on 14/10/16.
 */
(function () {
    /* globals Phaser:false, BasicGame:false */
    //  Create your Phaser game and inject it into the game div.
    //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
    //  We're using a game size of 480 x 640 here, but you can use whatever you feel makes sense for your game of course.
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    //  Add the States your game has.
    //  You don't have to do this in the html, it could be done in your scripts state too, but for simplicity I'll keep it here.
    game.state.add('Boot', BasicGame.Boot);
    game.state.add('Menu', BasicGame.Menu);
    game.state.add('Preloader', BasicGame.Preloader);
    game.state.add('EscolherHeroi', BasicGame.EscolherHeroi);
    game.state.add('SalaDeEspera', BasicGame.SalaDeEspera);
    game.state.add('EscolherSalaMultiplayer', BasicGame.EscolherSalaMultiplayer);
    game.state.add('Prologue', BasicGame.Prologue);
    game.state.add('Ranking', BasicGame.Ranking);
    game.state.add('Level01', BasicGame.Level01);
    game.state.add('Level02', BasicGame.Level02);

    //  Now start the scripts state.
    game.state.start('Boot');

})();