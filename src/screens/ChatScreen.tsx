import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export const ChatScreen = () => {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'me' }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msgBox, item.sender === 'me' ? styles.myMsg : styles.otherMsg]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={inputText} onChangeText={setInputText} placeholder="Escribe un mensaje..." />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  msgBox: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: '80%' },
  myMsg: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  otherMsg: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
  msgText: { color: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, marginRight: 8, height: 40 }
});
