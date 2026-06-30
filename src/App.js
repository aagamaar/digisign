import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // Memory slots for our app
  const [selectedFile, setSelectedFile] = useState(null);
  const [signature, setSignature] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifySignatureInput, setVerifySignatureInput] = useState('');

  // ----- FUNCTION 1: Upload & Sign -----
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setStatus('loading');
    setMessage('📤 Sending file to backend for signing...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/documents/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const returnedSignature = response.data.signature;
      setSignature(returnedSignature);
      setStatus('success');
      setMessage('✅ File signed successfully! Use the buttons below to save or copy the signature.');
    } catch (error) {
      setStatus('error');
      setMessage('❌ Upload failed. Is the backend server running on port 8080?');
      console.error(error);
    }
  };

  // ----- FUNCTION 2: Verify a file -----
  const handleVerify = async () => {
    if (!verifyFile || !verifySignatureInput) {
      alert('Please pick a file AND paste the signature string!');
      return;
    }

    setStatus('loading');
    setMessage('🔍 Checking file authenticity...');

    const formData = new FormData();
    formData.append('file', verifyFile);
    formData.append('signature', verifySignatureInput);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/documents/verify',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.valid === true) {
        setStatus('success');
        setMessage('✅ GREAT! The file is 100% AUTHENTIC (Green badge).');
      } else {
        setStatus('error');
        setMessage('❌ TAMPERED! The file does not match the signature (Red banner).');
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Verification failed. Backend error.');
      console.error(error);
    }
  };

  // ----- FUNCTION 3: Download Signature as .txt -----
  const downloadSignature = () => {
    const blob = new Blob([signature], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_digital_signature.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  // ----- FUNCTION 4: COPY to Clipboard (NEW!) -----
  const copyToClipboard = () => {
    navigator.clipboard.writeText(signature)
      .then(() => {
        alert('✅ Signature copied to your clipboard!');
      })
      .catch(() => {
        alert('❌ Failed to copy. Please select the text manually.');
      });
  };

  // ----- THE ACTUAL SCREEN (HTML/CSS) -----
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '850px', margin: '0 auto', padding: '25px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1a73e8', fontSize: '2.5rem' }}>📄 DigiSign Dashboard</h1>
        <p style={{ color: '#555' }}>Upload, Sign, and Verify your documents securely</p>
      </div>

      {/* ---------- SECTION 1: UPLOAD & SIGN ---------- */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333' }}>Step 1: Upload & Sign a File</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 1 }}
          />
          <button 
            onClick={handleUpload} 
            style={{ padding: '12px 30px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            🚀 Sign File
          </button>
        </div>

        {/* SIGNATURE DISPLAY + DOWNLOAD/COPY BUTTONS */}
        {signature && (
          <div style={{ marginTop: '20px', background: '#f0f4f8', padding: '15px', borderRadius: '8px', border: '1px solid #d1d9e6' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>📝 Generated Signature:</strong>
            <p style={{ wordBreak: 'break-all', fontSize: '13px', background: 'white', padding: '10px', borderRadius: '5px', fontFamily: 'monospace' }}>
              {signature}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={downloadSignature} style={{ padding: '8px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                ⬇️ Download .txt
              </button>
              <button onClick={copyToClipboard} style={{ padding: '8px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                📋 Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- SECTION 2: VERIFY FILE ---------- */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333' }}>Step 2: Verify a File</h2>
        <p style={{ color: '#555' }}>Upload the file again and paste the signature to check authenticity.</p>
        
        <input 
          type="file" 
          onChange={(e) => setVerifyFile(e.target.files[0])} 
          style={{ display: 'block', marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
        />
        
        <textarea 
          placeholder="Paste the signature string here..." 
          rows="3" 
          style={{ width: '95%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: '13px' }}
          onChange={(e) => setVerifySignatureInput(e.target.value)}
        ></textarea>
        <br /><br />
        <button 
          onClick={handleVerify} 
          style={{ padding: '12px 30px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          🔎 Verify File
        </button>
      </div>

      {/* ---------- STATUS DISPLAY (The Green/Red banners) ---------- */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>📊 Status Updates:</h3>
        
        {status === 'loading' && (
          <div style={{ backgroundColor: '#cce5ff', color: '#004085', padding: '15px', borderRadius: '8px', border: '1px solid #b8daff' }}>
            <span>⏳ {message}</span>
          </div>
        )}

        {status === 'success' && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
            <span>✅ {message}</span>
          </div>
        )}

        {status === 'error' && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
            <span>❌ {message}</span>
          </div>
        )}

        {status === 'idle' && (
          <div style={{ color: '#6c757d', padding: '10px' }}>
            ⏸️ Waiting for you to upload or verify a file...
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
