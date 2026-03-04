import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, telefono, email, mensaje } = req.body;

  // Basic server-side validation
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    await resend.emails.send({
      from: 'PEREZINDT Estudio <onboarding@resend.dev>',
      to: 'meliperezschwindt@gmail.com',
      reply_to: email,
      subject: `Nueva consulta de ${nombre}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <div style="background: #870142; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <p style="color: white; font-size: 18px; font-weight: 600; margin: 0;">Nueva consulta desde la web</p>
            <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 4px 0 0;">perezindtestudio.site</p>
          </div>
          <div style="background: #fafafa; border: 1px solid #e8e8e8; border-top: none; border-radius: 0 0 12px 12px; padding: 28px 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; width: 120px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Nombre</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; font-size: 14px; color: #111827;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Teléfono</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; font-size: 14px; color: #111827;">${telefono || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e8e8; font-size: 14px; color: #870142;"><a href="mailto:${email}" style="color: #870142;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Mensaje</td>
                <td style="padding: 10px 0; font-size: 14px; color: #111827; line-height: 1.6;">${mensaje.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e8e8e8;">
              <a href="mailto:${email}" style="display: inline-block; background: #870142; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 500;">
                Responder a ${nombre}
              </a>
            </div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'No se pudo enviar el mensaje. Intentá de nuevo.' });
  }
}


