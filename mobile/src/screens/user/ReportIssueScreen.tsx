import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Modal, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import apiClient from '../../services/apiClient';
import { theme } from '../../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'Cleaning',
  'Infrastructure',
  'Internet/Network', 
  'Classroom',
  'Hostel',
  'Other'
];

export default function ReportIssueScreen({ navigation }: any) {
  const [form, setForm] = useState({
    category: '',
    description: '',
    location: '',
  });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  
  // Review Mode
  const [isReviewMode, setIsReviewMode] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePhotoOption = () => {
    Alert.alert(
      "Upload Evidence",
      "Choose a source for your photo",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleReview = () => {
    if (!form.category) return Alert.alert('Error', 'Please select a category');
    if (!form.description.trim()) return Alert.alert('Error', 'Please enter a description');
    if (!form.location.trim()) return Alert.alert('Error', 'Please enter a location');
    setIsReviewMode(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('location', form.location);

      if (photoUri) {
        formData.append('photo', {
          uri: Platform.OS === 'android' ? photoUri : photoUri.replace('file://', ''),
          name: 'evidence.jpg',
          type: 'image/jpeg'
        } as any);
      }

      const response = await apiClient.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) as any;

      if (response.data.success) {
        Alert.alert('Success', `Issue Reported Successfully!\nID: ${response.data.issue.issueId}`, [
          { text: 'OK', onPress: () => {
            // Reset form
            setForm({ category: '', description: '', location: '' });
            setPhotoUri(null);
            setIsReviewMode(false);
            // Navigate back to Dashboard, then Issue Details
            navigation.navigate('DashboardMain');
            navigation.navigate('IssueDetails', { issueId: response.data.issue._id });
          }}
        ]);
      }
    } catch (error: any) {
      Alert.alert('Submission Failed', error.response?.data?.error || error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isReviewMode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsReviewMode(false)} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Issue</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Category</Text>
            <Text style={styles.reviewValue}>{form.category}</Text>
            
            <Text style={styles.reviewLabel}>Location</Text>
            <Text style={styles.reviewValue}>{form.location}</Text>
            
            <Text style={styles.reviewLabel}>Description</Text>
            <Text style={styles.reviewValue}>{form.description}</Text>
            
            {photoUri && (
              <View>
                <Text style={styles.reviewLabel}>Evidence</Text>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color={theme.colors.surface} /> : <Text style={styles.buttonText}>Submit Report</Text>}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity 
              style={styles.pickerButton} 
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text style={form.category ? styles.pickerText : styles.pickerPlaceholder}>
                {form.category || 'Select Category'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.locationLabelRow}>
              <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity 
                style={styles.qrButton} 
                onPress={async () => {
                  if (!permission?.granted) {
                    const status = await requestPermission();
                    if (!status.granted) {
                      Alert.alert('Permission needed', 'Camera permission is required to scan QR codes');
                      return;
                    }
                  }
                  setScannerVisible(true);
                }}
              >
                <Ionicons name="qr-code-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.qrButtonText}>Scan QR</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., Block B, Room 204"
              value={form.location}
              onChangeText={(text) => setForm({ ...form, location: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the issue in detail..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Evidence (Optional)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={handlePhotoOption}>
              {photoUri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: photoUri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={(e) => { e.stopPropagation(); setPhotoUri(null); }}>
                    <Text style={styles.removeImageText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>Tap to upload photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleReview}>
            <Text style={styles.buttonText}>Review</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Modal */}
      <Modal visible={categoryModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={() => { setForm({ ...form, category: item }); setCategoryModalVisible(false); }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCancel} onPress={() => setCategoryModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Scanner Modal */}
      <Modal visible={scannerVisible} transparent animationType="slide">
        <View style={styles.scannerModalContainer}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Scan Location QR</Text>
            <TouchableOpacity onPress={() => setScannerVisible(false)}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
          {scannerVisible && (
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={({ data }) => {
                setForm({ ...form, location: data });
                setScannerVisible(false);
                Alert.alert('Scanned Successfully', `Location set to: ${data}`);
              }}
            />
          )}
          <View style={styles.scannerFooter}>
            <Text style={styles.scannerHint}>Point your camera at a QuickFix QR code.</Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    paddingTop: Platform.OS === 'android' ? theme.spacing.xl : theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backIcon: {
    padding: theme.spacing.xs,
  },
  backIconText: {
    fontSize: 24,
    color: theme.colors.primaryText,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.primaryText,
  },
  textArea: {
    minHeight: 100,
  },
  pickerButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  pickerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primaryText,
  },
  pickerPlaceholder: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.secondaryText,
  },
  uploadBox: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  uploadText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    padding: theme.spacing.md,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOptionText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primaryText,
    textAlign: 'center',
  },
  modalCancel: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  modalCancelText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.error,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondaryText,
    marginBottom: 4,
    marginTop: theme.spacing.md,
  },
  reviewValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primaryText,
  },
  locationLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qrButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  scannerModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  scannerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  scannerFooter: {
    backgroundColor: '#000',
    padding: 30,
    alignItems: 'center',
  },
  scannerHint: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  }
});
