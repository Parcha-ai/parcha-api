import pytest
import requests
import aiohttp
from unittest.mock import patch, MagicMock
from parcha_api.api import ParchaAPI
from parcha_api.models import KYBAgentJobInput, KYCAgentJobInput, CheckJobInput, JobResponse


@pytest.fixture
def api_client():
    return ParchaAPI("https://api.parcha.com", "test_token")


@pytest.mark.asyncio
async def test_start_kyb_agent_job(api_client):
    with patch.object(api_client, "_make_request") as mock_request:
        mock_request.return_value = {"job_id": "test_job_id", "status": "started"}

        input_data = KYBAgentJobInput(agent_key="test_agent", kyb_schema={"business_name": "Test Corp"})
        response = api_client.start_kyb_agent_job(input_data)

        assert response["job_id"] == "test_job_id"
        assert response["status"] == "started"
        mock_request.assert_called_once_with("POST", "/startKYBAgentJob", data=input_data.model_dump())


@pytest.mark.asyncio
async def test_start_kyc_agent_job_async(api_client):
    with patch.object(api_client, "_make_async_request") as mock_request:
        mock_request.return_value = {"job_id": "test_job_id", "status": "started"}

        input_data = KYCAgentJobInput(agent_key="test_agent", kyc_schema={"first_name": "John", "last_name": "Doe"})
        response = await api_client.start_kyc_agent_job_async(input_data)

        assert response["job_id"] == "test_job_id"
        assert response["status"] == "started"
        mock_request.assert_called_once_with("POST", "/startKYCAgentJob", data=input_data.model_dump())


def test_run_check(api_client):
    with patch.object(api_client, "_make_request") as mock_request:
        mock_request.return_value = JobResponse(job_id="test_job_id", status="running")

        input_data = CheckJobInput(
            check_id="test_check", agent_key="test_agent", kyb_schema={"business_name": "Test Corp"}
        )
        response = api_client.run_check(input_data)

        assert response.job_id == "test_job_id"
        assert response.status == "running"
        mock_request.assert_called_once_with("POST", "/runCheck", data=input_data.model_dump())


def test_get_job_by_id(api_client):
    with patch.object(api_client, "_make_request") as mock_request:
        mock_request.return_value = JobResponse(job_id="test_job_id", status="completed")

        response = api_client.get_job_by_id("test_job_id")

        assert response.job_id == "test_job_id"
        assert response.status == "completed"
        mock_request.assert_called_once_with(
            "GET",
            "/getJobById",
            params={
                "job_id": "test_job_id",
                "include_check_result_ids": False,
                "include_check_results": False,
                "include_status_messages": False,
            },
        )


@pytest.mark.asyncio
async def test_get_jobs_by_case_id_async(api_client):
    with patch.object(api_client, "_make_async_request") as mock_request:
        mock_request.return_value = [{"job_id": "job1", "status": "completed"}, {"job_id": "job2", "status": "running"}]

        response = await api_client.get_jobs_by_case_id_async("test_case", "parcha-v0")

        assert len(response) == 2
        assert response[0]["job_id"] == "job1"
        assert response[1]["status"] == "running"
        mock_request.assert_called_once_with(
            "GET",
            "/getJobsByCaseId",
            params={
                "case_id": "test_case",
                "agent_key": "parcha-v0",
                "include_check_results": False,
                "include_status_messages": False,
            },
        )


def test_api_error_handling(api_client):
    with patch.object(api_client, "_make_request") as mock_request:
        mock_request.side_effect = requests.HTTPError("API Error")

        with pytest.raises(requests.HTTPError):
            api_client.get_job_by_id("non_existent_job")


@pytest.mark.asyncio
async def test_async_api_error_handling(api_client):
    with patch.object(api_client, "_make_async_request") as mock_request:
        mock_request.side_effect = aiohttp.ClientResponseError(
            request_info=MagicMock(), history=(), status=404, message="Not Found"
        )

        with pytest.raises(aiohttp.ClientResponseError):
            await api_client.get_jobs_by_case_id_async("non_existent_case", "parcha-v0")
