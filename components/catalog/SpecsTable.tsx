export function SpecsTable({ specs }: { specs: Record<string, string> }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Specifications</caption>
      <tbody>
        {Object.entries(specs).map(([name, value]) => (
          <tr key={name} className="border-b border-line">
            <th scope="row" className="w-2/5 py-2.5 pr-4 font-semibold">
              {name}
            </th>
            <td className="py-2.5 text-steel">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
