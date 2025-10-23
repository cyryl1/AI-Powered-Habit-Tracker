from passlib.context import CryptContext

class PasswordHasher:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        # Bcrypt has a 72-byte limit, so we need to truncate the password
        # to avoid the "password cannot be longer than 72 bytes" error
        truncated_password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return self.pwd_context.hash(truncated_password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        # Apply the same truncation as in hash_password for consistency
        truncated_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return self.pwd_context.verify(truncated_password, hashed_password)