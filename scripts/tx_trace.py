import base64
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gl import make_client  # noqa: E402

TX = "0x5a244cfc8b703f0d1dc884e627bc3d36307e7b42061e3ed45fdf06965b165f74"

client, account = make_client()
tx = sys.argv[1] if len(sys.argv) > 1 else TX

cdc = client.w3.eth.contract(
    address=client.chain.consensus_data_contract["address"],
    abi=client.chain.consensus_data_contract["abi"],
)
all_data, rounds = cdc.functions.getTransactionAllData(tx).call()
print("rounds len:", len(rounds))


def dump(obj, depth=0, path="root"):
    pad = "  " * depth
    if isinstance(obj, (bytes, bytearray)):
        try:
            text = obj.decode("utf-8", "replace")
        except Exception:
            text = repr(obj)
        if text.strip():
            print(f"{pad}{path} (bytes): {text[:800]}")
    elif isinstance(obj, (list, tuple)):
        for i, v in enumerate(obj):
            dump(v, depth + 1, f"{path}[{i}]")
    elif isinstance(obj, str):
        if obj.strip():
            print(f"{pad}{path}: {obj[:800]}")


dump(all_data, 0, "all_data")
print("--- rounds ---")
dump(rounds, 0, "rounds")
