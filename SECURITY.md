# Security Policy

## Supported Versions

Security fixes are applied to the latest minor release of each currently
supported major. Older majors receive backports only for HIGH/CRITICAL
issues, and only while at least one downstream consumer remains on them.

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅                  |
| < latest major | ❌ (upgrade required) |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security reports.**

Please report suspected vulnerabilities privately via GitHub's
[security advisory form](https://github.com/LottieFiles/relottie/security/advisories/new).
Reports should include:

- Affected package(s) and version range
- A minimal reproduction or proof of concept
- The impact you believe the issue has (confidentiality / integrity /
  availability), and which threat model it breaks
- Any suggested remediation

We aim to acknowledge reports within 3 business days and provide a fix
or mitigation plan within 30 days for HIGH/CRITICAL severity. Lower
severity issues are handled on the regular release schedule.

## Scope

In scope:
- Source code under this repository (`packages/*`)
- Published npm packages under `@lottiefiles/relottie*`
- Build and release tooling that produces those packages

Out of scope:
- Vulnerabilities in third-party dependencies that have an upstream
  advisory — please report those to the upstream project. We will
  follow up via pnpm overrides once a fix is available.
- The LottieFiles website, hosted services, or other unrelated
  LottieFiles products.

## Supply-Chain Defenses

This repository implements multiple supply-chain hardening measures.
See the recent `chore(security): …` commit series for the
implementations. Highlights:

- `ignore-scripts=true` in `.npmrc` blocks dependency lifecycle scripts
  during `pnpm install` (primary defense against the npm
  postinstall-worm class).
- `pnpm.onlyBuiltDependencies: []` enforces an explicit allowlist for
  packages permitted to run install scripts.
- All GitHub Actions are pinned to 40-character commit SHAs.
- `pnpm install --frozen-lockfile --ignore-scripts` in CI prevents
  lockfile drift and defense-in-depth-blocks dependency scripts.
- `packageManager` includes a sha512 integrity hash so corepack
  verifies the pnpm tarball before execution.
- npm OIDC trusted publishing — no long-lived `NPM_TOKEN`.
- `publishConfig.provenance: true` on every publishable package —
  sigstore attestations are generated at publish time.
- `pnpm audit --prod --audit-level=high` runs on every push and PR.
- gitleaks scans the full git history on every push, PR, and weekly
  schedule.
- StepSecurity Harden-Runner instruments every CI job to surface
  unexpected egress.

If you spot a gap in any of these controls, please report it via the
process above.

## Self-detection: am I affected by a published npm worm?

If you cloned this repository, installed dependencies, and now suspect
your machine may have been targeted by a recent npm supply-chain worm
(e.g. the mini Shai-Hulud / Shai-Hulud family), run these checks.

Each command exits non-zero if it finds an indicator. None of them
modify state — safe to run.

**1. Scan the installed tree for known payload filenames:**

```bash
find node_modules -type f \( \
  -name router_init.js -o \
  -name tanstack_runner.js \
\) -print
```

**2. Cross-reference the lockfile against known compromised packages:**

```bash
grep -E '@tanstack/setup|@tanstack/.*@github:' pnpm-lock.yaml || \
  echo "clean"
```

**3. Look for persistence artefacts the worm writes to dev machines:**

```bash
for path in \
  .claude/router_runtime.js \
  .claude/setup.mjs \
  .vscode/setup.mjs \
  ~/Library/LaunchAgents/com.user.gh-token-monitor.plist \
  ~/.config/systemd/user/gh-token-monitor.service \
  ~/.local/bin/gh-token-monitor.sh
do
  [ -e "$path" ] && echo "FOUND: $path"
done
```

**4. Audit npm token descriptions for the ransom marker:**

```bash
npm token list --json 2>/dev/null | \
  grep -i "IfYouRevokeThisTokenItWillWipeTheComputerOfTheOwner" && \
  echo "WARNING: ransom-marker token present — do NOT revoke before imaging the machine"
```

**⚠️ If any check finds an indicator, do not revoke npm tokens or
delete files yet.** The known payload includes a destructive routine
triggered by revocation. Disconnect the machine from the network,
image the disk, then follow the [StepSecurity remediation runbook][sh].

The CI workflows in this repository (`.github/workflows/security.yml`,
job `ioc-scan`) run these same checks against every push, PR, and on a
weekly schedule, so a compromise that lands in `main` is flagged before
it can propagate.

[sh]: https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem
