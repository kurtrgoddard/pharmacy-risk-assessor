
import React from 'react';

interface WelcomeEmailTemplateProps {
  name: string;
  position: number;
  unsubscribeUrl?: string;
}

const WelcomeEmailTemplate: React.FC<WelcomeEmailTemplateProps> = ({
  name,
  position,
  unsubscribeUrl = '#'
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2563eb', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '28px' }}>
          🏥 PharmAssess
        </h1>
        <p style={{ color: '#dbeafe', margin: '5px 0 0 0', fontSize: '16px' }}>
          Instant NAPRA-Compliant Risk Assessment
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
          Welcome to the PharmAssess Waitlist, {name}! 🎉
        </h2>
        
        <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', marginBottom: '25px', textAlign: 'center' }}>
          <h3 style={{ color: '#15803d', margin: '0 0 10px 0', fontSize: '24px' }}>
            You're #{position} on our waitlist!
          </h3>
          <p style={{ color: '#166534', margin: '0', fontSize: '16px' }}>
            Your spot is secured for early access
          </p>
        </div>

        <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '20px' }}>
          Thank you for joining the PharmAssess revolution! We're building something that will transform how pharmacists handle compound risk assessments.
        </p>

        <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>What you get as an early member:</h3>
        
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '10px' }}>✅</span>
            <span style={{ color: '#374151' }}><strong>First access</strong> when we launch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '10px' }}>✅</span>
            <span style={{ color: '#374151' }}><strong>50% early bird discount</strong> for the first 3 months</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '10px' }}>✅</span>
            <span style={{ color: '#374151' }}><strong>Priority support</strong> and onboarding</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '10px' }}>✅</span>
            <span style={{ color: '#374151' }}><strong>Exclusive updates</strong> on our progress</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
          <h4 style={{ color: '#1e40af', margin: '0 0 10px 0' }}>Coming Soon:</h4>
          <ul style={{ color: '#1e40af', margin: '0', paddingLeft: '20px' }}>
            <li>Reduce assessment time from 30+ minutes to under 2 minutes</li>
            <li>Automatic NAPRA compliance checking</li>
            <li>Real-time hazard data from trusted pharmaceutical databases</li>
            <li>Professional PDF reports for your files</li>
          </ul>
        </div>

        <p style={{ color: '#374151', lineHeight: '1.6' }}>
          We'll keep you updated on our progress and let you know as soon as we're ready for you to try PharmAssess.
        </p>

        <p style={{ color: '#374151', lineHeight: '1.6', marginTop: '25px' }}>
          Best regards,<br>
          <strong>The PharmAssess Team</strong><br>
          <em>Made with ❤️ in New Brunswick, Canada</em>
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

export default WelcomeEmailTemplate;
