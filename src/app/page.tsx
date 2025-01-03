"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {SlotItemMapArray, utils, Swapy, createSwapy} from "swapy";
import {Plus, Trash2, Edit3} from "lucide-react";
import {Dialog} from "@headlessui/react";

type Item = {
  id: string;
  title: string;
  link: string;
};
const initialItems: Item[] = [
  {id: "1", title: "Ejemplo 1", link: "https://www.google.com"},
  {id: "2", title: "Ejemplo 2", link: "https://www.google.com"},
  {id: "3", title: "Ejemplo 3", link: "https://www.google.com"},
];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>(() =>
    localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")!) : initialItems,
  );
  const [estado, setEstado] = useState<boolean>(false);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, "id"),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLink, setEditLink] = useState("");

  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap],
  );
  const swapyRef = useRef<Swapy | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => utils.dynamicSwapy(swapyRef.current, items, "id", slotItemMap, setSlotItemMap),
    [items],
  );

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      enabled: estado,
    });

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (newTitle.trim() && newLink.trim()) {
      const newItem: Item = {id: `${Date.now()}`, title: newTitle, link: newLink};

      setItems([...items, newItem]);
      setNewTitle("");
      setNewLink("");
      setIsModalOpen(false);
    }
  };

  const handleEditItem = () => {
    if (editItemId && editTitle.trim() && editLink.trim()) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editItemId ? {...item, title: editTitle, link: editLink} : item,
        ),
      );
      setEditItemId(null);
      setEditTitle("");
      setEditLink("");
      setIsEditModalOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-gray-900 p-4 shadow-lg"
    >
      <div className="grid grid-cols-3 gap-2">
        {slottedItems.map(({slotId, itemId, item}) => (
          <div
            key={slotId}
            className="flex h-24 items-center justify-center rounded-lg border border-gray-700 bg-gray-800"
            data-swapy-slot={slotId}
          >
            {item ? (
              <div
                key={itemId}
                className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 text-xl text-white"
                data-swapy-item={itemId}
                onClick={() => {
                  !estado ? window.open(item.link, "_blank") : "";
                }}
              >
                <span>{item.title}</span>
                <span
                  data-swapy-no-drag
                  className="absolute right-2 top-2 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-700"
                  onClick={(event) => {
                    event.stopPropagation();
                    setItems(items.filter((i) => i.id !== item.id));
                  }}
                >
                  <Trash2 size={16} />
                </span>
                <span
                  data-swapy-no-drag
                  className="absolute left-2 top-2 cursor-pointer rounded-full bg-yellow-500 p-1 text-white hover:bg-yellow-700"
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditItemId(item.id);
                    setEditTitle(item.title);
                    setEditLink(item.link);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit3 size={16} />
                </span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div>
        <button
          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-blue-500 text-lg font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2" size={20} /> Add Item
        </button>
        <button
          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-blue-500 text-lg font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="button"
          onClick={() => {
            swapyRef.current?.enable(!estado);
            setEstado(!estado);
          }}
        >
          {estado ? "Desactivar Movimiento " : "Activar Movimiento"}
        </button>
      </div>
      <Dialog
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">Add New Item</h2>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="link">
              Link
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="link"
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              type="button"
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">Edit Item</h2>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="edit-title">
              Title
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="edit-link">
              Link
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="edit-link"
              type="url"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              type="button"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              type="button"
              onClick={handleEditItem}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
