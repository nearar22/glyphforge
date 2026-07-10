"""Forge a second, different genome (LumaMesh, a privacy social protocol) to
confirm the contract classifies a new identity correctly under consensus.
Sends rules as proper newline-separated items."""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()
from gl import make_client, read_view  # noqa: E402

TERMINAL = {"ACCEPTED", "FINALIZED", "UNDETERMINED", "CANCELED"}


def main():
    root = os.path.dirname(os.path.dirname(__file__))
    addr = json.load(open(os.path.join(root, "deployment.json")))["address"]
    client, account = make_client()
    print("addr:", addr)

    args = [
        "LumaMesh",
        "A social graph where users own their identity and nothing leaks without consent.",
        "Social Protocol",
        "Privacy\nUser Ownership\nCensorship Resistance\nDecentralization",
        "No user data used without consent\nNo arbitrary blacklisting",
        "Community moderation\nUser retention\nEducational content",
        "Data harvesting\nCentralized control",
    ]
    print("writing forge_genome (LumaMesh)...")
    tx = client.write_contract(address=addr, function_name="forge_genome", args=args, value=0)
    print("tx:", tx)

    for i in range(150):
        try:
            t = client.get_transaction(transaction_hash=tx)
        except Exception as e:
            print(f"[{i}] decode err: {e}", flush=True)
            time.sleep(8)
            continue
        name = t.get("status_name") or t.get("status") if isinstance(t, dict) else None
        exec_res = t.get("tx_execution_result_name") if isinstance(t, dict) else None
        print(f"[{i}] status={name} exec={exec_res}", flush=True)
        if str(name) in TERMINAL:
            break
        time.sleep(8)

    print("\nget_stats:", json.dumps(read_view(client, account, addr, "get_stats"), default=str))
    genomes = read_view(client, account, addr, "get_genomes", [0])
    newest = genomes[0] if genomes else {}
    print("\nNewest genome:")
    print("  protocol :", newest.get("protocolName"))
    print("  archetype:", newest.get("archetype"))
    print("  traits   :", newest.get("secondaryTraits"))
    print("  scores   :", json.dumps(newest.get("scores"), default=str))
    print("  tensions :", json.dumps(newest.get("tensions"), default=str)[:400])
    print("  rules    :", newest.get("rules"))
    print("  seed     :", json.dumps(newest.get("visualSeed"), default=str))


if __name__ == "__main__":
    main()
