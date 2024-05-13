const processTable = (table) => {
  return [...table.rows].map(map => {
    return [...map.cells].map(cell => {
      return cell.innerText;
    });
  });
}

export const Utils = {
  processTable
}