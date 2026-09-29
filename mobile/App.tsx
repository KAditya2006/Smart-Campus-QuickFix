import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigation from './src/navigation/RootNavigation';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
