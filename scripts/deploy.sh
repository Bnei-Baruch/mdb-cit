#!/usr/bin/env bash

set -ex

npm run build

scp -r build/* archive@app.mdb.bbdomain.org:/sites/_tools/cit
scp example.html archive@app.mdb.bbdomain.org:/sites/_tools/cit