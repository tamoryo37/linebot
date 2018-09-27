'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '0e44da5f57183580bd89fb55b1a19eb0',
    channelAccessToken: 'znB0vfH5JGh4NqPTT1h4b363k5zPFaP+oF06dFN3U5hFZvTM93wmxiCfdZQBXH3GzrQvN2EGPiz+jT9XgkaFkBTpaq3bdYGj7H4A8R+AYp1BGwdwON6gEHRuarD9VIR/R3bNbEzOGCIrf4OadyD7PgdB04t89/1O/w1cDnyilFU='
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
