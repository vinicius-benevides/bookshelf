import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme';
import BookListScreen from '../screens/books/BookListScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import BookCreateScreen from '../screens/books/BookCreateScreen';
import ShelfScreen from '../screens/shelf/ShelfScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { Icon } from '../components/Icon';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const BooksStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    text: colors.text,
    card: colors.surface,
    border: colors.border,
  },
};

const headerOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { color: colors.text },
  headerTintColor: colors.text,
};

function BooksNavigator() {
  return (
    <BooksStack.Navigator screenOptions={headerOptions}>
      <BooksStack.Screen name="BooksList" component={BookListScreen} options={{ title: 'Livros' }} />
      <BooksStack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalhes' }} />
      <BooksStack.Screen name="BookCreate" component={BookCreateScreen} options={{ title: 'Cadastrar livro' }} />
    </BooksStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Livros"
        component={BooksNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="book-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Estante"
        component={ShelfScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="library-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={headerOptions}>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
  </AuthStack.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
