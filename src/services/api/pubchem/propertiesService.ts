
import { pubchemHttpClient } from './httpClient';
import { PhysicalProperties } from './types';

export class PropertiesService {
  async getPhysicalProperties(cid: number): Promise<PhysicalProperties> {
    try {
      // Get multiple properties in one call
      const response = await pubchemHttpClient.fetchWithTimeout(
        `${pubchemHttpClient.getBaseURL()}/compound/cid/${cid}/property/MolecularWeight,IUPACName,CanonicalSMILES,XLogP,TPSA/JSON`
      );

      const props = response.PropertyTable?.Properties?.[0] || {};
      
      // Get additional descriptive data
      const description = await this.getCompoundDescription(cid);
      
      return {
        molecularWeight: props.MolecularWeight,
        physicalForm: this.inferPhysicalForm(props, description),
        solubility: this.inferSolubility(props.XLogP),
        additionalProperties: {
          logP: props.XLogP,
          polarSurfaceArea: props.TPSA,
          smiles: props.CanonicalSMILES
        }
      };
    } catch (error) {
      console.error('Failed to get physical properties:', error);
      return {
        physicalForm: 'powder', // Conservative default
        solubility: 'unknown'
      };
    }
  }

  private async getCompoundDescription(cid: number): Promise<string> {
    try {
      const response = await pubchemHttpClient.fetchWithTimeout(
        `${pubchemHttpClient.getBaseURL()}/compound/cid/${cid}/description/JSON`
      );
      
      return response.InformationList?.Information?.[0]?.Description || '';
    } catch {
      return '';
    }
  }

  private inferPhysicalForm(properties: any, description: string): 'powder' | 'liquid' | 'solid' | 'gas' {
    const desc = description.toLowerCase();
    
    if (desc.includes('powder') || desc.includes('crystalline')) {
      return 'powder';
    }
    if (desc.includes('liquid') || desc.includes('solution')) {
      return 'liquid';
    }
    if (desc.includes('gas') || desc.includes('vapor')) {
      return 'gas';
    }
    
    // Default to powder for pharmaceutical compounds (conservative)
    return 'powder';
  }

  private inferSolubility(logP?: number): string {
    if (logP === undefined) {
      return 'unknown';
    }
    
    if (logP < -1) {
      return 'highly water soluble';
    } else if (logP < 1) {
      return 'water soluble';
    } else if (logP < 3) {
      return 'moderately soluble';
    } else {
      return 'poorly water soluble';
    }
  }
}

export const propertiesService = new PropertiesService();
