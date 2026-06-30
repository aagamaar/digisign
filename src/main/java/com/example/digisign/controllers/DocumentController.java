package com.example.digisign.controllers;

import com.example.digisign.crypto.KeyPairManager;
import com.example.digisign.crypto.SignatureEngine;
import com.example.digisign.entities.Document;
import com.example.digisign.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * DigiSign Document Controller
 * Handles file upload/signing and verification operations
 */
@RestController
@RequestMapping("/api/documents")
@CrossOrigin(
    origins = {
        "http://localhost:3000",                    // Local development
        "http://localhost:8080",                    // Local testing
        "https://digisign-pi.vercel.app",          // Production (NO trailing slash!)
        "https://your-vercel-app.vercel.app"       // For other deployments
    },
    maxAge = 3600
)
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * Health Check Endpoint
     * Use this to verify backend is running
     * Endpoint: GET /api/documents/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("backend", "DigiSign API v1.0");
        response.put("timestamp", new Date().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * Upload and Sign Document
     * Step 1 of DigiSign process
     * 
     * Endpoint: POST /api/documents/upload
     * Request: file (multipart)
     * Response: {success, fileName, signature, publicKey, message}
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadAndSign(
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();
        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "Error: File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("📤 Uploading file: " + file.getOriginalFilename() + 
                             " (Size: " + file.getSize() + " bytes)");

            // Read file bytes
            byte[] fileBytes = file.getBytes();

            // Generate RSA key pair
            System.out.println("🔑 Generating RSA-2048 key pair...");
            KeyPair keyPair = KeyPairManager.generateRSAKeyPair();

            // Sign the file
            System.out.println("✍️  Signing file with private key...");
            String signatureBase64 = SignatureEngine.sign(fileBytes, keyPair.getPrivate());
            String publicKeyBase64 = Base64.getEncoder()
                    .encodeToString(keyPair.getPublic().getEncoded());

            // Save to database
            System.out.println("💾 Saving to database...");
            Document doc = new Document();
            doc.setFileName(file.getOriginalFilename());
            doc.setDigitalSignature(signatureBase64);
            doc.setPublicKey(publicKeyBase64);
            documentRepository.save(doc);

            // Return success response
            response.put("success", true);
            response.put("fileName", file.getOriginalFilename());
            response.put("signature", signatureBase64);
            response.put("publicKey", publicKeyBase64);
            response.put("message", "File signed successfully.");
            
            System.out.println("✅ File signed and saved successfully!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Upload error: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Verify Document Signature
     * Step 2 of DigiSign process
     * 
     * Endpoint: POST /api/documents/verify
     * Request: file, signature, publicKey (multipart)
     * Response: {valid, message}
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("signature") String signatureBase64,
            @RequestParam("publicKey") String publicKeyBase64) {

        Map<String, Object> response = new HashMap<>();
        try {
            // Validate inputs
            if (file.isEmpty() || signatureBase64.isEmpty() || publicKeyBase64.isEmpty()) {
                response.put("valid", false);
                response.put("message", "Error: Missing file, signature, or public key");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("🔍 Verifying file: " + file.getOriginalFilename());

            // Read file bytes
            byte[] fileBytes = file.getBytes();

            // Decode public key
            System.out.println("🔓 Decoding public key...");
            byte[] pubKeyBytes = Base64.getDecoder().decode(publicKeyBase64);
            PublicKey publicKey = KeyFactory.getInstance("RSA")
                    .generatePublic(new X509EncodedKeySpec(pubKeyBytes));

            // Verify signature
            System.out.println("✓ Verifying signature...");
            boolean isValid = SignatureEngine.verify(fileBytes, signatureBase64, publicKey);

            // Return result
            response.put("valid", isValid);
            response.put("message", isValid
                    ? "File is authentic. Signature verified."
                    : "WARNING: File has been tampered with!");
            
            if (isValid) {
                System.out.println("✅ Signature verification passed!");
            } else {
                System.out.println("⚠️  Signature verification FAILED - file has been modified!");
            }
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Verification error: " + e.getMessage());
            e.printStackTrace();
            
            response.put("valid", false);
            response.put("message", "Verification error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get All Signed Documents
     * Returns list of all documents that have been signed
     * 
     * Endpoint: GET /api/documents
     * Response: List of Document objects
     */
    @GetMapping
    public ResponseEntity<?> getAllDocuments() {
        try {
            System.out.println("📋 Fetching all documents from database...");
            var documents = documentRepository.findAll();
            System.out.println("✅ Found " + documents.size() + " documents");
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            System.err.println("❌ Error fetching documents: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}