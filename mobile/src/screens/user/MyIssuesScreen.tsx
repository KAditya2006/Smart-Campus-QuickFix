import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import apiClient from '../../services/apiClient';
import { theme } from '../../theme/theme';

export default function MyIssuesScreen({ navigation }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      const response = await apiClient.get('/issues/my') as any;
      if (response.data.success) {
        setIssues(response.data.issues);  
      } else {
        setError('Failed to fetch issues');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch issues');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderIssue = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.issueCard} 
      onPress={() => navigation.navigate('IssueDetails', { issueId: item._id })}
    >
      <View style={styles.issueHeader}>
        <Text style={styles.issueTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.statusBadge, (styles as any)[`status_${item.status}`]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.issueCategory}>{item.category}</Text>
      <Text style={styles.issueLocation}>{item.location}</Text>
      <Text style={styles.issueDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.sm }}>
        <Image source={require('../../../assets/quickfix_logo.jpg')} style={{ width: 35, height: 35, borderRadius: 8, marginRight: 10 }} />
        <Text style={[styles.title, { padding: 0, paddingTop: 0 }]}>My Issues</Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      
      <FlatList
        data={issues}
        keyExtractor={(item) => item._id}
        renderItem={renderIssue}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You haven't reported any issues yet.</Text>
            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={() => navigation.navigate('Dashboard', { screen: 'ReportIssue' })}
            >
              <Text style={styles.primaryBtnText}>Report an Issue</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  error: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  issueCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  issueTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
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
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.darkSlate,
  },
  issueCategory: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  issueLocation: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xs,
  },
  issueDate: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.secondaryText,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.xl * 2,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  primaryBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.surface,
  },
});
