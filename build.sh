#!/bin/bash
# Install backend dependencies
cd backend
npm install
cd ..
# Build frontend
vite build
