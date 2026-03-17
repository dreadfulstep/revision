"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DraggableAttributes,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
};

interface ItemProps {
  id: string;
  index: number;
  isDragging?: boolean;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  style?: React.CSSProperties;
}

function Item({
  id,
  index,
  isDragging,
  listeners,
  attributes,
  style,
}: ItemProps) {
  return (
    <div
      style={style}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 bg-card select-none touch-none w-full",
        "transition-colors duration-200",
        isDragging
          ? "border-foreground/20 shadow-xl scale-[1.02] bg-card/90 backdrop-blur-sm"
          : "border-border hover:border-foreground/10",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex flex-1 items-start gap-3 cursor-grab active:cursor-grabbing"
      >
        <span
          className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
            isDragging
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground",
          )}
        >
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium leading-snug wrap-break-word hyphens-auto pr-2">
          {id}
        </span>
        <GripVertical
          size={15}
          className="text-muted-foreground/30 shrink-0 mt-1"
        />
      </div>
    </div>
  );
}

function SortableItem({
  id,
  index,
  disabled,
}: {
  id: string;
  index: number;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Item
        id={id}
        index={index}
        listeners={listeners}
        attributes={attributes}
      />
    </div>
  );
}

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return hasMounted;
}

export default function Ordering({
  items: initialItems,
  onChange,
  disabled,
}: Props) {
  const [items, setItems] = useState<string[]>(() =>
    [...initialItems].sort(() => Math.random() - 0.5),
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const isMounted = useHasMounted();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over.id));
      const next = arrayMove(items, oldIndex, newIndex);
      setItems(next);
      onChange(JSON.stringify(next));
    }
    setActiveId(null);
  }

  if (!isMounted) return null;

  return (
    <div className="space-y-3 w-full">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-1">
        Drag to Reorder
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <SortableItem
                key={item}
                id={item}
                index={i}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay adjustScale={false}>
          {activeId ? (
            <Item
              id={activeId}
              index={items.indexOf(activeId)}
              isDragging
              style={{ width: "100%" }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
