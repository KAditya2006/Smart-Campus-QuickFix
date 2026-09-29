import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import { theme } from '../../theme/theme';

export default function DashboardScreen({ navigation }: any) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
 
  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count') as any;
      if (response.data?.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread count', err);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/users/me/dashboard') as any;
      if (response.data?.success) {
        setData(response.data);
      } else {
        setError('Failed to load dashboard.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchDashboard();
        fetchUnreadCount();
      }, 5000);

      return () => clearInterval(interval);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
    fetchUnreadCount();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={fetchDashboard}>
          <Text style={styles.primaryBtnText}>Retry</Text>
        </TouchableOpacity>
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
      <Text style={styles.issueLocation}>{item.location}</Text>
      <Text style={styles.issueDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.recentIssues || []}
        keyExtractor={(item) => item._id}
        renderItem={renderIssue}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image source={require('../../../assets/quickfix_logo.jpg')} style={{ width: 45, height: 45, borderRadius: 10, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.greeting} numberOfLines={1}>Hello, {user?.fullName?.split(' ')[0]}</Text>
                  <Text style={styles.subGreeting} numberOfLines={1}>Welcome to Smart Campus QuickFix</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.notificationBell}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Text style={styles.bellIcon}>🔔</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
              <TouchableOpacity style={styles.summaryBox} onPress={() => navigation.navigate('Issues')}>
                <Text style={styles.summaryValue}>{data?.summary?.total || 0}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.summaryBox} onPress={() => navigation.navigate('Issues')}>
                <Text style={styles.summaryValue}>{data?.summary?.submitted || 0}</Text>
                <Text style={styles.summaryLabel}>Submitted</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.summaryBox} onPress={() => navigation.navigate('Issues')}>
                <Text style={styles.summaryValue}>{data?.summary?.inProgress || 0}</Text>
                <Text style={styles.summaryLabel}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.summaryBox} onPress={() => navigation.navigate('Issues')}>
                <Text style={styles.summaryValue}>{data?.summary?.resolved || 0}</Text>
                <Text style={styles.summaryLabel}>Resolved</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.reportBtn} 
              onPress={() => navigation.navigate('ReportIssue')}
            >
              <Text style={styles.reportBtnText}>Report an Issue</Text>
            </TouchableOpacity>

            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Issues</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Issues')}>
                <Text style={styles.viewAllBtn}>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You haven't reported any issues yet.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  error: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  notificationBell: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  bellIcon: {
    fontSize: 24,
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  greeting: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
  },
  subGreeting: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.xs,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  summaryBox: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.xs,
  },
  reportBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  reportBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.surface,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primaryText,
  },
  viewAllBtn: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
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
