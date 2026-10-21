/**
 * Sales contact configuration. Set VITE_WHATSAPP_NUMBER in .env (international format, no "+")
 * to replace the placeholder number across the whole site.
 */
export const WHATSAPP_NUMBER: string = import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890';

/**
 * Builds a wa.me deep link with a prefilled message
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp chat with sales in a new tab. Must be called from a user gesture (click/submit)
 * so the browser does not block the popup.
 */
export function openWhatsapp(message: string): void {
  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
}
