export const metadata = {
  title: "CRUD",
  description: "CRUD",
};
export default function CrudLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex py-10">{children}</div>;
}
