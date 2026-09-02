import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  subject: string;
  channel: "email" | "phone" | "whatsapp";
  message: string;
}

const CHANNEL_LABEL: Record<string, string> = {
  email: "Correo electrónico",
  phone: "Llamada telefónica",
  whatsapp: "WhatsApp",
};

export function ContactEmail({ name, email, phone, subject, channel, message }: ContactEmailProps) {
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Nuevo mensaje de contacto de {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NAHUAL AUTO</Text>
          </Section>

          <Heading as="h2" style={title}>
            Nuevo mensaje de contacto
          </Heading>
          <Text style={subtitle}>Mensaje enviado desde el formulario de contacto de Nahual Auto.</Text>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Cliente
            </Heading>
            <Text style={text}>
              <strong>{name}</strong>
              <br />
              Correo: {email}
              <br />
              Teléfono: {phone}
            </Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Asunto
            </Heading>
            <Text style={text}>{subject}</Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Preferencia de contacto
            </Heading>
            <Text style={text}>{CHANNEL_LABEL[channel] ?? channel}</Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Mensaje
            </Heading>
            <Text style={{ ...text, whiteSpace: "pre-line" }}>{message}</Text>
          </Section>

          <Text style={footer}>
            Nahual Auto · Productos para cuidado, limpieza y detailing automotriz · El Salvador
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#F5F3F2",
  fontFamily: "Arial, sans-serif",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  maxWidth: "640px",
};

const header = {
  marginBottom: "24px",
};

const brand = {
  color: "#D2540F",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: 0,
};

const title = {
  color: "#D2540F",
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 8px",
};

const subtitle = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 24px",
};

const card = {
  marginBottom: "20px",
};

const sectionTitle = {
  color: "#1B1E27",
  fontSize: "16px",
  fontWeight: 700,
  margin: "0 0 8px",
};

const text = {
  color: "#1B1E27",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
};

const footer = {
  color: "#999999",
  fontSize: "12px",
  margin: "24px 0 0",
  textAlign: "center" as const,
};
