#!/bin/bash

echo "splitting game.js into labs, generating missing files"

[[ ! -f 01-hello-world/game.js        ]] && grep "^[1] "         game-categorized.js > 01-hello-world/game.js        && echo ' -> generated 01-hello-world/game.js'
[[ ! -f 02-map-characters/game.js     ]] && grep "^[12] "        game-categorized.js > 02-map-characters/game.js     && echo ' -> generated 02-map-characters/game.js'
[[ ! -f 03-map-loading/game.js        ]] && grep "^[123] "       game-categorized.js > 03-map-loading/game.js        && echo ' -> generated 03-map-loading/game.js'
[[ ! -f 04-create-characters/game.js  ]] && grep "^[1234] "      game-categorized.js > 04-create-characters/game.js  && echo ' -> generated 04-create-characters/game.js'
[[ ! -f 05-animate-characters/game.js ]] && grep "^[12345] "     game-categorized.js > 05-animate-characters/game.js && echo ' -> generated 05-animate-characters/game.js'
[[ ! -f 06-physics-gravity/game.js    ]] && grep "^[123456] "    game-categorized.js > 06-physics-gravity/game.js    && echo ' -> generated 06-physics-gravity/game.js'
[[ ! -f 07-controls-jumping/game.js   ]] && grep "^[1234567] "   game-categorized.js > 07-controls-jumping/game.js   && echo ' -> generated 07-controls-jumping/game.js'
[[ ! -f 08-enemy-collision/game.js    ]] && grep "^[12345678] "  game-categorized.js > 08-enemy-collision/game.js    && echo ' -> generated 08-enemy-collision/game.js'
[[ ! -f 09-sfx-music/game.js          ]] && grep "^[123456789] " game-categorized.js > 09-sfx-music/game.js          && echo ' -> generated 09-sfx-music/game.js'
[[ ! -f 10-map-tileset                ]] && cp game.js 10-map-tileset/game.js && echo ' -> generated 10-map-tileset/game.js'

echo 'done'












