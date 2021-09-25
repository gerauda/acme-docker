const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
    // res.send(process.env);
});
app.listen(3000, () => {
    console.log('Example app listening at http://localhost:3000');
});