
import { pubchemHttpClient } from './httpClient';
import { PubChemCompound } from './types';

export class CompoundService {
  async searchCompound(name: string): Promise<PubChemCompound | null> {
    try {
      // Sanitize input
      const sanitizedName = this.sanitizeName(name);
      
      // First, get the CID (Compound ID)
      const cidResponse = await pubchemHttpClient.fetchWithTimeout(
        `${pubchemHttpClient.getBaseURL()}/compound/name/${encodeURIComponent(sanitizedName)}/cids/JSON`
      );
      
      if (!cidResponse.IdentifierList?.CID?.length) {
        console.warn(`No PubChem compound found for: ${name}`);
        return null;
      }

      const cid = cidResponse.IdentifierList.CID[0];
      
      // Get compound properties
      const properties = await this.getCompoundProperties(cid);
      
      return {
        CID: cid,
        Title: sanitizedName,
        ...properties
      };
    } catch (error) {
      console.error('PubChem compound search failed:', error);
      return null;
    }
  }

  async getSynonyms(cid: number): Promise<string[]> {
    try {
      const response = await pubchemHttpClient.fetchWithTimeout(
        `${pubchemHttpClient.getBaseURL()}/compound/cid/${cid}/synonyms/JSON`
      );

      return response.InformationList?.Information?.[0]?.Synonym || [];
    } catch (error) {
      console.error('Failed to get synonyms:', error);
      return [];
    }
  }

  private sanitizeName(name: string): string {
    return name
      .trim()
      .replace(/[^\w\s\-\(\)]/g, '')
      .substring(0, 100);
  }

  private async getCompoundProperties(cid: number): Promise<Partial<PubChemCompound>> {
    try {
      const response = await pubchemHttpClient.fetchWithTimeout(
        `${pubchemHttpClient.getBaseURL()}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );

      const props = response.PropertyTable?.Properties?.[0] || {};
      
      return {
        MolecularFormula: props.MolecularFormula,
        MolecularWeight: props.MolecularWeight,
        IUPACName: props.IUPACName
      };
    } catch (error) {
      console.error('Failed to get compound properties:', error);
      return {};
    }
  }
}

export const compoundService = new CompoundService();
