import { setDefaultResultOrder } from "node:dns";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/** Vermindert mislukte SMTP-pogingen naar Gmail vanaf serverless (IPv6/connectiviteit). */
setDefaultResultOrder("ipv4first");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const DEFAULT_TO = "jaime21spam@gmail.com";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeGmailPassword(raw: string | undefined) {
  if (!raw) return "";
  return raw.replace(/\s/g, "").replace(/^["']+|["']+$/g, "");
}

export async function POST(req: NextRequest) {
  const user = process.env.GMAIL_USER?.trim();
  const pass = normalizeGmailPassword(process.env.GMAIL_APP_PASSWORD);
  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;

  if (!user || !pass) {
    console.error("[contact] Missing GMAIL_USER or GMAIL_APP_PASSWORD");
    return NextResponse.json(
      { error: "Mail is not configured on the server." },
      { status: 503 },
    );
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, address, message } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "";
  const safeAddress = address ? escapeHtml(address) : "";
  const safeMessage = message ? escapeHtml(message) : "";

  const textLines = [
    `Contactformulier newww.website`,
    ``,
    `Naam / Name: ${name}`,
    `E-mail: ${email}`,
    phone ? `Telefoon: ${phone}` : null,
    address ? `Adres / bedrijf: ${address}` : null,
    message ? `\nBericht:\n${message}` : null,
  ].filter(Boolean) as string[];

  const textBody = textLines.join("\n");

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #111; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <p style="color: #FF3D00; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 4px;">New message</p>
        <p style="color: #fff; font-size: 20px; font-weight: 800; margin: 0;">newww.website contact form</p>
      </div>
      <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e8e8e8; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #888; font-size: 13px; width: 120px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #111; font-size: 13px; font-weight: 600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #111; font-size: 13px;"><a href="mailto:${safeEmail}" style="color: #FF3D00;">${safeEmail}</a></td>
          </tr>
          ${phone ? `<tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #888; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #111; font-size: 13px; font-weight: 600;">${safePhone}</td>
          </tr>` : ""}
          ${address ? `<tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #888; font-size: 13px;">Address</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; color: #111; font-size: 13px; font-weight: 600;">${safeAddress}</td>
          </tr>` : ""}
        </table>
        ${message ? `<div style="margin-top: 24px;">
          <p style="color: #888; font-size: 13px; margin: 0 0 8px;">Message</p>
          <p style="color: #111; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>` : ""}
        <div style="margin-top: 28px;">
          <a href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: Your message to newww.website")}"
            style="display: inline-block; background: #111; color: #fff; border-radius: 999px; padding: 12px 24px; font-size: 14px; font-weight: 700; text-decoration: none;">
            Reply to ${safeName} ↗
          </a>
        </div>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    socketTimeout: 25_000,
  });

  try {
    await transporter.sendMail({
      from: `"newww.website" <${user}>`,
      to,
      subject: `[newww.site] Nieuw formulier · ${name.replace(/\s+/g, " ").slice(0, 60)}`,
      text: textBody,
      html,
      replyTo: email,
    });
    console.info("[contact] Sent ok", { to, from: user });
  } catch (err: unknown) {
    const extras =
      err && typeof err === "object"
        ? {
            msg: err instanceof Error ? err.message : null,
            code: "code" in err ? String((err as { code?: unknown }).code) : null,
            response:
              "response" in err ? String((err as { response?: unknown }).response).slice(0, 240) : null,
          }
        : {};
    console.error("[contact] sendMail failed", extras, err);
    return NextResponse.json({ error: "Could not send email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
