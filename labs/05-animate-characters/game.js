let game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
});

function preload() {

    game.load.tilemap('level', '../assets/levels/level.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('map-tiles', '../assets/images/map-tiles.png');
    game.load.image('background', '../assets/images/background.png');
    game.load.spritesheet('dude', '../assets/images/dude.png', 32, 48);
    game.load.spritesheet('droid', '../assets/images/droid.png', 32, 32);
}

let map;
let tileset;
let layer;
let player;
let enemies;
let bg;

function create() {

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level');

    map.addTilesetImage('map-tiles');

    layer = map.createLayer('platforms');
    layer.resizeWorld();

    enemies = game.add.group();

    initializeCharacters(map);

}

function update() {
}

function initializeCharacters(map) {
    map.objects.characters.forEach(character => {
        switch (character.type) {
            case 'player':
                console.log(`creating player at ${character.x},${character.y}`);
                createPlayer(character);
                break;
            case 'enemy':
                console.log(`creatin an enemy at ${character.x},${character.y}`);
                createEnemy(character);
                break;
        }
    });
}

function createPlayer(character) {
    player = game.add.sprite(character.x, character.y, 'dude');
    player.anchor.setTo(0, 1);

    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    // player.animations.add('turn', [4], 20, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);

    // player.animations.play('right');

}

function createEnemy(character) {
    let enemy = enemies.create(character.x, character.y, 'droid');
    enemy.data = character.properties;
    enemy.anchor.setTo(0.5, 1);

    // enemy.animations.add('move', [0, 1, 2, 3], 10, true);
    // enemy.animations.play('move');
}
