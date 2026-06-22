package com.example.digisign.crypto;

import java.security.*;
import java.util.Base64;

public class SignatureEngine {

    public static String sign(byte[] documentBytes, PrivateKey privateKey) 
            throws Exception {
        Signature signer = Signature.getInstance("SHA256withRSA");
        signer.initSign(privateKey);
        signer.update(documentBytes);
        byte[] signatureBytes = signer.sign();
        return Base64.getEncoder().encodeToString(signatureBytes);
    }

    public static boolean verify(byte[] documentBytes, String signatureBase64, 
            PublicKey publicKey) throws Exception {
        Signature verifier = Signature.getInstance("SHA256withRSA");
        verifier.initVerify(publicKey);
        verifier.update(documentBytes);
        byte[] signatureBytes = Base64.getDecoder().decode(signatureBase64);
        return verifier.verify(signatureBytes);
    }
}