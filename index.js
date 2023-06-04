const express = require('express')
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const logger = function (req, res, next) {
  console.log(req.body);
  next();
}

let expenses = [];

let limit = null;

app.use(logger);

app.post('/creat', async (req, res) => {
    let tempWaste = new waste(req.body.name, req.body.cost);
    let filteredArr = expenses.filter(item => item.date == tempWaste.date);
    let todayWaste = filteredArr.reduce((sum, item) => sum + item.cost, 0);
    if(todayWaste + tempWaste.cost <= limit){
        expenses.push(tempWaste);
        res.status(201).json(tempWaste);
    }
    else{
        res.status(200).send("You spend a lot of money today");
    }
})

app.get('/all', async (req, res) => {
    if(expenses.length == 0){
        res.status(200).send("No expenses");
    }
    else{
        res.status(200).json(expenses);
    }
})

app.post('/search', async (req, res) => {
    let filteredArr = expenses.filter(item => item.date == req.body.date);
    if(filteredArr.length == 0){
        res.status(200).send(`No expenses in ${req.body.date}`);
    }
    else{
        res.status(200).json(filteredArr)
    }
})

app.post('/limit', async (req, res) => {
    limit = req.query.limit;
    res.status(200).send(`Set limit ${limit} rub`)
})

app.get('/limit', async (req, res) => {
    res.status(200).send(`Your limit is ${limit} rub`)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


class waste{
    constructor(name, cost){
        this.name = name;
        this.cost = cost;
        this.date = new Date().toLocaleDateString();
    }
}