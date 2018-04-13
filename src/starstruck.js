
let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/background2.png');

    // load audio files
    game.load.audio('jump', 'assets/audio/sfx/jump.wav');
    game.load.audio('land', 'assets/audio/sfx/land.wav');
    game.load.audio('walk', 'assets/audio/sfx/walk.wav');

}

let map;
let tileset;
let layer;
let player;
let facing = 'left';
let jumpTimer = 0;
let cursors;
let jumpButton;
let bg;
let playerSpeed = 400;
let airborne = false;
let airbornePeak;
let sounds = {};

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    // init audio
    sounds.jump = game.add.audio('jump', 0.7);
    sounds.land = game.add.audio('land');
    sounds.walk = game.add.audio('walk', 0.4);

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');
    // objectLayer = map.createLayer('Object Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 1400;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.0;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -playerSpeed;
        player.body.onFloor() && !sounds.walk.isPlaying && sounds.walk.play();

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = playerSpeed;
        player.body.onFloor() && !sounds.walk.isPlaying && sounds.walk.play();

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

    if (airborne) {
        if (player.position.y < airbornePeak.y) {
            // jump reached new heights!
            airbornePeak = player.position.clone();
        }
        if (player.body.onFloor()) {
            // just landed
            airborne = false;
            let fallDistance = Math.abs(airbornePeak.y - player.position.y);
            let volume = Math.min(1, fallDistance / 150);
            sounds.land.play(null, null, volume);
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -550;
        jumpTimer = game.time.now + 750;
        sounds.jump.play();
    }

    if (!airborne && !player.body.onFloor()) {
        airborne = true;
        airbornePeak = player.position.clone();
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
