const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;

const app = express();

const bodyParser = require('body-parser');
const logger = require('morgan');

app.use(cors());

const allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
};
app.use(allowCrossDomain);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log('connected');

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', cors(), (req, res) => {
    res.send('Variable Cost Form Data');
    res.render('userInfo', {
        data: req.body
    });
    res.render('productInfo', {
        data: req.body
    });
    console.log('get');
});

let users = [];
let unitData = [];

app.post('/', cors(), (req, res) => {
    const userEntity = {
        user: req.body.user,
        company: req.body.company,
        type: req.body.type,
        productName: req.body.productName,
        productUnit: req.body.productUnit,
        currency: req.body.currency,
        isKnown: req.body.isKnown
        };

    users.push(userEntity);
    console.log(users);

    const varCostInputs = {
        unitName: req.body.unitName,
        unitQuantity: req.body.unitQuantity,
        unitPrice: req.body.unitPrice,
        costPerProductUnit: req.body.costPerProductUnit,
        varCost: req.body.varCost
    };

    let cost = varCostInputs.unitQuantity * varCostInputs.unitPrice;
    if (cost === 0) {
        cost = varCostInputs.costPerProductUnit;
    }
    if (cost !== varCostInputs.costPerProductUnit) {
        alert('Inputted cost does not match calculated cost');
    }
    varCostInputs.costPerProductUnit.valueAsNumber = cost;

    let varCost = 0;
    for (let i = 0; i < unitData.length; i++) {
        varCost += unitData[i].costPerProductUnit;
    }
    varCostInputs.varCost.valueAsNumber = varCost;

    unitData.push(varCostInputs);
    console.log(unitData);
})

app.listen(port, function () {
    console.log('CORS-enabled web server listening.');
})