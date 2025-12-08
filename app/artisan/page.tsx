import { redirect } from 'next/navigation';

export default function ArtisanIndexPage() {
  // Redirect to the artisans listing page
  redirect('/artisans');
}