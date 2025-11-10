// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.join(__dirname), // Points to crud-data folder
  },
};

module.exports = nextConfig;