import { useState } from "react";

const CreateUser = () => {
    const [formData, setFormData] = useState({ name: "12", surname: "12", status: "12", email: "21@g.com" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        
        try {
            const response = await fetch("http://localhost:8801/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                setMessage("Usuário criado com sucesso!");
                setFormData({ name: "", surname: "", status: "", email: "" });
            } else {    
                setMessage("Erro ao criar usuário: " + data.error);
            }
        } catch (error) {
            setMessage("Erro ao conectar com o servidor");
        }
    };
}