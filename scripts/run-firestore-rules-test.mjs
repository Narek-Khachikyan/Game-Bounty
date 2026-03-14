import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const firestoreHost = '127.0.0.1';
const firestorePort = 8080;
const projectId = 'demo-game-bounty';

const getJavaVersion = () => {
   const result = spawnSync('java', ['-version'], { encoding: 'utf8' });

   if (result.error) {
      throw new Error(
         'Java is required for the Firestore Emulator. Install Java 21+ and ensure `java` is on your PATH.',
      );
   }

   const output = `${result.stdout}\n${result.stderr}`;
   const versionMatch = output.match(/version "([^"]+)"/);

   if (!versionMatch) {
      throw new Error(`Unable to determine the installed Java version.\n${output}`);
   }

   const rawVersion = versionMatch[1];
   const majorVersion = rawVersion.startsWith('1.')
      ? Number(rawVersion.split('.')[1])
      : Number(rawVersion.split('.')[0]);

   return { majorVersion, rawVersion };
};

const waitForChildExit = (childProcess) =>
   new Promise((resolve, reject) => {
      if (childProcess.exitCode !== null || childProcess.signalCode !== null) {
         resolve({ code: childProcess.exitCode, signal: childProcess.signalCode });
         return;
      }

      const handleExit = (code, signal) => {
         cleanup();
         resolve({ code, signal });
      };

      const handleError = (error) => {
         cleanup();
         reject(error);
      };

      const cleanup = () => {
         childProcess.off('exit', handleExit);
         childProcess.off('error', handleError);
      };

      childProcess.once('exit', handleExit);
      childProcess.once('error', handleError);
   });

const createFirebaseConfig = async () => {
   const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'game-bounty-firestore-rules-'));
   const configPath = path.join(tempDir, 'firebase.json');
   const config = {
      firestore: {
         rules: path.join(process.cwd(), 'firestore.rules'),
      },
      emulators: {
         singleProjectMode: true,
         firestore: {
            host: firestoreHost,
            port: firestorePort,
         },
      },
   };

   await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);

   return { tempDir, configPath };
};

const getFirebaseCommand = () => (process.platform === 'win32' ? 'npx.cmd' : 'npx');

const { majorVersion, rawVersion } = getJavaVersion();

if (majorVersion < 21) {
   throw new Error(
      `Firestore Emulator requires Java 21+ in this setup. Found Java ${rawVersion}. Install Java 21 and rerun \`npm run firestore:rules:test\`.`,
   );
}

const { tempDir, configPath } = await createFirebaseConfig();

try {
   const firebaseProcess = spawn(
      getFirebaseCommand(),
      [
         '--no-install',
         'firebase',
         'emulators:exec',
         '--config',
         configPath,
         '--project',
         projectId,
         '--only',
         'firestore',
         '--log-verbosity',
         'QUIET',
         'node scripts/firestore-rules-check.mjs',
      ],
      {
         env: process.env,
         stdio: 'inherit',
      },
   );

   const { code, signal } = await waitForChildExit(firebaseProcess);

   if (signal) {
      throw new Error(`Firebase Emulator CLI exited due to signal ${signal}.`);
   }

   process.exitCode = code ?? 1;
} catch (error) {
   if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
         'npm is required to launch the bundled Firebase CLI. Install npm and rerun `npm run firestore:rules:test`.',
      );
   }

   throw error;
} finally {
   await fs.rm(tempDir, { force: true, recursive: true });
}
