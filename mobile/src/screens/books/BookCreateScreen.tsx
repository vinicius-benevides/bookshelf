import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { useCreateBook } from '../../hooks/useBooks';
import { colors, spacing, typography } from '../../theme';
import { resolveImageUrl } from '../../utils/media';
import { useNavigation } from '@react-navigation/native';

const BookCreateScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverUri, setCoverUri] = useState<string | undefined>();
  const [coverUrl, setCoverUrl] = useState('');

  const navigation = useNavigation();
  const createBook = useCreateBook();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher a capa.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setCoverUri(result.assets[0].uri);
      setCoverUrl('');
    }
  };

  const handleSubmit = async () => {
    if (!title || !author) {
      Alert.alert('Campos obrigatórios', 'Título e autor são obrigatórios.');
      return;
    }
    await createBook.mutateAsync({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      coverUri,
      coverUrl: coverUrl.trim(),
    });
    Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
    navigation.goBack();
  };

  const previewUri = coverUri || coverUrl || undefined;
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const keyboardOffset = Platform.OS === 'ios' ? 80 : 0;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={keyboardBehavior} keyboardVerticalOffset={keyboardOffset} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl * 2 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Cadastrar livro</Text>
          <Input label="Título" value={title} onChangeText={setTitle} />
          <Input label="Autor" value={author} onChangeText={setAuthor} />
          <Input label="Descrição" value={description} onChangeText={setDescription} multiline numberOfLines={3} />
          <View style={styles.row}>
            <Button title="Escolher capa" onPress={pickImage} variant="ghost" />
            <Input
              label="URL da capa (opcional)"
              value={coverUrl}
              onChangeText={(text) => {
                setCoverUrl(text);
                if (text) setCoverUri(undefined);
              }}
              style={{ flex: 1 }}
              autoCapitalize="none"
            />
          </View>
          {previewUri ? (
            <Image source={{ uri: resolveImageUrl(previewUri) }} style={styles.preview} />
          ) : (
            <Text style={styles.helper}>Use uma capa da galeria ou cole uma URL de imagem.</Text>
          )}
          <Button title="Salvar" onPress={handleSubmit} loading={createBook.isPending} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text },
  row: { flexDirection: 'column', gap: spacing.sm },
  preview: { width: '100%', height: 220, borderRadius: 16, backgroundColor: colors.card },
  helper: { ...typography.caption, color: colors.muted },
});

export default BookCreateScreen;
