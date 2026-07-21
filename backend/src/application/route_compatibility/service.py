from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict

class RouteCompatibilityResult(BaseModel):
    is_compatible: bool
    validation_messages: List[str]
    rejection_reasons: List[str]

    model_config = ConfigDict(from_attributes=True)

class RouteCompatibilityService:
    @staticmethod
    def _get_attr(obj: Any, key: str, default: Any = None) -> Any:
        if isinstance(obj, dict):
            return obj.get(key, default)
        return getattr(obj, key, default)

    def check_compatibility(self, route: Any, vessel: Any) -> RouteCompatibilityResult:
        """Determines whether a vessel can operate on a cargo route based on Study Port and External Port limits."""
        validation_messages: List[str] = []
        rejection_reasons: List[str] = []
        is_compatible = True

        vessel_draft = self._get_attr(vessel, "draft", 0.0)
        vessel_loa = self._get_attr(vessel, "loa", 0.0)
        vessel_name = self._get_attr(vessel, "name", "Kapal")

        # Extract Study Port and External Port
        study_port = self._get_attr(route, "study_port")
        external_port = self._get_attr(route, "external_port")

        # 1. Study Port Compatibility Checks
        if study_port:
            sp_name = self._get_attr(study_port, "name", "Study Port")
            sp_max_draft = self._get_attr(study_port, "max_draft")
            sp_max_loa = self._get_attr(study_port, "max_loa")

            if sp_max_draft is not None and sp_max_draft > 0:
                if vessel_draft > sp_max_draft:
                    is_compatible = False
                    rejection_reasons.append(
                        f"Draft kapal ({vessel_draft}m) melebihi batas masukan Study Port '{sp_name}' ({sp_max_draft}m)."
                    )
                else:
                    validation_messages.append(
                        f"Study Port '{sp_name}' Draft OK: {vessel_draft}m <= {sp_max_draft}m."
                    )

            if sp_max_loa is not None and sp_max_loa > 0:
                if vessel_loa > sp_max_loa:
                    is_compatible = False
                    rejection_reasons.append(
                        f"LOA kapal ({vessel_loa}m) melebihi batas LOA Study Port '{sp_name}' ({sp_max_loa}m)."
                    )
                else:
                    validation_messages.append(
                        f"Study Port '{sp_name}' LOA OK: {vessel_loa}m <= {sp_max_loa}m."
                    )

        # 2. External Port Compatibility Checks
        if external_port:
            ep_name = self._get_attr(external_port, "name", "External Port")
            ep_max_draft = self._get_attr(external_port, "max_draft")
            ep_max_loa = self._get_attr(external_port, "max_loa")

            if ep_max_draft is not None and ep_max_draft > 0:
                if vessel_draft > ep_max_draft:
                    is_compatible = False
                    rejection_reasons.append(
                        f"Draft kapal ({vessel_draft}m) melebihi batas draft External Port '{ep_name}' ({ep_max_draft}m)."
                    )
                else:
                    validation_messages.append(
                        f"External Port '{ep_name}' Draft OK: {vessel_draft}m <= {ep_max_draft}m."
                    )

            if ep_max_loa is not None and ep_max_loa > 0:
                if vessel_loa > ep_max_loa:
                    is_compatible = False
                    rejection_reasons.append(
                        f"LOA kapal ({vessel_loa}m) melebihi batas LOA External Port '{ep_name}' ({ep_max_loa}m)."
                    )
                else:
                    validation_messages.append(
                        f"External Port '{ep_name}' LOA OK: {vessel_loa}m <= {ep_max_loa}m."
                    )

        if is_compatible:
            validation_messages.append(
                f"Kapal '{vessel_name}' kompatibel untuk beroperasi pada rute pelabuhan."
            )

        return RouteCompatibilityResult(
            is_compatible=is_compatible,
            validation_messages=validation_messages,
            rejection_reasons=rejection_reasons,
        )

    # CamelCase alias method for spec compliance
    def checkCompatibility(self, route: Any, vessel: Any) -> RouteCompatibilityResult:
        return self.check_compatibility(route, vessel)
