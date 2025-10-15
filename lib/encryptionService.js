// End-to-End Encryption Service for Corporacity
// Implements AES-256-GCM encryption for sensitive data

import CryptoJS from 'crypto-js';
import supabase from './supabaseClient';

class EncryptionService {
  constructor() {
    this.algorithm = 'AES';
    this.keySize = 256;
    this.ivSize = 128;
    this.tagSize = 128;
  }

  // Generate a new encryption key
  generateKey() {
    return CryptoJS.lib.WordArray.random(256/8).toString(CryptoJS.enc.Hex);
  }

  // Generate a random IV (Initialization Vector)
  generateIV() {
    return CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
  }

  // Encrypt data with AES-256
  encrypt(data, key) {
    try {
      const iv = this.generateIV();
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      return {
        encryptedData: encrypted.toString(),
        iv: iv,
        algorithm: this.algorithm,
        keySize: this.keySize
      };
    } catch (error) {
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt data with AES-256
  decrypt(encryptedData, key, iv) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  // Hash a key for verification
  hashKey(key) {
    return CryptoJS.SHA256(key).toString();
  }

  // Store encryption key in database
  async storeEncryptionKey(companyId, keyType, key, createdBy) {
    try {
      const keyHash = this.hashKey(key);
      const encryptedKey = this.encrypt(key, process.env.MASTER_ENCRYPTION_KEY || 'default-master-key');
      
      const { data, error } = await supabase
        .from('corp_encryption_keys')
        .insert([{
          company_id: companyId,
          key_type: keyType,
          encrypted_key: encryptedKey.encryptedData,
          key_hash: keyHash,
          created_by: createdBy,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve encryption key from database
  async getEncryptionKey(companyId, keyType) {
    try {
      const { data, error } = await supabase
        .from('corp_encryption_keys')
        .select('*')
        .eq('company_id', companyId)
        .eq('key_type', keyType)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      
      // Decrypt the stored key
      const decryptedKey = this.decrypt(
        data.encrypted_key, 
        process.env.MASTER_ENCRYPTION_KEY || 'default-master-key',
        data.iv
      );
      
      return {
        ...data,
        key: decryptedKey
      };
    } catch (error) {
      throw error;
    }
  }

  // Encrypt sensitive data and store with key reference
  async encryptAndStore(companyId, keyType, data, createdBy) {
    try {
      // Get or create encryption key
      let keyData;
      try {
        keyData = await this.getEncryptionKey(companyId, keyType);
      } catch (error) {
        // Create new key if none exists
        const newKey = this.generateKey();
        keyData = await this.storeEncryptionKey(companyId, keyType, newKey, createdBy);
        keyData.key = newKey;
      }

      // Encrypt the data
      const encrypted = this.encrypt(data, keyData.key);
      
      return {
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        keyId: keyData.id,
        isEncrypted: true
      };
    } catch (error) {
      throw error;
    }
  }

  // Decrypt data using stored key reference
  async decryptData(encryptedData, iv, keyId) {
    try {
      // Get the encryption key
      const { data: keyData, error } = await supabase
        .from('corp_encryption_keys')
        .select('*')
        .eq('id', keyId)
        .single();

      if (error) throw error;

      // Decrypt the stored key
      const decryptedKey = this.decrypt(
        keyData.encrypted_key,
        process.env.MASTER_ENCRYPTION_KEY || 'default-master-key',
        keyData.iv
      );

      // Decrypt the data
      return this.decrypt(encryptedData, decryptedKey, iv);
    } catch (error) {
      throw error;
    }
  }

  // Encrypt status message
  async encryptStatusMessage(companyId, message, userId) {
    if (!message || message.trim() === '') {
      return { message, isEncrypted: false };
    }

    try {
      const encrypted = await this.encryptAndStore(companyId, 'status', message, userId);
      return {
        encryptedMessage: encrypted.encryptedData,
        encryptionKeyId: encrypted.keyId,
        isEncrypted: true
      };
    } catch (error) {
      // Fallback to unencrypted
      return { message, isEncrypted: false };
    }
  }

  // Decrypt status message
  async decryptStatusMessage(statusRecord) {
    if (!statusRecord.is_encrypted || !statusRecord.encrypted_message) {
      return statusRecord.message || '';
    }

    try {
      return await this.decryptData(
        statusRecord.encrypted_message,
        statusRecord.iv,
        statusRecord.encryption_key_id
      );
    } catch (error) {
      return '[Encrypted message - decryption failed]';
    }
  }

  // Encrypt chat message
  async encryptChatMessage(companyId, message, userId) {
    if (!message || message.trim() === '') {
      return { message, isEncrypted: false };
    }

    try {
      const encrypted = await this.encryptAndStore(companyId, 'chat', message, userId);
      return {
        encryptedMessage: encrypted.encryptedData,
        encryptionKeyId: encrypted.keyId,
        isEncrypted: true
      };
    } catch (error) {
      // Fallback to unencrypted
      return { message, isEncrypted: false };
    }
  }

  // Decrypt chat message
  async decryptChatMessage(messageRecord) {
    if (!messageRecord.is_encrypted || !messageRecord.encrypted_message) {
      return messageRecord.message || '';
    }

    try {
      return await this.decryptData(
        messageRecord.encrypted_message,
        messageRecord.iv,
        messageRecord.encryption_key_id
      );
    } catch (error) {
      return '[Encrypted message - decryption failed]';
    }
  }

  // Encrypt announcement content
  async encryptAnnouncementContent(companyId, content, userId) {
    if (!content || content.trim() === '') {
      return { content, isEncrypted: false };
    }

    try {
      const encrypted = await this.encryptAndStore(companyId, 'announcement', content, userId);
      return {
        encryptedContent: encrypted.encryptedData,
        encryptionKeyId: encrypted.keyId,
        isEncrypted: true
      };
    } catch (error) {
      // Fallback to unencrypted
      return { content, isEncrypted: false };
    }
  }

  // Decrypt announcement content
  async decryptAnnouncementContent(announcementRecord) {
    if (!announcementRecord.is_encrypted || !announcementRecord.encrypted_content) {
      return announcementRecord.content || '';
    }

    try {
      return await this.decryptData(
        announcementRecord.encrypted_content,
        announcementRecord.iv,
        announcementRecord.encryption_key_id
      );
    } catch (error) {
      return '[Encrypted content - decryption failed]';
    }
  }

  // Rotate encryption keys (for security)
  async rotateEncryptionKey(companyId, keyType, newKey, rotatedBy) {
    try {
      // Deactivate old keys
      await supabase
        .from('corp_encryption_keys')
        .update({ is_active: false })
        .eq('company_id', companyId)
        .eq('key_type', keyType);

      // Create new key
      const newKeyData = await this.storeEncryptionKey(companyId, keyType, newKey, rotatedBy);
      
      // Log the key rotation
      await supabase.rpc('log_audit_event', {
        p_user_id: rotatedBy,
        p_company_id: companyId,
        p_action: 'key_rotation',
        p_resource_type: 'encryption_key',
        p_resource_id: newKeyData.id,
        p_severity: 'warning',
        p_description: `Encryption key rotated for ${keyType}`
      });

      return newKeyData;
    } catch (error) {
      throw error;
    }
  }

  // Check if encryption is enabled for a company
  async isEncryptionEnabled(companyId, keyType) {
    try {
      const { data, error } = await supabase
        .from('corp_encryption_keys')
        .select('id')
        .eq('company_id', companyId)
        .eq('key_type', keyType)
        .eq('is_active', true)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Get encryption statistics for a company
  async getEncryptionStats(companyId) {
    try {
      const { data, error } = await supabase
        .from('corp_encryption_keys')
        .select('key_type, created_at, expires_at')
        .eq('company_id', companyId)
        .eq('is_active', true);

      if (error) throw error;

      const stats = {
        totalKeys: data.length,
        keyTypes: {},
        expiringSoon: 0
      };

      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      data.forEach(key => {
        stats.keyTypes[key.key_type] = (stats.keyTypes[key.key_type] || 0) + 1;
        
        if (new Date(key.expires_at) < thirtyDaysFromNow) {
          stats.expiringSoon++;
        }
      });

      return stats;
    } catch (error) {
      return { totalKeys: 0, keyTypes: {}, expiringSoon: 0 };
    }
  }

  // Validate encryption integrity
  async validateEncryptionIntegrity(companyId) {
    try {
      const { data: keys, error: keysError } = await supabase
        .from('corp_encryption_keys')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true);

      if (keysError) throw keysError;

      const results = {
        valid: 0,
        invalid: 0,
        errors: []
      };

      for (const key of keys) {
        try {
          // Try to decrypt the key
          const decryptedKey = this.decrypt(
            key.encrypted_key,
            process.env.MASTER_ENCRYPTION_KEY || 'default-master-key',
            key.iv
          );
          
          // Verify key hash
          const expectedHash = this.hashKey(decryptedKey);
          if (expectedHash === key.key_hash) {
            results.valid++;
          } else {
            results.invalid++;
            results.errors.push(`Key ${key.id} hash mismatch`);
          }
        } catch (error) {
          results.invalid++;
          results.errors.push(`Key ${key.id} decryption failed: ${error.message}`);
        }
      }

      return results;
    } catch (error) {
      return { valid: 0, invalid: 0, errors: [error.message] };
    }
  }
}

export default new EncryptionService();
