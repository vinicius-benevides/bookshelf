import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export const LoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.backdrop}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
