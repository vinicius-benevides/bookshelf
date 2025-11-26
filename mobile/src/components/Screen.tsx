import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export const Screen: React.FC<ViewProps> = ({ children, style, ...rest }) => (
  <SafeAreaView style={styles.safe}>
    <View style={[styles.container, style as any]} {...rest}>
      {children}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
});
