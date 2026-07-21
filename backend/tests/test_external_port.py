import pytest
from uuid import uuid4
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_and_get_external_port():
    """Test creating an external port and retrieving it by ID."""
    payload = {
        "name": "Pelabuhan Singapore",
        "country": "Singapore",
        "latitude": 1.290,
        "longitude": 103.850,
        "max_draft": 16.0,
        "max_loa": 400.0,
        "cargo_productivity": 120.0,
        "productivity_unit": "TEU/hour",
        "additional_port_time": 4.0,
        "description": "Hub transhipment internasional utama",
        "is_active": True
    }
    
    response = client.post("/external-ports", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["country"] == payload["country"]
    assert data["max_draft"] == 16.0
    assert data["max_loa"] == 400.0
    
    port_id = data["id"]
    get_res = client.get(f"/external-ports/{port_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == port_id

def test_list_external_ports_active_filter():
    """Test listing external ports with active_only query parameter."""
    active_payload = {
        "name": "Pelabuhan Active Tanjung Perak",
        "country": "Indonesia",
        "latitude": -7.195,
        "longitude": 112.730,
        "max_draft": 12.0,
        "max_loa": 250.0,
        "is_active": True
    }
    inactive_payload = {
        "name": "Pelabuhan Inactive Old Dock",
        "country": "Indonesia",
        "latitude": -6.000,
        "longitude": 106.000,
        "max_draft": 6.0,
        "max_loa": 100.0,
        "is_active": False
    }
    
    res1 = client.post("/external-ports", json=active_payload)
    res2 = client.post("/external-ports", json=inactive_payload)
    assert res1.status_code == 201
    assert res2.status_code == 201

    all_ports = client.get("/external-ports").json()
    assert len(all_ports) >= 2

    active_ports = client.get("/external-ports?active_only=true").json()
    assert all(p["is_active"] is True for p in active_ports)
    assert any(p["name"] == "Pelabuhan Active Tanjung Perak" for p in active_ports)
    assert not any(p["name"] == "Pelabuhan Inactive Old Dock" for p in active_ports)

def test_update_external_port():
    """Test updating external port physical constraints and details."""
    payload = {
        "name": "Pelabuhan Shanghai Original",
        "country": "China",
        "latitude": 31.230,
        "longitude": 121.470,
        "max_draft": 15.0,
        "max_loa": 350.0,
    }
    create_res = client.post("/external-ports", json=payload)
    assert create_res.status_code == 201
    port_id = create_res.json()["id"]

    update_payload = {
        "name": "Pelabuhan Shanghai Yangshan Deepwater",
        "max_draft": 17.5,
        "max_loa": 420.0,
        "cargo_productivity": 150.0
    }
    put_res = client.put(f"/external-ports/{port_id}", json=update_payload)
    assert put_res.status_code == 200
    updated_data = put_res.json()
    assert updated_data["name"] == "Pelabuhan Shanghai Yangshan Deepwater"
    assert updated_data["max_draft"] == 17.5
    assert updated_data["max_loa"] == 420.0
    assert updated_data["cargo_productivity"] == 150.0

def test_delete_external_port():
    """Test deleting an external port."""
    payload = {
        "name": "Pelabuhan Temporary Delete",
        "country": "Test",
        "latitude": 0.0,
        "longitude": 0.0,
        "max_draft": 10.0,
        "max_loa": 200.0,
    }
    create_res = client.post("/external-ports", json=payload)
    port_id = create_res.json()["id"]

    del_res = client.delete(f"/external-ports/{port_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/external-ports/{port_id}")
    assert get_res.status_code == 404

def test_external_port_validation():
    """Test field range and constraint validations."""
    # Invalid max_draft (<= 0)
    invalid_draft = {
        "name": "Pelabuhan Invalid Draft",
        "country": "Test",
        "latitude": 0.0,
        "longitude": 0.0,
        "max_draft": 0.0,
        "max_loa": 100.0
    }
    res1 = client.post("/external-ports", json=invalid_draft)
    assert res1.status_code == 422

    # Invalid latitude (> 90)
    invalid_lat = {
        "name": "Pelabuhan Invalid Lat",
        "country": "Test",
        "latitude": 95.0,
        "longitude": 0.0,
        "max_draft": 10.0,
        "max_loa": 100.0
    }
    res2 = client.post("/external-ports", json=invalid_lat)
    assert res2.status_code == 422
