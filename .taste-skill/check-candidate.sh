#!/bin/sh
skill=/Users/narek_khachikyan/.agents/skills/design-taste-frontend
node "$skill/scripts/consistency.mjs" http://127.0.0.1:5180/ --widths 1440,1024,820,768,390 --rhythm-widths 1440,820,768,390 --page software --category 'game catalog' --primary 'Search games' --out .taste-skill/candidate-1-check > .taste-skill/candidate-1-consistency.log 2>&1
node "$skill/assets/layout/check.mjs" --url http://127.0.0.1:5180/ --sizes 1440x900,1024x768,820x1180,768x1024,390x844 --shots .taste-skill/candidate-1-layout > .taste-skill/candidate-1-layout.log 2>&1
node "$skill/scripts/perf.mjs" http://127.0.0.1:5180/ > .taste-skill/candidate-1-perf.log 2>&1
node "$skill/scripts/gate.mjs" http://127.0.0.1:5180/ > .taste-skill/candidate-1-gate.log 2>&1
