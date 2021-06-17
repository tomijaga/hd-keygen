import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

import { generateMnemonic, HdWallet } from 'tnb-hd-wallet';

interface AppProps {}
interface AppState {
  name: string;
}

const hd = HdWallet.thenewboston(
  'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542'
);

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div>
        <Hello name={this.state.name} />
        <p>
          Start editing to see some magic happen :) {hd.getAddress(0).publicKey}
        </p>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
