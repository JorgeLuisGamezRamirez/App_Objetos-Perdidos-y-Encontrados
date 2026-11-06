import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storageService } from '../services/storageService';
import { calculateMatchScore } from '../services/matchingService';
import { Item, UserProfile } from '../types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found' | 'mine'>('all');

  const loadData = async () => {
    const user = await storageService.getUser();
    const data = await storageService.getItems();
    setCurrentUser(user);
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const filteredItems = items.filter(i => {
    if (i.status === 'resolved' && filter !== 'mine') return false; // Regla: resueltos no aparecen en pendientes
    if (filter === 'mine') return i.userId === currentUser?.uid;
    if (filter === 'lost') return i.type === 'lost';
    if (filter === 'found') return i.type === 'found';
    return true;
  });

  const handleToggleStatus = async (id?: string) => {
    if (!id) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await storageService.toggleStatus(id);
    loadData();
  };

  return (
    <View style={styles.container}>
      {/* Filtros de Navegación */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={[styles.filterChip, filter === 'all' && styles.filterChipActive]} onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, filter === 'lost' && styles.filterChipActive]} onPress={() => setFilter('lost')}>
          <Text style={[styles.filterText, filter === 'lost' && styles.filterTextActive]}>🔴 Perdidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, filter === 'found' && styles.filterChipActive]} onPress={() => setFilter('found')}>
          <Text style={[styles.filterText, filter === 'found' && styles.filterTextActive]}>🔵 Encontrados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, filter === 'mine' && styles.filterChipActive]} onPress={() => setFilter('mine')}>
          <Text style={[styles.filterText, filter === 'mine' && styles.filterTextActive]}>📋 Mis Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => {
          const isMyPost = item.userId === currentUser?.uid;

          return (
            <View style={[styles.card, item.status === 'resolved' && styles.resolvedCard]}>
              {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.cardImage} /> : null}

              <View style={styles.cardBody}>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge]}>
                    <Text style={styles.badgeText}>{item.type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}</Text>
                  </View>
                  <Text style={styles.statusText}>{item.status === 'resolved' ? '✅ RECUPERADO / ENTREGADO' : '⏳ PENDIENTE'}</Text>
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemMeta}>📍 {item.location}  •  🏷️ {item.category}</Text>
                <Text style={styles.authorText}>Publicado por: {isMyPost ? 'Tí (Autor)' : item.userName}</Text>

                <View style={styles.divider} />

                {/* Acciones Diferenciadas por Autoría */}
                <View style={styles.actions}>
                  {isMyPost ? (
                    <>
                      <View style={styles.ownPostBadge}>
                        <Text style={styles.ownPostText}>👤 Tu publicación</Text>
                      </View>
                      <TouchableOpacity style={styles.statusButton} onPress={() => handleToggleStatus(item.id)}>
                        <Text style={styles.statusBtnText}>
                          {item.status === 'resolved' ? 'Reabrir' : 'Marcar Resuelto'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity 
                      style={styles.chatButton} 
                      onPress={() => navigation.navigate('Chat', { recipientId: item.userId })}
                    >
                      <Text style={styles.chatBtnText}>💬 Contactar a {item.userName.split(' ')[0]}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📂</Text>
            <Text style={styles.emptyTitle}>Sin publicaciones en esta sección</Text>
          </View>
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate('CreateItem')}>
          <Text style={styles.fabText}>+ Publicar Objeto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileBtnText}>👤 Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  filterBar: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', gap: 6 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: '#4F46E5' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  filterTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', marginHorizontal: 12, marginTop: 12, borderRadius: 16, overflow: 'hidden', elevation: 2 },
  resolvedCard: { opacity: 0.7, backgroundColor: '#F9FAFB' },
  cardImage: { width: '100%', height: 150 },
  cardBody: { padding: 14 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  lostBadge: { backgroundColor: '#FEE2E2' },
  foundBadge: { backgroundColor: '#DBEAFE' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#DC2626' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  itemTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  itemDesc: { fontSize: 13, color: '#4B5563', marginVertical: 4 },
  itemMeta: { fontSize: 12, color: '#9CA3AF' },
  authorText: { fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  ownPostBadge: { backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  ownPostText: { color: '#4F46E5', fontSize: 12, fontWeight: '600' },
  chatButton: { flex: 1, backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  chatBtnText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  statusButton: { backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  statusBtnText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#6B7280' },
  bottomNav: { flexDirection: 'row', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 10 },
  fabButton: { flex: 2, backgroundColor: '#4F46E5', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  profileBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  profileBtnText: { color: '#374151', fontWeight: '600', fontSize: 13 }
});
EOFcat << 'EOF' > src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storageService } from '../services/storageService';
import { calculateMatchScore } from '../services/matchingService';
import { Item, UserProfile } from '../types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found' | 'mine'>('all');

  const loadData = async () => {
    const user = await storageService.getUser();
    const data = await storageService.getItems();
    setCurrentUser(user);
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const filteredItems = items.filter(i => {
    if (i.status === 'resolved' && filter !== 'mine') return false; // Regla: resueltos no aparecen en pendientes
    if (filter === 'mine') return i.userId === currentUser?.uid;
    if (filter === 'lost') return i.type === 'lost';
    if (filter === 'found') return i.type === 'found';
    return true;
  });

  const handleToggleStatus = async (id?: string) => {
    if (!id) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await storageService.toggleStatus(id);
    loadData();
  };

  return (
    <View style={styles.container}>
      {/* Filtros de Navegación */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={[styles.filterChip, filter === 'all' && styles.filterChipActive]} onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, filter === 'lost' && styles.filterChipActive]} onPress={() => setFilter('lost')}>
          <Text style={[styles.filterText, filter === 'lost' && styles.filterTextActive]}>🔴 Perdidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, filter === 'found' && styles.filterChipActive]} onPress={() => setFilter('found')}>
          <Text style={[styles.filterText, filter === 'found' && styles.filterTextActive]}>🔵 Encontrados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, filter === 'mine' && styles.filterChipActive]} onPress={() => setFilter('mine')}>
          <Text style={[styles.filterText, filter === 'mine' && styles.filterTextActive]}>📋 Mis Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => {
          const isMyPost = item.userId === currentUser?.uid;

          return (
            <View style={[styles.card, item.status === 'resolved' && styles.resolvedCard]}>
              {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.cardImage} /> : null}

              <View style={styles.cardBody}>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge]}>
                    <Text style={styles.badgeText}>{item.type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}</Text>
                  </View>
                  <Text style={styles.statusText}>{item.status === 'resolved' ? '✅ RECUPERADO / ENTREGADO' : '⏳ PENDIENTE'}</Text>
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemMeta}>📍 {item.location}  •  🏷️ {item.category}</Text>
                <Text style={styles.authorText}>Publicado por: {isMyPost ? 'Tí (Autor)' : item.userName}</Text>

                <View style={styles.divider} />

                {/* Acciones Diferenciadas por Autoría */}
                <View style={styles.actions}>
                  {isMyPost ? (
                    <>
                      <View style={styles.ownPostBadge}>
                        <Text style={styles.ownPostText}>👤 Tu publicación</Text>
                      </View>
                      <TouchableOpacity style={styles.statusButton} onPress={() => handleToggleStatus(item.id)}>
                        <Text style={styles.statusBtnText}>
                          {item.status === 'resolved' ? 'Reabrir' : 'Marcar Resuelto'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity 
                      style={styles.chatButton} 
                      onPress={() => navigation.navigate('Chat', { recipientId: item.userId })}
                    >
                      <Text style={styles.chatBtnText}>💬 Contactar a {item.userName.split(' ')[0]}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📂</Text>
            <Text style={styles.emptyTitle}>Sin publicaciones en esta sección</Text>
          </View>
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate('CreateItem')}>
          <Text style={styles.fabText}>+ Publicar Objeto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileBtnText}>👤 Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  filterBar: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', gap: 6 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: '#4F46E5' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  filterTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', marginHorizontal: 12, marginTop: 12, borderRadius: 16, overflow: 'hidden', elevation: 2 },
  resolvedCard: { opacity: 0.7, backgroundColor: '#F9FAFB' },
  cardImage: { width: '100%', height: 150 },
  cardBody: { padding: 14 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  lostBadge: { backgroundColor: '#FEE2E2' },
  foundBadge: { backgroundColor: '#DBEAFE' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#DC2626' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  itemTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  itemDesc: { fontSize: 13, color: '#4B5563', marginVertical: 4 },
  itemMeta: { fontSize: 12, color: '#9CA3AF' },
  authorText: { fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  ownPostBadge: { backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  ownPostText: { color: '#4F46E5', fontSize: 12, fontWeight: '600' },
  chatButton: { flex: 1, backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  chatBtnText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  statusButton: { backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  statusBtnText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#6B7280' },
  bottomNav: { flexDirection: 'row', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 10 },
  fabButton: { flex: 2, backgroundColor: '#4F46E5', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  profileBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  profileBtnText: { color: '#374151', fontWeight: '600', fontSize: 13 }
});
