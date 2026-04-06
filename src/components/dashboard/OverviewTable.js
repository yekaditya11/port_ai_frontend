import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './OverviewTable.css';


const OverviewTable = ({ data = [] }) => {
  const getTrend = (val) => {
    if (val > 0) return 'up';
    return 'neutral';
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">Overview</h3>
      </div>
      <div className="table-content">
        <table className="overview-table">
          <thead>
            <tr>
              <th align="left">Type</th>
              <th align="center">Last 30 Days</th>
              <th align="left">Variance</th>
              <th align="center">Last 90 Days</th>
              <th align="left">Variance</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => {
                const trend30 = getTrend(row.last_30);
                const trend90 = getTrend(row.last_90);
                return (
                  <tr key={index}>
                    <td className="type-cell">{row.type}</td>
                    <td align="center">{row.last_30}</td>
                    <td className={`variance-cell ${trend30}`}>
                      {trend30 === 'up' ? <ChevronUp size={12} /> : trend30 === 'down' ? <ChevronDown size={12} /> : null}
                      {row.var_30}
                    </td>
                    <td align="center">{row.last_90}</td>
                    <td className={`variance-cell ${trend90}`}>
                      {trend90 === 'up' ? <ChevronUp size={12} /> : trend90 === 'down' ? <ChevronDown size={12} /> : null}
                      {row.var_90}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" align="center" style={{ padding: '20px' }}>No overview data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default OverviewTable;
