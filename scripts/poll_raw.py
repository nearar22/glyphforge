"""Poll a transaction via raw RPC, bypassing the SDK status decode that crashes
on status codes it does not know (e.g. 14). Prints status and recipient."""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
from gl import make_client  # noqa: E402

STATUS = {
    "1": "PENDING", "2": "PROPOSING", "3": "COMMITTING", "4": "REVEALING",
    "5": "ACCEPTED", "6": "UNDETERMINED", "7": "FINALIZED", "8": "CANCELED",
    "12": "VALIDATORS_TIMEOUT", "13": "LEADER_TIMEOUT", "14": "ACTIVATED",
}
TERMINAL = {"5", "7", "6", "8"}


DEFAULT_TX = "0x9f8b348200d50ed3df628984695a6e722c3e5bc314016398990acb122b9d1381"


def main():
    tx = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_TX
    client, account = make_client()
    for i in range(240):
        res = client.provider.make_request(
            method="eth_getTransactionByHash", params=[tx]
        )["result"]
        status = str(res.get("status")) if isinstance(res, dict) else None
        recipient = res.get("recipient") if isinstance(res, dict) else None
        name = STATUS.get(status, status)
        print(f"[{i}] status={status} ({name}) recipient={recipient}", flush=True)
        if status in TERMINAL:
            print("TERMINAL", json.dumps({"status": name, "recipient": recipient}))
            return
        time.sleep(8)
    print("timed out polling")


if __name__ == "__main__":
    main()
