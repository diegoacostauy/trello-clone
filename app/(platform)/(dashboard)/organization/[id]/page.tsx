export default function OrganizationPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {

  return (
    <div>
      <h1>Organization {id}</h1>
    </div>
  );
}
