import React, { useEffect } from "react";
import { CargoSubNav } from "@/components/cargo/CargoSubNav";
import { CommodityTable } from "@/components/cargo/CommodityTable";
import { TenantTable } from "@/components/cargo/TenantTable";
import { CargoFlowTable } from "@/components/cargo/CargoFlowTable";
import { ConversionRuleTable } from "@/components/cargo/ConversionRuleTable";
import { ConversionPlayground } from "@/components/cargo/ConversionPlayground";
import { CommodityModal } from "@/components/dialogs/CommodityModal";
import { TenantModal } from "@/components/dialogs/TenantModal";
import { CargoFlowModal } from "@/components/dialogs/CargoFlowModal";
import { DemandProjectionModal } from "@/components/dialogs/DemandProjectionModal";
import { ConversionRuleModal } from "@/components/dialogs/ConversionRuleModal";
import { useCargoManagement } from "@/hooks/useCargoManagement";

interface CargoTabProps {
  projectId: string;
  scenarioId: string;
  triggerToast: (msg: string) => void;
}

export const CargoTab: React.FC<CargoTabProps> = ({
  projectId,
  scenarioId,
  triggerToast,
}) => {
  const cargo = useCargoManagement(projectId, scenarioId, triggerToast);

  const subTabs = [
    { id: "commodities", label: "Master Commodities", description: "Katalog jenis komoditas kargo", status: "Done" },
    { id: "tenants", label: "Tenants Master", description: "Daftar tenant pelabuhan pengirim/penerima", status: "Done" },

    { id: "inbound", label: "Inbound Cargo Flow", description: "Alur kargo masuk dari hinterland", status: "Done" },
    { id: "outbound", label: "Outbound Cargo Flow", description: "Alur kargo keluar ke destinasi", status: "Done" },
    { id: "conversion", label: "Conversion Rules", description: "Aturan konversi satuan kargo & live playground", status: "Done" },
  ];

  // Fetch initial data based on subtab
  useEffect(() => {
    if (cargo.cargoSubTab === "commodities") {
      cargo.fetchCommodities();
    } else if (cargo.cargoSubTab === "tenants") {
      cargo.fetchTenants();
      cargo.fetchCommodities();
    } else if (cargo.cargoSubTab === "inbound") {
      cargo.fetchCargoFlows("INBOUND");
      cargo.fetchTenants();
      cargo.fetchCommodities();
    } else if (cargo.cargoSubTab === "outbound") {
      cargo.fetchCargoFlows("OUTBOUND");
      cargo.fetchTenants();
      cargo.fetchCommodities();
    } else if (cargo.cargoSubTab === "conversion") {
      cargo.fetchConversionRules();
      cargo.fetchCommodities();
    }
  }, [cargo.cargoSubTab, cargo.fetchCommodities, cargo.fetchTenants, cargo.fetchCargoFlows, cargo.fetchConversionRules]);

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Sub navigation bar */}
      <CargoSubNav
        subTabs={subTabs}
        activeSubTab={cargo.cargoSubTab}
        onSelectSubTab={(id) => cargo.setCargoSubTab(id)}
      />

      {/* Subtab content */}
      {cargo.cargoSubTab === "commodities" ? (
        <CommodityTable
          commodities={cargo.commodities}
          loading={cargo.loadingCommodities}
          onAdd={() => cargo.handleOpenCommodityModal()}
          onEdit={(c) => cargo.handleOpenCommodityModal(c)}
          onDelete={(id) => cargo.handleDeleteCommodity(id)}
        />
      ) : cargo.cargoSubTab === "tenants" ? (
        <TenantTable
          tenants={cargo.tenants}
          loading={cargo.loadingTenants}
          onAdd={() => cargo.handleOpenTenantModal()}
          onEdit={(t) => cargo.handleOpenTenantModal(t)}
          onDelete={(id) => cargo.handleDeleteTenant(id)}
        />
      ) : cargo.cargoSubTab === "inbound" || cargo.cargoSubTab === "outbound" ? (
        <CargoFlowTable
          direction={cargo.cargoSubTab === "outbound" ? "OUTBOUND" : "INBOUND"}
          flows={cargo.cargoFlows}
          loading={cargo.loadingCargoFlows}
          onAdd={() => cargo.handleOpenFlowModal(cargo.cargoSubTab === "outbound" ? "OUTBOUND" : "INBOUND")}
          onEdit={(f) => cargo.handleOpenFlowModal(cargo.cargoSubTab === "outbound" ? "OUTBOUND" : "INBOUND", f)}
          onDelete={(id) => cargo.handleDeleteFlow(id, cargo.cargoSubTab.toUpperCase())}
          onCalculateProjection={(f) => cargo.handleCalculateProjection(f)}
        />
      ) : cargo.cargoSubTab === "conversion" ? (
        <div className="space-y-8 flex-1 flex flex-col">
          <ConversionRuleTable
            rules={cargo.conversionRules}
            loading={cargo.loadingConversionRules}
            onAdd={() => cargo.handleOpenRuleModal()}
            onEdit={(r) => cargo.handleOpenRuleModal(r)}
            onDelete={(id) => cargo.handleDeleteRule(id)}
          />

          <ConversionPlayground
            commodities={cargo.commodities}
            testCommodityId={cargo.testCommodityId}
            testSourceValue={cargo.testSourceValue}
            testSourceUnit={cargo.testSourceUnit}
            testTargetUnit={cargo.testTargetUnit}
            testingConversion={cargo.testingConversion}
            testResult={cargo.testResult}
            testError={cargo.testError}
            setTestCommodityId={cargo.setTestCommodityId}
            setTestSourceValue={cargo.setTestSourceValue}
            setTestSourceUnit={cargo.setTestSourceUnit}
            setTestTargetUnit={cargo.setTestTargetUnit}
            onRunTest={cargo.handleRunConversionTest}
          />
        </div>
      ) : null}

      {/* Modals */}
      <CommodityModal
        isOpen={cargo.isCommodityModalOpen}
        editingCommodity={cargo.editingCommodity}
        name={cargo.commName}
        code={cargo.commCode}
        unit={cargo.commUnit}
        description={cargo.commDesc}
        isActive={cargo.commActive}
        error={cargo.commError}
        saving={cargo.commSaving}
        onClose={() => cargo.setIsCommodityModalOpen(false)}
        setName={cargo.setCommName}
        setCode={cargo.setCommCode}
        setUnit={cargo.setCommUnit}
        setDescription={cargo.setCommDesc}
        setIsActive={cargo.setCommActive}
        onSave={cargo.handleSaveCommodity}
      />

      <TenantModal
        isOpen={cargo.isTenantModalOpen}
        editingTenant={cargo.editingTenant}
        name={cargo.tenantName}
        commodityId={cargo.tenantCommodityId}
        description={cargo.tenantDesc}
        isActive={cargo.tenantActive}
        error={cargo.tenantError}
        saving={cargo.tenantSaving}
        commodities={cargo.commodities}
        onClose={() => cargo.setIsTenantModalOpen(false)}
        setName={cargo.setTenantName}
        setCommodityId={cargo.setTenantCommodityId}
        setDescription={cargo.setTenantDesc}
        setIsActive={cargo.setTenantActive}
        onSave={cargo.handleSaveTenant}
      />

      <CargoFlowModal
        isOpen={cargo.isFlowModalOpen}
        editingFlow={cargo.editingFlow}
        direction={cargo.flowDirection}
        tenantId={cargo.flowTenantId}
        commodityId={cargo.flowCommodityId}
        routeId={cargo.flowRouteId}
        origin={cargo.flowOrigin}
        destination={cargo.flowDestination}
        demand={cargo.flowDemand}
        unit={cargo.flowUnit}
        startYear={cargo.flowStartYear}
        growthRate={cargo.flowGrowthRate}
        maxDemand={cargo.flowMaxDemand}
        isActive={cargo.flowActive}
        error={cargo.flowError}
        saving={cargo.flowSaving}
        tenants={cargo.tenants}
        commodities={cargo.commodities}
        routes={cargo.routes}
        onClose={() => cargo.setIsFlowModalOpen(false)}
        setTenantId={cargo.setFlowTenantId}
        setCommodityId={cargo.setFlowCommodityId}
        setRouteId={cargo.setFlowRouteId}
        setOrigin={cargo.setFlowOrigin}
        setDestination={cargo.setFlowDestination}
        setDemand={cargo.setFlowDemand}
        setUnit={cargo.setFlowUnit}
        setStartYear={cargo.setFlowStartYear}
        setGrowthRate={cargo.setFlowGrowthRate}
        setMaxDemand={cargo.setFlowMaxDemand}
        setIsActive={cargo.setFlowActive}
        onSave={cargo.handleSaveFlow}
      />


      <DemandProjectionModal
        flow={cargo.selectedFlowForProjection}
        projection={cargo.projectionResult}
        loading={cargo.calculatingProjection}
        onClose={() => cargo.setSelectedFlowForProjection(null)}
      />

      <ConversionRuleModal
        isOpen={cargo.isRuleModalOpen}
        editingRule={cargo.editingRule}
        commodityId={cargo.ruleCommodityId}
        sourceUnit={cargo.ruleSourceUnit}
        targetUnit={cargo.ruleTargetUnit}
        conversionFactor={cargo.ruleConversionFactor}
        description={cargo.ruleDescription}
        isActive={cargo.ruleIsActive}
        error={cargo.ruleError}
        saving={cargo.ruleSaving}
        commodities={cargo.commodities}
        onClose={() => cargo.setIsRuleModalOpen(false)}
        setCommodityId={cargo.setRuleCommodityId}
        setSourceUnit={cargo.setRuleSourceUnit}
        setTargetUnit={cargo.setRuleTargetUnit}
        setConversionFactor={cargo.setRuleConversionFactor}
        setDescription={cargo.setRuleDescription}
        setIsActive={cargo.setRuleIsActive}
        onSave={cargo.handleSaveRule}
      />
    </div>
  );
};
