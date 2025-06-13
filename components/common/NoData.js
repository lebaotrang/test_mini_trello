import React from 'react';

export default function NoData({ message = "No data available.", iconClass = "fa fa-inbox" }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 text-muted m-auto">
      <div className="mb-3" style={{ fontSize: '2.5rem' }}>
        <i className={iconClass}></i>
      </div>
      <p className="mb-0 fs-6">{message}</p>
    </div>
  );
}
