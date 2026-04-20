import { PropsWithChildren } from "react";
import { AuthProvider } from "../context/AuthContext";
import { OrderProvider } from "../context/OrderContext";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <OrderProvider>{children}</OrderProvider>
    </AuthProvider>
  );
}


