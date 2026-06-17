import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gl import make_client  # noqa: E402

TX = "0x9f8b348200d50ed3df628984695a6e722c3e5bc314016398990acb122b9d1381"

client, account = make_client()
for method in ("eth_getTransactionByHash", "gen_getTransactionByHash"):
    try:
        res = client.provider.make_request(method=method, params=[TX])
        print("===", method, "===")
        print(json.dumps(res, default=str)[:2000])
    except Exception as e:
        print("===", method, "ERR", e)
