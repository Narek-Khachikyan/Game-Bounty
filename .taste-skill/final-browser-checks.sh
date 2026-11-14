#!/bin/sh
skill=/Users/narek_khachikyan/.agents/skills/design-taste-frontend
node "$skill/scripts/shoot.mjs" --url 'http://127.0.0.1:5180/?qa=full-genres' --w 1024 --out .taste-skill/candidate-2-full-genres-1024.png --no-tiles
node "$skill/scripts/gate.mjs" http://127.0.0.1:5180/ > .taste-skill/candidate-2-final-gate.log 2>&1
node "$skill/assets/layout/check.mjs" --url http://127.0.0.1:5180/ --sizes 1440x900,1024x768,820x1180,768x1024,390x844 --shots .taste-skill/candidate-2-layout > .taste-skill/candidate-2-layout.log 2>&1
node "$skill/scripts/perf.mjs" http://127.0.0.1:5180/ --json .taste-skill/candidate-2-perf.json > .taste-skill/candidate-2-perf.log 2>&1
node "$skill/scripts/shoot.mjs" --url http://127.0.0.1:5180/ --w 390 --reduced --out .taste-skill/candidate-2-reduced-390.png --no-tiles
node "$skill/scripts/shoot.mjs" --url http://127.0.0.1:5180/ --w 1440 --reduced --out .taste-skill/candidate-2-reduced-1440.png --no-tiles
