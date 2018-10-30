#!/usr/bin/env bash

git clone ${REPO}.git -b $1
cd dist
cp ../${REPO_DIR}/Jenkinsfile ./Jenkinsfile
git init
git config --global user.name $COMMIT_AUTHOR_USERNAME
git config --global user.email $COMMIT_AUTHOR_EMAIL
git remote add travis-build ${REPO}.git
git add .
git commit -m "${TRAVIS_COMMIT_MESSAGE}"
git push --force --set-upstream travis-build HEAD:$1

