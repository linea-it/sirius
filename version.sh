#!/bin/sh

if [ -z "${TAG_NAME}" ]; then
    echo "Executing: git describe --tags ${GIT_COMMIT}"
    export GIT_TAG="$(git describe --tags ${GIT_COMMIT})"
else
    export GIT_TAG="${TAG_NAME}"
fi

echo "TAG: ${GIT_TAG}"

printenv

cat >./src/assets/json/version.json <<EOF
    {
        "tag": "$GIT_TAG",
        "sha": "$GIT_COMMIT",
        "url": "$GIT_URL"
    }
EOF