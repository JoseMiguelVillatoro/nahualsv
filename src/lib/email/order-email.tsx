import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from "@react-email/components";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderEmailProps {
  orderId: string;
  nombre: string;
  email: string;
  telefono: string;
  entrega: "domicilio" | "recoger";
  departamento?: string;
  municipio?: string;
  direccion?: string;
  referencia?: string;
  pago: string;
  items: OrderItem[];
  subtotal: number;
  envio: number;
  total: number;
}

const money = (n: number) => `$${n.toFixed(2)}`;

const PAGO_LABEL: Record<string, string> = {
  transferencia: "Transferencia bancaria",
  "contra-entrega": "Pago contra entrega",
  "en-linea": "Pago en línea",
};

export function OrderEmail({
  orderId,
  nombre,
  email,
  telefono,
  entrega,
  departamento,
  municipio,
  direccion,
  referencia,
  pago,
  items,
  subtotal,
  envio,
  total,
}: OrderEmailProps) {
  const entregaText =
    entrega === "domicilio"
      ? `Envío a domicilio\n${direccion}\n${municipio}, ${departamento}${referencia ? `\nRef: ${referencia}` : ""}`
      : "Recoge el pedido en tienda";

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Nuevo pedido {orderId} de {nombre}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>NAHUAL AUTO</Text>
          </Section>

          <Heading as="h2" style={title}>
            Nuevo pedido {orderId}
          </Heading>
          <Text style={subtitle}>Pedido recibido desde el sitio web de Nahual Auto.</Text>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Cliente
            </Heading>
            <Text style={text}>
              <strong>{nombre}</strong>
              <br />
              Correo: {email}
              <br />
              Teléfono / WhatsApp: {telefono}
            </Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Entrega
            </Heading>
            <Text style={{ ...text, whiteSpace: "pre-line" }}>{entregaText}</Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Pago
            </Heading>
            <Text style={text}>{PAGO_LABEL[pago] ?? pago}</Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={sectionTitle}>
              Productos
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={row}>
                <Column style={colProduct}>{item.name}</Column>
                <Column style={colQty}>{item.qty}</Column>
                <Column style={colTotal}>{money(item.price * item.qty)}</Column>
              </Row>
            ))}
            <Hr style={divider} />
            <Row>
              <Column style={colLabel}>Subtotal</Column>
              <Column style={colValue}>{money(subtotal)}</Column>
            </Row>
            <Row>
              <Column style={colLabel}>Envío</Column>
              <Column style={colValue}>{envio > 0 ? money(envio) : "Gratis"}</Column>
            </Row>
            <Row>
              <Column style={colLabelTotal}>Total</Column>
              <Column style={colValueTotal}>{money(total)}</Column>
            </Row>
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

const row = {
  borderBottom: "1px solid #eeeeee",
  padding: "8px 0",
};

const colProduct = {
  color: "#1B1E27",
  fontSize: "14px",
  width: "60%",
};

const colQty = {
  color: "#1B1E27",
  fontSize: "14px",
  textAlign: "center" as const,
  width: "15%",
};

const colTotal = {
  color: "#1B1E27",
  fontSize: "14px",
  textAlign: "right" as const,
  width: "25%",
};

const divider = {
  borderColor: "#eeeeee",
  margin: "16px 0",
};

const colLabel = {
  color: "#666666",
  fontSize: "14px",
  width: "75%",
};

const colValue = {
  color: "#1B1E27",
  fontSize: "14px",
  textAlign: "right" as const,
  width: "25%",
};

const colLabelTotal = {
  color: "#1B1E27",
  fontSize: "16px",
  fontWeight: 700,
  width: "75%",
};

const colValueTotal = {
  color: "#1B1E27",
  fontSize: "16px",
  fontWeight: 700,
  textAlign: "right" as const,
  width: "25%",
};

const footer = {
  color: "#999999",
  fontSize: "12px",
  margin: "24px 0 0",
  textAlign: "center" as const,
};
