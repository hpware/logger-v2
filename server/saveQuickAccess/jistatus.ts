var currentStatus = false;

export function getJiStatus() {
  return currentStatus;
}
export function setJiStatus(status: boolean) {
  currentStatus = status;
}
