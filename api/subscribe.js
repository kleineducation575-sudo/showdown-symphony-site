module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, data: 'Method not allowed' });
    return;
  }

  const { email, notify } = req.body || {};

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, data: 'Please enter a valid email address.' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    res.status(500).json({ success: false, data: 'Connection error – please try again.' });
    return;
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Showdown Symphony <onboarding@resend.dev>',
        to: ['kleineducation575@gmail.com'],
        subject: 'New video access request - Showdown Symphony',
        text: `A visitor requested the video access link.\n\nEmail: ${email}\nWants updates/deals: ${notify === 'yes' ? 'Yes' : 'No'}`,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error('Resend error:', errText);
      res.status(502).json({ success: false, data: 'Connection error – please try again.' });
      return;
    }

    res.status(200).json({ success: true, data: "Thanks! We'll be in touch with your video access link soon." });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, data: 'Connection error – please try again.' });
  }
};
