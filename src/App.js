import './App.css';

import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import { ethers } from 'ethers';
import { useState } from 'react';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
function App() {
  const [greetingInputVal, setGreetingInputValue] = useState()
  const [greeting, setGreeting] = useState();

  !greeting && (async () => {
    await fetchGreeting()
  })();

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    if (typeof window.ethereum === 'undefined') return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
    try {
      const greeting = await contract.greet()
      setGreeting(greeting)
    } catch (error) {
      console.error(`Error invoking contract methods: ${error}`)
    }
  }

  async function changeGreeting() {
    if(!greetingInputVal) return;
    if (typeof window.ethereum === 'undefined') return;
    await requestAccount()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
    const tx = await contract.setGreeting(greetingInputVal)
    await tx.wait()
    fetchGreeting()
  }

  return (
    <div className="App">
      <p>{ greeting || "loading..." }</p>
      <button onClick={fetchGreeting}>Get Greeting</button>
      <button onClick={changeGreeting}>Set Greeting</button>
      <input type="text" onChange={e => setGreetingInputValue(e.target.value) } placeholder="set greeting" />
    </div>
  );
}

export default App;
