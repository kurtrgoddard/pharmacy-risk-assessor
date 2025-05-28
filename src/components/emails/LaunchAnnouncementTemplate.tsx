
import React from 'react';

interface LaunchAnnouncementTemplateProps {
  name: string;
  position: number;
  earlyAccessUrl: string;
  unsubscribeUrl?: string;
}

const LaunchAnnouncementTemplate: React.FC<LaunchAnnouncementTemplateProps> = ({
  name,
  position,
  earlyAccessUrl,
  unsubscribeUrl = '#'
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#059669', padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '32px' }}>
          🎉 We're Live!
        </h1>
        <p style={{ color: '#d1fae5', margin: '10px 0 0 0', fontSize: '18px' }}>
          PharmAssess is officially launched
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 20px' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>
          Hi {name}, the wait is over! 🚀
        </h2>
        
        <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '12px', padding: '25px', marginBottom: '30px', textAlign: 'center' }}>
          <h3 style={{ color: '#15803d', margin: '0 0 15px 0', fontSize: '28px' }}>
            Your Early Access is Ready!
          </h3>
          <p style={{ color: '#166534', margin: '0 0 20px 0', fontSize: '16px' }}>
            As waitlist member #{position}, you get first access to PharmAssess
          </p>
          <a href={earlyAccessUrl} style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Start Your Free Trial →
          </a>
        </div>

        <h3 style={{ color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>
          What You Get Today:
        </h3>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', padding: '15px', backgroundColor: '#fefefe', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <span style={{ color: '#059669', fontSize: '24px', marginRight: '15px', marginTop: '2px' }}>⚡</span>
            <div>
              <strong style={{ color: '#1f2937' }}>2-Minute Risk Assessments</strong>
              <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Complete NAPRA-compliant assessments in under 2 minutes instead of 30+</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', padding: '15px', backgroundColor: '#fefefe', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <span style={{ color: '#059669', fontSize: '24px', marginRight: '15px', marginTop: '2px' }}>🏥</span>
            <div>
              <strong style={{ color: '#1f2937' }}>Real-Time Hazard Data</strong>
              <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Access live data from PubChem, NIOSH, and other trusted sources</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', padding: '15px', backgroundColor: '#fefefe', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <span style={{ color: '#059669', fontSize: '24px', marginRight: '15px', marginTop: '2px' }}>📋</span>
            <div>
              <strong style={{ color: '#1f2937' }}>Professional PDF Reports</strong>
              <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Generate compliant reports ready for regulatory review</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', padding: '15px', backgroundColor: '#fefefe', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <span style={{ color: '#059669', fontSize: '24px', marginRight: '15px', marginTop: '2px' }}>🛡️</span>
            <div>
              <strong style={{ color: '#1f2937' }}>Automatic NAPRA Compliance</strong>
              <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Built-in compliance checking with latest NAPRA guidelines</p>
            </div>
          </div>
        </div>

        {/* Early Bird Pricing */}
        <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '12px', padding: '25px', marginBottom: '30px', textAlign: 'center' }}>
          <h3 style={{ color: '#92400e', margin: '0 0 15px 0' }}>
            🔥 Early Bird Special - 50% OFF
          </h3>
          <p style={{ color: '#a16207', margin: '0 0 10px 0', fontSize: '18px' }}>
            <strike style={{ opacity: 0.7 }}>$299/month</strike> → <strong>$149/month</strong>
          </p>
          <p style={{ color: '#a16207', margin: '0', fontSize: '14px' }}>
            Lock in this price for your first 6 months!
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href={earlyAccessUrl} style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '15px 40px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Get Started Now →
          </a>
        </div>

        <p style={{ color: '#374151', lineHeight: '1.6', textAlign: 'center' }}>
          Thank you for believing in our vision to revolutionize pharmaceutical risk assessment. We can't wait to see how PharmAssess transforms your workflow!
        </p>

        <p style={{ color: '#374151', lineHeight: '1.6', marginTop: '25px', textAlign: 'center' }}>
          Questions? Reply to this email or contact our support team.<br />
          <strong>The PharmAssess Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
          PharmAssess - Revolutionizing Pharmaceutical Risk Assessment
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>
          <a href={unsubscribeUrl} style={{ color: '#6b7280' }}>Unsubscribe</a> | 
          <a href="mailto:support@pharmassess.com" style={{ color: '#6b7280', marginLeft: '10px' }}>Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default LaunchAnnouncementTemplate;
