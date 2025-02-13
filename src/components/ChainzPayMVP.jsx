import React, { useState } from 'react';
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Wallet, Building2, CreditCard, Phone, Receipt, Check, ExternalLink, Loader } from 'lucide-react';

const ChainzPayMVP = () => {
  const [step, setStep] = useState(1);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [cardLastDigits, setCardLastDigits] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //Wallet connection logic
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to continue.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum); // Correct Web3 provider
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length === 0) {
        throw new Error("No Ethereum accounts found. Please log in to MetaMask.");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setWalletAddress(address);
      setBalance(ethers.formatEther(balance)); // Updated syntax for ethers v6
       setTimeout(() => {
      setStep(2);
      console.log("Step updated to 2");
    }, 5000);
    } catch (err) {
      setError(err.message);
      console.error("Error connecting wallet:", err);
    }
  };

  const bankOptions = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
    { id: 'yes', name: 'Yes Bank' },
    { id: 'pnb', name: 'Punjab National Bank' },
    { id: 'bob', name: 'Bank of Baroda' }
  ];

  const billAmount = 45000; // Amount in INR
  const usdtRate = 0.012; // 1 INR = 0.012 USDT (approximate)
  const usdtAmount = billAmount * usdtRate;
  const platformFee = usdtAmount * 0.02; // 2% platform fee
  const totalAmount = usdtAmount + platformFee;

  // const connectWallet = async () => {
  //   setIsLoading(true);
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   setIsWalletConnected(true);
  //   setIsLoading(false);
  //   setStep(2);
  // };

  const handlePayment = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const hash = '0x' + Array(64).fill(0).map(() =>
      Math.floor(Math.random() * 16).toString(16)).join('');
    setTransactionHash(hash);
    setIsLoading(false);
    setStep(4);
  };

  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-gray-200">Processing...</div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4">
          <Wallet className="text-blue-500" size={48} />
        </div>
        <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
        <p className="text-sm text-gray-500">Connect your wallet to start making payments</p>
      </div>
      <button
        onClick={connectWallet}
        className="w-full bg-blue-500 text-white p-4 rounded-lg
                 flex items-center justify-center space-x-2 hover:bg-blue-600
                 transition-colors duration-200"
      >
      {walletAddress && <p>Connected: {walletAddress}</p>}
      {balance && <p>Balance: {balance} ETH</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
        <Wallet size={20} />
        <span>Connect Wallet</span>
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
        <div className="flex items-center">
          <Check className="text-green-500 mr-2" size={20} />
          <span className="text-green-700">Wallet Connected Successfully</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
          >
            <option value="">Select your bank</option>
            {bankOptions.map((bank) => (
              <option key={bank.id} value={bank.id}>{bank.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Last 4 Digits</label>
          <input
            type="text"
            maxLength="4"
            value={cardLastDigits}
            onChange={(e) => setCardLastDigits(e.target.value.replace(/\D/g, ''))}
            className="w-full p-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
            placeholder="Enter last 4 digits"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            className="w-full p-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
            placeholder="Enter phone number"
          />
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!selectedBank || cardLastDigits.length !== 4 || !phoneNumber}
          className="w-full bg-blue-500 text-white p-4 rounded-lg
                   disabled:bg-gray-300 hover:bg-blue-600
                   transition-colors duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Bill Amount (INR)</span>
            <span>₹{billAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Amount in USDT</span>
            <span>{usdtAmount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee (2%)</span>
            <span>{platformFee.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-3">
            <span>Total Amount</span>
            <span>{totalAmount.toFixed(2)} USDT</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-blue-500 text-white p-4 rounded-lg
                 hover:bg-blue-600 transition-colors duration-200"
      >
        Confirm Payment
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
        <Check className="mx-auto text-green-500 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-green-800">Payment Successful</h3>
        <p className="text-sm text-gray-600">Your transaction has been confirmed</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Total Amount</span>
            <span>{totalAmount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Bank</span>
            <span>{bankOptions.find(b => b.id === selectedBank)?.name}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Card Number</span>
            <span>****{cardLastDigits}</span>
          </div>
          <div className="text-gray-600">
            <div className="font-medium mb-1">Transaction Hash</div>
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded border border-gray-200">
              <span className="text-sm break-all">{transactionHash}</span>
              <ExternalLink size={16} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setStep(1);
          setIsWalletConnected(false);
          setSelectedBank('');
          setCardLastDigits('');
          setPhoneNumber('');
          setTransactionHash('');
        }}
        className="w-full border-2 border-blue-500 text-blue-500 p-4 rounded-lg
                 hover:bg-blue-50 transition-colors duration-200 bg-white text-black"
      >
        Make Another Payment
      </button>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[
        { icon: Wallet, label: 'Connect' },
        { icon: Building2, label: 'Details' },
        { icon: CreditCard, label: 'Review' },
        { icon: Receipt, label: 'Complete' }
      ].map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <div className="w-12 h-px bg-gray-300 mx-2" />
          )}
          <div className={`flex flex-col items-center ${
            step > i ? 'text-blue-500' : 'text-gray-400'
          }`}>
            <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
              step > i
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 border border-gray-300'
            }`}>
              <s.icon size={20} />
            </div>
            <span className="text-xs mt-1">{s.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <CardTitle className="text-center text-2xl text-black ">
            ChainzPay
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepIndicator()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </CardContent>
      </Card>
    </>
  );
};

export default ChainzPayMVP;
