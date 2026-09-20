import CartView from "@/components/CartView";

export const metadata = {
  title: "Your cart",
  description: "Check out with PayPal or Venmo, or pick your order up in Quincy, IL.",
  robots: { index: false },
};

export default function CartPage() {
  return <CartView />;
}
