import pytest
from src.application.route_compatibility.service import RouteCompatibilityService

class MockPort:
    def __init__(self, name: str, max_draft: float, max_loa: float):
        self.name = name
        self.max_draft = max_draft
        self.max_loa = max_loa

class MockRoute:
    def __init__(self, study_port: MockPort, external_port: MockPort):
        self.study_port = study_port
        self.external_port = external_port

class MockVessel:
    def __init__(self, name: str, draft: float, loa: float):
        self.name = name
        self.draft = draft
        self.loa = loa

def test_route_compatibility_compatible():
    service = RouteCompatibilityService()
    study_port = MockPort("Pelabuhan Jepara", max_draft=12.0, max_loa=220.0)
    external_port = MockPort("Pelabuhan Tanjung Priok", max_draft=14.0, max_loa=300.0)
    route = MockRoute(study_port, external_port)
    
    vessel = MockVessel("MV Nusantara 01", draft=9.5, loa=180.0)
    
    result = service.checkCompatibility(route, vessel)
    assert result.is_compatible is True
    assert len(result.rejection_reasons) == 0
    assert any("Draft OK" in msg for msg in result.validation_messages)
    assert any("LOA OK" in msg for msg in result.validation_messages)

def test_route_compatibility_exceeds_external_port_draft():
    service = RouteCompatibilityService()
    study_port = MockPort("Pelabuhan Jepara", max_draft=15.0, max_loa=250.0)
    external_port = MockPort("Pelabuhan Dangkal", max_draft=7.5, max_loa=200.0)
    route = MockRoute(study_port, external_port)
    
    # Vessel draft 9.0m exceeds External Port max_draft 7.5m
    vessel = MockVessel("MV Deep Draft", draft=9.0, loa=180.0)
    
    result = service.check_compatibility(route, vessel)
    assert result.is_compatible is False
    assert len(result.rejection_reasons) > 0
    assert any("Draft kapal (9.0m) melebihi batas draft External Port" in r for r in result.rejection_reasons)

def test_route_compatibility_exceeds_study_port_loa():
    service = RouteCompatibilityService()
    study_port = MockPort("Pelabuhan Kecil", max_draft=10.0, max_loa=140.0)
    external_port = MockPort("Pelabuhan Besar", max_draft=15.0, max_loa=300.0)
    route = MockRoute(study_port, external_port)
    
    # Vessel LOA 170m exceeds Study Port max_loa 140m
    vessel = MockVessel("MV Large Ship", draft=8.0, loa=170.0)
    
    result = service.check_compatibility(route, vessel)
    assert result.is_compatible is False
    assert any("LOA kapal (170.0m) melebihi batas LOA Study Port" in r for r in result.rejection_reasons)
