import { v4 as uuid } from 'uuid';
import { SESSION_STATUS } from '../test-session/TestSessionStatus';
import { TestSession } from '../test-session/TestSession';
import { BrowserLauncher } from '../browser-launcher/BrowserLauncher';

export function createTestSessions(
  browserNamesPerLauncher: Map<BrowserLauncher, string[]>,
  testFiles: string[],
): TestSession[] {
  const sessions = [];

  for (const testFile of testFiles) {
    for (const [browserLauncher, browserNames] of browserNamesPerLauncher) {
      for (const browserName of browserNames) {
        const session: TestSession = {
          id: uuid(),
          testRun: -1,
          browserName,
          browserLauncher,
          status: SESSION_STATUS.SCHEDULED,
          testFile,
          errors: [],
          tests: [],
          logs: [],
          request404s: [],
        };

        sessions.push(session);
      }
    }
  }

  return sessions;
}
