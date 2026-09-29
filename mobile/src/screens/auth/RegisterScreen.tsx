import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../theme/theme';
import apiClient from '../../services/apiClient';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    collegeName: '',
  });
  const [idCardUri, setIdCardUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // Request permission first. 
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
      setIdCardUri(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.phoneNumber || !form.collegeName) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (!idCardUri) {
      Alert.alert('Error', 'Please upload your Identity Card');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('collegeName', form.collegeName);
      
      // @ts-ignore
      formData.append('idCard', JSON.parse(JSON.stringify({
        uri: Platform.OS === 'android' ? idCardUri : idCardUri.replace('file://', ''),
        name: 'idcard.jpg',
        type: 'image/jpeg',
      })));

      await apiClient.post('/auth/register', formData);

      // Navigate to OTP verification for registration
      navigation.navigate('OtpVerification', { email: form.email, purpose: 'REGISTRATION' });
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/quickfix_logo.jpg')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Create your account</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={form.fullName}
              onChangeText={(text) => setForm({ ...form, fullName: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>College / Institute Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your college/institute"
              value={form.collegeName}
              onChangeText={(text) => setForm({ ...form, collegeName: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Identity Card Upload</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              {idCardUri ? (
                <Image source={{ uri: idCardUri }} style={styles.previewImage} />
              ) : (
                <Text style={styles.uploadText}>Tap to upload</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
  },
  uploadBox: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    minHeight: 120,
  },
  uploadText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  previewImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minHeight: theme.touchTargets.minimum,
    marginTop: theme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});
