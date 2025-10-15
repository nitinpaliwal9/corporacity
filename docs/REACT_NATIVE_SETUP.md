# 📱 React Native App Setup Guide

## Prerequisites

1. **Node.js** (v16 or later)
2. **React Native CLI**
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development - macOS only)

## Quick Start

### 1. Install React Native CLI
```bash
npm install -g @react-native-community/cli
```

### 2. Create New Project
```bash
npx react-native init CorporacityApp
cd CorporacityApp
```

### 3. Install Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Supabase
npm install @supabase/supabase-js

# UI Components
npm install react-native-vector-icons
npm install react-native-linear-gradient
npm install react-native-chart-kit

# Device Features
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
npm install @react-native-community/push-notification-ios
npm install react-native-push-notification

# For iOS
cd ios && pod install && cd ..
```

## Project Structure

```
CorporacityApp/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   └── charts/
│   ├── screens/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── employee/
│   │   └── ceo/
│   ├── navigation/
│   ├── services/
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   └── notifications.js
│   ├── utils/
│   └── constants/
├── android/
├── ios/
└── package.json
```

## Core Files

### 1. Supabase Configuration (`src/services/supabase.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 2. Navigation Setup (`src/navigation/AppNavigator.js`)
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/auth/LoginScreen';
import EmployeeDashboard from '../screens/employee/EmployeeDashboard';
import CEODashboard from '../screens/ceo/CEODashboard';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function EmployeeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={EmployeeDashboard} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Employee" component={EmployeeTabs} />
        <Stack.Screen name="CEO" component={CEODashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Authentication Service (`src/services/auth.js`)
```javascript
import { supabase } from './supabase';

export const authService = {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
```

### 4. Employee Dashboard (`src/screens/employee/EmployeeDashboard.js`)
```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../../services/supabase';

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const updateStatus = async () => {
    if (!status.trim()) {
      Alert.alert('Error', 'Please enter a status update');
      return;
    }

    const { error } = await supabase
      .from('corp_statuses')
      .insert([
        {
          user_id: user.id,
          type: 'working',
          message: status,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Status updated successfully');
      setStatus('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employee Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.email}</Text>
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Update Your Status</Text>
        <TextInput
          style={styles.statusInput}
          placeholder="What are you working on?"
          value={status}
          onChangeText={setStatus}
          multiline
        />
        <TouchableOpacity style={styles.updateButton} onPress={updateStatus}>
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  statusSection: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  statusInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## Development Commands

### Start Development Server
```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

### Build for Production
```bash
# Android
cd android && ./gradlew assembleRelease

# iOS
cd ios && xcodebuild -workspace CorporacityApp.xcworkspace -scheme CorporacityApp -configuration Release
```

## Key Features to Implement

### 1. Authentication
- Google OAuth integration
- Biometric authentication
- Secure token storage

### 2. Core Features
- Employee status updates
- CEO team management
- Real-time notifications
- Offline capabilities

### 3. Advanced Features
- Push notifications
- Camera integration
- GPS location tracking
- Background sync

## Deployment

### Android (Google Play Store)
1. Generate signed APK
2. Create Google Play Console account
3. Upload APK and fill store listing
4. Submit for review

### iOS (App Store)
1. Create Apple Developer account
2. Configure app in Xcode
3. Archive and upload to App Store Connect
4. Submit for review

## Cost Estimation

- **Development:** $15,000 - $30,000
- **App Store Fees:** $200/year (both platforms)
- **Maintenance:** $2,000 - $5,000/year
- **Total First Year:** $17,200 - $35,200

## Timeline

- **Setup & Planning:** 1 week
- **Core Features:** 6-8 weeks
- **Advanced Features:** 4-6 weeks
- **Testing & Polish:** 2-3 weeks
- **App Store Submission:** 1-2 weeks
- **Total:** 14-20 weeks

## Next Steps

1. **Start with PWA** - Test user adoption
2. **Gather Feedback** - Understand mobile needs
3. **Plan Native App** - Define requirements
4. **Choose Technology** - React Native vs Flutter
5. **Begin Development** - Start with MVP features

