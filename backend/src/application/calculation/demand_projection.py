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

        # Determine target start calendar year whether start_year is provided as a calendar year or relative year index
        if start_year >= base_year:
            target_start_calendar_year = start_year
        else:
            target_start_calendar_year = base_year + max(1, start_year) - 1

        # Normalize growth rate if passed as percentage (e.g., 5.0 -> 0.05)
        rate = growth_rate / 100.0 if growth_rate > 1.0 else growth_rate

        for t in range(1, planning_horizon + 1):
            calendar_year = base_year + t - 1

            if calendar_year < target_start_calendar_year:
                current_demand = 0.0
                trace = f"Tahun ke-{t} ({calendar_year}): Di bawah operation start year ({target_start_calendar_year}). Demand = 0."
            elif calendar_year == target_start_calendar_year:
                current_demand = initial_demand
                trace = f"Tahun ke-{t} ({calendar_year}): Operation start year. Demand = base demand ({initial_demand:,.2f})."
            else:
                raw_growth = current_demand * (1.0 + rate)
                if maximum_demand > 0 and raw_growth > maximum_demand:
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
                        f"ke {current_demand:,.2f} (pertumbuhan {rate:.2%})."
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
