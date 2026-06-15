import React from 'react';
import { getStatusColor, getStatusBg } from '../utils/helpers';

export default function StatusBadge({ status }) {
  if (!status) return <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>—</span>;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
      color: getStatusColor(status), background: getStatusBg(status),
    }}>
      {status}
    </span>
  );
}
