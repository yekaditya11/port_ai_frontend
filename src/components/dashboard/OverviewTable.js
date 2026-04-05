import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './OverviewTable.css';

const data = [
  { type: 'Fatality', last30: 0, var30: '0(0)', last90: 0, var90: '-100%(-1)', trend30: 'neutral', trend90: 'down' },
  { type: 'Serious Injury', last30: 1, var30: '100%(1)', last90: 1, var90: '100%(1)', trend30: 'up', trend90: 'up' },
  { type: 'Lost Time Injury', last30: 3, var30: '100%(3)', last90: 3, var90: '-40%(-2)', trend30: 'up', trend90: 'down' },
  { type: 'Environment', last30: 8, var30: '100%(8)', last90: 8, var90: '700%(7)', trend30: 'up', trend90: 'up' },
  { type: 'Asset Damage', last30: 24, var30: '100%(24)', last90: 29, var90: '1350%(27)', trend30: 'up', trend90: 'up' },
];

const OverviewTable = () => {
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
            {data.map((row, index) => (
              <tr key={index}>
                <td className="type-cell">{row.type}</td>
                <td align="center">{row.last30}</td>
                <td className={`variance-cell ${row.trend30}`}>
                  {row.trend30 === 'up' ? <ChevronUp size={12} /> : row.trend30 === 'down' ? <ChevronDown size={12} /> : null}
                  {row.var30}
                </td>
                <td align="center">{row.last90}</td>
                <td className={`variance-cell ${row.trend90}`}>
                  {row.trend90 === 'up' ? <ChevronUp size={12} /> : row.trend90 === 'down' ? <ChevronDown size={12} /> : null}
                  {row.var90}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewTable;
