'use server';

export interface LeadInput {
  source: 'kpr' | 'kunjungan';
  name: string;
  phone: string;
  /** Free-form context, e.g. unit name and KPR simulation summary */
  detail?: string;
}

export type LeadResult = { ok: true } | { ok: false; error: string };

const PHONE_PATTERN = /^\+?[0-9\s-]{8,20}$/;

/**
 * Records a sales lead. When LEAD_WEBHOOK_URL is set, the lead is POSTed there as JSON
 * (works with Google Apps Script / Sheets, Make, Zapier, n8n, Slack or Discord webhooks).
 * Without it, the lead only appears in the server logs (Vercel → Logs).
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const name = String(input.name ?? '').trim();
  const phone = String(input.phone ?? '').trim();
  const detail = String(input.detail ?? '').trim().slice(0, 1000);
  const source = input.source === 'kpr' ? 'kpr' : 'kunjungan';

  if (name.length < 2 || name.length > 100) return { ok: false, error: 'Nama harus 2–100 karakter.' };
  if (!PHONE_PATTERN.test(phone)) return { ok: false, error: 'Nomor WhatsApp tidak valid.' };

  const lead = { source, name, phone, detail, createdAt: new Date().toISOString() };
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info('[lead]', JSON.stringify(lead));
    return { ok: true };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return { ok: true };
  } catch (err) {
    // Keep the lead in the logs so it is never lost, even when the webhook is down
    console.error('[lead] webhook failed', err, JSON.stringify(lead));
    return { ok: false, error: 'Gagal menyimpan data. Silakan lanjutkan lewat WhatsApp.' };
  }
}
