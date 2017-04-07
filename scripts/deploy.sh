#!/usr/bin/env bash

set -ex

npm run build

scp -r build/* archive@app.mdb.bbdomain.org:/sites/_tools/cit

MAIN_JS="$(grep "\"main.js\":" build/asset-manifest.json | awk -F: '{print substr($2,3,length($2)-4)}')"
MAIN_CSS="$(grep "\"main.css\":" build/asset-manifest.json | awk -F: '{print substr($2,3,length($2)-4)}')"

ssh archive@app.mdb.bbdomain.org "ln -sf /sites/_tools/cit/$MAIN_JS /sites/_tools/cit/mdb-cit.js"
ssh archive@app.mdb.bbdomain.org "ln -sf /sites/_tools/cit/${MAIN_CSS} /sites/_tools/cit/mdb-cit.css"