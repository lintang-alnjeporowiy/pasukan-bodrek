import { useState, useCallback } from "react";
import { Commodity, Tenant, CargoFlow, CargoConversionRule, ProjectionResult, ConversionTestResult } from "@/types/cargo";
import { cargoService } from "@/services/cargo.service";
import { conversionService } from "@/services/conversion.service";

export function useCargoManagement(projectId: string, scenarioId: string, triggerToast: (msg: string) => void) {
  const [cargoSubTab, setCargoSubTab] = useState<string>("commodities");

  // Commodities state & handlers
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loadingCommodities, setLoadingCommodities] = useState<boolean>(false);
  const [isCommodityModalOpen, setIsCommodityModalOpen] = useState<boolean>(false);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null);
  const [commName, setCommName] = useState<string>("");
  const [commCode, setCommCode] = useState<string>("");
  const [commUnit, setCommUnit] = useState<string>("Ton");
  const [commDesc, setCommDesc] = useState<string>("");
  const [commActive, setCommActive] = useState<boolean>(true);
  const [commError, setCommError] = useState<string | null>(null);
  const [commSaving, setCommSaving] = useState<boolean>(false);

  // Tenants state & handlers
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState<boolean>(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState<boolean>(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [tenantName, setTenantName] = useState<string>("");
  const [tenantCommodityId, setTenantCommodityId] = useState<string>("");
  const [tenantDesc, setTenantDesc] = useState<string>("");
  const [tenantActive, setTenantActive] = useState<boolean>(true);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [tenantSaving, setTenantSaving] = useState<boolean>(false);

  // Cargo Flows state & handlers
  const [cargoFlows, setCargoFlows] = useState<CargoFlow[]>([]);
  const [loadingCargoFlows, setLoadingCargoFlows] = useState<boolean>(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState<boolean>(false);
  const [editingFlow, setEditingFlow] = useState<CargoFlow | null>(null);
  const [flowDirection, setFlowDirection] = useState<"INBOUND" | "OUTBOUND">("INBOUND");
  const [flowTenantId, setFlowTenantId] = useState<string>("");
  const [flowCommodityId, setFlowCommodityId] = useState<string>("");
  const [flowOrigin, setFlowOrigin] = useState<string>("");
  const [flowDestination, setFlowDestination] = useState<string>("");
  const [flowDemand, setFlowDemand] = useState<string>("");
  const [flowUnit, setFlowUnit] = useState<string>("Ton");
  const [flowStartYear, setFlowStartYear] = useState<string>("2026");
  const [flowGrowthRate, setFlowGrowthRate] = useState<string>("5.0");
  const [flowMaxDemand, setFlowMaxDemand] = useState<string>("0");
  const [flowActive, setFlowActive] = useState<boolean>(true);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [flowSaving, setFlowSaving] = useState<boolean>(false);

  // Demand Projection Modal State
  const [selectedFlowForProjection, setSelectedFlowForProjection] = useState<CargoFlow | null>(null);
  const [projectionResult, setProjectionResult] = useState<ProjectionResult | null>(null);
  const [calculatingProjection, setCalculatingProjection] = useState<boolean>(false);

  // Cargo Conversion Rules state & handlers
  const [conversionRules, setConversionRules] = useState<CargoConversionRule[]>([]);
  const [loadingConversionRules, setLoadingConversionRules] = useState<boolean>(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<CargoConversionRule | null>(null);
  const [ruleCommodityId, setRuleCommodityId] = useState<string>("");
  const [ruleSourceUnit, setRuleSourceUnit] = useState<string>("");
  const [ruleTargetUnit, setRuleTargetUnit] = useState<string>("");
  const [ruleConversionFactor, setRuleConversionFactor] = useState<string>("");
  const [ruleDescription, setRuleDescription] = useState<string>("");
  const [ruleIsActive, setRuleIsActive] = useState<boolean>(true);
  const [ruleError, setRuleError] = useState<string | null>(null);
  const [ruleSaving, setRuleSaving] = useState<boolean>(false);

  // Conversion Testing Playground state
  const [testCommodityId, setTestCommodityId] = useState<string>("");
  const [testSourceValue, setTestSourceValue] = useState<string>("500000");
  const [testSourceUnit, setTestSourceUnit] = useState<string>("Ton");
  const [testTargetUnit, setTestTargetUnit] = useState<string>("TEU");
  const [testingConversion, setTestingConversion] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<ConversionTestResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Fetch functions
  const fetchCommodities = useCallback(async () => {
    try {
      setLoadingCommodities(true);
      const data = await cargoService.getCommodities();
      setCommodities(data);
    } catch {
      // ignore
    } finally {
      setLoadingCommodities(false);
    }
  }, []);

  const fetchTenants = useCallback(async () => {
    try {
      setLoadingTenants(true);
      const data = await cargoService.getTenants(projectId);
      setTenants(data);
    } catch {
      // ignore
    } finally {
      setLoadingTenants(false);
    }
  }, [projectId]);

  const fetchCargoFlows = useCallback(async (dir?: string) => {
    try {
      setLoadingCargoFlows(true);
      const data = await cargoService.getCargoFlows(scenarioId, dir);
      setCargoFlows(data);
    } catch {
      // ignore
    } finally {
      setLoadingCargoFlows(false);
    }
  }, [scenarioId]);

  const fetchConversionRules = useCallback(async () => {
    try {
      setLoadingConversionRules(true);
      const data = await conversionService.getRules();
      setConversionRules(data);
    } catch {
      // ignore
    } finally {
      setLoadingConversionRules(false);
    }
  }, []);

  // Commodity Modal Handlers
  const handleOpenCommodityModal = (c?: Commodity) => {
    if (c) {
      setEditingCommodity(c);
      setCommName(c.name);
      setCommCode(c.code || "");
      setCommUnit(c.unit);
      setCommDesc(c.description || "");
      setCommActive(c.is_active);
    } else {
      setEditingCommodity(null);
      setCommName("");
      setCommCode("");
      setCommUnit("Ton");
      setCommDesc("");
      setCommActive(true);
    }
    setCommError(null);
    setIsCommodityModalOpen(true);
  };

  const handleSaveCommodity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commName.trim() || !commUnit.trim()) return;

    try {
      setCommSaving(true);
      setCommError(null);

      if (editingCommodity) {
        await cargoService.updateCommodity(editingCommodity.id, {
          name: commName.trim(),
          code: commCode.trim() || undefined,
          unit: commUnit.trim(),
          description: commDesc.trim() || undefined,
          is_active: commActive,
        });
        triggerToast("Komoditas berhasil diperbarui!");
      } else {
        await cargoService.createCommodity({
          name: commName.trim(),
          code: commCode.trim() || undefined,
          unit: commUnit.trim(),
          description: commDesc.trim() || undefined,
          is_active: commActive,
        });
        triggerToast("Komoditas baru berhasil ditambahkan!");
      }

      setIsCommodityModalOpen(false);
      await fetchCommodities();
    } catch (err: any) {
      setCommError(err.message || "Gagal menyimpan komoditas.");
    } finally {
      setCommSaving(false);
    }
  };

  const handleDeleteCommodity = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komoditas ini?")) return;
    try {
      await cargoService.deleteCommodity(id);
      triggerToast("Komoditas berhasil dihapus.");
      await fetchCommodities();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus komoditas.");
    }
  };

  // Tenant Modal Handlers
  const handleOpenTenantModal = (t?: Tenant) => {
    if (t) {
      setEditingTenant(t);
      setTenantName(t.name);
      setTenantCommodityId(t.commodity_id || "");
      setTenantDesc(t.description || "");
      setTenantActive(t.is_active);
    } else {
      setEditingTenant(null);
      setTenantName("");
      setTenantCommodityId("");
      setTenantDesc("");
      setTenantActive(true);
    }
    setTenantError(null);
    setIsTenantModalOpen(true);
  };

  const handleSaveTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) return;

    try {
      setTenantSaving(true);
      setTenantError(null);

      if (editingTenant) {
        await cargoService.updateTenant(editingTenant.id, {
          name: tenantName.trim(),
          commodity_id: tenantCommodityId || undefined,
          description: tenantDesc.trim() || undefined,
          is_active: tenantActive,
        });
        triggerToast("Data tenant berhasil diperbarui!");
      } else {
        await cargoService.createTenant({
          project_id: projectId,
          name: tenantName.trim(),
          commodity_id: tenantCommodityId || undefined,
          description: tenantDesc.trim() || undefined,
          is_active: tenantActive,
        });
        triggerToast("Tenant baru berhasil ditambahkan!");
      }

      setIsTenantModalOpen(false);
      await fetchTenants();
    } catch (err: any) {
      setTenantError(err.message || "Gagal menyimpan data tenant.");
    } finally {
      setTenantSaving(false);
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tenant ini?")) return;
    try {
      await cargoService.deleteTenant(id);
      triggerToast("Tenant berhasil dihapus.");
      await fetchTenants();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus tenant.");
    }
  };

  // Cargo Flow Modal Handlers
  const handleOpenFlowModal = (direction: "INBOUND" | "OUTBOUND", flow?: CargoFlow) => {
    setFlowDirection(direction);
    if (flow) {
      setEditingFlow(flow);
      setFlowTenantId(flow.tenant_id);
      setFlowCommodityId(flow.commodity_id);
      setFlowOrigin(flow.origin);
      setFlowDestination(flow.destination_port);
      setFlowDemand(flow.base_annual_demand.toString());
      setFlowUnit(flow.unit);
      setFlowStartYear(flow.start_year.toString());
      setFlowGrowthRate(flow.growth_rate.toString());
      setFlowMaxDemand(flow.maximum_demand.toString());
      setFlowActive(flow.is_active);
    } else {
      setEditingFlow(null);
      setFlowTenantId(tenants[0]?.id || "");
      setFlowCommodityId(commodities[0]?.id || "");
      setFlowOrigin(direction === "OUTBOUND" ? "Terminal Pelabuhan Utama" : "Batam Agro Farm");
      setFlowDestination(direction === "OUTBOUND" ? "Pelabuhan Singapura" : "Dermaga Curah Kering");
      setFlowDemand("100000");
      setFlowUnit(commodities[0]?.unit || "Ton");
      setFlowStartYear("2026");
      setFlowGrowthRate("5.0");
      setFlowMaxDemand("0");
      setFlowActive(true);
    }
    setFlowError(null);
    setIsFlowModalOpen(true);
  };

  const handleSaveFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowTenantId || !flowCommodityId || !flowOrigin.trim() || !flowDestination.trim()) return;

    try {
      setFlowSaving(true);
      setFlowError(null);

      const baseDemandNum = parseFloat(flowDemand) || 0;
      const startYearNum = parseInt(flowStartYear) || 2026;
      const growthRateNum = parseFloat(flowGrowthRate) || 0;
      const maxDemandNum = parseFloat(flowMaxDemand) || 0;

      if (editingFlow) {
        await cargoService.updateCargoFlow(editingFlow.id, {
          tenant_id: flowTenantId,
          commodity_id: flowCommodityId,
          direction: flowDirection,
          origin: flowOrigin.trim(),
          destination_port: flowDestination.trim(),
          base_annual_demand: baseDemandNum,
          unit: flowUnit.trim(),
          start_year: startYearNum,
          growth_rate: growthRateNum,
          maximum_demand: maxDemandNum,
          is_active: flowActive,
        });
        triggerToast(`Alur kargo ${flowDirection.toLowerCase()} berhasil diperbarui!`);
      } else {
        await cargoService.createCargoFlow({
          scenario_id: scenarioId,
          tenant_id: flowTenantId,
          commodity_id: flowCommodityId,
          direction: flowDirection,
          origin: flowOrigin.trim(),
          destination_port: flowDestination.trim(),
          base_annual_demand: baseDemandNum,
          unit: flowUnit.trim(),
          start_year: startYearNum,
          growth_rate: growthRateNum,
          maximum_demand: maxDemandNum,
          is_active: flowActive,
        });
        triggerToast(`Alur kargo ${flowDirection.toLowerCase()} baru berhasil ditambahkan!`);
      }

      setIsFlowModalOpen(false);
      await fetchCargoFlows(flowDirection);
    } catch (err: any) {
      setFlowError(err.message || "Gagal menyimpan alur kargo.");
    } finally {
      setFlowSaving(false);
    }
  };

  const handleDeleteFlow = async (id: string, dir: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus alur kargo ini?")) return;
    try {
      await cargoService.deleteCargoFlow(id);
      triggerToast("Alur kargo berhasil dihapus.");
      await fetchCargoFlows(dir);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus alur kargo.");
    }
  };

  const handleCalculateProjection = async (flow: CargoFlow) => {
    try {
      setSelectedFlowForProjection(flow);
      setProjectionResult(null);
      setCalculatingProjection(true);
      const res = await cargoService.calculateDemandProjection(flow.id);
      setProjectionResult(res);
    } catch (err: any) {
      alert(err.message || "Gagal menghitung proyeksi demand.");
    } finally {
      setCalculatingProjection(false);
    }
  };

  // Conversion Rule Handlers
  const handleOpenRuleModal = (rule?: CargoConversionRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleCommodityId(rule.commodity_id || "");
      setRuleSourceUnit(rule.source_unit);
      setRuleTargetUnit(rule.target_unit);
      setRuleConversionFactor(rule.conversion_factor.toString());
      setRuleDescription(rule.description || "");
      setRuleIsActive(rule.is_active);
    } else {
      setEditingRule(null);
      setRuleCommodityId("");
      setRuleSourceUnit("Ton");
      setRuleTargetUnit("TEU");
      setRuleConversionFactor("0.55");
      setRuleDescription("");
      setRuleIsActive(true);
    }
    setRuleError(null);
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleSourceUnit.trim() || !ruleTargetUnit.trim() || !ruleConversionFactor) return;

    try {
      setRuleSaving(true);
      setRuleError(null);

      const factorNum = parseFloat(ruleConversionFactor);
      if (isNaN(factorNum) || factorNum <= 0) {
        throw new Error("Faktor konversi harus berupa angka positif.");
      }

      if (editingRule) {
        await conversionService.updateRule(editingRule.id, {
          commodity_id: ruleCommodityId || null,
          source_unit: ruleSourceUnit.trim(),
          target_unit: ruleTargetUnit.trim(),
          conversion_factor: factorNum,
          description: ruleDescription.trim() || null,
          is_active: ruleIsActive,
        });
        triggerToast("Cargo Conversion Rule berhasil diperbarui!");
      } else {
        await conversionService.createRule({
          commodity_id: ruleCommodityId || null,
          source_unit: ruleSourceUnit.trim(),
          target_unit: ruleTargetUnit.trim(),
          conversion_factor: factorNum,
          description: ruleDescription.trim() || null,
          is_active: ruleIsActive,
        });
        triggerToast("Cargo Conversion Rule baru berhasil ditambahkan!");
      }

      setIsRuleModalOpen(false);
      await fetchConversionRules();
    } catch (err: any) {
      setRuleError(err.message || "Gagal menyimpan Conversion Rule.");
    } finally {
      setRuleSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Cargo Conversion Rule ini?")) return;
    try {
      await conversionService.deleteRule(id);
      triggerToast("Conversion Rule berhasil dihapus.");
      await fetchConversionRules();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus Conversion Rule.");
    }
  };

  const handleRunConversionTest = async () => {
    if (!testSourceValue || !testSourceUnit.trim() || !testTargetUnit.trim()) return;

    try {
      setTestingConversion(true);
      setTestError(null);
      setTestResult(null);

      const valNum = parseFloat(testSourceValue);
      if (isNaN(valNum)) throw new Error("Nilai asal harus berupa angka valid.");

      const res = await conversionService.runTest({
        source_value: valNum,
        source_unit: testSourceUnit.trim(),
        target_unit: testTargetUnit.trim(),
        commodity_id: testCommodityId || null,
      });

      setTestResult(res);
    } catch (err: any) {
      setTestError(err.message || "Gagal melakukan uji konversi.");
    } finally {
      setTestingConversion(false);
    }
  };

  return {
    cargoSubTab,
    setCargoSubTab,
    // Commodities
    commodities,
    loadingCommodities,
    isCommodityModalOpen,
    editingCommodity,
    commName,
    commCode,
    commUnit,
    commDesc,
    commActive,
    commError,
    commSaving,
    setIsCommodityModalOpen,
    setCommName,
    setCommCode,
    setCommUnit,
    setCommDesc,
    setCommActive,
    fetchCommodities,
    handleOpenCommodityModal,
    handleSaveCommodity,
    handleDeleteCommodity,
    // Tenants
    tenants,
    loadingTenants,
    isTenantModalOpen,
    editingTenant,
    tenantName,
    tenantCommodityId,
    tenantDesc,
    tenantActive,
    tenantError,
    tenantSaving,
    setIsTenantModalOpen,
    setTenantName,
    setTenantCommodityId,
    setTenantDesc,
    setTenantActive,
    fetchTenants,
    handleOpenTenantModal,
    handleSaveTenant,
    handleDeleteTenant,
    // Flows
    cargoFlows,
    loadingCargoFlows,
    isFlowModalOpen,
    editingFlow,
    flowDirection,
    flowTenantId,
    flowCommodityId,
    flowOrigin,
    flowDestination,
    flowDemand,
    flowUnit,
    flowStartYear,
    flowGrowthRate,
    flowMaxDemand,
    flowActive,
    flowError,
    flowSaving,
    selectedFlowForProjection,
    projectionResult,
    calculatingProjection,
    setIsFlowModalOpen,
    setFlowTenantId,
    setFlowCommodityId,
    setFlowOrigin,
    setFlowDestination,
    setFlowDemand,
    setFlowUnit,
    setFlowStartYear,
    setFlowGrowthRate,
    setFlowMaxDemand,
    setFlowActive,
    setSelectedFlowForProjection,
    fetchCargoFlows,
    handleOpenFlowModal,
    handleSaveFlow,
    handleDeleteFlow,
    handleCalculateProjection,
    // Conversion Rules
    conversionRules,
    loadingConversionRules,
    isRuleModalOpen,
    editingRule,
    ruleCommodityId,
    ruleSourceUnit,
    ruleTargetUnit,
    ruleConversionFactor,
    ruleDescription,
    ruleIsActive,
    ruleError,
    ruleSaving,
    setIsRuleModalOpen,
    setRuleCommodityId,
    setRuleSourceUnit,
    setRuleTargetUnit,
    setRuleConversionFactor,
    setRuleDescription,
    setRuleIsActive,
    fetchConversionRules,
    handleOpenRuleModal,
    handleSaveRule,
    handleDeleteRule,
    // Conversion Playground
    testCommodityId,
    testSourceValue,
    testSourceUnit,
    testTargetUnit,
    testingConversion,
    testResult,
    testError,
    setTestCommodityId,
    setTestSourceValue,
    setTestSourceUnit,
    setTestTargetUnit,
    handleRunConversionTest,
  };
}
