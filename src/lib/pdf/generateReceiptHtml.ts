import { CompletedOrder } from '../../types/pos.types';
import { formatPrice } from '../../utils/formatPrice.util';

export const generateReceiptHtml = (completedOrderDetails: CompletedOrder): string => {
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(completedOrderDetails.date);

  const itemsRows = completedOrderDetails.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 6px 0; border-bottom: 1px solid #eee;">${
            item.product.name
          }</td>
          <td style="text-align: center; padding: 6px 0;">x${item.quantity}</td>
          <td style="text-align: right; padding: 6px 0;">${formatPrice(
            item.product.price * item.quantity
          )} FCFA</td>
        </tr>
      `
    )
    .join('');

  return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <title>Reçu_${completedOrderDetails.id}</title>
          <style>
            @page { size: auto; margin: 0; }
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              width: 320px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 12px;
              color: #111;
              font-size: 12px;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .header h2 { margin: 0; font-size: 16px; color: #0B8F68; }
            .header p { margin: 3px 0; font-size: 11px; color: #666; }
            .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .totals td { padding: 3px 0; }
            .footer { text-align: center; margin-top: 15px; font-size: 10px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header text-center">
            <h2>PHARMACIE DE GARDE</h2>
            <p>Avenue de la Santé - Tél: +237 600 00 00 00</p>
            <p>Réf: <span class="bold">${completedOrderDetails.id}</span></p>
            <p>Date: ${formattedDate}</p>
          </div>

          <div class="divider"></div>

          <table>
            <thead>
              <tr style="border-bottom: 1px solid #222;">
                <th style="text-align: left; padding-bottom: 4px;">Article</th>
                <th style="text-align: center; padding-bottom: 4px;">Qté</th>
                <th style="text-align: right; padding-bottom: 4px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="divider"></div>

          <table class="totals">
            <tr>
              <td>Sous-total :</td>
              <td class="text-right">${formatPrice(completedOrderDetails.subtotal)} FCFA</td>
            </tr>
            ${
              completedOrderDetails.discountAmount > 0
                ? `<tr>
                    <td>Remise (${completedOrderDetails.discountPercent}%) :</td>
                    <td class="text-right">-${formatPrice(completedOrderDetails.discountAmount)} FCFA</td>
                  </tr>`
                : ''
            }
            <tr class="bold" style="font-size: 14px;">
              <td style="padding-top: 6px;">TOTAL NET :</td>
              <td class="text-right" style="padding-top: 6px; color: #0B8F68;">${formatPrice(
                completedOrderDetails.total
              )} FCFA</td>
            </tr>
            <tr>
              <td>Mode de règlement :</td>
              <td class="text-right bold" style="text-transform: uppercase;">${
                completedOrderDetails.method
              }</td>
            </tr>
          </table>

          <div class="divider"></div>

          <div class="footer">
            <p class="bold">Merci de votre confiance !</p>
            <p>Les médicaments ne sont ni repris ni échangés.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
};
