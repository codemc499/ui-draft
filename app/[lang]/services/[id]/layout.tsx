import { Metadata } from 'next';
// Remove ResolvingMetadata import if not needed
// import { type ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  // Remove the unused parent parameter
  // parent?: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Service ${id}`,
    description: 'View details about this service',
  };
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
