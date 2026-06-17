"""Decode a transaction through the SDK with the status-14 patch applied,
printing status_name and recipient. Polls until terminal."""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()

from gl import make_client  # noqa: E402

TX = "0x9f8b348200d50ed3df628984695a6e722c3e5bc314016398990acb122b9d1381"
TERMINAL = {"ACCEPTED", "FINALIZED", "UNDETERMINED", "CANCELED"}


def main():
    tx = sys.argv[1] if len(sys.argv) > 1 else TX
    client, account = make_client()
    for i in range(120):
        try:
            t = client.get_transaction(transaction_hash=tx)
        except Exception as e:
            print(f"[{i}] decode err: {e}", flush=True)
            time.sleep(8)
            continue
        if isinstance(t, dict):
            name = t.get("status_name") or t.get("status")
            recipient = t.get("recipient")
            exec_res = t.get("tx_execution_result_name") or t.get("tx_execution_result")
        else:
            name = getattr(t, "status_name", None)
            recipient = getattr(t, "recipient", None)
            exec_res = getattr(t, "tx_execution_result", None)
        print(f"[{i}] status={name} recipient={recipient} exec={exec_res}", flush=True)
        if str(name) in TERMINAL:
            print("TERMINAL", json.dumps({"status": str(name), "recipient": str(recipient)}))
            return
        time.sleep(8)
    print("timed out")


if __name__ == "__main__":
    main()
