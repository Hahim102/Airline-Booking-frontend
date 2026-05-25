import { useState } from 'react';
import { FileDown, Loader, AlertCircle } from 'lucide-react';
import { reportService, downloadFile } from '../../api/reportService';

const EXPORT_TYPES = [
  { value: 'excel', label: 'Excel (.xlsx)', icon: '📊' },
  { value: 'pdf', label: 'PDF (.pdf)', icon: '📄' }
];

export default function ExportReportModal({ onClose, exportType = 'users', analyticsType = 'DAY' }) {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFilename = () => {
    if (exportType === 'users') {
      return `users.${selectedFormat === 'excel' ? 'xlsx' : 'pdf'}`;
    } else if (exportType === 'analytics') {
      return `user-analytics-${analyticsType.toLowerCase()}.${selectedFormat === 'excel' ? 'xlsx' : 'pdf'}`;
    }
    return `report.${selectedFormat === 'excel' ? 'xlsx' : 'pdf'}`;
  };

  const handleExport = async () => {
    if (!selectedFormat) return;

    setLoading(true);
    setError(null);

    try {
      let blob;

      if (exportType === 'users') {
        if (selectedFormat === 'excel') {
          blob = await reportService.exportUsersExcel();
        } else {
          blob = await reportService.exportUsersPdf();
        }
      } else if (exportType === 'analytics') {
        if (selectedFormat === 'excel') {
          blob = await reportService.exportAnalyticsExcel(analyticsType);
        } else {
          blob = await reportService.exportAnalyticsPdf(analyticsType);
        }
      }

      const filename = getFilename();
      downloadFile(blob, filename);
      
      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err?.message || 'Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="text-sm text-outline">
        <p>
          {exportType === 'users'
            ? 'Select the format to export user data:'
            : `Select the format to export analytics data (${analyticsType}):`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Format Selection */}
      <div className="grid grid-cols-2 gap-4">
        {EXPORT_TYPES.map((format) => (
          <button
            key={format.value}
            onClick={() => setSelectedFormat(format.value)}
            disabled={loading}
            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
              selectedFormat === format.value
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant hover:border-primary/50'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-low'}`}
          >
            <span className="text-4xl">{format.icon}</span>
            <div className="text-center">
              <p className="font-bold text-sm text-on-surface">{format.label}</p>
            </div>
            {selectedFormat === format.value && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            )}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-outline-variant">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-outline-variant text-on-surface rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleExport}
          disabled={!selectedFormat || loading}
          className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileDown size={16} />
              Export
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 bg-surface-container-low rounded-lg text-xs text-outline">
        <p>The file will be downloaded automatically once the export is complete.</p>
      </div>
    </div>
  );
}
