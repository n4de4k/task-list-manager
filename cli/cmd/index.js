#!/usr/bin/env node
require = require("esm")(module /*, options*/);
global.btoa = require("btoa");
global.fetch = require("node-fetch");

require("./main");
