import React, { useState } from 'react';
import { Wallet, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';

const PaymentDashboard = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    amount: ''
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWalletConnect = () => {
    setProcessing(true);
    setTimeout(() => {
      setWalletConnected(true);
      setProcessing(false);
    }, 1000);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert className="bg-green-50">
            <AlertDescription className="text-green-700 text-center py-2">
              Credit Card Bill Paid Successfully! Thank you for using ChainzPay.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ChainzPay</CardTitle>
        <CardDescription>
          Secure crypto payments made simple
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!walletConnected ? (
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleWalletConnect}
          >
            <Wallet className="w-4 h-4" />
            {processing ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : !showCardForm ? (
          <div className="space-y-4">
            <Alert className="bg-green-50">
              <AlertDescription className="text-green-700">
                Wallet connected successfully!
              </AlertDescription>
            </Alert>
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowCardForm(true)}
            >
              <CreditCard className="w-4 h-4" />
              Pay Credit Card Bill
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="card-number">
                Card Number
              </label>
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="expiry">
                  Expiry Date
                </label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="cvv">
                  CVV
                </label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="amount">
                Bill Amount
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter bill amount"
                value={cardDetails.amount}
                onChange={(e) => setCardDetails({ ...cardDetails, amount: e.target.value })}
              />
            </div>
            <Button
              onClick={() => {
                setProcessing(true);
                setTimeout(() => {
                  setProcessing(false);
                  setSuccess(true);
                }, 2000);
              }}
              className="w-full flex items-center justify-center gap-2 mt-6"
            >
              {processing ? (
                'Processing Bill Payment...'
              ) : (
                <>
                  Process Payment
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentDashboard;
