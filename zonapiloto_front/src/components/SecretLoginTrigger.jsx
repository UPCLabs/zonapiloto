
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SecretLoginTrigger() {
    const navigate = useNavigate();

    useEffect(() => {
        let sequence = [];
        const target = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

        const handleKey = (e) => {
            sequence.push(e.key);


            if (sequence.length > 4) sequence.shift();


            if (JSON.stringify(sequence) === JSON.stringify(target)) {
                navigate("/loggin");
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [navigate]);

    return null;
}
