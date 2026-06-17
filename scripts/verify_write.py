"""Run one real forge_genome write end to end against the deployed contract.
Polls manually via the patched SDK decode (status 14 safe)."""
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
    if len(sys.argv) > 1:
        addr = sys.argv[1]
    client, account = make_client()
    print("addr:", addr)

    args = [
        "AstraDAO",
        "Coordinate open, privacy-preserving public goods funding.",
        "DAO",
        "Decentralization, Privacy, Open Participation, Public Goods, Community Control",
        "No emergency powers without sunset clauses. No treasury movement without public disclosure. No user data used without consent.",
        "Long-term contribution, public goods, code contributions, education",
        "Centralized control, hidden governance changes, extractive tokenomics",
    ]
    print("writing forge_genome...")
    tx_hash = client.write_contract(
        address=addr,
        function_name="forge_genome",
        args=args,
    )
    print("write tx:", tx_hash)

    for i in range(150):
        try:
            t = client.get_transaction(transaction_hash=tx_hash)
        except Exception as e:
            print(f"[{i}] decode err: {e}", flush=True)
            time.sleep(8)
            continue
        name = t.get("status_name") or t.get("status") if isinstance(t, dict) else getattr(t, "status_name", None)
        exec_res = (t.get("tx_execution_result_name") if isinstance(t, dict) else None)
        print(f"[{i}] status={name} exec={exec_res}", flush=True)
        if str(name) in TERMINAL:
            break
        time.sleep(8)

    print("get_stats:", json.dumps(read_view(client, account, addr, "get_stats"), default=str))
    print("get_genomes:", json.dumps(read_view(client, account, addr, "get_genomes", [0]), default=str)[:1500])


if __name__ == "__main__":
    main()
