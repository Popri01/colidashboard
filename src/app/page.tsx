"use client";
import {useEffect} from "react";
import {createSwapy} from "swapy";

// Configuración inicial
const DEFAULT = {
  "1": "a",
  "2": null,
  "3": "c",
  "4": "d",
  "5": null,
  "6": null,
  "7": null,
};

const ITEMS = {
  a: {bg: "bg-red-600", label: "Prueba 1", link: "https://www.google.com"},
  c: {bg: "bg-blue-600", label: "Prueba 2", link: "https://www.google.com"},
  d: {bg: "bg-pink-600", label: "Prueba 3", link: "https://www.google.com"},
};

type ItemKey = keyof typeof ITEMS | null;

function Item({id}: {id: ItemKey}) {
  if (!id || !ITEMS[id]) return null;

  const {bg, label, link} = ITEMS[id];

  return (
    <div
      className={`flex h-full w-full cursor-pointer items-center justify-center rounded text-3xl text-white ${bg}`}
      data-swapy-item={id}
      onClick={link ? () => window.open(link, "_blank") : undefined}
    >
      {label}
    </div>
  );
}

export default function HomePage() {
  const slotItems: Record<string, ItemKey> = localStorage.getItem("slotItem")
    ? JSON.parse(localStorage.getItem("slotItem")!)
    : DEFAULT;

  useEffect(() => {
    const container = document.querySelector(".container")!;
    const swapy = createSwapy(container, {
      swapMode: "hover",
    });

    swapy.onSwap(({data}) => {
      localStorage.setItem("slotItem", JSON.stringify(data.object));
    });

    return () => {
      swapy.destroy();
    };
  }, []);

  return (
    <div className=" container mx-auto flex w-full max-w-lg flex-col gap-3 p-4 shadow-red-700">
      <h1 className="text-center text-4xl">Links Utiles</h1>

      <div className="flex gap-2">
        <div
          className="flex h-28 w-1/2 flex-shrink-0 items-center justify-center rounded bg-gray-800"
          data-swapy-slot="1"
        >
          <Item id={slotItems["1"]} />
        </div>

        <div
          className="flex h-28 w-2/3 flex-shrink-0 items-center justify-center rounded bg-gray-800"
          data-swapy-slot="2"
        >
          <Item id={slotItems["2"]} />
        </div>
      </div>
      <div
        className="flex h-28  flex-shrink-0 items-center justify-center rounded bg-gray-800"
        data-swapy-slot="3"
      >
        <Item id={slotItems["3"]} />
      </div>
      <div className="flex gap-2">
        <div
          className="flex h-28 w-2/3 flex-shrink-0 items-center justify-center rounded bg-gray-800"
          data-swapy-slot="4"
        >
          <Item id={slotItems["4"]} />
        </div>

        <div
          className="flex h-28 w-1/2 flex-shrink-0 items-center justify-center rounded bg-gray-800"
          data-swapy-slot="5"
        >
          <Item id={slotItems["5"]} />
        </div>
      </div>
      <div className="flex gap-2">
        <div
          className="flex h-28 w-1/3 flex-shrink-0 items-center justify-center rounded bg-gray-800"
          data-swapy-slot="6"
        >
          <Item id={slotItems["6"]} />
        </div>
        <div
          className="flex h-28 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800"
          data-swapy-slot="7"
        >
          <Item id={slotItems["7"]} />
        </div>
      </div>
    </div>
  );
}
