#!/bin/sh
skill=/Users/narek_khachikyan/.agents/skills/design-taste-frontend
for width in 1440 1024 390 820 768; do
 node "$skill/scripts/shoot.mjs" --url http://127.0.0.1:5180/ --w "$width" --out ".taste-skill/candidate-2-$width.png" --no-tiles || exit 1
done
for width in 320 600 1200; do
 node "$skill/scripts/shoot.mjs" --url 'http://127.0.0.1:5180/?q=qa-loading' --w "$width" --out ".taste-skill/candidate-2-loading-$width.png" --no-tiles || exit 1
done
