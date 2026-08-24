interface UploadSectionProps {
  hasScript: boolean;
  onFileUpload: (event: Event) => void;
  onPasteButtonClick: () => void;
  onTokenReplacementUpload: (event: Event) => void;
  onLoadExample: () => void;
  onLoadExampleTeensyville: () => void;
}

export function UploadSection({
  hasScript,
  onFileUpload,
  onPasteButtonClick,
  onTokenReplacementUpload,
  onLoadExample,
  onLoadExampleTeensyville,
}: UploadSectionProps) {
  const isMac = navigator.userAgent.includes("Mac");
  return (
    <>
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          Upload JSON
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json,.json5"
          onChange={onFileUpload}
          className="file-input"
        />
        <div className="or">or</div>
        <div className="paste-hint">
          Paste directly with {isMac ? "⌘" : "ctrl"}+V
        </div>
        <button
          type="button"
          className="paste-button"
          onClick={onPasteButtonClick}
        >
          Paste
        </button>

        <label htmlFor="token-replacement-upload" className="upload-label">
          Upload Token Replacement JSON
        </label>
        <input
          id="token-replacement-upload"
          type="file"
          accept=".json,.json5"
          onChange={onTokenReplacementUpload}
          className="file-input"
        />
      </div>

      {!hasScript && (
        <div className="example-section">
          <button onClick={onLoadExample} className="example-button">
            Load Example Script
          </button>
          <button onClick={onLoadExampleTeensyville} className="example-button">
            Load Example Teensyville
          </button>
        </div>
      )}
    </>
  );
}
