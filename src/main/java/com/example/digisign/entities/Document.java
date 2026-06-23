package com.example.digisign.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @CreationTimestamp
    private LocalDateTime uploadTimestamp;

    @Column(columnDefinition = "TEXT")
    private String digitalSignature;

    @Column(columnDefinition = "TEXT")
    private String publicKey;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public LocalDateTime getUploadTimestamp() { return uploadTimestamp; }
    public void setUploadTimestamp(LocalDateTime t) { this.uploadTimestamp = t; }

    public String getDigitalSignature() { return digitalSignature; }
    public void setDigitalSignature(String s) { this.digitalSignature = s; }

    public String getPublicKey() { return publicKey; }
    public void setPublicKey(String k) { this.publicKey = k; }
}
