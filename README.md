# 🚀 Parcha API Client Libraries

Official client libraries for the [Parcha API](https://docs.parcha.ai) - Your AI-powered compliance and verification platform.

## 📚 Available SDKs

| Language | Status | Package Manager | Documentation |
|----------|---------|-----------------|---------------|
| [Python](/python/parcha-api) | ✅ Stable | [PyPI](https://pypi.org/project/parcha-api) | [Docs](https://docs.parcha.ai) |
| JavaScript/TypeScript | 🚧 Coming Soon | npm | - |
| Java | 🚧 Coming Soon | Maven | - |
| Go | 🚧 Coming Soon | Go Modules | - |

## 🌟 Features

- **KYB (Know Your Business) Verification**
  - Automated business verification
  - Document verification
  - Business registry checks
  - Ultimate Beneficial Owner (UBO) identification

- **KYC (Know Your Customer) Verification**
  - Identity verification
  - Document validation
  - AML screening
  - PEP checks

- **Smart Compliance**
  - AI-powered risk assessment
  - Automated decision making
  - Customizable verification workflows
  - Real-time monitoring

## 🎯 Quick Examples

Check out our [examples directory](/examples) for complete, production-ready code samples:

### Business Verification
- [Flash Check](/examples/flash_check) - Quick business verification
- [Full KYB](/examples/full_kyb) - Complete business verification workflow 🚧 Coming Soon
- [Document Verification](/examples/document_verification) - Business document validation 🚧 Coming Soon
- [Merchant Categorization](/examples/merchant_categorization) - Business activity classification 🚧 Coming Soon

### Customer Verification
- [Identity Verification](/examples/identity_verification) - Basic identity checks 🚧 Coming Soon
- [Enhanced Due Diligence](/examples/enhanced_due_diligence) - Advanced customer screening 🚧 Coming Soon
- [AML Screening](/examples/aml_screening) - Anti-money laundering checks 🚧 Coming Soon

### Integration Examples
- [Webhook Handler](/examples/webhook_handler) - Process verification webhooks 🚧 Coming Soon
- [Slack Integration](/examples/slack_integration) - Get notifications in Slack 🚧 Coming Soon
- [Custom Workflow](/examples/custom_workflow) - Build your verification flow 🚧 Coming Soon

## 🚀 Getting Started

1. Sign up for a [Parcha account](https://app.parcha.ai)
2. Get your API credentials from the dashboard
3. Choose your preferred SDK
4. Follow the SDK-specific installation instructions
5. Try out the examples!

## 📖 Documentation

- [API Guide](https://docs.parcha.ai)
- [API Reference](https://docs.parcha.ai/api-reference/introduction)
- [API Status](https://status.parcha.ai)

## 💡 Example Usage

Here's a quick example using our Python SDK:

```python
from parcha_api import ParchaAPI, KYBAgentJobInput
import structlog
import asyncio

# Configure structured logging
logger = structlog.get_logger()

# Synchronous example
def verify_business_sync():
    try:
        # Initialize the client
        api = ParchaAPI(
            base_url="https://api.parcha.ai",
            token="your_api_token"
        )

        # Create verification input using Pydantic model
        kyb_input = KYBAgentJobInput(
            agent_key="your_agent_key",
            kyb_schema={
              "id": "acme_corp_123",
              "self_attested_data": {
                "business_name": "Acme Corp",
                "registration_number": "12345678",
                "country": "US",
                "website": "https://acme.com"
              }
            },
            webhook_url="https://your-webhook.com/callback",
            run_in_parallel=True  # Optional: Run checks in parallel
        )
        
        # Start verification
        response = api.start_kyb_agent_job(kyb_input)
        logger.info(
            "kyb_verification_started",
            job_id=response["job_id"],
            business_name="Acme Corp"
        )

        # Get results
        job = api.get_job_by_id(
            response["job_id"],
            include_check_results=True
        )
        return job

    except requests.HTTPError as e:
        logger.error(
            "api_request_failed",
            error=str(e),
            status_code=e.response.status_code,
            exc_info=e
        )
        raise
    except Exception as e:
        logger.error(
            "verification_failed",
            error=str(e),
            exc_info=e
        )
        raise

# Asynchronous example
async def verify_business_async():
    try:
        api = ParchaAPI(
            base_url="https://api.parcha.ai",
            token="your_api_token"
        )

        kyb_input = KYBAgentJobInput(
            agent_key="your_agent_key",
            kyb_schema={
                "id": "acme_corp_123",
                "self_attested_data": {
                    "business_name": "Acme Corp",
                    "registration_number": "12345678",
                    "country": "US"
                }
            }
        )
        
        # Start verification asynchronously
        response = await api.start_kyb_agent_job_async(kyb_input)
        logger.info(
            "kyb_verification_started",
            job_id=response["job_id"],
            business_name="Acme Corp"
        )

        # Get results asynchronously
        job = await api.get_job_by_id_async(
            response["job_id"],
            include_check_results=True,
            include_status_messages=True
        )
        return job

    except aiohttp.ClientResponseError as e:
        logger.error(
            "api_request_failed",
            status=e.status,
            message=e.message,
            exc_info=e
        )
        raise
    except Exception as e:
        logger.error(
            "verification_failed",
            error=str(e),
            exc_info=e
        )
        raise

# Run the async example
if __name__ == "__main__":
    result = asyncio.run(verify_business_async())
    print(f"Verification completed with status: {result['status']}")
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 💬 Support

- 📧 Email: support@parcha.ai
- 📚 Documentation: [docs.parcha.ai](https://docs.parcha.ai)
- 💻 Issue Tracker: [GitHub Issues](https://github.com/parcha-ai/parcha-api/issues)
- 💬 Discord: [Join our community](https://discord.gg/parcha)

## 📜 License

This repository and all client libraries are proprietary software belonging to Parcha Labs Inc.
All rights reserved. Use of this software is subject to the terms of your service agreement with Parcha Labs Inc.

For licensing inquiries, please contact founders@parcha.ai. 