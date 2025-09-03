import React, { useState } from 'react';
import { Switch } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

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

function DashboardScreen({ navigation }) {
  const [selectedRange, setSelectedRange] = useState('12h');

  const [isPumpOn, setIsPumpOn] = useState(false);
  const [isDoserOn, setIsDoserOn] = useState(false);

  const [pumpDate, setPumpDate] = useState(new Date());
  const [doserDate, setDoserDate] = useState(new Date());

  const [showPumpPicker, setShowPumpPicker] = useState(false);
  const [showDoserPicker, setShowDoserPicker] = useState(false);

  const [waterLevel, setWaterLevel] = useState(0.6);
  const [humidity, setHumidity] = useState(45); 
  const [waterTemp, setWaterTemp] = useState(22); 


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

  const onChangePumpDate = (event, selectedDate) => {
    setShowPumpPicker(false);
    if (selectedDate) setPumpDate(selectedDate);
  };

  const onChangeDoserDate = (event, selectedDate) => {
    setShowDoserPicker(false);
    if (selectedDate) setDoserDate(selectedDate);
  };

  return (
    <ScrollView style={styles.dashboardContainer} contentContainerStyle={{ paddingBottom: 20 }}>
     <View style={styles.card}>
  <Text style={styles.label}>pH Level</Text>
  <AnimatedCircularProgress
    size={120}
    width={15}
    fill={20} 
    tintColor="#00e6c3"
    backgroundColor="#333"
    rotation={0}
    lineCap="round"
  >
    {
      (fill) => (
        <Text style={{ color: '#fff', fontSize: 24 }}>
          {((fill / 100) * 14).toFixed(1)} pH
        </Text>
      )
    }
  </AnimatedCircularProgress>
</View>

<View style={styles.card}>
  <Text style={styles.label}>Humidity</Text>
  <Text style={styles.value}>{humidity}%</Text>
</View>

<View style={styles.card}>
  <Text style={styles.label}>Water Temperature</Text>
  <Text style={styles.value}>{waterTemp}°C</Text>
</View>


      <View style={styles.card}>
  <Text style={styles.label}>Water Level</Text>
  <View style={styles.meterContainer}>
    <View style={[styles.meterBar, { width: `${waterLevel * 100}%` }]} />
  </View>
  <View style={styles.meterLabels}>
    <Text style={styles.meterLabel}>Empty</Text>
    <Text style={styles.meterLabel}>Full</Text>
  </View>
  <Text style={styles.value}>{Math.round(waterLevel * 100)}%</Text>
</View>

      <View style={styles.card}>
        <Text style={styles.label}>Doser</Text>
        <Switch
          value={isDoserOn}
          onValueChange={setIsDoserOn}
          trackColor={{ false: '#555', true: '#00e6c3' }}
          thumbColor={isDoserOn ? '#00e6c3' : '#ccc'}
        />
        <Button
          title="Set Doser Schedule"
          onPress={() => {
            Keyboard.dismiss();
            setShowDoserPicker(true);
          }}
          color="#00e6c3"
          />

        <Text style={styles.value}>Scheduled: {doserDate.toLocaleString()}</Text>
        <DateTimePickerModal
  isVisible={showDoserPicker}
  mode="datetime"
  onConfirm={(date) => {
    setDoserDate(date);
    setShowDoserPicker(false);
  }}
  onCancel={() => setShowDoserPicker(false)}
/>

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#1e1e1e', // Match Dashboard
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    color: '#00e6c3', // Consistent accent color
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
  timeToggle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  rangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#444',
    marginRight: 10,
  },
  rangeButtonSelected: {
    backgroundColor: '#00e6c3',
  },
  rangeButtonText: {
    color: '#ccc',
  },
  rangeButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
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

