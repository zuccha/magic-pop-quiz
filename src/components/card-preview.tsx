import { useLayoutEffect, useState } from "react";
import "./card-preview.css";

const imageOffsetX = 20;
const imageOffsetY = -20;
const imageWidth = 15 * 16;
const imageHeight = 21 * 16;
const imagePadding = 10;

export default function CardPreview() {
  const [url, setUrl] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getAdjustedPosition = () => {
    let left = mousePosition.x + imageOffsetX;
    let top = mousePosition.y + imageOffsetY;

    if (left + imageWidth > window.innerWidth)
      left -= imageWidth + 2 * imageOffsetX;

    if (top + imageHeight > window.innerHeight)
      top = window.innerHeight - imageHeight - imagePadding;

    if (top < imagePadding) top = imagePadding;
    if (left < imagePadding) left = imagePadding;

    left += window.scrollX;
    top += window.scrollY;

    return { left, top };
  };

  const style = {
    display: url ? "flex" : "none",
    ...getAdjustedPosition(),
  };

  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) =>
      setMousePosition({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setMousePosition]);

  useLayoutEffect(() => {
    callbacks.add(setUrl);
    return () => {
      callbacks.delete(setUrl);
    };
  }, [setUrl]);

  return (
    <div className="CardPreview" style={style}>
      <img src={url} />
    </div>
  );
}

const callbacks = new Set<(url: string) => void>();

export function updateCardPreview(url: string) {
  return {
    onMouseEnter: () => callbacks.forEach((callback) => callback(url)),
    onMouseLeave: () => callbacks.forEach((callback) => callback("")),
  };
}
