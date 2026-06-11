interface EmailTemplateProps {
  firstName: string;
  email: string;
  phone: string;
  message: string;
}

export const EmailTemplate = (props: EmailTemplateProps) => {
  const { firstName, email, phone, message } = props;
  return (
  <div
    style={{
      fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      backgroundColor: '#f9fafb',
      padding: '0',
      margin: '0',
    }}
  >
    <table
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderCollapse: 'collapse',
      }}
    >
      {/* Header */}
      <tbody>
        <tr>
          <td
            style={{
              background: 'linear-gradient(135deg, #5d8e4d 0%, #4a7c3f 100%)',
              padding: '40px 20px',
              textAlign: 'center',
            }}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-bEKtE88k3hSb4xUt0ITB99hypoSH1s.png"
              alt="Benevora Initiative"
              style={{
                maxWidth: '120px',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </td>
        </tr>

        {/* Main Content */}
        <tr>
          <td style={{ padding: '40px 30px' }}>
            <h1
              style={{
                color: '#5d8e4d',
                fontSize: '28px',
                fontWeight: '600',
                margin: '0 0 10px 0',
                lineHeight: '1.2',
              }}
            >
              New Message Received
            </h1>
            <p
              style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: '0 0 30px 0',
              }}
            >
              From Benevora Initiative&apos;s Contact Form
            </p>

            {/* Message Details Box */}
            <div
              style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #86c1d9',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '30px',
              }}
            >
              <h2
                style={{
                  color: '#2c5f8d',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                }}
              >
                Contact Information
              </h2>
              <p
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  margin: '0 0 8px 0',
                }}
              >
                <strong>Name:</strong> {firstName}
              </p>
              <p
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  margin: '0 0 8px 0',
                }}
              >
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${email}`}
                  style={{ color: '#5d8e4d', textDecoration: 'none' }}
                >
                  {email}
                </a>
              </p>
              <p
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  margin: '0',
                }}
              >
                <strong>Phone:</strong> {phone}
              </p>
            </div>

            {/* Message Content */}
            <div
              style={{
                backgroundColor: '#fafbfc',
                borderLeft: '4px solid #5d8e4d',
                padding: '20px',
                marginBottom: '30px',
              }}
            >
              <h3
                style={{
                  color: '#5d8e4d',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Message
              </h3>
              <p
                style={{
                  color: '#374151',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  margin: '0',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                {message}
              </p>
            </div>

            {/* CTA Button */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <a
                href={`mailto:${email}`}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#5d8e4d',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                }}
              >
                Reply to {firstName}
              </a>
            </div>
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td
            style={{
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              padding: '30px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: '#6b7280',
                fontSize: '12px',
                margin: '0 0 10px 0',
              }}
            >
              This email was sent from your contact form at Benevora Initiative
            </p>
            <p
              style={{
                color: '#9ca3af',
                fontSize: '11px',
                margin: '0',
              }}
            >
              © 2026 Benevora Initiative. All rights reserved.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  );
};
