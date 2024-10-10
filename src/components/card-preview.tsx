import { useLayoutEffect, useState } from "react";
import "./card-preview.css";

const callbacks = new Set<(url: string) => void>();

export default function CardPreview() {
  const [url, setUrl] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const style = {
    display: url ? "flex" : "none",
    left: mousePosition.x + 20,
    top: mousePosition.y - 20,
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

export function updateCardPreview(url: string) {
  return {
    onMouseEnter: () => callbacks.forEach((callback) => callback(url)),
    onMouseLeave: () => callbacks.forEach((callback) => callback("")),
  };
}
