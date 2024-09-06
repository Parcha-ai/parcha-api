# Parcha API Client

A Python client for interacting with the Parcha API, providing both synchronous and asynchronous methods for various API endpoints.

## Features

- KYB (Know Your Business) and KYC (Know Your Customer) job management
- Check job execution
- Job retrieval by ID and case ID
- Asynchronous support using `aiohttp`

## Installation

```bash
pip install parcha-api-client  # Note: Package name may differ
```

## Usage

```python
from parcha_api import ParchaAPI, KYBAgentJobInput

# Initialize the client
api = ParchaAPI("https://api.parcha.com", "your_api_token")

# Start a KYB agent job
kyb_input = KYBAgentJobInput(
    agent_key="your_agent_key",
    kyb_schema={"business_name": "Example Corp"}
)
response = api.start_kyb_agent_job(kyb_input)

# Get job by ID
job = api.get_job_by_id("job_id_here")

# Async example
async def fetch_jobs():
    jobs = await api.get_jobs_by_case_id_async("case_id", "agent_key")
    return jobs
```

## Documentation

For detailed information on available methods and models, refer to the docstrings in the source code.

## Requirements

- Python 3.7+
- `requests`
- `aiohttp`
- `pydantic`

## License

This Parcha API Client is proprietary software belonging to Parcha Labs Inc. 
All rights reserved. Use of this software is subject to the terms of your service agreement with Parcha Labs Inc..

For questions about licensing or usage, please contact support@parcha.ai.
