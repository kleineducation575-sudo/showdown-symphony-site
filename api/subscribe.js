const VIDEO_LINK = 'https://youtu.be/YU1WAbjNWN4';

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

  const sendEmail = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  try {
    const [visitorResponse, ownerResponse] = await Promise.all([
      sendEmail({
        from: 'Showdown Symphony <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Showdown Symphony Video Access Link',
        text: `Thanks for your interest in Showdown Symphony!\n\nHere is your video: ${VIDEO_LINK}\n\nEnjoy!\nShowdown Symphony`,
        html: `<p>Thanks for your interest in Showdown Symphony!</p><p>Here is your video: <a href="${VIDEO_LINK}">${VIDEO_LINK}</a></p><p>Enjoy!<br>Showdown Symphony</p>`,
      }),
      sendEmail({
        from: 'Showdown Symphony <onboarding@resend.dev>',
        to: ['kleineducation575@gmail.com'],
        subject: 'New video access request - Showdown Symphony',
        text: `A visitor requested the video access link.\n\nEmail: ${email}\nWants updates/deals: ${notify === 'yes' ? 'Yes' : 'No'}`,
      }),
    ]);

    if (!visitorResponse.ok) {
      const errText = await visitorResponse.text();
      console.error('Resend error (visitor email):', errText);
      res.status(502).json({ success: false, data: 'Connection error – please try again.' });
      return;
    }

    if (!ownerResponse.ok) {
      const errText = await ownerResponse.text();
      console.error('Resend error (owner notification):', errText);
    }

    res.status(200).json({ success: true, data: 'Thanks! Check your email for the video access link.' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, data: 'Connection error – please try again.' });
  }
};
