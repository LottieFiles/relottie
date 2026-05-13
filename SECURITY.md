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
