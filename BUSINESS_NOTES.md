# Known Business Limitations

## Cart Persistence
The shopping cart is stored in the browser's localStorage, not on the server. This means:

- If a user adds items to the cart and closes the browser tab **without logging out**, the cart remains in localStorage.
- If another user later opens the same browser and logs into their own account, they may inherit the previous user's cart until they log out.
- Explicit logout clears the cart (we implemented this fix across Header, UserLayout, and AdminLayout).

**Future improvement:** per-user cart persisted in the database (e.g., `cart_items` table keyed by `auth.uid()`).
