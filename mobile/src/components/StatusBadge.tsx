import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { BookStatus } from '../types/api';
import { Icon } from './Icon';

const statusMap: Record<BookStatus, { label: string; color: string; icon: string }> = {
  not_started: { label: 'Na estante', color: colors.muted, icon: 'bookmark-outline' },
  reading: { label: 'Lendo', color: colors.accent, icon: 'book-outline' },
  finished: { label: 'Finalizado', color: colors.success, icon: 'checkmark-done-outline' },
};

export const StatusBadge: React.FC<{ status: BookStatus }> = ({ status }) => {
  const cfg = statusMap[status];
  return (
    <View style={[styles.badge, { borderColor: cfg.color }]}>
      <Icon name={cfg.icon as any} size={14} color={cfg.color} />
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: { ...typography.caption, fontWeight: '700' as const },
});
