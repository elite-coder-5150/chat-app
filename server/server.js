const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const formatMessage = require('./utils/messages');
const createAdapter = require('@socket.io/redis-adapter').createAdapter;
const redis = require('redis');
require('dotenv').config();
const { createClient } = redis;

