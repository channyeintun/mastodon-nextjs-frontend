export default async function StatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container">
      <h1 style={{ fontSize: 'var(--font-size-5)', marginBottom: 'var(--size-4)' }}>
        Status Detail: {id}
      </h1>
      <p style={{ color: 'var(--text-2)' }}>
        Status thread and context will be displayed here.
      </p>
    </div>
  );
}
