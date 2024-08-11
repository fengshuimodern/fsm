"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LockIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { transferLocalStorageToFirestore } from '@/lib/authHelpers';
import { Loader2 } from 'lucide-react'; // Import the Loader2 icon

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Add these utility functions at the top of the file
const calculateFengShuiElement = (dob: string): string => {
  // Implement your Feng Shui element calculation logic here
  // This is a placeholder implementation
  return "Wood"; // Replace with actual calculation
};

const calculateLuckyDirection = (dob: string): string => {
  // Implement your lucky direction calculation logic here
  // This is a placeholder implementation
  return "North"; // Replace with actual calculation
};

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      onPaymentSuccess(result.paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Secure Payment</h3>
        <div className="mb-4">
          <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
            Credit or debit card
          </label>
          <div className="border rounded-md p-3">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Button 
          type="submit" 
          disabled={!stripe || processing} 
          className="w-full flex items-center justify-center"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
      </div>
      <div className="text-center text-sm text-gray-500">
        <p>Your payment is secure and encrypted.</p>
        <div className="flex justify-center space-x-2 mt-2">
          <LockIcon className="w-4 h-4" />
          <span>SSL Encrypted</span>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <img src="/visa-icon.png" alt="Visa" className="h-8" />
        <img src="/mastercard-icon.png" alt="Mastercard" className="h-8" />
        <img src="/amex-icon.png" alt="American Express" className="h-8" />
      </div>
    </form>
  );
};

export function PersonalInfoModal({ isOpen, onClose, onSubmit }) {
  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [floorPlan, setFloorPlan] = useState<File | null>(null);
  const [fengShuiElement, setFengShuiElement] = useState('');
  const [luckyDirection, setLuckyDirection] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFloorPlan(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setDisplayName(userData.displayName || '');
            setEmail(user.email || ''); // Set email from user object
            setDateOfBirth(userData.dateOfBirth || '');
            setGender(userData.gender || '');
            setAddress(userData.address || '');
            if (userData.dateOfBirth) {
              calculateFengShui(userData.dateOfBirth);
            }
          } else {
            // If user document doesn't exist, still set the email
            setEmail(user.email || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle the error appropriately (e.g., show an error message to the user)
        }
      }
    };

    fetchUserData();
  }, [user]);

  const calculateFengShui = (dob) => {
    const element = calculateFengShuiElement(dob);
    const direction = calculateLuckyDirection(dob);
    setFengShuiElement(element);
    setLuckyDirection(direction);
  };

  const handleDateOfBirthChange = (e) => {
    const newDob = e.target.value;
    setDateOfBirth(newDob);
    if (newDob) {
      calculateFengShui(newDob);
    } else {
      setFengShuiElement('');
      setLuckyDirection('');
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const userData = {
      displayName,
      email,
      dateOfBirth,
      gender,
      address,
      fengShuiElement,
      luckyDirection,
    };

    if (user) {
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      
      if (floorPlan) {
        const storageRef = ref(storage, `floorPlans/${user.uid}`);
        await uploadBytes(storageRef, floorPlan);
        const floorPlanUrl = await getDownloadURL(storageRef);
        await setDoc(doc(db, 'users', user.uid), { floorPlanUrl }, { merge: true });
      }
    } else {
      localStorage.setItem('tempUserData', JSON.stringify(userData));
      if (floorPlan) {
        localStorage.setItem('tempFloorPlan', URL.createObjectURL(floorPlan));
      }
    }

    // Initiate Stripe checkout
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user ? user.uid : null,
          amount: 1000, // Replace with your actual amount
        }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    // Here you would typically update your database to reflect the completed payment
    await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paymentIntentId: paymentIntent.id,
        userId: user ? user.uid : null 
      }),
    });

    onSubmit({ ...userData, paymentIntent });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showPayment ? 'Payment Information' : 'Personal Information for Analysis'}
          </DialogTitle>
        </DialogHeader>
        {!showPayment ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium">Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={handleDateOfBirthChange}
                  required
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium">Address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label htmlFor="floorPlan" className="block text-sm font-medium">Floor Plan (optional)</label>
              <input
                id="floorPlan"
                type="file"
                accept="image/*"
                onChange={handleFloorPlanChange}
                className="mt-1 block w-full"
              />
            </div>
            {dateOfBirth && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Feng Shui Analysis</h3>
                <p>Element: {fengShuiElement}</p>
                <p>Lucky Direction: {luckyDirection}</p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <Elements stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}