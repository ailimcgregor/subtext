from typing import Final
import os
from dotenv import load_dotenv
from responses import get_response

# STEP 0: load our token from somwhere safe
load_dotenv()
TOKEN: Final[str] = os.getenv('DISCORD_TOKEN')
REPLICATE_API_TOKEN: Final[str] = os.getenv('REPLICATE_API_TOKEN')
OPEN_API_TOKEN: Final[str] = os.getenv('OPEN_API_TOKEN')
