import React from 'react';

export const GovBanner: React.FC = () => {
  return (
    <div className="gov-banner">
      <div className="gov-banner-left">
        <div className="national-flag-icon"></div>
        <span>An official website of the Government of India | भारत सरकार की आधिकारिक वेबसाइट</span>
      </div>
      <div className="gov-banner-right">
        <span>National e-Governance Division (NeGD)</span>
      </div>
    </div>
  );
};
