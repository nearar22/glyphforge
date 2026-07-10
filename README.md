# GlyphForge

Forge the DNA of a protocol. GlyphForge turns a protocol's declared values,
rules, incentives and taboos into a living on-chain genome: an animated glyph
whose archetype, contradictions and scores are decided by a GenLayer validator
jury, not by a server.

This document is a **codex**. Rather than a setup manual, it defines GlyphForge
one term at a time, from the smallest unit of meaning up to the consensus that
seals it. Read it top to bottom and the whole system assembles itself.

---

## Codex

### Genome
The complete forged identity of a protocol. A genome is an on-chain record
holding the protocol name, ecosystem, dominant archetype, secondary traits, the
chosen values, hard rules, incentives and taboos, five scores, the detected
tensions, a generated constitution, and a deterministic visual seed. It is the
single artifact every other term in this codex serves to produce. Genomes are
immutable once forged and are read back through paged views.

### Archetype
One of six fixed identities a genome resolves to: Sovereign Commons, Privacy
Citadel, Builder Gravity, Efficient Machine, Guardian Network, or Open Frontier.
The archetype is never chosen by a string the model emits. Instead the jury
returns an **affinity** (an integer 0 to 100) for each of the six, and the
contract picks the dominant one by deterministic argmax. This matters for
consensus: comparing a winning number is robust where comparing a free-text
label is brittle.

### Tension
A genuine contradiction between two of the protocol's own principles, for
example privacy against full transparency, or aggressive rewards against
sustainability. Each tension carries a name, a severity (Low, Medium, High), a
one-sentence reason, and a one-sentence resolution. The jury is instructed never
to invent tensions; a genuinely coherent identity returns none. Tensions feed
the genome's visual rift and lower its alignment score.

### Score
Five integers, each 0 to 100, that the jury assigns to a genome: alignment (how
internally consistent the identity is), resilience (how well it resists capture
and shocks), sustainability (how durable its incentives are), governance load
(how heavy its machinery is), and decentralization pressure (how strongly it
pushes toward decentralization). Scores are the numeric backbone validators
compare under tolerance.

### Visual Seed
A small set of integers the contract derives deterministically from the forged
genome: a primary and secondary hue keyed to the archetype, a ring count from
the rules, an orbit count from the values, a rift intensity from the tensions,
and a glyph complexity. The frontend renders the seed as a procedural animated
glyph, so the same genome always produces the same artifact, and the picture is
computed from on-chain numbers, never stored as an image.

### The Forge
The single write method, `forge_genome`. It is where consensus happens. The
lifecycle of one forge:

1. **Guards.** Deterministic checks run before any model call: the name is
   bounded and sanitized to ASCII, the value/rule/incentive/taboo lists are
   parsed and capped, and at least one value is required. Cheap failures never
   burn a consensus round.
2. **Leader proposal.** A leader runs the jury prompt once and returns the
   affinity vector, traits, tensions, scores and constitution as one JSON object.
3. **Validator agreement.** Every validator re-runs the same analysis and
   compares: the dominant archetype (argmax of affinity) must match exactly, and
   each of the five scores must agree within a tolerance of about eighteen
   points. Prose and wording are free to differ.
4. **Backstops.** After consensus, the contract derives the archetype and builds
   the integer visual seed itself, so the stored artifact is shaped by code, not
   by whatever the model happened to phrase.
5. **Seal.** The genome is written to storage, appended to the id list, and the
   counter ticks. The transaction hash becomes the genome's proof.

The consensus core, taken from the deployed contract:

```python
def leader_fn():
    raw = gl.nondet.exec_prompt(prompt, response_format="json")
    return _normalize_forge(raw)

def validator_fn(leaders_res: gl.vm.Result) -> bool:
    if not isinstance(leaders_res, gl.vm.Return):
        return _handle_leader_error(leaders_res, leader_fn)
    mine = leader_fn()
    theirs = leaders_res.calldata
    if not isinstance(theirs, dict):
        return False
    # Dominant archetype (argmax over affinity) must match: a numeric
    # comparison, robust to wording differences between validators.
    if _dominant(mine["archetypeAffinity"]) != _dominant(theirs.get("archetypeAffinity", {})):
        return False
    theirs_scores = theirs.get("scores")
    if not isinstance(theirs_scores, dict):
        return False
    for d in DIMS:                      # five genome dimensions
        a = int(mine["scores"][d])
        b = int(theirs_scores.get(d, -1))
        if b < 0:
            return False
        if abs(a - b) > max(18, (18 * max(a, b)) // 100):
            return False
    return True

return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
```

Why argmax and not a label match: an early version asked the jury to return the
archetype as a string and compared strings exactly. Validators each picked
slightly different wording for a subjective classification and consensus failed
with a deterministic violation. Returning a numeric affinity per archetype and
choosing the winner in contract code turned a brittle categorical match into a
robust numeric one.

### Injection Resistance
The prompt treats the entire protocol input as untrusted data, never as
instructions. If an identity tries to dictate its own archetype or inflate its
own scores, the jury is told to ignore that and judge honestly. The structural
result fields (archetype affinity and scores) are the only things validators
agree on, so a prompt buried in a mission statement cannot move the verdict.

### Forger
The address that submitted a genome, recorded on the artifact. GlyphForge takes
no deposit and moves no value; a forger pays only the network fee for the write.

### Glyph
The rendered artifact. The frontend reads a genome's visual seed and draws it as
concentric animated rule rings, orbiting value satellites, radial spokes, a
central star sigil whose points scale with complexity, and a tension rift that
tears the figure when contradictions are severe. It is pure SVG geometry driven
by `requestAnimationFrame`, computed from the seed, with no images or external
assets.

### Archive
The set of all forged genomes. The contract exposes them through a paged view
(`get_genomes`) newest first, and through a single lookup (`get_genome`). The
frontend reads the chain as the source of truth and caches each genome in the
browser so the archive opens instantly and survives a refresh.

---

## What the contract exposes

The contract is the entire backend. Its surface, in lifecycle order:

- `forge_genome(protocol_name, mission, ecosystem, values, rules, incentives, taboos) -> dict`
  The one write. Runs the consensus forge described above and returns the sealed
  genome. The four list arguments accept newline or comma separated text.
- `get_genomes(start) -> list` Paged read of forged genomes, newest first, up to
  twenty per page.
- `get_genome(genome_id) -> dict` A single genome by id.
- `get_stats() -> dict` The genome count, for the live header figure.

---

## Architecture

```
   Browser (React + Vite, static)
   |  procedural glyph (SVG), the forge ritual, the archive
   |  genlayer-js read + write, slow polling, leader-draft peek
   v
   GenLayer Bradbury  ----  GlyphForge Intelligent Contract
                            storage: genomes, ids, counter
                            forge_genome: leader proposal + validator
                            agreement (argmax archetype, score tolerance)
                            deterministic guards before, backstops after
```

There is no server, no database, and no external API. State, the AI judgment,
and the consensus rule all live in the contract; the frontend is a static SPA
that talks to the chain.

### The frontend, briefly
The experience is built as a guided ritual rather than a form: a forge chamber
to name the protocol, a value orbit, rule rings, an incentive matrix, a tension
rift preview, then the on-chain forge with a consensus loading sequence and an
artifact reveal. The visual direction is an Interdimensional Glyph interface:
abyss-dark field, violet and spectral-cyan light, procedural glyphs, and
portal-style page transitions. The tension preview before forging is a local
heuristic; the authoritative tensions are the ones the jury returns on-chain.

---

The deployed contract is the authoritative source, verifiable on the explorer:

- Contract: [`0x8F68d783cd3434A07bA32aAf97728D2A3707914B`](https://explorer-bradbury.genlayer.com/address/0x8F68d783cd3434A07bA32aAf97728D2A3707914B)
- Deploy transaction: [`0x25fe472f68d588e043f1e617c23ee70f6c02ee292f14a6e39269cf2a4e3b5d5d`](https://explorer-bradbury.genlayer.com/tx/0x25fe472f68d588e043f1e617c23ee70f6c02ee292f14a6e39269cf2a4e3b5d5d)

The full backend is `contracts/contract.py` in this repository.
