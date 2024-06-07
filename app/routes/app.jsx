import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";

import { authenticate, ONE_TIME_PAYMENT } from "../shopify.server";
import { getSubscriptionStatus } from "~/models/Subscription.server";

export const links = () => [{rel: "stylesheet", href: polarisStyles}];

export async function loader({request}) {
  const {admin, billing, session} = await authenticate.admin(request);
  const {shop} = session;

  if (!admin) {
    return;
  }
  const subscriptions = await getSubscriptionStatus(admin.graphql);
  const {activeSubscriptions} = subscriptions.data.app.installation;

  if (activeSubscriptions.length < 1) {
    await billing.require({
      plans: [ONE_TIME_PAYMENT],
      isTest: true,
      onFailure: async () =>
        billing.request({
          plan: ONE_TIME_PAYMENT,
          isTest: false,
          returnUrl: `https://${shop}/admin/apps/color-qr/app`
        }),
    })
  }

  return json({
    activeSubscriptions,
    apiKey: process.env.SHOPIFY_API_KEY
  });
}

export default function App() {
  const {apiKey} = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Outlet/>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
