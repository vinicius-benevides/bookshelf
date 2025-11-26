import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useShelf, useShelfRemove, useShelfStatus } from '../../hooks/useShelf';
import { colors, spacing, typography } from '../../theme';
import { BookStatus, ShelfEntry } from '../../types/api';
import { resolveImageUrl } from '../../utils/media';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const STATUS_OPTIONS: BookStatus[] = ['not_started', 'reading', 'finished'];
type SectionData = { title: string; status: BookStatus; data: ShelfEntry[]; isCollapsed: boolean };

type Props = NativeStackScreenProps<any, any>;

const ShelfScreen: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, refetch, isRefetching } = useShelf();
  const updateStatus = useShelfStatus();
  const remove = useShelfRemove();
  const { user, logout } = useAuth();
  const totalBooks = (data || []).length;
  const [collapsedSections, setCollapsedSections] = useState<Record<BookStatus, boolean>>({
    not_started: false,
    reading: false,
    finished: false,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Sair" variant="ghost" onPress={logout} style={{ paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }} />
      ),
      headerTitle: `Ola, ${user?.name?.split(' ')[0] || 'leitor'}`,
    });
  }, [logout, user, navigation]);

  const toggleSection = (status: BookStatus) => {
    setCollapsedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const sections = useMemo<SectionData[]>(() => {
    if (!totalBooks) return [];
    const groups: Record<BookStatus, ShelfEntry[]> = { not_started: [], reading: [], finished: [] };
    (data || []).forEach((item) => groups[item.status].push(item));
    const order: BookStatus[] = ['not_started', 'reading', 'finished'];
    return order.map((status) => ({
      title: status === 'not_started' ? 'Na estante' : status === 'reading' ? 'Lendo' : 'Finalizados',
      status,
      isCollapsed: !!collapsedSections[status],
      data: collapsedSections[status] ? [] : groups[status],
    }));
  }, [collapsedSections, data, totalBooks]);

  const handleStatusChange = (entry: ShelfEntry, status: BookStatus) => {
    if (status === entry.status) return;
    updateStatus.mutate({ bookId: entry.book._id, status });
  };

  const handleRemove = (entry: ShelfEntry) => {
    Alert.alert('Remover livro', 'Deseja remover este livro da sua estante?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => remove.mutate(entry.book._id),
      },
    ]);
  };

  return (
    <Screen>
      <Text style={styles.title}>Sua estante</Text>
      <SectionList<ShelfEntry, SectionData>
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.md }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        renderSectionHeader={({ section }) => (
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.status)}>
            <Icon name={section.isCollapsed ? 'chevron-forward' : 'chevron-down'} color={colors.text} size={16} />
            <Icon
              name={
                section.status === 'not_started' ? 'bookmark-outline' : section.status === 'reading' ? 'book-outline' : 'checkmark-done-outline'
              }
              color={colors.text}
              size={16}
            />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </Pressable>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable style={styles.removeButton} onPress={() => handleRemove(item)} hitSlop={16}>
              <Icon name="trash-outline" color={colors.danger} size={20} />
            </Pressable>
            {item.book.coverImageUrl ? (
              <Image source={{ uri: resolveImageUrl(item.book.coverImageUrl) }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.placeholder]}>
                <Text style={styles.placeholderText}>Sem capa</Text>
              </View>
            )}
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={styles.bookTitle} numberOfLines={1}>
                {item.book.title}
              </Text>
              <Text style={styles.author} numberOfLines={1}>
                {item.book.author}
              </Text>
              <StatusBadge status={item.status} />
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.filter((status) => status !== item.status).map((status) => (
                  <Button
                    key={status}
                    title={status === 'not_started' ? 'Na estante' : status === 'reading' ? 'Lendo' : 'Finalizado'}
                    variant="ghost"
                    onPress={() => handleStatusChange(item, status)}
                    style={styles.statusButton}
                    icon={status === 'not_started' ? 'bookmark-outline' : status === 'reading' ? 'book-outline' : 'checkmark-done-outline'}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
        renderSectionFooter={({ section }) =>
          !section.isCollapsed && section.data.length === 0 ? (
            <Text style={styles.emptySectionText}>
              {section.status === 'not_started'
                ? 'Nenhum livro na estante.'
                : section.status === 'reading'
                ? 'Nenhum livro sendo lido.'
                : 'Nenhum livro finalizado.'}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyWrapper}>
              <EmptyState message="Sua estante está vazia. Adicione livros pela tela de detalhes com o botão 'Adicionar à estante'." />
              <Button title="Explore nosso acervo" onPress={() => navigation.navigate('Livros')} />
            </View>
          ) : null
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  sectionTitle: { ...typography.subtitle, color: colors.text },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    position: 'relative',
  },
  cover: { width: 80, height: 110, borderRadius: 10, backgroundColor: colors.surface },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.muted, ...typography.caption },
  bookTitle: { ...typography.subtitle, color: colors.text },
  author: { ...typography.caption, color: colors.muted },
  statusRow: { flexDirection: 'column', gap: spacing.xs },
  statusButton: { width: '100%', paddingVertical: spacing.sm },
  emptyWrapper: { gap: spacing.md, paddingHorizontal: spacing.md },
  emptySectionText: { ...typography.caption, color: colors.muted, paddingHorizontal: spacing.sm, marginTop: spacing.xs },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    zIndex: 2,
    elevation: 2,
  },
});

export default ShelfScreen;
