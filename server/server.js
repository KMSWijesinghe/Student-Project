import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import Footer from '../components/Footer';

function Review_Document_Upload() {
  const navigate = useNavigate();
  
  // Authentication states
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // File upload states
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf'];
  
  // Set axios defaults
  axios.defaults.withCredentials = true;

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/File_Upload');
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setEmail(res.data.email);
        } else {
          setAuth(false);
          navigate('/LoginStudent');
        }
      } catch (err) {
        console.error("Authentication error:", err);
        navigate('/LoginStudent');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // File validation helper
  const validateFile = useCallback((file) => {
    if (!file) return { valid: false, error: 'No file selected' };
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only PDF files are allowed' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    return { valid: true };
  }, []);

  // Handle file selection
  const handleFile = useCallback((selectedFile) => {
    const validation = validateFile(selectedFile);
    
    if (!validation.valid) {
      setUploadStatus({ type: 'error', message: validation.error });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setUploadStatus({ type: 'success', message: 'File selected successfully' });
  }, [validateFile]);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  }, [handleFile]);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus({ type: 'error', message: 'Please select a proposal file' });
      return;
    }

    if (!email) {
      setUploadStatus({ type: 'error', message: 'Authentication error: No email found' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('email', email);

    try {
      const response = await axios.post(
        'http://localhost:5000/File_Upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (response.data.Status === "Success") {
        setUploadStatus({
          type: 'success',
          message: 'Proposal uploaded successfully to Google Drive'
        });
        setFile(null);
        if (e.target.elements.proposal) {
          e.target.elements.proposal.value = '';
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: response.data.Message || 'Upload failed'
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus({
        type: 'error',
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!auth) {
    return (
      <div className="loading-container">
        <div className="loading-message">Authenticating...</div>
      </div>
    );
  }

  return (
    <div className="register">
      <Header />
      <div className="mains">
        <div className="upload-container">
          <form onSubmit={handleUpload}>
            <h2>Research Proposal Upload</h2>
            
            <div 
              className={`drop-zone ${dragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="drop-zone-content">
                <p>Drag and drop your file here or</p>
                <label className="file-input-label">
                  <span>Choose a file</span>
                  <input
                    type="file"
                    className="file-input"
                    accept=".pdf"
                    onChange={(e) => handleFile(e.target.files[0])}
                    disabled={isUploading}
                  />
                </label>
                <p className="file-requirements">PDF files only, up to 10MB</p>
              </div>
            </div>

            {file && (
              <div className="selected-file">
                Selected file: {file.name}
              </div>
            )}

            {uploadStatus.message && (
              <div className={`status-message ${uploadStatus.type}`}>
                {uploadStatus.message}
              </div>
            )}

            {isUploading && (
              <div className="upload-progress-container">
                <div className="upload-progress-text">
                  Uploading: {uploadProgress}%
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`submit-button ${isUploading || !file ? 'disabled' : ''}`}
              disabled={isUploading || !file}
            >
              {isUploading ? 'UPLOADING...' : 'SUBMIT PROPOSAL'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Review_Document_Upload;
