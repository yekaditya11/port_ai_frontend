import React from 'react';
import { MapPin } from 'lucide-react';

const HeatMap = () => {
  return (
    <div className="chart-card no-padding">
      <div className="card-header-padding">
        <h3 className="chart-title">Location Heat Map</h3>
      </div>
      <div className="map-placeholder" style={{ 
        height: '280px', 
        backgroundColor: '#1a365d',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=12.9716,77.5946&zoom=15&size=600x300&maptype=satellite&key=")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(0.5) contrast(1.2)'
      }}>
        {/* Mock pins */}
        <div style={{ position: 'absolute', top: '40%', left: '60%', color: '#ef4444' }}>
          <MapPin size={32} strokeWidth={3} fill="rgba(239, 68, 68, 0.3)" />
        </div>
        
        {/* Map controls mockup */}
        <div className="map-controls" style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}>
          <div style={{ padding: '5px', borderRadius: '4px', background: '#fff', color: '#000', fontSize: '14px', textAlign: 'center', cursor: 'pointer' }}>+</div>
          <div style={{ padding: '5px', borderRadius: '4px', background: '#fff', color: '#000', fontSize: '14px', textAlign: 'center', cursor: 'pointer' }}>-</div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
