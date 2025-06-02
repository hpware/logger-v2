var currentStatus = false;

export function getLedStatus() {
  return currentStatus;
}
export function setLedStatus(status: boolean) {
  currentStatus = status;
}
