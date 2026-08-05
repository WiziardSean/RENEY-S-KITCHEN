import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from the .env file in the backend root directory
# We look for the .env file either in the app's parent folder or locally.
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

supabase_url: str = os.environ.get("SUPABASE_URL", "")
supabase_key: str = os.environ.get("SUPABASE_KEY", "")

if not supabase_url or not supabase_key:
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.")

# Create the Supabase client connection instance
supabase: Client = create_client(supabase_url, supabase_key)
