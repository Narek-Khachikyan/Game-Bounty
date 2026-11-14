#!/bin/sh
set -e
skill=/Users/narek_khachikyan/.agents/skills/design-taste-frontend
for width in 1440 390 1024 820 768; do
 node "$skill/scripts/shoot.mjs" --url http://127.0.0.1:5180/ --w "$width" --out ".taste-skill/candidate-1-$width.png" --no-tiles
done
node "$skill/scripts/shoot.mjs" --url http://127.0.0.1:5180/ --w 1440 --out .taste-skill/candidate-1-1440.png --no-tiles
node "$skill/scripts/shoot.mjs" --url http://127.0.0.1:5180/ --w 390 --out .taste-skill/candidate-1-390.png --no-tiles
sh .taste-skill/check-candidate.sh
