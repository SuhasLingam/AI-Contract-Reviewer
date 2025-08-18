import React from 'react';

interface FileUploadProps {
    selectedFile: File | null;
    uploading: boolean;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFileRemove: () => void;
    onSubmit: (event: React.FormEvent) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    selectedFile,
    uploading,
    onFileChange,
    onFileRemove,
    onSubmit
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Contract Document
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={onFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4"
                    />
                </div>

                {selectedFile && (
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-xl flex justify-between items-center">
                        <span className="truncate font-medium">{selectedFile.name}</span>
                        <button
                            type="button"
                            onClick={onFileRemove}
                            className="text-blue-600 hover:text-blue-900 font-bold text-lg"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!selectedFile || uploading}
                    className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200
            ${!selectedFile || uploading
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                        }`}
                >
                    {uploading ? (
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Analyzing Contract...</span>
                        </div>
                    ) : (
                        "Upload & Analyze Contract"
                    )}
                </button>
            </form>
        </div>
    );
};

export default FileUpload;
