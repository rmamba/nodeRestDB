#!/bin/bash

yarn install
yarn build
yarn test
rm -rf node_modules
