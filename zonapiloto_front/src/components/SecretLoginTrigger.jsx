import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SecretLoginTrigger() {
  const navigate = useNavigate();

  useEffect(() => {
    let sequence = [];
    const target = [
      "arrowup",
      "arrowup",
      "arrowdown",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "arrowleft",
      "arrowright",
      "b",
      "a",
    ];

    const handleKey = (e) => {
      sequence.push(e.key.toLowerCase());

      if (sequence.length > target.length) sequence.shift();

      if (JSON.stringify(sequence) === JSON.stringify(target)) {
        navigate("/loggin");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  return null;
}
