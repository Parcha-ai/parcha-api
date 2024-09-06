import os
from parcha_api import ParchaAPI
from parcha_api.models import KYBAgentJobInput

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Use environment variables for sensitive information
API_URL = os.getenv("PARCHA_BASE_URL", "https://us1.parcha.ai")
API_TOKEN = os.getenv("PARCHA_API_KEY")
AGENT_KEY = os.getenv("PARCHA_AGENT_KEY")

# Ensure the API token is set
if not API_TOKEN or not API_URL or not AGENT_KEY:
    raise ValueError("Please set the PARCHA_API_TOKEN, PARCHA_BASE_URL, and PARCHA_AGENT_KEY environment variables")

# Initialize the Parcha API client
parcha_client = ParchaAPI(API_URL, API_TOKEN)

# Define the KYB input data
kyb_input = KYBAgentJobInput(
    agent_key=AGENT_KEY,
    kyb_schema={"id": "parcha", "self_attested_data": {"website": "https://www.parcha.com"}},
    run_in_parallel=True,
)

# Start the KYB agent job
try:
    response = parcha_client.start_kyb_agent_job(kyb_input)
    print(f"KYB agent job started successfully!")
    print(f"Job ID: {response['job_id']}")
    print(f"Status: {response['status']}")
except Exception as e:
    raise Exception(f"An error occurred while starting the KYB agent job: {str(e)}")

# Poll for job status every 5 seconds until it's complete
import time

job_id = response["job_id"]
while True:
    job_details = parcha_client.get_job_by_id(job_id, include_check_results=True)
    print(f"Job Status: {job_details['status']}")

    if job_details["status"] == "complete":
        print("Job completed!")
        print(f"Final Job Details: {job_details}")
        break
    else:
        check_results = job_details["check_results"]

        for check_result in check_results:
            print(f"Check ID: {check_result['command_id']}")
            print(f"Status: {check_result['status']}")
            print(f"Last Status Message: {check_result['status_messages'][-1].get('content', {}).get('status', '...')}")

    time.sleep(5)
