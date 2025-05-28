
import React from 'react';

interface EarlyBirdOfferTemplateProps {
  name: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  expirationDate: string;
  ctaUrl: string;
  unsubscribeUrl?: string;
}

const EarlyBirdOfferTemplate: React.FC<EarlyBirdOfferTemplateProps> = ({
  name,
  discountPercentage,
  originalPrice,
  discountedPrice,
  expirationDate,
  ctaUrl,
  unsubscribeUrl = '#'
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#dc2626', padding: '25px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: '0', fontSize: '30px' }}>
          🔥 Limited Time Offer
        </h1>
        <p style={{ color: '#fecaca', margin: '10px 0 0 0', fontSize: '16px' }}>
          Exclusive Early Bird Pricing
        </p>
      </div>

      {/* Urgency Banner */}
      <div style={{ backgroundColor: '#fef2f2', border: '2px solid #dc2626', padding: '15px', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', margin: '0', fontSize: '16px', fontWeight: 'bold' }}>
          ⏰ Offer expires {expirationDate} - Don't miss out!
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
          Hi {name}! 👋
        </h2>
        
        <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '25px' }}>
          As a valued member of our waitlist, you're eligible for our exclusive early bird pricing before we open to the general public.
        </p>

        {/* Pricing Box */}
        <div style={{ backgroundColor: '#f0fdf4', border: '3px solid #22c55e', borderRadius: '15px', padding: '30px', marginBottom: '30px', textAlign: 'center' }}>
          <h3 style={{ color: '#15803d', margin: '0 0 20px 0', fontSize: '24px' }}>
            Save {discountPercentage}% on PharmAssess
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <span style={{ 
              color: '#9ca3af', 
              fontSize: '24px', 
              textDecoration: 'line-through',
              display: 'block',
              marginBottom: '5px'
            }}>
              ${originalPrice}/month
            </span>
            <span style={{ 
              color: '#059669', 
              fontSize: '36px', 
              fontWeight: 'bold'
            }}>
              ${discountedPrice}/month
            </span>
          </div>

          <p style={{ color: '#166534', margin: '0 0 25px 0', fontSize: '16px' }}>
            Lock in this price for your first 6 months!
          </p>

          <a href={ctaUrl} style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Claim Your Discount →
          </a>
        </div>

        {/* What's Included */}
        <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>
          Everything included in your subscription:
        </h3>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '12px' }}>✅</span>
            <span style={{ color: '#374151' }}>Unlimited NAPRA-compliant risk assessments</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '12px' }}>✅</span>
            <span style={{ color: '#374151' }}>Real-time hazard data from 50+ trusted sources</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '12px' }}>✅</span>
            <span style={{ color: '#374151' }}>Professional PDF report generation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '12px' }}>✅</span>
            <span style={{ color: '#374151' }}>Priority customer support</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '12px' }}>✅</span>
            <span style={{ color: '#374151' }}>Automatic compliance updates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#22c55e', fontSize: '20px', marginRight: '12px' }}>✅</span>
            <span style={{ color: '#374151' }}>Team collaboration features</span>
          </div>
        </div>

        {/* Social Proof */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
          <h4 style={{ color: '#1e293b', margin: '0 0 15px 0' }}>What early users are saying:</h4>
          <blockquote style={{ color: '#475569', fontStyle: 'italic', margin: '0 0 10px 0', borderLeft: '3px solid #3b82f6', paddingLeft: '15px' }}>
            "PharmAssess reduced our assessment time from 45 minutes to 3 minutes. It's a game-changer for our workflow."
          </blockquote>
          <p style={{ color: '#64748b', margin: '0', fontSize: '14px' }}>
            - Dr. Sarah Chen, Hospital Pharmacist
          </p>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <a href={ctaUrl} style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '15px 40px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Get {discountPercentage}% Off - Limited Time
          </a>
          <p style={{ color: '#6b7280', margin: '10px 0 0 0', fontSize: '12px' }}>
            Offer expires {expirationDate}
          </p>
        </div>

        <p style={{ color: '#374151', lineHeight: '1.6', fontSize: '14px', textAlign: 'center' }}>
          This exclusive offer is only available to our waitlist members and expires soon. Don't miss your chance to save on the tool that will revolutionize your risk assessment process.
        </p>

        <p style={{ color: '#374151', lineHeight: '1.6', marginTop: '25px' }}>
          Best regards,<br>
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

export default EarlyBirdOfferTemplate;
