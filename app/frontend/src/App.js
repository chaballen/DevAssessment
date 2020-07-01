import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            company: '',
            type: '',
            productName: '',
            productUnit: '',
            currency: '',
            varCost: 0,

            unitName: '',
            unitQuantity: 0,
            unitPrice: 0,
            costPerProductUnit: 0
        };

        this.handleChange =
            this.handleChange.bind(this);

        this.addRow =
            this.addRow.bind(this);

        this.handleSubmit =
            this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // handle input changes
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    showVarCostInput(e) {
        // show input form for variable cost if known
        const varCostInput = document.getElementById('varCostInput');
        const calcVarCost = document.getElementById('calcVarCost');

        varCostInput.hidden = false;
        calcVarCost.hidden = true;

        e.preventDefault();
    }

    calculateVarCost(e) {
        // show calculated variable cost if unknown
        const varCostInput = document.getElementById('varCostInput');
        const calcVarCost = document.getElementById('calcVarCost');

        varCostInput.hidden = true;
        calcVarCost.hidden = false;

        e.preventDefault();
    }

    addRow(e) {
        // add input row to table for calculating variable cost
        const inputs = [['unitName', 'text'], ['unitQuantity', 'number'],
            ['unitPrice', 'number'], ['costPerProductUnit', 'number']];
        const row = document.createElement('tr');

        const table = document.getElementById('tbody');
        table.appendChild(row);

        for (let i = 0; i < inputs.length; i++) {
            let name = inputs[i][0];
            let type = inputs[i][1];

            let newInput = document.createElement('input');
            newInput.setAttribute('name', name);
            newInput.setAttribute('type', type);
            newInput.setAttribute('onChange', this.handleChange);

            if (type === 'number') {
                newInput.setAttribute('step', '0.001');
            }

            row.insertCell(i).appendChild(newInput);
        }

        e.preventDefault();
    }

    handleSubmit(e) {
        e.preventDefault();

        const {user, company, type, productName, productUnit, currency, varCost,
            unitName, unitQuantity, unitPrice, costPerProductUnit} = this.state;

        const userData = [user, company, type, productName, productUnit, currency, varCost];

        const productData = [unitName, unitQuantity, unitPrice, costPerProductUnit];

        console.log('submitted');
        fetch('http://localhost:4000/' , {
            method: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(userData, productData)})
            .then((result) => result.json())
            .then((info) => {console.log(info);});
    }

    render() {
        return (
            <div className="App">
                <header>
                    <h1>Variable Cost Per Unit</h1>
                </header>
            <form id={'userInfo'} onSubmit={this.handleSubmit}>
                <p>User: <input name={'user'} type={'text'} onChange={this.handleChange}/></p>
                <p>Company: <input name={'company'} type={'text'} onChange={this.handleChange}/></p>
                <p>Type: <input name={'type'} type={'text'} onChange={this.handleChange}/></p>
                <p>Product Name: <input name={'productName'} type={'text'} onChange={this.handleChange}/></p>
                <p>Product Unit: <input name={'productUnit'} type={'text'} onChange={this.handleChange}/></p>
                <p>Currency: <input name={'currency'} type={'text'} onChange={this.handleChange}/></p>

                <p>Do you already know the Variable Cost Per
                    1 {this.state.productUnit} of {this.state.productName}?
                    <button onClick={this.showVarCostInput}>Yes</button>
                    <button onClick={this.calculateVarCost}>No</button>
                </p>

                <p id={'varCostInput'} hidden={true}>
                    Variable Cost Per 1 {this.state.productUnit} of {this.state.productName}
                    : <input name={'varCost'} type={'number'} step={'0.001'}
                             onChange={this.handleChange}/></p>
                <p id={'calcVarCost'} hidden={true}>
                    Variable Cost Per 1 {this.state.productUnit} of {this.state.productName}: {this.state.varCost}</p>

                <table>
                    <tbody id={'tbody'}>
                    <tr>
                        <td>Unit Name</td>
                        <td>Unit Quantity Per 1 {this.state.productUnit} of {this.state.productName}</td>
                        <td>Unit Price ({this.state.currency})</td>
                        <td>Cost Per 1 {this.state.productUnit} of {this.state.productName}</td>
                    </tr>
                    <tr>
                        <td><input name={'unitName'}
                                   type={'text'} onChange={this.handleChange}/></td>
                        <td><input name={'unitQuantity'}
                                   type={'number'} step={'0.001'} onChange={this.handleChange}/></td>
                        <td><input name={'unitPrice'}
                                   type={'number'} step={'0.001'} onChange={this.handleChange}/></td>
                        <td><input name={'costPerProductUnit'}
                                   type={'number'} step={'0.001'} onChange={this.handleChange}
                                   placeholder={this.state.costPerProductUnit}/></td>
                    </tr>
                    </tbody>
                </table>
                <button onClick={this.addRow}>Add New Row</button>
                <input type={'submit'} value={'Calculate'}/>
            </form>
            </div>
        );
    }
}

export default App;
