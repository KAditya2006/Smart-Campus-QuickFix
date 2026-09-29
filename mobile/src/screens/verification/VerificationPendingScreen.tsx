import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme/theme';

export default function VerificationPendingScreen() {
  const { user, refreshProfile, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    setIsRefreshing(false);
  };

  const isRejected = user?.identityVerificationStatus === 'REJECTED';
  const isManualReview = user?.identityVerificationStatus === 'MANUAL_REVIEW'; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRejected ? 'Verification Rejected' : 
         isManualReview ? 'Manual Review' : 'Verification Pending'}
      </Text>
      
      <Text style={styles.message}>
        {isRejected 
          ? 'Your identity verification failed. Please contact support or re-register with clear documents.'
          : isManualReview 
            ? 'Your identity document requires manual review by an administrator. Please check back later.'
            : 'Your identity document is currently being processed. This usually takes a few minutes.'}
      </Text>

      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={handleRefresh} 
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <ActivityIndicator color={theme.colors.surface} />
        ) : (
          <Text style={styles.buttonText}>Refresh Status</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  refreshButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.surface,
  },
  logoutButton: {
    paddingVertical: theme.spacing.md,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.secondaryText,
  }
});
