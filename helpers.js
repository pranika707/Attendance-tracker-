export function exportToCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${row[h] ?? ''}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getStatusColor(status) {
  if (status === 'present') return '#10b981';
  if (status === 'absent') return '#ef4444';
  if (status === 'late') return '#f59e0b';
  return '#9ca3af';
}

export function getStatusBg(status) {
  if (status === 'present') return '#ecfdf5';
  if (status === 'absent') return '#fef2f2';
  if (status === 'late') return '#fffbeb';
  return '#f3f4f6';
}
