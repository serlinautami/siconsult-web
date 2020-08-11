export * from './customhook';

export const readReportType = function(type) {
  switch (type) {
    case 'daily':
      return 'Harian';
    case 'monthly':
      return 'Bulanan';
    case 'yearly':
      return 'Tahunan';
    default:
      return '';
  }
};
