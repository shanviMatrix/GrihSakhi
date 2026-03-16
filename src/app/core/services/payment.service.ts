import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

@Injectable({ providedIn: 'root' })
export class PaymentService {

  constructor(private http: HttpClient) {}

  createOrder(amount: number, bookingId: string) {
    return this.http.post(`${environment.backendUrl}/payment/create-order`, { amount, bookingId });
  }

  verifyPayment(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; bookingId: string }) {
    return this.http.post(`${environment.backendUrl}/payment/verify`, data);
  }

  openRazorpay(options: {
    orderId: string;
    amount: number;
    name: string;
    description: string;
    userEmail: string;
    userPhone: string;
    onSuccess: (response: any) => void;
    onFailure: () => void;
  }) {
    const rzpOptions = {
      key: environment.razorpay.keyId,
      amount: options.amount * 100,
      currency: 'INR',
      name: 'GrihSakhi',
      description: options.description,
      order_id: options.orderId,
      prefill: { email: options.userEmail, contact: options.userPhone },
      theme: { color: '#E91E63' },
      handler: (response: any) => options.onSuccess(response),
      modal: { ondismiss: () => options.onFailure() }
    };
    const rzp = new Razorpay(rzpOptions);
    rzp.open();
  }
}