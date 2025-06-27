import { useState } from "react";
import styled from "styled-components";
import styles from "./SubscriptionBox.module.css";

const SubscriptionContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s ease;
  flex-grow: 1;
  color: rgb(21, 35, 48);

  background-color: rgba(52, 152, 219, 0.27);

  &:focus {
    border-color: #3498db;
  }

  @media (min-width: 768px) {
    max-width: 350px;
  }
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2ecc71;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorMessage = styled(SuccessMessage)`
  background-color: #e74c3c;
`;

const SubscriptionBox = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    // Validación simple del email
    if (!email || !/^[\w.-]+@gmail\.com$/.test(email)) {
      setStatus("error");
      setMessage("Por favor, introduce un Gmail válido");
      return;
    }

    try {
      const response = await fetch(
        "https://sendmailfrombrevo.netlify.app/api/newEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      setLoader(false);

      const data = await response.json();

      console.log(data);

      // Aquí iría la lógica para enviar el email a tu backend
      // Por ahora simulamos una respuesta exitosa
      if (data.success) {
        setStatus("success");
        setMessage(
          "¡Gracias por suscribirte! Pronto recibirás nuestras ofertas."
        );
        setEmail("");

        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          setStatus(null);
          setMessage("");
        }, 5000);
        console.log(data);
      } else {
        setStatus("error");
        setMessage("Hubo un error al suscribirte.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "Hubo un error al suscribirte. Por favor, inténtalo de nuevo."
      );
      console.log(error);
    }
  };

  return (
    <SubscriptionContainer>
      <Title>¡No te pierdas nuestras ofertas!</Title>
      <Subtitle>
        Suscríbete con tu <strong>Gmail</strong> y recibe todas nuestras
        novedades y promociones exclusivas.
      </Subtitle>

      {loader && (
        <div className={styles.scaleUpCenter}>
          <span className={styles.loader}></span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Suscribirse</Button>
      </Form>

      {status === "success" && <SuccessMessage>{message}</SuccessMessage>}
      {status === "error" && <ErrorMessage>{message}</ErrorMessage>}
    </SubscriptionContainer>
  );
};

export default SubscriptionBox;
