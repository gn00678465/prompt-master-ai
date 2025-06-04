"""
處理密碼模組
"""

import argon2
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHash, VerifyMismatchError


def hash_password(password: str) -> str:
    """
    Hash a password using Argon2.
    """
    time_cost = 2  # Number of iterations
    memory_cost = 102400  # 100 MB in KiB
    parallelism = 8  # Number of parallel threads
    hash_len = 32  # Length of the hash in bytes
    salt_len = 16  # Length of the salt in bytes

    # Create the hasher
    ph = argon2.PasswordHasher(
        time_cost=time_cost,
        memory_cost=memory_cost,
        parallelism=parallelism,
        hash_len=hash_len,
        salt_len=salt_len,
        type=argon2.Type.ID,  # Using Argon2id variant
    )

    # Hash the password (salt is generated automatically)
    _hash = ph.hash(password)

    return _hash


def verify_password(stored_hash: str, provided_password: str) -> bool:
    """
    Verify a password against a stored hash.
    """
    ph = PasswordHasher()
    try:
        # Verify the password
        ph.verify(stored_hash, provided_password)
        return True
    except VerifyMismatchError:
        # Password doesn't match
        return False
    except InvalidHash:
        # The stored hash has an invalid format
        print("Invalid hash format. The hash may be corrupted.")
        return False
