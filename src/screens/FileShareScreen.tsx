import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './SessionScreen';
import * as Sharing from 'expo-sharing';

type Props = NativeStackScreenProps<RootStackParamList, 'FileShare'>;

type FileItem = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export default function FileShareScreen({ route }: Props) {
  const { code } = route.params as { code: string };
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firstLoadDone = useRef(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingSuccess, setPendingSuccess] = useState(false);
  const [lastFileCount, setLastFileCount] = useState(0);
  const backend = 'https://inshare-backend-c9p8.onrender.com';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchFiles = async () => {
      if (!firstLoadDone.current) setLoading(true);
      try {
        const res = await axios.get(`${backend}/api/session/${code}`);
        setFiles((res.data.files || []).slice().reverse());
        console.log('Files:', res.data.files);
        if (pendingSuccess && res.data.files && res.data.files.length > lastFileCount) {
          setTimeout(() => {
            Alert.alert('Success', 'File uploaded successfully!');
            setPendingSuccess(false);
          }, 500);
        }
        setLastFileCount(res.data.files ? res.data.files.length : 0);
      } catch (err) {
        // Optionally handle error
      } finally {
        if (!firstLoadDone.current) {
          setLoading(false);
          firstLoadDone.current = true;
        }
      }
    };
    fetchFiles();
    interval = setInterval(fetchFiles, 3000);
    return () => clearInterval(interval);
  }, [code]);

  // MIME type helper function
  const getMimeType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  };

  // Upload image
  const handleUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
  
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const fileUri = asset.uri;
      const fileName = asset.fileName || fileUri.split('/').pop() || `image_${Date.now()}.jpg`;
      const fileType = asset.mimeType || 'image/jpeg';
  
      try {
        // Get accurate file size
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        const fileSize = fileInfo.exists && typeof fileInfo.size === 'number' ? fileInfo.size : 0;
        if (fileSize === 0) {
          throw new Error('Empty file detected');
        }
        // Convert to base64
        const base64Data = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        // Generate client ID just like the web version
        const clientId = Math.random().toString(36).substring(2, 10);
  
        // Send as JSON
        setUploading(true);
        setUploadProgress(0);
        await axios.post(
          `${backend}/api/session/${code}/upload`,
          {
            fileName,
            fileType,
            fileSize,
            fileData: `data:${fileType};base64,${base64Data}`,
            clientId,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                setUploadProgress(progressEvent.loaded / progressEvent.total);
              }
            },
          }
        );
        setUploading(false);
        setUploadProgress(0);
        setPendingSuccess(true);
      } catch (err) {
        console.error('Upload error:', err);
        Alert.alert('Error', 'Failed to upload image');
      }
    }
  };
  

  // Upload document
  const handleUploadDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: '*/*',
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const fileUri = asset.uri;
      // Use asset.name (DocumentPickerAsset) and fallback to fileUri split, do not use asset.fileName (not in type)
      const fileName = asset.name || fileUri.split('/').pop() || `document_${Date.now()}`;
      const fileType = asset.mimeType || getMimeType(fileName);

      try {
        // DocumentPickerSuccessResult does not have .size, so always get size from FileSystem
        const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
        let fileSize = fileInfo.exists && typeof fileInfo.size === 'number' ? fileInfo.size : 0;
        if (fileSize === 0) {
          const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
          fileSize = fileInfo.exists && typeof fileInfo.size === 'number' ? fileInfo.size : 0;
          if (fileSize === 0) throw new Error('Empty file detected');
        }
  
        // Convert to base64
        const base64Data = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const clientId = Math.random().toString(36).substring(2, 10);
  
        setUploading(true);
        setUploadProgress(0);
        await axios.post(
          `${backend}/api/session/${code}/upload`,
          {
            fileName,
            fileType,
            fileSize,
            fileData: `data:${fileType};base64,${base64Data}`,
            clientId,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                setUploadProgress(progressEvent.loaded / progressEvent.total);
              }
            },
          }
        );
        setUploading(false);
        setUploadProgress(0);
        setPendingSuccess(true);
      } catch (err) {
        console.error('Upload error:', err);
        Alert.alert('Error', 'Failed to upload document');
      }
    }
  };
  

  // Image preview handler
  const handleImagePress = (url: string, fileName: string) => {
    setPreviewImage(url);
    setPreviewFileName(fileName);
    setPreviewVisible(true);
  };

  // Download image handler
  const handleDownload = async () => {
    if (!previewImage || !previewFileName) return;
    try {
      setDownloading(true);
      // Download to local file system using the original file name
      const fileUri = FileSystem.documentDirectory + previewFileName;
      const downloadRes = await FileSystem.downloadAsync(previewImage, fileUri);
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Cannot save image without permission.');
        setDownloading(false);
        return;
      }
      // Save to gallery
      await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
      Alert.alert('Success', 'Image saved to gallery!');
    } catch (err) {
      console.log('Download error:', err);
      Alert.alert('Error', 'Failed to download image.');
    } finally {
      setDownloading(false);
    }
  };

  const renderItem = ({ item }: { item: FileItem }) => {
    // Construct file URL if missing
    const fileUrl = item.url || `/api/session/${code}/file/${item.id}`;
    const isImage = typeof item.type === 'string' && item.type.startsWith('image');
    if (isImage) {
      console.log('Image URL:', backend + fileUrl);
    }
    return (
      <View style={styles.fileItem}>
        {isImage ? (
          <TouchableOpacity onPress={() => handleImagePress(backend + fileUrl, item.name)}>
            <Image source={{ uri: backend + fileUrl }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <View style={styles.docContainer}>
            <Text style={styles.docIcon}>📄</Text>
            <Text style={styles.docName}>{item.name}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Files in Session {code}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadImage}>
          <Text style={styles.uploadBtnText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadDocument}>
          <Text style={styles.uploadBtnText}>Upload Document</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator style={{ margin: 16 }} />}
      {uploading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 10,
        }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={{ marginTop: 12, fontSize: 18, fontWeight: 'bold' }}>Uploading...</Text>
          </View>
        </View>
      )}
      <FlatList
        data={files}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ width: '100%' }}
        contentContainerStyle={{ padding: 16 }}
      />
      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            <Pressable style={styles.downloadBtn} onPress={handleDownload} disabled={downloading}>
              <Text style={styles.downloadBtnText}>{downloading ? 'Downloading...' : 'Download'}</Text>
            </Pressable>
            <Pressable style={styles.closeBtn} onPress={() => setPreviewVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  uploadBtn: {
    backgroundColor: '#0ea9c5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginHorizontal: 5,
    shadowColor: '#0ea9c5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fileItem: {
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  docContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  docName: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  previewImage: {
    width: width * 0.8,
    height: height * 0.5,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  downloadBtn: {
    backgroundColor: '#0ea9c5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 12,
  },
  downloadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  closeBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 