'use client';

import { useState } from 'react';

interface ExportOptions {
  includeSessions: boolean;
  includeDevLogs: boolean;
  includeStats: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface ExportHistoryItem {
  filename: string;
  size: number;
  createdAt: string;
  downloadUrl: string;
}

export default function DataManager() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeSessions: true,
    includeDevLogs: true,
    includeStats: true
  });
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'history'>('export');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options = { ...exportOptions };
      if (dateRange.start && dateRange.end) {
        options.dateRange = dateRange;
      }

      const response = await fetch('http://localhost:3001/api/export/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      const data = await response.json();

      if (data.success) {
        // Download the file
        const link = document.createElement('a');
        link.href = `http://localhost:3001${data.data.downloadUrl}`;
        link.download = `devpulse_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Refresh history
        fetchExportHistory();
        
        alert('Export completed successfully! File is downloading.');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchExportHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/export/history');
      const data = await response.json();
      
      if (data.success) {
        setExportHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch export history:', error);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }

    setIsImporting(true);
    try {
      const fileContent = await importFile.text();
      const importData = JSON.parse(fileContent);

      // First validate
      const validateResponse = await fetch('http://localhost:3001/api/export/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: fileContent
      });

      const validateData = await validateResponse.json();

      if (!validateData.success) {
        throw new Error(`Validation failed: ${validateData.errors?.join(', ') || validateData.message}`);
      }

      // Ask for confirmation
      const confirmed = window.confirm(
        `This will import:\n` +
        `• ${validateData.data.sessions} sessions\n` +
        `• ${validateData.data.devLogs} dev logs\n` +
        `• ${validateData.data.dailyStats} daily stats\n\n` +
        `Existing data with matching IDs will be replaced. Continue?`
      );

      if (!confirmed) {
        return;
      }

      // Perform import
      const importResponse = await fetch('http://localhost:3001/api/export/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: fileContent
      });

      const importResult = await importResponse.json();

      if (importResult.success) {
        alert(
          `Import completed successfully!\n` +
          `• ${importResult.data.sessionsImported} sessions imported\n` +
          `• ${importResult.data.devLogsImported} dev logs imported\n` +
          `• ${importResult.data.statsImported} stats imported`
        );
        setImportFile(null);
        
        // Trigger page refresh to show new data
        window.location.reload();
      } else {
        throw new Error(importResult.message);
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load history on component mount
  useState(() => {
    fetchExportHistory();
  });

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Data Management</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Import
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Export Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="exportSessions"
                    checked={exportOptions.includeSessions}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      includeSessions: e.target.checked
                    })}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <label htmlFor="exportSessions" className="text-gray-300">
                    Include Sessions
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="exportDevLogs"
                    checked={exportOptions.includeDevLogs}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      includeDevLogs: e.target.checked
                    })}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <label htmlFor="exportDevLogs" className="text-gray-300">
                    Include Dev Logs
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="exportStats"
                    checked={exportOptions.includeStats}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      includeStats: e.target.checked
                    })}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <label htmlFor="exportStats" className="text-gray-300">
                    Include Daily Statistics
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Date Range (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleExport}
                disabled={isExporting || (!exportOptions.includeSessions && !exportOptions.includeDevLogs && !exportOptions.includeStats)}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  'Export Data'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Data will be exported as a JSON file. You can import it later or use it for backups.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Import Data</h3>
              
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                {importFile ? (
                  <div className="space-y-4">
                    <div className="text-emerald-400">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="font-medium">{importFile.name}</div>
                    <div className="text-sm text-gray-400">
                      {formatFileSize(importFile.size)}
                    </div>
                    <button
                      onClick={() => setImportFile(null)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors inline-block">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImportFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-4">
                      Select a DevPulse export file (.json)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleImport}
                disabled={isImporting || !importFile}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
              >
                {isImporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Importing...
                  </>
                ) : (
                  'Import Data'
                )}
              </button>
              <div className="text-xs text-gray-500 mt-4 space-y-2">
                <p className="font-medium">⚠️ Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Only import files exported from DevPulse</li>
                  <li>Existing data with matching IDs will be replaced</li>
                  <li>Importing large files may take a moment</li>
                  <li>Always backup your data before importing</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Export History</h3>
              <button
                onClick={fetchExportHistory}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-sm"
              >
                Refresh
              </button>
            </div>

            {exportHistory.length > 0 ? (
              <div className="space-y-3">
                {exportHistory.map((item, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium truncate">{item.filename}</div>
                      <div className="text-sm text-cyan-300">{formatFileSize(item.size)}</div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{formatDate(item.createdAt)}</span>
                      <a
                        href={`http://localhost:3001${item.downloadUrl}`}
                        download
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Exports Yet</h3>
                <p className="text-gray-400">Export your data to see it here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
