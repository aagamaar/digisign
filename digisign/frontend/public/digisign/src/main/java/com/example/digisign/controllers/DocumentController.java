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
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadAndSign(
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();
        try {
            byte[] fileBytes = file.getBytes();

            KeyPair keyPair = KeyPairManager.generateRSAKeyPair();
            String signatureBase64 = SignatureEngine.sign(fileBytes, keyPair.getPrivate());
            String publicKeyBase64 = Base64.getEncoder()
                                           .encodeToString(keyPair.getPublic().getEncoded());

            Document doc = new Document();
            doc.setFileName(file.getOriginalFilename());
            doc.setDigitalSignature(signatureBase64);
            doc.setPublicKey(publicKeyBase64);
            documentRepository.save(doc);

            response.put("success", true);
            response.put("fileName", file.getOriginalFilename());
            response.put("signature", signatureBase64);
            response.put("publicKey", publicKeyBase64);
            response.put("message", "File signed successfully.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("signature") String signatureBase64,
            @RequestParam("publicKey") String publicKeyBase64) {

        Map<String, Object> response = new HashMap<>();
        try {
            byte[] fileBytes = file.getBytes();

            byte[] pubKeyBytes = Base64.getDecoder().decode(publicKeyBase64);
            PublicKey publicKey = KeyFactory.getInstance("RSA")
                    .generatePublic(new X509EncodedKeySpec(pubKeyBytes));

            boolean isValid = SignatureEngine.verify(fileBytes, signatureBase64, publicKey);

            response.put("valid", isValid);
            response.put("message", isValid
                ? "File is authentic. Signature verified."
                : "WARNING: File has been tampered with!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Verification error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllDocuments() {
        return ResponseEntity.ok(documentRepository.findAll());
    }
}
