import { ApiVersion } from '../utils/api-version';
import { isValidEnum, createErrorMessage } from '../utils/validators';
import { DataFormat } from '../data/data-format';
import type { DataFormatValue } from '../data/data-format';
import { MetadataFormat } from '../metadata/metadata-format';
import type { MetadataFormatValue } from '../metadata/metadata-format';
import { SchemaFormat } from '../schema/schema-format';
import type { SchemaFormatValue } from '../schema/schema-format';

export interface ServiceInfo {
  api: string;
  url: string;
}

export interface ServiceValue extends ServiceInfo {
  id?: string;
  name?: string;
  format?: DataFormatValue;
  structureFormat?: MetadataFormatValue;
  schemaFormat?: SchemaFormatValue;
}

export interface ServiceInput {
  id?: string;
  name?: string;
  url?: string;
  api?: string;
  format?: DataFormatValue;
  structureFormat?: MetadataFormatValue;
  schemaFormat?: SchemaFormatValue;
}

const defaults: Pick<ServiceValue, 'api'> = {
  api: ApiVersion.LATEST,
};

const isValidUrl = (url: string, errors: string[]): boolean => {
  const valid = !!url;
  if (!valid) {
    errors.push(`${url} is not in a valid url`);
  }
  return valid;
};

const isValidService = (
  q: ServiceValue,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const isValid =
    isValidUrl(q.url, errors) &&
    isValidEnum(q.api, ApiVersion, 'versions of the SDMX RESTful API', errors);
  return { isValid, errors };
};

const createSecureInstance = (service: ServiceValue): ServiceValue => {
  const secure: ServiceValue = { ...service };
  secure.url = secure.url.replace('http', 'https');
  return secure;
};

class Service {
  static BIS = {
    id: 'BIS',
    name: 'Bank for International Settlements',
    api: ApiVersion.v1_4_0,
    url: 'https://stats.bis.org/api/v1',
    format: DataFormat.SDMX_JSON_1_0_0,
    structureFormat: MetadataFormat.SDMX_JSON_1_0_0,
    schemaFormat: SchemaFormat.XML_SCHEMA,
  };

  static ECB = {
    id: 'ECB',
    name: 'European Central Bank',
    api: ApiVersion.v1_0_2,
    url: 'http://sdw-wsrest.ecb.europa.eu/service',
    format: DataFormat.SDMX_JSON_1_0_0_WD,
    structureFormat: MetadataFormat.SDMX_ML_2_1_STRUCTURE,
    schemaFormat: SchemaFormat.XML_SCHEMA,
  };

  static UNICEF = {
    id: 'UNICEF',
    name: 'UNICEF',
    api: ApiVersion.v1_4_0,
    url: 'https://sdmx.data.unicef.org/ws/public/sdmxapi/rest',
    format: DataFormat.SDMX_JSON_1_0_0,
    structureFormat: MetadataFormat.SDMX_JSON_1_0_0,
  };

  static SDMXGR = {
    id: 'SDMXGR',
    name: 'SDMX Global Registry',
    api: ApiVersion.v2_0_0,
    url: 'https://registry.sdmx.org/sdmx/v2',
    structureFormat: MetadataFormat.SDMX_JSON_2_0_0,
  };

  static EUROSTAT = {
    id: 'EUROSTAT',
    name: 'Eurostat',
    api: ApiVersion.v1_0_2,
    url: 'http://www.ec.europa.eu/eurostat/SDMX/diss-web/rest',
  };

  static OECD = {
    id: 'OECD',
    name: 'Organisation for Economic Co-operation and Development',
    api: ApiVersion.v1_0_2,
    url: 'http://stats.oecd.org/SDMX-JSON',
  };

  static WB = {
    id: 'WB',
    name: 'World Bank',
    api: ApiVersion.v1_0_2,
    url: 'http://wits.worldbank.org/API/V1/SDMX/V21/rest',
  };

  static ECB_S = createSecureInstance(Service.ECB);

  static SDMXGR_S = createSecureInstance(Service.SDMXGR);

  static OECD_S = createSecureInstance(Service.OECD);

  static from(opts?: ServiceInput | null): ServiceValue {
    const service: ServiceValue = {
      id: opts?.id,
      name: opts?.name,
      url: opts?.url ?? '',
      api: opts?.api ?? defaults.api,
      format: opts?.format,
      structureFormat: opts?.structureFormat,
      schemaFormat: opts?.schemaFormat,
    };
    const input = isValidService(service);
    if (!input.isValid) {
      throw Error(createErrorMessage(input.errors, 'service'));
    }
    return service;
  }
}

const services = [
  Service.BIS,
  Service.ECB_S,
  Service.EUROSTAT,
  Service.OECD_S,
  Service.SDMXGR_S,
  Service.UNICEF,
  Service.WB,
];

export { Service, services };
