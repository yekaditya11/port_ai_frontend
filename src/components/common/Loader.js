import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Loader component with consistent animation and styling.
 */
const Loader = ({ size = 32, color = '#22d3ee', className = '', ...props }) => {
  return (
    <div className={`app-loader-container ${className}`} {...props}>
      <Loader2 
        className="animate-spin" 
        size={size} 
        color={color} 
      />
    </div>
  );
};

export default Loader;
