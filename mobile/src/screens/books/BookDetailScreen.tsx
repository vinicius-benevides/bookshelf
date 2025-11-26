import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { useAddToShelf } from '../../hooks/useBooks';
import { useShelf } from '../../hooks/useShelf';
import { booksApi } from '../../services/endpoints';
import { colors, spacing, typography } from '../../theme';
import { resolveImageUrl } from '../../utils/media';

type Props = NativeStackScreenProps<any, any>;

const BookDetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params as { id: string };
  const addToShelf = useAddToShelf();
  const { data: shelf } = useShelf();
  const queryClient = useQueryClient();
  const [score, setScore] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data: book } = await booksApi.getById(id);
      return book;
    },
  });

  const inShelf = useMemo(() => !!(shelf || []).find((s) => s.book._id === id), [shelf, id]);

  const rateMutation = useMutation({
    mutationFn: (value: number) => booksApi.rate(id, value),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['book', id] });
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const previousScore = data?.userRating ?? null;
  const selectedScore = score ?? previousScore ?? 0;
  const isSameAsPrevious = score !== null && previousScore !== null && score === previousScore;

  const handleSelectScore = (value: number) => {
    setScore(value);
  };

  const handleSaveScore = () => {
    if (score === null || isSameAsPrevious) return;
    rateMutation.mutate(score);
  };

  if (isLoading || !data) {
    return (
      <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
          <View style={styles.bookSection}>
            <View style={styles.header}>
              {data.coverImageUrl ? (
                <Image source={{ uri: resolveImageUrl(data.coverImageUrl) }} style={styles.cover} />
              ) : (
                <View style={[styles.cover, styles.placeholder]}>
                  <Text style={styles.placeholderText}>Sem capa</Text>
                </View>
              )}
              <View style={{ flex: 1, gap: spacing.sm }}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.author}>{data.author}</Text>
              </View>
            </View>
            {data.description ? <Text style={styles.description}>{data.description}</Text> : null}
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionRow}>
              <Icon name="list-circle-outline" color={colors.text} size={18} />
              <Text style={styles.section}>Ações</Text>
            </View>
            <Button
              title={inShelf ? 'Adicionado a estante' : 'Adicionar a estante'}
              variant={inShelf ? 'success' : 'primary'}
              onPress={() => addToShelf.mutate(data._id)}
            />
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionRow}>
              <Icon name="star-outline" color={colors.text} size={18} />
              <Text style={styles.section}>Avaliação</Text>
            </View>
            <View style={styles.ratingWrapper}>
              {[1, 2, 3, 4, 5].map((val) => {
                const filled = selectedScore >= val;
                return (
                  <Pressable key={val} onPress={() => handleSelectScore(val)} hitSlop={10}>
                    <Icon name={filled ? 'star' : 'star-outline'} color={colors.accent} size={34} />
                  </Pressable>
                );
              })}
            </View>
            <Button
              title="Salvar nota"
              onPress={handleSaveScore}
              disabled={score === null || isSameAsPrevious || rateMutation.isPending}
              loading={rateMutation.isPending}
              variant="primary"
            />
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingText}>
                Média {data.ratingAvg?.toFixed(1) ?? '0.0'} ({data.ratingCount ?? 0} {data.ratingCount == 1 ? 'avaliação' : 'avaliações'})
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xl, flexGrow: 1 },
  sectionsContainer: { flex: 1, justifyContent: 'space-between', gap: spacing.lg },
  bookSection: { gap: spacing.md },
  sectionBlock: { gap: spacing.sm },
  header: { flexDirection: 'row', gap: spacing.md },
  cover: { width: 120, height: 170, borderRadius: 16, backgroundColor: colors.card },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.muted },
  title: { ...typography.title, color: colors.text },
  author: { ...typography.body, color: colors.muted },
  description: { ...typography.body, color: colors.text, marginTop: spacing.lg, lineHeight: 22 },
  section: { ...typography.subtitle, color: colors.text },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ratingWrapper: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  ratingInfo: { marginTop: spacing.xs },
  ratingText: { ...typography.caption, color: colors.muted },
});

export default BookDetailScreen;
