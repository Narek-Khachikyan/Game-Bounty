import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const failures = [];

const requiredFiles = [
	'AGENTS.md',
	'CLAUDE.md',
	'ARCHITECTURE.md',
	'docs/README.md',
	'docs/architecture-invariants.md',
	'docs/harness.md',
	'docs/quality-scorecard.md',
	'docs/references/project-facts.md',
	'docs/exec-plans/README.md',
	'docs/exec-plans/TEMPLATE.md',
	'docs/exec-plans/active/README.md',
	'docs/exec-plans/completed/README.md',
	'firestore.rules',
];

const markdownEntryPoints = [
	'AGENTS.md',
	'CLAUDE.md',
	'ARCHITECTURE.md',
	'README.md',
	'docs/README.md',
	'docs/harness.md',
	'docs/exec-plans/README.md',
];

const allowedStorageFiles = new Set(['src/hooks/useBackgroundVideoGate.ts']);
const allowedRouteFiles = new Set(['src/App.tsx']);
const allowedDirectFetchFiles = new Set(['src/app/redux/features/apiSlice.ts']);

const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

const readFile = (relativePath) =>
	fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const fileExists = (relativePath) =>
	fs.existsSync(path.join(repoRoot, relativePath));

const reportFailure = (message) => {
	failures.push(message);
};

const walk = (relativeDir) => {
	const absoluteDir = path.join(repoRoot, relativeDir);
	const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const relativePath = path.join(relativeDir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walk(relativePath));
			continue;
		}

		files.push(relativePath);
	}

	return files;
};

const getTrackedSourceFiles = () => {
	try {
		const output = execFileSync('git', ['ls-files', '--', 'src'], {
			cwd: repoRoot,
			encoding: 'utf8',
		});

		return output
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);
	} catch {
		return walk('src');
	}
};

for (const requiredFile of requiredFiles) {
	if (!fileExists(requiredFile)) {
		reportFailure(`Missing required harness file: ${requiredFile}`);
	}
}

for (const markdownFile of markdownEntryPoints) {
	if (!fileExists(markdownFile)) {
		continue;
	}

	const fileContents = readFile(markdownFile);
	let match;

	while ((match = markdownLinkPattern.exec(fileContents)) !== null) {
		const rawTarget = match[1];
		if (
			rawTarget.startsWith('http://') ||
			rawTarget.startsWith('https://') ||
			rawTarget.startsWith('#') ||
			rawTarget.startsWith('mailto:')
		) {
			continue;
		}

		const [targetPath] = rawTarget.split('#');
		if (!targetPath) {
			continue;
		}

		const resolvedPath = path.normalize(path.join(path.dirname(markdownFile), targetPath));
		if (!fileExists(resolvedPath)) {
			reportFailure(
				`Broken relative Markdown link in ${markdownFile}: ${rawTarget} -> ${resolvedPath}`,
			);
		}
	}
}

const packageJson = JSON.parse(readFile('package.json'));
if (packageJson.scripts?.['harness:check'] !== 'node scripts/harness-check.mjs') {
	reportFailure('package.json must expose "harness:check" as "node scripts/harness-check.mjs".');
}

if (
	packageJson.scripts?.verify !==
	'npm run harness:check && npm run lint && npm run build'
) {
	reportFailure(
		'package.json must expose "verify" as "npm run harness:check && npm run lint && npm run build".',
	);
}

const sourceFiles = getTrackedSourceFiles().filter(
	(relativePath) => /\.(ts|tsx|js|jsx)$/.test(relativePath) && fileExists(relativePath),
);

for (const sourceFile of sourceFiles) {
	const contents = readFile(sourceFile);

	if (contents.includes('import.meta.env')) {
		reportFailure(
			`Client environment access is not allowed in tracked src files. Found in ${sourceFile}.`,
		);
	}

	if (contents.includes('localStorage') && !allowedStorageFiles.has(sourceFile)) {
		reportFailure(
			`Browser persistence is only allowed in ${[...allowedStorageFiles].join(', ')}. Found in ${sourceFile}.`,
		);
	}

	if (/<Route\b/.test(contents) && !allowedRouteFiles.has(sourceFile)) {
		reportFailure(
			`Route declarations are only allowed in ${[...allowedRouteFiles].join(', ')}. Found in ${sourceFile}.`,
		);
	}

	if (/\bfetch\s*\(/.test(contents) && !allowedDirectFetchFiles.has(sourceFile)) {
		reportFailure(
			`Direct fetch usage is only allowed in ${[...allowedDirectFetchFiles].join(', ')}. Found in ${sourceFile}.`,
		);
	}

	if (/from\s+['"]axios['"]|import\s+axios/.test(contents)) {
		reportFailure(`Unexpected axios usage found in ${sourceFile}. Keep transport centralized in RTK Query.`);
	}
}

if (failures.length > 0) {
	console.error('Harness check failed:\n');
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}

	process.exit(1);
}

console.log(
	`Harness OK: ${requiredFiles.length} required files, ${markdownEntryPoints.length} entrypoint docs, ${sourceFiles.length} source files checked.`,
);
