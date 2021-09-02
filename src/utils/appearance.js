export function getTaskResultIcon(result) {
  if (result.status === 0) return 'el-icon-loading';
  if (result.status === 1) return 'el-icon-success';
  if (result.status === -1) return 'el-icon-warning';
  if (result.status < 0) return 'el-icon-error';
}

export function getTaskResultColor(result) {
  if (result.status === 1) return 'text-success';
  if (result.status === -1) return 'text-warning';
  if (result.status < 0) return 'text-danger';
  return 'text-regular';
}
