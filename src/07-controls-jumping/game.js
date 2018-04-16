let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
function preload() {
    game.load.tilemap('level', 'assets/levels/level.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('map-tiles', 'assets/images/map-tiles.png');
    game.load.image('background', 'assets/images/background.png');
    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/images/droid.png', 32, 32);
}
let map;
let tileset;
let layer;
let player;
let enemies;
let facing = 'left';
let jumpTimer = 0;
let cursors;
let jumpButton;
let bg;
let playerSpeed = 400;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    map = game.add.tilemap('level');
    map.addTilesetImage('map-tiles');
    layer = map.createLayer('platforms');
    layer.resizeWorld();
    enemies = game.add.group();
    initializeCharacters(map);
    game.physics.arcade.gravity.y = 1400;
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}
function update() {
    player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -playerSpeed;
            if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = playerSpeed;
            if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else {
            if (facing != 'idle') {
                player.animations.stop();
                if (facing == 'left') {
                    player.frame = 0;
                }
                else {
                    player.frame = 5;
                }
                facing = 'idle';
            }
        }
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -550;
        jumpTimer = game.time.now + 100;
    }
}
function render () {
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // enemies.forEach(enemy => game.debug.body(enemy));
    // game.debug.bodyInfo(player, 16, 24);
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
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.play('right');

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.0;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    game.camera.follow(player);
}
function createEnemy(character) {
    let enemy = enemies.create(character.x, character.y, 'droid');
    enemy.data = character.properties;
    enemy.anchor.setTo(0.5, 1);
    enemy.animations.add('move', [0, 1, 2, 3], 10, true);
    enemy.animations.play('move');

    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.collideWorldBounds = true;
    enemy.body.setSize(22, 20, 5, 14);
}
