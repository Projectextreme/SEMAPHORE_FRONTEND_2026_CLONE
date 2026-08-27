// One team pays the registration fee once.
//
// The backend decides this, not the client: GET /api/registrations/is-payment-done
// looks at every payment belonging to the user AND to their team-mates, direct or
// linked through an event registration, and answers whether any of them is
// approved/verified. So a user whose team-mate paid, or who paid for an earlier
// event, is already covered — registering for another event must not send them
// back to the payment page.
//
// Every "pay ₹2000" surface funnels through this helper so they cannot disagree
// with each other about whether money is still owed.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://13.201.89.79';

/**
 * Ask the backend whether this user (or their team) already has an approved payment.
 * Never throws — a failed check resolves to "not paid", which keeps the payment
 * flow reachable rather than locking someone out of paying because of a hiccup.
 *
 * @returns {Promise<{isPaymentDone: boolean, status: string, checked: boolean}>}
 */
export async function fetchPaymentDone(token) {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (!authToken) return { isPaymentDone: false, status: 'none', checked: false };

  try {
    const res = await fetch(`${API_BASE_URL}/api/registrations/is-payment-done`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) return { isPaymentDone: false, status: 'none', checked: false };

    const data = await res.json();
    // The endpoint returns the same answer under several keys for compatibility.
    const isPaymentDone = Boolean(
      data?.is_payment_done ?? data?.isPaymentDone ?? data?.is_payment_approved ?? data?.hasApprovedPayment
    );
    return { isPaymentDone, status: data?.status || 'none', checked: true };
  } catch (err) {
    console.error('Failed to check payment status:', err);
    return { isPaymentDone: false, status: 'none', checked: false };
  }
}
