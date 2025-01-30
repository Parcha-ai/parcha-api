#!/usr/bin/env python3
"""
Flash Check Example

This script demonstrates how to perform a quick business verification using the Parcha API.
It shows proper error handling, logging, and both synchronous and asynchronous usage.
"""

import os
import sys
import asyncio
import structlog
from typing import Optional
from parcha_api import ParchaAPI, KYBAgentJobInput

# Configure structured logging
structlog.configure(processors=[structlog.processors.TimeStamper(fmt="iso"), structlog.processors.JSONRenderer()])
logger = structlog.get_logger()

# Load configuration
API_TOKEN = os.getenv("PARCHA_API_TOKEN")
AGENT_KEY = os.getenv("PARCHA_AGENT_KEY")
API_BASE_URL = os.getenv("PARCHA_API_URL", "https://api.parcha.ai")


class FlashCheckError(Exception):
    """Custom exception for flash check errors."""

    pass


async def run_flash_check(
    business_name: str,
    country_code: str,
    website: Optional[str] = None,
    registration_number: Optional[str] = None,
    webhook_url: Optional[str] = None,
) -> dict:
    """
    Run a flash check on a business entity.

    Args:
        business_name: Name of the business to verify
        country_code: Two-letter country code (ISO 3166-1 alpha-2)
        website: Optional business website
        registration_number: Optional business registration number
        webhook_url: Optional webhook URL for status updates

    Returns:
        dict: The verification result

    Raises:
        FlashCheckError: If the verification fails
    """
    try:
        # Initialize API client
        api = ParchaAPI(base_url=API_BASE_URL, token=API_TOKEN)

        # Prepare verification input
        kyb_schema = {
            "business_name": business_name,
            "country": country_code,
        }

        if website:
            kyb_schema["website"] = website
        if registration_number:
            kyb_schema["registration_number"] = registration_number

        kyb_input = KYBAgentJobInput(
            agent_key=AGENT_KEY,
            kyb_schema=kyb_schema,
            webhook_url=webhook_url,
            run_in_parallel=True,  # Flash checks are quick, run in parallel
        )

        # Start verification
        logger.info("starting_flash_check", business_name=business_name, country=country_code)

        # Start the job
        response = await api.start_kyb_agent_job_async(kyb_input)
        job_id = response["job_id"]

        logger.info("flash_check_started", job_id=job_id, business_name=business_name)

        # If no webhook, poll for results
        if not webhook_url:
            # Poll for results with exponential backoff
            max_attempts = 5
            for attempt in range(max_attempts):
                job = await api.get_job_by_id_async(job_id, include_check_results=True, include_status_messages=True)

                if job["status"] in ["completed", "failed"]:
                    logger.info("flash_check_completed", job_id=job_id, status=job["status"])
                    return job

                # Wait with exponential backoff
                await asyncio.sleep(2**attempt)

            raise FlashCheckError("Verification timed out")

        return {"job_id": job_id, "status": "pending"}

    except Exception as e:
        logger.error("flash_check_failed", error=str(e), business_name=business_name, exc_info=e)
        raise FlashCheckError(f"Flash check failed: {str(e)}") from e


def main():
    """Main function to run the flash check example."""
    if len(sys.argv) < 3:
        print("Usage: python flash_check.py <business_name> <country_code> [website] [registration_number]")
        sys.exit(1)

    business_name = sys.argv[1]
    country_code = sys.argv[2]
    website = sys.argv[3] if len(sys.argv) > 3 else None
    registration_number = sys.argv[4] if len(sys.argv) > 4 else None

    # Check required environment variables
    if not API_TOKEN or not AGENT_KEY:
        print("Error: PARCHA_API_TOKEN and PARCHA_AGENT_KEY environment variables are required")
        sys.exit(1)

    try:
        # Run the flash check
        result = asyncio.run(
            run_flash_check(
                business_name=business_name,
                country_code=country_code,
                website=website,
                registration_number=registration_number,
            )
        )

        # Print results
        print("\nFlash Check Results:")
        print(f"Job ID: {result['job_id']}")
        print(f"Status: {result['status']}")

        if result.get("check_results"):
            print("\nCheck Results:")
            for check in result["check_results"]:
                print(f"- {check['check_id']}: {check['status']}")

    except FlashCheckError as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
