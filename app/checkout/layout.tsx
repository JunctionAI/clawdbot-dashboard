import { checkoutMetadata } from './metadata';
import { PricingJsonLd } from '@/components/JsonLd';

export const metadata = checkoutMetadata;

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}
