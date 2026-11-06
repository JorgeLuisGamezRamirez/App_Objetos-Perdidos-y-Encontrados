import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storageService } from '../services/storageService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectAccount = async (name: string, email: string, photo: string) => {
    setLoading(true);
    setTimeout(async () => {
      await storageService.saveUser({
        uid: 'usr_' + Date.now(),
        displayName: name,
        email: email,
        photoURL: photo
      });
      setLoading(false);
      setShowModal(false);
      navigation.replace('Home');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🔍</Text>
        </View>
        <Text style={styles.title}>Objetos Perdidos</Text>
        <Text style={styles.subtitle}>Encuentra y reporta pertenencias en tu comunidad</Text>

        <TouchableOpacity style={styles.googleBtn} onPress={() => setShowModal(true)}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
            style={styles.googleIcon} 
          />
          <Text style={styles.googleBtnText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Simulación Google OAuth 2.0 */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.loadingText}>Iniciando sesión con Google...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Selecciona una cuenta</Text>
                <Text style={styles.modalSub}>para ir a Objetos Perdidos</Text>

                <TouchableOpacity 
                  style={styles.accountItem} 
                  onPress={() => handleSelectAccount('Jorge Luis Gámez', 'jorge.gamez@uat.edu.mx', 'https://picsum.photos/id/64/100/100')}
                >
                  <Image source={{ uri: 'https://picsum.photos/id/64/100/100' }} style={styles.avatar} />
                  <View>
                    <Text style={styles.accName}>Jorge Luis Gámez</Text>
                    <Text style={styles.accEmail}>jorge.gamez@uat.edu.mx</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.accountItem} 
                  onPress={() => handleSelectAccount('Usuario Invitado', 'invitado@gmail.com', 'https://picsum.photos/id/1005/100/100')}
                >
                  <Image source={{ uri: 'https://picsum.photos/id/1005/100/100' }} style={styles.avatar} />
                  <View>
                    <Text style={styles.accName}>Usuario Invitado</Text>
                    <Text style={styles.accEmail}>invitado@gmail.com</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 24, width: '100%', maxWidth: 400, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, elevation: 8 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  iconEmoji: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 30 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, width: '100%', justifyContent: 'center' },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', maxWidth: 360 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  modalSub: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  accountItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  accName: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  accEmail: { fontSize: 12, color: '#6B7280' },
  closeBtn: { marginTop: 15, alignItems: 'center', paddingVertical: 8 },
  closeBtnText: { color: '#EF4444', fontWeight: '600' },
  loadingBox: { alignItems: 'center', paddingVertical: 20 },
  loadingText: { marginTop: 12, color: '#4B5563', fontSize: 14 }
});
