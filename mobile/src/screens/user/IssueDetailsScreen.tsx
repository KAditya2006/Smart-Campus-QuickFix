import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient, { API_BASE_URL } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme/theme';

export default function IssueDetailsScreen({ route, navigation }: any) {
  const { issueId } = route.params;
  const { token } = useAuth();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssue = async () => { 
    try {
      const response = await apiClient.get(`/issues/${issueId}`) as any;
      if (response.data.success) {
        setIssue(response.data.issue);
      } else {
        setError(response.data.error || 'Failed to fetch issue details');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error loading issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [issueId]);

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = API_BASE_URL.replace(/\/api$/, '');
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{issue.title}</Text>
            <View style={[styles.statusBadge, (styles as any)[`status_${issue.status}`]]}>
              <Text style={styles.statusText}>{issue.status}</Text>
            </View>
          </View>
          
          <Text style={styles.category}>{issue.category}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionText}>{issue.location}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>{issue.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <Text style={styles.sectionText}>{issue.priority || 'Unassigned'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Submitted On</Text>
            <Text style={styles.sectionText}>{new Date(issue.createdAt).toLocaleString()}</Text>
          </View>

          {issue.remarks && (
            <View style={styles.remarksSection}>
              <Text style={styles.sectionTitle}>Authority Remarks</Text>
              <Text style={styles.remarksText}>{issue.remarks}</Text>
            </View>
          )}

          {issue.photoUrl && (
            <View style={styles.section}>
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

          {issue.statusHistory && issue.statusHistory.length > 0 && (
            <View style={styles.timelineSection}>
              <Text style={styles.timelineHeader}>Status Timeline</Text>
              {issue.statusHistory.map((historyItem: any, index: number) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.timelineDot} />
                    {index !== issue.statusHistory.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStatus}>{historyItem.status}</Text>
                    <Text style={styles.timelineDate}>{new Date(historyItem.timestamp).toLocaleString()}</Text>
                    {historyItem.remark && <Text style={styles.timelineRemark}>"{historyItem.remark}"</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  error: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  backBtnText: {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.surface,
    fontWeight: theme.typography.weights.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
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
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  category: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
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
  section: {
    marginBottom: theme.spacing.md,
  },
  remarksSection: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F0FDF4',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondaryText,
    marginBottom: 4,
  },
  sectionText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primaryText,
  },
  remarksText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.success,
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
  },
  timelineSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  timelineHeader: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
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
    marginTop: 4,
    marginBottom: 4,
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
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.secondaryText,
    marginBottom: 4,
  },
  timelineRemark: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.darkSlate,
    fontStyle: 'italic',
    backgroundColor: '#F1F5F9',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: 4,
  }
});
