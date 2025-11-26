import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Book } from '../types/api';
import { resolveImageUrl } from '../utils/media';
import { Icon } from './Icon';

interface Props {
  book: Book;
  onPress?: () => void;
  onAddToShelf?: () => void;
  inShelf?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
}

export const BookCard: React.FC<Props> = ({ book, onPress, onAddToShelf, inShelf, ratingAvg, ratingCount }) => {
  const isAdded = !!inShelf;
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.coverWrapper}>
        {book.coverImageUrl ? (
          <Image source={{ uri: resolveImageUrl(book.coverImageUrl) }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Text style={styles.placeholderText}>Sem capa</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.actionRow}>
          {typeof ratingAvg === 'number' ? (
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color={colors.accent} />
              <Text style={styles.ratingText}>
                {ratingAvg.toFixed(1)} ({ratingCount ?? 0})
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {onAddToShelf ? (
            <Pressable style={[styles.addBtn, isAdded ? styles.added : styles.add]} onPress={onAddToShelf}>
              <Text style={[styles.addText, isAdded ? styles.addedText : styles.addText]}>
                {isAdded ? 'Adicionado' : '+ Estante'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  coverWrapper: { width: 70, height: 100 },
  cover: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.muted, ...typography.caption },
  info: { flex: 1, gap: spacing.xs },
  title: { ...typography.subtitle, color: colors.text },
  author: { ...typography.caption, color: colors.muted },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  ratingText: { ...typography.caption, color: colors.text },
  addBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
  },
  add: { backgroundColor: colors.primary, borderColor: colors.primary },
  added: { backgroundColor: 'transparent', borderColor: colors.success },
  addText: { color: colors.background, ...typography.caption, fontWeight: '700' as const },
  addedText: { color: colors.success },
});
