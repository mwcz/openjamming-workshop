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
1       function create() {
6           game.physics.startSystem(Phaser.Physics.ARCADE);
1           game.stage.backgroundColor = '#000000';
1           bg = game.add.tileSprite(0, 0, 800, 600, 'background');
1           bg.fixedToCamera = true;
4           enemies = game.add.group();
4           initializeCharacters(map);
6           game.physics.arcade.gravity.y = 1400;
7           cursors = game.input.keyboard.createCursorKeys();
7           jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
1       }
1       function update() {
7           player.body.velocity.x = 0;
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
