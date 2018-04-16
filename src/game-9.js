1       let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
1           preload: preload,
1           create: create,
1           update: update,
1           render: render
1       });
1       function preload() {
3           game.load.tilemap('level', 'assets/levels/level.json', null, Phaser.Tilemap.TILED_JSON);
3           game.load.image('map-tiles', 'assets/images/map-tiles.png');
1           game.load.image('background', 'assets/images/background.png');
1           game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
4           game.load.spritesheet('droid', 'assets/images/droid.png', 32, 32);
9           // load audio files
9           // https://www.beepbox.co/#5n31s0k4l00e00t9m2a2g00j7i0r1w1121f0000d1101c0000h0000v0000o3210b4h0p1g002Dp0Vc19Ey8100
9           game.load.audio('jump', 'assets/audio/sfx/jump.wav');
9           // https://www.beepbox.co/#5n31s0kbl00e00t7m0a2g00j0i0r1w1111f0000d1112c0000h0000v0000o3210bYp1554h0G
9           game.load.audio('land', 'assets/audio/sfx/land.wav');
9           // https://www.beepbox.co/#5n11s0k4l00e00t7m0a2g00j0i0r1w11f00d13c00h00v03o30bMp16kg0aiE
9           game.load.audio('walk', 'assets/audio/sfx/walk.wav');
9           // https://www.beepbox.co/#5n31s0k4l00e00t7m0a2g00j0i0r1w1181f0000d1111c0000h0000v0000o3210bYp1dIYOGwqCf5IBuc
9           game.load.audio('player-death', 'assets/audio/sfx/player-death.wav');
9           // https://www.beepbox.co/#5n31s0k4l00e00t7m0a2g00j0i0r1w1181f0000d1111c0000h0000v0000o3210bYp165A81pk
9           game.load.audio('enemy-death', 'assets/audio/sfx/enemy-death.wav');
1       }
3       let map;
3       let tileset;
3       let layer;
1       let player;
5       let enemies;
7       let facing = 'left';
7       let jumpTimer = 0;
7       let cursors;
7       let jumpButton;
1       let bg;
7       let playerSpeed = 400;
7       let airborne = false;
7       let airbornePeak;
9       let sounds = {};
1       function create() {
6           game.physics.startSystem(Phaser.Physics.ARCADE);
1           game.stage.backgroundColor = '#000000';
1           bg = game.add.tileSprite(0, 0, 800, 600, 'background');
1           bg.fixedToCamera = true;
9           // init audio
9           sounds.jump = game.add.audio('jump', 0.7);
9           sounds.land = game.add.audio('land');
9           sounds.walk = game.add.audio('walk', 0.8);
9           sounds.playerDeath = game.add.audio('player-death', 0.8);
9           sounds.enemyDeath = game.add.audio('enemy-death', 0.8);
4           enemies = game.add.group();
4           initializeCharacters(map);
6           game.physics.arcade.gravity.y = 1400;
7           cursors = game.input.keyboard.createCursorKeys();
7           jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
1       }
1       function update() {
8           game.physics.arcade.collide(player, enemies, handlePlayerHitEnemy);
7           player.body.velocity.x = 0;
8           enemies.callAll('animations.play', 'animations', 'move');
8           enemies.forEach(enemy => {
8               let enemyDirection = Math.sign(player.body.position.x - enemy.body.position.x);
8               enemy.body.velocity.x = enemy.data.speed * enemyDirection;
8               enemy.scale.x = -enemyDirection;
8           });
8           if (!player.data.dying) {
7               if (cursors.left.isDown) {
7                   player.body.velocity.x = -playerSpeed;
7                   player.body.onFloor() && !sounds.walk.isPlaying && sounds.walk.play();
7                   if (facing != 'left') {
7                       player.animations.play('left');
7                       facing = 'left';
7                   }
7               }
7               else if (cursors.right.isDown) {
7                   player.body.velocity.x = playerSpeed;
7                   player.body.onFloor() && !sounds.walk.isPlaying && sounds.walk.play();
7                   if (facing != 'right') {
7                       player.animations.play('right');
7                       facing = 'right';
7                   }
7               }
7               else {
7                   if (facing != 'idle') {
7                       player.animations.stop();
7                       if (facing == 'left') {
7                           player.frame = 0;
7                       }
7                       else {
7                           player.frame = 5;
7                       }
7                       facing = 'idle';
7                   }
7               }
8           }
7           if (airborne) {
7               if (player.position.y < airbornePeak.y) {
7                   // jump reached new heights!
7                   airbornePeak = player.position.clone();
7               }
7               if (player.body.onFloor()) {
7                   // just landed
7                   airborne = false;
7                   let fallDistance = Math.abs(airbornePeak.y - player.position.y);
7                   let volume = Math.min(1, fallDistance / 150);
7                   sounds.land.play(null, null, volume);
7               }
7           }
7           if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
7               player.body.velocity.y = -550;
7               jumpTimer = game.time.now + 100;
7               sounds.jump.play();
7           }
7           if (!airborne && !player.body.onFloor()) {
7               airborne = true;
7               airbornePeak = player.position.clone();
7           }
1       }
1       function render () {
1           // game.debug.text(game.time.physicsElapsed, 32, 32);
1           // game.debug.body(player);
1           // enemies.forEach(enemy => game.debug.body(enemy));
1           // game.debug.bodyInfo(player, 16, 24);
1       }
4       function initializeCharacters(map) {
4           map.objects.characters.forEach(character => {
4               switch (character.type) {
4                   case 'player':
4                       console.log(`creating player at ${character.x},${character.y}`);
4                       createPlayer(character);
4                       break;
4                   case 'enemy':
4                       console.log(`creatin an enemy at ${character.x},${character.y}`);
4                       createEnemy(character);
4                       break;
4               }
4           });
4       }
4       function createPlayer(character) {
1           player = game.add.sprite(character.x, character.y, 'dude');
4           player.anchor.setTo(0, 1);
4           game.physics.enable(player, Phaser.Physics.ARCADE);
4           player.body.bounce.y = 0.0;
4           player.body.collideWorldBounds = true;
4           player.body.setSize(20, 32, 5, 16);
4           player.animations.add('left', [0, 1, 2, 3], 10, true);
4           player.animations.add('turn', [4], 20, true);
4           player.animations.add('right', [5, 6, 7, 8], 10, true);
4           game.camera.follow(player);
4       }
4       function createEnemy(character) {
4           let enemy = enemies.create(character.x, character.y, 'droid');
4           enemy.data = character.properties;
4           game.physics.enable(enemy, Phaser.Physics.ARCADE);
4           enemy.body.collideWorldBounds = true;
4           enemy.anchor.setTo(0.5, 1);
4           enemy.body.setSize(22, 20, 5, 14);
4           enemy.animations.add('move', [0, 1, 2, 3], 10, true);
4       }
8       function handlePlayerHitEnemy(player, enemy) {
8           if (player.body.touching.down) {
8               killEnemy(enemy);
8           }
8           else {
8               killPlayer();
8           }
8       }
8       function killEnemy(enemySprite) {
8           enemySprite.body.enable = false;
8           const deathTween = game.add.tween(enemySprite);
8           deathTween.to({ y: enemySprite.y + 60, alpha: 0 }, 0.4 * Phaser.Timer.SECOND, Phaser.Easing.Linear.None);
8           deathTween.onComplete.add(() => enemySprite.destroy(), this);
8           deathTween.start();
8           player.body.velocity.y = -300; // bounce player
8           sounds.enemyDeath.play();
8       }
8       function killPlayer() {
8           player.data.dying = true;
8           player.body.checkCollision.none = true; // don't collide with other sprites
8           player.body.collideWorldBounds = false; // don't collide with world boundaries
8           player.body.velocity.y = -500; // go up
8           player.scale.y = -1;
8           player.anchor.setTo(0, 0.5);
8           sounds.playerDeath.play();
8           // restart the game after a short delay
8           game.time.events.add(3 * Phaser.Timer.SECOND, () => game.state.start('default'), game);
8       }
