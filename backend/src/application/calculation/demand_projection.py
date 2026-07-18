from uuid import UUID
from typing import List
from src.domain.cargo_flow.models import ProjectionResult, ProjectionYearResult

class DemandProjectionService:
    @staticmethod
    def calculate_projection(
        cargo_flow_id: UUID,
        planning_horizon: int,
        start_year: int,
        base_year: int,
        initial_demand: float,
        growth_rate: float,
        maximum_demand: float
    ) -> ProjectionResult:
        projections = []
        current_demand = 0.0

        for t in range(1, planning_horizon + 1):
            calendar_year = base_year + t - 1

            if t < start_year:
                current_demand = 0.0
                trace = f"Tahun ke-{t} ({calendar_year}): Di bawah operation start year ({start_year}). Demand = 0."
            elif t == start_year:
                current_demand = initial_demand
                trace = f"Tahun ke-{t} ({calendar_year}): Operation start year. Demand = base demand ({initial_demand:,.2f})."
            else:
                raw_growth = current_demand * (1.0 + growth_rate)
                if raw_growth > maximum_demand:
                    current_demand = maximum_demand
                    trace = (
                        f"Tahun ke-{t} ({calendar_year}): Demand tumbuh menjadi {raw_growth:,.2f} "
                        f"tetapi melebihi kapasitas maksimum ({maximum_demand:,.2f}). "
                        f"Dibatasi ke {maximum_demand:,.2f}."
                    )
                else:
                    prev_demand = current_demand
                    current_demand = raw_growth
                    trace = (
                        f"Tahun ke-{t} ({calendar_year}): Demand tumbuh dari {prev_demand:,.2f} "
                        f"ke {current_demand:,.2f} (pertumbuhan {growth_rate:.2%})."
                    )

            projections.append(
                ProjectionYearResult(
                    year=t,
                    calendar_year=calendar_year,
                    demand=current_demand,
                    trace=trace
                )
            )

        return ProjectionResult(
            cargo_flow_id=cargo_flow_id,
            planning_horizon=planning_horizon,
            start_year=start_year,
            base_year=base_year,
            initial_demand=initial_demand,
            growth_rate=growth_rate,
            maximum_demand=maximum_demand,
            projections=projections
        )
