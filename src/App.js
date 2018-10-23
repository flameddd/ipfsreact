import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Table, Form } from 'reactstrap';

// This is the order of operations in App.js

// 1. Set the state variables.
// 2. Capture the User's file.
// 3. Convert the file to a buffer.
// 4. Send the buffered file to IPFS
// 5. IPFS returns a hash.
// 6. Get the User's MetaMask Ethereum address
// 7. Send the IPFS for storage on Ethereum.
// 8. Using MetaMask, User will confirm the transaction to Ethereum.
// 9. Ethereum contract will return a transaction hash number.
// 10.The transaction hash number can be used to generate a transaction receipt with information such as the amount of gas used and the block number.
// 11.The IPFS and Ethereum information will render as it becomes available in a table using Bootstrap for CSS.NOTE: I didn't create an isLoading type variable to automatically re - render state for the blockNumber and gasUsed variables.So for now, you will have to click again or implement your own loading icon.A table describing the variables and functions, followed by the code itself are below:


class App extends Component {
  state = {
    ipfsHash: null,
    buffer: '',
    ethAddress: '',
    blockNumber: '',
    transactionHash: '',
    gasUsed: '',
    txReceipt: ''
  };

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };
  convertToBuffer = async (reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };


  onClick = async () => {
    try {
      this.setState({
        blockNumber: "waiting..",
        gasUsed: "waiting..."
      });
      //get Transaction Receipt in console on click
      //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(
        this.state.transactionHash,
        (err, txReceipt) => {
          console.log('txReceipt => ')
          console.log(err, txReceipt);
          this.setState({ txReceipt });
        }
      ); //await for getTransactionReceipt
      await this.setState({
        blockNumber: this.state.txReceipt.blockNumber,
        gasUsed: this.state.txReceipt.gasUsed
      });
    } //try
    catch (error) {
      console.log(error);
    } //catch
  } //onClick


  onSubmit = async (event) => {
    event.preventDefault();
    //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();

    console.log('Sending from Metamask account: ' + accounts[0]);
    console.log('所以我取到 metaMask 所有 account ?')
    console.log(accounts)
    //obtain contract address from storehash.js
    const ethAddress = await storehash.options.address;
    console.log('這個是？ storehash => ')
    console.log(storehash)
    this.setState({ ethAddress });
    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log('還有什麼資訊')
      console.log(ipfsHash)
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash 
      this.setState({ ipfsHash: ipfsHash[0].hash });
      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
      //return the transaction hash from the ethereum contract
      //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send

      storehash.methods
        .sendHash(this.state.ipfsHash)
        .send(
          { from: accounts[0] },
          (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({ transactionHash });
          }
        ); //storehash 
    }) //await ipfs.add 
  }; //onSubmit


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Ethereum and IPFS with Create React App</h1>
        </header>
        <hr />
          <h3> Choose file to send to IPFS </h3>
          <Form onSubmit={this.onSubmit}>
            <input type="file" onChange={this.captureFile} />
            <Button bsStyle="primary" type="submit">
              Send it
             </Button>
          </Form>
          <hr />
          <Button onClick={this.onClick}> Get Transaction Receipt </Button>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Tx Receipt Category</th>
                <th>Values</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>IPFS Hash # stored on Eth Contract</td>
                <td>{this.state.ipfsHash}</td>
              </tr>
              <tr>
                <td>Ethereum Contract Address</td>
                <td>{this.state.ethAddress}</td>
              </tr>
              <tr>
                <td>Tx Hash # </td>
                <td>{this.state.transactionHash}</td>
              </tr>
              <tr>
                <td>Block Number # </td>
                <td>{this.state.blockNumber}</td>
              </tr>
              <tr>
                <td>Gas Used</td>
                <td>{this.state.gasUsed}</td>
              </tr>

            </tbody>
          </Table>
        
      </div>
    );
  }
}

export default App;
