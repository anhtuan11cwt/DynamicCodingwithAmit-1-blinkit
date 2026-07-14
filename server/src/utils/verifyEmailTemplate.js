const verifyEmailTemplate = ({ name, url }) => {
  return `
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Xác thực email</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:#1a8f4a;padding:24px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;">Blinkit</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 24px;">
                  <h2 style="margin:0 0 12px;color:#111827;font-size:20px;">Xin chào ${name || "bạn"}!</h2>
                  <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                    Cảm ơn bạn đã đăng ký tài khoản. Vui lòng xác thực địa chỉ email của bạn để kích hoạt tài khoản và bắt đầu sử dụng dịch vụ.
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td align="center" style="border-radius:8px;background:#1a8f4a;">
                        <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">
                          Xác thực Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;line-height:1.6;">
                    Nếu bạn không tạo tài khoản, bạn có thể bỏ qua email này. Link xác thực sẽ hết hạn sau một thời gian.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;background:#f9fafb;text-align:center;color:#9ca3af;font-size:12px;">
                  &copy; 2026 Blinkit. Mọi quyền được bảo lưu.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export default verifyEmailTemplate;
