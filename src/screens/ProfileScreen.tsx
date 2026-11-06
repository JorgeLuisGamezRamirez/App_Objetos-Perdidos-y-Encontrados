import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storageService } from '../services/storageService';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen = ({ navigation }: Props) => {
  const [user, setUser] = useState<{ displayName: string; email: string; photoURL?: string } | null>(null);

  useEffect(() => {
    storageService.getUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    await storageService.clearUser();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={{ uri: user?.photoURL || 'https://picsum.photos/id/64/100/100' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user?.displayName || 'Jorge Luis Gámez'}</Text>
        <Text style={styles.email}>{user?.email || 'jorge.gamez@uat.edu.mx'}</Text>

        <View style={styles.badgeAuth}>
          <Text style={styles.badgeAuthText}>✓ Autenticado con Google</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 2 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 15 },
  badgeAuth: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 25 },
  badgeAuthText: { color: '#059669', fontSize: 12, fontWeight: '600' },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, width: '100%', alignItems: 'center' },
  logoutBtnText: { color: '#DC2626', fontWeight: 'bold', fontSize: 14 }
});
