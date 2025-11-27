export const generateOrderEmail = (orderId: string, customerName: string, total: number) => {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; background-color: #f4f4f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #7C3AED; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Commande Confirmée ! 🚀</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Bonjour <strong>${customerName}</strong>,</p>
          <p>Merci pour votre commande. Nous la préparons avec soin.</p>
          <div style="background-color: #F3E8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Commande :</strong> #${orderId.slice(0, 8)}</p>
            <p><strong>Total :</strong> ${total.toLocaleString('fr-DZ')} DZD</p>
          </div>
          <a href="https://abc-store-seven.vercel.app/user/orders" style="display: inline-block; background-color: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma commande</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateShippedEmail = (orderId: string, customerName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; background-color: #f4f4f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #2563EB; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Votre Colis est en Route ! 🚚</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Bonjour <strong>${customerName}</strong>,</p>
          <p>Bonne nouvelle ! Votre commande <strong>#${orderId.slice(0, 8)}</strong> a été expédiée.</p>
          <p>Elle arrivera chez vous dans les 24 à 48 heures.</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://abc-store-seven.vercel.app/user/orders" style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre la livraison</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};