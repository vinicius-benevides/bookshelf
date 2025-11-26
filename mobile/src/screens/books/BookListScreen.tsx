import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookCard } from '../../components/BookCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SearchBar } from '../../components/SearchBar';
import { useAddToShelf, useBooks } from '../../hooks/useBooks';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography } from '../../theme';
import { useShelf } from '../../hooks/useShelf';

type Props = NativeStackScreenProps<any, any>;

const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [sort, setSort] = useState<'date' | 'title' | 'rating'>('date');
  const { data, isLoading, refetch, isRefetching } = useBooks(submittedSearch, sort);
  const addToShelf = useAddToShelf();
  const { logout, user } = useAuth();
  const { data: shelf } = useShelf();

  const shelfIds = useMemo(() => new Set((shelf || []).map((s) => s.book._id)), [shelf]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Sair" variant="ghost" onPress={logout} style={{ paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }} />
      ),
      headerTitle: `Olá, ${user?.name?.split(' ')[0] || 'leitor'}`,
    });
  }, [navigation, logout, user]);

  const handleSearch = () => setSubmittedSearch(search);

  return (
    <Screen>
      <View style={styles.topBar}>
        <SearchBar value={search} onChange={setSearch} onSubmit={handleSearch} />
        <Button title="Novo" onPress={() => navigation.navigate('BookCreate')} style={{ marginTop: spacing.sm }} />
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <View style={styles.sortButtons}>
            {[
              { key: 'date', label: 'Data' },
              { key: 'title', label: 'Título' },
              { key: 'rating', label: 'Relevância' },
            ].map((opt) => (
              <Button
                key={opt.key}
                title={opt.label}
                variant={sort === opt.key ? 'primary' : 'ghost'}
                onPress={() => setSort(opt.key as any)}
                style={styles.sortButton}
              />
            ))}
          </View>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.md }}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetail', { id: item._id })}
            onAddToShelf={() => addToShelf.mutate(item._id)}
            inShelf={shelfIds.has(item._id)}
            ratingAvg={item.ratingAvg}
            ratingCount={item.ratingCount}
          />
        )}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          !isLoading ? <EmptyState message="Nenhum livro encontrado. Que tal cadastrar o primeiro?" /> : null
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  topBar: { gap: spacing.sm, paddingBottom: spacing.md },
  title: { ...typography.title, color: colors.text },
  sortRow: { gap: spacing.xs },
  sortLabel: { ...typography.caption, color: colors.muted },
  sortButtons: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  sortButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});

export default BookListScreen;
