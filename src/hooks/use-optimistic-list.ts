/**
 * Hook genérico para listas con optimistic updates.
 * add/update/remove/reorder con auto-revert on failure.
 */
'use client';

import * as React from 'react';
import { toast } from 'sonner';

interface UseOptimisticListOptions<T> {
  initialItems: T[];
  getId: (item: T) => string;
}

export function useOptimisticList<T>({
  initialItems,
  getId,
}: UseOptimisticListOptions<T>) {
  const [items, setItems] = React.useState<T[]>(initialItems);

  // Sync with server data when it changes
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  async function add(
    item: T,
    serverAction: () => Promise<{ success: boolean; error?: string }>,
  ) {
    // Optimistic add
    setItems((prev) => [...prev, item]);

    const result = await serverAction();
    if (!result.success) {
      // Revert
      setItems((prev) => prev.filter((i) => getId(i) !== getId(item)));
      toast.error(result.error ?? 'Error al agregar');
    }
  }

  async function update(
    id: string,
    data: Partial<T>,
    serverAction: () => Promise<{ success: boolean; error?: string }>,
  ) {
    const prev = [...items];

    // Optimistic update
    setItems((current) =>
      current.map((item) => (getId(item) === id ? { ...item, ...data } : item)),
    );

    const result = await serverAction();
    if (!result.success) {
      setItems(prev);
      toast.error(result.error ?? 'Error al actualizar');
    }
  }

  async function remove(
    id: string,
    serverAction: () => Promise<{ success: boolean; error?: string }>,
  ) {
    const prev = [...items];

    // Optimistic remove
    setItems((current) => current.filter((item) => getId(item) !== id));

    const result = await serverAction();
    if (!result.success) {
      setItems(prev);
      toast.error(result.error ?? 'Error al eliminar');
    }
  }

  async function reorder(
    orderedIds: string[],
    serverAction: () => Promise<{ success: boolean; error?: string }>,
  ) {
    const prev = [...items];

    // Optimistic reorder
    const itemMap = new Map(items.map((item) => [getId(item), item]));
    const reordered = orderedIds
      .map((id) => itemMap.get(id))
      .filter((item): item is T => item !== undefined);
    setItems(reordered);

    const result = await serverAction();
    if (!result.success) {
      setItems(prev);
      toast.error(result.error ?? 'Error al reordenar');
    }
  }

  return { items, setItems, add, update, remove, reorder };
}
