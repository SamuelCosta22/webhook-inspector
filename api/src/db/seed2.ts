import { db } from "./index";
import { webhooks } from "./schema/webhooks";
import { faker } from "@faker-js/faker";

console.log("Seeding database with diverse webhook events... 🚀");

// Métodos HTTP
const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

// Endpoints variados
const endpoints = [
  // Webhooks de pagamento
  { pathname: "/webhook/stripe", type: "stripe" },
  { pathname: "/webhook/paypal", type: "paypal" },
  { pathname: "/webhook/shopify", type: "shopify" },
  { pathname: "/webhook/razorpay", type: "razorpay" },

  // Webhooks de serviços
  { pathname: "/webhook/github", type: "github" },
  { pathname: "/webhook/slack", type: "slack" },
  { pathname: "/webhook/discord", type: "discord" },
  { pathname: "/webhook/telegram", type: "telegram" },

  // APIs REST
  { pathname: "/api/users", type: "rest" },
  { pathname: "/api/orders", type: "rest" },
  { pathname: "/api/payments", type: "rest" },
  { pathname: "/api/products", type: "rest" },
  { pathname: "/api/notifications", type: "rest" },
  { pathname: "/api/webhooks", type: "rest" },
  { pathname: "/api/events", type: "rest" },
  { pathname: "/api/subscriptions", type: "rest" },

  // Webhooks genéricos
  { pathname: "/webhook/custom", type: "custom" },
  { pathname: "/webhook/integration", type: "custom" },
  { pathname: "/webhook/third-party", type: "custom" },
];

// Tipos de eventos do Stripe
const stripeEventTypes = [
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "invoice.payment_succeeded",
  "customer.subscription.created",
  "charge.succeeded",
  "checkout.session.completed",
];

// Função para gerar evento Stripe
function generateStripeEvent(eventType: string) {
  const eventId = `evt_${faker.string.alphanumeric(24)}`;
  const customerId = `cus_${faker.string.alphanumeric(24)}`;
  const amount = faker.number.int({ min: 100, max: 100000 });
  const currency = faker.helpers.arrayElement(["usd", "eur", "brl", "gbp"]);

  return {
    id: eventId,
    object: "event",
    type: eventType,
    data: {
      object: {
        id: `pi_${faker.string.alphanumeric(24)}`,
        amount,
        currency,
        customer: customerId,
        status: "succeeded",
      },
    },
  };
}

// Função para gerar evento GitHub
function generateGitHubEvent() {
  const actions = ["opened", "closed", "merged", "created", "deleted"];
  const action = faker.helpers.arrayElement(actions);

  return {
    action,
    repository: {
      id: faker.number.int({ min: 1000000, max: 9999999 }),
      name: faker.internet.domainWord(),
      full_name: `${faker.internet.username()}/${faker.internet.domainWord()}`,
    },
    sender: {
      login: faker.internet.username(),
      id: faker.number.int({ min: 1000, max: 999999 }),
    },
    pull_request: {
      number: faker.number.int({ min: 1, max: 1000 }),
      title: faker.lorem.sentence(),
      state: action === "closed" ? "closed" : "open",
    },
  };
}

// Função para gerar evento Slack
function generateSlackEvent() {
  return {
    type: "event_callback",
    event: {
      type: faker.helpers.arrayElement([
        "message",
        "app_mention",
        "reaction_added",
      ]),
      user: faker.string.alphanumeric(11).toUpperCase(),
      text: faker.lorem.sentence(),
      channel: `C${faker.string.alphanumeric(10).toUpperCase()}`,
      ts: (Date.now() / 1000).toString(),
    },
  };
}

// Função para gerar payload REST genérico
function generateRestPayload(method: string, endpoint: string) {
  const baseId = faker.string.uuid();
  const baseName = faker.person.fullName();
  const baseEmail = faker.internet.email();

  if (method === "GET") {
    return {
      id: baseId,
      name: baseName,
      email: baseEmail,
      status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
      createdAt: faker.date.past().toISOString(),
    };
  }

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    if (endpoint.includes("users")) {
      return {
        id: baseId,
        name: baseName,
        email: baseEmail,
        role: faker.helpers.arrayElement(["admin", "user", "moderator"]),
        avatar: faker.image.avatar(),
      };
    }
    if (endpoint.includes("orders")) {
      return {
        id: baseId,
        orderNumber: `ORD-${faker.string.alphanumeric(10).toUpperCase()}`,
        total: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        currency: faker.helpers.arrayElement(["USD", "EUR", "BRL"]),
        items: Array.from(
          { length: faker.number.int({ min: 1, max: 5 }) },
          () => ({
            productId: faker.string.uuid(),
            name: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 5 }),
            price: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
          })
        ),
      };
    }
    if (endpoint.includes("payments")) {
      return {
        id: baseId,
        amount: faker.number.int({ min: 100, max: 100000 }),
        currency: faker.helpers.arrayElement(["usd", "eur", "brl"]),
        status: faker.helpers.arrayElement(["pending", "completed", "failed"]),
        paymentMethod: faker.helpers.arrayElement([
          "card",
          "bank_transfer",
          "paypal",
        ]),
      };
    }
    return {
      id: baseId,
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      metadata: {
        source: faker.internet.domainName(),
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (method === "DELETE") {
    return {
      id: baseId,
      deleted: true,
      deletedAt: new Date().toISOString(),
    };
  }

  return { message: "Request processed" };
}

// Função para gerar webhook baseado no tipo
function generateWebhookBody(
  method: string,
  pathname: string,
  endpointType: string
): string {
  let body: unknown = {};

  if (method === "GET" || method === "OPTIONS") {
    // GET geralmente não tem body, mas alguns sistemas enviam query params como body
    return "";
  }

  switch (endpointType) {
    case "stripe":
      const eventType = faker.helpers.arrayElement(stripeEventTypes);
      body = generateStripeEvent(eventType);
      break;
    case "github":
      body = generateGitHubEvent();
      break;
    case "slack":
      body = generateSlackEvent();
      break;
    case "paypal":
      body = {
        event_type: faker.helpers.arrayElement([
          "PAYMENT.SALE.COMPLETED",
          "PAYMENT.SALE.DENIED",
          "BILLING.SUBSCRIPTION.CREATED",
        ]),
        resource: {
          id: faker.string.alphanumeric(17),
          amount: {
            total: faker.number.float({
              min: 10,
              max: 1000,
              fractionDigits: 2,
            }),
            currency: "USD",
          },
          state: faker.helpers.arrayElement(["completed", "pending", "denied"]),
        },
      };
      break;
    case "shopify":
      body = {
        id: faker.number.int({ min: 1000000000, max: 9999999999 }),
        email: faker.internet.email(),
        name: `#${faker.number.int({ min: 1000, max: 9999 })}`,
        total_price: faker.number.float({
          min: 10,
          max: 1000,
          fractionDigits: 2,
        }),
        currency: faker.helpers.arrayElement(["USD", "EUR", "BRL"]),
        financial_status: faker.helpers.arrayElement([
          "paid",
          "pending",
          "refunded",
        ]),
        line_items: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => ({
            title: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 5 }),
            price: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
          })
        ),
      };
      break;
    case "discord":
      body = {
        type: faker.helpers.arrayElement([1, 2, 3, 4]),
        content: faker.lorem.sentence(),
        author: {
          id: faker.string.numeric(18),
          username: faker.internet.username(),
          discriminator: faker.string.numeric(4),
        },
        channel_id: faker.string.numeric(18),
        timestamp: new Date().toISOString(),
      };
      break;
    case "telegram":
      body = {
        update_id: faker.number.int({ min: 100000, max: 999999 }),
        message: {
          message_id: faker.number.int({ min: 1, max: 10000 }),
          from: {
            id: faker.number.int({ min: 100000, max: 999999999 }),
            is_bot: false,
            first_name: faker.person.firstName(),
            username: faker.internet.username(),
          },
          chat: {
            id: faker.number.int({ min: -1000000000, max: -1 }),
            type: "group",
            title: faker.company.name(),
          },
          date: Math.floor(Date.now() / 1000),
          text: faker.lorem.sentence(),
        },
      };
      break;
    case "rest":
      body = generateRestPayload(method, pathname);
      break;
    default:
      body = {
        event: faker.helpers.arrayElement(["created", "updated", "deleted"]),
        data: {
          id: faker.string.uuid(),
          timestamp: new Date().toISOString(),
          source: faker.internet.domainName(),
        },
      };
  }

  return body ? JSON.stringify(body, null, 2) : "";
}

// Função para gerar headers baseado no método e endpoint
function generateHeaders(
  method: string,
  pathname: string,
  endpointType: string
): Record<string, string> {
  const headers: Record<string, string> = {
    "user-agent": faker.internet.userAgent(),
    accept: "*/*",
  };

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    headers["content-type"] = "application/json";
  }

  // Headers específicos por tipo
  switch (endpointType) {
    case "stripe":
      headers["stripe-signature"] =
        `t=${Math.floor(Date.now() / 1000)},v1=${faker.string.alphanumeric(64)}`;
      break;
    case "github":
      headers["x-github-event"] = faker.helpers.arrayElement([
        "push",
        "pull_request",
        "issues",
        "release",
      ]);
      headers["x-github-delivery"] = faker.string.uuid();
      headers["x-hub-signature-256"] =
        `sha256=${faker.string.alphanumeric(64)}`;
      break;
    case "slack":
      headers["x-slack-signature"] = faker.string.alphanumeric(64);
      headers["x-slack-request-timestamp"] = Math.floor(
        Date.now() / 1000
      ).toString();
      break;
    case "shopify":
      headers["x-shopify-shop-domain"] =
        `${faker.internet.domainWord()}.myshopify.com`;
      headers["x-shopify-hmac-sha256"] = faker.string.alphanumeric(64);
      headers["x-shopify-topic"] = faker.helpers.arrayElement([
        "orders/create",
        "orders/updated",
        "orders/paid",
      ]);
      break;
  }

  return headers;
}

// Função para gerar query params
function generateQueryParams(method: string): Record<string, string> {
  if (method === "GET") {
    return {
      page: faker.number.int({ min: 1, max: 10 }).toString(),
      limit: faker.helpers.arrayElement(["10", "20", "50", "100"]),
      sort: faker.helpers.arrayElement(["asc", "desc"]),
      ...(faker.datatype.boolean() && { search: faker.lorem.word() }),
    };
  }
  return {};
}

// IPs variados
const commonIps = [
  "3.18.12.63",
  "3.130.192.231",
  "13.235.14.237",
  "192.168.1.100",
  "10.0.0.50",
  "172.16.0.1",
  "203.0.113.42",
  "198.51.100.23",
];

async function seed() {
  try {
    const webhookData = [];

    // Gerar pelo menos 60 webhooks variados
    for (let i = 0; i < 60; i++) {
      const method = faker.helpers.arrayElement(httpMethods);
      const endpoint = faker.helpers.arrayElement(endpoints);
      const { pathname, type: endpointType } = endpoint;

      const body = generateWebhookBody(method, pathname, endpointType);
      const contentLength = body ? Buffer.byteLength(body, "utf8") : 0;
      const headers = generateHeaders(method, pathname, endpointType);
      const queryParams = generateQueryParams(method);

      const webhook = {
        method,
        pathname,
        ip: faker.helpers.arrayElement(commonIps),
        statusCode: faker.helpers.arrayElement([
          200, 200, 200, 200, 201, 204, 400, 401, 404, 500,
        ]),
        contentType:
          method === "GET" || method === "OPTIONS"
            ? faker.helpers.arrayElement([
                "text/html",
                "application/json",
                undefined,
              ])
            : "application/json",
        contentLength: contentLength || undefined,
        queryParams,
        headers,
        body: body || undefined,
      };

      webhookData.push(webhook);
    }

    // Inserir todos os webhooks de uma vez
    await db.insert(webhooks).values(webhookData);

    console.log(
      `✅ Successfully seeded ${webhookData.length} diverse webhook events!`
    );
    console.log(
      `   Methods: ${[...new Set(webhookData.map((w) => w.method))].join(", ")}`
    );
    console.log(
      `   Endpoints: ${[...new Set(webhookData.map((w) => w.pathname))].length} unique paths`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
