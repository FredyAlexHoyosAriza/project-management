import EditUser from "@/components/users/EditUser";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  let { name } = await params;
  if (name.includes("%3A")) {
    //edit%3A
    name = name.split("%3A")[1];
  }
  return (
    <div>
      <EditUser />
    </div>
  );
}
