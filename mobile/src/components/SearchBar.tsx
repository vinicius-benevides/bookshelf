import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}

export const SearchBar: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar livros..."
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        {/* simple magnifier shape */}
        <View style={styles.circle} />
        <View style={styles.handle} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    paddingVertical: spacing.sm,
  },
  button: {
    padding: spacing.sm,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.primary,
    transform: [{ translateY: 2 }],
  },
  handle: {
    width: 8,
    height: 2,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }, { translateX: 6 }, { translateY: -4 }],
  },
});
