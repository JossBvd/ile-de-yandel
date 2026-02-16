"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { BackgroundHintZone } from "@/types/step";
import { useOrientationContext } from "./OrientationGuard";
import { logDebug, logError } from "@/lib/utils/logger";

function sanitizeImagePath(path: string): string | null {
  if (!path.startsWith('/')) {
    return null;
  }
  
  const allowedPaths = ['/backgrounds/', '/missions/', '/raft/', '/ui/'];
  const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed));
  
  if (!isAllowed) {
    return null;
  }
  
  if (path.includes('..')) {
    return null;
  }
  
  return path;
}

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
    const rawPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
    const sanitizedPath = sanitizeImagePath(rawPath);
    
    if (!sanitizedPath) {
      logError(`❌ Chemin d'image invalide: ${imageSrc}`);
      return;
    }
    
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      if (debugMode) {
        logDebug(`📐 Image chargée: ${sanitizedPath} - Dimensions: ${img.width}x${img.height}`);
      }
    };
    img.onerror = () => {
      logError(`❌ Erreur de chargement de l'image: ${sanitizedPath}`);
    };
    img.src = sanitizedPath;
  }, [imageSrc, debugMode]);

  const getImageCoordinates = (
    clientX: number,
    clientY: number,
  ): { x: number; y: number } | null => {
    if (!containerRef.current || !imageDimensions) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const visualWidth = isRotated ? containerRect.height : containerRect.width;
    const visualHeight = isRotated ? containerRect.width : containerRect.height;
    let relX = clientX - containerRect.left;
    let relY = clientY - containerRect.top;
    if (isRotated) {
      const tempX = relX;
      relX = relY;
      relY = containerRect.width - tempX;
    }
    
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
    const target = e.target as HTMLElement;
    if (target.closest(".game-panel, button, a, input, select, textarea")) {
      return;
    }

    const coords = getImageCoordinates(e.clientX, e.clientY);
    if (!coords) return;
    if (debugMode) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      logDebug(
        `🎯 Coordonnées du clic: x: ${coords.x.toFixed(2)}, y: ${coords.y.toFixed(2)}`,
      );
      logDebug(
        `📋 Config pour backgroundHintZones:\n{ x: ${Math.round(coords.x)}, y: ${Math.round(coords.y)}, radius: 8, hint: "Votre indice ici" }`,
      );
      if (containerRect && imageDimensions) {
        const visualWidth = isRotated ? containerRect.height : containerRect.width;
        const visualHeight = isRotated ? containerRect.width : containerRect.height;
        const containerRatio = visualWidth / visualHeight;
        const imageRatio = imageDimensions.width / imageDimensions.height;
        logDebug(
          `📐 Debug: ${isRotated ? '[ROTATED] ' : ''}Container DOM ${containerRect.width.toFixed(0)}x${containerRect.height.toFixed(0)}, Visual ${visualWidth.toFixed(0)}x${visualHeight.toFixed(0)} (ratio: ${containerRatio.toFixed(2)}), Image ${imageDimensions.width}x${imageDimensions.height} (ratio: ${imageRatio.toFixed(2)}), Clic relatif: (${(e.clientX - containerRect.left).toFixed(0)}, ${(e.clientY - containerRect.top).toFixed(0)})`,
        );
      }
    }
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
        let displayX = centerX;
        let displayY = centerY;
        let displayTransform = 'translate(-50%, -50%)';
        if (isRotated) {
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
