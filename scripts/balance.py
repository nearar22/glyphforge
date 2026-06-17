import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from gl import make_client  # noqa: E402

client, account = make_client()
bal = client.w3.eth.get_balance(account.address)
print("address:", account.address)
print("balance wei:", bal)
print("balance GEN:", bal / 10**18)
