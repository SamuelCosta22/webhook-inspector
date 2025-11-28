import { db } from "./index";
import { webhooks } from "./schema/webhooks";
import { faker } from "@faker-js/faker";

console.log("Seeding database with Stripe webhook events... 🚀");

// Tipos de eventos comuns do Stripe
const stripeEventTypes = [
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "payment_intent.requires_action",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "invoice.created",
  "invoice.updated",
  "invoice.finalized",
  "invoice.sent",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "charge.succeeded",
  "charge.failed",
  "charge.refunded",
  "charge.dispute.created",
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "payment_method.attached",
  "payment_method.detached",
  "coupon.created",
  "coupon.updated",
  "plan.created",
  "plan.updated",
  "product.created",
  "product.updated",
];

// Função para gerar um evento do Stripe
function generateStripeEvent(eventType: string) {
  const eventId = `evt_${faker.string.alphanumeric(24)}`;
  const customerId = `cus_${faker.string.alphanumeric(24)}`;
  const amount = faker.number.int({ min: 100, max: 100000 }); // em centavos
  const currency = faker.helpers.arrayElement(["usd", "eur", "brl", "gbp"]);

  // Estrutura base do evento Stripe
  const baseEvent = {
    id: eventId,
    object: "event",
    api_version: "2023-10-16",
    created:
      Math.floor(Date.now() / 1000) -
      faker.number.int({ min: 0, max: 2592000 }), // últimos 30 dias
    type: eventType,
    livemode: faker.datatype.boolean(),
    pending_webhooks: faker.number.int({ min: 1, max: 5 }),
    request: {
      id: `req_${faker.string.alphanumeric(24)}`,
      idempotency_key: faker.string.uuid(),
    },
  };

  // Dados específicos baseados no tipo de evento
  let data: Record<string, unknown> = {};

  if (eventType.startsWith("payment_intent.")) {
    data = {
      object: {
        id: `pi_${faker.string.alphanumeric(24)}`,
        object: "payment_intent",
        amount,
        currency,
        status: eventType.includes("succeeded")
          ? "succeeded"
          : eventType.includes("failed")
            ? "payment_failed"
            : eventType.includes("canceled")
              ? "canceled"
              : "requires_action",
        customer: customerId,
        payment_method: `pm_${faker.string.alphanumeric(24)}`,
        description: faker.commerce.productDescription(),
        metadata: {
          order_id: faker.string.uuid(),
          customer_email: faker.internet.email(),
        },
      },
    };
  } else if (eventType.startsWith("invoice.")) {
    data = {
      object: {
        id: `in_${faker.string.alphanumeric(24)}`,
        object: "invoice",
        amount_due: amount,
        amount_paid: eventType.includes("payment_succeeded") ? amount : 0,
        currency,
        customer: customerId,
        status: eventType.includes("payment_succeeded")
          ? "paid"
          : eventType.includes("payment_failed")
            ? "open"
            : "draft",
        subscription: `sub_${faker.string.alphanumeric(24)}`,
        invoice_pdf: `https://pay.stripe.com/invoice/${faker.string.alphanumeric(32)}/pdf`,
        hosted_invoice_url: `https://invoice.stripe.com/i/${faker.string.alphanumeric(32)}`,
        number: `INV-${faker.string.alphanumeric(10).toUpperCase()}`,
        metadata: {
          order_id: faker.string.uuid(),
        },
      },
    };
  } else if (eventType.startsWith("customer.subscription.")) {
    data = {
      object: {
        id: `sub_${faker.string.alphanumeric(24)}`,
        object: "subscription",
        customer: customerId,
        status: eventType.includes("created")
          ? "active"
          : eventType.includes("deleted")
            ? "canceled"
            : "active",
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000, // 30 dias
        plan: {
          id: `plan_${faker.string.alphanumeric(24)}`,
          amount: amount,
          currency,
          interval: faker.helpers.arrayElement(["month", "year"]),
          product: `prod_${faker.string.alphanumeric(24)}`,
        },
        items: {
          data: [
            {
              id: `si_${faker.string.alphanumeric(24)}`,
              price: {
                id: `price_${faker.string.alphanumeric(24)}`,
                amount,
                currency,
              },
            },
          ],
        },
      },
    };
  } else if (eventType.startsWith("charge.")) {
    data = {
      object: {
        id: `ch_${faker.string.alphanumeric(24)}`,
        object: "charge",
        amount,
        currency,
        customer: customerId,
        status: eventType.includes("succeeded")
          ? "succeeded"
          : eventType.includes("failed")
            ? "failed"
            : "refunded",
        payment_intent: `pi_${faker.string.alphanumeric(24)}`,
        receipt_url: `https://pay.stripe.com/receipts/${faker.string.alphanumeric(32)}`,
        billing_details: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          address: {
            line1: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            postal_code: faker.location.zipCode(),
            country: faker.location.countryCode(),
          },
        },
      },
    };
  } else if (eventType.startsWith("checkout.session.")) {
    data = {
      object: {
        id: `cs_${faker.string.alphanumeric(24)}`,
        object: "checkout.session",
        amount_total: amount,
        currency,
        customer: customerId,
        payment_status: eventType.includes("succeeded") ? "paid" : "unpaid",
        mode: faker.helpers.arrayElement(["payment", "subscription", "setup"]),
        success_url: `https://example.com/success?session_id=cs_${faker.string.alphanumeric(24)}`,
        cancel_url: `https://example.com/cancel`,
        metadata: {
          order_id: faker.string.uuid(),
        },
      },
    };
  } else if (eventType.startsWith("customer.")) {
    data = {
      object: {
        id: customerId,
        object: "customer",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        created:
          Math.floor(Date.now() / 1000) -
          faker.number.int({ min: 0, max: 31536000 }),
        metadata: {
          user_id: faker.string.uuid(),
        },
      },
    };
  } else if (eventType.startsWith("payment_method.")) {
    data = {
      object: {
        id: `pm_${faker.string.alphanumeric(24)}`,
        object: "payment_method",
        type: faker.helpers.arrayElement([
          "card",
          "us_bank_account",
          "sepa_debit",
        ]),
        customer: customerId,
        card: {
          brand: faker.helpers.arrayElement([
            "visa",
            "mastercard",
            "amex",
            "discover",
          ]),
          last4: faker.string.numeric(4),
          exp_month: faker.number.int({ min: 1, max: 12 }),
          exp_year: faker.number.int({ min: 2024, max: 2030 }),
        },
      },
    };
  } else {
    // Eventos genéricos (coupon, plan, product, etc)
    data = {
      object: {
        id: `${eventType.split(".")[0]}_${faker.string.alphanumeric(24)}`,
        object: eventType.split(".")[0],
        name: faker.commerce.productName(),
        created:
          Math.floor(Date.now() / 1000) -
          faker.number.int({ min: 0, max: 2592000 }),
      },
    };
  }

  return {
    ...baseEvent,
    data: {
      object: data.object,
    },
  };
}

async function seed() {
  try {
    const webhookData = [];

    // Gerar pelo menos 60 webhooks
    for (let i = 0; i < 60; i++) {
      const eventType = faker.helpers.arrayElement(stripeEventTypes);
      const stripeEvent = generateStripeEvent(eventType);
      const eventBody = JSON.stringify(stripeEvent, null, 2);
      const contentLength = Buffer.byteLength(eventBody, "utf8");

      // IPs realistas do Stripe
      const stripeIps = [
        "3.18.12.63",
        "3.130.192.231",
        "13.235.14.237",
        "13.235.122.149",
        "18.211.135.69",
        "35.154.171.200",
        "52.15.183.38",
        "54.187.174.169",
        "54.187.205.235",
        "54.187.216.72",
        "54.241.31.99",
        "54.241.31.102",
        "54.241.34.107",
      ];

      const webhook = {
        method: "POST",
        pathname: "/webhook/stripe",
        ip: faker.helpers.arrayElement(stripeIps),
        statusCode: faker.helpers.arrayElement([200, 200, 200, 200, 200, 500]), // maioria 200, alguns 500
        contentType: "application/json",
        contentLength,
        queryParams: {} as Record<string, string>,
        headers: {
          "content-type": "application/json",
          "stripe-signature": `t=${Math.floor(Date.now() / 1000)},v1=${faker.string.alphanumeric(64)}`,
          "user-agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
          "x-forwarded-for": faker.helpers.arrayElement(stripeIps),
          "x-real-ip": faker.helpers.arrayElement(stripeIps),
        } as Record<string, string>,
        body: eventBody,
      };

      webhookData.push(webhook);
    }

    // Inserir todos os webhooks de uma vez
    await db.insert(webhooks).values(webhookData);

    console.log(
      `✅ Successfully seeded ${webhookData.length} Stripe webhook events!`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
