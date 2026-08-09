require('dotenv').config();
const axios = require('axios');

const sendGmail = async (to, subject, text, html = null) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          email: 'abhinav7ks@gmail.com',
          name: 'paradise'
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html || `<p>${text}</p>`,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }
    );

    console.log({
      to,
      subject,
      sender: {
        email: 'abhinav7ks@gmail.com',
        name: 'paradise'
      }
    });

    console.log('✅ Email sent successfully!');
    return { success: true, messageId: response.data?.messageId || 'sent' };
  } catch (error) {
    console.error('❌ Email sending failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

module.exports = {sendGmail};