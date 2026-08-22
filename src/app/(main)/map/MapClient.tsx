"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// ─── Types ───────────────────────────────────────────────────────────────────

type PinType = "shop" | "event" | "community";

interface Pin {
  id: string;
  type: PinType;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  emoji: string;
  href: string;
  // optional fields
  rating?: number;
  date?: string;
  members?: number;
}

interface Props {
  pins: Pin[];
  selectedId: string | null;
  onPinSelect: (id: string) => void;
  filter: "all" | "shop" | "event" | "community";
}

// ─── Marker colors ───────────────────────────────────────────────────────────

const TYPE_COLOR: Record<PinType, string> = {
  shop: "#00D47E",
  event: "#8B5CF6",
  community: "#3B82F6",
};

const TYPE_BORDER: Record<PinType, string> = {
  shop: "#009959",
  event: "#6D28D9",
  community: "#1D4ED8",
};

// ─── Icon factory ────────────────────────────────────────────────────────────

function createDivIcon(pin: Pin, selected: boolean): L.DivIcon {
  const size = selected ? 44 : 36;
  const border = selected ? "4px solid white" : "3px solid rgba(255,255,255,0.9)";
  const shadow = selected
    ? "0 4px 16px rgba(0,0,0,0.4), 0 0 0 3px rgba(0,0,0,0.15)"
    : "0 2px 8px rgba(0,0,0,0.3)";
  const ring = selected
    ? `outline: 3px solid ${TYPE_COLOR[pin.type]}; outline-offset: 3px;`
    : "";

  const html = `
    <div style="
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${TYPE_COLOR[pin.type]};
      border:${border};
      box-shadow:${shadow};
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:${selected ? 20 : 16}px;
      cursor:pointer;
      transition:all 0.2s ease;
      ${ring}
    ">${pin.emoji}</div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  });
}

// ─── FlyToPin — child that accesses the map instance ─────────────────────────

function FlyToPin({ pins, selectedId }: { pins: Pin[]; selectedId: string | null }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedId || selectedId === prevId.current) return;
    const pin = pins.find((p) => p.id === selectedId);
    if (!pin) return;
    prevId.current = selectedId;
    map.flyTo([pin.lat, pin.lng], 16, { animate: true, duration: 0.8 });
  }, [selectedId, pins, map]);

  return null;
}

// ─── MapClient ────────────────────────────────────────────────────────────────

export default function MapClient({ pins, selectedId, onPinSelect, filter }: Props) {
  const visiblePins = filter === "all" ? pins : pins.filter((p) => p.type === filter);

  return (
    <MapContainer
      center={[42.1401, -0.4089]}
      zoom={14}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      <FlyToPin pins={pins} selectedId={selectedId} />

      {visiblePins.map((pin) => {
        const isSelected = pin.id === selectedId;
        return (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={createDivIcon(pin, isSelected)}
            eventHandlers={{ click: () => onPinSelect(pin.id) }}
            zIndexOffset={isSelected ? 1000 : 0}
          >
            <Popup className="map-popup" offset={[0, -4]}>
              <div className="min-w-[160px] p-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{pin.emoji}</span>
                  <div>
                    <p className="font-bold text-sm leading-tight">{pin.name}</p>
                    <p className="text-xs text-gray-500">{pin.category}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1.5">📍 {pin.address}</p>
                {pin.rating && (
                  <p className="text-xs font-semibold text-amber-600">⭐ {pin.rating}</p>
                )}
                {pin.date && (
                  <p className="text-xs font-semibold text-violet-600">📅 {pin.date}</p>
                )}
                {pin.members && (
                  <p className="text-xs font-semibold text-blue-600">👥 {pin.members} miembros</p>
                )}
                <a
                  href={pin.href}
                  className="mt-2 block text-center text-xs font-bold py-1 px-3 rounded-full"
                  style={{ background: TYPE_COLOR[pin.type], color: "white" }}
                >
                  Ver en City App →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
