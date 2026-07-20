import { apiFetch } from "./api";
import { CargoConversionRule, ConversionTestResult } from "@/types/cargo";

export const conversionService = {
  async getRules(): Promise<CargoConversionRule[]> {
    return apiFetch<CargoConversionRule[]>("/conversion-rules");
  },

  async createRule(data: {
    commodity_id?: string | null;
    source_unit: string;
    target_unit: string;
    conversion_factor: number;
    description?: string | null;
    is_active?: boolean;
  }): Promise<CargoConversionRule> {
    return apiFetch<CargoConversionRule>("/conversion-rules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateRule(
    id: string,
    data: {
      commodity_id?: string | null;
      source_unit?: string;
      target_unit?: string;
      conversion_factor?: number;
      description?: string | null;
      is_active?: boolean;
    }
  ): Promise<CargoConversionRule> {
    return apiFetch<CargoConversionRule>(`/conversion-rules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteRule(id: string): Promise<void> {
    return apiFetch<void>(`/conversion-rules/${id}`, {
      method: "DELETE",
    });
  },

  async runTest(data: {
    source_value: number;
    source_unit: string;
    target_unit: string;
    commodity_id?: string | null;
  }): Promise<ConversionTestResult> {
    return apiFetch<ConversionTestResult>("/cargo-conversions/convert", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
