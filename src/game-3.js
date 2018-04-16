let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
function preload() {
    game.load.tilemap('level', 'assets/levels/level.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('background', 'assets/images/background.png');
    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
}
let map;
let tileset;
let layer;
let player;
let bg;
function create() {
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    map = game.add.tilemap('level');
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'dude');
    layer = map.createLayer('platforms');
    layer.resizeWorld();
}
function update() {
}
function render () {
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // enemies.forEach(enemy => game.debug.body(enemy));
    // game.debug.bodyInfo(player, 16, 24);
}
