
import React from 'react';

interface ProductUpdateTemplateProps {
  name: string;
  updateTitle: string;
  updateContent: string;
  features?: string[];
  progressPercentage?: number;
  unsubscribeUrl?: string;
}

const ProductUpdateTemplate: React.FC<ProductUpdateTemplateProps> = ({
  name,
  updateTitle,
  updateContent,
  features = [],
  progressPercentage = 0,
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
          Development Update
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px 20px' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
          Hi {name}! 👋
        </h2>
        
        <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>
          {updateTitle}
        </h3>

        {/* Progress Bar */}
        {progressPercentage > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>Development Progress</span>
              <span style={{ color: '#374151', fontSize: '14px' }}>{progressPercentage}%</span>
            </div>
            <div style={{ backgroundColor: '#e5e7eb', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
              <div style={{ 
                backgroundColor: '#22c55e', 
                height: '100%', 
                width: `${progressPercentage}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        )}

        <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '20px' }}>
          {updateContent}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#1f2937', marginBottom: '15px' }}>Latest Features Completed:</h4>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#22c55e', fontSize: '16px', marginRight: '10px' }}>🎯</span>
                <span style={{ color: '#374151' }}>{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px', padding: '20px', marginBottom: '25px', textAlign: 'center' }}>
          <h4 style={{ color: '#1e40af', margin: '0 0 10px 0' }}>Stay Connected</h4>
          <p style={{ color: '#1e40af', margin: '0 0 15px 0' }}>
            Follow our progress and be first to know when we launch!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <a href="#" style={{ 
              backgroundColor: '#2563eb', 
              color: '#ffffff', 
              padding: '10px 20px', 
              textDecoration: 'none', 
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              Visit Website
            </a>
            <a href="#" style={{ 
              backgroundColor: '#ffffff', 
              color: '#2563eb', 
              padding: '10px 20px', 
              textDecoration: 'none', 
              borderRadius: '5px',
              border: '1px solid #2563eb',
              fontSize: '14px'
            }}>
              Follow Updates
            </a>
          </div>
        </div>

        <p style={{ color: '#374151', lineHeight: '1.6' }}>
          We appreciate your patience and support as we build something amazing for the pharmacy community.
        </p>

        <p style={{ color: '#374151', lineHeight: '1.6', marginTop: '25px' }}>
          Best regards,<br />
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

export default ProductUpdateTemplate;
