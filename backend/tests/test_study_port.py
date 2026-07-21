import pytest
from uuid import uuid4
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_project_with_inline_study_port():
    """Test creating a project with a new Study Port inline."""
    project_data = {
        "name": "Project Pelabuhan Tanjung Priok",
        "description": "Studi perencanaan alur perairan dan terminal Tanjung Priok",
        "location": "Jakarta Utara",
        "base_year": 2026,
        "planning_horizon": 25,
        "study_port": {
            "name": "Pelabuhan Utama Tanjung Priok",
            "code": "IDTPP",
            "location": "Tanjung Priok, Jakarta Utara",
            "latitude": -6.101,
            "longitude": 106.882,
            "description": "Hub pelabuhan utama peti kemas"
        }
    }
    
    response = client.post("/projects", json=project_data)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["name"] == project_data["name"]
    assert res_data["study_port"] is not None
    assert res_data["study_port"]["name"] == "Pelabuhan Utama Tanjung Priok"
    assert res_data["study_port"]["code"] == "IDTPP"
    assert res_data["study_port"]["latitude"] == -6.101
    assert res_data["study_port"]["longitude"] == 106.882
    
    project_id = res_data["id"]

    # Retrieve Study Port directly via API
    port_res = client.get(f"/projects/{project_id}/study-port")
    assert port_res.status_code == 200
    port_data = port_res.json()
    assert port_data["project_id"] == project_id
    assert port_data["name"] == "Pelabuhan Utama Tanjung Priok"

def test_study_port_1to1_constraint():
    """Test that a project cannot have more than 1 Study Port."""
    # 1. Create a project without study port
    project_res = client.post("/projects", json={
        "name": "Project Pelabuhan Patimban",
        "base_year": 2026,
        "planning_horizon": 20
    })
    assert project_res.status_code == 201
    project_id = project_res.json()["id"]

    # 2. Add first Study Port
    port_payload = {
        "name": "Pelabuhan Patimban",
        "code": "IDPAT",
        "location": "Subang, Jawa Barat",
        "latitude": -6.230,
        "longitude": 107.900,
        "description": "Pelabuhan ekspor kendaraan dan peti kemas"
    }
    res1 = client.post(f"/projects/{project_id}/study-port", json=port_payload)
    assert res1.status_code == 201

    # 3. Attempting to add a second Study Port to the same project should fail (HTTP 400)
    res2 = client.post(f"/projects/{project_id}/study-port", json=port_payload)
    assert res2.status_code == 400
    assert "Setiap proyek hanya boleh memiliki 1 Study Port" in res2.json()["detail"]

def test_update_study_port():
    """Test updating an existing Study Port."""
    project_res = client.post("/projects", json={
        "name": "Project Pelabuhan Teluk Bayur",
        "base_year": 2026,
        "planning_horizon": 15,
        "study_port": {
            "name": "Pelabuhan Teluk Bayur",
            "location": "Padang, Sumatera Barat",
            "latitude": -0.990,
            "longitude": 100.370
        }
    })
    assert project_res.status_code == 201
    project_id = project_res.json()["id"]

    # Update Study Port coordinates and details
    update_payload = {
        "name": "Pelabuhan Teluk Bayur Modernized",
        "code": "IDTBY",
        "latitude": -0.995,
        "longitude": 100.375
    }
    put_res = client.put(f"/projects/{project_id}/study-port", json=update_payload)
    assert put_res.status_code == 200
    updated_data = put_res.json()
    assert updated_data["name"] == "Pelabuhan Teluk Bayur Modernized"
    assert updated_data["code"] == "IDTBY"
    assert updated_data["latitude"] == -0.995
    assert updated_data["longitude"] == 100.375

def test_copy_study_port_from_project():
    """Test copying Study Port from an existing project."""
    # Create Source Project
    src_res = client.post("/projects", json={
        "name": "Project Source Pelabuhan Kijing",
        "base_year": 2026,
        "planning_horizon": 20,
        "study_port": {
            "name": "Pelabuhan Terminal Kijing",
            "code": "IDKIJ",
            "location": "Mempawah, Kalimantan Barat",
            "latitude": 0.450,
            "longitude": 108.920,
            "description": "Terminal multipurpose Kalimantan"
        }
    })
    assert src_res.status_code == 201
    source_project_id = src_res.json()["id"]

    # Create Target Project copying Study Port
    target_res = client.post("/projects", json={
        "name": "Project Target Salinan Kijing",
        "base_year": 2026,
        "planning_horizon": 20,
        "copy_study_port_from_project_id": source_project_id
    })
    assert target_res.status_code == 201
    target_data = target_res.json()
    assert target_data["study_port"] is not None
    assert target_data["study_port"]["name"] == "Pelabuhan Terminal Kijing"
    assert target_data["study_port"]["code"] == "IDKIJ"

def test_study_port_coordinate_validation():
    """Test coordinate range validation bounds (-90..90 for lat, -180..180 for long)."""
    invalid_lat_payload = {
        "name": "Pelabuhan Invalid Lat",
        "location": "Unknown",
        "latitude": 150.0, # Invalid > 90
        "longitude": 106.0
    }
    project_res = client.post("/projects", json={
        "name": "Project Invalid Lat",
        "base_year": 2026,
        "planning_horizon": 10
    })
    project_id = project_res.json()["id"]
    
    res = client.post(f"/projects/{project_id}/study-port", json=invalid_lat_payload)
    assert res.status_code == 422
