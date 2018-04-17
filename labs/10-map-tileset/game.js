let game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
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

    // load audio files

    // https://www.beepbox.co/#5n31s0k4l00e00t9m2a2g00j7i0r1w1121f0000d1101c0000h0000v0000o3210b4h0p1g002Dp0Vc19Ey8100
    game.load.audio('jump', 'assets/audio/sfx/jump.wav');

    // https://www.beepbox.co/#5n31s0kbl00e00t7m0a2g00j0i0r1w1111f0000d1112c0000h0000v0000o3210bYp1554h0G
    game.load.audio('land', 'assets/audio/sfx/land.wav');

    // https://www.beepbox.co/#5n11s0k4l00e00t7m0a2g00j0i0r1w11f00d13c00h00v03o30bMp16kg0aiE
    game.load.audio('walk', 'assets/audio/sfx/walk.wav');

    // https://www.beepbox.co/#5n31s0k4l00e00t7m0a2g00j0i0r1w1181f0000d1111c0000h0000v0000o3210bYp1dIYOGwqCf5IBuc
    game.load.audio('player-death', 'assets/audio/sfx/player-death.wav');

    // https://www.beepbox.co/#5n31s0k4l00e00t7m0a2g00j0i0r1w1181f0000d1111c0000h0000v0000o3210bYp165A81pk
    game.load.audio('enemy-death', 'assets/audio/sfx/enemy-death.wav');

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
    sounds.walk = game.add.audio('walk', 0.8);
    sounds.playerDeath = game.add.audio('player-death', 0.8);
    sounds.enemyDeath = game.add.audio('enemy-death', 0.8);

    map = game.add.tilemap('level');

    map.addTilesetImage('map-tiles');

    // map.setCollisionByExclusion([]);

    layer = map.createLayer('platforms');

    //  Un-comment this to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    enemies = game.add.group();

    initializeCharacters(map);

    game.physics.arcade.gravity.y = 1400;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
    // game.physics.arcade.collide(player, layer, null, () => !player.data.dying);
    // game.physics.arcade.collide(enemies, layer);
    game.physics.arcade.collide(player, enemies, handlePlayerHitEnemy);

    player.body.velocity.x = 0;

    enemies.callAll('animations.play', 'animations', 'move');
    enemies.forEach(enemy => {
        let enemyDirection = Math.sign(player.body.position.x - enemy.body.position.x);
        enemy.body.velocity.x = enemy.data.speed * enemyDirection;
        enemy.scale.x = -enemyDirection;
    });

    if (!player.data.dying) {
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
        jumpTimer = game.time.now + 100;
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

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.0;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);
}

function createEnemy(character) {
    let enemy = enemies.create(character.x, character.y, 'droid');
    enemy.data = character.properties;
    enemy.anchor.setTo(0.5, 1);

    enemy.animations.add('move', [0, 1, 2, 3], 10, true);

    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.collideWorldBounds = true;
    enemy.body.setSize(22, 20, 5, 14);
}

function handlePlayerHitEnemy(player, enemy) {
    if (player.body.touching.down) {
        killEnemy(enemy);
    }
    else {
        killPlayer();
    }
}

function killEnemy(enemySprite) {
    enemySprite.body.enable = false;

    const deathTween = game.add.tween(enemySprite);
    deathTween.to({ y: enemySprite.y + 60, alpha: 0 }, 0.4 * Phaser.Timer.SECOND, Phaser.Easing.Linear.None);
    deathTween.onComplete.add(() => enemySprite.destroy(), this);
    deathTween.start();

    player.body.velocity.y = -300; // bounce player
    sounds.enemyDeath.play();
}

function killPlayer() {
    player.data.dying = true;
    player.body.checkCollision.none = true; // don't collide with other sprites
    player.body.collideWorldBounds = false; // don't collide with world boundaries
    player.body.velocity.y = -500; // go up
    player.scale.y = -1;
    player.anchor.setTo(0, 0.5);
    sounds.playerDeath.play();

    // restart the game after a short delay
    game.time.events.add(3 * Phaser.Timer.SECOND, () => game.state.start('default'), game);
}
