#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const basePath = path.resolve(__dirname, '..');
const huskyPath = path.resolve(basePath, '.husky');
const hooksPath = path.resolve(basePath, '.git/hooks');

if (!fs.existsSync(huskyPath)) {
    throw new Error('Husky directory does not exist');
}
if (fs.existsSync(hooksPath)) {
    if(huskyPath === fs.realpathSync(hooksPath)) return;
    fs.rmdirSync(hooksPath, { recursive: true });
}

fs.symlinkSync(huskyPath, hooksPath, 'junction');