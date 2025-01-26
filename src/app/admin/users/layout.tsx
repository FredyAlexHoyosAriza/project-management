export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
    </div>
  );
}
