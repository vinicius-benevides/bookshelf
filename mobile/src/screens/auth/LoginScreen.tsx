import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon } from '../../components/Icon';

type Props = NativeStackScreenProps<any, any>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await login(email.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>BookShelf</Text>
          <Text style={styles.subtitle}>Entre para acessar sua prateleira virtual</Text>
        </View>
        <View style={styles.form}>
          <Input label="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <Input
            label="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            rightIcon={<Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} color={colors.muted} />}
            onRightIconPress={() => setShowPassword((prev) => !prev)}
          />
          <Button title="Entrar" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.lg }} />
          <Button
            title="Criar conta"
            variant="ghost"
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.xl, marginTop: spacing.xl },
  title: { ...typography.title, color: colors.text, fontSize: 28 },
  subtitle: { ...typography.body, color: colors.muted },
  form: { gap: spacing.md },
});

export default LoginScreen;
