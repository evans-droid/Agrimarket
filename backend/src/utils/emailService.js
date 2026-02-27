const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"AgriMarket" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

// Password reset email template
const sendPasswordResetEmail = async (email, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AgriMarket</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 30 minutes.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p>If the button doesn't work, copy and paste this link:</p>
          <p style="word-break: break-all; color: #10b981;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AgriMarket. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email,
    subject: 'Password Reset Request - AgriMarket',
    html
  });
};

// Welcome email template
const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to AgriMarket!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for joining AgriMarket! We're excited to have you on board.</p>
          <p>With AgriMarket, you can:</p>
          <ul>
            <li>Browse fresh agricultural products</li>
            <li>Shop from local farmers</li>
            <li>Track your orders in real-time</li>
            <li>Get exclusive deals and offers</li>
          </ul>
          <p>Start shopping today and experience the freshest products delivered to your doorstep!</p>
          <a href="${process.env.FRONTEND_URL}/products" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Start Shopping</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AgriMarket. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email,
    subject: 'Welcome to AgriMarket!',
    html
  });
};

// Order confirmation email
const sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .order-details {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          color: #10b981;
          text-align: right;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Thank you for your order!</h2>
          <p>Order Number: <strong>${order.order_number}</strong></p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            ${order.items.map(item => `
              <div class="order-item">
                <span>${item.product.name} x ${item.quantity}</span>
                <span>GH₵${(item.price_at_time * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="total">
              Total: GH₵${order.total_amount}
            </div>
          </div>

          <h3>Delivery Details</h3>
          <p><strong>Address:</strong> ${order.delivery_address}</p>
          <p><strong>Phone:</strong> ${order.phone_number}</p>

          <a href="${process.env.FRONTEND_URL}/orders/${order.id}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Track Order</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AgriMarket. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email,
    subject: `Order Confirmation #${order.order_number}`,
    html
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail
};