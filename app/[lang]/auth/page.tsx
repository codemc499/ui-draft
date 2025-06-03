import { redirect } from 'next/navigation';

export default function AuthPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  // Redirect to the login page by default
  redirect(`/${params.lang}/auth/login`);
}
