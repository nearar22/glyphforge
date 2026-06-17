import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()
from gl import make_client  # noqa: E402

TX = "0x5a244cfc8b703f0d1dc884e627bc3d36307e7b42061e3ed45fdf06965b165f74"

client, account = make_client()
tx = sys.argv[1] if len(sys.argv) > 1 else TX
t = client.get_transaction(transaction_hash=tx)
if isinstance(t, dict):
    for k in t:
        v = t[k]
        s = json.dumps(v, default=str)
        if len(s) > 1200:
            s = s[:1200] + "..."
        print(k, "=", s)
else:
    print(t)
