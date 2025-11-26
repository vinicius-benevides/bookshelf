import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Icon } from './Icon';

type Variant = 'primary' | 'ghost' | 'danger' | 'success';

interface Props extends PressableProps {
  title: string;
  loading?: boolean;
  variant?: Variant;
  icon?: React.ComponentProps<typeof Icon>['name'];
}

export const Button: React.FC<Props> = ({ title, loading, variant = 'primary', disabled, style, icon, ...rest }) => {
  const palette =
    variant === 'primary'
      ? { bg: colors.primary, border: colors.primary, text: colors.background }
      : variant === 'danger'
      ? { bg: 'transparent', border: colors.danger, text: colors.danger }
      : variant === 'success'
      ? { bg: 'transparent', border: colors.success, text: colors.success }
      : { bg: 'transparent', border: colors.primary, text: colors.primary };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
        style as any,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={palette.text} /> : null}
          <Text style={[styles.text, { color: palette.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    ...typography.subtitle,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
