import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storageService } from '../services/storageService';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateItem'>;

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', // Mochila
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', // Cuaderno
  'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400', // Smartphone
  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400'  // Llaves
];

export const CreateItemScreen = ({ navigation }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [selectedImg, setSelectedImg] = useState(SAMPLE_IMAGES[0]);

  const handlePublish = async () => {
    if (!title || !description || !category || !location) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const user = await storageService.getUser();

    await storageService.addItem({
      title,
      description,
      category,
      location,
      type,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      imageUrl: selectedImg,
      userId: user?.uid || 'usr_demo',
      userName: user?.displayName || 'Jorge Luis Gámez'
    });

    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reportar Objeto</Text>

      {/* Selector de Tipo */}
      <View style={styles.typeSelector}>
        <TouchableOpacity 
          style={[styles.typeOption, type === 'lost' && styles.typeSelectedLost]} 
          onPress={() => setType('lost')}
        >
          <Text style={[styles.typeText, type === 'lost' && styles.typeTextActive]}>🔴 Objeto Perdido</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeOption, type === 'found' && styles.typeSelectedFound]} 
          onPress={() => setType('found')}
        >
          <Text style={[styles.typeText, type === 'found' && styles.typeTextActive]}>🔵 Objeto Encontrado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Fotografía de referencia</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imgPicker}>
        {SAMPLE_IMAGES.map((img, idx) => (
          <TouchableOpacity key={idx} onPress={() => setSelectedImg(img)}>
            <Image 
              source={{ uri: img }} 
              style={[styles.thumbImg, selectedImg === img && styles.thumbSelected]} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Título</Text>
      <TextInput placeholder="Ej. Cartera de cuero negra" value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput placeholder="Detalles de color, marcas o contenido..." value={description} onChangeText={setDescription} style={[styles.input, styles.textArea]} multiline />

      <Text style={styles.label}>Categoría</Text>
      <TextInput placeholder="Electrónica, Documentos, Ropa..." value={category} onChangeText={setCategory} style={styles.input} />

      <Text style={styles.label}>Ubicación</Text>
      <TextInput placeholder="Ej. Edificio B, Cafetería FIT" value={location} onChangeText={setLocation} style={styles.input} />

      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
        <Text style={styles.publishBtnText}>Publicar Reporte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFF' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
  typeSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 4, borderRadius: 12, marginBottom: 20 },
  typeOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  typeSelectedLost: { backgroundColor: '#EF4444' },
  typeSelectedFound: { backgroundColor: '#3B82F6' },
  typeText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  typeTextActive: { color: '#FFF' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  imgPicker: { flexDirection: 'row', marginBottom: 18 },
  thumbImg: { width: 70, height: 70, borderRadius: 10, marginRight: 10, borderWidth: 2, borderColor: 'transparent' },
  thumbSelected: { borderColor: '#4F46E5' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, marginBottom: 16, backgroundColor: '#F9FAFB', fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  publishBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  publishBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
