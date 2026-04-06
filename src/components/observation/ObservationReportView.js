import React from 'react';

const ObservationReportView = () => {
  const tableData = [
    { kpi: 'New Observations', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 23, previous: 7, change: 16, percentage: '229 % \u25b2', percentageColor: 'text-red', trend: '\u2191' },
    { kpi: '--', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 74, previous: 12, change: 62, percentage: '517 % \u25b2', percentageColor: 'text-red', trend: '\u2190' },
    { kpi: 'Closed on Time', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 10, previous: 0, change: 10, percentage: '0 %', percentageColor: '', trend: '\u2191' },
    { kpi: 'Overdue', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: '--', previous: '--', change: '--', percentage: '--', percentageColor: '', trend: '\u2190' },
    { kpi: 'Escalated', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 0, previous: 0, change: 0, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    { kpi: 'Near Miss', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 5, previous: 0, change: 5, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    // Header row 
    { isHeader: true, kpi: 'TOP 5 RISK CATEGORIES' },
    { kpi: '--', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 18, previous: 3, change: 15, percentage: '500 % \u25b2', percentageColor: 'text-red', trend: '\u2191' },
    { kpi: 'Slip / Trip / Fall Same Level', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 9, previous: 0, change: 9, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    { kpi: 'Others', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 9, previous: 1, change: 8, percentage: '800 % \u25b2', percentageColor: 'text-red', trend: '\u2193' },
    { kpi: 'Entrapment', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 4, previous: 0, change: 4, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    { kpi: 'Grease buildup', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 3, previous: 0, change: 3, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    // Header row
    { isHeader: true, kpi: 'WORK AREA' },
    { kpi: 'Container Berth', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 11, previous: 1, change: 10, percentage: '1000 % \u25b2', percentageColor: 'text-red', trend: '\u2191' },
    { kpi: 'Admin. Building', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 11, previous: 0, change: 11, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    { kpi: 'Auxiliary facilities', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 9, previous: 0, change: 9, percentage: '0 %', percentageColor: '', trend: '\u2193' },
    { kpi: 'Bilge facility', period: '30Days', dateRange: '7 Mar 2026 - 5 Apr 2026', current: 9, previous: 0, change: 9, percentage: '0 %', percentageColor: '', trend: '\u2193' }
  ];

  return (
    <div className="obs-report-container">
      <table className="obs-report-table">
        <thead>
          <tr>
            <th>KPI</th>
            <th>PERIOD</th>
            <th>DATE RANGE</th>
            <th>CURRENT</th>
            <th>PREVIOUS</th>
            <th>CHANGE</th>
            <th>PERCENTAGE</th>
            <th>90 DAYS TREND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => {
            if (row.isHeader) {
              return (
                <tr key={index} className="header-row">
                  <td colSpan="9">{row.kpi}</td>
                </tr>
              );
            }

            return (
              <tr key={index}>
                <td>
                  <span className={row.kpi !== '--' ? 'kpi-link' : ''}>{row.kpi}</span>
                </td>
                <td>{row.period}</td>
                <td>{row.dateRange}</td>
                <td>{row.current}</td>
                <td>{row.previous}</td>
                <td>{row.change}</td>
                <td className={row.percentageColor}>{row.percentage}</td>
                <td>
                  <span className="trend-arrow">{row.trend}</span>
                </td>
                <td>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>⋮</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ObservationReportView;
