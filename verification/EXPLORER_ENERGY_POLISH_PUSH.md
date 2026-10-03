# Explorer energy polish · push snapshot

2026-10-03 (Asia/Seoul).

This branch contains the approved Explorer early redesign and its required 3D components, plus the Step 01 terminology and Step 02 basic/advanced energy polish. The approved Explorer/3D base was still uncommitted, so these dependencies are included without further changes.

Step 01 retains its controls and energy calculations, with Korean basic labels and formal symbols in the collapsed equation. Step 02 defaults to basic, showing proton transfer, synthase rotation, ATP synthesis, two energy bars and sufficient/insufficient results. Advanced mode exposes the existing coupling-ratio and ATP-cost controls, molar free energies and cycle equation. Proton energy is explicitly per mole, and ATP synthesis cost is an example condition.

The separate, uncommitted respiration pre-learning work is excluded. Respiration, Photosynthesis, content, science and deployment workflow files match the remote main base (`0c8bcea2667752a40254da4a353d99e719ebbc1b`). The learning-journey test retains the main branch's TCA cycle label.

## Validation

- This isolated push snapshot: 58/58 unit/science and 24/24 browser tests passed; production build passed.
- The full local workspace, including separately preserved respiration work, previously passed 76/76 unit/science and 34/34 browser tests. Those additional respiration tests are not part of this branch.
- Verified 1440×900, 1024×768, 768×1024 and 390×844; screenshots are in `verification/screenshots/explorer-energy-polish/` (36 files).
- The isolated browser run used port 42864 so it exercised this snapshot rather than the full workspace's preview on 42863. The committed preview/test configuration is unchanged.
- Existing Three.js bundle-size notice remains. No additional runtime dependencies beyond the approved 3D work were introduced.

## Publication boundary

Push target: `codex/explorer-energy-polish`. The main branch is unchanged. The Pages workflow triggers on pushes to main, so this branch push does not request a deployment. No manual deployment or workflow dispatch is performed.

The original workspace and all its uncommitted changes are retained.
