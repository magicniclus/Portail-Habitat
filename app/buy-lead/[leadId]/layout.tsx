import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achat de lead - Portail Habitat',
  description: 'Finalisez votre achat de lead professionnel',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BuyLeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
