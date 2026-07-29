import os
from typing import Annotated

from clerk_backend_api import Clerk
from clerk_backend_api.jwks_utils import verify_token
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security_scheme = HTTPBearer(auto_error=False)

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY", ""))


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security_scheme)],
) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token",
        )
    try:
        return verify_token(
            jwt=credentials.credentials,
            sk=os.getenv("CLERK_SECRET_KEY", ""),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {e}",
        )
