#!/bin/bash
set -e

# Install backend dependencies
cd backend
npm install --production
cd ..

# Build frontend
npm run build
