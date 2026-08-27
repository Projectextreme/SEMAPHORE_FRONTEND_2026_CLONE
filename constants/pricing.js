// What a team actually pays.
//
// Registration is priced per TEAM, not per event: one team pays this once, whether
// it entered a single event or all of them. Event.registrationFee is still stored
// and returned by the API — it just no longer decides what anybody is charged.
//
// Change this one number to change the price everywhere (order summary checkout,
// the per-event "Complete Payment" button, and the payment page's amount field).
export const TEAM_REGISTRATION_FEE = 2000;
