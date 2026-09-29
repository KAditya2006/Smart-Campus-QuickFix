import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient, { API_BASE_URL } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme/theme';

export default function AuthorityIssueDetailsScreen({ route, navigation }: any) {
  const { issueId } = route.params;
  const { token } = useAuth();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [remark, setRemark] = useState('');  
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  
  const [submitting, setSubmitting] = useState(false);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/authority/issues/${issueId}`) as any;
      if (response.data.success) {
        setIssue(response.data.issue);
        setSelectedStatus(response.data.issue.status);
        setSelectedPriority(response.data.issue.priority || 'LOW');
      } else {
        setError('Failed to fetch issue details');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [issueId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !issue) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Issue not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === issue.status) {
      setStatusModalVisible(false);
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.patch(`/authority/issues/${issue._id}/status`, {
        status: selectedStatus,
        remark: remark.trim()
      }) as any;

      if (response.data.success) {
        setIssue(response.data.issue);
        setStatusModalVisible(false);
        setRemark('');
        Alert.alert('Success', 'Status updated successfully.');
      } else {
        Alert.alert('Error', response.data.error || 'Failed to update status.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatusUpdate = async (status: string) => {
    try {
      setSubmitting(true);
      const response = await apiClient.patch(`/authority/issues/${issue._id}/status`, {
        status: status,
        remark: `Issue marked as ${status}`
      }) as any;

      if (response.data.success) {
        setIssue(response.data.issue);
        Alert.alert('Success', `Status updated to ${status}.`);
      } else {
        Alert.alert('Error', response.data.error || 'Failed to update status.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePriority = async () => {
    if (!selectedPriority || selectedPriority === issue.priority) {
      setPriorityModalVisible(false);
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.patch(`/authority/issues/${issue._id}/priority`, {
        priority: selectedPriority
      }) as any;

      if (response.data.success) {
        setIssue(response.data.issue);
        setPriorityModalVisible(false);
        Alert.alert('Success', 'Priority updated successfully.');
      } else {
        Alert.alert('Error', response.data.error || 'Failed to update priority.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Failed to update priority.');
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = API_BASE_URL.replace(/\/api$/, '');
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{issue.issueId || issue._id.substring(0, 8)}</Text>
          </View>
          
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Status:</Text>
            <View style={[styles.statusBadge, (styles as any)[`status_${issue.status}`]]}>
              <Text style={styles.statusText}>{issue.status}</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Priority:</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>{issue.priority || 'UNASSIGNED'}</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Date Reported:</Text>
            <Text style={styles.value}>{new Date(issue.createdAt).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reporter Information</Text>
          {issue.userId ? (
            <>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{issue.userId.fullName}</Text>
              
              <Text style={[styles.label, { marginTop: 8 }]}>College:</Text>
              <Text style={styles.value}>{issue.userId.college}</Text>

              <Text style={[styles.label, { marginTop: 8 }]}>Email:</Text>
              <Text style={styles.value}>{issue.userId.email}</Text>
            </>
          ) : (
            <Text style={styles.value}>Reporter information unavailable</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Issue Information</Text>
          
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{issue.category}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Location:</Text>
          <Text style={styles.value}>{issue.location}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Description:</Text>
          <Text style={styles.description}>{issue.description || 'No description provided.'}</Text>
        </View>

        {issue.photoUrl && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Evidence Photo</Text>
            <Image 
              source={{ 
                uri: getImageUrl(issue.photoUrl) as string,
                headers: { Authorization: `Bearer ${token}` }
              }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          {issue.statusHistory && issue.statusHistory.length > 0 ? (
            issue.statusHistory.map((historyItem: any, index: number) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIndicatorContainer}>
                  <View style={styles.timelineDot} />
                  {index < issue.statusHistory.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>{historyItem.status}</Text>
                  <Text style={styles.timelineDate}>{new Date(historyItem.timestamp).toLocaleString()}</Text>
                  {historyItem.remark && (
                    <Text style={styles.timelineRemark}>"{historyItem.remark}"</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.value}>No status history available.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Operational Actions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <TouchableOpacity 
              style={[styles.actionBtn, { flex: undefined, marginLeft: 0, width: '48%', backgroundColor: '#4CAF50', marginBottom: 12, opacity: issue.status !== 'SUBMITTED' ? 0.5 : 1 }]}
              onPress={() => handleQuickStatusUpdate('IN_PROGRESS')}
              disabled={issue.status !== 'SUBMITTED'}
            >
              <Text style={styles.actionBtnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, { flex: undefined, marginLeft: 0, width: '48%', backgroundColor: '#2196F3', marginBottom: 12, opacity: issue.status !== 'IN_PROGRESS' ? 0.5 : 1 }]}
              onPress={() => handleQuickStatusUpdate('RESOLVED')}
              disabled={issue.status !== 'IN_PROGRESS'}
            >
              <Text style={styles.actionBtnText}>Resolve</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, { flex: undefined, marginLeft: 0, width: '48%', backgroundColor: '#F44336', marginBottom: 12, opacity: issue.status !== 'SUBMITTED' ? 0.5 : 1 }]}
              onPress={() => handleQuickStatusUpdate('REJECTED')}
              disabled={issue.status !== 'SUBMITTED'}
            >
              <Text style={styles.actionBtnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtnOutline, { flex: undefined, marginRight: 0, width: '48%', marginBottom: 12 }]}
              onPress={() => setPriorityModalVisible(true)}
            >
              <Text style={styles.actionBtnOutlineText}>Priority</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                { flex: undefined, marginLeft: 0, width: '100%' },
                issue.status === 'RESOLVED' && styles.actionBtnDisabled
              ]}
              onPress={() => setStatusModalVisible(true)}
              disabled={issue.status === 'RESOLVED'}
            >
              <Text style={styles.actionBtnText}>Update Custom Status</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Priority Modal */}
      <Modal visible={priorityModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Priority</Text>
            <Text style={styles.modalSubtitle}>Current Priority: {issue.priority || 'UNASSIGNED'}</Text>
            
            <View style={styles.optionsContainer}>
              {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                <TouchableOpacity 
                  key={p} 
                  style={[styles.optionBtn, selectedPriority === p && styles.optionBtnActive]}
                  onPress={() => setSelectedPriority(p)}
                >
                  <Text style={[styles.optionBtnText, selectedPriority === p && styles.optionBtnTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPriorityModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleUpdatePriority} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSaveText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Status Modal */}
      <Modal visible={statusModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <Text style={styles.modalSubtitle}>Current Status: {issue.status}</Text>
            
            <View style={styles.optionsContainer}>
              {issue.status === 'SUBMITTED' && (
                <TouchableOpacity 
                  style={[styles.optionBtn, selectedStatus === 'IN_PROGRESS' && styles.optionBtnActive]}
                  onPress={() => setSelectedStatus('IN_PROGRESS')}
                >
                  <Text style={[styles.optionBtnText, selectedStatus === 'IN_PROGRESS' && styles.optionBtnTextActive]}>IN PROGRESS</Text>
                </TouchableOpacity>
              )}
              {issue.status === 'IN_PROGRESS' && (
                <TouchableOpacity 
                  style={[styles.optionBtn, selectedStatus === 'RESOLVED' && styles.optionBtnActive]}
                  onPress={() => setSelectedStatus('RESOLVED')}
                >
                  <Text style={[styles.optionBtnText, selectedStatus === 'RESOLVED' && styles.optionBtnTextActive]}>RESOLVED</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.label}>Remark (Optional):</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Maintenance team has started work."
              value={remark}
              onChangeText={setRemark}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => {
                setStatusModalVisible(false);
                setRemark('');
                setSelectedStatus(issue.status);
              }}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSaveBtn, (!selectedStatus || selectedStatus === issue.status) && styles.actionBtnDisabled]} 
                onPress={handleUpdateStatus} 
                disabled={submitting || !selectedStatus || selectedStatus === issue.status}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSaveText}>Update</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerBackBtn: {
    marginRight: theme.spacing.md,
  },
  headerBackText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primary,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.secondaryText,
  },
  value: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primaryText,
    marginTop: 2,
  },
  description: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primaryText,
    marginTop: theme.spacing.xs,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.border,
  },
  status_SUBMITTED: {
    backgroundColor: '#E2E8F0',
  },
  status_IN_PROGRESS: {
    backgroundColor: '#FEF3C7',
  },
  status_RESOLVED: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.darkSlate,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
  },
  error: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  backBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  backBtnText: {
    color: theme.colors.surface,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineIndicatorContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  timelineStatus: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
  },
  timelineDate: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondaryText,
    marginTop: 2,
  },
  timelineRemark: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.darkSlate,
    fontStyle: 'italic',
    marginTop: 4,
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 4,
  },
  actionsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  infoText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F3E8FF',
  },
  priorityText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: '#7E22CE',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.xs,
    alignItems: 'center',
  },
  actionBtnOutlineText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.xs,
    alignItems: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  optionBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.secondaryText,
  },
  optionBtnTextActive: {
    color: theme.colors.surface,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primaryText,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  modalCancelBtn: {
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  modalCancelText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.secondaryText,
  },
  modalSaveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  modalSaveText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.surface,
  }
});
