import 'dotenv/config';

import express from 'express';

import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(3000, () =>
    console.log('Example app listening on port ${PORT}!'),
);