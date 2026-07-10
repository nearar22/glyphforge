import json

REG = r"c:\Users\USER\Desktop\all genlayer 2\.genlayer-projects.json"

description = (
    "GlyphForge is a protocol DNA composer built on GenLayer, where the AI "
    "classification is the on-chain settlement rather than a cosmetic layer. A "
    "builder declares a protocol identity (values, hard rules, incentives, "
    "taboos), and a GenLayer jury forges its genome: an affinity to each of six "
    "archetypes, secondary traits, genuine tensions between principles, and five "
    "scores. A leader proposes the genome and every validator re-runs the "
    "analysis, agreeing on the dominant archetype (chosen by deterministic argmax "
    "over the affinity vector) and the scores within tolerance before it is "
    "sealed. Guards sanitize input before the model and backstops derive the "
    "archetype and visual seed after. No deposits: the contract holds every "
    "genome while a static frontend renders it as a living glyph."
)

entry = {
    "name": "glyphforge",
    "createdAt": "2026-06-17",
    "concept": "On-chain AI protocol-DNA composer: a builder declares a protocol's values, rules, incentives and taboos, and a GenLayer jury forges a genome (dominant archetype by affinity argmax, secondary traits, detected tensions, five scores, a constitution) under validator consensus, sealing a living symbolic artifact on-chain.",
    "description": description,
    "domain": "AI protocol identity / governance composition",
    "appArchetype": "guided ritual composer (a multi-step creation flow: forge chamber, value orbit, rule rings, incentive matrix, tension rift, then an on-chain forge with a consensus reveal; the procedural glyph is the primary surface, not a landing page or a submission feed)",
    "artDirection": "Interdimensional Glyph UI",
    "palette": {
        "background": "#02000A",
        "accent": "#6D28D9 (dimensional violet) with #22D3EE (spectral cyan)",
        "notes": "Abyss-black void field, violet and spectral-cyan luminous structures, solar-gold and ritual-pink and emerald signal colors, glassmorphic panels over a living particle field, procedural SVG glyphs, portal page transitions, zero stock imagery.",
    },
    "fonts": {"display": "Space Grotesk", "body": "Manrope", "mono": "JetBrains Mono"},
    "heroMotif": "a central procedural protocol glyph (concentric animated rule rings, orbiting value satellites, a star sigil and a tension rift) over a cursor-reactive dimensional particle field, with floating principle words",
    "layoutMotif": "ritual step flow with a horizontal progress rail and a live-reacting glyph beside each step, then an archive of glyph relics; glass panels over a dimensional canvas rather than cards in a grid",
    "readmeShape": "codex / lexicon (the system defined one term at a time, smallest unit up to the consensus)",
    "repo": "https://github.com/nearar22/glyphforge",
    "live": "",
    "contract": "0x8F68d783cd3434A07bA32aAf97728D2A3707914B",
}

print("description length:", len(description))
assert 600 <= len(description) <= 800, "description out of range"

d = json.load(open(REG, encoding="utf-8"))
d["projects"] = [p for p in d["projects"] if p.get("name") != "glyphforge"]
d["projects"].append(entry)
json.dump(d, open(REG, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("appended. total projects:", len(d["projects"]))
