'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItem as SortableItemType } from '@/types/step';

interface SortableItemProps {
  item: SortableItemType;
}

export function SortableItem({ item }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300 cursor-move hover:border-blue-400 hover:bg-blue-50 transition-colors"
    >
      {typeof item.content === 'string' ? (
        <span className="text-gray-900">{item.content}</span>
      ) : (
        item.content
      )}
      {item.image && (
        <img src={item.image} alt="" className="mt-2 max-w-full h-auto rounded" />
      )}
    </div>
  );
}
