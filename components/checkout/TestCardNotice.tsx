export function TestCardNotice() {
  return (
    <aside className="border-l-4 border-safety bg-white p-4">
      <p className="font-semibold">Test card</p>
      <p className="mt-1 font-mono text-lg tracking-wide">
        4242 4242 4242 4242
      </p>
      <p className="mt-1 text-steel">
        Use any future expiry date and any 3-digit CVC. Never enter a real card
        on this site.
      </p>
    </aside>
  );
}
