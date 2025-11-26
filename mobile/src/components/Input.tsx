import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<Props> = ({ label, error, style, rightIcon, onRightIconPress, ...rest }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={colors.muted}
          style={[styles.input, style as any]}
          selectionColor={colors.primary}
          {...rest}
        />
        {rightIcon ? (
          <Pressable style={styles.icon} onPress={onRightIconPress}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { ...typography.body, color: colors.muted, marginBottom: spacing.xs },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  icon: { paddingLeft: spacing.sm },
  error: { color: colors.danger, ...typography.caption, marginTop: spacing.xs },
});
