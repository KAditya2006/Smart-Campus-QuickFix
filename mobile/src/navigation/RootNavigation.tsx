import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import VerificationPendingScreen from '../screens/verification/VerificationPendingScreen';
import UserNavigator from './UserNavigator';

const Stack = createNativeStackNavigator();

import AuthorityNavigator from './AuthorityNavigator';

export default function RootNavigation() {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#176B52" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token && user ? (
          // Authenticated Stack
          user.role === 'AUTHORITY' ? (
            <Stack.Screen name="AuthorityApp" component={AuthorityNavigator} />
          ) : user.identityVerificationStatus === 'VERIFIED' ? (
            <Stack.Screen name="UserApp" component={UserNavigator} />
          ) : (
            <Stack.Screen name="VerificationPending" component={VerificationPendingScreen} />
          )
        ) : (
          // Auth Stack
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    marginTop: 20,
    color: '#176B52',
    fontWeight: 'bold',
  }
});
