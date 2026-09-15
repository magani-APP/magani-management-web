import { Receipt } from "@/types/receipts.types";
import { RECEIPT_PAYMENT_METHOD_CONFIG, RECEIPT_PHARMACY_INFO } from "@/constants/receipts.constants";
import { formatPrice } from "@/utils/format.util";

export const generateTicketReceiptHtml = (receipt: Receipt): string => {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(receipt.date));

  const itemsRows = receipt.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 6px 0; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="text-align: center; padding: 6px 0;">x${item.quantity}</td>
          <td style="text-align: right; padding: 6px 0;">${formatPrice(item.unitPrice * item.quantity)} FCFA</td>
        </tr>
      `
    )
    .join("");

  const paymentLabel = RECEIPT_PAYMENT_METHOD_CONFIG[receipt.paymentMethod].label;

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>Reçu_${receipt.receiptNumber}</title>
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
          <h2>${RECEIPT_PHARMACY_INFO.name.toUpperCase()}</h2>
          <p>${RECEIPT_PHARMACY_INFO.address}</p>
          <p>${RECEIPT_PHARMACY_INFO.license}</p>
          <p>Reçu: <span class="bold">${receipt.receiptNumber}</span></p>
          <p>${formattedDate} à ${receipt.time}</p>
          <p>Client: ${receipt.client.name}</p>
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
            <td>Montant total :</td>
            <td class="text-right">${formatPrice(receipt.amount)} FCFA</td>
          </tr>
          ${
            receipt.discount > 0
              ? `<tr>
                  <td>Remise :</td>
                  <td class="text-right">-${formatPrice(receipt.discount)} FCFA</td>
                </tr>`
              : ""
          }
          <tr class="bold" style="font-size: 14px;">
            <td style="padding-top: 6px;">MONTANT PAYÉ :</td>
            <td class="text-right" style="padding-top: 6px; color: #0B8F68;">${formatPrice(receipt.amountPaid)} FCFA</td>
          </tr>
          <tr>
            <td>Mode de règlement :</td>
            <td class="text-right bold">${paymentLabel}</td>
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
