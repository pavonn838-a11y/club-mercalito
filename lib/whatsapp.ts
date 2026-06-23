type WhatsAppTemplatePayload = {
  to: string;
  name: string;
  branchName: string;
  message: string;
};

export function getWhatsAppConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "es_AR";
  const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v20.0";

  const missing = [
    ["WHATSAPP_ACCESS_TOKEN", accessToken],
    ["WHATSAPP_PHONE_NUMBER_ID", phoneNumberId],
    ["WHATSAPP_TEMPLATE_NAME", templateName]
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return {
    accessToken,
    phoneNumberId,
    templateName,
    templateLanguage,
    apiVersion,
    missing
  };
}

export async function sendWhatsAppTemplate({
  to,
  name,
  branchName,
  message
}: WhatsAppTemplatePayload) {
  const config = getWhatsAppConfig();

  if (config.missing.length) {
    throw new Error(`Faltan variables: ${config.missing.join(", ")}`);
  }

  const response = await fetch(
    `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ""),
        type: "template",
        template: {
          name: config.templateName,
          language: {
            code: config.templateLanguage
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: name },
                { type: "text", text: branchName },
                { type: "text", text: message }
              ]
            }
          ]
        }
      })
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "WhatsApp no aceptó el mensaje.");
  }
}
