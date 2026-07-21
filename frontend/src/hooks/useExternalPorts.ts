"use client";

import { useState, useEffect, useCallback } from "react";

import { ExternalPort, ExternalPortCreate, ExternalPortUpdate } from "@/types/externalPort";
import { externalPortService } from "@/services/externalPort.service";

export function useExternalPorts() {
  const [ports, setPorts] = useState<ExternalPort[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterActiveOnly, setFilterActiveOnly] = useState<boolean>(false);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPort, setEditingPort] = useState<ExternalPort | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("0");
  const [longitude, setLongitude] = useState<string>("0");
  const [maxDraft, setMaxDraft] = useState<string>("12");
  const [maxLoa, setMaxLoa] = useState<string>("250");
  const [cargoProductivity, setCargoProductivity] = useState<string>("100");
  const [productivityUnit, setProductivityUnit] = useState<string>("ton/hour");
  const [additionalPortTime, setAdditionalPortTime] = useState<string>("4");
  const [description, setDescription] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const fetchPorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await externalPortService.getAll(filterActiveOnly);
      setPorts(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data Pelabuhan Eksternal.");
    } finally {
      setLoading(false);
    }
  }, [filterActiveOnly]);

  useEffect(() => {
    fetchPorts();
  }, [fetchPorts]);

  const openCreateModal = () => {
    setEditingPort(null);
    setName("");
    setCountry("");
    setLatitude("0");
    setLongitude("0");
    setMaxDraft("12");
    setMaxLoa("250");
    setCargoProductivity("100");
    setProductivityUnit("ton/hour");
    setAdditionalPortTime("4");
    setDescription("");
    setIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (port: ExternalPort) => {
    setEditingPort(port);
    setName(port.name);
    setCountry(port.country);
    setLatitude(port.latitude.toString());
    setLongitude(port.longitude.toString());
    setMaxDraft(port.max_draft.toString());
    setMaxLoa(port.max_loa.toString());
    setCargoProductivity(port.cargo_productivity.toString());
    setProductivityUnit(port.productivity_unit);
    setAdditionalPortTime(port.additional_port_time.toString());
    setDescription(port.description || "");
    setIsActive(port.is_active);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    try {
      if (editingPort) {
        const payload: ExternalPortUpdate = {
          name: name.trim(),
          country: country.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          max_draft: parseFloat(maxDraft),
          max_loa: parseFloat(maxLoa),
          cargo_productivity: parseFloat(cargoProductivity),
          productivity_unit: productivityUnit.trim(),
          additional_port_time: parseFloat(additionalPortTime),
          description: description.trim() || undefined,
          is_active: isActive,
        };
        await externalPortService.update(editingPort.id, payload);
        triggerToast("Pelabuhan Eksternal berhasil diperbarui!");
      } else {
        const payload: ExternalPortCreate = {
          name: name.trim(),
          country: country.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          max_draft: parseFloat(maxDraft),
          max_loa: parseFloat(maxLoa),
          cargo_productivity: parseFloat(cargoProductivity),
          productivity_unit: productivityUnit.trim(),
          additional_port_time: parseFloat(additionalPortTime),
          description: description.trim() || undefined,
          is_active: isActive,
        };
        await externalPortService.create(payload);
        triggerToast("Pelabuhan Eksternal baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      await fetchPorts();
    } catch (err: any) {
      setModalError(err.message || "Gagal menyimpan Pelabuhan Eksternal.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Pelabuhan Eksternal ini?")) return;
    try {
      await externalPortService.delete(id);
      triggerToast("Pelabuhan Eksternal berhasil dihapus.");
      await fetchPorts();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus Pelabuhan Eksternal.");
    }
  };

  const filteredPorts = ports.filter((port) => {
    const q = searchQuery.toLowerCase();
    return (
      port.name.toLowerCase().includes(q) ||
      port.country.toLowerCase().includes(q) ||
      (port.description && port.description.toLowerCase().includes(q))
    );
  });

  return {
    ports: filteredPorts,
    rawPorts: ports,
    loading,
    error,
    toastMessage,
    searchQuery,
    filterActiveOnly,
    isModalOpen,
    editingPort,
    saving,
    modalError,
    name,
    country,
    latitude,
    longitude,
    maxDraft,
    maxLoa,
    cargoProductivity,
    productivityUnit,
    additionalPortTime,
    description,
    isActive,
    setSearchQuery,
    setFilterActiveOnly,
    setIsModalOpen,
    setName,
    setCountry,
    setLatitude,
    setLongitude,
    setMaxDraft,
    setMaxLoa,
    setCargoProductivity,
    setProductivityUnit,
    setAdditionalPortTime,
    setDescription,
    setIsActive,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    refreshData: fetchPorts,
  };
}
