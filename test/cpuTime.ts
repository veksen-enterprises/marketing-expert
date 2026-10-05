// Speed checks measure the CPU time this process used, not wall-clock time: a busy machine (other test files, other
// processes) stretches wall-clock time and failed these checks at load averages near 300, while the code was fine.
export function cpuNow(): number {
  const u = process.cpuUsage();
  return (u.user + u.system) / 1000;
}
