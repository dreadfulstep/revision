"use client";

import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { items: string[]; onChange: (v: string) => void; disabled?: boolean };

function SortableItem({ id, index, disabled }: { id: string; index: number; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 bg-card select-none",
        "cursor-grab active:cursor-grabbing transition-all",
        isDragging ? "border-foreground shadow-xl z-50 opacity-95 scale-[1.02]" : "border-border hover:border-foreground/25",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span className={cn(
        "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
        isDragging ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
      )}>
        {index + 1}
      </span>
      <span className="flex-1 text-sm font-medium leading-snug">{id}</span>
      <GripVertical size={15} className="text-muted-foreground shrink-0" />
    </div>
  );
}

export default function Ordering({ items: initialItems, onChange, disabled }: Props) {
  const [items, setItems] = useState(() =>
    [...initialItems].sort(() => Math.random() - 0.5)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(String(active.id));
    const newIndex = items.indexOf(String(over.id));
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onChange(JSON.stringify(next));
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
        Drag to reorder
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, i) => (
              <SortableItem key={item} id={item} index={i} disabled={disabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}