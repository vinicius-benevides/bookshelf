import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon } from '../../components/Icon';

type Props = NativeStackScreenProps<any, any>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas nao conferem.');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } finally {
      setLoading(false);
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const keyboardOffset = Platform.OS === 'ios' ? 80 : 0;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={keyboardBehavior} keyboardVerticalOffset={keyboardOffset} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl * 2 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Monte sua prateleira e compartilhe novos livros</Text>
          </View>
          <View style={styles.form}>
            <Input label="Nome" value={name} onChangeText={setName} autoCapitalize="none" autoCorrect={false} />
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
            <Input
              label="Confirmar senha"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={<Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} color={colors.muted} />}
              onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
            />
            <Button title="Criar conta" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.lg }} />
            <Button
              title="Já tenho conta"
              variant="ghost"
              onPress={() => navigation.navigate('Login')}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </ScrollView>
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

export default RegisterScreen;
