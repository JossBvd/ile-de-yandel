"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { BackgroundHintZone } from "@/types/step";

interface ClickableBackgroundProps {
  imageSrc: string;
  hintZones?: BackgroundHintZone[];
  onHintClick: (zone: BackgroundHintZone) => void;
  children?: React.ReactNode;
  debugMode?: boolean; // Mode debug pour afficher les coordonnées des clics
}

export function ClickableBackground({
  imageSrc,
  hintZones = [],
  onHintClick,
  children,
  debugMode = false,
}: ClickableBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isOverHintZone, setIsOverHintZone] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [debugCoords, setDebugCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    // Charger l'image pour obtenir ses dimensions réelles
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getImageCoordinates = (
    clientX: number,
    clientY: number,
  ): { x: number; y: number } | null => {
    if (!containerRef.current || !imageDimensions) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerRatio = containerRect.width / containerRect.height;
    const imageRatio = imageDimensions.width / imageDimensions.height;

    let imageWidth, imageHeight, offsetX, offsetY;

    // Avec object-contain, l'image est entièrement visible (letterboxing si besoin)
    if (containerRatio > imageRatio) {
      // Container plus large : image calée en largeur, bandes haut/bas
      imageWidth = containerRect.width;
      imageHeight = imageWidth / imageRatio;
      offsetX = 0;
      offsetY = (containerRect.height - imageHeight) / 2;
    } else {
      // Container plus haut : image calée en hauteur, bandes gauche/droite
      imageHeight = containerRect.height;
      imageWidth = imageHeight * imageRatio;
      offsetX = (containerRect.width - imageWidth) / 2;
      offsetY = 0;
    }

    // Position relative au conteneur
    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top;

    // Coordonnées en pourcentage de l'image (0-100)
    const x = ((relX - offsetX) / imageWidth) * 100;
    const y = ((relY - offsetY) / imageHeight) * 100;

    // Même si on clique en dehors de la partie visible, on retourne les coordonnées
    return { x, y };
  };

  const checkPositionInZones = (x: number, y: number): boolean => {
    if (!hintZones.length) return false;
    return hintZones.some((zone) => {
      const dist = Math.sqrt(Math.pow(x - zone.x, 2) + Math.pow(y - zone.y, 2));
      return dist <= zone.radius;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Obtenir la cible réelle du clic
    const target = e.target as HTMLElement;

    // Ignorer les clics sur les enfants interactifs (panneau de jeu, boutons)
    if (target.closest(".game-panel, button, a, input, select, textarea")) {
      return;
    }

    const coords = getImageCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    // Mode debug : afficher les coordonnées dans la console
    if (debugMode) {
      console.log(
        `🎯 Coordonnées du clic: x: ${coords.x.toFixed(2)}, y: ${coords.y.toFixed(2)}`,
      );
      console.log(
        `📋 Config pour backgroundHintZones:\n{ x: ${Math.round(coords.x)}, y: ${Math.round(coords.y)}, radius: 8, hint: "Votre indice ici" }`,
      );
    }

    // Vérifier si le clic est dans une zone d'indice
    for (const zone of hintZones) {
      const dist = Math.sqrt(
        Math.pow(coords.x - zone.x, 2) + Math.pow(coords.y - zone.y, 2),
      );
      if (dist <= zone.radius) {
        onHintClick(zone);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const coords = getImageCoordinates(e.clientX, e.clientY);
    if (!coords) {
      setIsOverHintZone(false);
      if (debugMode) setDebugCoords(null);
      return;
    }

    setIsOverHintZone(checkPositionInZones(coords.x, coords.y));
    if (debugMode) setDebugCoords(coords);
  };

  const handleMouseLeave = () => {
    setIsOverHintZone(false);
    if (debugMode) setDebugCoords(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${isOverHintZone ? "cursor-pointer" : "cursor-default"}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        ref={imageRef}
        src={imageSrc}
        alt="Fond du step"
        fill
        className="object-contain pointer-events-none"
        priority
      />

      {/* Affichage debug des coordonnées */}
      {debugMode && debugCoords && (
        <div className="fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg font-mono text-sm z-50 pointer-events-none">
          <div>x: {Math.round(debugCoords.x)}</div>
          <div>y: {Math.round(debugCoords.y)}</div>
          <div className="text-xs text-gray-300 mt-1">
            Cliquez pour copier dans la console
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
