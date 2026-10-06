const net = require('net');
const tls = require('tls');

async function sendWaitlistEmail(toEmail, position) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'no-reply@varsha.com';

  const subject = `You're in the Pipeline! #${position} on FLUX`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #171e19; color: #ffffff; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #171e19; border: 4px solid #171e19; padding: 30px; border-radius: 12px;">
        <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">FLUX<span style="color: #ffe17c;">.</span></h1>
        <div style="background-color: #ffe17c; color: #171e19; display: inline-block; padding: 4px 12px; font-weight: bold; border-radius: 20px; font-size: 12px; text-transform: uppercase; margin-bottom: 20px;">
          Spot Reserved #${position}
        </div>
        <h2 style="font-size: 24px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px;">YOU'RE IN THE PIPELINE.</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #333333; margin-bottom: 25px;">
          Success! We've reserved your spot on the waitlist. The digital publishing revolution starts now.
        </p>
        <div style="background-color: #f8f9fa; border-left: 4px solid #ffe17c; padding: 20px; margin-bottom: 25px;">
          <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0;">NEXT STEP: VERIFICATION</h3>
          <p style="font-size: 14px; color: #666666; margin: 0;">We've sent a magic link to <strong style="color: #171e19;">${toEmail}</strong>. Confirm your email to secure your position on the leaderboard.</p>
        </div>
        <p style="font-size: 12px; color: #888888;">© 2026 Varsha Blog.</p>
      </div>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log(`[Mailer] Waitlist confirmation email queued for ${toEmail} (#${position}). Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env to deliver live emails.`);
    return { ok: true, simulated: true };
  }

  return new Promise((resolve) => {
    try {
      const isSecure = port === 465;
      let socket = isSecure ? tls.connect(port, host, { rejectUnauthorized: false }) : net.connect(port, host);
      let step = 0;

      const send = (cmd) => {
        socket.write(cmd + '\r\n');
      };

      const handleData = (data) => {
        const msg = data.toString();

        if (step === 0 && msg.startsWith('220')) {
          step = 1;
          send('EHLO ' + (host || 'localhost'));
        } else if (step === 1 && (msg.startsWith('250') || msg.includes('250 '))) {
          if (!isSecure && msg.includes('STARTTLS')) {
            step = 2;
            send('STARTTLS');
          } else {
            step = 3;
            send('AUTH LOGIN');
          }
        } else if (step === 2 && msg.startsWith('220')) {
          socket.removeAllListeners('data');
          const tlsSocket = tls.connect({ socket, rejectUnauthorized: false }, () => {
            step = 3;
            tlsSocket.write('AUTH LOGIN\r\n');
          });
          socket = tlsSocket;
          tlsSocket.on('data', handleData);
          tlsSocket.on('error', (err) => resolve({ ok: false, error: err.message }));
        } else if (step === 3 && msg.startsWith('334')) {
          step = 4;
          send(Buffer.from(user).toString('base64'));
        } else if (step === 4 && msg.startsWith('334')) {
          step = 5;
          send(Buffer.from(pass).toString('base64'));
        } else if (step === 5 && msg.startsWith('235')) {
          step = 6;
          send(`MAIL FROM:<${from}>`);
        } else if (step === 6 && msg.startsWith('250')) {
          step = 7;
          send(`RCPT TO:<${toEmail}>`);
        } else if (step === 7 && msg.startsWith('250')) {
          step = 8;
          send('DATA');
        } else if (step === 8 && msg.startsWith('354')) {
          step = 9;
          const mime = [
            `From: "Varsha Blog" <${from}>`,
            `To: <${toEmail}>`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            htmlBody,
            '.'
          ].join('\r\n');
          send(mime);
        } else if (step === 9 && msg.startsWith('250')) {
          step = 10;
          send('QUIT');
          console.log(`[Mailer] Confirmation email successfully delivered to ${toEmail}`);
          resolve({ ok: true });
        }
      };

      socket.on('data', handleData);

      socket.on('error', (err) => {
        console.error('[Mailer] SMTP Connection Error:', err.message);
        resolve({ ok: false, error: err.message });
      });
    } catch (e) {
      console.error('[Mailer] Exception:', e.message);
      resolve({ ok: false, error: e.message });
    }
  });
}

module.exports = { sendWaitlistEmail };
