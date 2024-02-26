import express from 'express';
import config from './static/config';
const app = express();
export interface App {
    app: Object,
    config: Object,
}