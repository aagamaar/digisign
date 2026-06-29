import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // ========== ALL STATE VARIABLES ==========
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState(''); // ← ADDED!
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifySignatureInput, setVerifySignatureInput] = useState('');
  const [history, setHistory] = useState([]);

  // ========== FUNCTION 1: UPLOAD & SIGN ==========
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
      const returnedPublicKey = response.data.publicKey; // ← ADDED!
      
      setSignature(returnedSignature);
      setPublicKey(returnedPublicKey); // ← ADDED!
      
      setStatus('success');
      setMessage('✅ File signed successfully! Use the buttons below to save or copy the signature.');
      
      setHistory([...history, { 
        file: fileName, 
        signature: returnedSignature, 
        timestamp: new Date().toLocaleString() 
      }]);
      
    } catch (error) {
      setStatus('error');
      setMessage('❌ Upload failed. Is the backend server running on port 8080?');
      console.error(error);
    }
  };

  // ========== FUNCTION 2: VERIFY ==========
  const handleVerify = async () => {
    if (!verifyFile || !verifySignatureInput) {
      alert('Please pick a file AND paste the signature string!');
      return;
    }

    if (!publicKey) {
      alert('No public key available. Please sign a file first!');
      return;
    }

    setStatus('loading');
    setMessage('🔍 Checking file authenticity...');

    const formData = new FormData();
    formData.append('file', verifyFile);
    formData.append('signature', verifySignatureInput);
    formData.append('publicKey', publicKey); // ← NOW WORKS!

    try {
      const response = await axios.post(
        'http://localhost:8080/api/documents/verify',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.valid === true) {
        setStatus('success');
        setMessage('✅ File is authentic! The document has not been tampered with.');
      } else {
        setStatus('error');
        setMessage('❌ File has been modified! The signature does not match.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Verification failed. Backend error.');
      console.error(error);
    }
  };

  // ========== FUNCTION 3: DOWNLOAD ==========
  const downloadSignature = () => {
    const blob = new Blob([signature], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_digital_signature.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  // ========== FUNCTION 4: COPY ==========
  const copyToClipboard = () => {
    navigator.clipboard.writeText(signature)
      .then(() => {
        alert('✅ Signature copied to your clipboard!');
      })
      .catch(() => {
        alert('❌ Failed to copy. Please select the text manually.');
      });
  };

  // ========== FUNCTION 5: CLEAR ALL ==========
  const clearAll = () => {
    setSelectedFile(null);
    setFileName('');
    setSignature('');
    setPublicKey(''); // ← ADDED!
    setStatus('idle');
    setMessage('');
    setVerifyFile(null);
    setVerifySignatureInput('');
  };


  // ========== THE ACTUAL SCREEN ==========
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '850px', margin: '0 auto', padding: '25px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1a73e8', fontSize: '2.5rem' }}>📄 DigiSign Dashboard</h1>
        <p style={{ color: '#555' }}>Upload, Sign, and Verify your documents securely</p>
      </div>

      {/* SECTION 1: UPLOAD & SIGN */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333' }}>Step 1: Upload & Sign a File</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="file" 
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
              setFileName(e.target.files[0]?.name || ''); // NEW: Save file name
            }} 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 1 }}
          />
          <button 
            onClick={handleUpload} 
            style={{ padding: '12px 30px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            🚀 Sign File
          </button>
        </div>

        {/* NEW: Show selected file name */}
        {fileName && (
          <p style={{ color: '#555', marginTop: '10px', fontSize: '14px' }}>
            📎 Selected: <strong>{fileName}</strong>
          </p>
        )}

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

      {/* SECTION 2: VERIFY */}
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

      {/* SECTION 3: STATUS UPDATES */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>📊 Status Updates:</h3>
        
        {/* LOADING STATE */}
        {status === 'loading' && (
          <div style={{ backgroundColor: '#cce5ff', color: '#004085', padding: '15px', borderRadius: '8px', border: '1px solid #b8daff' }}>
            <span>⏳ {message}</span>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
            <span>✅ {message}</span>
            {/* NEW: Verified Badge */}
            {message.includes('authentic') && (
              <span style={{ 
                marginLeft: '15px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                padding: '2px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: 'bold' 
              }}>
                VERIFIED ✓
              </span>
            )}
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
            <span>❌ {message}</span>
          </div>
        )}

        {/* IDLE STATE */}
        {status === 'idle' && (
          <div style={{ color: '#6c757d', padding: '10px' }}>
            ⏸️ Waiting for you to upload or verify a file...
          </div>
        )}

        {/* NEW: CLEAR BUTTON */}
        <button 
          onClick={clearAll} 
          style={{ 
            marginTop: '15px', 
            padding: '8px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          🗑️ Clear All
        </button>
      </div>

      {/* NEW: SIGNATURE HISTORY */}
      {history.length > 0 && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginTop: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h4>📜 Signature History</h4>
          <ul style={{ maxHeight: '150px', overflowY: 'auto', background: '#f8f9fa', padding: '10px', borderRadius: '5px', listStyle: 'none' }}>
            {history.map((item, index) => (
              <li key={index} style={{ fontSize: '12px', marginBottom: '5px', padding: '5px', borderBottom: '1px solid #eee' }}>
                <strong>{item.timestamp}</strong> – {item.file} – <span style={{ fontFamily: 'monospace' }}>{item.signature.substring(0, 20)}...</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* NEW: FOOTER */}
      <div style={{ marginTop: '40px', textAlign: 'center', color: '#888', fontSize: '14px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <p>🔐 DigiSign – Secure Document Signing & Verification</p>
        <p style={{ fontSize: '12px' }}>Built with React & Spring Boot</p>
      </div>

    </div>
  );
}

export default App;
