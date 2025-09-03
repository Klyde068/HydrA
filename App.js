// App.js
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Switch
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const Stack = createNativeStackNavigator();

// 🔧 Set this to your tank's maximum water depth in cm
const MAX_DISTANCE_CM = 30;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- LOGIN SCREEN ---
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username && password) {
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Error', 'Please enter both username and password');
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} color="#00e6c3" />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

// --- REGISTER SCREEN ---
function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    Alert.alert('Success', 'Account created!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <Button title="Register" onPress={handleRegister} color="#00e6c3" />
    </View>
  );
}

// --- DASHBOARD SCREEN ---
function DashboardScreen({ navigation }) {
  const [sensorData, setSensorData] = useState({
    hum: 0,
    water: 0,       // Distance in cm from ultrasonic sensor
    soiltemp: 0,
    soilph: 0,
  });

  const [relays, setRelays] = useState([false]);
  const relayNames = ["Water Pump"];

  // Fetch sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://192.168.1.106/sensor")
        .then((res) => res.json())
        .then((data) => setSensorData(data))
        .catch((err) => console.log("Fetch error:", err));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleRelay = (index) => {
    const newRelays = [...relays];
    newRelays[index] = !newRelays[index];
    setRelays(newRelays);

    fetch(
      `http://192.168.1.106/update?relay=${index + 1}&state=${newRelays[index] ? 1 : 0}`
    ).catch((err) => console.log("Relay error:", err));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'PlantHabitat',
      headerStyle: { backgroundColor: '#00e6c3' },
      headerTintColor: '#fff',
      headerRight: () => (
        <Button title="Logout" onPress={() => navigation.replace('Login')} color="#00e6c3" />
      ),
    });
  }, [navigation]);

  // 🔁 Calculate water level based on ultrasonic distance
  const rawDistance = sensorData.water ?? MAX_DISTANCE_CM;
  const waterLevelPercent = Math.max(
    0,
    Math.min(100, ((MAX_DISTANCE_CM - rawDistance) / MAX_DISTANCE_CM) * 100)
  );

  return (

    
    <ScrollView style={styles.dashboardContainer} contentContainerStyle={{ paddingBottom: 20 }}>

      {/* Relay Controls */}
      <Text style={[styles.label, { marginTop: 16 }]}>Device Controls</Text>
      {relays.map((state, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>{relayNames[index]}</Text>
          <Switch
            value={state}
            onValueChange={() => toggleRelay(index)}
            trackColor={{ false: '#555', true: '#00e6c3' }}
            thumbColor={state ? '#00e6c3' : '#ccc'}
          />
        </View>
      ))}
      
      {/* pH Gauge */}
      <View style={styles.card}>
        <Text style={styles.label}>pH Level</Text>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={(sensorData.soilph / 14) * 100}
          tintColor="#00e6c3"
          backgroundColor="#333"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text style={{ color: '#fff', fontSize: 24 }}>
              {sensorData.soilph.toFixed(1)} pH
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Humidity */}
      <View style={styles.card}>
        <Text style={styles.label}>Humidity</Text>
        <Text style={styles.value}>{sensorData.hum} %</Text>
      </View>

      {/* Water Temp */}
      <View style={styles.card}>
        <Text style={styles.label}>Water Temperature</Text>
        <Text style={styles.value}>{sensorData.soiltemp} °C</Text>
      </View>

      {/* Water Level */}
      <View style={styles.card}>
        <Text style={styles.label}>Water Level</Text>
        <View style={styles.meterContainer}>
          <View style={[styles.meterBar, { width: `${waterLevelPercent}%` }]} />
        </View>
        <View style={styles.meterLabels}>
          <Text style={styles.meterLabel}>Empty</Text>
          <Text style={styles.meterLabel}>Full</Text>
        </View>
        <Text style={styles.value}>{waterLevelPercent.toFixed(0)}%</Text>
      </View>

      
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    color: '#00e6c3',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#00e6c3',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },
  passwordWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00e6c3',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#2a2a2a',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#fff',
  },
  link: {
    marginTop: 16,
    color: '#00e6c3',
    textAlign: 'center',
    fontWeight: '500',
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    color: '#00e6c3',
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
  meterContainer: {
    height: 20,
    backgroundColor: '#444',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 6,
  },
  meterBar: {
    height: '100%',
    backgroundColor: '#00e6c3',
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabel: {
    color: '#ccc',
    fontSize: 12,
  },
});
