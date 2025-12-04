export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container">
      <h1 style={{ fontSize: 'var(--font-size-5)', marginBottom: 'var(--size-4)' }}>
        Account: {id}
      </h1>
      <p style={{ color: 'var(--text-2)' }}>
        Account profile and posts will be displayed here.
      </p>
    </div>
  );
}
