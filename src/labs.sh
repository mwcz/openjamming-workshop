#!/bin/bash

echo "splitting game.js into labs, generating missing files"

[[ ! -f game-1.js ]] && grep "^[1] " game-categorized.js > game-1.js && echo ' -> generated game-1.js'
[[ ! -f game-2.js ]] && grep "^[12] " game-categorized.js > game-2.js && echo ' -> generated game-2.js'
[[ ! -f game-3.js ]] && grep "^[123] " game-categorized.js > game-3.js && echo ' -> generated game-3.js'
[[ ! -f game-4.js ]] && grep "^[1234] " game-categorized.js > game-4.js && echo ' -> generated game-4.js'
[[ ! -f game-5.js ]] && grep "^[12345] " game-categorized.js > game-5.js && echo ' -> generated game-5.js'
[[ ! -f game-6.js ]] && grep "^[123456] " game-categorized.js > game-6.js && echo ' -> generated game-6.js'
[[ ! -f game-7.js ]] && grep "^[1234567] " game-categorized.js > game-7.js && echo ' -> generated game-7.js'
[[ ! -f game-8.js ]] && grep "^[12345678] " game-categorized.js > game-8.js && echo ' -> generated game-8.js'
[[ ! -f game-9.js ]] && grep "^[123456789] " game-categorized.js > game-9.js && echo ' -> generated game-9.js'
[[ ! -f game-10.js ]] && cp game.js game-10.js && echo ' -> generated game-10.js'

echo 'done'
