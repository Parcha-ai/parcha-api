# Flash Check Example

This example demonstrates how to perform a quick business verification using the Parcha API. A flash check is a lightweight verification that provides basic information about a business entity.

## Prerequisites

- Python 3.8+
- Parcha API credentials
- `parcha-api` package installed
- `structlog` for logging

## Installation

```bash
pip install parcha-api structlog
```

## Usage

1. Set your API credentials in `config.py` or use environment variables:

```python
# config.py
API_TOKEN = "your_api_token"
AGENT_KEY = "your_agent_key"
```

2. Run the example:

```bash
python flash_check.py "Acme Corp" "US"
```

## Code Explanation

The example demonstrates:
- Proper error handling
- Structured logging
- Webhook configuration
- Async operation support
- Result processing

Check `flash_check.py` for the implementation details.
