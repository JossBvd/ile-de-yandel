"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { BackgroundHintZone } from "@/types/step";
import { useOrientationContext } from "./OrientationGuard";

interface ClickableBackgroundProps {
  imageSrc: string;
  hintZones: BackgroundHintZone[];
  onHintClick: (zone: BackgroundHintZone) => void;
  children?: React.ReactNode;
  debugMode?: boolean;
}

export function ClickableBackground({
  imageSrc,
  hintZones,
  onHintClick,
  children,
  debugMode = false,
}: ClickableBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { isRotated, width: contextWidth, height: contextHeight } = useOrientationContext();
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
      if (debugMode) {
        console.log(`📐 Image chargée: ${imageSrc} - Dimensions: ${img.width}x${img.height}`);
      }
    };
    img.onerror = () => {
      console.error(`❌ Erreur de chargement de l'image: ${imageSrc}`);
    };
    // S'assurer que le chemin est absolu
    img.src = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
  }, [imageSrc, debugMode]);

  const getImageCoordinates = (
    clientX: number,
    clientY: number,
  ): { x: number; y: number } | null => {
    if (!containerRef.current || !imageDimensions) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Si l'écran est pivoté, les dimensions visuelles sont inversées
    const visualWidth = isRotated ? containerRect.height : containerRect.width;
    const visualHeight = isRotated ? containerRect.width : containerRect.height;
    
    // Calculer les coordonnées relatives au conteneur DOM
    let relX = clientX - containerRect.left;
    let relY = clientY - containerRect.top;
    
    // Si pivoté, convertir les coordonnées du clic dans le système visuel pivoté
    if (isRotated) {
      // Le conteneur DOM est pivoté de 90° horaire, donc visuellement les dimensions sont inversées
      // Transformation pour rotation horaire de 90° : (x_visuel, y_visuel) = (y_DOM, width_DOM - x_DOM)
      const tempX = relX;
      relX = relY;
      relY = containerRect.width - tempX;
    }
    
    const containerRatio = visualWidth / visualHeight;
    const imageRatio = imageDimensions.width / imageDimensions.height;

    let imageWidth, imageHeight, offsetX, offsetY;

    // Avec object-contain, l'image est entièrement visible (letterboxing si besoin)
    if (containerRatio > imageRatio) {
      // Container plus large que l'image : image calée en HAUTEUR, bandes gauche/droite
      imageHeight = visualHeight;
      imageWidth = imageHeight * imageRatio;
      offsetX = (visualWidth - imageWidth) / 2;
      offsetY = 0;
    } else {
      // Container plus haut que l'image : image calée en LARGEUR, bandes haut/bas
      imageWidth = visualWidth;
      imageHeight = imageWidth / imageRatio;
      offsetX = 0;
      offsetY = (visualHeight - imageHeight) / 2;
    }

    // Coordonnées en pourcentage de l'image (0-100)
    const x = ((relX - offsetX) / imageWidth) * 100;
    const y = ((relY - offsetY) / imageHeight) * 100;

    return { x, y };
  };

  const checkPositionInZones = (x: number, y: number): boolean => {
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
      const containerRect = containerRef.current?.getBoundingClientRect();
      console.log(
        `🎯 Coordonnées du clic: x: ${coords.x.toFixed(2)}, y: ${coords.y.toFixed(2)}`,
      );
      console.log(
        `📋 Config pour backgroundHintZones:\n{ x: ${Math.round(coords.x)}, y: ${Math.round(coords.y)}, radius: 8, hint: "Votre indice ici" }`,
      );
      if (containerRect && imageDimensions) {
        const visualWidth = isRotated ? containerRect.height : containerRect.width;
        const visualHeight = isRotated ? containerRect.width : containerRect.height;
        const containerRatio = visualWidth / visualHeight;
        const imageRatio = imageDimensions.width / imageDimensions.height;
        console.log(
          `📐 Debug: ${isRotated ? '[ROTATED] ' : ''}Container DOM ${containerRect.width.toFixed(0)}x${containerRect.height.toFixed(0)}, Visual ${visualWidth.toFixed(0)}x${visualHeight.toFixed(0)} (ratio: ${containerRatio.toFixed(2)}), Image ${imageDimensions.width}x${imageDimensions.height} (ratio: ${imageRatio.toFixed(2)}), Clic relatif: (${(e.clientX - containerRect.left).toFixed(0)}, ${(e.clientY - containerRect.top).toFixed(0)})`,
        );
      }
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

  // Utiliser object-contain uniquement si des zones cliquables sont définies (pour garantir l'intégrité des coordonnées)
  // Sinon utiliser object-cover pour remplir l'écran
  const objectFit = hintZones && hintZones.length > 0 ? "object-contain" : "object-cover";

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
        className={`${objectFit} pointer-events-none`}
        priority
      />

      {/* Affichage des zones cliquables (uniquement en mode debug) */}
      {debugMode && hintZones.map((zone, index) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect || !imageDimensions) return null;

        const visualWidth = isRotated ? containerRect.height : containerRect.width;
        const visualHeight = isRotated ? containerRect.width : containerRect.height;
        const containerRatio = visualWidth / visualHeight;
        const imageRatio = imageDimensions.width / imageDimensions.height;

        let imageWidth, imageHeight, offsetX, offsetY;

        if (containerRatio > imageRatio) {
          imageHeight = visualHeight;
          imageWidth = imageHeight * imageRatio;
          offsetX = (visualWidth - imageWidth) / 2;
          offsetY = 0;
        } else {
          imageWidth = visualWidth;
          imageHeight = imageWidth / imageRatio;
          offsetX = 0;
          offsetY = (visualHeight - imageHeight) / 2;
        }

        const centerX = offsetX + (zone.x / 100) * imageWidth;
        const centerY = offsetY + (zone.y / 100) * imageHeight;
        const radius = (zone.radius / 100) * Math.max(imageWidth, imageHeight);

        // Si pivoté, transformer les coordonnées pour l'affichage dans le système DOM
        let displayX = centerX;
        let displayY = centerY;
        let displayTransform = 'translate(-50%, -50%)';

        if (isRotated) {
          // Le cercle est calculé dans le système visuel (après rotation)
          // Mais il doit être affiché dans le système DOM (avant rotation)
          // Transformation inverse de (x_visuel, y_visuel) = (y_DOM, width_DOM - x_DOM)
          // Donc (x_DOM, y_DOM) = (width_DOM - y_visuel, x_visuel)
          displayX = containerRect.width - centerY;
          displayY = centerX;
        }

        return (
          <div
            key={index}
            className="absolute pointer-events-none border-2 border-pink-500 rounded-full bg-pink-500/20"
            style={{
              left: `${displayX}px`,
              top: `${displayY}px`,
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              transform: displayTransform,
              zIndex: 10,
            }}
          />
        );
      })}

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
