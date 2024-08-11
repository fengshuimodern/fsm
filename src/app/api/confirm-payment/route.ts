import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const { paymentIntentId, userId } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update the user's payment status in Firestore
      if (userId) {
        const userRef = db.collection('users').doc(userId);
        await userRef.update({ 
          paymentStatus: 'paid',
          paymentDate: new Date(),
          paymentAmount: paymentIntent.amount / 100 // Convert cents to dollars
        });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Error confirming payment:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}