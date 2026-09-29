import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import apiClient from '../../services/apiClient';
import { theme } from '../../theme/theme';

export default function AllIssuesScreen({ navigation }: any) {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('ALL'); // ALL, SUBMITTED, IN_PROGRESS, RESOLVED
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      const endpoint = filter === 'ALL'   
        ? '/authority/issues' 
        : `/authority/issues?status=${filter}`;
        
      const response = await apiClient.get(endpoint) as any;
      if (response.data.success) {
        setIssues(response.data.issues);
      } else {
        setError('Failed to fetch issues');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading issues');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchIssues();
    });
    return unsubscribe;
  }, [navigation, filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const FilterTab = ({ title, value }: { title: string, value: string }) => (
    <TouchableOpacity
      style={[styles.filterTab, filter === value && styles.filterTabActive]}
      onPress={() => {
        setFilter(value);
        setLoading(true);
      }}
    >
      <Text style={[styles.filterTabText, filter === value && styles.filterTabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderIssue = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.issueCard} 
      onPress={() => navigation.navigate('AuthorityIssueDetails', { issueId: item._id || item.issueId })}
    >
      <View style={styles.issueHeader}>
        <Text style={styles.issueTitle} numberOfLines={1}>{item.title || item.category}</Text>
        <View style={[styles.statusBadge, (styles as any)[`status_${item.status}`]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.issueLocation}>{item.location}</Text>
      <Text style={styles.issueDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Issues</Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { title: 'All', value: 'ALL' },
            { title: 'Submitted', value: 'SUBMITTED' },
            { title: 'In Progress', value: 'IN_PROGRESS' },
            { title: 'Resolved', value: 'RESOLVED' },
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => <FilterTab title={item.title} value={item.value} />}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={fetchIssues}>
            <Text style={styles.primaryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => item._id || item.issueId}
          renderItem={renderIssue}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No issues found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
  },
  filterContainer: {
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterTabText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.secondaryText,
  },
  filterTabTextActive: {
    color: theme.colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
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
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.secondaryText,
  },
  error: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.error,
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
