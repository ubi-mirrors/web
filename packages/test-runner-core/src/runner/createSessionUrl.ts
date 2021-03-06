import path from 'path';
import { TestRunnerConfig } from './TestRunnerConfig';
import { TestSession } from '../test-session/TestSession';
import { PARAM_SESSION_ID, PARAM_DEBUG } from '../browser-launcher/constants';

const toBrowserPathRegExp = new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g');

export function toBrowserPath(filePath: string) {
  return filePath.replace(toBrowserPathRegExp, '/');
}

export function createSessionUrl(config: TestRunnerConfig, session: TestSession, debug: boolean) {
  let browserPath: string;

  if (session.testFile.endsWith('.html')) {
    const resolvedPath = path.resolve(session.testFile);
    const relativePath = path.relative(config.rootDir, resolvedPath);
    browserPath = `/${toBrowserPath(relativePath)}`;
  } else {
    browserPath = '/';
  }
  const params = `?${PARAM_SESSION_ID}=${session.id}${debug ? `&${PARAM_DEBUG}=true` : ''}`;

  return `${config.address}:${config.port}${browserPath}${params}`;
}
