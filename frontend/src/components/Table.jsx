export default function Table({
  columns,
  data,
  onSort,
  sortBy,
  sortOrder,
  renderActions,
}) {
  const handleSort = (key) => {
    if (!onSort) return;

    let order = "asc";

    if (
      sortBy === key &&
      sortOrder === "asc"
    ) {
      order = "desc";
    }

    onSort(key, order);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 font-semibold whitespace-nowrap"
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleSort(column.key)
                    }
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    {column.label}

                    {sortBy === column.key && (
                      <span>
                        {sortOrder === "asc"
                          ? "↑"
                          : "↓"}
                      </span>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}

            {renderActions && (
              <th className="px-6 py-4 font-semibold">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (renderActions ? 1 : 0)
                }
                className="px-6 py-10 text-center text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row._id}
                className="border-t hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-6 py-4">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}