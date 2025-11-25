export const generateOrderEmail = (orderId: string, customerName: string, total: number) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background-color: #7C3AED; padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; color: #333; line-height: 1.6; }
          .order-box { background-color: #F3E8FF; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #7C3AED; }
          .footer { background-color: #18181b; color: #888; padding: 20px; text-align: center; font-size: 12px; }
          .button { display: inline-block; background-color: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Commande Confirmée ! 🚀</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${customerName}</strong>,</p>
            <p>Merci pour votre commande sur ABC Informatique. Votre équipement est en cours de préparation.</p>
            
            <div class="order-box">
              <p><strong>Commande :</strong> #${orderId}</p>
              <p><strong>Montant Total :</strong> ${total.toLocaleString('fr-DZ')} DZD</p>
              <p><strong>Statut :</strong> En attente de validation</p>
            </div>
  
            <p>Nous vous contacterons bientôt pour la livraison.</p>
            
            <center>
              <a href="https://abc-store-seven.vercel.app/user" class="button">Voir ma commande</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 ABC Informatique. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };