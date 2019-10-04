'use strict';

require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelAccessToken: process.env.LINE_CHANNEL_SECRET
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    let mes = '';

    //「=」がおしりにあったら計算
    let lastString = event.message.text.slice(-1);
    if (lastString === '=') {
        try {
            var formula = event.message.text.slice(0,-1);
            mes = eval(formula);
        } catch (e) {
            mes = '計算式が不正だよ！\nだめよーだめだめ！';
        }
    } else {
        mes = event.message.text;
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: mes //実際に返信の言葉を入れる箇所
    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
